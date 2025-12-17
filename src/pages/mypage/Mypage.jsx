import HeaderBar from "@/features/mypage/components/HeaderBar";
import LectureCard from "@/features/mypage/components/LectureCard";
import ProfileCard from "@/features/mypage/components/ProfileCard";
import styles from "./Mypage.module.css";
import defaultImg from "@/assets/img1.jpg";
import { useUser } from "../../hooks/useUser";
import { useMyClassesInfinite } from "../../features/mypage/services/mypageService";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Mypage() {
  const { user } = useUser();
  console.log(user);
  const navigate = useNavigate();
  console.log(user);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyClassesInfinite();

  const loadMoreRef = useRef(null);

  useEffect(() => {
    console.log("🔍 infinite data:", data);
    console.log("🔍 pages:", data?.pages);
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // onair 상태감지 (기존 그대로)
  const isOnAirNow = (item) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    if (today < startDate || today > endDate) return false;

    const [sh, sm, ss] = item.startTime.split(":").map(Number);
    const [eh, em, es] = item.endTime.split(":").map(Number);

    const startTime = new Date(today);
    startTime.setHours(sh, sm, ss || 0);

    const endTime = new Date(today);
    endTime.setHours(eh, em, es || 0);

    return now >= startTime && now <= endTime;
  };

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>데이터 로딩 실패</div>;
  if (!user) return <div>Loading...</div>;

  const classes =
  data?.pages.flatMap(
    (page) => page?.content ?? []
  ) ?? [];

  return (
    <div>
      <HeaderBar />

      <ProfileCard
        name={user.name}
        email={user.email}
        imageUrl={user.profileImage || defaultImg}
      />

      <div className={styles.wrapper}>
        <div className={styles.gridContainer}>
          {classes.map((item) => (
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
              isOnAir={isOnAirNow(item)}
            />
          ))}
        </div>

        {/* 🔻 무한스크롤 트리거 */}
        <div ref={loadMoreRef} style={{ height: 1 }} />

        {isFetchingNextPage && <div>불러오는 중...</div>}
      </div>
    </div>
  );
}
