
import { getAllProducts, storeProduct, updateProduct } from "../../api/products"
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, ButtonGroup, Container, DialogContent, DialogTitle, IconButton, TableCell, TableRow, Typography } from "@mui/material"
import Dialog from '@mui/material/Dialog';
import { useState, useEffect } from "react"
import { Delete, Edit } from "@mui/icons-material";
import EditProduct from "../../smart_components/editProduct";

export const ProductsAdmin = () => {

    const [productList, setProductList] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState(null);
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

    useEffect(() => {
        initializeProducts();
    }, [])

    const initializeProducts = async () => {
        const products = await getAllProducts();
        setProductList(products);
    }

    const handleOpenDialog = (dataIndex, rowIndex) => {
        setFormData(productList[dataIndex]);
        setOpenDialog(true);
    }

    const handleEditSubmit = async (data) => {
        console.log(data)
        let productListCopy = [...productList]
        let idx = productList.findIndex((product) => product.product_id == data.product_id)
        const res = await updateProduct(data);
        productListCopy[idx] = { ...data }
        setProductList([...productListCopy])
    }

    const handleCreateSubmit = async (data) => {
        console.log(data)
        let productListCopy = [...productList]
        const res = await storeProduct(data);
        productListCopy.push(data)
        setFormData(null);
        setProductList([...productListCopy])

    }

    const handleCloseDialog = () => {
        setOpenDialog(!openDialog);
    }



    const columns = [
        {
            name: "product_id",
            label: "Product ID",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                sort: true,

            }
        },
        {
            name: "design",
            label: "Design",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "category",
            label: "Category",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "rate",
            label: "Rate",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "size",
            label: "Size",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "action",
            label: "Action",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    return (<ButtonGroup>
                        <IconButton onClick={() => handleOpenDialog(dataIndex, rowIndex)}>
                            <Edit></Edit>
                        </IconButton>
                        <IconButton onClick={() => handleOpenDialog(dataIndex, rowIndex)}>
                            <Delete></Delete>
                        </IconButton></ButtonGroup>

                    )
                }
            }
        }
    ]

    return (
        <Box id="products-container" display="flex" flexWrap="wrap" justifyContent="space-evenly">
            <Box width={300}>
                <Typography variant="h5">Add New Product</Typography>
                <EditProduct initialData={formData} handleSave={handleCreateSubmit} edit={false} />
            </Box>
            <Dialog
                open={openDialog}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        //handleClose();
                    },
                }}
            ><DialogTitle>Edit Product</DialogTitle><DialogContent><EditProduct initialData={formData} handleClose={handleCloseDialog} handleSave={handleEditSubmit} disabled={["product_id"]} /></DialogContent></Dialog>
            <ThemeProvider theme={muiTheme()}>
                <MUIDataTable
                    title={"Products"}
                    data={productList}
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
        </Box>
    );

}