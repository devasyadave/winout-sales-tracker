import React, { useState } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Container,
} from '@mui/material';

const initialFormState = {
    product_id: '',
    name: '',
    design: '',
    category: '',
    rate: '',
    size: '',
};



const EditProduct = ({ open, handleClose, handleSave, initialData, edit = true, disabled = [] }) => {
    const [formState, setFormState] = useState(initialData || initialFormState);

    const getDisabled = (key) => {
        return disabled.includes(key);
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        handleSave(formState);
        if (edit) handleClose();
    };

    return (
        <Container style={{ paddingTop: 5 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="product_id"
                        label="Product ID"
                        fullWidth
                        value={formState.product_id}
                        onChange={handleChange}
                        disabled={getDisabled("product_id")}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="name"
                        label="Name"
                        fullWidth
                        value={formState.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="design"
                        label="Design"
                        fullWidth
                        value={formState.design}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="category"
                        label="Category"
                        fullWidth
                        value={formState.category}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="rate"
                        label="Rate"
                        fullWidth
                        value={formState.rate}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="size"
                        label="Size"
                        fullWidth
                        value={formState.size}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            {edit && <Button onClick={handleClose}>Cancel</Button>}
            <Button onClick={handleSubmit} color="primary">
                Save
            </Button>
        </Container>
    );
};

export default EditProduct;
