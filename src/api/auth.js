import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
import { getUserProfile } from "./user_profiles";

export const FirebaseAuthProvider = {
    isAuthenticated: false,
    get_user() {
        let user = JSON.parse(localStorage.getItem('user'))
        return user;
    },
    async login(email, password, callback) {
        try {
            let user;
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            console.log(userCredential)
            user = userCredential.user
            let user_profile = await getUserProfile(user.uid)
            if (user_profile) {
                user = { ...user, profile: user_profile }
            }
            localStorage.setItem('user', JSON.stringify(user))
            FirebaseAuthProvider.isAuthenticated = true
            callback(user);
        }
        catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
        };
    },
    async logout(callback) {
        FirebaseAuthProvider.isAuthenticated = false
        localStorage.removeItem('user')
        callback();
    },
    async setupRecaptcha(callback) {
        let recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            'callback': (response) => {
                console.log("recaptcha resolved...");
                callback(recaptchaVerifier);
            }
        });
        recaptchaVerifier.render();
    }
}
