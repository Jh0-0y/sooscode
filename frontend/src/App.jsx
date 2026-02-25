import AppRoute from "./routes/AppRoute.jsx";
import GlobalLoading from "@/common/components/utils/GlobalLoading.jsx";
import Toast from "@/common/components/utils/Toast";
import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import {useDarkMode} from "@/hooks/useDarkMode.js";
import AuthGate from "@/routes/AuthGate.jsx";

export default function App() {
    useDarkMode();


    return <>
        <GlobalLoading />
        <Toast />
        <AuthGate>
            <AppRoute />
        </AuthGate>
    </>
}
