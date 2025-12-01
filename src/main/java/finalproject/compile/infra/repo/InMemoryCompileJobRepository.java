package finalproject.compile.infra.repo;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.repo.CompileJobRepository;
import org.springframework.stereotype.Repository;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 개발/로컬 테스트용 In-Memory Repository 구현체
 * - 실제 Redis 또는 DB 저장소의 대체품
 * - 동시성 안전성을 위해 ConcurrentHashMap 사용
 * - 단일 서버 운영에서는 빠르고 간단한 방식
 */
@Repository
public class InMemoryCompileJobRepository implements CompileJobRepository {

    // Thread-safe 저장소 (Worker 스레드 다중 접근 대비)
    private final Map<String, CompileJob> store = new ConcurrentHashMap<>();

    /**
     * Job 저장
     * 1) jobId 를 key로 저장소에 Job 객체 저장
     * 2) 이미 존재하면 덮어씀 (put)
     */
    @Override
    public void save(CompileJob job) {

        //  HashMap 이 아닌 ConcurrentHashMap 이므로 경쟁 없이 put 가능
        store.put(job.getJobId(), job);
    }

    /**
     * Job 조회
     * 1) jobId로 저장된 Job 반환
     * 2) 없으면 null
     */
    @Override
    public CompileJob findById(String jobId) {

        //  key(jobId)로 Job 조회
        return store.get(jobId);
    }

    /**
     * Job 결과 저장
     * 1) jobId에 해당하는 Job 조회
     * 2) 성공/실패 상태 반영
     * 3) 출력(output) 저장
     */
    @Override
    public void saveResult(String jobId, boolean success, String output) {

        //  저장된 Job 조회
        CompileJob job = store.get(jobId);

        //  조회되지 않은 경우 저장 생략
        if (job != null) {

            // Job 엔티티 내부의 complete() 호출
            //    - SUCCESS / ERROR 상태 업데이트
            //    - output(오류 메시지 또는 정상 출력) 기록
            job.complete(success, output);
        }
    }
}
