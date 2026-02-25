import { useTracks, VideoTrack } from "@livekit/components-react";
import { Track } from "livekit-client";

// 내 로컬캠
export default function LocalCameraVideo() {
  const tracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  return (
    <>
      {tracks
        .filter((t) => t.participant?.isLocal)
        .map((track) => (
          <VideoTrack
            key={track.publication.trackSid}
            trackRef={track}
            style={{ width: "100%", height: "100%" }}
          />
        ))}
    </>
  );
}
