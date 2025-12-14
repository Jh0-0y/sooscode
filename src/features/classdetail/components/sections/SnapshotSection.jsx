import { useState, useMemo, useEffect } from "react";
import ClassDateSlider from "../ClassDateSlider";
import ClassSnapshotViewer from "../ClassSnapshotViewer";
import CodeModal from "../CodeModal";
import styles from "./SnapshotSection.module.css";
import { generateDateRange } from "@/features/classdetail/utils/generateDateRange";
import MobileDatePicker from "../MobileDatePicker";

export default function SnapshotSection({ snapshots }) {

  // 1) 스냅샷이 존재하는 날짜 리스트 추출
  const snapshotDates = useMemo(() => {
    return snapshots?.content?.map(snap =>
      snap.createdAt.split("T")[0]
    ) ?? [];
  }, [snapshots]);
  const today = new Date().toISOString().split("T")[0];
  const todayRaw = new Date().toISOString().split("T")[0];

  // 2) 수업 기간은 임시로 하드코딩 (나중엔 ClassInfo 데이터로 대체)
  const dates = useMemo(() => {
    return generateDateRange(
      "2025-11-01",   // TODO: classInfo.startDate
      "2025-12-31",   // TODO: classInfo.endDate
      snapshotDates
    );
  }, [snapshotDates]);

  // 3) 초기 선택 날짜
  const [selected, setSelected] = useState(today);

  // 4) 필터링된 스냅샷 목록
  const filteredSnapshots =
    snapshots?.content?.filter((snap) => {
      const snapDate = snap.createdAt.split("T")[0];
      return snapDate === selected;
    }) ?? [];

  // 5) 모달 상태
  const [open, setOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedSnapshot(item);
    setOpen(true);
  };

  return (
    <div className={styles.detailSnapshotWrapper}>
      <div className={styles.detailSnapshotSection}>
        <div className={styles.slider}>
          <ClassDateSlider
            dates={dates}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

      <div className={styles.mobileDatePicker}>
      <MobileDatePicker
        dates={dates}
        selected={selected}
        onSelect={setSelected}
      />
      </div>

      <div className={styles.snapshotContainer}>
        {filteredSnapshots.length > 0 ? (
          filteredSnapshots.map((snap) => (
            <ClassSnapshotViewer
              key={snap.snapshotId}
              filename={snap.title}
              code={snap.content}
              onExpand={() =>
                handleOpenModal({
                  title: snap.title,
                  content: snap.content,
                })
              }
            />
          ))
        ) : (
          <div>해당 날짜에 스냅샷이 없습니다.</div>
        )}
      </div>

      <CodeModal
        open={open}
        onClose={() => setOpen(false)}
        title={selectedSnapshot?.title}
        code={selectedSnapshot?.content}
      />
      </div>
    </div>
  );
}
