import styles from "./MainHeader.module.css";
import svgPaths from "../../imports/svg-uj7vgedyo3";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <p className={styles.logoText}>|/SoosCode\|</p>
          <h1 className={styles.pageTitle}>마이페이지</h1>
        </div>

        <button className={styles.registerButton}>
          <div className={styles.iconWrapper}>
            <svg className={styles.icon} fill="none" viewBox="0 0 18 18">
              <g clipPath="url(#clip0)">
                <path d={svgPaths.p80ad80} stroke="white" strokeWidth="1.5" />
                <path d={svgPaths.pdd8c10} stroke="white" strokeWidth="1.5" />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className={styles.buttonText}>클래스 등록</span>
        </button>
      </div>
    </header>
  );
}
