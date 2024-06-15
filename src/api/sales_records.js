import { collection, addDoc, getDoc, doc, updateDoc, getDocs, query, orderBy, where } from "firebase/firestore";
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

export const updateSalesLotById = async (id, data) => {
    try {
        const docRef = doc(db, 'sales_lots', id)
        const res = await updateDoc(docRef, { ...data })
        console.log(res)
    }
    catch (e) {
        throw (e)
    }

}

export const getSalesRecordsByUser = async (user_id) => {

    try {
        const docsRef = collection(db, 'sales_lots')
        const records = await getDocs(query(docsRef, where("user_id", "==", user_id), orderBy('created_at', 'desc')))

        const res = records.docs.map(doc => { return { id: doc.id, ...doc.data() } });

        return res
    }
    catch (e) {
        throw (e)
    }
}

export const getAllSalesRecords = async () => {
    try {
        const docRef = collection(db, 'sales_lots')
        const records = await getDocs(query(docRef, orderBy("created_at", "desc")))
        const res = records.docs.map(doc => { return { id: doc.id, ...doc.data() } });

        return res
    }
    catch (e) {
        throw (e)
    }
}