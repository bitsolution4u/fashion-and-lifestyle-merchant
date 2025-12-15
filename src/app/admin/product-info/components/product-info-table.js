"use client";
import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  TableBody,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchField from "@/@core/components/mui/search-field";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddItemToStorePageModal from "../modal/modal";
import CustomTextField from "@/@core/components/mui/text-field";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { toast } from "react-toastify";
import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import { useSelector } from "react-redux";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function DataTable() {
  const [loading, setLoading] = React.useState(false);
  const [allProductInfo, setAllProductInfo] = React.useState([]);
  const [typeInfo, setTypeInfo] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [categoryInfo, setCategoryInfo] = React.useState([]);
  const [open, setOpen] = React.useState({
    modalOpen: false,
    dataInfo: "",
    product: "",
    index: -1,
  });

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
      .catch((error) => {
        console.log(error);
      });
  };

  const getAllCategoryInfoByType = async (id) => {
    const data = {
      store_info: userCredential?.merchantId,
      type_info: id,
    };

    await axiosWithoutCredential
      .put(`/api/v1/category/all-category-by-store-and-type`, data)
      .then((result) => {
        setCategoryInfo(result?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllProductInfoByType = async () => {
    setLoading(true);
    const dataObj = {
      store_id: userCredential?.merchantId,
      category_info: searchValue?.category_info,
      is_active: searchValue?.is_active,
    };

    await axiosWithoutCredential
      .put(
        `/api/v1/kids-product/product-info-by-type/${searchValue?.type_id}`,
        dataObj
      )
      .then((result) => {
        setLoading(false);
        setPage(0);
        setAllProductInfo(result?.data?.data);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleUpdateProductStatus = async (id, field_name, status, index) => {
    const data = {
      [field_name]: status,
      type_id: searchValue?.type_id,
    };

    await axiosWithoutCredential
      .put(`/api/v1/kids-product/update-status/${id}`, data)

      .then((result) => {
        setAllProductInfo((prev) => {
          let newArr = [...prev];
          let targetIndex = index + page * rowsPerPage;

          if (newArr[targetIndex]) {
            newArr[targetIndex] = {
              ...newArr[targetIndex],
              [field_name]: status,
            };
          }
          return newArr;
        });

        toast.success("Product status successfully updated!", {
          position: "top-center",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  React.useEffect(() => {
    getAllTypeInfo();
  }, []);

  const styles = {
    headCell: {
      fontWeight: "bold",
      textAlign: "center",
      minWidth: 150,
    },
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Typography color="primary">
          All Product Information {userCredential?.shopName}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "48%", md: "30%", lg: "20%" },
            mt: 2,
            ml: 2,
          }}
        >
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
                // ...searchValue,
                type_id: value?.type_info?._id,
              });
              getAllCategoryInfoByType(value?.type_info?._id);
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
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "48%", md: "30%", lg: "20%" },
            mt: 2,
            ml: 2,
          }}
        >
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            id="combo-box-demo"
            renderOption={(props, option) => {
              return (
                <li {...props} key={option?.category_info?._id}>
                  {option?.category_info?.category_name}
                </li>
              );
            }}
            options={categoryInfo}
            getOptionLabel={(option) =>
              option?.category_info?.category_name || ""
            }
            onChange={(e, value) => {
              setSearchValue({
                ...searchValue,
                category_info: value?.category_info?._id,
              });
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Product Category"
                placeholder="Select Product Category"
                font="bold"
              />
            )}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "48%", md: "30%", lg: "20%" },
            mt: 2,
            ml: 2,
          }}
        >
          <Autocomplete
            fullWidth
            size="small"
            disablePortal
            id="combo-box-demo"
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.label}>
                  {option?.label}
                </li>
              );
            }}
            options={product_status_info}
            getOptionLabel={(option) => option?.label}
            onChange={(e, value) => {
              setSearchValue({
                ...searchValue,
                is_active: value?.value,
              });
            }}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Select Product Status"
                placeholder="Select Product Status"
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <CircularProgress
                  style={{
                    color: "white",
                    marginRight: "10px",
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
              sx={{ backgroundColor: "#7367F0 !important" }}
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
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        <SearchField />
      </Box>
      {/* Table */}
      <TableContainer sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.headCell}>No.</TableCell>
              <TableCell sx={styles.headCell}>IMG</TableCell>
              <TableCell sx={styles.headCell}>Product Name</TableCell>
              <TableCell sx={styles.headCell}>Type Name</TableCell>
              <TableCell sx={styles.headCell}>Category Name</TableCell>
              <TableCell sx={styles.headCell}>Sub Category Name</TableCell>
              <TableCell sx={styles.headCell}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {allProductInfo
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, i) => (
                <TableRow hover key={product?._id}>
                  <TableCell align="center">{i + 1}</TableCell>

                  <TableCell align="center">
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                      {/* IMAGE */}
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid #ddd",
                        }}
                      >
                        <img
                          src={`${BaseAppUrl}/${product?.app_image}`}
                          alt="product"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>

                      {/* BADGE OUTSIDE (TOP-RIGHT) */}
                      {product?.is_active ? (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -8, // outside the box
                            right: -8, // outside the box
                            width: 22,
                            height: 22,
                            backgroundColor: "#4CAF50",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            border: "2px solid white",
                            boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          ✓
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: 22,
                            height: 22,
                            backgroundColor: "#E53935",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            border: "2px solid white",
                            boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                          }}
                        >
                          ✕
                        </Box>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    {product?.product_title_eng}
                  </TableCell>

                  <TableCell align="center">
                    {product?.type_info?.type_name}
                  </TableCell>

                  <TableCell align="center">
                    {product?.category_info?.category_name}
                  </TableCell>

                  <TableCell align="center">
                    {product?.sub_category_info?.sub_category_name}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    {product?.is_popular ? (
                      <Tooltip title="Remove Popular Status">
                        <FavoriteIcon
                          sx={{ color: "red", mx: 2, cursor: "pointer" }}
                          onClick={() =>
                            handleUpdateProductStatus(
                              product._id,
                              "is_popular",
                              false,
                              i
                            )
                          }
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Mark as Popular">
                        <FavoriteBorderIcon
                          sx={{ color: "red", mx: 2, cursor: "pointer" }}
                          onClick={() =>
                            handleUpdateProductStatus(
                              product._id,
                              "is_popular",
                              true,
                              i
                            )
                          }
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Update Product">
                      <BorderColorIcon
                        sx={{ color: "#7367f0", mr: 2, cursor: "pointer" }}
                        onClick={() =>
                          handleOpenModal("update-item", product, page * 10 + i)
                        }
                      />
                    </Tooltip>
                    {product?.show_on_web ? (
                      <Tooltip title="Hide from Store">
                        <RemoveRedEyeIcon
                          sx={{ color: "green", cursor: "pointer" }}
                          onClick={() =>
                            handleUpdateProductStatus(
                              product._id,
                              "show_on_web",
                              false,
                              i
                            )
                          }
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Show in Store">
                        <VisibilityOffIcon
                          sx={{ color: "green", cursor: "pointer" }}
                          onClick={() =>
                            handleUpdateProductStatus(
                              product._id,
                              "show_on_web",
                              true,
                              i
                            )
                          }
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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

const product_status_info = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];
