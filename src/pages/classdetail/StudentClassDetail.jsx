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
import styles from "./StudentClassDetail.module.css";
import { useClassInfo } from "../../features/classdetail/services/classinfoService";
import SnapshotSection from "@/features/classdetail/components/sections/SnapshotSection";
import { useNavigate } from "react-router-dom";
import FileSection from "../../features/classdetail/components/sections/FileSection";
import NoticeSection from "../../features/classdetail/components/sections/NoticeSection";

export default function StudentClassDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("snapshot");

  // url을 통해서 classId get
  const [params] = useSearchParams();
  const classId = params.get("classId");

  // user 객체 데이터 get
  const { user } = useUser();
  const { data: myClasses } = useMyClasses(0, 10);
  const { data: snapshots } = useSnapshots(classId, 0, 3);
  const { data: classInfo } = useClassInfo(classId);
  const Lecutretitle = classInfo?.title ?? "";

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      
      {/* 왼쪽 프로필 + 클래스 리스트 */}
      <div className={styles.profileSection}>
        
        <div className={styles.profileCardWrapper}>
          <ProfileCard
            name={user.name}
            email={user.email}
            imageUrl={defaultImg}
          />
        </div>

        <div className={styles.lectureSection}>
          {myClasses?.content?.map(item => (
            <LectureCard
              key={item.classId}
              title={item.title}
              teacher={item.teacherName}
              imageUrl={item.thumbnailUrl ?? defaultImg}
              onClick={() => navigate(`/classdetail/student?classId=${item.classId}`)}
            />
          ))}
        </div>
      </div>

      {/* 오른쪽 상세 */}
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

          {activeTab === "snapshot" && (
            <SnapshotSection
              snapshots={snapshots}
            />
          )}

          {/* {activeTab === "notice" && <NoticeSection />} */}
          {activeTab === "files" && <FileSection
           classId={classId}
           />}

          {activeTab === "notice" && <NoticeSection

          />
          
          }
        </div>
      </div>
    </div>

    
  );
}
