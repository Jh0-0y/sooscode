import styles from "./TestMoveButton.module.css";

export default function TestMoveButton({ handleOpenTest }) {
  return (
    <button
      className={styles.button}
      onClick={handleOpenTest}
    >
      Coding Test 하러가기
    </button>
  );
}
