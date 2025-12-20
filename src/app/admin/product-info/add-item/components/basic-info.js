import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from "@/@core/components/mui/text-field";
import SinngleImgUpload from "@/@core/hooks/photo-editor/single-image-upload";
import MultipleImageUploader from "@/@core/hooks/photo-editor/multiple-img-upload";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import Chip from "@mui/material/Chip";
import { BaseAppUrl } from "@/@core/utlis/secretVariable";
import { all_colour } from "@/@core/constants/all-colour";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const ItemBasicInfo = ({
  handleAppImageUrl,
  handleWebImageUrl,
  errors,
  clickOnSubmit,
  imageApp,
  imageWeb,
  duringUpdate,
  handleProductDataChange,
  productsData,
  setShowSavedImg,
  shop_id,
}) => {
  const [colors, setcolors] = React.useState([]);
  const [imageUrlApp, setImageUrlapp] = useState("");
  const [imageUrlWeb, setImageUrlWeb] = useState("");
  const [brandInfo, setBrandInfo] = React.useState([]);
  const [selectBrandInfo, setSelectBrandInfo] = useState({});
  const [categoryInfo, setCategoryInfo] = React.useState([]);
  const [selectCategoryInfo, setSelectCategoryInfo] = useState({});
  const [selectTypeInfo, setSelectTypeInfo] = useState({});
  const [typeInfo, setTypeInfo] = React.useState([]);
  const [subcategoryInfo, setSubCategoryInfo] = React.useState([]);
  const [selectSubCategoryInfo, setSelectSubCategoryInfo] = useState({});
  const [SizeInfo, setSizeInfo] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  console.log(selectedSizes);
  const getAllTypeInfo = async () => {
    await axiosWithoutCredential
      .get(
        `/api/v1/type/all-type-by-store/${
          productsData?.store_info?._id || shop_id
        }`
      )
      .then((result) => {
        setTypeInfo(result?.data?.data);
      })
      .catch((error) => {});
  };

  const getAllCategoryInfoByType = async (id) => {
    const data = {
      store_info: productsData?.store_info?._id || shop_id,
      type_info: id,
    };
    await axiosWithoutCredential
      .put(`/api/v1/category/all-category-by-store-and-type`, data)
      .then((result) => {
        setCategoryInfo(result?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAllBrandInfo = async () => {
    await axiosWithoutCredential
      .get("/api/v1/brand/all-brand")
      .then((result) => {
        setBrandInfo(result?.data?.data);
      })
      .catch((error) => {});
  };

  const getAllSubcategoryInfoByCat = async (id) => {
    const data = {
      store_info: productsData?.store_info?._id || shop_id,
      category_info: id,
      type_info: selectTypeInfo?.type_info?._id,
    };
    await axiosWithoutCredential
      .put(`/api/v1/sub-category/all-subcat-by-store-and-type`, data)
      .then((result) => {
        setSubCategoryInfo(result?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    getAllBrandInfo();
    getAllTypeInfo();

    const extractInfo = (info, nameKey, objectName) => ({
      [objectName]: {
        _id: info?._id ?? "",
        [nameKey]: info?.[nameKey] ?? "",
      },
    });

    setSelectTypeInfo(
      extractInfo(productsData?.type_info, "type_name", "type_info")
    );
    setSelectCategoryInfo(
      extractInfo(productsData?.category_info, "category_name", "category_info")
    );
    setSelectSubCategoryInfo(
      extractInfo(
        productsData?.sub_category_info,
        "sub_category_name",
        "sub_category_info"
      )
    );

    setSelectBrandInfo({
      _id: productsData?.brand_info?._id ?? "",
      brand_name: productsData?.brand_info?.brand_name ?? "",
    });

    if (productsData?.sizes) {
      if (typeof productsData.sizes === "string") {
        setSelectedSizes(productsData.sizes.split(",").map((s) => s.trim()));
      } else if (Array.isArray(productsData.sizes)) {
        console.log(productsData.sizes);
        setSelectedSizes(productsData.sizes);
      }
    }

    if (productsData?.colors) {
      if (typeof productsData.colors === "string") {
        setcolors(productsData.colors.split(",").map((c) => c.trim()));
      } else if (Array.isArray(productsData.colors)) {
        setcolors(productsData.colors);
      }
    }
  }, []);

  const [images, setImages] = useState([]);
  const [imagesByColor, setImagesByColor] = useState([]);

  const handleImageWeb = (file, src) => {
    if (file && src) {
      setShowSavedImg(false);
      handleWebImageUrl(src);
    } else {
      handleWebImageUrl(imageUrlWeb);
    }
    handleProductDataChange("web_image", file);
  };

  const handleImageApp = (file, src) => {
    if (file && src) {
      setShowSavedImg(false);
      handleAppImageUrl(src);
    } else {
      handleAppImageUrl(imageUrlApp);
    }
    handleProductDataChange("app_image", file);
  };

  const handleImagesDetailProduct = (imageFiles) => {
    setImages((prevImages) => [...prevImages, ...imageFiles]);
    handleProductDataChange("detail_product_image", [...images, ...imageFiles]);
  };

  const handleImageByColorProduct = (imageFiles) => {
    setImages((prevImages) => [...prevImages, ...imageFiles]);
    handleProductDataChange("images_by_color", [
      ...imagesByColor,
      ...imageFiles,
    ]);
  };

  const handleImageDelete = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      handleProductDataChange("detail_product_image", updatedImages);
      return updatedImages;
    });
  };

  const handleColorImageDelete = (index) => {
    setImagesByColor((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      handleProductDataChange("images_by_color", updatedImages);
      return updatedImages;
    });
  };
  let [allDoc, setAllDoc] = useState([]);
  let [allcolorImgDoc, setAllColorImgDoc] = useState([]);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    if (
      productsData?.app_image !== "null" &&
      productsData?.app_image !== "undefined" &&
      productsData?.app_image !== null &&
      productsData?.app_image !== "" &&
      duringUpdate
    ) {
      let image_url_app = `${BaseAppUrl}/${productsData?.app_image}`;
      handleAppImageUrl(image_url_app);
    }

    if (
      productsData?.web_image !== "null" &&
      productsData?.web_image !== "undefined" &&
      productsData?.web_image !== null &&
      productsData?.web_image !== "" &&
      duringUpdate
    ) {
      let image_url_web = `${BaseAppUrl}/${productsData?.web_image}`;
      handleWebImageUrl(image_url_web);
    }

    if (productsData.detail_product_image) {
      const newDocs = productsData.detail_product_image.map((doc) => ({
        url: doc.url ? doc.url : `${BaseAppUrl}/${doc}`,
        file: null,
      }));
      setAllDoc(newDocs);
      setImgLoading(true);
    } else setImgLoading(true);
    if (productsData?.images_by_color) {
      console.log(productsData?.images_by_color);
      const newDocs = productsData?.images_by_color?.map((doc) => ({
        url: doc.url ? doc.url : `${BaseAppUrl}/${doc}`,
        file: null,
      }));
      setAllColorImgDoc(newDocs);
      setImgLoading(true);
    } else setImgLoading(true);
  }, [productsData?.detail_product_image, productsData]);

  return (
    <div className="demo-form-main-page">
      <Box className="px-5 mt-12">
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontWeight: "700", p: 3 }}
        >
          Basic Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
              <InputLabel
                htmlFor="outlined-textarea"
                sx={{
                  position: "relative",
                  top: -18,
                  left: -12,
                  color: "#000",
                  zIndex: 0,
                }}
              >
                Product Title (English)
              </InputLabel>
              <CustomTextField
                fullWidth
                value={productsData?.product_title_eng}
                id="outlined-textarea"
                name="product_title_beng"
                placeholder="Product Title (English)"
                size="small"
                onChange={(e) => {
                  handleProductDataChange(
                    "product_title_eng",
                    e?.target?.value
                  );
                }}
              />

              <span className="text-red-700 text-sm block">
                {clickOnSubmit && errors?.product_title_eng}
              </span>
            </FormControl>

            <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
              <InputLabel
                htmlFor="outlined-textarea"
                sx={{
                  position: "relative",
                  top: -18,
                  left: -12,
                  color: "#000",
                  zIndex: 0,
                }}
              >
                Product Title (Bangla)
              </InputLabel>
              <CustomTextField
                fullWidth
                value={productsData?.product_title_beng}
                onChange={(e) => {
                  handleProductDataChange(
                    "product_title_beng",
                    e?.target?.value
                  );
                }}
                id="outlined-textarea"
                name="product_title_beng"
                placeholder="Product Title (Bangla)"
                size="small"
              />
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
              <InputLabel
                htmlFor="outlined-textarea"
                sx={{
                  position: "relative",
                  top: -18,
                  left: -12,
                  color: "#000",
                  zIndex: 0,
                }}
              >
                Product Type
              </InputLabel>
              <Autocomplete
                fullWidth
                size="small"
                disablePortal
                id="combo-box-demo"
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option?.type_info?._id}>
                      {option?.type_info?.type_name}
                    </li>
                  );
                }}
                options={typeInfo}
                value={selectTypeInfo}
                getOptionLabel={(option) => option?.type_info?.type_name || ""}
                isOptionEqualToValue={(option, value) =>
                  option?.type_info?._id === value?.type_info?._id
                }
                onChange={(e, value) => {
                  handleProductDataChange("type_info", value?.type_info?._id);
                  setSelectTypeInfo(value);
                  getAllCategoryInfoByType(value?.type_info?._id);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Type"
                    font="bold"
                  />
                )}
              />
            </FormControl>
            <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
              <InputLabel
                htmlFor="outlined-textarea"
                sx={{
                  position: "relative",
                  top: -18,
                  left: -12,
                  color: "#000",
                  zIndex: 0,
                }}
              >
                Product Category
              </InputLabel>
              <Autocomplete
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
                value={selectCategoryInfo || {}}
                getOptionLabel={(option) =>
                  option?.category_info?.category_name || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option?.category_info?._id === value?.category_info?._id
                }
                onChange={(e, value) => {
                  handleProductDataChange(
                    "category_info",
                    value?.category_info?._id
                  );
                  getAllSubcategoryInfoByCat(value?.category_info?._id);
                  setSelectCategoryInfo(value);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Category"
                    font="bold"
                  />
                )}
              />

              <span className="text-red-700 text-sm block">
                {clickOnSubmit && errors?.category_info}
              </span>
            </FormControl>

            <Box className="flex justify-center w-full mt-6 gap-10">
              <SinngleImgUpload
                name="banner"
                src={imageWeb}
                width={200}
                height={120}
                title="web_image"
                type="file"
                handleImage={handleImageWeb}
              />
              <SinngleImgUpload
                name="banner"
                src={imageApp}
                width={200}
                height={120}
                title="app_image"
                type="file"
                handleImage={handleImageApp}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
                  <InputLabel
                    htmlFor="outlined-textarea"
                    sx={{
                      position: "relative",
                      top: -18,
                      left: -12,
                      color: "#000",
                      zIndex: 0,
                    }}
                  >
                    Product Brand
                  </InputLabel>
                  <Autocomplete
                    // sx={{ mt: 2 }}
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option?._id}>
                          {option?.brand_name}
                        </li>
                      );
                    }}
                    options={brandInfo}
                    value={selectBrandInfo}
                    getOptionLabel={(option) => option?.brand_name}
                    onChange={(e, value) => {
                      handleProductDataChange("brand_info", value?._id);
                      setSelectBrandInfo({
                        _id: value?._id,
                        brand_name: value?.brand_name,
                      });
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Select Brand"
                        font="bold"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="filled" sx={{ m: 1, width: "100%" }}>
                  <InputLabel
                    htmlFor="outlined-textarea"
                    sx={{
                      position: "relative",
                      top: -18,
                      left: -12,
                      color: "#000",
                      zIndex: 0,
                    }}
                  >
                    Product Subcategory
                  </InputLabel>
                  <Autocomplete
                    // sx={{ mt: 2 }}
                    fullWidth
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option?.sub_category_info?._id}>
                          {option?.sub_category_info?.sub_category_name}
                        </li>
                      );
                    }}
                    options={subcategoryInfo}
                    value={selectSubCategoryInfo}
                    getOptionLabel={(option) =>
                      option?.sub_category_info?.sub_category_name || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.sub_category_info?._id ===
                      value?.sub_category_info?._id
                    }
                    onChange={(e, value) => {
                      value?.sub_category_info?.size_info &&
                        setSizeInfo(
                          value?.sub_category_info?.size_info
                            ?.split(", ")
                            .map((s) => s.trim())
                        );
                      !value?.sub_category_info?.size_info && setSizeInfo([]);
                      handleProductDataChange(
                        "sub_category_info",
                        value?.sub_category_info?._id
                      );
                      setSelectSubCategoryInfo(value);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        // label="Select Brand"
                        placeholder="Select Subcategory"
                        font="bold"
                      />
                    )}
                  />
                  <span className="text-red-700 text-sm block">
                    {clickOnSubmit && errors?.sub_category_info}
                  </span>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  sx={{ m: 1 }}
                  fullWidth
                  value={productsData.max_retail_price}
                  placeholder="Maximum Retail Price (MRP)"
                  onChange={(e) => {
                    handleProductDataChange(
                      "max_retail_price",
                      e?.target?.value
                    );
                    e.target.value, "max_retail_price";
                  }}
                  label="Maximum Retail Price (MRP)"
                  id="outlined-size-small"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  sx={{ mt: 1.8 }}
                  id="color-autocomplete"
                  options={(SizeInfo || []).filter(
                    (item) => item && item !== "null" && item !== "undefined"
                  )}
                  value={(selectedSizes || []).filter(
                    (item) => item && item !== "null" && item !== "undefined"
                  )}
                  onChange={(event, newValue) => {
                    const cleanValues = (newValue || []).filter(
                      (item) => item && item !== "null" && item !== "undefined"
                    );
                    setSelectedSizes(cleanValues);
                    handleProductDataChange("sizes", cleanValues);
                  }}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        label={String(option)}
                        {...getTagProps({ index })}
                        key={index}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Available Sizes"
                      placeholder="Select Available Sizes"
                    />
                  )}
                  getOptionLabel={(option) =>
                    option && option !== "null" && option !== "undefined"
                      ? String(option)
                      : ""
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  sx={{ m: 1 }}
                  fullWidth
                  placeholder="Less"
                  label="Less"
                  value={productsData.less}
                  onChange={(e) => {
                    handleProductDataChange("less", e?.target?.value);
                  }}
                  id="outlined-size-small"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  sx={{ mt: 1, width: "100%" }}
                  size="small"
                  disablePortal
                  id="combo-box-demo"
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.type}>
                        {option.symbol}
                      </li>
                    );
                  }}
                  options={type_Info}
                  getOptionLabel={(option) => option.symbol}
                  onChange={(e, value) => {
                    handleProductDataChange("less_type", value?.type);
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Less Type"
                      font="bold"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                {" "}
                <CustomTextField
                  sx={{ ml: 1, mt: 0.5 }}
                  fullWidth
                  placeholder="Sale Price"
                  label="Sale Price"
                  value={productsData?.sale_price}
                  onChange={(e) => {
                    handleProductDataChange("sale_price", e?.target?.value);
                    e.target.value, "sale_price";
                  }}
                  id="outlined-size-small"
                  size="small"
                />{" "}
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Autocomplete
                  multiple
                  options={filteredColors} // render only filtered
                  value={colors}
                  sx={{ mt: 3 }}
                  onChange={(e, value) => setcolors(value)}
                  inputValue={searchText}
                  onInputChange={(e, value) => setSearchText(value)}
                  getOptionLabel={(o) => o.name}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      key={option.name}
                      style={{ display: "flex", gap: 10 }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          bgcolor: option.hex,
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                        }}
                      />
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Colors"
                      placeholder="Type to search…"
                    />
                  )}
                />
              </Grid> */}
            </Grid>
            <Box
              sx={{
                display: "flex",
                gap: 8,
                mt: 4,
                alignItems: "flex-start",
              }}
            >
              {/* LEFT */}
              <Box>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>
                  Details Image
                </Typography>

                {imgLoading && (
                  <MultipleImageUploader
                    docInfo={allDoc || []}
                    width={200}
                    height={120}
                    title="detail_product_image"
                    handleImage={handleImagesDetailProduct}
                    handleImageDelete={handleImageDelete}
                    setImages={setImages}
                  />
                )}
              </Box>

              {/* RIGHT */}
              <Box>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>
                  Image By Colors
                </Typography>

                {imgLoading && (
                  <MultipleImageUploader
                    docInfo={allcolorImgDoc || []}
                    width={200}
                    height={120}
                    title="color_product_image"
                    handleImage={handleImageByColorProduct}
                    handleImageDelete={handleColorImageDelete}
                    setImagesByColor={setImagesByColor}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ItemBasicInfo;

const type_Info = [
  { symbol: "%", type: "Percent" },
  { symbol: "৳", type: "Fixed" },
];
