import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogOut from '../logout';
import { handleFoodItemReducer } from '@/store/reducer/food-items-reducer';
import axiosWithCredential from '@/configs/axios/axiosWithCredential';
import { toast } from 'react-toastify';
import { handleUserReducer } from '@/store/reducer/auth-reducer';
import {
  v1_Food_Get_Store_Info,
  v1_Food_Store_Config_and_Notice,
  v1_Food_Store_OfferAndDeliveryInfo,
} from '@/@core/constants/api-endpoint';

export const useFoodHelper = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const foodData = useSelector((state) => state.foodItem);

  let dataBySelection = {
    sizeByCategory: foodData.sizeByCategory,
  };

  const saveDataBySelection = () => {
    dispatch(
      handleFoodItemReducer({
        type: 'SET_DATA_BY_SELECTION',
        data: dataBySelection.sizeByCategory,
      })
    );
  };

  const handleChangeCategory = (category_id) => {
    if (category_id) {
      dataBySelection.sizeByCategory = foodData.sizeInfo.filter(
        (size) => size?.productCategoryInfo === category_id
      );
    } else {
      dataBySelection.sizeByCategory = [];
    }

    saveDataBySelection();
  };

  const handleProductData = (name, value, productsData, setProductData) => {
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

  const setProductInfo = (setProductData, data) => {
    setProductData({
      productCategory: data?.productCategory?._id || '',
      categoryName: data?.productCategory?.categoryName || '',
      pack_size: data?.pack_size || '',
      product_title_eng: data?.product_title_eng || '',
      product_title_beng: data?.product_title_beng || '',
      product_desc_eng: data?.product_desc_eng || '',
      product_desc_beng: data?.product_desc_beng || '',
      productUnit: data?.productUnit?._id || '',
      unit_name: data?.productUnit?.unit_name || '',
      unit_symbol: data?.unit_symbol || '',
      product_code: data?.product_code || '',
      bar_code: data?.bar_code || '',
      web_image: data?.web_image || '',
      app_image: data?.app_image || '',
      detail_product_image: data?.detail_product_image || [],
      exist_web_image: data?.web_image || '',
      exist_app_image: data?.app_image || '',
      exist_detail_product_image: data?.detail_product_image || [],
    });
  };

  // submit updated store config and notification data
  const submitFoodStoreConfigAndNotification = async (
    storeData,
    loginUserInfo,
    seletedStoreCategory
  ) => {
    let dataObj = storeData;
    if (storeData?.shop_notice === '') {
      const { shop_notice, ...othersData } = dataObj;
      dataObj = othersData;
    }
    if (storeData?.popup_message === '') {
      const { popup_message, ...othersData } = dataObj;
      dataObj = othersData;
    }
    dataObj.categoryList = seletedStoreCategory;

    (dataObj.store_id = loginUserInfo?.merchantId),
      await axiosWithCredential
        .put(v1_Food_Store_Config_and_Notice, dataObj)
        .then((result) => {
          toast.success('Store configuaration successfully updated!', {
            position: 'top-center',
          });
          dispatch(
            handleUserReducer({
              type: 'SET_STORE_INFO',
              data: result?.data?.data,
            })
          );
        })
        .catch((error) => {
          console.log('error', error);
        });
  };

  const getStoreInfo = async (loginUserInfo) => {
    const dataObj = {
      store_id: loginUserInfo?.merchantId,
    };

    await axiosWithCredential
      .put(v1_Food_Get_Store_Info, dataObj)
      .then((result) => {
        dispatch(
          handleUserReducer({
            type: 'SET_STORE_INFO',
            data: result?.data?.data,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitFoodStoreOfferAndDeliveryInfo = async (
    storeOfferAndDelivery,
    loginUserInfo,
    setProgressing,
    setClickOnSubmit
  ) => {
    storeOfferAndDelivery.store_id = loginUserInfo?.merchantId;
    storeOfferAndDelivery.custom_store_id = loginUserInfo?.customStoreId;
    setProgressing(true);
    setClickOnSubmit(true);

    axiosWithCredential
      .put(v1_Food_Store_OfferAndDeliveryInfo, storeOfferAndDelivery)
      .then((result) => {
        toast.success(result?.data?.message, {
          position: 'top-center',
        });
        dispatch(
          handleUserReducer({
            type: 'SET_STORE_INFO',
            data: result?.data?.data,
          })
        );
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (error) {
      userLogOut();
    }
  }, [error]);

  return {
    handleChangeCategory,
    setProductInfo,
    handleProductData,
    submitFoodStoreConfigAndNotification,
    getStoreInfo,
    submitFoodStoreOfferAndDeliveryInfo,
  };
};
