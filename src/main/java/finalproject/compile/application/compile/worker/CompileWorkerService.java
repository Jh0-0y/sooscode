package finalproject.compile.application.compile.worker;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.service.CompileJobService;
import finalproject.compile.global.util.CmdUtils;
import finalproject.compile.infra.file.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompileWorkerService {

    private final FileUtil fileUtil;
    private final CompileJobService jobService;

    /**
     * 실제 컴파일 + 실행을 수행하는 핵심 메서드
     * 1) Main.java 생성
     * 2) javac 컴파일 실행
     * 3) java 실행
     * 4) 성공/실패 여부 저장
     * 5) 작업 폴더 정리
     */
    public void execute(CompileJob job) {
        try {
            //  Worker 어떤 jobId를 처리 로그
            log.info("[Worker] 컴파일 시작 jobId={}", job.getJobId());

            //  컴파일에 사용할 파일 이름 지정
            String fileName = "Main.java";

            //  /tmp/compiler/{jobId}/Main.java 파일 생성
            //    - 디렉토리 생성
            //    - 사용자가 보낸 코드 내용 기록
            fileUtil.createaJavaFile(job.getJobId(), fileName, job.getCode());

            //  javac 컴파일 명령어 구성
            //    - 생성된 Main.java 파일을 javac로 컴파일
            String compileCmd = "javac /tmp/compiler/" + job.getJobId() + "/Main.java";

            //  compileCmd 명령어 실행 (timeout 5000ms)
            //    - CmdUtils.runCommand() → 프로세스 실행 + stdout/stderr 캡처
            CmdUtils.ExecutionResult compileResult = CmdUtils.runCommand(compileCmd, 5000);

            //  컴파일 실패 시 → 즉시 종료
            //    - compileResult.success() == false → 문법 오류, 파일 없음 등
            if (!compileResult.success()) {
                // 실행 결과(에러 메시지 포함)를 job에 기록
                jobService.completeJob(job.getJobId(), false, compileResult.output());

                // 작업 디렉토리 정리
                fileUtil.deleteFolder(job.getJobId());
                return;
            }

            //  java 실행 명령어
            //    - 컴파일된 Main.class 를 실행
            //    - -cp 로 jobId 디렉토리를 classpath로 지정
            String runCmd = "java -cp /tmp/compiler/" + job.getJobId() + " Main";

            //  java 실행 (timeout 5000ms)
            CmdUtils.ExecutionResult runResult = CmdUtils.runCommand(runCmd, 5000);

            //  실행 성공 여부 + 출력 내용 저장
            jobService.completeJob(job.getJobId(), runResult.success(), runResult.output());

            //  컴파일/실행 끝난 뒤 해당 jobId 폴더 제거
            fileUtil.deleteFolder(job.getJobId());

        } catch (Exception e) {
            jobService.completeJob(job.getJobId(), false, e.getMessage());
        }
    }
}

