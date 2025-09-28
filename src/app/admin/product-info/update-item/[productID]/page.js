'use client';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useValidation from '../../add-item/components/useValidation';
import formatServerError from '@/@core/utlis/formatServerErrors';
import {
  swalMessage,
  swalMessageError,
} from '@/@core/components/message/swal-message';
import { grey } from '@mui/material/colors';
import ItemBasicInfo from '../../add-item/components/basic-info';
import ProductDescription from '../../add-item/components/description';
import { useStepWizard } from '@/@core/components/hooks/useSteps';
import axiosWithFormData from '@/configs/axios/axiosWithFormData';
import { toast } from 'react-toastify';
const UpdateGroceryItems = ({ handleClose, product, index }) => {
  const {
    _id,
    stock,
    rating,
    is_active,
    is_popular,
    createdBy,
    updatedBy,
    custom_product_id,
    createdAt,
    updatedAt,
    __v,
    ...othersProduct
  } = product;

  const [loadForm, setLoadForm] = useState(false);

  useEffect(() => {
    setLoadForm(true);
  }, []);

  
  const [showSavedImg, setShowSavedImg] = useState(true);
  const [errorsServer, setErrorsServer] = React.useState([]);
  const [clickOnSubmit, setClickOnSubmit] = React.useState(false);
  const [progressing, setProgressing] = React.useState(false);

  const [productsData, setProductData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  React.useEffect(() => {
    setIsLoading(false);
    setProductData(othersProduct);
  }, []);

  // steps setup
  const stepsData = ['Basic Information', 'Product Description'];

  const { handleSteps, activeSteps, dataLenght, StepsWizard } = useStepWizard({
    stepsData,
  });

  const [imageApp, setImageApp] = useState('');
  const [imageWeb, setImageWeb] = useState('');

  const handleAppImageUrl = (src) => {
    setImageApp(src);
  };
  const handleWebImageUrl = (src) => {
    setImageWeb(src);
  };

  const handleProductDataChange = (name, value) => {
    if (name === 'max_retail_price') {
      const MRP = parseFloat(value) || 0;
      let salePrice = MRP;

      if (parseFloat(productsData.less) > 0) {
        if (productsData.less_type === 'Fixed') {
          salePrice = MRP - parseFloat(productsData.less);
        } else {
          salePrice = MRP - (MRP * parseFloat(productsData.less)) / 100;
        }
      }
      setProductData((prev) => ({
        ...prev,
        max_retail_price: MRP,
        sale_price: salePrice,
      }));
    } else if (name === 'less') {
      const Less = parseFloat(value) || 0;
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      let salePrice = MRP;

      if (Less > 0 && MRP > 0) {
        if (productsData.less_type === 'Fixed') {
          salePrice = MRP - Less;
        } else {
          salePrice = MRP - (MRP * Less) / 100;
        }
      }
      setProductData((prev) => ({
        ...prev,
        less: Less,
        sale_price: salePrice,
      }));
    } else if (name === 'less_type') {
      const Less = parseFloat(productsData.less);
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      let salePrice = MRP;

      if (Less > 0 && MRP > 0) {
        if (value === 'Fixed') {
          salePrice = MRP - Less;
        } else {
          salePrice = MRP - (MRP * Less) / 100;
        }
      }
      setProductData((prev) => ({
        ...prev,
        less_type: value,
        sale_price: salePrice,
      }));
    } else if (name === 'sale_price') {
      const SalePrice = parseFloat(value) || 0;
      let Less = 0;
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      if (SalePrice > 0 && MRP > 0 && MRP > SalePrice) {
        if (productsData.less_type === 'Fixed') {
          Less = MRP - SalePrice;
        } else {
          Less = ((MRP - SalePrice) * 100) / MRP;
        }
      }
      setProductData((prev) => ({
        ...prev,
        less: Less,
        sale_price: SalePrice,
      }));
    } else {
      if (value) {
        setProductData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else {
        setProductData((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    }
  };

  const handleData = (name, value) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value.value,
    }));
  };

  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const formData = watch();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data found');
  };

  const handleProductDataSubmit = async () => {
    setProgressing(true);
    const normalizeId = (field) => 
    typeof field === "object" ? field?._id : field;

    productsData.type_info = normalizeId(productsData.type_info);
    productsData.category_info = normalizeId(productsData.category_info);
    productsData.sub_category_info = normalizeId(productsData.sub_category_info);
    productsData.brand_info = normalizeId(productsData.brand_info) || '303030303030303030303030';
    productsData.previous_web_img = othersProduct?.web_image;
    productsData.previous_app_img = othersProduct?.app_image;
    productsData.previous_details_img = othersProduct?.detail_product_image;

    
    const formData = new FormData();

    for (const key in productsData) {
      if (key !== 'detail_product_image') {
        formData.append(key, productsData[key]);
      } else {
        productsData[key].forEach((image, i) => {
          if (i < 9 && image?.file) {
            formData.append('detail_product_image', image.file);
          }
        });
      }
    }
   
    const typeToUrlMap = {
      '6880c277098c458993b32681': '/api/v1//foot-and-wear-product/update',
      '6880c255098c458993b3267b': '/api/v1/health-and-beauty-product/update',
      '6880c24c098c458993b32679': '/api/v1/kids-product/update',
      '6880c244098c458993b32677': '/api/v1/women-product/update',
      '6880c239098c458993b32675': '/api/v1/men-product/update',
    };

    const url = typeToUrlMap[productsData?.type_info];
    if (!url) {
      return toast.info('Please select type!', {
        position: 'top-center',
      });
    }
    await axiosWithFormData
      .put(`${url}/${_id}`, formData)
      .then((result) => {
        setImageWeb('');
        setImageApp('');
        setProgressing(false);
        swalMessage({ message: 'Product updated successfully!' });
        handleClose();
      })
      .catch((error) => {
        console.log(error);
        setProgressing(false);
        swalMessageError({ message: 'Something went wrong!' });
        const errorMsg = formatServerError(error?.response?.data?.errors);
        setErrorsServer(errorMsg);
      });
  };

  const [firstStepError, setFirstStepError] = useState();

  const { validateFirstStep } = useValidation();

  const basiInfoValidation = () => {
    const errorsData = validateFirstStep(productsData);
    // console.log(errorsData);
    // setFirstStepError(errorsData);
    handleSteps('next');
  };

  return (
    <div>
      <p className="text-2xl font-bold text-center my-8">
        Update Product Items
      </p>
      <StepsWizard />
      <Grid container spacing={3}>
        <Grid item xs={12} className="form-grid">
          <Paper
            className="all-form-sec"
            component="form"
            onSubmit={handleSubmit}
          >
            {loadForm && activeSteps === 0 && (
              <ItemBasicInfo
                handleProductDataChange={handleProductDataChange}
                productsData={productsData}
                errors={errorsServer}
                clickOnSubmit={clickOnSubmit}
                handleAppImageUrl={handleAppImageUrl}
                handleWebImageUrl={handleWebImageUrl}
                imageApp={imageApp}
                imageWeb={imageWeb}
                duringUpdate={showSavedImg}
                setShowSavedImg={setShowSavedImg}
              />
            )}
            {activeSteps === 1 && (
              <ProductDescription
                handleProductDataChange={handleProductDataChange}
                errors={errorsServer}
                clickOnSubmit={clickOnSubmit}
                productsData={productsData}
              />
            )}
            <Box
              className="footer-btn-box"
              sx={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                padding: '2em 1.3em',
              }}
            >
              {activeSteps === 0 ? (
                <div />
              ) : (
                <Button
                  color="warning"
                  onClick={() => handleSteps('prev')}
                  className="square-blue-btn"
                  sx={{ fontWeight: 600 }}
                >
                  Previous
                </Button>
              )}
              {dataLenght === activeSteps ? (
                progressing ? (
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
                    onClick={() => handleProductDataSubmit()}
                    className="text-center bg-cwgreen"
                  >
                    Save
                  </Button>
                )
              ) : (
                <Button
                  className="square-blue-btn next"
                  sx={{ fontWeight: 600 }}
                  onClick={basiInfoValidation}
                >
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
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

export default UpdateGroceryItems;
