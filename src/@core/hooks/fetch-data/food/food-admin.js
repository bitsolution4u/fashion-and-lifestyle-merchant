import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogOut from '../../logout';
import {
  v1_Food_Category,
  v1_Food_Category_By_Shop,
  v1_StartUrl,
  v1_changeCategroyStatus,
  v1_productCategoryByShopAdd,
} from '@/@core/constants/api-endpoint';
import axiosWithCredential from '@/configs/axios/axiosWithCredential';
import { handleFoodItemReducer } from '@/store/reducer/food-items-reducer';
import { handleFoodItemByStoreReducer } from '@/store/reducer/food-item-by-store';
import formatServerError from '@/@core/utlis/formatServerErrors';
import { swalMessage } from '@/@core/components/message/swal-message';

export const useFoodAdmin = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const foodData = useSelector((state) => state.foodItem);
  const { loginUserInfo } = useSelector((state) => state.user);

  let localStorgeFoodData = {
    ProductCategory: foodData?.categoryInfo,
    ProductSize: foodData?.sizeInfo,
    ProductUnit: foodData?.unitInfo,
    StoreCategory: foodData?.storeCategory,
  };

  const getFoodDataFromLocalStorage = () => {
    loadAllFoodItemReletedData();
  };

  const saveAllFoodData = (allInfo) => {
    dispatch(
      handleFoodItemReducer({
        type: 'SET_ALL_FOOD_ITEM_RELETED_DATA',
        data: allInfo,
      })
    );
  };

  const loadAllFoodItemReletedData = () => {
    if (foodData?.categoryInfo?.length < 1) {
      axiosWithCredential
        .get(v1_StartUrl)
        .then((res) => {
          localStorgeFoodData.ProductCategory =
            res?.data?.result?.ProductCategory;
          localStorgeFoodData.ProductSize = res?.data?.result?.ProductSize;
          localStorgeFoodData.ProductUnit = res?.data?.result?.ProductUnit;
          localStorgeFoodData.StoreCategory = res?.data?.result?.StoreCategory;
          saveAllFoodData(localStorgeFoodData);
          getCategoryByShop(loginUserInfo);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const addProductCategoryByShop = (
    setErrors,
    setProgressing,
    ProductCategory,
    handleClose
  ) => {
    axiosWithCredential
      .post(v1_productCategoryByShopAdd, ProductCategory)
      .then((res) => {
        saveCategoryInfoByShop(res?.data?.data);
        swalMessage({ message: 'Successfully added to Shop' });
        handleClose();
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        const errorMsg = formatServerError(error?.response?.data?.errors);
        setErrors(errorMsg);
      });
  };

  const saveCategoryInfoByShop = (data) => {
    dispatch(
      handleFoodItemByStoreReducer({
        type: 'SAVE_CATEGORY_INFO_BY_SHOP',
        data: data,
      })
    );
  };

  const getCategoryInfo = async () => {
    axiosWithCredential.get(v1_Food_Category).then((result) => {
      dispatch(
        handleFoodItemReducer({
          type: 'SAVE_CATEGORY_INFO',
          data: result?.data?.data,
        })
      );
    });
  };
  const getCategoryByShop = async (loginUserInfo) => {
    const data = {
      custom_store_id: loginUserInfo?.customStoreId,
      food_store_info: loginUserInfo?.merchantId,
    };

    axiosWithCredential
      .post(v1_Food_Category_By_Shop, data)
      .then((result) => {
        console.log(result);
        dispatch(
          handleFoodItemReducer({
            type: 'SAVE_CATEGORY_INFO_BY_SHOP',
            data: result?.data?.data,
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategoryStatus = (loginUserInfo, category, Status, index) => {
    const data = {
      custom_store_id: loginUserInfo?.customStoreId,
      categoryId: category?._id,
      status: Status,
    };

    axiosWithCredential
      .post(v1_changeCategroyStatus, data)
      .then((result) => {
        dispatch(
          handleFoodItemReducer({
            type: 'UPDATE_PRODUCT_CATEGORYINFO_BY_SHOP',
            data: { index: index, item: result?.data?.data },
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (error) {
      userLogOut();
    }
  }, [error]);

  return {
    loadAllFoodItemReletedData,
    getFoodDataFromLocalStorage,
    addProductCategoryByShop,
    getCategoryByShop,
    handleCategoryStatus,
    getCategoryInfo,
  };
};
