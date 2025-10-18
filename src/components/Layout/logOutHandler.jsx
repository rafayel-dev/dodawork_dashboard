import { useSelector } from "react-redux";

export const handleLogout = () => {
    const { logout } = useSelector((state) => state.auth);

    localStorage.removeItem("accessToken");
    logout()
    if (window !== undefined) {
        window.location.reload();
    }
};