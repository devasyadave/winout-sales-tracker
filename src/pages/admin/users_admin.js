import React, { useState, useEffect } from 'react';
import MUIDataTable from "mui-datatables";
import { getAllUserProfiles, toggleUserActivation } from '../../api/user_profiles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CircularProgress, Switch } from '@mui/material';
import { createColumnHelper, createTable, getCoreRowModel, useReactTable, flexRender } from '@tanstack/react-table';
import { StaleWhileRevalidate } from 'workbox-strategies';
import UserCard from '../../smart_components/user_card';

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
            let userCopy = [...users]
            //let index = userCopy.findIndex((user) => user.id === user_id)
            userCopy[dataIndex]['isActiveLoading'] = true;
            setUsers(userCopy)
            await toggleUserActivation(userCopy[dataIndex]['id'], value)
            const userData = await getAllUserProfiles();
            setUsers(userData);
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
                            <Switch checked={users[dataIndex]['isActive']} onChange={(e, value) => {

                                changeUserActive(dataIndex, value)

                            }} >
                            </Switch> : <CircularProgress size={3}></CircularProgress>

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
        // <div className="p-2">
        //     {
        //         users.map((user) => {
        //             return <UserCard user={user} onActiveChange={changeUserActive}></UserCard>
        //         })
        //     }
        // </div>

        <div>
            <ThemeProvider theme={muiTheme()}>
                <MUIDataTable
                    title={"User List"}
                    data={users}
                    columns={columns}
                    options={{
                        filterType: "checkbox",
                        selectableRows: "none",
                        responsive: "standard"
                    }}
                />
            </ThemeProvider >
        </div>
    );
}

export default UsersAdmin;
