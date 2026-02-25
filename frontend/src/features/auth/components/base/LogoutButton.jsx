// src/features/auth/components/base/LogoutButton.jsx
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
    const { logout } = useLogout();

    const buttonStyle = {
        backgroundColor: "#ff4d4f",  // 선명한 레드
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "20px",
        width: "100%",
        transition: "0.2s ease",
    };

    const hoverStyle = {
        backgroundColor: "#d9363e",
    };

    return (
        <button
            onClick={logout}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = hoverStyle.backgroundColor)}
            onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
            로그아웃
        </button>
    );
};

export default LogoutButton;
