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
- Redis Queue + ACK 구조
- 멀티 Worker Thread 처리
- Docker 컨테이너 격리 실행
- 실행 시간 / 출력 크기 제한
- 보안 키워드 차단
- Callback 기반 결과 전달
- DLQ(Dead Letter Queue) 지원

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

pgsql
코드 복사

**Request**
```json
{
  "jobId": "string",
  "code": "string",
  "callbackUrl": "string"
}
Response

json
코드 복사
{
  "jobId": "string"
}
결과 조회
swift
코드 복사
GET /api/compile/result/{jobId}
Response

json
코드 복사
{
  "status": "PENDING | RUNNING | SUCCESS | FAIL",
  "output": "string"
}
Job 상태
상태	설명
PENDING	Job 생성 및 대기
RUNNING	컴파일 또는 실행 중
SUCCESS	정상 실행 완료
FAIL	컴파일 오류 또는 런타임 오류

Worker 구조
서버 시작 시 Worker Thread 자동 생성

Worker 수는 설정값으로 제어

각 Worker는 전용 Docker 컨테이너 사용

컨테이너 사용 횟수 초과 시 자동 재생성

Job ACK 처리로 중복 실행 방지

Docker 실행 정책
Image: eclipse-temurin:17-jdk

네트워크 차단

권한 최소화

리소스 제한 적용

css
코드 복사
--network none
--cap-drop ALL
--memory 512m
--cpus 0.8
--pids-limit 100
보안 정책
차단 키워드
아래 키워드가 포함된 코드는 실행되지 않습니다.

lua
코드 복사
System.exit
Runtime.getRuntime
ProcessBuilder
java.io.File
java.nio.file
java.net
java.lang.reflect
sun.misc.Unsafe
Thread
ForkJoinPool
실행 제한
컴파일 타임아웃: 10초

실행 타임아웃: 5초

최대 출력 길이: 10,000자

장애 대응
컨테이너 오류 시 재생성 후 재시도

시스템 장애 발생 시 DLQ(Redis)에 저장

Callback 실패 시 재시도 큐에 저장

저장소 구성
Job 정보 Redis 저장

TTL 정책

대기/실행 중: 24시간

완료 Job: 1시간

기술 스택
Java 17

Spring Boot

Redis

Docker

Linux / Windows 지원

확장 가능 포인트
다중 언어 지원 (Python, C++)

Callback 재시도 전용 Worker 분리


사용 사례
온라인 코딩 교육 플랫폼

실시간 코드 실행 서비스


