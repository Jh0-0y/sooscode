import { useEffect, useState, useCallback } from "react";
import SnapshotList from "./SnapshotList";
import SnapshotRestoreModal from "./SnapshotRestoreModal";
import SnapshotSearchFilter from "./SnapshotSearchFilter";
import SnapshotPagination from "./SnapshotPagination";
import { useSnapshotList } from "@/features/classroom/hooks/snapshot/useSnapshotList.js";
import { snapshotService } from "@/features/classroom/services/snapshotService.js";
import { useClassroomContext } from "@/features/classroom/contexts/ClassroomContext.jsx";
import { useToast } from "@/hooks/useToast.js";
import styles from "./SnapshotPanel.module.css";
import SnapshotDeleteModal from "./SnapshotDeleteModal";

/**
 * 스냅샷 패널 컨테이너 컴포넌트
 * 역할:
 * - 스냅샷 조회/검색/페이지네이션/복원 UI 흐름을 총괄
 * - 스냅샷 목록 상태는 전용 훅(useSnapshotList)에 위임,
 * - 화면 구성 및 사용자 인터랙션 제어만 담당
 */
const SnapshotPanel = ({onRestore}) => {
    const { classId } = useClassroomContext();
    const toast = useToast();
    /**
     * 스냅샷 목록 관련 상태 및 액션은 전용 훅에서 제공
     * 이 컴포넌트는 상태의 소유자가 아니라 소비자 역할만 수행
     */
    const {
        snapshots,
        loading,
        page,
        totalPages,
        filters,
        mode,
        fetchRecentSnapshots,
        fetchSnapshots,
        handlePageChange,
        handleSearch,
        handleRestoreSnapshot,
        resetFilters,
        handleDeleteSnapshot
    } = useSnapshotList(onRestore);
    /**
     * 복원 대상 스냅샷
     */
    const [restoreTarget, setRestoreTarget] = useState(null);
    /**
     *  삭제 대상 스냅샷
     */
    const [deleteTarget, setDeleteTarget] = useState(null);
    /**
     * 스냅샷 상세 조회 중복 호출 방지용 상태
     */
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (classId) {
            fetchRecentSnapshots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId]);

    /**
     * 현재 목록이 최근 보기 모드인지 여부
     */
    const isRecentMode = mode === 'recent';

    /**
     * 전체 보기 전환 처리
     */
    const handleViewAll = useCallback(() => {
        resetFilters();
        fetchSnapshots(0, { title: '' });
    }, [resetFilters, fetchSnapshots]);

    /**
     * 키보드 단축키 처리
     * 제공 기능:
     * - ← / → : 페이지 이동
     * - ESC   : 검색 중일 경우 전체 목록으로 복귀
     */
    useEffect(() => {
        if (restoreTarget || deleteTarget) return; // 모달이 떠있으면 동작 안함

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') handlePageChange(page - 1);
            if (e.key === 'ArrowRight') handlePageChange(page + 1);

            if (e.key === 'Escape') {
                if (filters.title) {
                    handleViewAll();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page, handlePageChange, restoreTarget, deleteTarget, filters.title, handleViewAll]);


    /**
     * 스냅샷 항목 클릭 처리
     * 동작 흐름:
     *  이미 content가 포함된 경우 → 즉시 복원 모달 오픈
     *  content가 없는 경우 → 상세 조회 API 호출 후 모달 오픈
     */
    const handleSnapshotClick = async (summarySnapshot) => {
        if (!classId || !summarySnapshot.snapshotId) return;
        if (detailLoading) return;

        if (summarySnapshot.content) {
            setRestoreTarget(summarySnapshot);
            return;
        }
        setDetailLoading(true);
        try {
            const detailData = await snapshotService.getDetail(classId, summarySnapshot.snapshotId);
            setRestoreTarget({
                ...summarySnapshot,
                content: detailData.content
            });
        } catch (error) {
            console.error("스냅샷 상세 조회 실패:", error);
            toast.error("스냅샷 내용을 불러오지 못했습니다.");
        } finally {
            setDetailLoading(false);
        }
    };

    /**
     *  삭제 버튼 클릭 핸들러
     */
    const handleDeleteClick = (snapshot) => {
        setDeleteTarget(snapshot);
    };

    /**
     * 삭제 확인 핸들러
     */
    const handleConfirmDelete = async () => {
        if (deleteTarget) {
            await handleDeleteSnapshot(deleteTarget.snapshotId);
            setDeleteTarget(null);
        }
    };

    return (
        <div className={styles.container}>

            <SnapshotSearchFilter
                onSearch={handleSearch}
                value={filters.title}
            />

            <div className={styles.infoBar}>
                {isRecentMode ? (
                    <>
                        <span className={styles.infoText}>최근 내역</span>
                        <button
                            className={styles.viewModeBtn}
                            onClick={handleViewAll}
                        >
                            전체 보기
                        </button>
                    </>
                ) : (
                    <>
                        <span className={styles.infoText}>
                            {filters.title ? `'${filters.title}' 검색 결과` : '전체 목록'}
                        </span>
                        <button
                            className={styles.viewModeBtn}
                            onClick={fetchRecentSnapshots}
                        >
                            최근 보기
                        </button>
                    </>
                )}
            </div>

            <div className={styles.listArea}>

                {snapshots.length > 0 && (
                    <SnapshotList
                        snapshots={snapshots}
                        onSelect={handleSnapshotClick}
                        onDelete={handleDeleteClick}
                    />
                )}
                {!loading && snapshots.length === 0 && (
                    <div className={styles.emptyMessage}>
                        {filters.title ? (
                            <>
                                <p>'{filters.title}' 검색 결과가 없습니다.</p>
                                <button
                                    className={styles.resetSearchBtn}
                                    onClick={handleViewAll}
                                >
                                    전체 목록 보기 (ESC)
                                </button>
                            </>
                        ) : (
                            '스냅샷이 없습니다.'
                        )}
                    </div>
                )}
            </div>
            <SnapshotPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isRecentMode={isRecentMode}
            />

            <SnapshotRestoreModal
                isOpen={!!restoreTarget}
                snapshotTitle={restoreTarget?.title ?? ""}
                snapshotCode={restoreTarget?.content ?? ""}
                onClose={() => setRestoreTarget(null)}
                onConfirm={() => {
                    handleRestoreSnapshot(restoreTarget);
                    setRestoreTarget(null);
                }}
            />

            <SnapshotDeleteModal
                isOpen={!!deleteTarget}
                snapshotTitle={deleteTarget?.title}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
export default SnapshotPanel;