package finalproject.compile.application.compile.service;

import finalproject.compile.application.compile.dto.CompileResultResponse;
import finalproject.compile.domain.compile.entity.CompileJob;
import finalproject.compile.domain.compile.service.CompileJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompileResultService {

    private final CompileJobService jobService;

    /**
     * 컴파일 결과 조회 메서드
     * 1) jobId 기반으로 Job 엔티티 조회
     * 2) Job이 없으면 NOT_FOUND 반환
     * 3) Job이 있으면 상태·출력 문자열을 그대로 응답 DTO에 담아 반환
     */
    public CompileResultResponse readResult(String jobId){

        //  InMemory 에서 jobId로 Job 조회
        //    - 처음 요청되었거나 존재하지 않는 jobId일 경우 null
        CompileJob job = jobService.getJob(jobId);

        //  존재하지 않는 jobId인 경우 → NOT_FOUND 응답 생성
        //    - 이 응답 기반 잘못된 jobId를 판단
        if(job == null){
            return new CompileResultResponse("NOT_FOUND", "");
        }

        //  Job이 정상적으로 존재하는 경우
        //    - job.getStatus(): WAITING, RUNNING, SUCCESS, ERROR
        //    - job.getOutput(): 컴파일 에러 메시지 또는 실행 결과 문자열
        return new CompileResultResponse(
                job.getStatus().name(),  // 현재 Job 상태 문자열
                job.getOutput()          // 컴파일/실행 결과 출력
        );
    }
}
