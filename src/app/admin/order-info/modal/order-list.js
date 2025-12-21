// import { BaseAppUrl, FoodItemUrl } from "@/@core/utlis/secretVariable";
// import {
//   Box,
//   Button,
//   Card,
//   Divider,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@mui/material";
// import { grey } from "@mui/material/colors";
// import React from "react";

// const OrderListByCustomer = ({ handleClose, orderList }) => {
//   console.log(orderList);
//   return (
//     <>
//       <Card sx={{ maxWidth: 580 }}>
//         <Paper sx={{ width: "100%", overflow: "hidden" }}>
//           <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
//             <Typography color="primary">Ordered Product Details</Typography>
//           </Box>
//           <Divider />

//           <TableContainer sx={{ maxHeight: 1000 }}>
//             <Table stickyHeader aria-label="sticky table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 600 }}>No.</TableCell>
//                   <TableCell
//                     sx={{
//                       fontWeight: 600,
//                       textAlign: "",
//                     }}
//                   >
//                     Ordered Item Img
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Item Title</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
//                   <TableCell sx={{ fontWeight: 600 }}>Sale Price</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orderList?.orderItems?.map((item, index) => (
//                   <TableRow hover role="checkbox" tabIndex={-1} key={index}>
//                     <TableCell>{index + 1}</TableCell>
//                     <TableCell>
//                       <img
//                         alt="img not found"
//                         src={`${BaseAppUrl}/${item?.ordered_img}`}
//                         width={80}
//                         height={50}
//                       />
//                     </TableCell>
//                     <TableCell>{item?.product_title_beng}</TableCell>
//                     <TableCell>{item?.quantity}</TableCell>
//                     <TableCell>{item?.sale_price}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <Divider sx={{ my: 2 }} />

//               <Box sx={{ px: 2, pb: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography color="text.secondary">Sub Total</Typography>
//                   <Typography fontWeight={600}>
//                     ৳ {orderList?.subTotal}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography color="text.secondary">Less Amount</Typography>
//                   <Typography fontWeight={600}>
//                     ৳ {orderList?.less_amount}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography color="text.secondary">VAT</Typography>
//                   <Typography fontWeight={600}>
//                     ৳ {orderList?.vatAmount}
//                   </Typography>
//                 </Box>

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography color="text.secondary">
//                     Delivery Charge
//                   </Typography>
//                   <Typography fontWeight={600}>
//                     ৳ {orderList?.deliveryCharge}
//                   </Typography>
//                 </Box>

//                 <Divider sx={{ my: 1 }} />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Typography fontWeight={700}>Total Amount</Typography>
//                   <Typography fontWeight={700} color="primary">
//                     ৳ {orderList?.totalAmount}
//                   </Typography>
//                 </Box>
//               </Box>
//             </Table>
//           </TableContainer>
//         </Paper>
//       </Card>
//       <div className="text-right">
//         <Button
//           variant="outlined"
//           onClick={handleClose}
//           sx={{
//             borderColor: grey[800],
//             color: grey[800],
//             mt: 2,
//             "&:hover": {
//               backgroundColor: grey[800],
//               color: "white",
//               borderColor: grey[800],
//             },
//           }}
//         >
//           Close
//         </Button>
//       </div>
//     </>
//   );
// };

// export default OrderListByCustomer;

import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import {
  Box,
  Button,
  Card,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const OrderListByCustomer = ({ handleClose, orderList }) => {
  return (
    <>
      <Card sx={{ maxWidth: 580 }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          {/* Header */}
          <Box sx={{ p: 2 }}>
            <Typography color="primary" fontWeight={600}>
              Ordered Product Details
            </Typography>
          </Box>

          <Divider />

          {/* Table */}
          <TableContainer sx={{ maxHeight: 1000 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>No.</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    Ordered Item Img
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Item Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Sale Price</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderList?.orderItems?.map((item, index) => (
                  <TableRow key={item?._id || index} hover>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <img
                        src={`${BaseAppUrl}/${item?.ordered_img}`}
                        alt="product"
                        width={80}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                      />
                    </TableCell>

                    <TableCell>{item?.product_title_beng}</TableCell>

                    <TableCell>{item?.quantity}</TableCell>

                    <TableCell>৳ {item?.sale_price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Order Summary */}
          <Divider sx={{ my: 2 }} />

          <Box sx={{ px: 2, pb: 2 }}>
            <SummaryRow label="Sub Total" value={orderList?.subTotal} />
            <SummaryRow label="Less Amount" value={orderList?.less_amount} />
            <SummaryRow label="VAT" value={orderList?.vatAmount} />
            <SummaryRow
              label="Delivery Charge"
              value={orderList?.deliveryCharge}
            />

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight={700}>Total Amount</Typography>
              <Typography fontWeight={700} color="primary">
                ৳ {orderList?.totalAmount}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Card>

      {/* Close Button */}
      <Box sx={{ textAlign: "right" }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: grey[800],
            color: grey[800],
            mt: 2,
            "&:hover": {
              backgroundColor: grey[800],
              color: "white",
              borderColor: grey[800],
            },
          }}
        >
          Close
        </Button>
      </Box>
    </>
  );
};

/* Reusable Row Component */
const SummaryRow = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      mb: 1,
    }}
  >
    <Typography color="text.secondary">{label}</Typography>
    <Typography fontWeight={600}>৳ {value || 0}</Typography>
  </Box>
);

export default OrderListByCustomer;
