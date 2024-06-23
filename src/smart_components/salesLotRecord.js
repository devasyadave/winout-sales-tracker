import { Edit, Height, Save } from "@mui/icons-material"
import { Card, CardContent, Icon, IconButton, TextField, Typography, Box, Divider, CircularProgress, Autocomplete, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TableFooter } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import './salesLotRecord.css'
import { Timestamp } from "firebase/firestore"
export const SalesLotRecord = ({ sales_lot_record, products, onSaveRecord }) => {

    const [mode, setMode] = useState('read')
    const [isSaving, setIsSaving] = useState(false);
    const [salesLotRecord, setSalesLotRecord] = useState(sales_lot_record);
    // sales_lot_record = [
    //     {
    //         product_id: 6299,
    //         quantity: 2
    //     },
    //     {
    //         product_id: 6300,
    //         quantity: 4
    //     }
    // ]
    useEffect(() => {

        setSalesLotRecord({ ...sales_lot_record })
        console.log(dayjs(salesLotRecord.created_at.toDate()).format('D MMM YYYY'))
    }, [])

    function updateSalesLotRecord(key, value) {

    }

    function formatDate(input_date) {
        return dayjs(input_date, 'YYYY-MM-DD HH:mm:ss').format('D MMM YYYY')
    }

    async function onSave() {
        setIsSaving(true);
        try {
            console.log(sales_lot_record)
            await onSaveRecord(sales_lot_record);
            setIsSaving(false);
            setMode('read');
        }
        catch (e) {
            setIsSaving(false);
            throw (e);
        }
    }


    return (
        mode === 'read' ? <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between" gap={4}>
                    <Typography>{dayjs(salesLotRecord.created_at.toDate()).format('D MMM YYYY')}</Typography>
                    <IconButton onClick={() => setMode('edit')} style={{ padding: 0 }}>
                        <Edit></Edit>
                    </IconButton>
                </Box>
                <Divider style={{ margin: 4, marginBottom: 8 }}></Divider>
                {salesLotRecord.salesLot.map((item, index) => {
                    return (<Box key={index} display="flex" gap={4}>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Product ID</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{item.product_id}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.quantity * 10}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={2} style={{ fontWeight: 'bold' }}>Overall Total</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>{salesLotRecord.salesLot.reduce((acc, item) => { return acc + (10 * item.quantity) }, 0)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>)
                })}

            </CardContent>
        </Card>
            :
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" gap={4}>
                        <DatePicker
                            slotProps={{ layout: { style: { height: "0px !important" } } }}
                            format="DD-MM-YYYY"
                            value={dayjs(salesLotRecord.created_at.toDate())}></DatePicker>
                        <IconButton onClick={() => onSave()}>
                            {!isSaving ? <Save></Save> : <CircularProgress></CircularProgress>}
                        </IconButton>
                    </Box>
                    <Divider style={{ margin: 4, marginBottom: 8 }}></Divider>
                    {salesLotRecord.salesLot.map((item, index) => {
                        return (<Box key={index} display="flex" gap={4} marginTop={2}>
                            <Autocomplete
                                isOptionEqualToValue={(option, value) => option.value === value.value}
                                disablePortal
                                id="combo-box-demo"
                                options={products}
                                value={products.find((option) => option.value === item.product_id)}
                                sx={{ width: 300 }}
                                onChange={(e, v) => {
                                    const temp_sales_lot_record = { ...salesLotRecord }
                                    temp_sales_lot_record.salesLot[index].product_id = v.value
                                    setSalesLotRecord(temp_sales_lot_record);
                                }
                                }
                                renderInput={(params) => <TextField {...params} label="Product" />}
                                renderOption={(props, option) => <Box component="li" {...props}>
                                    <Card variant="outlined" sx={{ width: '100%', margin: 0, padding: 0 }}>
                                        <CardContent sx={{ padding: '8px !important' }}>
                                            <Typography variant="subtitle1">ID: {option.product_id}</Typography>
                                            <Typography variant="subtitle1">Name: {option.name}</Typography>
                                            <Typography variant="subtitle1">Category: {option.category}</Typography>
                                        </CardContent>
                                    </Card>
                                </Box>}
                            />

                            <Typography variant="p">Quantity</Typography>
                            <TextField variant="standard" value={item.quantity}
                                onChange={(e) => {
                                    const temp_sales_lot_record = { ...salesLotRecord }
                                    temp_sales_lot_record.salesLot[index].quantity = e.target.value
                                    setSalesLotRecord(temp_sales_lot_record);
                                }
                                }>{item.quantity}</TextField>
                        </Box>)
                    })}
                </CardContent>
            </Card >
    )


}