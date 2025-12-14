import DatePicker from 'react-datepicker';
import styles from './SnapshotPanel.module.css';
import { useEffect, useState } from 'react';
import SnapshotItem from './snapshot/snapshotItem';
import { useSnapshotStore } from '../../store/useSnapshotStore';
import { usePracticeStore } from '../../store/usePracticeStore';
import { getSnapshotsByLanguageAndDate } from '../../services/snapshot/snapshot.api';
import { formatLocalDate } from '../../../../utils/date';

export default function SnapshotPanel() {
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const classId = usePracticeStore((s) => s.classId);
  const [snapshots, setSnapshots] = useState([]);
  const language = usePracticeStore((s) => s.language);

  // 실질적으로 최초로딩 시 작동하는 쿼리
  const setSelectedSnapshot = useSnapshotStore(
    (state) => state.setSelectedSnapshot
  );

  // 스냅샷 클릭시 fetch
  const handleClick = async (snapshot) => {
  console.log("선택한 스냅샷", snapshot);
  setSelectedSnapshot(snapshot);
  };

  const refreshKey = useSnapshotStore((s) => s.refreshKey);

  useEffect(() => {
    // 최초 로딩시 classId null 일때 [] 로 에러 방어
    if (!classId) {
    setSnapshots([]);
    return;
    }
    if (!startDate || !endDate) return;

    const fetchSnapshots = async () => {
      try {
        const result = await getSnapshotsByLanguageAndDate({
          classId,
          language: language,
          startDate: formatLocalDate(startDate),
          endDate: formatLocalDate(endDate),
        });
        setSnapshots(result);
      } catch (e) {
        console.error("스냅샷 조회 실패", e);
      }
    };

  fetchSnapshots();
  }, [classId,startDate, endDate, refreshKey,language]);


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
        <div className={styles.snapshotItemTitle}>
        </div>
        <div className={styles.snapshotItemContainer}>
          {snapshots.length === 0 && (
            <div className={styles.empty}>
              데이터가 없습니다.
            </div>
          )}
          {snapshots.map((snapshot) => (
            <SnapshotItem
              key={snapshot.snapshotId}
              snapshot={snapshot}
              onClick={() => handleClick(snapshot)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}