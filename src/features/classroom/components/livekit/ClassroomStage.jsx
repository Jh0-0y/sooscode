import {
  useTracks,
  VideoTrack,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState } from "react";
import ScreenShareButton from "./ScreenShareButton";
import StudentControlBar from "./StudentControlBar";

export default function ClassroomStage({ isTeacher }) {
  const [showMyPreview, setShowMyPreview] = useState(true);

  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  /* ===============================
     공통: local (내) 트랙
  =============================== */
  const myScreenShare = tracks.find(
    (t) =>
      t.publication?.source === Track.Source.ScreenShare &&
      t.participant?.isLocal
  );

  const myCamera = tracks.find(
    (t) =>
      t.publication?.source === Track.Source.Camera &&
      t.participant?.isLocal
  );

  /* ===============================
     공통: remote (상대) 트랙
  =============================== */
  const teacherCameras = tracks.filter(
  (t) =>
    t.publication?.source === Track.Source.Camera &&
    !t.participant?.isLocal
);

const teacherScreenShares = tracks.filter(
  (t) =>
    t.publication?.source === Track.Source.ScreenShare &&
    !t.participant?.isLocal
);
  /* ===============================
     렌더
  =============================== */
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* =================================================
          👨‍🏫 선생님 화면
      ================================================= */}
      {isTeacher ? (
        myScreenShare ? (
          <VideoTrack
            trackRef={myScreenShare}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
            }}
          />
        ) : myCamera ? (
          <VideoTrack
            trackRef={myCamera}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 18,
            }}
          >
            카메라를 켜주세요
          </div>
        )
      ) : (
        /* =================================================
           👨‍🎓 학생 화면
        ================================================= */
        <>
          {/* 중앙: 선생님 화면만 */}
          {teacherScreenShares.length > 0 ? (
  <VideoTrack
    trackRef={teacherScreenShares[0]}
    style={{
      width: "100%",
      height: "70%",
      objectFit: "contain",
      background: "#000",
    }}
  />
) : teacherCameras.length > 0 ? (
  <VideoTrack
    trackRef={teacherCameras[0]}
    style={{
      width: "100%",
      height: "70%",
      objectFit: "cover",
    }}
  />
) : (
  <div
    style={{
      width: "100%",
      height: "70%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#aaa",
    }}
  >
    선생님 화면을 기다리는 중입니다
  </div>
)}

          {/* 오른쪽 하단: 내 화면 (캠 or 화면공유) */}
          {showMyPreview && (myScreenShare || myCamera) && (
            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 88,
                width: 240,
                height: 135,
                borderRadius: 12,
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                zIndex: 10,
              }}
            >
              <VideoTrack
                trackRef={myScreenShare || myCamera}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </>
      )}

      {/* 오디오 */}
      <RoomAudioRenderer />

      {/* 컨트롤 */}
      {isTeacher && <ScreenShareButton />}
      {!isTeacher && (
        <StudentControlBar
          showMyPreview={showMyPreview}
          onToggleMyPreview={() => setShowMyPreview((v) => !v)}
        />
      )}
    </div>
  );
}
