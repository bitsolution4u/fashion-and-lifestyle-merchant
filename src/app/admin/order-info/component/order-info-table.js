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
  Typography,
} from "@mui/material";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import { useSelector } from "react-redux";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "./PickersCustomInput";
import CustomTextField from "@/@core/components/mui/text-field";
import addDays from "date-fns/addDays";

export default function OrderInfoTable() {
  const [loading, setLoading] = React.useState(false);
  const [allOrderInfo, setAllOrderInfo] = React.useState([]);
  const [tempOrderInfo, setTempOrderInfo] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState("Pending");

  // --- Bangladesh date helpers ---
  const getBangladeshTodayStart = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const bstTime = new Date(utc + 6 * 60 * 60 * 1000);
    return new Date(
      bstTime.getFullYear(),
      bstTime.getMonth(),
      bstTime.getDate()
    );
  };

  const getBangladeshTodayEnd = () => {
    const start = getBangladeshTodayStart();
    start.setHours(23, 59, 59, 999); // end of today
    return start;
  };

  const todayStart = getBangladeshTodayStart();

  const minDateObj = new Date(todayStart);
  minDateObj.setDate(minDateObj.getDate() - 3); // 3 days before today

  const maxDateObj = getBangladeshTodayEnd();

  const [minDate, setMinDate] = React.useState(minDateObj);
  const [maxDate, setMaxDate] = React.useState(maxDateObj);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const userCredential = useSelector((state) => state.user.loginUserInfo);
  const { saveLoggedInUserInfo } = useAdmin();

  React.useEffect(() => {
    if (!userCredential) {
      saveLoggedInUserInfo();
    }
  }, [userCredential, saveLoggedInUserInfo]);

  const getAllOrderInfo = async () => {
    setLoading(true);
    const dataObj = {
      merchant_id: userCredential?.merchantId,
      custom_merchant_id: userCredential?.customStoreId,
    };

    await axiosWithoutCredential
      .post(`/api/v1/customer-order/orderinfo-by-merchant`, dataObj)
      .then((result) => {
        setLoading(false);
        setPage(0);
        setAllOrderInfo(result?.data?.result);
        setTempOrderInfo(result?.data?.result);
      })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => {
    if (userCredential) {
      getAllOrderInfo();
    }
  }, [userCredential]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return date
      .toLocaleString("en-GB", options)
      .replace(",", "")
      .replace(/\//g, "-");
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { background: "#FEF3C7", color: "#B45309" };
      case "confirm":
      case "confirmed":
        return { background: "#DCFCE7", color: "#15803D" };
      case "cancel":
      case "canceled":
        return { background: "#FEE2E2", color: "#B91C1C" };
      case "returned":
        return { background: "#FEF3C7", color: "#B45309" };
      default:
        return { background: "#E5E7EB", color: "#374151" };
    }
  };

  const handleUpdateOrderStatus = async (id, status, index) => {
    const dataObj = { order_id: id, order_status: status };

    await axiosWithoutCredential
      .post(`/api/v1/customer-order/update-order-status`, dataObj)
      .then(() => {
        setTempOrderInfo((prev) => {
          let newArr = [...prev];
          const targetIndex = index + page * rowsPerPage;
          if (newArr[targetIndex]) {
            newArr[targetIndex] = {
              ...newArr[targetIndex],
              order_status: status,
            };
          }
          return newArr;
        });
        toast.success("Order Status Updated Successfully", {
          position: "top-center",
        });
      })
      .catch(() =>
        toast.error("Something went wrong!", {
          position: "top-center",
        })
      );
  };

  // --- Filter function with correct BD dates ---
  const handleFilterOrderData = () => {
    setPage(0);
    const filtered = allOrderInfo.filter((order) => {
      const orderDate = new Date(order.createdAt); // or deliveryAt if needed
      return (
        orderDate >= minDate &&
        orderDate <= maxDate &&
        order.order_status === selectedStatus
      );
    });

    setTempOrderInfo(filtered);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Typography color="primary" fontWeight={600} fontSize={18}>
          Customer Order Information
        </Typography>
      </Box>
      <Divider />

      <div className="w-full px-5 my-8 mb-10">
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* From Date */}
          <div style={{ position: "relative", zIndex: 9999 }}>
            <DatePicker
              disablePortal
              dateFormat="dd/MM/yyyy"
              selected={minDate}
              maxDate={addDays(new Date(), 0)}
              onChange={(date) => setMinDate(date)}
              customInput={<CustomDateInput label="From" />}
            />
          </div>

          {/* To Date */}
          <div style={{ position: "relative", zIndex: 9999 }}>
            <DatePicker
              disablePortal
              dateFormat="dd/MM/yyyy"
              selected={maxDate}
              maxDate={addDays(new Date(), 0)}
              onChange={(date) => {
                const end = new Date(date);
                end.setHours(23, 59, 59, 999); // ensure end of day
                setMaxDate(end);
              }}
              customInput={<CustomDateInput label="To" />}
            />
          </div>

          {/* Status Dropdown */}
          <div style={{ minWidth: "220px" }}>
            <Autocomplete
              disablePortal
              fullWidth
              options={order_status_info}
              getOptionLabel={(option) => option?.value}
              onChange={(e, value) => setSelectedStatus(value?.value || null)}
              renderOption={(props, option) => (
                <li {...props} key={option?.label}>
                  {option?.value}
                </li>
              )}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Select Order Status"
                  placeholder="Select Order Status"
                />
              )}
            />
          </div>

          {/* Search Button */}
          <div className="mt-5">
            {loading ? (
              <Button variant="contained" className="bg-cwgreen">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CircularProgress
                    size={20}
                    style={{ color: "white", marginRight: 10 }}
                  />
                  Wait...
                </div>
              </Button>
            ) : (
              <Button
                onClick={handleFilterOrderData}
                variant="contained"
                sx={{ backgroundColor: "#7367F0 !important" }}
              >
                Search
              </Button>
            )}
          </div>
        </Box>
      </div>

      <TableContainer
        sx={{ maxHeight: "70vh", minHeight: "20vh", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">No.</TableCell>
              <TableCell align="center">Order Date & Time</TableCell>
              <TableCell align="center">Customer Name</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Contact</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tempOrderInfo
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order, i) => (
                <TableRow hover key={order?._id}>
                  <TableCell align="center">
                    {page * rowsPerPage + i + 1}
                  </TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        background: "#EEF2FF",
                        color: "#4F46E5",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                    >
                      {formatDate(order?.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {order?.customerInfo?.customer_name}
                  </TableCell>

                  <TableCell align="center">
                    {order?.customerInfo?.customer_address?.slice(0, 50)}
                  </TableCell>

                  <TableCell align="center">
                    {order?.customerInfo?.contact_no}
                  </TableCell>

                  <TableCell align="center">{order?.totalAmount}</TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        ...getStatusStyle(order?.order_status),
                      }}
                    >
                      {order?.order_status}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <Box
                      display="flex"
                      gap={1.5}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      {order?.order_status !== "Confirm" && (
                        <Button
                          onClick={() =>
                            handleUpdateOrderStatus(order?._id, "Confirm", i)
                          }
                          variant="contained"
                          color="success"
                          size="small"
                        >
                          Confirm
                        </Button>
                      )}

                      {order?.order_status !== "Cancel" && (
                        <Button
                          onClick={() =>
                            handleUpdateOrderStatus(order?._id, "Cancel", i)
                          }
                          variant="outlined"
                          color="error"
                          size="small"
                        >
                          Cancel
                        </Button>
                      )}

                      {order?.order_status !== "Returned" && (
                        <Button
                          onClick={() =>
                            handleUpdateOrderStatus(order?._id, "Returned", i)
                          }
                          variant="outlined"
                          color="warning"
                          size="small"
                        >
                          Returned
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={tempOrderInfo?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
}

const order_status_info = [
  { label: "Pending", value: "Pending" },
  { label: "Confirm", value: "Confirm" },
  { label: "Cancel", value: "Cancel" },
  { label: "Returned", value: "Returned" },
];
