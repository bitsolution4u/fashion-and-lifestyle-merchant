import CustomTextField from '@/@core/components/mui/text-field';
import axiosWithoutCredential from '@/configs/axios/axiosWithoutCredential';
import { Autocomplete, Button, CircularProgress, Divider } from '@mui/material';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddType = ({ handleClose, shop_id, onAddSuccess }) => {
  const [selectTypeInfo, setSelectTypeInfo] = useState('');
  const [typeInfo, setTypeInfo] = useState([]);
  const [progressing, setProgressing] = useState(false);

  const getAllTypeInfo = async () => {
    try {
      const res = await axiosWithoutCredential.get('/api/v1/type/all-type');
      setTypeInfo(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    getAllTypeInfo();
  }, []);

  const handleSubmit = async () => {
    if (!selectTypeInfo) return toast.error('Please select a type!');
    setProgressing(true);
    try {
      await axiosWithoutCredential.post('/api/v1/type/assign-type', {
        store_info: shop_id,
        type_info: selectTypeInfo,
      });
      toast.success('Product Type assigned successfully!', { position: 'top-center' });
      setProgressing(false);
      handleClose();
      if (onAddSuccess) onAddSuccess(); // refresh table
    } catch (err) {
      console.error(err);
      setProgressing(false);
      toast.error(err?.response?.data?.message || 'Something went wrong!', { position: 'top-center' });
    }
  };

  return (
    <div>
      <p className="text-center">Assign Type To Store</p>
      <Divider sx={{ mt: 2, mb: 4 }} />
      <Autocomplete
        sx={{ mt: 2 }}
        fullWidth
        size="small"
        options={typeInfo}
        getOptionLabel={(option) => option?.type_name || ''}
        onChange={(e, value) => setSelectTypeInfo(value?._id)}
        renderInput={(params) => <CustomTextField {...params} label="Select Type" placeholder="Select Type" />}
      />
      <div className="text-center mt-4">
        {progressing ? (
          <Button type="button" variant="contained" sx={{ backgroundColor: '#7367F0' }}>
            <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Wait...
          </Button>
        ) : (
          <Button type="button" variant="contained" sx={{ backgroundColor: '#7367F0' }} onClick={handleSubmit}>
            Save Type
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

export default AddType;
