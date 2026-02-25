package finalproject.compile.domain.compile.repo;

import finalproject.compile.domain.compile.entity.CompileJob;

/**
 * 컴파일 Job 저장소 인터페이스
 * - 구현체는 InMemory, Redis, DB 등으로 다양하게 확장 가능
 * - 현재는 단일 서버이므로 InMemory 구현체 사용
 */
public interface CompileJobRepository {

    /**
     * Job을 저장하는 메서드
     * 1) jobId를 key로 Job 전체 객체 저장
     */
    void save(CompileJob job);

    /**
     * jobId로 Job 조회하는 메서드
     * 1) 존재하면 Job 반환
     * 2) 없으면 null 반환
     */
    CompileJob findById(String jobId);

    /**
     * Job의 결과만 갱신하는 메서드
     * 1) success 여부 → SUCCESS/ERROR
     * 2) output → 컴파일/실행 결과 로그
     */
    void saveResult(String jobId, boolean success, String output);
}
