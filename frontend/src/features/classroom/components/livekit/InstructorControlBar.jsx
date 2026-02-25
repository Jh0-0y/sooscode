import { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import styles from "./InstructorControlBar.module.css";

// 강사용 컨트롤 바
export default function InstructorControlBar({
  onToggleMultiView,
  isMultiView,
}) {
  // 현재 접속 중인 LiveKit Room 객체
  const room = useRoomContext();

  // 강사 상태
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // 화면 공유
  const toggleScreenShare = async () => {
    if (!room) return;
    const enabled = room.localParticipant.isScreenShareEnabled;
    await room.localParticipant.setScreenShareEnabled(!enabled);
  };

  // 마이크
  const toggleMic = async () => {
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(micMuted);
    setMicMuted(!micMuted);
  };

  // 카메라
  const toggleVideo = async () => {
    if (!room) return;
    await room.localParticipant.setCameraEnabled(videoOff);
    setVideoOff(!videoOff);
  };

  return (
    <div className={styles.bar}>
      <button onClick={toggleScreenShare}>
        화면 공유
      </button>
      <button onClick={toggleVideo}>
        {videoOff ? "비디오 켜기" : "비디오 끄기"}
      </button>
      <button onClick={toggleMic}>
        {micMuted ? "마이크 켜기" : "마이크 음소거"}
      </button>
      <button onClick={onToggleMultiView}>
        {isMultiView ? "내 화면" : "멀티뷰"}
      </button>
    </div>
  );
}
