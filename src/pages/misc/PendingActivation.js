import { Container, Typography } from "@mui/material"
import { LogoutButton } from "../../smart_components/logoutButton"


const PendingActivation = () => {


    return (
        <Container>
            <Typography variant="h4">
                Your account is pending verification. Please try again later.
            </Typography>
            <LogoutButton></LogoutButton>
        </Container>
    )
}

export default PendingActivation