import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useLoading } from "@/hooks/useLoading";

export default function AuthGate({ children }) {
    const { initAuth, authChecked } = useUser();
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        if (authChecked) return;

        const init = async () => {
            showLoading();
            await initAuth();
            hideLoading();
        };

        init();
    }, [authChecked]);

    if (!authChecked) {
        return null; // GlobalLoading이 대신 보여짐
    }

    return children;
}