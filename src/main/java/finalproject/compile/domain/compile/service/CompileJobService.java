package finalproject.compile.domain.compile.service;

import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.repo.CompileJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 도메인 서비스
 * - Job 생성/조회/결과 저장 등의 비즈니스 규칙 관리
 */
@Service
@RequiredArgsConstructor
public class CompileJobService {

    private final CompileJobRepository jobRepository;

    /** Job 생성 */
    public CompileJob createJob(String jobId, String code) {
        CompileJob job = new CompileJob(jobId, code);
        jobRepository.save(job);
        return job;
    }

    /** Job 조회 */
    public CompileJob getJob(String jobId) {
        return jobRepository.findById(jobId);
    }

    /** Job 완료 상태 저장 */
    public void completeJob(String jobId, boolean success, String output) {
        jobRepository.saveResult(jobId, success, output);
    }
}
