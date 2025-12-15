
import HeaderBar from "@/features/mypage/components/HeaderBar";
import LectureCard from "@/features/mypage/components/LectureCard";
import ProfileCard from "@/features/mypage/components/ProfileCard";
import styles from "./Mypage.module.css";
import defaultImg from "@/assets/img1.jpg";
import { useUser } from "../../hooks/useUser";
import { useMyClasses } from "../../features/mypage/services/mypageService";
import { Navigate, useNavigate } from "react-router-dom";

export default function Mypage() {

  const { user} = useUser();
  const { data, isLoading, error } = useMyClasses();
  const navigate = useNavigate();

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>데이터 로딩 실패</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div>
          <HeaderBar/>
          <ProfileCard
            name={user.name}
            email={user.email}
            imageUrl={defaultImg}
          />

    <div className={styles.wrapper}>
        <div className={styles.gridContainer}>
            {data.map((item) => (
              <LectureCard
                key={item.classId}
                title={item.title}
                teacher={item.teacherName}
                imageUrl={item.thumbnailUrl ?? defaultImg}
                onClick={() => {
                  if (user.role === "STUDENT") {
                    navigate(`/classdetail/student?classId=${item.classId}`);
                  } else {
                    navigate(`/classdetail/instructor?classId=${item.classId}`);
                  }
                }}
                classId={item.classId}
              />
            ))}
        </div>
    </div>
</div>
  );
}
