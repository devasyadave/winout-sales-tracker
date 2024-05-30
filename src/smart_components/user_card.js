import React from 'react';
import { Card, CardContent, Typography, Switch, CircularProgress } from '@mui/material';

const UserCard = ({ user, onActiveChange }) => {
    return (
        <Card style={{ maxWidth: 400, margin: '20px auto' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {user.storeName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Address: {user.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    City: {user.city}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    State: {user.state}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Pincode: {user.pincode}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Contact Person: {user.contactPerson}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Contact Number: {user.contactNo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Email: {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    GSTIN: {user.gstin}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    PAN: {user.pan}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    ID: {user.id}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Active: {user.isActive ? 'Yes' : 'No'}
                </Typography>
                {user.isActiveLoading ? <CircularProgress></CircularProgress> : <Switch checked={user.isActive} onChange={(e, v) => onActiveChange(user.id, v)}></Switch>}
            </CardContent>
        </Card>
    );
};



export default UserCard;
