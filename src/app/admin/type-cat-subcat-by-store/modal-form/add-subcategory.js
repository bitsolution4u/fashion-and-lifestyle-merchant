import CustomTextField from '@/@core/components/mui/text-field';
import { Autocomplete,  Button, CircularProgress, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, {  useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosWithoutCredential from '@/configs/axios/axiosWithoutCredential';
import { useSearchParams } from 'next/navigation';

const AddSubCategory = ({ handleClose, shop_id, onAddSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
    const [progressing, setProgressing] = useState(false);
    const [selectTypeInfo, setSelectTypeInfo] = useState('');
    const [typeInfo, setTypeInfo] = React.useState([]);
    const [categoryInfo, setCategoryInfo] = React.useState([]);
    const [selectCategoryInfo, setSelectCategoryInfo] = useState('');
    const [subcategoryInfo, setSubCategoryInfo] = React.useState([]);
    const [selectSubCategoryInfo, setSelectSubCategoryInfo] = useState('');
    const getAllTypeInfo = async () => {
      await axiosWithoutCredential
        .get(`/api/v1/type/all-type-by-store/${shop_id}`)
        .then((result) => {
          setTypeInfo(result?.data?.data);
        })
        .catch((error) => {
          // setLoading(false);
        });
    };

    const getAllCategoryInfoByType= async (id) => {
      const data = {store_info: shop_id, type_info: id}
      await axiosWithoutCredential
      .put(`/api/v1/category/all-category-by-store-and-type`, data)
        .then((result) => {
          console.log(result);
          setCategoryInfo(result?.data?.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getAllSubcategoryInfoByCat = async (id) => {
    await axiosWithoutCredential
      .get(`/api/v1/sub-category/subcategory-by-cat/${id}`)
      .then((result) => {
        console.log(result);
        setSubCategoryInfo(result?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

   
  React.useEffect(() => {
    getAllTypeInfo();
  }, []);
  const onSubmit = async (data) => {
   const dataInfo = {
    store_info: shop_id,
    type_info: selectTypeInfo,
    category_info: selectCategoryInfo,
    sub_category_info: selectSubCategoryInfo
   }
      await axiosWithoutCredential
        .post(`/api/v1/sub-category/assign-subcategory`, dataInfo)
        .then((result) => {
          toast.success('Product SubCategory Successfully assign to store!', {
            position: 'top-center',
          });
          setProgressing(false);
          handleClose();
           if (onAddSuccess) onAddSuccess(); // refresh table
        })
        .catch((error) => {
          setProgressing(false);
          toast.error(error?.response?.data?.message, {
            position: 'top-center',
          });
        });
  };

  return (
    <div>
      <div>
        <p className="text-center">
          Assign SubCategory To Store
        </p>
        <Divider sx={{ mt: 2, mb: 4 }} />
        <Autocomplete
          sx={{ mt: 2 }}
          fullWidth
          size="small"
          disablePortal
          id="combo-box-demo"
          renderOption={(props, option) => {
            return (
              <li {...props} key={option?._id}>
                {option?.type_info?.type_name}
              </li>
            );
          }}
          options={typeInfo}
          getOptionLabel={(option) => option?.type_info?.type_name}
          onChange={(e, value) => {
            setSelectTypeInfo(value?.type_info?._id);
            getAllCategoryInfoByType(value?.type_info?._id)
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
         <Autocomplete
          sx={{ mt: 2 }}
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
          getOptionLabel={(option) => option?.category_info?.category_name}
          onChange={(e, value) => {
            console.log(value);
            setSelectCategoryInfo(value?.category_info?._id);
            getAllSubcategoryInfoByCat(value?.category_info?._id)
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              label="Select Category"
              placeholder="Select Category"
              font="bold"
            />
          )}
        />
       <Autocomplete
                      sx={{ mt: 2 }}
      fullWidth
       size="small"
        disablePortal
        id="combo-box-demo"
        renderOption={(props, option) => {
        return (
       <li {...props} key={option?._id}>
       {option?.sub_category_name}
       </li>
      );
        }}
        options={subcategoryInfo}
        getOptionLabel={(option) => option?.sub_category_name}
        onChange={(e, value) => {
        setSelectSubCategoryInfo(value?._id);
       }}
        renderInput={(params) => (
        <CustomTextField
        {...params}
        placeholder="Select Subcategory"
        font="bold"
       />)}
      />
        <div className="text-center">
          {progressing ? (
            <Button
              type="button"
              variant="contained"
              className="text-center bg-cwgreen"
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress
                  style={{ color: 'white', marginRight: '10px' }}
                  size={20}
                />
                Wait...
              </div>
            </Button>
          ) : (
            <Button
              type="button"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ backgroundColor: '#7367F0 !important', mt: 2 }}
            >
              Save SubCategory
            </Button>
          )}
        </div>
      </div>
      <div className="text-right">
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: grey[800],
            color: grey[800],
            mt: 2,
            '&:hover': {
              backgroundColor: grey[800],
              color: 'white',
              borderColor: grey[800],
            },
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AddSubCategory;
