import DatePicker from 'react-datepicker';
import styles from './SnapshotPanel.module.css';
import { useEffect, useState, useRef } from 'react';
import SnapshotItem from './snapshot/snapshotItem';
import { useSnapshotStore } from '../../store/useSnapshotStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import {
  getSnapshotDetail,
  getSnapshotsByLanguageAndDatePaging
} from '../../services/snapshot/snapshot.api';
import { formatLocalDate } from '../../../../utils/date';
import { deleteSnapshot } from '../../services/snapshot/snapshot.api';

export default function SnapshotPanel() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const classId = usePracticeStore((s) => s.classId);
  const [snapshots, setSnapshots] = useState([]);
  const language = usePracticeStore((s) => s.language);
  const selectedSnapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const triggerRefresh = useSnapshotStore((s) => s.triggerRefresh);

  // ===== 무한 스크롤 상태 =====
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  // 실질적으로 최초로딩 시 작동하는 쿼리
  const setSelectedSnapshot = useSnapshotStore(
    (state) => state.setSelectedSnapshot
  );

  // HCJ Snapshot
  const loadSelectedHCJSnapshot = useSnapshotStore(
    (state) => state.loadSelectedHCJSnapshot
  );

  // 스냅샷 클릭시 fetch
  const handleClick = async (snapshot) => {
    try {
      // 단건 조회
      const fullSnapshot = await getSnapshotDetail({
        classId,
        snapshotId: snapshot.codeSnapshotId,
      });

      // store에 저장
      setSelectedSnapshot(fullSnapshot);
      console.log(fullSnapshot);

      // HCJ면 에디터 주입
      loadSelectedHCJSnapshot(fullSnapshot);

    } catch (e) {
      console.error("스냅샷 단건 조회 실패", e);
    }
  };

  const refreshKey = useSnapshotStore((s) => s.refreshKey);

  const handleDeleteSnapshot = async (snapshotId) => {
    await deleteSnapshot({ classId, snapshotId });

    // 선택된 스냅샷 삭제한 경우 초기화
    if (selectedSnapshot?.snapshotId === snapshotId) {
      setSelectedSnapshot(null);
    }

    triggerRefresh(); // 목록 다시 불러오기
  };

  /**
   * 🔹 필터 변경 시 목록 / 페이지 초기화
   */
  useEffect(() => {
    setSnapshots([]);
    setPage(0);
    setHasMore(true);
  }, [classId, startDate, endDate, language, refreshKey]);

  /**
   * 🔹 페이지 변경 시 데이터 fetch (무한스크롤 핵심)
   */
  useEffect(() => {
    // 최초 로딩시 classId null 일때 [] 로 에러 방어
    if (!classId) {
      setSnapshots([]);
      return;
    }
    if (!startDate || !endDate) return;
    if (!hasMore || loading) return;

    const fetchSnapshots = async () => {
      try {
        setLoading(true);

        const result = await getSnapshotsByLanguageAndDatePaging({
          classId,
          language: language,
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
          page,
          size: 10,
        });

        // Page.content 누적
        setSnapshots((prev) =>
          page === 0
            ? result.content
            : [...prev, ...result.content]
        );

        setHasMore(!result.last);
        console.log("page:", page, "result:", result);
      } catch (e) {
        console.error("스냅샷 조회 실패", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [page]);

  /**
   * 🔹 IntersectionObserver (스크롤 감지)
   */
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div>
      <div className={styles.SnapshotPanel}>
        <div className={styles.dateFilterBar}>
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText="기간 선택"
            className={styles.dateRangeInput}
          />
        </div>

        <div className={styles.snapshotItemTitle} />

        <div className={styles.snapshotItemContainer}>
          {snapshots.length === 0 && !loading && (
            <div className={styles.empty}>
              데이터가 없습니다.
            </div>
          )}

          {snapshots.map((snapshot) => (
            <SnapshotItem
              key={snapshot.codeSnapshotId}
              snapshot={snapshot}
              onClick={() => handleClick(snapshot)}
              onDelete={handleDeleteSnapshot}
            />
          ))}

          {/* 🔻 무한스크롤 트리거 */}
          <div ref={observerRef} style={{ height: 1 }} />

          {loading && (
            <div className={styles.loading}>
              로딩중...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
