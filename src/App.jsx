import AppRoute from "./routes/AppRoute.jsx";
import GlobalLoading from "@/common/components/utils/GlobalLoading.jsx";
import Toast from "@/common/components/utils/Toast";
import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import {useDarkMode} from "@/hooks/useDarkMode.js";
import {useEffect} from "react";
import {useUser} from "@/hooks/useUser.js";
import {useLoading} from "@/hooks/useLoading.js";

export default function App() {
    useDarkMode();
    const { fetchUser } = useUser();
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        const load = async () => {
            showLoading();
            try {
                await fetchUser();   // fetchUser() 끝날 때까지 대기
            } finally {
                hideLoading();       // 이후에 로딩 종료
            }
        };

        load();
    }, []);

    return <>
        <GlobalLoading />
        <Toast />
        <AppRoute />
    </>
}
