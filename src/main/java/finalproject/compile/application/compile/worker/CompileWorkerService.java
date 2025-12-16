package finalproject.compile.application.compile.worker;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.service.CompileJobService;
import finalproject.compile.global.util.CmdUtils;
import finalproject.compile.infra.client.CallbackClient;
import finalproject.compile.infra.file.FileUtil;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 컴파일 워커 서비스 클래스.
 * <p>
 * Docker 컨테이너를 관리하고, 실제 소스 코드를 컴파일 및 실행하는 핵심 로직을 담당
 * 매번 컨테이너를 생성하지 않고, 미리 생성된 컨테이너를 재사용(Pool)하여 성능 최적화
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompileWorkerService {

    private final FileUtil fileUtil;
    private final CompileJobService jobService;
    private final CallbackClient callbackClient;

    // 생성할 컨테이너의 이름 접두사
    private static final String CONTAINER_PREFIX = "compile-executor-";

    // 사용할 Docker 이미지 (Java 17 환경)
    private static final String DOCKER_IMAGE = "eclipse-temurin:17-jdk";

    //  워커 개수 설정
    @Value("${compile.worker.count:2}")
    private int workerCount;

    // 컨테이너를 몇 번 사용하고 폐기할지 설정
    @Value("${compile.container.max-usage:100}")
    private int maxContainerUsage;

    // 각 컨테이너가 현재 몇 번 사용되었는지 추적하기 위한 카운터 배열
    // AtomicInteger를 사용하여 멀티스레드 환경에서도 안전하게 숫자를 셉니다.
    private AtomicInteger[] usageCounts;

    // 보안을 위해 코드에 포함되면 안 되는 금지어 목록
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
     * 서버 시작 시 호출되어 컨테이너 풀(Pool)을 초기화
     * 워커 수만큼 컨테이너를 미리 생성하여 대기 상태
     */
    @PostConstruct
    public void initContainers() {
        log.info("Initializing Container Pool. Count: {}, MaxUsage: {}", workerCount, maxContainerUsage);

        usageCounts = new AtomicInteger[workerCount];

        for (int i = 0; i < workerCount; i++) {
            usageCounts[i] = new AtomicInteger(0);
            createContainer(i);
        }
    }

    /**
     * 지정된 ID를 가진 Docker 컨테이너를 생성
     * 이미 존재하는 경우 삭제하고 새로 생성
     *
     * @param workerId 워커의 고유 번호
     */
    private void createContainer(int workerId) {
        String containerName = CONTAINER_PREFIX + workerId;
        try {
            //  기존에 남아있을 수 있는 컨테이너를 강제로 삭제
            CmdUtils.runCommand("docker rm -f " + containerName, 5000);

            //  새로운 컨테이너를 실행
            // -d: 백그라운드 실행
            // --network none: 인터넷 차단 (보안)
            // --memory 512m: 메모리 사용량 제한 (서버 다운 방지)
            // tail -f /dev/null: 컨테이너가 종료되지 않고 계속 살아있게 함
            String runCmd = String.format(
                    "docker run -d --name %s " +
                            "--network none " +
                            "--pids-limit 100 " +
                            "--cap-drop ALL " +
                            "--memory 512m " +
                            "--cpus 0.8 " +
                            "-v %s:/app " +
                            "%s " +
                            "tail -f /dev/null",
                    containerName, fileUtil.getBasePath(), DOCKER_IMAGE
            );

            CmdUtils.ExecutionResult result = CmdUtils.runCommand(runCmd, 10000);

            if (result.success()) {
                log.info("Container [{}] created/reset successfully.", containerName);

                // 컨테이너가 새로 생성 사용 횟수를 0으로 초기화
                if (usageCounts != null && usageCounts.length > workerId) {
                    usageCounts[workerId].set(0);
                }
            } else {
                throw new RuntimeException("Container Init Failed: " + result.output());
            }
        } catch (Exception e) {
            log.error("Critical error while creating container [{}]", containerName, e);
            throw new RuntimeException(e);
        }
    }

    /**
     * 서버가 종료될 때 호출되어 실행 중인 컨테이너들을 정리
     */
    @PreDestroy
    public void cleanupContainers() {
        if (workerCount == 0) return;
        for (int i = 0; i < workerCount; i++) {
            CmdUtils.runCommand("docker rm -f " + CONTAINER_PREFIX + i, 5000);
        }
        log.info("All containers cleaned up.");
    }

    /**
     * 실제 컴파일과 실행 요청을 처리하는 메서드
     * 시스템 오류 발생 시 1회 재시도 로직이 포함
     *
     * @param job      처리할 컴파일 작업
     * @param workerId 작업을 수행할 워커 ID (컨테이너 매핑용)
     */
    public void execute(CompileJob job, int workerId) {
        String containerName = CONTAINER_PREFIX + workerId;
        // 시스템 에러 시 재시도 횟수
        int maxRetries = 1;

        try {
            // [중요] 재시도 루프 시작
            for (int attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    // 컨테이너 수명 관리
                    // 사용 횟수가 한계치를 넘었으면 컨테이너 재생성 오염 방지
                    if (usageCounts[workerId].get() >= maxContainerUsage) {
                        log.info("Container [{}] usage limit exceeded. Recreating...", containerName);
                        createContainer(workerId);
                    }

                    //  실제 비즈니스 로직(파일 생성 -> 컴파일 -> 실행)을 수행
                    runCompileAndExecution(job, containerName);

                    // 성공적으로 완료 메서드를 종료
                    return;

                } catch (SecurityException se) {
                    // 보안 위반 (사용자 과실)
                    // 이 경우는 시스템 에러 x 재시도하지 않고 정상 종료 처리
                    log.warn("Security violation: jobId={}, msg={}", job.getJobId(), se.getMessage());
                    handleResult(job, false, "Security Error: " + se.getMessage());
                    return;

                } catch (Exception e) {
                    // 시스템 에러 (Docker 통신 실패 등)
                    log.error("[Worker-{}] System error (Attempt {}/{}). JobId={}",
                            workerId, attempt + 1, maxRetries + 1, job.getJobId(), e);

                    // 마지막 시도였다면 예외
                    if (attempt == maxRetries) {
                        throw new RuntimeException("Max retries exceeded", e);
                    }

                    // 재시도하기 전에 컨테이너를 재생성하여 복구 시도
                    log.info("Attempting system recovery: Recreating container [{}]", containerName);
                    createContainer(workerId);

                } finally {
                    // 성공, 실패, 에러 여부와 관계없이 컨테이너 사용 시도가 있었으므로 카운트를 증가
                    usageCounts[workerId].incrementAndGet();
                }
            }
        } finally {
            //모든 재시도 로직이 끝난 후, 호스트에 생성된 임시 파일들을 반드시 삭제
            fileUtil.deleteFolder(job.getJobId());
        }
    }

    /**
     * 파일 생성, 컴파일, 실행 명령을 순차적으로 수행하는 내부 메서드
     */
    private void runCompileAndExecution(CompileJob job, String containerName) {
        log.info("Executing JobId={}", job.getJobId());

        // 코드에 금지어가 있는지 검사
        validateCode(job.getCode());

        try {
            // 호스트 경로에 Main.java 파일을 생성
            fileUtil.createJavaFile(job.getJobId(), "Main.java", job.getCode());
        } catch (IOException e) {
            throw new RuntimeException("File Creation Failed", e);
        }

        //  컴파일 명령 실행 (javac)
        String compileCmd = String.format(
                "docker exec -w /app/%s %s javac -encoding UTF-8 Main.java",
                job.getJobId(), containerName
        );
        CmdUtils.ExecutionResult compileResult = CmdUtils.runCommand(compileCmd, 10000);

        // 컴파일 실패 시 (문법 오류 등)
        if (!compileResult.success()) {
            handleResult(job, false, compileResult.output());
            return;
        }

        //  코드 실행 명령 (java)
        String runCmd = String.format(
                "docker exec -w /app/%s %s java -Dfile.encoding=UTF-8 Main",
                job.getJobId(), containerName
        );
        CmdUtils.ExecutionResult runResult = CmdUtils.runCommand(runCmd, 5000);

        // 실행 결과를 처리
        handleResult(job, runResult.success(), runResult.output());
    }

    /**
     * 실행 결과를 저장, 메인 서버로 콜백
     */
    private void handleResult(CompileJob job, boolean success, String output) {
        job.complete(success, output);
        // Redis 저장소에 결과를 업데이트합니다.
        jobService.completeJob(job.getJobId(), success, output);
        // API 서버(백엔드)로 결과를 전송합니다.
        callbackClient.sendResultCallback(job);
    }

    /**
     * 코드 보안 위험한 키워드 포함 검사
     */
    private void validateCode(String code) {
        for (String keyword : BLACKLIST) {
            if (code.contains(keyword)) {
                throw new SecurityException("Forbidden keyword detected: " + keyword);
            }
        }
    }
    /**
     * 현재 설정된 워커 개수 반환 (리스너에서 사용)
     */
    public int getWorkerCount() {
        return workerCount;
    }
}