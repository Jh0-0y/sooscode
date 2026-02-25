package finalproject.compile.infra.client;

import finalproject.compile.domain.compile.entity.CompileJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CallbackClient {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RestTemplate restTemplate = createRestTemplate();

    private static final String RETRY_QUEUE = "compile:callback:retry";

    public void sendResultCallback(CompileJob job) {
        String callbackUrl = job.getCallbackUrl();

        if (callbackUrl == null || callbackUrl.isBlank()) return;

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("jobId", job.getJobId());
        requestBody.put("status", job.getStatus().name());
        requestBody.put("output", job.getOutput());

        try {
            restTemplate.postForEntity(callbackUrl, requestBody, String.class);
            log.info("[Callback] 전송 성공 jobId={}", job.getJobId());

        } catch (Exception e) {
            log.error("[Callback] 전송 실패 -> 재시도 큐 저장 jobId={}, Error={}", job.getJobId(), e.getMessage());

            // 실패 시 Redis 재시도 큐에 저장 (추후 별도 워커가 처리 가능)
            redisTemplate.opsForList().rightPush(RETRY_QUEUE, job);
        }
    }

    private RestTemplate createRestTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(30000);
        factory.setReadTimeout(30000);
        return new RestTemplate(factory);
    }
}