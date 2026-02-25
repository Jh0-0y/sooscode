import {useNavigate} from "react-router-dom";
import {api} from "@/services/api";
import {useUser} from "@/hooks/useUser";
import {useToast} from "@/hooks/useToast";

const useLogout = () => {
    const {clearUser} = useUser();
    const navigate = useNavigate();
    const toast = useToast();

    const logout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {withCredentials: true});
        } catch (err) {
            console.log(err)
        }

        clearUser();
        toast.success("로그아웃 되었습니다.");
        navigate("/login");
    };

    return {logout};
};

export default useLogout;
