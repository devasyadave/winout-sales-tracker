import { redirect, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAuth } from "../App";
export const LogoutButton = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        auth.logout(() => {
            navigate('/')
        })
    }

    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    );
}