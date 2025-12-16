import { useState } from "react";
import LanguageSelect from "./LanguageSelect";
import ProblemSelect from "./ProblemSelect";
import styles from "./TestHeader.module.css";

export default function TestHeader() {
  const [openType, setOpenType] = useState(null);
  // null | "language" | "problem"

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={"logo"} />
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
