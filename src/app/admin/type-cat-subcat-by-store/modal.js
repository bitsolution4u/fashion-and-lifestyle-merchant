import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddType from './modal-form/add-type';
import AddCategory from './modal-form/add-category';
import AddSubCategory from './modal-form/add-subcategory';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 500,
  bgcolor: 'background.paper',
  border: '2px solid #eeeee',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  maxHeight: '90vh',
  overflowY: 'auto',
};

export default function ProductPageModal({ open, setOpen, onAddSuccess }) {
  const handleClose = () => setOpen((prev) => ({ ...prev, modalOpen: false, dataInfo: '' }));

  return (
    <Modal
      open={open.modalOpen}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ ...style, width: 500 }} component="form">
        {open.modalOpen && (
          <>
            {open.dataInfo === 'add-type' && (
              <AddType handleClose={handleClose} shop_id={open.shop_id} onAddSuccess={onAddSuccess} />
            )}
            {open.dataInfo === 'add-category' && (
              <AddCategory handleClose={handleClose} shop_id={open.shop_id} onAddSuccess={onAddSuccess} />
            )}
            {open.dataInfo === 'add-subcategory' && (
              <AddSubCategory handleClose={handleClose} shop_id={open.shop_id} onAddSuccess={onAddSuccess} />
            )}
          </>
        )}
      </Box>
    </Modal>
  );
}
