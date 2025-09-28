import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogOut from '../logout';
import { handleMedicineItemReducer } from '@/store/reducer/medicine-items-reducer';

export const useMedicineItemHelper = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const medicineData = useSelector((state) => state.medicineItem);

  let dataBySelection = {
    categoryByGroup: medicineData.categoryByGroup,
    sizeByGroup: medicineData.sizeByGroup,
    varietyByBrandAndGroup: medicineData.varietyByBrandAndGroup,
    subtypeByType: medicineData.subtypeByType,
  };

  const saveDataBySelection = () => {
    dispatch(
      handleMedicineItemReducer({
        type: 'SET_DATA_BY_SELECTION',
        data: dataBySelection,
      })
    );
  };

  const handleChangeBrandOrGroup = (brand_id, group_id) => {
    dataBySelection.categoryByGroup = [];
    dataBySelection.sizeByGroup = [];
    dataBySelection.varietyByBrandAndGroup = [];

    if (group_id) {
      dataBySelection.categoryByGroup = medicineData.categoryInfo.filter(
        (category) => category?.productGroup?._id === group_id
      );

      dataBySelection.sizeByGroup = medicineData.sizeInfo.filter(
        (size) => size?.productGroup?._id === group_id
      );
    }

    if (brand_id && group_id) {
      dataBySelection.varietyByBrandAndGroup = medicineData.varietyInfo.filter(
        (variety) =>
          variety?.productBrand?._id === brand_id &&
          variety?.productGroup?._id === group_id
      );
    }

    saveDataBySelection();
  };

  const setProductInfo = (setProductData, data) => {
    setProductData({
      companyInfo: data?.companyInfo || '',
      company_name: data?.company_name || '',
      productBrand: data?.productBrand?._id || '',
      brand_name: data?.productBrand?.brand_name || '',
      productGroup: data?.productGroup?._id || '',
      group_name: data?.productGroup?.group_name || '',
      productCategory: data?.productCategory?._id || '303030303030303030303030',
      category_name: data?.productCategory?.category_name || '',
      productVariety: data?.productVariety?._id || '303030303030303030303030',
      variety_name: data?.productVariety?.variety_name || '',
      variety_code: data?.variety_code || '',
      packSizeInfo: data?.packSizeInfo || '',
      pack_size: data?.pack_size || '',
      productOrigin: data?.productOrigin?._id || '',
      origin_name: data?.productOrigin?.origin_name || '',
      product_title_eng: data?.product_title_eng || '',
      product_title_beng: data?.product_title_beng || '',
      productUnit: data?.productUnit?._id || '',
      unit_name: data?.productUnit?.unit_name || '',
      unit_symbol: data?.unit_symbol || '',
      product_code: data?.product_code || '',
      bar_code: data?.bar_code || '',
      web_image: data?.web_image || '',
      app_image: data?.app_image || '',
      detail_product_image: data?.detail_product_image || '',
      product_desc_eng: data?.product_desc_eng || '',
      product_desc_beng: data?.product_desc_beng || '',
      productType: data?.productType?._id || '',
      typeName: data?.productType?.typeName || '',
      productSubtype: data?.productSubtype?._id || '303030303030303030303030',
      sub_type_name: data?.productSubtype?.sub_type_name || '',
    });
  };

  const handleChangeType = (type_id) => {
    if (type_id) {
      dataBySelection.subtypeByType = medicineData.subtypeInfo.filter(
        (subtype) => subtype.typeInfo._id === type_id
      );
    } else {
      dataBySelection.subtypeByType = [];
    }

    saveDataBySelection();
  };

  useEffect(() => {
    if (error) {
      userLogOut();
    }
  }, [error]);

  return {
    handleChangeBrandOrGroup,
    handleChangeType,
    setProductInfo,
  };
};

/* 

{
    companyInfo: '',
    company_name: '',
    productBrand: '',
    brand_name: '',
    productGroup: '',
    group_name: '',
    productCategory: '',
    category_name: '',
    productVariety: '',
    variety_name: '',
    variety_code: '',
    packSizeInfo: '',
    pack_size: '',
    productOrigin: '',
    origin_name: '',
    product_title_eng: '',
    product_title_beng: '',
    productUnit: '',
    unit_name: '',
    unit_symbol: '',
    product_code: '',
    bar_code: '',
    web_image: '',
    app_image: '',
    detail_product_image: '',
    product_desc_eng: '',
    product_desc_beng: '',
    productType: '',
    typeName: '',
    productSubtype: '',
    sub_type_name: '',
  }
*/
