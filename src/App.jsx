import AppRoute from "./routes/AppRoute.jsx";
import GlobalLoading from "@/common/components/utils/GlobalLoading.jsx";
import Toast from "@/common/components/utils/Toast";
import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import {useDarkMode} from "@/hooks/useDarkMode.js";
import {useEffect} from "react";
import {useUser} from "@/hooks/useUser.js";

export default function App() {
    useDarkMode();
    const { fetchUser } = useUser();

    useEffect(() => {
        fetchUser();
    }, []);

    return <>
        <GlobalLoading />
        <Toast />
        <AppRoute />
    </>
}
