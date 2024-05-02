import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';

export const addSalesLot = async (sales_lot) => {
    try {
        const docRef = await addDoc(collection(db, "sales_lots"), { ...sales_lot });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw (e);
    }
}

export const updateSalesLot = async (sales_lot) => {
    try {
        const docRef = doc(db, 'sales_lots', sales_lot.id)
        const res = await updateDoc(docRef, { ...sales_lot })
        console.log(res)
    }
    catch (e) {
        throw (e)
    }
}

