# Compile Server

Java 코드를 **비동기 방식으로 컴파일·실행**하는 독립 컴파일 서버입니다.  
Docker 기반 격리 실행 환경과 Redis Job Queue를 사용하여  
보안·안정성·확장성을 고려해 설계되었습니다.

온라인 코딩 교육, 실시간 코드 실행, 자동 채점 서버 용도로 사용 가능합니다.

---

## 전체 아키텍처

Backend Server
|
| (jobId, code, callbackUrl)
v
Compile API Server
|
v
Redis Job Queue
|
v
Worker Threads (N)
|
v
Docker Container Pool (Java 17)
|
v
Compile & Execute
|
v
Result Store (Redis) + Callback

yaml
코드 복사

---

## 핵심 특징

- 비동기 Job 기반 컴파일·실행
- Redis Queue 구조
- 멀티 Worker Thread 처리
- Docker 컨테이너 격리 실행
- 실행 시간 / 출력 크기 제한
- 보안 키워드 차단
- Callback 기반 결과 전달
---

## 처리 흐름

1. Backend에서 `jobId` 생성
2. `/api/compile/run` 호출
3. Job이 Redis Queue에 등록
4. Worker Thread가 Job 소비
5. Docker 컨테이너에서 컴파일·실행
6. 결과 Redis 저장
7. Backend로 Callback 전송

---

## API 명세
### 코드 실행 요청
POST /api/compile/run






