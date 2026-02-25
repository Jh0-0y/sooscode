import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import {useUser} from "@/hooks/useUser.js";

const Home = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const {user} = useUser();

    // useEffect(() => {
    //     // 코드 타이핑 애니메이션 효과
    //     const codeLines = document.querySelectorAll(`.${styles.codeLine}`);
    //     codeLines.forEach((line, index) => {
    //         line.style.animationDelay = `${index * 0.15}s`;
    //     });
    // }, []);

    // 클래스 둘러보기 버튼 클릭 핸들러
    const handleClassesClick = () => {
        if (user) {
            navigate('/mypage');
        } else {
            navigate('/login');
        }
    };


    const features =[
        {
            icon: '🎬',
            title: '실시간 수업 스트리밍',
            description: '강사의 코딩 과정을 실시간으로 시청하며 배우세요. 고화질 스트리밍으로 코드 한 줄 한 줄을 놓치지 않습니다.',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: '💬',
            title: '실시간 채팅',
            description: '궁금한 점은 바로 질문하세요. 강사와 수강생들이 함께 소통하는 실시간 채팅으로 즉각적인 피드백을 받을 수 있습니다.',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            icon: '👀',
            title: '실시간 코드 연동',
            description: '학생은 강사의 코드를 확인하고, 강사는 학생의 코드를 확인하며 피드백을 제공합니다.',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            icon: '📸',
            title: '코드 스냅샷',
            description: '중요한 순간의 코드를 스냅샷으로 저장하고, 언제든 내 에디터로 불러와 직접 실습해보세요.',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    ]


    const stats = [
        { number: '1,000+', label: '활성 수강생' },
        { number: '50+', label: '전문 강사' },
        { number: '200+', label: '라이브 클래스' },
        { number: '98%', label: '만족도' }
    ];

    return (
        <div className={styles.container}>
            {/* 배경 효과 */}
            <div className={styles.backgroundGrid}></div>
            <div className={styles.glowOrb1}></div>
            <div className={styles.glowOrb2}></div>

            {/* 히어로 섹션 */}
            <section className={styles.hero} ref={heroRef}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <span className={styles.badgeDot}></span>
                        실시간 코딩 교육 플랫폼
                    </div>

                    <h1 className={styles.heroTitle}>
                        <span className={styles.titleLine}>코드를 함께 쓰고,</span>
                        <span className={styles.titleLine}>
                            <span className={styles.highlight}>실시간</span>으로 배우다
                        </span>
                    </h1>

                    <p className={styles.heroDescription}>
                        강사와 학생의 코드가 실시간으로 동기화되는 온라인 코딩 교육 플랫폼.
                        <br />
                        채팅으로 즉시 소통하고, 브라우저에서 바로 코드를 실행해보세요.
                    </p>

                    <div className={styles.heroCta}>
                        <button
                            className={styles.primaryBtn}
                            onClick={handleClassesClick}
                        >
                            클래스 둘러보기
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 코드 프리뷰 */}
                <div className={styles.codePreview}>
                    <div className={styles.codeWindow}>
                        <div className={styles.windowHeader}>
                            <div className={styles.windowDots}>
                                <span className={styles.dot} style={{background: '#ff5f56'}}></span>
                                <span className={styles.dot} style={{background: '#ffbd2e'}}></span>
                                <span className={styles.dot} style={{background: '#27ca40'}}></span>
                            </div>
                            <span className={styles.fileName}>SoosCode.java</span>
                            <div className={styles.liveIndicator}>
                                <span className={styles.liveDot}></span>
                                LIVE
                            </div>
                        </div>
                        <div className={styles.codeContent}>
                            <div className={styles.codeLine}>
                                <span className={styles.lineNumber}>1</span>
                                <span className={styles.codeText}>
                                    <span className={styles.keyword}>public</span>{' '}
                                    <span className={styles.keyword}>class</span>{' '}
                                    <span className={styles.variable}>Main</span> {'{'}
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent1}`}>
                                <span className={styles.lineNumber}>2</span>
                                <span className={styles.codeText}>
                                    <span className={styles.keyword}>public</span>{' '}
                                    <span className={styles.keyword}>static</span>{' '}
                                    <span className={styles.keyword}>void</span>{' '}
                                    <span className={styles.function}>main</span>
                                    (<span className={styles.variable}>String</span>[] <span className={styles.variable}>args</span>) {'{'}
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent2}`}>
                                <span className={styles.lineNumber}>3</span>
                                <span className={styles.codeText}>
                                    <span className={styles.keyword}>int</span>{' '}
                                    <span className={styles.variable}>a</span> = <span className={styles.number}>10</span>;
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent2}`}>
                                <span className={styles.lineNumber}>4</span>
                                <span className={styles.codeText}>
                                    <span className={styles.keyword}>int</span>{' '}
                                    <span className={styles.variable}>b</span> = <span className={styles.number}>20</span>;
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent2}`}>
                                <span className={styles.lineNumber}>5</span>
                                <span className={styles.codeText}>
                                    <span className={styles.keyword}>int</span>{' '}
                                    <span className={styles.variable}>sum</span> = <span className={styles.variable}>a</span> + <span className={styles.variable}>b</span>;
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent2}`}>
                                <span className={styles.lineNumber}>6</span>
                                <span className={styles.codeText}>
                                    <span className={styles.variable}>System</span>.<span className={styles.variable}>out</span>.
                                    <span className={styles.function}>println</span>
                                    (<span className={styles.string}>"합계: "</span> + <span className={styles.variable}>sum</span>);
                                </span>
                            </div>

                            <div className={`${styles.codeLine} ${styles.indent1}`}>
                                <span className={styles.lineNumber}>7</span>
                                <span className={styles.codeText}>
                                    {'}'}
                                </span>
                            </div>

                            <div className={styles.codeLine}>
                                <span className={styles.lineNumber}>8</span>
                                {'}'}
                            </div>

                            {/*<div className={styles.cursor}></div>*/}
                        </div>

                    </div>

                    {/* 플로팅 요소들 */}
                    <div className={styles.floatingChat}>
                        <div className={styles.chatBubble}>
                            <span className={styles.chatAvatar}>👨‍🎓</span>
                            <span>int랑 Integer는 뭐가 다른가요?</span>
                        </div>
                        <div className={styles.chatBubble + ' ' + styles.instructor}>
                            <span className={styles.chatAvatar}>👨‍🏫</span>
                            <span>int는 기본 타입이고, Integer는 Wrapper 클래스예요.</span>
                        </div>
                    </div>

                    <div className={styles.floatingSnapshot}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        스냅샷 저장됨
                    </div>
                </div>
            </section>

            {/* 통계 섹션 */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.statItem}>
                            <span className={styles.statNumber}>{stat.number}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 기능 소개 섹션 */}
            <section className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        왜 <span className={styles.highlight}>SoosCode</span>인가요?
                    </h2>
                    <p className={styles.sectionDescription}>
                        기존 영상 강의와는 다릅니다. 실시간으로 함께하는 코딩 경험을 제공합니다.
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={styles.featureCard}
                            style={{'--card-gradient': feature.gradient}}
                        >
                            <div className={styles.featureIcon}>
                                {feature.icon}
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                            <div className={styles.featureGlow}></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 작동 방식 섹션 */}
            <section className={styles.howItWorksSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>어떻게 진행되나요?</h2>
                </div>

                <div className={styles.stepsContainer}>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>01</div>
                        <div className={styles.stepContent}>
                            <h3>실시간 수업 참여</h3>
                            <p>원하는 클래스를 선택하면 강사와 수강생이 실시간으로 연결되어 수업이 시작됩니다.</p>
                        </div>
                    </div>
                    <div className={styles.stepConnector}></div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>02</div>
                        <div className={styles.stepContent}>
                            <h3>실시간 코드 연동 & 피드백</h3>
                            <p>강사와 학생의 코드가 실시간으로 연동되며, 강사는 학생의 코드를 직접 확인;;해가며 피드백을 제공합니다.</p>
                        </div>
                    </div>
                    <div className={styles.stepConnector}></div>
                    <div className={styles.step}>
                        <div className={styles.stepNumber}>03</div>
                        <div className={styles.stepContent}>
                            <h3>코드 스냅샷</h3>
                            <p>수업 중 중요한 코드를 스냅샷으로 저장하고 내 에디터로 불러와 반복 실습하며 학습을 이어갑니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA 섹션 */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>
                        지금 바로 시작하세요
                    </h2>
                    <p className={styles.ctaDescription}>
                        회원가입 후 첫 번째 라이브 클래스를 경험해보세요.
                    </p>
                    <button
                        className={styles.ctaButton}
                        onClick={handleClassesClick}
                    >
                        클래스 시작하기
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.ctaGlow}></div>
            </section>

            {/* 푸터 */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <h3 className={styles.footerLogo}>SoosCode</h3>
                        <p>실시간 코딩 멘토링 플랫폼</p>
                    </div>
                    {/*<div className={styles.footerLinks}>*/}
                    {/*    <a href="/about">소개</a>*/}
                    {/*    <a href="/classes">클래스</a>*/}
                    {/*    <a href="/support">고객지원</a>*/}
                    {/*    <a href="/terms">이용약관</a>*/}
                    {/*</div>*/}
                    <div className={styles.footerCopyright}>
                        © 2025 SoosCode. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;