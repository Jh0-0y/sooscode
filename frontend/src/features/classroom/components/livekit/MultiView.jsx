import { VideoTrack } from "@livekit/components-react";
import styles from "./MultiView.module.css";

export default function MultiView({participants, onSelectParticipant }) {
  // Grid 계산을 위한 변수 선언
  function getGridLayout(count) {
    if (count <= 1) return { rows: 1, cols: 1 };
    if (count <= 2) return { rows: 1, cols: 2 };
    if (count <= 4) return { rows: 2, cols: 2 };
    if (count <= 6) return { rows: 2, cols: 3 };
    if (count <= 9) return { rows: 3, cols: 3 };
    if (count <= 12) return { rows: 3, cols: 4 };
    if (count <= 16) return { rows: 4, cols: 4 };
    if (count <= 20) return { rows: 4, cols: 5 };
    if (count <= 25) return { rows: 5, cols: 5 };
    return { rows: 5, cols: 6 };
  }

  const participantCount = participants.length;
  const { rows, cols } = getGridLayout(participantCount);

  // MultiView Render
  return (
    <div className={styles.wrapper}>
      <div className={styles.gridStage}>
        <div
          className={styles.gridWrapper}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: "12px",
          }}
        >
          {participants.map((p) => {
  const shouldRenderVideo = !!p.trackRef;

  return (
    <div
      key={p.identity}
      className={styles.gridItem}
      onClick={() => {
    if (!p.trackRef) return; 
    onSelectParticipant(p.trackRef);
    }}
    >
    <div className={styles.videoFrame}>
      {shouldRenderVideo && (
        <VideoTrack
          trackRef={p.trackRef}
          className={styles.video}
        />
      )}

      {!shouldRenderVideo && (
        <div className={styles.cameraOff}>
          <span className={styles.avatar}>👤</span>
          <span className={styles.cameraOffText}>카메라 꺼짐</span>
        </div>
      )}

        <div className={styles.overlay}>
          <span className={styles.username}>{p.identity}</span>
        </div>
      </div>
    </div>
    );
  })}
            </div>
        </div>
      </div>
    );
  }