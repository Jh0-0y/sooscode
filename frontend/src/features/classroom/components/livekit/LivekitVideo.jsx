import { useEffect, useState } from "react";
import styles from "./LivekitVideo.module.css";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { livekitService } from "@/features/classroom/services/livekitService";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { useUser } from "../../../../hooks/useUser";
import ClassroomStage from "./ClassroomStage";

export default function LivekitVideo() {
  const { classId } = useClassroomContext();
  const [token, setToken] = useState(null);
  const serverUrl = "wss://sooscode-7wzcousb.livekit.cloud";
  const { user } = useUser();
  // INSTRUCTOR 인식
  const isTeacher = user?.role === "INSTRUCTOR";

  // LiveKit 연결 
  useEffect(() => {
    if (!classId) return;

    const issueToken = async () => {
      try {
        const res = await livekitService.createToken({
          roomName: String(classId),
          role: user?.role,
        });
        setToken(res.token);
      } catch (e) {
        console.error(e);
      }
    };

    issueToken();
  }, [classId]);

  if (!token) {
    return <div className={styles.wrapper}>LiveKit 연결 준비중…</div>;
  }



  return (
    <div className={styles.wrapper}>
      <LiveKitRoom
        token={token}
        serverUrl={serverUrl}
        connect
        audio
        video
        data-lk-theme="default"
        style={{ width: "100%", height: "100%" }}
        options={{
    autoSubscribe: true,
  }}
      >
        <ClassroomStage isTeacher={isTeacher} />
      </LiveKitRoom>
    </div>
  );
}
