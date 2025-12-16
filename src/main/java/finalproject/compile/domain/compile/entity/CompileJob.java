package finalproject.compile.domain.compile.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 컴파일 Job 엔티티
 * - Redis 저장을 위해 기본 생성자(@NoArgsConstructor) 추가
 * - 직렬화를 위해 @Setter, final 제거
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompileJob {

    private String jobId;
    private String code;
    private String callbackUrl;
    private CompileJobStatus status;
    private String output;

    // 초기 생성자
    public CompileJob(String jobId, String code , String callbackUrl) {
        this.jobId = jobId;
        this.code = code;
        this.callbackUrl = callbackUrl;
        this.status = CompileJobStatus.PENDING;
    }

    /** 결과 저장 로직 */
    public void complete(boolean success, String output) {
        this.status = success ? CompileJobStatus.SUCCESS : CompileJobStatus.FAIL;
        this.output = output;
    }
}