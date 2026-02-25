package finalproject.compile.infra.repo;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.repo.CompileJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
@Primary
@RequiredArgsConstructor
public class RedisCompileJobRepository implements CompileJobRepository {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "job:";

    // 완료된 데이터만 1시간 보관 (대기 중인 데이터는 24시간 보관)
    private static final long WAITING_TTL_HOURS = 24;
    private static final long COMPLETED_TTL_HOURS = 1;

    @Override
    public void save(CompileJob job) {
        // 초기 저장: 넉넉하게 24시간 설정 (대기열 밀림 방지)
        redisTemplate.opsForValue().set(
                KEY_PREFIX + job.getJobId(),
                job,
                WAITING_TTL_HOURS,
                TimeUnit.HOURS
        );
    }

    @Override
    public CompileJob findById(String jobId) {
        Object job = redisTemplate.opsForValue().get(KEY_PREFIX + jobId);
        if (job instanceof CompileJob) {
            return (CompileJob) job;
        }
        return null;
    }

    @Override
    public void saveResult(String jobId, boolean success, String output) {
        CompileJob job = findById(jobId);

        if (job != null) {
            job.complete(success, output);

            // 완료 시점에 TTL을 1시간으로 재설정 (결과 조회용 시간 확보)
            redisTemplate.opsForValue().set(
                    KEY_PREFIX + job.getJobId(),
                    job,
                    COMPLETED_TTL_HOURS,
                    TimeUnit.HOURS
            );
        }
    }
}