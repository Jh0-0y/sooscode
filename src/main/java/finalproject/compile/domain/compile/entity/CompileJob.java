package finalproject.compile.domain.compile.entity;

import lombok.Getter;

/**
 * 컴파일 Job 엔티티 (Domain Entity)
 * - 컴파일 요청을 표현
 * - 소스코드
 * - 실행 결과
 * - 도메인의 상태와 규칙을 코드로 표현
 * - 실제 테이블 생성을 위함이 아닌 데이터 구조를 정의
 * - 상태(PENDING, SUCCESS, FAIL)
 */
@Getter
public class CompileJob {

    private final String jobId;
    private final String code;
    private CompileJobStatus status;
    private String output;

    public CompileJob(String jobId, String code) {
        this.jobId = jobId;
        this.code = code;
        this.status = CompileJobStatus.PENDING;
    }

    /** 결과 저장 로직 */
    public void complete(boolean success, String output) {
        this.status = success ? CompileJobStatus.SUCCESS : CompileJobStatus.FAIL;
        this.output = output;
    }
}
