import {Link} from "react-router-dom";
import {FiMail, FiLock, FiUser} from "react-icons/fi";
import styles from "./AuthForm.module.css";
import useRegister from "../hooks/useRegister";

const RegisterForm = () => {
    const {
        form,
        errors,
        verified,
        showCodeInput,
        code,
        loadingSend,
        passwordStrength,
        time,
        format,
        handleChange,
        setCode,
        sendCode,
        verifyCode,
        submit,
    } = useRegister();

    return (
        <div className={styles.background}>
            <div className={styles.card}>
                <h2 className={styles.title}>회원가입</h2>
                <p className={styles.subtitle}>새로운 계정을 만들어보세요.</p>

                <form className={styles.form} onSubmit={submit}>

                    {/* 이름 */}
                    <div>
                        <label className={styles.label}>이름</label>
                        <div className={styles.inputWrapper}>
                            <FiUser className={styles.inputIcon}/>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        {errors.name && <p className={styles.fieldError}>{errors.name}</p>}
                    </div>

                    {/* 이메일 */}
                    <div>
                        <label className={styles.label}>이메일</label>
                        <div className={styles.inputWrapper}>
                            <FiMail className={styles.inputIcon}/>
                            <div className={styles.row}>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={styles.input}
                                />
                                <button
                                    type="button"
                                    className={styles.subButton}
                                    onClick={sendCode}
                                    disabled={time > 0}
                                >
                                    {loadingSend ? "전송중" : "인증"}
                                </button>
                            </div>
                        </div>
                        {errors.email && <p className={styles.fieldError}>{errors.email}</p>}
                    </div>

                    {/* 인증 코드 */}
                    {showCodeInput && (
                        <div className={styles.inputWrapper}>
                            <div className={styles.row}>
                                    <FiLock className={styles.inputIcon}/>
                                    <input
                                        className={styles.input}
                                        placeholder="인증코드 입력"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                <button
                                    type="button"
                                    className={styles.outlineButton}
                                    onClick={verifyCode}
                                    disabled={time === 0}
                                >
                                    확인
                                </button>

                                {errors.emailVerify && (
                                    <p className={styles.fieldError}>{errors.emailVerify}</p>
                                )}
                            </div>

                            {time > 0 && (
                                <span className={styles.timer}>{format()}</span>
                            )}

                        </div>
                    )}

                    {/* 비밀번호 */}
                    <div>
                        <label className={styles.label}>비밀번호</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon}/>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        {errors.password && (
                            <p className={styles.fieldError}>{errors.password}</p>
                        )}

                        {form.password && (
                            <p
                                className={
                                    passwordStrength === "강함"
                                        ? styles.strong
                                        : passwordStrength === "보통"
                                            ? styles.medium
                                            : styles.weak
                                }
                            >
                                비밀번호 강도: {passwordStrength}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className={styles.label}>비밀번호 확인</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon}/>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>

                        {errors.confirmPassword && (
                            <p className={styles.fieldError}>{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button className={styles.primaryButton} disabled={!verified}>
                        회원가입
                    </button>

                    <p className={styles.footerText}>
                        이미 계정이 있으신가요?{" "}
                        <Link className={styles.link} to="/login">
                            로그인
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm