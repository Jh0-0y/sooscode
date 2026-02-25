// utils/classStatusUtils.js

/**
 * 클래스 상태 enum
 */
export const CLASS_STATUS = {
    UPCOMING: 'UPCOMING',      // 시작 전
    ONGOING: 'ONGOING',        // 진행 중
    FINISHED: 'FINISHED'       // 종료
};

/**
 * 날짜와 시간을 합쳐서 Date 객체 생성
 * @param {string} date - YYYY-MM-DD 형식
 * @param {string} time - HH:mm:ss 형식
 * @returns {Date}
 */
export const combineDateAndTime = (date, time) => {
    return new Date(`${date}T${time}`);
};

/**
 * 현재 클래스 상태 계산
 * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
 * @param {string} startTime - 시작 시간 (HH:mm:ss)
 * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
 * @param {string} endTime - 종료 시간 (HH:mm:ss)
 * @returns {string} CLASS_STATUS 중 하나
 */
export const calculateClassStatus = (startDate, startTime, endDate, endTime) => {
    const now = new Date();
    const start = combineDateAndTime(startDate, startTime);
    const end = combineDateAndTime(endDate, endTime);

    if (now < start) {
        return CLASS_STATUS.UPCOMING;
    }

    if (now > end) {
        return CLASS_STATUS.FINISHED;
    }

    return CLASS_STATUS.ONGOING;
};

/**
 * 상태에 따른 한글 텍스트 반환
 * @param {string} status - CLASS_STATUS 값
 * @returns {string}
 */
export const getStatusText = (status) => {
    const statusTexts = {
        [CLASS_STATUS.UPCOMING]: '시작 전',
        [CLASS_STATUS.ONGOING]: '진행 중',
        [CLASS_STATUS.FINISHED]: '종료'
    };

    return statusTexts[status] || '알 수 없음';
};

/**
 * 상태에 따른 배지 스타일 클래스 반환
 * @param {string} status - CLASS_STATUS 값
 * @returns {string}
 */
export const getStatusBadgeClass = (status) => {
    const badgeClasses = {
        [CLASS_STATUS.UPCOMING]: 'badge-upcoming',
        [CLASS_STATUS.ONGOING]: 'badge-ongoing',
        [CLASS_STATUS.FINISHED]: 'badge-finished'
    };

    return badgeClasses[status] || '';
};

/* ============================================
 * 사용 예시
 * ============================================

// 1. 클래스 상태 확인
const status = calculateClassStatus('2024-12-15', '14:00:00', '2024-12-15', '16:00:00');
console.log(status); // 'UPCOMING' | 'ONGOING' | 'FINISHED'

// 2. 접속 가능 여부 확인
const canJoin = canJoinClass('2024-12-15', '14:00:00', '2024-12-15', '16:00:00');
console.log(canJoin); // true | false

// 3. 시작까지 남은 시간
const timeLeft = getTimeUntilStart('2024-12-15', '14:00:00');
console.log(timeLeft); // { days: 0, hours: 2, minutes: 30, seconds: 15, totalSeconds: 9015 }

// 4. 한글 텍스트 표시
const statusText = getStatusText(status);
console.log(statusText); // '시작 전' | '진행 중' | '종료'

// 5. CSS 클래스명
const badgeClass = getStatusBadgeClass(status);
console.log(badgeClass); // 'badge-upcoming' | 'badge-ongoing' | 'badge-finished'

// 입장 버튼 활성화 조건
* canJoinClass
function JoinButton({ classData }) {
    const canJoin = canJoinClass(
        classData.startDate,
        classData.startTime,
        classData.endDate,
        classData.endTime
    );

    return (
        <button disabled={!canJoin}>
            {canJoin ? '입장하기' : '입장 불가'}
        </button>
    );
}

// 클래스 상태 배지(시작전/진행중/종료됨)
function StatusBadge({ classData }) {
    const status = calculateClassStatus(
        classData.startDate,
        classData.startTime,
        classData.endDate,
        classData.endTime
    );

    return (
        <span className={`badge ${getStatusBadgeClass(status)}`}>
            {getStatusText(status)}
        </span>
    );
}

*/