// import CustomTextField from '@/@core/components/mui/text-field';
// import { useFoodAdmin } from '@/@core/hooks/fetch-data/food/food-admin';
// import { handleFoodStoreReducer } from '@/store/reducer/food-store-reducer';
// import { Autocomplete, Button, Typography } from '@mui/material';
// import { grey } from '@mui/material/colors';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// const SelectStore = ({ handleClose }) => {
//   const dispatch = useDispatch();

//   const { storeInfo } = useSelector((state) => state?.foodStore);

//   const { getFoodStoreInfo } = useFoodAdmin();
//   React.useEffect(() => {
//     getFoodStoreInfo();
//   }, [dispatch]);

//   const handleSelectStore = (store) => {
//     localStorage.setItem('selectedStoreForAddProduct', JSON.stringify(store));
//     dispatch(
//       handleFoodStoreReducer({
//         type: 'SAVE_SELECTED_STORE',
//         data: store,
//       })
//     );
//   };

//   return (
//     <div>
//       <Typography className="text-center text-lg font-serif">
//         Select Store To Add Products!!!
//       </Typography>
//       <div className="flex justify-center my-5">
//         <div className="w-5/6">
//           <Autocomplete
//             fullWidth
//             placeholder="Select Store"
//             className=" mr-10 "
//             size="small"
//             disablePortal
//             id="combo-box-demo"
//             renderOption={(props, option) => {
//               return (
//                 <li {...props} key={option._id}>
//                   {option.shop_name}
//                 </li>
//               );
//             }}
//             options={storeInfo}
//             getOptionLabel={(option) => option.shop_name}
//             onChange={(e, value) => {
//               handleSelectStore(value);
//             }}
//             renderInput={(params) => (
//               <CustomTextField {...params} label="Select Store" font="bold" />
//             )}
//           />
//         </div>
//       </div>
//       {/* {selectedStore?.shop_name && ( */}
//       <div className="text-right">
//         <Button
//           variant="outlined"
//           onClick={handleClose}
//           sx={{
//             borderColor: grey[800],
//             color: grey[800],
//             mt: 2,
//             '&:hover': {
//               backgroundColor: grey[800],
//               color: 'white',
//               borderColor: grey[800],
//             },
//           }}
//         >
//           Close
//         </Button>
//       </div>
//       {/* )} */}
//     </div>
//   );
// };

// export default SelectStore;
