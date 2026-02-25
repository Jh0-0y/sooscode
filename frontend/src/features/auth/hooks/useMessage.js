export const handleAuthError = (errorCode, refs) => {
    const {emailRef, passwordRef, codeRef} = refs;
    if (!errorCode) return null;

    const map = {
        // 이메일 관련
        VALID_USR_005: ["이메일을 입력해주세요.", emailRef],
        VALID_USR_006: ["올바른 이메일 형식이 아닙니다.", emailRef],
        VALID_USR_007: ["이메일은 5자 이상이어야 합니다.", emailRef],
        VALID_USR_008: ["이메일은 50자 이하이어야 합니다.", emailRef],

        // 비밀번호 관련
        VALID_USR_009: ["비밀번호를 입력해주세요.", passwordRef],
        VALID_USR_010: ["비밀번호는 8자 이상이어야 합니다.", passwordRef],
        VALID_USR_011: ["비밀번호는 16자 이하이어야 합니다.", passwordRef],
        VALID_USR_013: ["비밀번호가 일치하지 않습니다.", passwordRef],

        // 인증 코드 관련 (이건 그대로 유지)
        CODE_001: ["인증코드를 입력해주세요.", codeRef],

        // 서버 AUTH 계열
        AUTH_101: ["가입되지 않은 이메일입니다.", emailRef],
        AUTH_102: ["이미 가입된 이메일입니다.", emailRef],
        AUTH_103: ["탈퇴한 이메일입니다.", emailRef],

        // 로그인
        AUTH_201: ["비밀번호가 올바르지 않습니다.", passwordRef],
        AUTH_202: ["사용자를 찾을 수 없습니다.", emailRef],
        AUTH_203: ["인증되지 않은 사용자입니다.", null],

        // 이메일 인증
        AUTH_301: ["인증 코드가 올바르지 않습니다.", codeRef],
        AUTH_302: ["인증 코드가 만료되었습니다.", codeRef],

        // 토큰
        AUTH_401: ["로그인이 만료되었습니다. 다시 로그인해주세요.", null],
        AUTH_403: ["세션이 만료되었습니다. 다시 로그인해주세요.", null],
    };

    const result = map[errorCode];
    if (!result) return null;

    const [msg, ref] = result;

    if (ref?.current) ref.current.focus();

    return msg;
};
