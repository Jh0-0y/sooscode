package finalproject.compile.application.compile.controller;

import finalproject.compile.application.compile.dto.CompileRequest;
import finalproject.compile.application.compile.dto.CompileResponse;
import finalproject.compile.application.compile.dto.CompileResultResponse;
import finalproject.compile.application.compile.service.CompileApiService;
import finalproject.compile.application.compile.service.CompileResultService;
import finalproject.compile.application.compile.worker.CompileWorkerService;
import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.infra.queue.LocalJobQueue;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/compile")
public class CompileController {
    private final CompileApiService apiService;
    private final CompileResultService resultService;
    private final CompileWorkerService workerService;
    private final LocalJobQueue localJobQueue;
    /**
     * 코드 실행 요청 API
     */
    @PostMapping("/run")
    public ResponseEntity<CompileResponse> run(@RequestBody CompileRequest request) {

        //  jobId는 백엔드에서 생성하여 전달함
        String jobId = request.getJobId();

        //  CompileJob 엔티티 생성
        CompileJob job = new CompileJob(
                jobId,
                request.getCode(),
                request.getCallbackUrl()
        );
        //  LocalJobQueue 에 job 등록 (BlockingQueue.put)
        localJobQueue.push(job);

        //  즉시 jobId 반환 → 비동기 처리
        return ResponseEntity.ok(new CompileResponse(jobId));
    }


    /** 결과 조회 API */
    @GetMapping("/result/{jobId}")
    public ResponseEntity<CompileResultResponse> result(@PathVariable String jobId) {
        return ResponseEntity.ok(resultService.readResult(jobId));
    }
}