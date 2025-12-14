import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import styles from "./HCJPracticeSection.module.css";
import HCJCodePanelHeader from "../components/HCJCodePanelHeader";
import HCJCodePanelContent from "../components/HCJCodePanelContentHTML";
import HCJCodePanelContentCSS from "../components/HCJCodePanelContentCSS";
import HCJCodePanelContentJS from "../components/HCJCodePanelContentJS";
import HCJCodePanelContentHTML from "../components/HCJCodePanelContentHTML";
import HCJCodePanelRender from "../components/HCJCodePanelRender";
import HCJCodePanelCompile from "../components/HCJCodePanelCompile";

export default function HCJPracticeSection({
  HTMLCode,
  CSSCode,
  JSCode,
  onHTMLChange,
  onCSSChange,
  onJSChange
}) {
  return (
    <div className={styles.wrapper}>
      <PanelGroup direction="vertical">
        <Panel defaultSize={60} minSize={15}>
          <div className={styles.codeWrapper}>
            <PanelGroup direction="horizontal">
              <Panel defaultSize={33} minSize={10}>
                <div className={styles.panelContent}>
                  <HCJCodePanelHeader HCJtitle={"HTML"}/>
                  <div className={styles.codeContainer}>
                    <HCJCodePanelContentHTML
                     code={HTMLCode}
                     onChange={onHTMLChange}
                     />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className={styles.innerHandle} />
              <Panel defaultSize={33} minSize={10}>
                <div className={styles.panelContent}>
                  <HCJCodePanelHeader HCJtitle={"CSS"}/>
                  <div className={styles.codeContainer}>
                    <HCJCodePanelContentCSS
                      code={CSSCode}
                      onChange={onCSSChange}
                    />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className={styles.innerHandle} />
              <Panel defaultSize={34} minSize={10}>
                <div className={styles.panelContent}>
                  <HCJCodePanelHeader HCJtitle={"JS"}/>
                  <div className={styles.codeContainer}>
                    <HCJCodePanelContentJS
                     code={JSCode}
                     onChange={onJSChange}
                     />
                  </div>
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.handle} />
        <Panel defaultSize={30} minSize={10}>
          <div className={styles.renderContainer}>
            <HCJCodePanelRender/>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.handle} />
        <Panel defaultSize={10} minSize={10}>
          <div className={styles.consoleContainer}>
            <HCJCodePanelCompile/>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
