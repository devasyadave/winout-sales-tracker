import { auth as firebase_auth } from "../../firebase";
import { Button, Container, TextField, Box, CircularProgress, FormGroup } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../App";
import { signInWithPhoneNumber } from "firebase/auth";
import PhoneInput from "react-phone-number-input";
import OtpInput from 'react-otp-input';
import 'react-phone-number-input/style.css'
import { getUserProfile } from "../../api/user_profiles";
import "./login.css"
export const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const auth = useAuth();
    const from = location.state?.from?.pathname || "/";


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("")
    const [phone, setPhone] = useState("");
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false)
    const signInResult = useRef("")

    const verifyOtp = async (e) => {
        e.preventDefault()
        console.log(signInResult)
        try {
            let otp_verification = await signInResult.current.confirm(otp)
            console.log(otp_verification);
            localStorage.setItem('user', JSON.stringify(otp_verification.user))
            auth.setUser(otp_verification.user)
            let user_profile = await getUserProfile(otp_verification.user.uid)

            if (user_profile) {
                navigate("/add_sales_lot", { replace: true })
            }
            else {
                navigate("/create_user_profile", { replace: true })
            }
            console.log(otp_verification);

        }
        catch (e) {
            console.log(e)
            throw (e)
        }

    }
    const perform_sign_in = async (verifier) => {
        console.log(verifier)
        try {
            signInResult.current = await signInWithPhoneNumber(firebase_auth, phone, verifier)
            console.log("auth response ", signInResult)
            setShowOtpField(true)
        }
        catch (e) {
            console.log(e)
            throw (e)
        }

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsAuthenticating(true)
        let verification = await auth.setupRecaptcha(perform_sign_in);
        setIsAuthenticating(false)

    }


    return (
        !auth.user ?
            <Container>
                <Box id="main-content" display="flex" flexDirection="row" justifyContent="center">

                    <form>
                        <Box className="purple-box" padding={10} id="form-container" display="flex" flexDirection="column" height={200} justifyContent="space-evenly" position="relative" top="20vh">
                            {/* <Box>
                        <TextField required type="email" onChange={(e) => setEmail(e.target.value)}></TextField>
                    </Box> */}
                            <Box>
                                <PhoneInput placeholder="Enter phone number"
                                    value={phone}
                                    onChange={setPhone}
                                    countries={['IN']}
                                    addInternationalOption={false} defaultCountry="IN" ></PhoneInput>
                            </Box>
                            {showOtpField && <Box>
                                <OtpInput numInputs={6} value={otp}
                                    onChange={setOtp} renderInput={(props) => <input {...props} />}  ></OtpInput>
                                <Button onClick={verifyOtp} >verify OTP</Button>
                            </Box>}
                            {/* <Box>
                        <TextField required type="password" onChange={(e) => setPassword(e.target.value)}></TextField>
                    </Box> */}
                            {!showOtpField && <Box id="recaptcha-container">

                            </Box>}
                            <Box class="purple-box">
                                {!showOtpField && <Button id='sign-in-button' fullWidth type="submit" onClick={handleSubmit}>{isAuthenticating ? <CircularProgress /> : "Submit"}</Button>}
                            </Box>
                        </Box>
                    </form>

                </Box>
            </Container> : <Navigate to={from}></Navigate>

    )


}