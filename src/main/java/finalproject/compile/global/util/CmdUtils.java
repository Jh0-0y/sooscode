package finalproject.compile.global.util;

import lombok.extern.slf4j.Slf4j;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.util.concurrent.TimeUnit;

/**
 * OS 명령어(javac/java)를 실행하는 유틸 클래스
 * - Windows / Linux 모두 호환
 * - 타임아웃 적용하여 무한 대기 방지
 * - 출력 제한(MAX_OUTPUT_LINES)으로 무한 출력 공격 차단
 * - 표준 출력 + 표준 에러를 단일 스트림으로 통합
 */
@Slf4j
public class CmdUtils {

    // 출력 라인 수 제한 (무한 대기 + 메모리 폭주 방지)
    private static final int MAX_OUTPUT_LINES = 100;

    /**
     * 외부 명령어(javac/java) 실행 메서드
     * 1) OS 감지 후 명령어 실행 방식 분기
     * 2) 타임아웃을 통해 무한 대기 방지
     * 3) 출력 스트림(UTF-8/MS949) 안전하게 읽기
     * 4) 출력 100줄 제한
     * 5) 프로세스 종료 및 결과 반환
     */
    public static ExecutionResult runCommand(String command, long timeoutMillis) {

        StringBuilder output = new StringBuilder();  // 명령어 실행 출력 모음
        int exitCode = -1;                           // 프로세스 종료 코드 (0: 성공)
        Process process = null;                      // 외부 프로세스 핸들

        try {
            // --------------------------------------------------------
            // ① 현재 OS 확인 후 맞는 명령어 방식 선택 (Windows / Linux)
            // --------------------------------------------------------
            boolean isWindows = System.getProperty("os.name")
                    .toLowerCase()
                    .startsWith("windows");

            ProcessBuilder pb;

            // Windows는 cmd.exe /c 사용
            if (isWindows) {
                pb = new ProcessBuilder("cmd.exe", "/c", command);
            } else {
                // Linux/macOS는 sh -c 사용
                pb = new ProcessBuilder("sh", "-c", command);
            }

            pb.redirectErrorStream(true); // 표준 에러 통합 (stderr → stdout)
            process = pb.start();         // 프로세스 실행

            // --------------------------------------------------------
            // ② 타임아웃 적용하여 무한루프 방지
            // --------------------------------------------------------
            boolean finished = process.waitFor(timeoutMillis, TimeUnit.MILLISECONDS);

            if (!finished) {
                // 프로세스 강제 종료
                process.destroyForcibly();
                return new ExecutionResult(
                        false,
                        "TIMEOUT: 실행 시간이 초과되었습니다. (5초)",
                        -1
                );
            }

            // --------------------------------------------------------
            // ③ 출력 스트림 읽기 (OS 별 한글 인코딩 처리)
            // --------------------------------------------------------
            String charsetName = isWindows ? "MS949" : "UTF-8";

            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream(), Charset.forName(charsetName)))) {

                String line;
                int lineCount = 0;

                // --------------------------------------------------------
                // ④ MAX_OUTPUT_LINES 제한 → 무한 출력 방지
                // --------------------------------------------------------
                while ((line = reader.readLine()) != null) {
                    if (lineCount >= MAX_OUTPUT_LINES) {
                        output.append("\n... (출력이 너무 많아 중단되었습니다) ...");

                        // 프로세스가 아직 살아있다면 강제로 종료
                        if (process.isAlive()) process.destroyForcibly();
                        break;
                    }

                    output.append(line).append("\n");
                    lineCount++;
                }
            }

            // --------------------------------------------------------
            // ⑤ 프로세스 종료 코드 (0 = 성공, 그 외 = 실패)
            // --------------------------------------------------------
            exitCode = process.exitValue();
            return new ExecutionResult(exitCode == 0, output.toString(), exitCode);

        } catch (Exception e) {
            // 예상치 못한 시스템 오류 발생 (프로세스 실행 실패 등)
            log.error("Cmd Execution Error: {}", e.getMessage());
            return new ExecutionResult(false, "System Error: " + e.getMessage(), -1);

        } finally {
            // --------------------------------------------------------
            // ⑥ 프로세스가 종료되지 않았다면 강제 종료 (자원 누수 방지)
            // --------------------------------------------------------
            if (process != null && process.isAlive()) {
                process.destroyForcibly();
            }
        }
    }

    /** 명령어 실행 결과를 담는 DTO(record) */
    public record ExecutionResult(boolean success, String output, int exitCode) { }
}
