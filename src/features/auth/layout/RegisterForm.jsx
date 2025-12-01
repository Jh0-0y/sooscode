import {Link} from "react-router-dom";
import styles from "@/pages/auth/AuthPage.module.css";
import {FiLock, FiMail, FiUser} from "react-icons/fi";
import React from "react";
import useAuth from "../hooks/useAuth";

const RegisterForm = () => {
    const {
        form,
        errors,
        //verified,
        //code,
        //setCode,
        //showCodeInput,
        //sendLoading,
        //timer,
        passwordStrength,
        handleChange,
        //formatTime,
        //sendCode,
        //verifyCode,
        handleSubmit,
    } = useAuth();

    return (
        <>
            {/*<img src={logoImg} className={styles.logo} />*/}

            <h2 className={styles.title}>회원가입</h2>
            <p className={styles.subtitle}>새로운 계정을 만들어보세요.</p>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label}>이름</label>
                    <div className={styles.inputWrapper}>
                        <FiUser className={styles.inputIcon}/>
                        <input
                            className={styles.input}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.name && <p className={styles.error}>{errors.name}</p>}
                </div>

                <div>
                    <label className={styles.label}>이메일</label>
                    <div className={styles.inputWrapper}>
                        <FiMail className={styles.inputIcon}/>
                        <div className={styles.row}>
                            <input
                                className={styles.input}
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                            />
                            {/*<button*/}
                            {/*    type="button"*/}
                            {/*    className={styles.subButton}*/}
                            {/*    onClick={sendCode}*/}
                            {/*    disabled={timer > 0}*/}
                            {/*>*/}
                            {/*    {sendLoading ? "전송중" : "인증"}*/}
                            {/*</button>*/}
                        </div>
                    </div>
                    {errors.email && (
                        <p className={styles.error}>{errors.email}</p>
                    )}
                </div>
                {/*<div>*/}
                {/*    {showCodeInput && (*/}
                {/*        <>*/}
                {/*            <div className={styles.row}>*/}
                {/*                <input*/}
                {/*                    className={`${styles.input} ${styles.nopadding}`}*/}
                {/*                    placeholder="인증코드 입력"*/}
                {/*                    value={code}*/}
                {/*                    onChange={(e) => setCode(e.target.value)}*/}
                {/*                />*/}
                {/*                <div className={styles.row}>*/}
                {/*                    <button*/}
                {/*                        type="button"*/}
                {/*                        className={styles.outlineButton}*/}
                {/*                        onClick={verifyCode}*/}
                {/*                        disabled={timer === 0}*/}
                {/*                    >*/}
                {/*                        확인*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            {timer > 0 && (*/}
                {/*                <span className={styles.timer}>{formatTime(timer)}</span>*/}
                {/*            )}*/}
                {/*            {errors.emailVerify && (*/}
                {/*                <p className={styles.error}>{errors.emailVerify}</p>*/}
                {/*            )}*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</div>*/}
                <div>
                    <label className={styles.label}>비밀번호</label>
                    <div className={styles.inputWrapper}>
                        <FiLock className={styles.inputIcon}/>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.password && <p className={styles.error}>{errors.password}</p>}
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
                <div>
                    <label className={styles.label}>비밀번호 확인</label>
                    <div className={styles.inputWrapper}>
                        <FiLock className={styles.inputIcon}/>
                        <input
                            className={styles.input}
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className={styles.error}>{errors.confirmPassword}</p>
                    )}
                </div>
                {/*disabled={!verified}*/}
                <button type="submit" className={styles.primaryButton}>
                    회원가입
                </button>
                <p className={styles.footerText}>
                    이미 계정이 있으신가요? <Link className={styles.link} to="/login">로그인</Link>
                </p>
            </form>
        </>
    );
}

export default RegisterForm