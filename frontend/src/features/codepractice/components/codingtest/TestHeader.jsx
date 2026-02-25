import { useState } from "react";
import LanguageSelect from "./LanguageSelect";
import ProblemSelect from "./ProblemSelect";
import styles from "./TestHeader.module.css";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function TestHeader() {
  const [openType, setOpenType] = useState(null);
  const navigate = useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.backBtn} onClick={() => navigate("/mypage")}>
          <ChevronLeft size={20} />
        </button>
        
      </div>

      <div className={styles.right}>
        <LanguageSelect
          open={openType === "language"}
          onToggle={() =>
            setOpenType((v) => (v === "language" ? null : "language"))
          }
          onClose={() => setOpenType(null)}
        />

        <ProblemSelect
          open={openType === "problem"}
          onToggle={() =>
            setOpenType((v) => (v === "problem" ? null : "problem"))
          }
          onClose={() => setOpenType(null)}
        />
      </div>
    </header>
  );
}
