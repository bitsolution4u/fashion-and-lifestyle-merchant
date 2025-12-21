import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OrderListByCustomer from "./order-list";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 500,
  bgcolor: "background.paper",
  border: "2px solid #eeeee",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function OrderListModal({ open, setOpen, handleChange }) {
  const handleClose = () =>
    setOpen((prev) => ({ ...prev, modalOpen: false, dataInfo: "" }));

  return (
    <div>
      <Modal
        open={open.modalOpen}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 450 }} component="form">
          {open.modalOpen && (
            <>
              {open.dataInfo === "order-list" && (
                <OrderListByCustomer
                  handleClose={handleClose}
                  model={open.model}
                  orderList={open.product}
                  index={open.index}
                />
              )}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
