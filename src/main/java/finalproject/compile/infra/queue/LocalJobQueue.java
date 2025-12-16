package finalproject.compile.infra.queue;

import finalproject.compile.domain.compile.entity.CompileJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Slf4j
@Component
@RequiredArgsConstructor
public class LocalJobQueue {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String QUEUE_KEY = "compile_job_queue";
    private static final String PROCESSING_KEY = "compile_job_processing";
    private static final String LOCK_PREFIX = "job:lock:";

    /**
     * Job Push (중복 방지 적용)
     */
    public void push(CompileJob job) {
        // 1. Redis Lock으로 중복 Push 방지 (10분간 락)
        Boolean locked = redisTemplate.opsForValue()
                .setIfAbsent(LOCK_PREFIX + job.getJobId(), "1", 10, TimeUnit.MINUTES);

        if (Boolean.FALSE.equals(locked)) {
            log.warn("이미 큐에 등록된 작업입니다. jobId={}", job.getJobId());
            return;
        }
        // 2. 큐에 저장
        redisTemplate.opsForList().rightPush(QUEUE_KEY, job);
    }

    /**
     * Job Take
     * - 꺼내면서 동시에 processing 큐로 이동
     */
    public CompileJob take() {
        try {
            // rightPopAndLeftPush: QUEUE_KEY에서 꺼내서 PROCESSING_KEY에 넣고 반환
            // 10초 대기 (Blocking)
            Object job = redisTemplate.opsForList()
                    .rightPopAndLeftPush(QUEUE_KEY, PROCESSING_KEY, 10, TimeUnit.SECONDS);

            if (job instanceof CompileJob) {
                return (CompileJob) job;
            }
        } catch (Exception e) {
            log.error("Redis Queue Pop Error", e);
            try { Thread.sleep(1000); } catch (InterruptedException ig) {}
        }
        return null;
    }

    /**
     * 작업 완료 확인 (ACK)
     * - Processing 큐에서 작업 제거
     */
    public void ack(CompileJob job) {
        try {
            // processing 큐에서 해당 job 제거 (count 1: 앞에서부터 1개 삭제)
            redisTemplate.opsForList().remove(PROCESSING_KEY, 1, job);
            // 락 해제 (선택사항: 만료시간이 있어 안 해도 되지만, 빠른 재처리를 위해 해제 가능)
            redisTemplate.delete(LOCK_PREFIX + job.getJobId());
        } catch (Exception e) {
            log.error("ACK failed for jobId={}", job.getJobId(), e);
        }
    }
}