package finalproject.compile.infra.queue;

import finalproject.compile.domain.compile.entity.CompileJob;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * 로컬 단일 서버 버전 큐 (향후 Redis로 교체 예정)
 */
@Component
public class LocalJobQueue {
    private final BlockingQueue<CompileJob> queue = new LinkedBlockingQueue<>();

    /** job push*/
    public void push(CompileJob job) {
        queue.add(job);
    }

    /** Job take (worker에서 사용 미리 구현)*/
    public CompileJob take() throws InterruptedException {
        return queue.take();
    }
}
