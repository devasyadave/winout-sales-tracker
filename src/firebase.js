// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6RZfgE3zJkrJ4YM3QRu9rqsqT2Z0a5D0",
    authDomain: "winoutsalestracker.firebaseapp.com",
    projectId: "winoutsalestracker",
    storageBucket: "winoutsalestracker.appspot.com",
    messagingSenderId: "715608959686",
    appId: "1:715608959686:web:c541df001567d1e3e105c7",

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
export const auth = getAuth(app);
