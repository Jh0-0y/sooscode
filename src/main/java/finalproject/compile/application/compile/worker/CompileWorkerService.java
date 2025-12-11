package finalproject.compile.application.compile.worker;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.service.CompileJobService;
import finalproject.compile.global.util.CmdUtils;
import finalproject.compile.infra.client.CallbackClient;
import finalproject.compile.infra.file.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompileWorkerService {

    private final FileUtil fileUtil;
    private final CompileJobService jobService;
    private final CallbackClient callbackClient;

    // 배포 환경에서 사용할 격리된 도커 이미지
//    private static final String DOCKER_IMAGE = "openjdk:17-alpine";
//    private static final String DOCKER_IMAGE = "eclipse-temurin:17-jdk-alpine";
    private static final String DOCKER_IMAGE = "eclipse-temurin:17-jdk";



    private static final String[] BLACKLIST = {
            "System.exit",
            "Runtime.getRuntime",
            "ProcessBuilder",
            "java.io.File",
            "java.nio.file",
            "java.net",
            "java.lang.reflect",
            "sun.misc.Unsafe",
            "Thread",
            "ForkJoinPool"
    };

    /**
     * 실제 컴파일 + 실행을 수행하는 핵심 메서드 (EC2 Docker 환경)
     * 1) Main.java 생성
     * 2) Docker 컨테이너 띄워서 javac 실행
     * 3) Docker 컨테이너 띄워서 java 실행 (샌드박스 격리)
     * 4) 성공/실패 여부 저장
     * 5) 작업 폴더 정리
     */
    public void execute(CompileJob job) {
        try {
            // Worker 어떤 jobId를 처리 로그
            log.info("[Worker] 컴파일 시작 jobId={}", job.getJobId());

            validateCode(job.getCode());

            // 컴파일에 사용할 파일 이름 지정
            String fileName = "Main.java";

            // /tmp/compiler/{jobId}/Main.java 파일 생성
            // - 디렉토리 생성
            // - 사용자가 보낸 코드 내용 기록
            fileUtil.createJavaFile(job.getJobId(), fileName, job.getCode());

            // 호스트(EC2)의 파일 경로 설정
            // - Docker Volume Mount를 위해 호스트 기준 경로 필요
            String hostPath = fileUtil.getBasePath() + "/" + job.getJobId();

            // 도커 기반 javac 컴파일 명령어 구성
            String compileCmd = String.format(
                    "docker run --rm " +
                            "-v %s:/app " +
                            "-w /app " +
                            "%s " +
                            "javac -encoding UTF-8 Main.java",
                    hostPath, DOCKER_IMAGE
            );

            // compileCmd 명령어 실행 (timeout 10000)
            CmdUtils.ExecutionResult compileResult = CmdUtils.runCommand(compileCmd, 10000);

            // 컴파일 실패 시 → 즉시 종료
            // - compileResult.success() == false → 문법 오류
            if (!compileResult.success()) {
                // Job 엔티티의 상태 변경 (job 객체 자체 갱신)
                job.complete(false, compileResult.output());

                // 변경된 상태를 Repository에 저장
                jobService.completeJob(job.getJobId(), false, compileResult.output());

                // 큐에서 가져온 유효한 job 객체를 사용하여 콜백 호출
                // jobService.getJob() 호출 제거
                callbackClient.sendResultCallback(job);

                return;
            }

            // 도커 기반 java 실행 명령어 구성
            String runCmd = String.format(
                    "docker run --rm " +
                            "--network none " +
                            "--memory 128m " +
                            "--memory-swap 128m " +
                            "--cpus 0.5 " +
                            "-v %s:/app " +
                            "-w /app " +
                            "%s " +
                            "java -Dfile.encoding=UTF-8 Main",
                    hostPath, DOCKER_IMAGE
            );

            // java 실행 (timeout 5000)
            CmdUtils.ExecutionResult runResult = CmdUtils.runCommand(runCmd, 5000);

            // 실행 성공 여부 + 출력 내용 저장 (Job 객체 자체 갱신)
            job.complete(runResult.success(), runResult.output());
            jobService.completeJob(job.getJobId(), runResult.success(), runResult.output());

            // 큐에서 가져온 유효한 job 객체를 사용하여 콜백 호출
            // jobService.getJob() 호출 제거
            callbackClient.sendResultCallback(job);

        } catch (SecurityException e) {
            // Security Error 처리
            job.complete(false, "Security Error: " + e.getMessage());
            jobService.completeJob(job.getJobId(), false, "Security Error: " + e.getMessage());
            callbackClient.sendResultCallback(job);

        } catch (IOException e) {
            throw new RuntimeException(e);
        } finally {
            // 컴파일/실행 끝난 뒤 해당 jobId 폴더 제거
            // 작업 디렉토리 정리
            fileUtil.deleteFolder(job.getJobId());
        }
    }

    private void validateCode(String code) {
        for (String keyword : BLACKLIST) {
            if (code.contains(keyword)) {
                throw new SecurityException("허용되지 않는 키워드가 포함되어 있습니다: " + keyword);
            }
        }
    }
}