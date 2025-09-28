'use client';
import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TypeInfoTable from './components/type';
import ProductPageModal from './modal';
import CategoryInfoTable from './components/category';
import SubCategoryInfoTable from './components/subcategory';
import { useAdmin } from '@/@core/hooks/fetch-data/admin/useAdmin';
import { useSelector } from 'react-redux';

const AssignProductStructureToStore = () => {
  const userCredential = useSelector((state) => state.user.loginUserInfo);
  const { saveLoggedInUserInfo } = useAdmin();

  useEffect(() => {
    if (!userCredential) {
      saveLoggedInUserInfo();
    }
  }, [userCredential, saveLoggedInUserInfo]);

  const [open, setOpen] = useState({
    modalOpen: false,
    dataInfo: '',
    dataEdit: null,
    shop_id: null,
  });

  const [refreshKey, setRefreshKey] = useState(0); // table refresh key

  const handleOpenModal = (action, dataEdit) => {
    setOpen({
      modalOpen: true,
      dataInfo: action,
      dataEdit: dataEdit || null,
      shop_id: userCredential?.merchantId,
    });
  };

  const handleRefreshTable = () => setRefreshKey((prev) => prev + 1); // callback for table refresh

  return (
    <>
      <Box sx={{ mt: 5, mx: { xs: 2, sm: 5, md: 10, lg: 18 } }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, mb: 3, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
        >
          Assign Product Structure To {userCredential?.shopName}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TypeInfoTable
              handleOpenModal={handleOpenModal}
              shop_id={userCredential?.merchantId}
              refreshKey={refreshKey}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <CategoryInfoTable handleOpenModal={handleOpenModal} shop_id={userCredential?.merchantId} refreshKey={refreshKey} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SubCategoryInfoTable handleOpenModal={handleOpenModal} shop_id={userCredential?.merchantId} refreshKey={refreshKey} />
          </Grid>
        </Grid>
      </Box>

      <ProductPageModal
        open={open}
        setOpen={setOpen}
        onAddSuccess={handleRefreshTable} // pass callback
      />
    </>
  );
};

export default AssignProductStructureToStore;
