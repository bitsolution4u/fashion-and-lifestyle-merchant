// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import SelectStore from './modal-contant';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   minWidth: 500,
//   bgcolor: 'background.paper',
//   border: '2px solid #eeeee',
//   borderRadius: 5,
//   boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3,
// };

// export default function ProductPageModal({ open, setOpen, handleChange }) {
//   const handleClose = () =>
//     setOpen((prev) => ({ ...prev, modalOpen: false, dataInfo: '' }));

//   return (
//     <div>
//       <Modal
//         open={open.modalOpen}
//         aria-labelledby="parent-modal-title"
//         aria-describedby="parent-modal-description"
//       >
//         <Box sx={{ ...style, width: 400 }} component="form">
//           {open.modalOpen && (
//             <>
//               <SelectStore handleClose={handleClose} />
//             </>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// }
