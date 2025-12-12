import {useEffect, useRef, useState} from "react";
import SnapshotModal from "./SnapshotModal";
import SnapshotList from "./SnapshotList";
import { useSnapshot } from "@/features/snapshot/hooks/useSnapshot.js";
import styles from "../styles/SnapshotPanel.module.css";
import SnapshotRestoreModal from "./SnapshotRestoreModal";

const SnapshotPanel =() =>{
    //data
    const {
        snapshots,
        loading,
        hasMore,
        fetchSnapshots,
        handleSaveSnapshot,
        handleRestoreSnapshot
    }= useSnapshot();

    //상태관리 변수
    const [selectedId, setSelectedId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [restoreTarget, setRestoreTarget] = useState(null);
    const observerRef = useRef(null);

    //  무한스크롤
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchSnapshots();
                }
            },
            { threshold: 0.5 } // 50% 로 호출
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchSnapshots, hasMore, loading]);


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
    // 복원 확인하는 모달 핸ㄷ들러
    const onRestoreConfirm = () =>{
        if(restoreTarget){
            handleRestoreSnapshot(restoreTarget);
            setRestoreTarget(null);
        }
    }

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
                    onRestore={(snapshot) => setRestoreTarget(snapshot)}
                    showRestoreButton={true}
                />
            )}
            {/* 제목 입력 모달 */}
            <SnapshotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={onModalConfirm}
            />
            {/*  에디터 불러오기 확인 모달 */}
            <SnapshotRestoreModal
                isOpen={!!restoreTarget}
                onClose={() => setRestoreTarget(null)}
                onConfirm={onRestoreConfirm}
                snapshotTitle={restoreTarget?.title || ''}
            />
        </div>
    );
};
export default SnapshotPanel;
