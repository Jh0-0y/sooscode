import {
  useTracks,
  VideoTrack,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import StudentControlBar from "./StudentControlBar";
import styles from "./ClassroomStage.module.css";
import InstructorControlBar from "./InstructorControlBar";
import MultiView from "./MultiView";
import { useRoomContext } from "@livekit/components-react";

export default function ClassroomStage({ isTeacher }) {
  const [showMyPreview, setShowMyPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMultiView, setIsMultiView] = useState(false);
  const [focusedParticipant, setFocusedParticipant] = useState(null);

  const room = useRoomContext();
  if (!room) {
    return <div className={styles.stage}>LiveKit 연결중...</div>;
  }

  /* ===============================
     Track 수집
  =============================== */
  const tracks = useTracks(
    [
      { source: Track.Source.ScreenShare, withPlaceholder: false },
      { source: Track.Source.Camera, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const remoteParticipants = Array.from(room.remoteParticipants.values());

  const cameraTrackRefs = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.Camera &&
      !t.participant?.isLocal
  );

  // 화면공유 트랙 수집 (선생님 + 학생 전부, 멀티뷰용)
  const screenShareTrackRefs = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.ScreenShare &&
      !t.participant?.isLocal
  );

  /* ===============================
     멀티뷰 데이터 (선생님 전용)
     👉 학생 화면공유도 여기서는 보여야 함
  =============================== */
  const multiViewParticipants = remoteParticipants.map((p) => {
    const screenShareTrackRef = screenShareTrackRefs.find(
      (t) => t.participant?.identity === p.identity
    );

    const cameraTrackRef = cameraTrackRefs.find(
      (t) => t.participant?.identity === p.identity
    );

    // 화면공유 ON 판단
    const isScreenSharing =
      screenShareTrackRef &&
      !screenShareTrackRef.publication.isMuted &&
      !!screenShareTrackRef.publication.track;

    // 카메라 ON 판단
    const isCameraOn =
      cameraTrackRef &&
      !cameraTrackRef.publication.isMuted &&
      !!cameraTrackRef.publication.track;

    // 멀티뷰에 보여줄 트랙
    // (지금은 카메라 기준, 필요하면 화면공유 우선으로 변경 가능)
    let displayTrackRef = null;

if (isScreenSharing) {
  displayTrackRef = screenShareTrackRef;
} else if (isCameraOn) {
  displayTrackRef = cameraTrackRef;
}
    return {
      identity: p.identity,
      trackRef: displayTrackRef,
      isScreenSharing,
      isCameraOn,
    };
  });

  /* ===============================
     Local Track
  =============================== */
  const myCamera = tracks.find(
    (t) =>
      t.publication?.source === Track.Source.Camera &&
      t.participant?.isLocal &&
      !t.publication.isMuted &&
      !!t.publication.track
  );

  const myScreenShare = tracks.find(
    (t) =>
      t.publication?.source === Track.Source.ScreenShare &&
      t.participant?.isLocal
  );

  /* ===============================
     Remote Track (기존 로직 유지)
     👉 멀티뷰에서 사용됨
  =============================== */
  const remoteScreenShareTracks = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.ScreenShare &&
      !t.participant?.isLocal
  );

  const remoteCameraTracks = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.Camera &&
      !t.participant?.isLocal &&
      !t.publication.isMuted &&
      !!t.publication.track
  );

  /* ===============================
     학생 화면 전용
     👉 "선생님 트랙만" 필터링
  =============================== */
  const teacherIdentity = "teacher"; // ⚠️ 실제 identity에 맞게 수정

  const teacherScreenShareTracks = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.ScreenShare &&
      !t.participant?.isLocal &&
      t.participant?.identity === teacherIdentity
  );

  const teacherCameraTracks = tracks.filter(
    (t) =>
      t.publication?.source === Track.Source.Camera &&
      !t.participant?.isLocal &&
      !t.publication.isMuted &&
      !!t.publication.track &&
      t.participant?.identity === teacherIdentity
  );

  /* ===============================
     포커스 학생 (선생님 화면)
  =============================== */
  const focusedTrack =
    cameraTrackRefs.find((t) => {
      if (t.participant?.identity !== focusedParticipant) return false;
      return !t.publication.isMuted && !!t.publication.track;
    }) ?? null;

  /* ===============================
     전체화면
  =============================== */
  const toggleFullscreen = async () => {
    const el = document.querySelector(`.${styles.myPreviewWrapper}`);
    if (!el) return;

    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  /* ===============================
     Debug
  =============================== */
  useEffect(() => {
    console.group("🎥 Camera Track Status");
    tracks
      .filter((t) => t.publication?.source === Track.Source.Camera)
      .forEach((t) => {
        const isCameraOn =
          !t.publication.isMuted && !!t.publication.track;

        console.log(
          `[${t.participant.isLocal ? "LOCAL" : "REMOTE"}] ${t.participant.identity}`,
          {
            camera: isCameraOn ? "ON" : "OFF",
            muted: t.publication.isMuted,
            hasTrack: !!t.publication.track,
          }
        );
      });
    console.groupEnd();
  }, [tracks]);

  /* ===============================
     Render
  =============================== */
  return (
    <div className={styles.stage}>
      {isTeacher ? (
        focusedTrack ? (
          <VideoTrack
            trackRef={focusedTrack}
            className={styles.teacherVideoContain}
          />
        ) : isMultiView ? (
          <MultiView
            participants={multiViewParticipants}
            onSelectParticipant={setFocusedParticipant}
          />
        ) : myScreenShare ? (
          <VideoTrack
            trackRef={myScreenShare}
            className={styles.teacherVideoContain}
          />
        ) : myCamera ? (
          <VideoTrack
            trackRef={myCamera}
            className={styles.teacherVideoCover}
          />
        ) : (
          <div className={styles.teacherEmpty}>
            카메라가 꺼져 있습니다
          </div>
        )
      ) : (
        <>
          {/* ===============================
              학생 메인 화면
              👉 선생님 화면만 표시
          =============================== */}
          {teacherScreenShareTracks.length > 0 ? (
            <VideoTrack
              trackRef={teacherScreenShareTracks[0]}
              className={styles.studentMainContain}
            />
          ) : teacherCameraTracks.length > 0 ? (
            <VideoTrack
              trackRef={teacherCameraTracks[0]}
              className={styles.studentMainCover}
            />
          ) : (
            <div className={styles.studentWaiting}>
              선생님 화면을 기다리는 중입니다
            </div>
          )}

          {/* 내 화면 미리보기 */}
          {showMyPreview && (myScreenShare || myCamera) && (
            <div className={styles.myPreviewWrapper}>
              <button
                className={styles.fullScreenToggle}
                onClick={toggleFullscreen}
              >
                전체화면
              </button>
              <VideoTrack
                trackRef={myScreenShare || myCamera}
                className={styles.myPreviewVideo}
              />
            </div>
          )}
        </>
      )}

      <RoomAudioRenderer />

      {isTeacher ? (
        <InstructorControlBar
          onToggleMultiView={() => {
            setFocusedParticipant(null);
            setIsMultiView((v) => !v);
          }}
          isMultiView={isMultiView}
          onGoMyView={() => setFocusedParticipant(null)}
        />
      ) : (
        <StudentControlBar
          showMyPreview={showMyPreview}
          onToggleMyPreview={() => setShowMyPreview((v) => !v)}
        />
      )}
    </div>
  );
}
