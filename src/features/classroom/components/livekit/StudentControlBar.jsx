import { useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import styles from "./StudentControlBar.module.css";

// 학생의 비디오 상태관리를 위한 Footer
export default function StudentControlBar({ 
  localCamera,showMyPreview,
  onToggleMyPreview,
 }) {
  // 현재 접속 중인 Livekit Room 객체 ( 이 객체로 Controll )
  const room = useRoomContext();

  // 학생화면에 대한 내부 state 관리
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [showMyCam, setShowMyCam] = useState(false);

  // Livekit 내부에서 새로운 Screen track publish / unpublish
  const toggleScreenShare = async () => {
    if (!room) return;
    const enabled = room.localParticipant.isScreenShareEnabled;
    await room.localParticipant.setScreenShareEnabled(!enabled);
  };

  // 마이크 음소거
  const toggleMic = async () => {
    if (!room) return;
    await room.localParticipant.setMicrophoneEnabled(micMuted);
    setMicMuted(!micMuted);
  };

  // 
  const toggleVideo = async () => {
    if (!room) return;
    await room.localParticipant.setCameraEnabled(videoOff);
    setVideoOff(!videoOff);
  };

  /* 4. 내 화면 보기 / 숨기기 (PiP) */
  const toggleMyView = async () => {
    if (!localCamera) return;

    const videoEl = localCamera?.publication?.track?.mediaStreamTrack
      ?.getSettings ? document.querySelector("video") : null;

    try {
      if (!showMyCam) {
        if (!document.pictureInPictureElement) {
          await videoEl?.requestPictureInPicture();
        }
      } else {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      }
      setShowMyCam(!showMyCam);
    } catch (e) {
      console.warn("PiP toggle failed", e);
    }
  };

  return (
    <div className={styles.bar}>
      <button onClick={toggleScreenShare}>내 화면 공유</button>
      <button onClick={toggleVideo}>
        {videoOff ? "비디오 켜기" : "비디오 끄기"}
      </button>
      <button onClick={toggleMic}>
        {micMuted ? "마이크 켜기" : "마이크 음소거"}
      </button>
      {/* <button onClick={toggleMyView}>
        {showMyCam ? "내 화면 숨기기" : "내 화면 보기"}
      </button> */}
      <button onClick={onToggleMyPreview}>
        {showMyPreview ? "내 화면 숨기기" : "내 화면 다시 보기"}
      </button>
    </div>
  );
}
