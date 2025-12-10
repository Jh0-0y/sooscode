import { useState } from "react";
import SnapshotModal from "./SnapshotModal";
import SnapshotList from "./SnapshotList";
import { useSnapshot } from "@/features/snapshot/hooks/useSnapshot.js";
import styles from "../styles/SnapshotPanel.module.css";


const SnapshotPanel =() =>{
    //data
    const {
        snapshots,
        loading,
        handleSaveSnapshot,
        handleRestoreSnapshot
    }= useSnapshot();

    //상태관리 변수
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //이벤트 핸들러
    const onSaveClick =()=>{
        setIsModalOpen(true);
    }
    //모달
    const onModalConfirm = async (title) =>{
        const success = await handleSaveSnapshot(title);
        if (success){
            setIsModalOpen(false);
        }
    }

    //리스트 아이템 선택
    const handleSelect = (snapshot) =>{
        setSelectedId(snapshot.snapshotId);
    };

    return (
        <div className={styles.container}>
            {/* 상단 액션 영역 (저장 버튼) */}
            <div className={styles.header}>
                <button
                    className={styles.saveButton}
                    onClick={onSaveClick}
                    disabled={loading}
                >
                    {loading ? '저장 중...' : '+ 현재 코드 스냅샷 저장'}
                </button>
            </div>

            {/* 하단 리스트 영역 (SnapshotList 컴포넌트 사용) */}
            {(!snapshots || snapshots.length === 0) ? (
                <div className={styles.empty}>저장된 스냅샷이 없습니다.</div>
            ) : (
                <SnapshotList
                    snapshots={snapshots}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                    onRestore={handleRestoreSnapshot}
                    showRestoreButton={true}
                />
            )}
            {/* 제목 입력 모달 */}
            <SnapshotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={onModalConfirm}
            />
        </div>
    );
};
export default SnapshotPanel;
