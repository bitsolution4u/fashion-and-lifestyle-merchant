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

export default function OrderInfoTable() {
  const [orderDate, setOrderDate] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [allOrderInfo, setAllOrderInfo] = React.useState([]);
  const [tempOrderInfo, setTempOrderInfo] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState("Pending");

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

  // const handleFilterOrderData = () => {
  //   const result = allOrderInfo?.filter((order) => {
  //     const created = new Date(order.createdAt);

  //     return (
  //       created.getFullYear() === orderDate.getFullYear() &&
  //       created.getMonth() === orderDate.getMonth() &&
  //       created.getDate() === orderDate.getDate()
  //     );
  //   });

  //   setTempOrderInfo(result);
  // };

  const handleFilterOrderData = () => {
    const result = allOrderInfo?.filter((order) => {
      const created = new Date(order.createdAt);

      const isSameDate =
        orderDate &&
        created.getFullYear() === orderDate.getFullYear() &&
        created.getMonth() === orderDate.getMonth() &&
        created.getDate() === orderDate.getDate();

      const isSameStatus =
        selectedStatus && order.order_status === selectedStatus;

      // FILTER LOGIC:
      // If user selects BOTH → filter by BOTH
      // If selects ONLY date → filter by date
      // If selects ONLY status → filter by status
      // If selects NONE → return all
      if (orderDate && selectedStatus) return isSameDate && isSameStatus;
      if (orderDate && !selectedStatus) return isSameDate;
      if (!orderDate && selectedStatus) return isSameStatus;

      return true; // no filters selected → all orders
    });

    setTempOrderInfo(result);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <Typography color="primary" fontWeight={600} fontSize={18}>
          Customer Order Information
        </Typography>
      </Box>
      <Divider />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8 w-full px-5 mb-10">
        <Box sx={{ position: "relative", zIndex: 50 }}>
          <DatePicker
            dateFormat="dd/MM/yyyy"
            selected={orderDate}
            maxDate={new Date()}
            onChange={(date) => setOrderDate(date)}
            customInput={<CustomDateInput label="Select Order Date" />}
            popperPlacement="bottom-start"
          />
        </Box>
        <Autocomplete
          fullWidth
          size="small"
          defaultValue={order_status_info[0]}
          options={order_status_info}
          getOptionLabel={(option) => option.value}
          onChange={(e, value) => setSelectedStatus(value?.value || "")}
          renderInput={(params) => (
            <CustomTextField {...params} label="Select Status" />
          )}
        />
        <div className="flex items-end">
          {loading ? (
            <Button type="button" variant="contained">
              <div className="flex items-center">
                <CircularProgress
                  style={{ color: "white", marginRight: "10px" }}
                  size={20}
                />
                Wait...
              </div>
            </Button>
          ) : (
            <Button
              onClick={() => handleFilterOrderData()}
              variant="contained"
              sx={{ backgroundColor: "#7367F0 !important" }}
            >
              Search
            </Button>
          )}
        </div>
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
                    <Box display="flex" gap={2} justifyContent="center">
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
];
