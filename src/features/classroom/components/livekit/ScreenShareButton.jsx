import { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import styles from "./LivekitVideo.module.css";

// screen share용 버튼
export default function ScreenShareButton() {
  const room = useRoomContext();
  const [sharing, setSharing] = useState(false);

  const toggle = async () => {
    if (!room) return;
    await room.localParticipant.setScreenShareEnabled(!sharing);
    setSharing(!sharing);
  };

  return (
    <button onClick={toggle} className={styles.shareButton}>
      {sharing ? "화면공유 종료" : "화면공유 시작"}
    </button>
  );
}
