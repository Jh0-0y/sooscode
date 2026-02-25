import DatePicker from 'react-datepicker';
import styles from './SnapshotPanel.module.css';
import { useEffect, useState, useRef } from 'react';
import SnapshotItem from './snapshot/SnapshotItem';
import { useSnapshotStore } from '../../store/useSnapshotStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import {
  getSnapshotDetail,
  getSnapshotsByLanguageAndDatePaging,
  deleteSnapshot,
} from '../../services/snapshot/snapshot.api';
import { formatLocalDate } from '../../../../utils/date';

export default function SnapshotPanel() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const classId = usePracticeStore((s) => s.classId);
  const language = usePracticeStore((s) => s.language);

  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 무한스크롤 상태
  const [page, setPage] = useState(0);
  const size = 10;
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const selectedSnapshot = useSnapshotStore((s) => s.selectedSnapshot);
  const setSelectedSnapshot = useSnapshotStore((s) => s.setSelectedSnapshot);
  const loadSelectedHCJSnapshot = useSnapshotStore(
    (s) => s.loadSelectedHCJSnapshot
  );
  const refreshKey = useSnapshotStore((s) => s.refreshKey);

  useEffect(() => {
    if (refreshKey !== 0) {
    // 🔥 refresh로 인한 갱신이면 snapshots를 비우지 않음
    setPage(0);
    setHasMore(true);
    return;
  }
    setSnapshots([]);
    setPage(0);
    setHasMore(true);
  }, [classId, startDate, endDate, language, refreshKey]);

  useEffect(() => {
    if (!classId || !startDate || !endDate) return;
    if (!hasMore) return;

    let cancelled = false;

    const fetchSnapshots = async () => {
      try {
        setLoading(true);

        const result = await getSnapshotsByLanguageAndDatePaging({
          classId,
          language,
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
          page,
          size,
        });

        if (cancelled) return;

        setSnapshots((prev) =>
          page === 0 ? result.content : [...prev, ...result.content]
        );

        setHasMore(!result.last);
      } catch (e) {
        console.error('스냅샷 목록 조회 실패', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSnapshots();

    return () => {
      cancelled = true;
    };
  }, [classId, startDate, endDate, language, refreshKey, page, hasMore]);

  useEffect(() => {
    if (!hasMore || loading) return;

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

  const handleClick = async (snapshot) => {
    try {
      const fullSnapshot = await getSnapshotDetail({
        classId,
        snapshotId: snapshot.codeSnapshotId,
      });

      setSelectedSnapshot(fullSnapshot);
      loadSelectedHCJSnapshot(fullSnapshot);
    } catch (e) {
      console.error('스냅샷 단건 조회 실패', e);
    }
  };

  const handleDeleteSnapshot = async (snapshotId) => {
    await deleteSnapshot({ classId, snapshotId });

    if (selectedSnapshot?.snapshotId === snapshotId) {
      setSelectedSnapshot(null);
    }

    setSnapshots((prev) =>
      prev.filter((s) => s.codeSnapshotId !== snapshotId)
    );
  };

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

        <div className={styles.snapshotItemContainer}>
          {!loading && snapshots.length === 0 && (
            <div className={styles.empty}>데이터가 없습니다.</div>
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
            <div className={styles.loading}>로딩중...</div>
          )}
        </div>
      </div>
    </div>
  );
}
