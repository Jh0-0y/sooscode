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
const [focusedTrack, setFocusedTrack] = useState(null);
const isTeacherParticipant = (p) => {
  const role = JSON.parse(p.metadata || "{}").role;
  return role === "TEACHER" || role === "INSTRUCTOR";
};

  const room = useRoomContext();
  if (!room) {
    return <div className={styles.stage}>LiveKit 연결중...</div>;
  }

  useEffect(() => {
  if (!room) return;

  console.group("🧪 LiveKit METADATA CHECK");

  console.log("🧑‍💻 LOCAL", {
    identity: room.localParticipant.identity,
    metadata: room.localParticipant.metadata,
    parsed: room.localParticipant.metadata
      ? JSON.parse(room.localParticipant.metadata)
      : null,
  });

  room.remoteParticipants.forEach((p) => {
    console.log("👤 REMOTE", {
      identity: p.identity,
      metadata: p.metadata,
      parsed: p.metadata ? JSON.parse(p.metadata) : null,
    });
  });

  console.groupEnd();
}, [room]);

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

  const teacherScreenShareTracks = tracks.filter(
  (t) =>
    t.publication?.source === Track.Source.ScreenShare &&
    !t.participant?.isLocal &&
    isTeacherParticipant(t.participant)
);


  // 
  const teacherCameraTracks = tracks.filter(
  (t) =>
    t.publication?.source === Track.Source.Camera &&
    !t.participant?.isLocal &&
    isTeacherParticipant(t.participant) && //추가
    !t.publication.isMuted &&
    !!t.publication.track
);

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

  useEffect(() => {
  if (!room) return;

  console.group("🎥 LOCAL PUBLISH STATUS (TEACHER)");
  room.localParticipant.videoTrackPublications.forEach((pub, sid) => {
    console.log({
      sid,
      source: pub.source,
      muted: pub.isMuted,
      hasTrack: !!pub.track,
      trackSid: pub.trackSid,
    });
  });
  console.groupEnd();
}, [room]);

  useEffect(() => {
  tracks.forEach((t) => {
    console.log("🎯 TRACK CHECK", {
      identity: t.participant?.identity,
      role: t.participant?.metadata
        ? JSON.parse(t.participant.metadata).role
        : null,
      source: t.publication?.source,
      isLocal: t.participant?.isLocal,
      muted: t.publication?.isMuted,
      hasTrack: !!t.publication?.track,
    });
  });
}, [tracks]);

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
  onSelectParticipant={(trackRef) => {
    setFocusedTrack(trackRef); 
    setIsMultiView(false);
  }}
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
    setFocusedTrack(null);     
    setIsMultiView((v) => !v);
  }}
  isMultiView={isMultiView}
  onGoMyView={() => setFocusedTrack(null)} 
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
