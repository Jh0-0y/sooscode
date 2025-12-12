import {create} from "zustand";
// import {useParams} from "react-router-dom";
import {useCode} from "@/features/code/hooks/useCode.js";
import {useToast} from "@/hooks/useToast.js";
import {useCallback, useEffect} from "react";
import {snapshotService} from "@/features/snapshot/service/snapshotService.js";
import { useError } from "@/hooks/useError";

// push 할때 임시 useCode 삭제하고 푸시하는데 올릴때 안터지는용도로
// const useCode =() => ({
//     code:'',
//     setCode: ()=> console.warn('useCode 엄서'),
// });


// zustand 내부 스토어
const snapshotStore = create((set) => ({
    snapshots: [],
    loading: false,
    page: 0,
    hasMore: true,

    setSnapshots: (snapshots) => set({ snapshots }),
    setLoading: (loading) => set({ loading }),

    appendSnapshots: (newSnapshots) => set((state) => ({
        snapshots: [...state.snapshots, ...newSnapshots]
})),
    setPage: (page) => set({ page }),
    setHasMore: (hasMore) => set({ hasMore }),
    reset: ()=>set({snapshots: [], page: 0, hasMore: true, loading: false}),
}));

export const useSnapshot = () => {
    // const { classId: paramClassId } = useParams();
    // const classId = Number(paramClassId);

    const classId = 1;

    const { code, setCode } = useCode();
    const { handleError } = useError();
    const toast = useToast();

    const snapshots = snapshotStore((state) => state.snapshots);
    const loading = snapshotStore((state) => state.loading);
    const hasMore = snapshotStore((state)=> state.hasMore);

    const setSnapshots = snapshotStore((state) => state.setSnapshots);
    const setLoading = snapshotStore((state)=> state.setLoading);
    const appendSnapshots = snapshotStore((state) => state.appendSnapshots);
    const setPage = snapshotStore((state) => state.setPage);
    const setHasMore = snapshotStore((state) => state.setHasMore);
    const reset = snapshotStore((state) => state.reset);
    const page = snapshotStore((state) => state.page);

    useEffect(() => {
        reset();
    }, [classId]);

    const fetchSnapshots = useCallback(async ()=>{
        if (!classId) return;

        try{
            const size =10;
            const response = await snapshotService.getAll(classId, page, size);
            const content = response.content || [];

            if(page === 0){
                setSnapshots(content);
            } else{
                appendSnapshots(content);
            }
            if (response.last || content.length < size){
                setHasMore(false);
            }else{
                setPage(page + 1);
            }

        }catch (error){
            console.error(error);
            handleError(error);
        }finally {
            setLoading(false);
        }
     }, [classId, page, hasMore, loading]);

    useEffect(() => {
        if (page === 0 && hasMore && !loading && snapshots.length === 0) {
            fetchSnapshots();
        }
    }, [page, hasMore, loading, snapshots.length, fetchSnapshots]);

    const handleSaveSnapshot = async (title) =>{
        if (!classId){
            toast.error('클래스 정보가 없습니다');
            return false;
        }
        if (!title.trim()){
            toast.warning('제목을 입력해주세요');
            return false;
        }
        if (!code || !code.trim()){
            toast.warning('저장할 코드가 없습니다');
            return false;
        }

        setLoading(true);
            try {
                await snapshotService.create({
                    classId,
                    title,
                    content: code
                });
                toast.success('스냅샷이 저장되었습니다.');

                reset();
                const response = await snapshotService.getAll(classId,0,10);
                setSnapshots(response.content || []);
                setPage(1);
                setHasMore(!response.last);

                return true;
            }catch (error){
                console.error(error);
                if (error.response){
                    handleError(error);
                }else {
                    toast.error('스냅샷 저장에 실패하였습니다')
                }
                return false;
            }finally{
                setLoading(false);
            }
    };
    const handleRestoreSnapshot = (snapshot) =>{
        if(!snapshot.content){
            toast.error('불러올 코드 내용이 없습니다.');
            return;
        }
        setCode(snapshot.content);
        toast.success('코드를 불러왔습니다');
    };
    return{
        snapshots,
        loading,
        hasMore,
        fetchSnapshots,
        handleSaveSnapshot,
        handleRestoreSnapshot
    };
};