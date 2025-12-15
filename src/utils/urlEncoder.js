/**
 * 범용 인코더 - 어떤 값이든 인코딩
 * @param {any} value - 인코딩할 값
 * @returns {string} 인코딩된 문자열
 */
export const encode = (value) => {
    try {
        const jsonString = JSON.stringify(value);
        const base64 = btoa(encodeURIComponent(jsonString));

        return base64
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    } catch (error) {
        console.error('인코딩 실패:', error);
        return null;
    }
};

/**
 * 숫자 디코더 - 숫자로 반환
 * @param {string} encodedValue - 인코딩된 문자열
 * @returns {number|null} 디코딩된 숫자
 */
export const decodeNumber = (encodedValue) => {
    try {
        let base64 = encodedValue
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        while (base64.length % 4) {
            base64 += '=';
        }

        const jsonString = decodeURIComponent(atob(base64));
        const value = JSON.parse(jsonString);

        return typeof value === 'number' ? value : null;
    } catch (error) {
        console.error('숫자 디코딩 실패:', error);
        return null;
    }
};

/**
 * 문자열 디코더 - 문자열로 반환
 * @param {string} encodedValue - 인코딩된 문자열
 * @returns {string|null} 디코딩된 문자열
 */
export const decodeString = (encodedValue) => {
    try {
        let base64 = encodedValue
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        while (base64.length % 4) {
            base64 += '=';
        }

        const jsonString = decodeURIComponent(atob(base64));
        const value = JSON.parse(jsonString);

        return typeof value === 'string' ? value : null;
    } catch (error) {
        console.error('문자열 디코딩 실패:', error);
        return null;
    }
};