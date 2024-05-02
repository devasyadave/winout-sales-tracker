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

export const getSalesRecordsByUser = async (user_id) => {

    try {
        const records = await getDocs(collection(db, "sales_lots"), { user_id: user_id })

        const res = records.docs.map(doc => { return { id: doc.id, ...doc.data() } });

        return res
    }
    catch (e) {
        throw (e)
    }
}