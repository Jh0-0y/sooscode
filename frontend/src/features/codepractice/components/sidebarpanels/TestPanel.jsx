import { useNavigate } from "react-router-dom";
import TestMoveButton from "./test/TestMoveButton";
import styles from './TestPanel.module.css';


export default function TestPanel() {
  const navigate = useNavigate()
  const handleOpenTest = () => {
    navigate("/test");
  };

  return (
    <div className={styles.codingTestBtn}>
      <TestMoveButton handleOpenTest={handleOpenTest} />
    </div>
  );
}
