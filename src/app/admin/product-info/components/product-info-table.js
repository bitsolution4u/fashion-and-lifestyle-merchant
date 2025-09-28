'use client';
import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  TableBody,
  Typography,
} from '@mui/material';
import SearchField from '@/@core/components/mui/search-field';
import axiosWithoutCredential from '@/configs/axios/axiosWithoutCredential';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import AddItemToStorePageModal from '../modal/modal';
import CustomTextField from '@/@core/components/mui/text-field';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { toast } from 'react-toastify';
import { BaseAppUrl } from '@/@core/utlis/secretVariable';
import { useSelector } from 'react-redux';
import { useAdmin } from '@/@core/hooks/fetch-data/admin/useAdmin';
export default function DataTable() {

  // all states
  const [loading, setLoading] = React.useState(false);
  const [allProductInfo, setAllProductInfo] = React.useState([]);
  const [typeInfo, setTypeInfo] = React.useState([]);



  console.log(typeInfo);
  const [searchValue, setSearchValue] = React.useState('');
  const [open, setOpen] = React.useState({
    modalOpen: false,
    dataInfo: '',
    product: '',
    index: -1,
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  const userCredential = useSelector((state) => state.user.loginUserInfo);
  const { saveLoggedInUserInfo } = useAdmin();
  
  React.useEffect(() => {
    if (!userCredential) {
      saveLoggedInUserInfo();
    }
  }, [userCredential, saveLoggedInUserInfo]);
  const handleOpenModal = (action, product, i) =>
  setOpen((prev) => ({
      ...prev,
      dataInfo: action,
      modalOpen: true,
      product: product,
      index: i,
  }));
  const handleChange = (e) => {
  const { name, value } = e.target;
    setOpen((prev) => ({
      ...prev,
      name: value,
    }));
  };
  let itemPerPage = 10;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    console.log(+event.target.value);
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // API Calls
  const getAllTypeInfo = async () => {
    await axiosWithoutCredential
     .get(`/api/v1/type/all-type-by-store/${userCredential?.merchantId}`)
      .then((result) => {
        setTypeInfo(result?.data?.data);
      })
      .catch((error) => {console.log(error);});
  };

  const getAllProductInfoByType = async () => {
    setLoading(true);
    const dataObj = {
      store_id: userCredential?.merchantId,
    }
    await axiosWithoutCredential
      .put(`/api/v1/kids-product/product-info-by-type/${searchValue?.type_id}`, dataObj)
      .then((result) => {
        setLoading(false);
        setPage(0);
        setAllProductInfo(result?.data?.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleUpdateProductStatus = async (id, status, index) => {
    const data = {
      status: status,
      type_id: searchValue?.type_id,
      store_id: userCredential?.merchantId,
    }
    await axiosWithoutCredential
      .put(`/api/v1/kids-product/update-status/${id}`, data)  

      .then((result) => {
        setAllProductInfo((prev) => {
            let newArr = [...prev];
            let targetIndex = index + page * rowsPerPage;

            if (newArr[targetIndex]) {
              newArr[targetIndex] = {
                ...newArr[targetIndex],
                is_popular: status,
              };
            }
            return newArr;
        });

        toast.success('Product status successfully updated!', {
          position: 'top-center',
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  };
  React.useEffect(() => {
    getAllTypeInfo();
  }, []);

  //  styles  
  const iconBorder = {
    border: '1px solid',
    padding: '2px',
    margin: '2px',
    cursor: 'pointer',
    width: '.85em',
    height: '.85em',
    borderRadius: 1,
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography color="primary">All Product Information {userCredential?.shopName}</Typography>
      </Box>
      <Divider />
      <Box sx={{display:'flex'}}>
        <Box sx={{ display: 'flex', width: { xs: '100%', sm: '48%', md: '30%', lg: '20%' }, mt: 2, ml: 2 }}>
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            id="combo-box-demo"
            renderOption={(props, option) => {
              return (
                <li {...props} key={option?.type_info?._id}>
                  {option?.type_info?.type_name}
                </li>
              );
            }}
            options={typeInfo}
            getOptionLabel={(option) => option?.type_info?.type_name}
            onChange={(e, value) => {
              setSearchValue({
                ...searchValue, type_id: value?.type_info?._id,
              });
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Type"
                placeholder="Select Type"
                font="bold"
              />
            )}
          />
        </Box>
    
        <div className="relative ml-8 mt-10">
            {loading ? (
              <Button
                type="button"
                variant="contained"
                className="text-center bg-cwgreen absolute "
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress
                    style={{
                      color: 'white',
                      marginRight: '10px',
                    }}
                    size={20}
                  />
                  Wait...
                </div>
              </Button>
            ) : (
              <Button
                onClick={() => getAllProductInfoByType()}
                variant="contained"
                sx={{ backgroundColor: '#7367F0 !important' }}
                className="bg-cwgreen text-white absolute "
              >
                Search
              </Button>
            )}
          </div>
      </Box>
      <Box
        sx={{
          my: 2,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >

        
        <div></div>
        <SearchField/>
      </Box>
      <TableContainer className="max-h-screen">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 'bold', minWidth: 100 }}
                align="center"
              >
                No.
              </TableCell>
 <TableCell
                sx={{ fontWeight: 600, textAlign: 'center', minWidth: 100 }}
              >
                IMG
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', minWidth: 200 }}
                align="center"
              >
                Product Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', minWidth: 300 }}
                align="center"
              >
                Type Name
              </TableCell>

              <TableCell
                sx={{ fontWeight: 'bold', minWidth: 200 }}
                align="center"
              >
                Category Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: 'bold', minWidth: 200 }}
                align="center"
              >
                Sub Category Name
              </TableCell>

              <TableCell sx={{ fontWeight: 'bold', width: 200 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProductInfo
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, i) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={product?._id}
                  >
                    <TableCell style={{ width: 100 }} align="center">
                      {i + 1}
                    </TableCell>
                     <TableCell align="center">
                      {console.log(product)}
                      <img
                        src={`${BaseAppUrl}/${product?.app_image}`}
                        alt={'subtype banner'}
                        width={60}
                        height={60}
                      />
                     
                  
                  </TableCell>
                    <TableCell style={{ width: 200 }} align="center">
                      {product?.product_title_eng}
                    </TableCell>
                    <TableCell style={{ width: 300 }} align="center">
                      {product?.type_info?.type_name}
                    </TableCell>
                    <TableCell style={{ width: 200 }} align="center">
                      {product?.category_info?.category_name}
                    </TableCell>
                    <TableCell style={{ width: 200 }} align="center">
                      {product?.sub_category_info?.sub_category_name}
                    </TableCell>

                    <TableCell style={{ width: 160 }} align="center">
                      {
                        product?.is_popular ?
                      <FavoriteIcon
                         sx={{ color: 'red', mr: 2 , cursor: 'pointer'}}
                         onClick={() =>
                           handleUpdateProductStatus(product._id, false, i)
                         }
                      />
                      :
                      <FavoriteBorderIcon
                         sx={{ color: 'red', mr: 2 , cursor: 'pointer'}}
                         onClick={() =>
                          handleUpdateProductStatus(product._id, true, i)
                         }
                      /> 
                      } 
                      <BorderColorIcon
                        sx={{ ...iconBorder, color: '#7367f0', mr: 2 }}
                        onClick={() =>
                          handleOpenModal('update-item', product, page * 10 + i)
                        }
                      />
                      <DeleteIcon 
                         sx={{ ...iconBorder, color: '#af1a1a' }}  
                         onClick={() =>
                           handleUpdateProductStatus(product._id, false, i)
                         }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[itemPerPage]}
        component="div"
        count={allProductInfo?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <AddItemToStorePageModal
        handleOpenModal={handleOpenModal}
        open={open}
        setOpen={setOpen}
        handleChange={handleChange}
      />
    </Paper>
  );
}
