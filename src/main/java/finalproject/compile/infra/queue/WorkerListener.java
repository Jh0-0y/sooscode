package finalproject.compile.infra.queue;

import finalproject.compile.application.compile.worker.CompileWorkerService;
import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.entity.CompileJobStatus;
import finalproject.compile.domain.compile.repo.CompileJobRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 워커 리스너 클래스.
 * <p>
 * 컴파일 작업(Job)이 들어오면
 * 이를 꺼내어 실제 처리를 담당하는 서비스(CompileWorkerService)로 전달
 * </p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WorkerListener {

    private final LocalJobQueue localJobQueue;
    private final CompileWorkerService workerService;
    private final CompileJobRepository jobRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 시스템 장애로 인해 처리에 실패한 작업을 보관하는 Redis 키(Dead Letter Queue).
     */
    private static final String DLQ_KEY = "compile_job_dlq";

    /**
     * 서버가 시작될 때 자동으로 실행되는 메서드입니다.
     * 설정된 워커 개수만큼 스레드를 생성하여 작업을 병렬로 처리할 준비
     */
    @PostConstruct
    public void start() {
        // 서비스에서 설정된 워커(스레드) 개수를 가져옵니다.
        int workerCount = workerService.getWorkerCount();
        log.info("[Worker] Worker Listener started. Thread count: {}", workerCount);

        for (int i = 0; i < workerCount; i++) {
            final int workerId = i;

            Thread workerThread = new Thread(() -> processQueue(workerId));

            workerThread.setName("compile-worker-" + i);

            workerThread.setDaemon(false);

            workerThread.start();
        }
    }

    /**
     * 각 워커 스레드가 실행하는 무한 루프 메서드
     * 큐에서 작업을 꺼내고, 실행하고, 결과를 처리하는 전체 흐름을 담당
     *
     */
    private void processQueue(int workerId) {
        while (true) {
            CompileJob job = null;
            try {
                job = localJobQueue.take();

                if (job == null) continue;

                log.info("[Worker-{}] Job received: {}", workerId, job.getJobId());

                //  작업 상태를 RUNNING 으로 변경 저장소에 업데이트
                job.setStatus(CompileJobStatus.RUNNING);
                jobRepository.save(job);

                // 실제 컴파일 및 실행 로직을 호출
                // workerId를 함께 넘겨주어, 해당 워커 전용 컨테이너를 사용
                workerService.execute(job, workerId);

            } catch (Exception e) {
                //  예외 발생 처리
                // 내부 재시도 로직까지 실패했을 때
                handleSystemFailure(job, e);

            } finally {
                //  작업이 성공했든 실패해서 DLQ로 갔든,
                // 현재 처리 중인 큐 작업 확실히 제거
                if (job != null) {
                    localJobQueue.ack(job);
                }
            }
        }
    }

    /**
     * 시스템 장애 처리를 위한 메서드 (Dead Letter Queue 처리).

     * 재시도 후에도 실패한 작업은 영구 유실을 방지하기 위해 별도의 보관소(DLQ)에 저장
     * 전체 객체 대신 필요한 핵심 정보만 추려서 가볍게 저장
     */
    private void handleSystemFailure(CompileJob job, Exception e) {
        if (job == null) return;

        log.error("[Worker] System Failure. Moving to DLQ. JobID={}", job.getJobId());

        // Redis에 실패  에러 메시지를 업데이트
        // 사용자가 조회 실패 원인
        job.setStatus(CompileJobStatus.FAIL);
        job.setOutput("System Error: " + e.getMessage());
        jobRepository.save(job);

        //  DLQ 저장
        try {
            Map<String, Object> dlqPayload = new HashMap<>();
            dlqPayload.put("jobId", job.getJobId());
            dlqPayload.put("error", e.getMessage());
            dlqPayload.put("failTime", LocalDateTime.now().toString());

            redisTemplate.opsForList().rightPush(DLQ_KEY, dlqPayload);
        } catch (Exception redisEx) {
            // Redis 자체가 죽었을 경우
            log.error("Failed to save to DLQ.", redisEx);
        }
    }
}