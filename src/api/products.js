import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
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

export const storeProduct = async (product_data) => {
    try {
        await setDoc(doc(db, "products", product_data.product_id), { ...product_data });
    }
    catch (e) {
        throw e
    }
}

export const updateProduct = async (product_data) => {
    try {
        const docRef = doc(db, 'products', product_data.product_id)
        const res = await updateDoc(docRef, { ...product_data })
        console.log(res)
    }
    catch (e) {
        throw (e)
    }
}

