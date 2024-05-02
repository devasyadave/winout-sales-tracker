import { CircularProgress, Autocomplete, Box, Button, Container, Icon, IconButton, TextField, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { addSalesLot, updateSalesLot } from "../../api/sales_records";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { timeout } from "workbox-core/_private";
import { LogoutButton } from "../../smart_components/logoutButton";
import { SalesLotRecord } from "../../smart_components/salesLotRecord";
import { getAllProducts, getSalesRecordsByUser } from "../../api/products";
import dayjs from "dayjs";
import { useAuth } from "../../App";
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
export const AddSalesLotPage = () => {
    let auth = useAuth();
    const [products, setProducts] = useState([])
    const [salesLotRecords, setSalesLotRecords] = useState([])
    const [salesRows, setSalesRows] = useState([{
        product_id: null,
        quantity: null
    }]);
    const [isFetchingSalesRecords, setIsFetchingSalesRecords] = useState(false);
    useEffect(() => {
        fetchProducts();
        fetchSalesRecords();
    }, [])

    const fetchProducts = async () => {
        const records = await getAllProducts();
        const product_list = records.map((item) => { return { label: String(item.product_id), value: parseInt(item.product_id) } })
        setProducts(product_list);
    }

    const fetchSalesRecords = async () => {
        setIsFetchingSalesRecords(true);
        const records = await getSalesRecordsByUser(auth.user.uid);
        setSalesLotRecords(records);
        setIsFetchingSalesRecords(false);
    }

    const [isInserting, setIsInserting] = useState(false);

    const addSalesRow = () => {
        const updatedSalesRows = [...salesRows]
        updatedSalesRows.push({ product_id: null, quantity: null })
        setSalesRows(updatedSalesRows)
    }

    const removeSalesRow = (index) => {
        const updatedSalesRows = [...salesRows]
        updatedSalesRows.splice(index, 1);
        setSalesRows(updatedSalesRows)
    }

    const updateSalesRow = (index, param, value) => {
        const updatedSalesRows = [...salesRows]
        updatedSalesRows[index][param] = value;
        setSalesRows(updatedSalesRows);
    }

    const handleSubmit = async () => {
        try {
            setIsInserting(true);
            await addSalesLot({ salesLot: [...salesRows], created_at: dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'), user_id: auth.user.uid })
            await fetchSalesRecords();
            setIsInserting(false);
        }
        catch (e) {
            setIsInserting(false);
            console.log(e)
            alert("Error inserting. Please contact administrator.")
        }
    }
    return (
        <Container>
            <Box>
                <Typography variant="h5">Add Sales Lot</Typography>
                <LogoutButton></LogoutButton>
            </Box>
            {salesRows.map((sales_row, index) => {
                return <Box key={index} display="flex" justifyContent="space-evenly" maxWidth={1000} margin={1} alignItems="center" >
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        disablePortal
                        id="combo-box-demo"
                        options={products}
                        sx={{ width: 300 }}
                        onChange={(e, value) => updateSalesRow(index, "product_id", value.value)}
                        renderInput={(params) => <TextField {...params} label="Product" />} />
                    <TextField
                        type="number" value={sales_row.quantity || ""} onChange={(e) => updateSalesRow(index, "quantity", parseInt(e.target.value))}></TextField>
                    {salesRows.length > 1 && <IconButton onClick={() => removeSalesRow(index)}><Delete></Delete></IconButton>}
                </Box>
            })}

            <Box>
                <IconButton onClick={addSalesRow}>
                    <Add></Add>
                </IconButton>
            </Box>
            <Box>
                <Button type="submit" onClick={handleSubmit}>
                    {isInserting ? <CircularProgress /> : "Submit"}
                </Button>
            </Box>

            <Typography variant="h5">Previously Added Records</Typography>
            {!isFetchingSalesRecords ?
                <Box display={"flex"} flexDirection={"column"} gap={4}>
                    {salesLotRecords.map((salesLotRecord) => {
                        return (
                            <SalesLotRecord key={salesLotRecord.id} sales_lot_record={salesLotRecord} products={products} onSaveRecord={updateSalesLot}></SalesLotRecord>
                        )
                    })}
                </Box> : <CircularProgress></CircularProgress>
            }

        </Container >
    );
}