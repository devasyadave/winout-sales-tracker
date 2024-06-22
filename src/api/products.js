import { collection, addDoc, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase';
import { getAuth } from "firebase/auth";
import { isAdmin } from "./user_profiles";
import { dialogClasses } from "@mui/material";
export const getAllProducts = async () => {
    const auth = getAuth();
    try {
        const records = await getDocs(collection(db, "products"))
        console.log(auth.user)
        const isAdminUser = await isAdmin(auth.currentUser.uid);
        if (isAdminUser) {
            const rates = await getDocs(collection(db, "product_meta"))
            const res = records.docs.map((prod_doc) => {
                let rate = rates.docs.find((rate_doc) => rate_doc.id == prod_doc.id)
                let prod_data = prod_doc.data()
                if (rate) prod_data.rate = rate.data().rate
                return prod_data
            })
            console.log(rates)
            return res
        }
        const res = records.docs.map(doc => doc.data());

        console.log(res)
        return res
    }
    catch (e) {
        throw (e)
    }
}

export const storeProduct = async (product_data) => {
    try {
        let prod_obj = { ...product_data }
        let rate_obj = { rate: parseInt(product_data.rate) }
        delete prod_obj["rate"];
        console.log(String(prod_obj.product_id))
        await setDoc(doc(db, "products", String(prod_obj.product_id)), { ...prod_obj });
        await setDoc(doc(db, "product_meta", String(prod_obj.product_id)), { ...rate_obj });
    }
    catch (e) {
        //console.log(prod_obj)
        throw e
    }
}

export const updateProduct = async (product_data) => {
    try {
        let prod_obj = { ...product_data }
        let rate_obj = { rate: parseInt(product_data.rate) }
        delete prod_obj["rate"];
        const productDocRef = doc(db, 'products', product_data.product_id)
        const prodMetaDocRef = doc(db, 'product_meta', product_data.product_id)
        const res = await updateDoc(productDocRef, { ...prod_obj })
        await updateDoc(prodMetaDocRef, { ...rate_obj })
        console.log(res)
    }
    catch (e) {
        throw (e)
    }
}

