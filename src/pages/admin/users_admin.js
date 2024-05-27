import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { getAllUserProfiles, toggleUserActivation } from '../../api/user_profiles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Switch } from '@mui/material';
import { createColumnHelper, createTable, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { StaleWhileRevalidate } from 'workbox-strategies';


const UsersAdmin = () => {
    const columnHelper = createColumnHelper();
    const [users, setUsers] = useState([]);
    const muiTheme = () => {
        return createTheme({
            components: {
                MUIDataTable: {
                    styleOverrides: {
                        root: {
                            width: "fit-content"
                        }
                    }
                }
            }
        })
    }
    const test_function = (dataIndex, value) => {
        try {
            const userDataCopy = { ...users }
            userDataCopy[dataIndex]['isActiveLoading'] = true;
            console.log(userDataCopy)
            setUsers(userDataCopy)
            userDataCopy[dataIndex]['isActive'] = value
            userDataCopy[dataIndex]['isActiveLoading'] = false
            setUsers(userDataCopy)
        }
        catch (error) {
            throw error
        }
    }

    const changeUserActive = async (dataIndex, value) => {
        try {
            const userDataCopy = { ...users }

            userDataCopy[dataIndex]['isActiveLoading'] = true;
            console.log(userDataCopy)
            await toggleUserActivation(users[dataIndex].id, value)
            userDataCopy[dataIndex]['isActive'] = value
            userDataCopy[dataIndex]['isActiveLoading'] = false
            console.log(userDataCopy)
            setUsers({ ...userDataCopy })
        } catch (error) {
            throw error
        }


    }
    useEffect(() => {
        // Fetch user data from API or local data source
        // For example:
        const fetchData = async () => {
            try {
                // Assuming getUsersData is a function to fetch user data
                const userData = await getAllUserProfiles();
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };
        fetchData();
    }, []);
    const columns = [
        {
            name: "storeName",
            label: "Store Name",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "address",
            label: "Address",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "city",
            label: "City",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "state",
            label: "State",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "pincode",
            label: "Pincode",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "gstin",
            label: "GSTIN",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "contactNo",
            label: "Contact No",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "contactPerson",
            label: "Contact Person",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "pan",
            label: "PAN",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "email",
            label: "Email",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "role",
            label: "Role",
            options: {
                filter: true,
                sort: false,
            }
        },
        {
            name: "isActive",
            label: "Is Active ?",
            options: {
                filter: true,
                sort: false,
                customBodyRenderLite: (dataIndex) => {
                    console.log(dataIndex)
                    return (
                        !users[dataIndex]['isActiveLoading'] ?
                            <Switch onChange={(e, value) => {

                                changeUserActive(dataIndex, value)

                            }} >
                            </Switch> : <CircularProgress></CircularProgress>

                    );
                }
            }
        }
    ];
    let defaultColumns = [columns.map(element => {
        return columnHelper.accessor(element.name, {
            id: element.name,
            header: String(element.label),
            footer: props => props.column.id,
        })
    })];

    defaultColumns = [
        columnHelper.accessor('storeName', {
            //cell: info => info.getValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor(row => row.lastName, {
            id: 'lastName',
            cell: info => <i>{info.getValue()}</i>,
            header: () => <span>Last Name</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('email', {
            header: () => 'email',
            cell: info => info.renderValue(),
            footer: info => info.column.id,
        }),
        columnHelper.accessor('gstin', {
            header: () => <span>gstin</span>,
            footer: info => info.column.id,
        }),
        columnHelper.accessor('isActive', {
            header: 'isActive',
            footer: info => info.column.id,
            cell: props => <Switch onChange={(event, value) => changeUserActive(props.row.index, value)}></Switch>
        }),
        columnHelper.accessor('pan', {
            header: 'pan',
            footer: info => info.column.id,
        }),
    ]

    console.log(users);
    console.log(defaultColumns);
    const table = useReactTable({ columns: defaultColumns, data: users, getCoreRowModel: getCoreRowModel() })
    return (
        <div className="p-2">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                {/* <tfoot>
                    {table.getFooterGroups().map(footerGroup => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.footer,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot> */}
            </table>
            <div className="h-4" />
            <button className="border p-2">
                Rerender
            </button>
        </div>
    );
}

export default UsersAdmin;
