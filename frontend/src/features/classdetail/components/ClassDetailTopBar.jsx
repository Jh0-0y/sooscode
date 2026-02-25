import { useNavigate } from "react-router-dom";
import styles from "./ClassDetailTopBar.module.css";
import { FaCode } from "react-icons/fa";
import { encode } from "@/utils/urlEncoder";


export default function ClassDetailTopBar({title,online,classId}) {
  const navigate = useNavigate();
  const handleJoinClass = (classId) => {
  const encoded = encode(classId);

  console.log("encoded:", encoded);
  console.log("current pathname:", window.location.pathname);
  console.log("target:", `/class/${encoded}`);

  navigate(`/class/${encoded}`);
};
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        
      </div>

      <div className={styles.center}>
        <div className={styles.textBox}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{online ? "온라인 강의" : "오프라인 강의"}</div>
        </div>
      </div>

      <div className={styles.right}>
              <div className={styles.buttonContainer}>
                <button
        className={styles.enterBtn}
        onClick={() => {handleJoinClass(classId);
        }}
      >
        입장하기
      </button>
          <button className={styles.practiceBtn} onClick={() => navigate(`/test`)}>코드연습</button>
        </div>
        
      </div>
    </div>
  );
}
