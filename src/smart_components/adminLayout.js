import { Button, Container, Drawer, Typography, Box, Divider } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"
import { LogoutButton } from "./logoutButton";

export const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    //console.log(children)
    return (
        <Container>
            <Typography variant="h4">Admin Dashboard</Typography><LogoutButton></LogoutButton>
            <Divider style={{ marginTop: 5 }} />
            <Drawer open={true} variant="permanent">
                <Button onClick={() => navigate('dashboard')}>Sales</Button>
                <Button onClick={() => navigate('users')}>Users</Button>
            </Drawer>
            <Box marginTop={5}>
                <Outlet />
            </Box>
        </Container>
    )
}   