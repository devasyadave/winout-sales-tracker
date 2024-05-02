import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

export const getUserProfile = async (user_id) => {
    const docRef = doc(db, 'user_profiles', user_id)
    try {
        const userProfile = await getDoc(docRef)
        return userProfile.data()
    }
    catch (e) {
        return null
    }

}