import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


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
    }
}
