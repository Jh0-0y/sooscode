import styles from "./HCJCodePanelCompile.module.css";
import { useEffect } from "react";
import { usePracticeStore } from "../store/usePracticeStore";

export default function HCJCodePanelCompile() {
  const consoleOutput = usePracticeStore((state) => state.consoleOutput);
  const setConsoleOutput = usePracticeStore((state) => state.setConsoleOutput);

  useEffect(() => {
  function handleMessage(event) {
    const data = event.data;
    if (!data || !data.type) return;

    if (data.type === "HCJ_LOG") {
      setConsoleOutput(
        usePracticeStore.getState().consoleOutput +
        "[LOG] " + data.message + "\n"
      );
    }

    if (data.type === "HCJ_ERROR") {
      setConsoleOutput(
        usePracticeStore.getState().consoleOutput +
        "ERROR: " + data.message + "\n"
      );
    }
  }

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);

  console.log("output :" , consoleOutput)

  return (
    <div className={styles.compile}>
      {consoleOutput}
    </div>
  );
}
