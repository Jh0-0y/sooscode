package finalproject.compile.infra.queue;

import finalproject.compile.application.compile.worker.CompileWorkerService;
import finalproject.compile.domain.compile.entity.CompileJob;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Worker 서버 리스너
 * - API 서버가 LocalJobQueue에 넣어둔 컴파일 작업을
 *   백그라운드 스레드(Worker Thread)가 꺼내서 처리한다.
 * - WORKER_COUNT 만큼의 Worker Thread를 생성하여 병렬 처리도 가능하게 구성됨.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WorkerListener {

    private final LocalJobQueue localJobQueue;        // 작업을 담아두는 Queue (blocking queue)
    private final CompileWorkerService workerService; // 실제 컴파일 실행 담당 서비스

    private static final int WORKER_COUNT = 2; // 동시에 병렬 컴파일을 수행할 스레드 수
    /**
     * Worker 스레드들을 초기화하는 메서드
     * 1) Bean 초기화 완료 후 @PostConstruct 실행
     * 2) WORKER_COUNT 만큼 스레드 생성
     * 3) 각 스레드는 Queue.take()로 작업을 기다림 (Blocking)
     * 4) 작업 도착 시 CompileWorkerService.execute()로 처리
     */
    @PostConstruct
    public void start() {

        //  워커 스레드 수 로깅 (현재는 2개)
        log.info("[Worker] 워커 리스너 시작됨 (스레드 {}개)", WORKER_COUNT);

        //  WORKER_COUNT 만큼 새로운 Worker Thread 생성
        for (int i = 0; i < WORKER_COUNT; i++) {
            // 스레드 내부 로직 정의
            Thread workerThread = new Thread(() -> {
                //  스레드는 계속 반복하며 새로운 Job을 기다림
                while (true) {
                    try {
                        //  Queue.take()
                        //    - 큐가 비어있으면 새로운 Job이 올 때까지 스레드 대기 (Blocking)
                        //    - Job이 도착하면 즉시 반환됨
                        CompileJob job = localJobQueue.take();

                        //  어떤 스레드가 어떤 Job을 가져갔는지 로깅
                        log.info(
                                "[Worker] 작업 수신 jobId={}, 처리스레드={}",
                                job.getJobId(),
                                Thread.currentThread().getName()
                        );

                        //  현재 스레드가 해당 Job을 실제로 실행함 (컴파일 + 실행)
                        workerService.execute(job);

                    } catch (InterruptedException e) {
                        //  스레드가 인터럽트된 경우 (서버 종료 등) → 스레드 종료 처리
                        Thread.currentThread().interrupt();
                        break;
                    }
                }

            });

            // 스레드 이름 설정 → 모니터링 시 구분하기 위함
            workerThread.setName("compile-worker-" + i);

            // 데몬 스레드 false → 메인 스레드 종료 후에도 워커 스레드가 유지됨
            workerThread.setDaemon(false);

            // 스레드 시작 → 이후 무한 루프 진입
            workerThread.start();
        }
    }
}
