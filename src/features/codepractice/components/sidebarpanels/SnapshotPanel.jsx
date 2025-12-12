import DatePicker from 'react-datepicker';
import { useSnapshots } from '../../services/snapshot/snapshot.queries';
import styles from './SnapshotPanel.module.css';
import AsyncBoundary from '../common/AsyncBoundary';
import { useState } from 'react';
import SnapshotItem from './snapshot/snapshotItem';
import { useSnapshotStore } from '../../store/useSnapshotStore';

export default function SnapshotPanel() {
  const today = new Date();
  
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const classId = 1;

  const snapshotQuery = useSnapshots(classId, 0, 3);
  const setSelectedSnapshot = useSnapshotStore(
    (state) => state.setSelectedSnapshot
  );

  const handleClick = async (snapshot) => {
  console.log("선택한 스냅샷", snapshot);

  setSelectedSnapshot(snapshot);

  const result = await snapshotQuery.refetch();
  console.log("📌 Snapshot Test Result:", result);
  };

  return (
    <AsyncBoundary
      isLoading={snapshotQuery.isLoading}
      isError={snapshotQuery.isError}
      error={snapshotQuery.error}
      loadingFallback={<div>스냅샷 불러오는 중...</div>}
      errorFallback={<div>스냅샷 로딩 실패</div>}
    >
      <div className={styles.SnapshotPanel}>
        날짜선택

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
          스냅샷List
        </div>


        <div className={styles.snapshotItemContainer}>
          {snapshotQuery.isFetched &&
          snapshotQuery.data?.content?.length === 0 && (
            <div className={styles.empty}>
              데이터가 없습니다.
            </div>
          )}

          {snapshotQuery.data?.content?.map((snapshot) => (
            <SnapshotItem
              key={snapshot.snapshotId}
              snapshot={snapshot}
              onClick={() => handleClick(snapshot)}
            />
          ))}
        </div>



      </div>
    </AsyncBoundary>
  );
}