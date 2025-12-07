import AppRouter from "./routes/AppRouter";
import GlobalLoading from "@/common/components/GlobalLoading.jsx";
import Toast from "@/common/components/Toast";
import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import {useDarkMode} from "@/hooks/useDarkMode.js";

export default function App() {
    useDarkMode();

    return <>
        <GlobalLoading />
        <Toast />
        <AppRouter />;
    </>

}
