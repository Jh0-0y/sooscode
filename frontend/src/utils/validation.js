/**
 * 공통 검증 유틸리티
 */

// 정규식 패턴
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}[\]:;"'<>,.?/~`|\\]{8,16}$/;

/**
 * 빈 값 체크
 * value가 null, undefined, 공백 문자열일 경우 true 반환
 */
export const isEmpty = (value) => {
    return value === null || value === undefined || value.trim().length === 0;
};

/**
 * 길이 체크
 * 문자열 길이가 min 이상 max 이하일 경우 true
 */
export const isLength = (value, min, max) => {
    if (!value) return false;
    const length = value.trim().length;
    return length >= min && length <= max;
};

/**
 * 이메일 형식 체크
 * 형식이 올바를 경우 true
 */
export const isEmail = (email) => {
    if (!email) return false;
    return EMAIL_PATTERN.test(email.trim());
};

/**
 * 비밀번호 형식 체크
 * 8~16자, 영문 + 숫자 포함 시 true
 */
export const isPassword = (password) => {
    if (!password) return false;
    return PASSWORD_PATTERN.test(password);
};

/**
 * 날짜 범위 체크 (startDate < endDate)
 * 올바른 범위면 true
 */
export const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return new Date(startDate) < new Date(endDate);
};

/**
 * 미래 날짜 여부 체크
 * date가 현재보다 미래라면 true
 */
export const isFutureDate = (date) => {
    if (!date) return false;
    return new Date(date) > new Date();
};

/**
 * 빈 문자열 → null 변환
 * 공백 또는 빈 값이면 null, 아니면 trim된 문자열 반환
 */
export const convertEmptyToNull = (value) => {
    return !value || value.trim().length === 0 ? null : value.trim();
};

/**
 * ======================
 * 간단 사용 예시
 * ======================
 *
 * // 빈값 체크
 * if (isEmpty(username)) {
 *     console.log("사용자명은 필수 입력값입니다.");
 * }
 *
 * // 길이 체크 (2~10자)
 * if (!isLength(username, 2, 10)) {
 *     console.log("사용자명은 2~10자여야 합니다.");
 * }
 *
 * // 포커스 예시
 * if (isEmpty(username)) {
 *     usernameRef.current.focus();
 *     return;
 * }
 */