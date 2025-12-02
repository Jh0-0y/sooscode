// import { useParams } from "react-router-dom";
// import { useClassInfoQuery } from "@/services/class/classHooks";

// import StudentClassHeader from "@/common/classDetail/components/StudentClassHeader";
// import ChatSideBar from "@/features/chat/ChatSideBar";
// import StudentCodeSection from "@/features/codeEditor/layout/StudentCodeSection";
// import VideoPlayer from "@/features/video/VideoPlayer";

// export default function StudentClassJoin() {
//   const { id } = useParams();
//   const { data: classInfo, isLoading } = useClassInfoQuery(id); // Online / Offline 구분 위해 수업 정보 필요

//   if (isLoading) return <div>Loading...</div>; // 로딩 상태 처리
//   if (!classInfo) return <div>수업 정보를 불러올 수 없습니다.</div>; // 에러 처리

//   const isOnline = classInfo.type === "ONLINE"; // 온라인 강의 여부 판단

//   return (
//     <div>
//       {/* ① 온라인 강의일 경우 비디오 추가 */}
//       {isOnline && (
//         <VideoPlayer url={classInfo.videoUrl} />
//       )}

//       {/* ② 헤더에 classInfo 전달 */}
//       <div className="Header-layout">
//         <StudentClassHeader classInfo={classInfo} />
//       </div>

//       {/* ③ 사이드바 / 코드 영역에도 classId 또는 classInfo 전달 */}
//       <div className="Section-layout">
//         <ChatSideBar classId={id} />
//         <StudentCodeSection classInfo={classInfo} classId={id} />
//       </div>
//     </div>
//   );
// }

export default function StudentClassJoin() {
  return <div>수업 참여 페이지 (개발 중)</div>;
}