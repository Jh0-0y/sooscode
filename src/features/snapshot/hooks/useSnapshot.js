import {create} from "zustand";
import {useParams} from "react-router-dom";
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
    setSnapshots: (snapshots) => set({ snapshots }),
    setLoading: (loading) => set({ loading }),
}));

export const useSnapshot = () => {
    const { classId: paramClassId } = useParams();
    const classId = Number(paramClassId);

    const { code, setCode } = useCode();
    const { handleError } = useError();
    const toast = useToast();

    const snapshots = snapshotStore((state) => state.snapshots);
    const loading = snapshotStore((state) => state.loading);
    const setSnapshots = snapshotStore((state) => state.setSnapshots);
    const setLoading = snapshotStore((state)=> state.setLoading);

    const fetchSnapshots = useCallback(async ()=>{
        if (!classId) return;
        try{
            const response = await snapshotService.getAll(classId);
            setSnapshots(response.content || []);
        }catch (error){
            console.error(error);
            handleError(error);
        }
     }, [classId, setSnapshots, handleError]);

    useEffect(() => {
        fetchSnapshots();
    }, [fetchSnapshots]);

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
                await fetchSnapshots();
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
        if (window.confirm(`'${snapshot.title}' 스냅샷을 불러오시겠습니까? 현재 작성 중인 코드가 덮어씌워집니다`)){
            setCode(snapshot.content);
        }
    };
    return{
        snapshots,
        loading,
        handleSaveSnapshot,
        handleRestoreSnapshot
    };
};