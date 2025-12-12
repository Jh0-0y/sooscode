import DatePicker from 'react-datepicker';
import { useSnapshots } from '../../services/snapshot/snapshot.queries';
import styles from './SnapshotPanel.module.css';
import AsyncBoundary from '../common/AsyncBoundary';
import { useEffect, useState } from 'react';
import SnapshotItem from './snapshot/snapshotItem';
import { useSnapshotStore } from '../../store/useSnapshotStore';

export default function SnapshotPanel() {
  const today = new Date();

  const LANGS = ["JAVA", "PYTHON", "JS", "HTML", "CSS"];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [selectedLangs, setSelectedLangs] = useState(new Set(["java"]));
  const classId = 1;

  // 실질적으로 최초로딩 시 작동하는 쿼리
  const snapshotQuery = useSnapshots(classId, 0, 3);
  const setSelectedSnapshot = useSnapshotStore(
    (state) => state.setSelectedSnapshot
  );
  const refreshKey = useSnapshotStore((s) => s.refreshKey);

  // 스냅샷 클릭시 fetch
  const handleClick = async (snapshot) => {
  console.log("선택한 스냅샷", snapshot);
  setSelectedSnapshot(snapshot);
  const result = await snapshotQuery.refetch();
  console.log("📌 Snapshot Test Result:", result);
  };

  // 언어 선택 (filter) 삭제할듯
  // const toggleLang = (lang) => {
  // setSelectedLangs(prev => {
  //     const next = new Set(prev);
  //     if (next.has(lang)) {
  //       next.delete(lang);
  //     } else {
  //       next.add(lang);
  //     }
  //     return next;
  //   });
  // };

  // 전체 선택
  const selectAll = () => {
    setSelectedLangs(new Set(LANGS));
  };
  // 초기화
  const clearAll = () => {
    setSelectedLangs(new Set());
  };

  // 렌더링시 console
  useEffect(() => {
    console.log(
      "선택된 언어들:",
      Array.from(selectedLangs)
    );
  }, [selectedLangs]);

  useEffect(() => {
  console.log("🔄 snapshot refreshKey 변경 → refetch");
  snapshotQuery.refetch();
}, [refreshKey]);




  return (
    <AsyncBoundary
      isLoading={snapshotQuery.isLoading}
      isError={snapshotQuery.isError}
      error={snapshotQuery.error}
      loadingFallback={<div>스냅샷 불러오는 중...</div>}
      errorFallback={<div>스냅샷 로딩 실패</div>}
    >

      <div className={styles.selectLang}>
        {/* <div className={styles.langSelectButtonContainer}>
          {LANGS.map((lang) => (
          <button
            key={lang}
            onClick={() => toggleLang(lang)}
            className={
              selectedLangs.has(lang)
                ? styles.langBtnActive
                : styles.langBtn
            }
          >
            {lang.toUpperCase()}
          </button>
        ))}

        </div> */}
        
        {/* <div className={styles.langButtonContainer}>
          <button onClick={selectAll} className={styles.langActionBtn}>
            전체
          </button>
          <button onClick={clearAll} className={styles.langActionBtn}>
            초기화
          </button>
        </div> */}
        
      </div>

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