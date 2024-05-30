import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from '../firebase';

export const getAllProducts = async () => {
    try {
        const records = await getDocs(collection(db, "products"))

        const res = records.docs.map(doc => doc.data());


        return res
    }
    catch (e) {
        throw (e)
    }
}

