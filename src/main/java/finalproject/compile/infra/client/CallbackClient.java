package finalproject.compile.infra.client;

import finalproject.compile.domain.compile.entity.CompileJob;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Job 완료 후 백엔드 서버에 결과를 푸시(POST)하는 클라이언트
 * - Webhook (역방향 REST) 통신을 담당
 */
@Slf4j
@Component
public class CallbackClient {

    private final RestTemplate restTemplate;

    public CallbackClient() {
        this.restTemplate = createRestTemplate();
    }

    /**
     * 컴파일 작업 완료 후 백엔드 서버의 콜백 URL로 결과를 POST 요청으로 푸시
     */
    public void sendResultCallback(CompileJob job) {

        String callbackUrl = job.getCallbackUrl();

        if (callbackUrl == null || callbackUrl.isBlank()) {
            log.warn("[Callback] 콜백 URL이 지정되지 않아 콜백을 생략합니다. jobId={}", job.getJobId());
            return;
        }

        // 백엔드 서버가 기대하는 콜백 요청 DTO 형태
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("jobId", job.getJobId());
        requestBody.put("status", job.getStatus().name());
        requestBody.put("output", job.getOutput());

        try {
            // 워커가 백엔드의 콜백 주소로 결과를 POST 요청으로 전송
            ResponseEntity<String> response =
                    restTemplate.postForEntity(callbackUrl, requestBody, String.class);

            log.info(
                    "[Callback] 전송 성공 jobId={}, URL={}, Status={}",
                    job.getJobId(),
                    callbackUrl,
                    response.getStatusCode()
            );

        } catch (Exception e) {
            log.error("[Callback] 전송 실패 jobId={}, URL={}, Error={}", job.getJobId(), callbackUrl, e.getMessage());
        }
    }

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);
        factory.setReadTimeout(30000);
        return new RestTemplate(factory);
    }
}