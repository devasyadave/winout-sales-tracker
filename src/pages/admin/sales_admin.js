import { DataGrid } from "@mui/x-data-grid"
import { getAllSalesRecords } from "../../api/sales_records"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import MUIDataTable from "mui-datatables";
import palette from "google-palette"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Container, TableCell, TableRow } from "@mui/material"
import { ReceiptRounded } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { CategoryScale, Chart, LinearScale, registerables, Colors, scales, Ticks } from "chart.js";
import { getUserProfile } from "../../api/user_profiles";

Chart.register(CategoryScale)
Chart.register(LinearScale)
Chart.register(...registerables)
Chart.register(Colors)
export const SalesAdmin = () => {

    const [salesLotRecords, setSalesLotRecords] = useState([])
    const muiTheme = () => {
        return createTheme({
            components: {
                MUIDataTable: {
                    styleOverrides: {
                        root: {
                            width: "fit-content",
                        }
                    }
                },
                MUIDataTableBodyCell: {
                    styleOverrides: {
                        root: {
                            textAlign: "center"
                        }
                    }
                }
            }
        })
    }
    const getColumns = (data) => {
        let temp_columns = []
        if (data.length > 0) {
            Object.keys(data[0]).forEach((key) => {
                if (key != 'id') temp_columns.push({ field: key, headerName: key, width: 150 })
            })
        }
        return temp_columns
    }

    useEffect(() => {
        fetchAllSalesRecords();
    }, [])

    const fetchAllSalesRecords = async () => {
        try {
            const records = await getAllSalesRecords();
            let res = ""
            let result = []
            for (const record of records) {
                const user_profile = await getUserProfile(record.user_id)

                record.salesLot.forEach((sale) => {
                    result.push({
                        "id": record.id,
                        "storeName": user_profile.storeName,
                        "user_id": record.user_id,
                        "product_id": sale.product_id,
                        "quantity": sale.quantity,
                        "date": (dayjs(record.created_at.toDate()).format('D MMM YYYY'))
                    })
                })
            }
            setSalesLotRecords(result);
            // res =
            //     records.reduce((acc, record) => {
            //         const user_profile = await getUserProfile(record.user_id)
            //         let result = []
            //         record.salesLot.forEach((sale) => {
            //             result.push({
            //                 "id": record.id,
            //                 "storeName": user_profile.storeName,
            //                 "user_id": record.user_id,
            //                 "product_id": sale.product_id,
            //                 "quantity": sale.quantity,
            //                 "date": (dayjs(record.created_at.toDate()).format('D MMM YYYY'))
            //             })
            //         })
            //         return acc.concat(result)
            //     }, [])
            // console.log(res)
            // setSalesLotRecords(res);
        }
        catch (e) {
            throw (e)
        }

    }
    const columns = [
        {
            name: "storeName",
            label: "Store",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "product_id",
            label: "Product ID",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "quantity",
            label: "Quantity",
            options: {
                filter: true,
                sort: true
            }
        }
    ]
    const options = (title) => {
        return {
            barPercentage: 0.1,
            scales: {
                x: {
                    ticks: {
                        align: "center",
                        autoSkip: false,
                        labelOffset: 0,
                    }
                },
                y: {

                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: "14"
                    }
                },
                colors: {
                    enabled: true
                },
                legend: {
                    display: false
                }
            },
            aspectRatio: 2
        }
    };

    const getSalesByProductBarChartData = (group_key = 'product_id', agg_key = 'quantity') => {
        console.log(salesLotRecords)
        let chart_data = salesLotRecords.reduce((acc, item) => {
            // Check if the product_id already exists in the accumulator
            if (!acc[item[group_key]]) {
                acc[item[group_key]] = 0;
            }
            // Sum up the quantity
            acc[item[group_key]] = acc[item[group_key]] + parseInt(item[agg_key]);

            return acc;
        }, {});
        let bg_color = palette('tol', Object.keys(chart_data).length).map(function (hex) {
            return '#' + hex;
        })
        console.log(bg_color)
        let datasets = [{
            data: Object.values(chart_data),
            backgroundColor: bg_color
        }];

        let labels = Object.keys(chart_data)
        console.log(labels, datasets)
        return {
            labels: labels,
            datasets: datasets
        }
    }
    //console.log({ ...options, plugins: { ...plugins, title: { ...title, text: "Sales By Store" } } })
    return (
        <Box id="sales-container" display="flex" flexWrap="wrap" justifyContent="space-evenly">
            <ThemeProvider theme={muiTheme()}>
                <MUIDataTable
                    title={"Sales"}
                    data={salesLotRecords}
                    columns={columns}
                    options={{
                        filterType: "checkbox",
                        selectableRows: "none",
                        responsive: "standard",
                        setTableProps: () => {
                            return {
                                // material ui v4 only
                                size: 'small',
                            };
                        }
                    }}
                />
            </ThemeProvider >
            <Box position="relative" width="50%">
                {salesLotRecords.length > 0 && <Bar options={options("Sales by Product")} data={getSalesByProductBarChartData()}></Bar>}
                {salesLotRecords.length > 0 && <Bar options={options("Sales by Store")} data={getSalesByProductBarChartData("storeName", "quantity")}></Bar>}
            </Box>
        </Box>
    )

}