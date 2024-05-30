import { collection, addDoc, getDoc, doc, updateDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase';

export const getUserProfile = async (user_id) => {
    const docRef = doc(db, 'user_profiles', user_id)
    try {
        const userProfile = await getDoc(docRef)
        return userProfile.data()
    }
    catch (e) {
        throw e
    }

}

export const storeUserProfile = async (user_id, user_profile) => {
    try {
        await setDoc(doc(db, "user_profiles", user_id), { ...user_profile });
    }
    catch (e) {
        throw e
    }
}

export const getAllUserProfiles = async () => {
    try {
        const records = await getDocs(collection(db, "user_profiles"))
        const res = records.docs.map(doc => { return { id: doc.id, ...doc.data() } });
        return res
    } catch (error) {
        throw error
    }
}

export const toggleUserActivation = async (id, value) => {
    try {
        const docRef = doc(db, 'user_profiles', id)
        const res = await updateDoc(docRef, { isActive: value })
        console.log(res)
    }
    catch (e) {
        throw (e)
    }
}