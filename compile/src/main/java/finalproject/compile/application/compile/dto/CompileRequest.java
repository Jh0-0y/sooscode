package finalproject.compile.application.compile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompileRequest {

    @NotBlank(message = "코드는 비어있을 수 없습니다.")
    @Size(max = 10000, message = "코드 길이는 10,000자를 초과할 수 없습니다.")
    private String code;

    /**
     * request dto  결과를 전달할 백엔드 서버의 callback url
     * */
    @NotBlank(message = "콜백 URL은 필수입니다.")
    private String callbackUrl;

    /**
     * 백엔드에서 생성한 jobid 받아와서 그 jobid 기반 으로 job 생성
     * */
    @NotBlank(message = "Job ID는 필수입니다.")
    private String jobId;
}
