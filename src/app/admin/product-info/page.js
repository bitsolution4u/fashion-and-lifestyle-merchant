'use client';

import { Box, Grid } from '@mui/material';
import React from 'react';
import DataTable from './components/product-info-table';

const ProductInfoPage = () => {
  return (
    <>
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <DataTable/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProductInfoPage;
