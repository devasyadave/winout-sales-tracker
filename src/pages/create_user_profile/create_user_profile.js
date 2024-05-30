import React, { useState } from 'react';
import {
    TextField,
    Button,
    Typography,
    Container,
    Grid
} from '@mui/material';
import { useAuth } from '../../App';
import { storeUserProfile } from '../../api/user_profiles';
import { useNavigate } from 'react-router-dom';

const CreateUserProfilePage = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        storeName: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        gstin: '',
        contactNo: '',
        contactPerson: '',
        pan: '',
        email: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        // Handle form submission, e.g., send data to backend
        e.preventDefault();
        console.log(formData);
        try {
            await storeUserProfile(auth.user.uid, formData)
        }
        catch (e) {
            console.log(e)
        }
        navigate("/add_sales_lot")
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                User Profile
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Store Name"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="GSTIN"
                            name="gstin"
                            value={formData.gstin}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="PAN"
                            name="pan"
                            value={formData.pan}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact No."
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Contact Person"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default CreateUserProfilePage;
