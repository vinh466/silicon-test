import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { purple } from '@mui/material/colors';
import { Link } from 'react-router-dom';

const primary = purple[500]; // #f44336

function ErrorPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Typography variant="h1" align='right'>
                        404
                    </Typography>
                </Grid>
                <Grid item xs={6} spacing={2}>
                    <Typography variant="h6" mb={2}>
                        The page you’re looking for doesn’t exist.
                    </Typography>
                    <Link to={'/'}>
                        <Button variant="contained">
                            Back Home
                        </Button>
                    </Link>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ErrorPage