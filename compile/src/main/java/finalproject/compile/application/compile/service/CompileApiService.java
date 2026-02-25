package finalproject.compile.application.compile.service;

import finalproject.compile.application.compile.dto.CompileRequest;
import finalproject.compile.application.compile.dto.CompileResponse;
import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.service.CompileJobService;
import finalproject.compile.infra.queue.LocalJobQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompileApiService {

    private final CompileJobService jobService;      // Job 생성 및 상태 관리 담당
    private final LocalJobQueue localJobQueue;       // 컴파일 요청을 저장하는 큐(비동기 작업 큐)

    /**
     * 코드 실행 요청 처리 메서드
     * 1) jobId 생성
     * 2) Job 엔티티 생성 및 저장
     * 3) Worker가 실행할 수 있도록 큐에 push
     * 4) 즉시 jobId 반환 (비동기 처리)
     */
    public CompileResponse runCode(CompileRequest request){

        String jobId = request.getJobId();
        //  Job 엔티티 생성
        //    - 상태 WAITING
        //    - 요청받은 Java 코드 저장
        //    - InMemory 레포 에 저장
        CompileJob job = jobService.createJob(
                jobId,
                request.getCode(),
                request.getCallbackUrl()
                );

        //  컴파일 작업 큐에 job push
        //    - WorkerListener 백그라운드 스레드가 pop() 해서 실제 컴파일 실행
        localJobQueue.push(job);

        //  클라이언트에게 jobId 반환
        //   - 클라이언트는 /result/{jobId} 로 결과를 Polling
        return new CompileResponse(jobId);
    }
}

