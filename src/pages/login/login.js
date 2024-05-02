import { auth } from "../../firebase";
import { RecaptchaVerifier } from "firebase/auth";
import { login } from "../../api/auth";
import { Button, Container, TextField, Box, CircularProgress, FormGroup } from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../App";
export const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const auth = useAuth();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsAuthenticating(true)
        console.log(auth.user);
        auth.login(email, password, (user) => {
            setIsAuthenticating(false)
            navigate(from, { replace: true })
        })
    }


    return (
        !auth.user ?
            <Container style={{ position: "absolute", top: "40%" }}>
                <form>
                    <Box>
                        <TextField required type="email" onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Box>
                    <Box>
                        <TextField required type="password" onChange={(e) => setPassword(e.target.value)}></TextField>
                    </Box>
                    <Box>
                        <Button id='sign-in-button' type="submit" onClick={handleSubmit}>{isAuthenticating ? <CircularProgress /> : "Submit"}</Button>
                    </Box>
                </form>
            </Container> : <Navigate to={from}></Navigate>

    )


}