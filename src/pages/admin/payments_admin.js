import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import {
    Card,
    CardContent,
    Collapse,
    IconButton,
    Select,
    MenuItem,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    Button,
    FormGroup,
    Box
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getAllSalesRecords, patchSalesLot, updateSalesLotById } from '../../api/sales_records';
import { getAllProducts } from '../../api/products';
import { getAllUserProfiles } from '../../api/user_profiles';

const rows = [
    {
        storeName: 'Store 1',
        salesLotId: 'SL001',
        total: 500,
        paid: true,
        details: [
            { name: 'Item 1', rate: 50, quantity: 3 },
            { name: 'Item 2', rate: 100, quantity: 2 },
            { name: 'Item 3', rate: 25, quantity: 4 }
        ]
    },
    {
        storeName: 'Store 2',
        salesLotId: 'SL002',
        total: 300,
        paid: false,
        details: [
            { name: 'Item A', rate: 50, quantity: 2 },
            { name: 'Item B', rate: 50, quantity: 4 }
        ]
    }
];



const PaymentsAdmin = () => {
    const [expandedRows, setExpandedRows] = useState({});
    const [salesLots, setSalesLots] = useState([]);
    const handleExpandClick = (index) => {
        setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const columns = [
        {
            name: 'storeName',
            label: 'Store Name'
        },
        {
            name: 'id',
            label: 'Sales Lot ID'
        },
        {
            name: 'total',
            label: 'Total'
        },
        {
            name: 'paid',
            label: 'Paid',
            options: {
                customBodyRender: (value, tableMeta, rowMeta) => {
                    //console.log(tableMeta)
                    let idx = tableMeta.rowIndex
                    return (< Checkbox checked={value || false} disabled />)
                }
            }
        },
        // {
        //     name: 'actions',
        //     label: 'Actions',
        //     options: {
        //         customBodyRender: (value, tableMeta) => {
        //             const index = tableMeta.rowIndex;
        //             return (
        //                 <IconButton onClick={() => handleExpandClick(index)}>
        //                     {expandedRows[index] ? <ExpandLess /> : <ExpandMore />}
        //                 </IconButton>
        //             );
        //         }
        //     }
        // }
    ];

    useEffect(() => {
        fetchSalesLots();
    }, [])
    const fetchSalesLots = async () => {
        const records = await getAllSalesRecords();
        const products = await getAllProducts();
        const profiles = await getAllUserProfiles();
        const rows = records.map((salesLot, index) => {
            let detailed_sales_lot = salesLot['salesLot'].map((sale, index) => {
                //console.log(products)
                let prod = products.find((prod, index) => parseInt(prod.product_id) == sale.product_id)
                sale['rate'] = prod.rate
                sale['name'] = prod.name

                sale['product'] = prod
                return sale
            })
            salesLot['salesLot'] = detailed_sales_lot
            let profile = profiles.find((profile, index) => profile.id == salesLot.user_id)
            salesLot['profile'] = profile
            salesLot['storeName'] = profile.storeName

            salesLot['total'] = salesLot['salesLot'].reduce((acc, item) => { return acc + (item.rate * item.quantity) }, 0);
            return salesLot
        })
        //console.log(rows)
        setSalesLots(rows);
    }

    const localUpdatePayment = (id, data) => {
        const copy = [...salesLots]
        for (var i = 0; i < salesLots.length; i++) {
            if (copy[i].id == id) {
                copy[i] = { ...copy[i], ...data }
            }
        }
        setSalesLots(copy)
    }

    const updatePayment = async (event, id) => {
        event.preventDefault();
        let data = new FormData(event.target)
        let method = data.get('payment_method')
        let trans_id = data.get('transaction_id')
        if (trans_id == "") method = ""
        let paid = data.get('transaction_id') != ""
        await updateSalesLotById(id, { paid: paid, payment_method: method, transaction_id: trans_id })
        fetchSalesLots();
    }

    const renderDetails = (salesLot) => {
        const details = salesLot['salesLot'];
        const total = details.reduce((acc, item) => acc + item.rate * item.quantity, 0);
        return (
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.rate}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.rate * item.quantity}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={3} align="right">Overall Total</TableCell>
                            <TableCell>{total}</TableCell>
                        </TableRow>

                    </TableBody>

                </Table>
                <form onSubmit={(event) => updatePayment(event, salesLot.id)}>
                    <Box display={"flex"} flexDirection={"row"} gap={4} marginTop={5}>
                        <FormGroup style={{ width: 100 }}>
                            <Select name="payment_method" defaultValue={salesLot.payment_method || ''} fullWidth>
                                <MenuItem value='' disabled>Method</MenuItem>
                                <MenuItem value="NEFT">NEFT</MenuItem>
                                <MenuItem value="UPI">UPI</MenuItem>
                            </Select>
                        </FormGroup>
                        <FormGroup>
                            <TextField name="transaction_id" defaultValue={salesLot.transaction_id || ''} label="Transaction ID" />
                        </FormGroup>
                        <Button type="submit" >Submit</Button>
                    </Box>
                </form>
            </CardContent>
        );
    };

    const options = {
        selectableRows: 'none',
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            const index = rowMeta.dataIndex;
            const details = salesLots[index];
            return (
                <TableRow>
                    <TableCell colSpan={6}>
                        <Collapse in={true} timeout="auto" unmountOnExit>
                            <Card>{renderDetails(details)}</Card>
                        </Collapse>
                    </TableCell>
                </TableRow>
            );
        }
    };

    return (
        <MUIDataTable
            title="Store Sales"
            data={salesLots}
            columns={columns}
            options={options}
        />
    );
};

export default PaymentsAdmin;
