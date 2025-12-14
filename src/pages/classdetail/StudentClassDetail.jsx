import { useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import ProfileCard from "@/features/mypage/components/ProfileCard";
import LectureCard from "@/features/mypage/components/LectureCard";

import ClassDetailTopBar from "@/features/classdetail/components/ClassDetailTopBar";
import ClassDetailTabs from "@/features/classdetail/components/ClassDetailTabs";

import { useUser } from "@/hooks/useUser";
import { useMyClasses } from "@/features/mypage/services/mypageService";
import { useSnapshots } from "@/features/classdetail/services/snapshotService";

import defaultImg from "@/assets/img1.jpg";
import styles from "./InstructorClassDetail.module.css";
import { useClassInfo } from "../../features/classdetail/services/classinfoService";
import SnapshotSection from "@/features/classdetail/components/sections/SnapshotSection";
import { useNavigate } from "react-router-dom";
import FileSection from "../../features/classdetail/components/sections/FileSection";
import NoticeSection from "../../features/classdetail/components/sections/NoticeSection";

export default function InstructorClassDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("snapshot");

  // url을 통해서 classId get
  const [params] = useSearchParams();
  const classId = params.get("classId");

  // user 객체 데이터 get
  const { user } = useUser();
  const { data: myClasses } = useMyClasses();
  const { data: snapshots } = useSnapshots(classId, 0, 3);
  const { data: classInfo } = useClassInfo(classId);
  const Lecutretitle = classInfo?.title ?? "";

  console.log(myClasses)

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.detailSection}>
        <div className={styles.contentContainer}>
          <ClassDetailTopBar
            title={Lecutretitle}
            classId={classId}
          />
          <ClassDetailTabs 
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab)}
          />
          {activeTab === "snapshot" && (<SnapshotSection snapshots={snapshots}/>)}
          <div className={styles.fileTabWrapper}>
            <div className={styles.fileTab}>
              {activeTab === "files" && <FileSection classId={classId}/>}
            </div>
          </div>
          {activeTab === "notice" && <NoticeSection/>}
        </div>
      </div>
    </div>

    
  );
}
