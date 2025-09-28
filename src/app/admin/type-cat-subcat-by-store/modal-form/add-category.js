import CustomTextField from '@/@core/components/mui/text-field';
import { Autocomplete, Button, CircularProgress, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axiosWithoutCredential from '@/configs/axios/axiosWithoutCredential';
import { toast } from 'react-toastify';

const AddCategory = ({ handleClose, shop_id, onAddSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [progressing, setProgressing] = useState(false);
  const [selectTypeInfo, setSelectTypeInfo] = useState('');
  const [typeInfo, setTypeInfo] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [selectCategoryInfo, setSelectCategoryInfo] = useState('');

  // Fetch all types
  const getAllTypeInfo = async () => {
    try {
      const result = await axiosWithoutCredential.get(`/api/v1/type/all-type-by-store/${shop_id}`);
      setTypeInfo(result?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch categories by type
  const getAllCategoryInfoByType = async (id) => {
    try {
      const result = await axiosWithoutCredential.get(`/api/v1/category/category-by-type/${id}`);
      setCategoryInfo(result?.data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllTypeInfo();
  }, []);

  const onSubmit = async (data) => {
    if (!selectTypeInfo || !selectCategoryInfo) {
      toast.error('Please select type and category!', { position: 'top-center' });
      return;
    }

    const dataInfo = {
      store_info: shop_id,
      type_info: selectTypeInfo,
      category_info: selectCategoryInfo,
    };

    try {
      setProgressing(true);
      await axiosWithoutCredential.post(`/api/v1/category/assign-category`, dataInfo);
      toast.success('Category successfully assigned to store!', { position: 'top-center' });
      setProgressing(false);
      handleClose(); // This will also refresh the table in parent
       if (onAddSuccess) onAddSuccess(); 
    } catch (error) {
      setProgressing(false);
      toast.error(error?.response?.data?.message || 'Something went wrong!', {
        position: 'top-center',
      });
    }
  };

  return (
    <div>
      <p className="text-center">Assign Category To Store</p>
      <Divider sx={{ mt: 2, mb: 4 }} />

      <Autocomplete
        sx={{ mt: 2 }}
        fullWidth
        size="small"
        disablePortal
        options={typeInfo}
        getOptionLabel={(option) => option?.type_info?.type_name || ''}
        onChange={(e, value) => {
          setSelectTypeInfo(value?.type_info?._id || '');
          getAllCategoryInfoByType(value?.type_info?._id);
        }}
        renderInput={(params) => (
          <CustomTextField {...params} label="Select Type" placeholder="Select Type" font="bold" />
        )}
      />

      <Autocomplete
        sx={{ mt: 2 }}
        fullWidth
        size="small"
        disablePortal
        options={categoryInfo}
        getOptionLabel={(option) => option?.category_name || ''}
        onChange={(e, value) => setSelectCategoryInfo(value?._id || '')}
        renderInput={(params) => (
          <CustomTextField {...params} label="Select Category" placeholder="Select Category" font="bold" />
        )}
      />

      <div className="text-center">
        {progressing ? (
          <Button variant="contained">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress style={{ color: 'white', marginRight: '10px' }} size={20} />
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
            Save Category
          </Button>
        )}
      </div>

      <div className="text-right">
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{
            borderColor: grey[800],
            color: grey[800],
            mt: 2,
            '&:hover': { backgroundColor: grey[800], color: 'white', borderColor: grey[800] },
          }}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default AddCategory;
