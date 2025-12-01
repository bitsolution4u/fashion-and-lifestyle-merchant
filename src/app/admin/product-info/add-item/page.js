"use client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ItemBasicInfo from "./components/basic-info";
import ProductDescription from "./components/description";
import useValidation from "./components/useValidation";
import { useStepWizard } from "@/@core/components/hooks/useSteps";
import axiosWithFormData from "@/configs/axios/axiosWithFormData";
import {
  swalMessage,
  swalMessageError,
} from "@/@core/components/message/swal-message";
import { toast } from "react-toastify";
import formatServerError from "@/@core/utlis/formatServerErrors";
import { useSelector } from "react-redux";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";

const AddGroceryItems = ({ params }) => {
  const [loadForm, setLoadForm] = useState(false);

  const userCredential = useSelector((state) => state.user.loginUserInfo);
  const { saveLoggedInUserInfo } = useAdmin();

  useEffect(() => {
    if (!userCredential) {
      saveLoggedInUserInfo();
    }
  }, [userCredential, saveLoggedInUserInfo]);

  useEffect(() => {
    setLoadForm(true);
  }, []);

  const [errorsServer, setErrorsServer] = React.useState({});
  const [showSavedImg, setShowSavedImg] = useState(false);
  const [clickOnSubmit, setClickOnSubmit] = React.useState(false);
  const [productsData, setProductData] = useState([]);
  const stepsData = ["Basic Information", "Product Description"];
  const [progressing, setProgressing] = React.useState(false);
  const { handleSteps, activeSteps, dataLenght, StepsWizard } = useStepWizard({
    stepsData,
  });

  const [imageApp, setImageApp] = useState("");
  const [imageWeb, setImageWeb] = useState("");

  const handleAppImageUrl = (src) => {
    setImageApp(src);
  };
  const handleWebImageUrl = (src) => {
    setImageWeb(src);
  };

  const handleProductDataChange = (name, value) => {
    if (name === "max_retail_price") {
      const MRP = parseFloat(value) || 0;
      let salePrice = MRP;

      if (parseFloat(productsData.less) > 0) {
        if (productsData.less_type === "Fixed") {
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
    } else if (name === "less") {
      const Less = parseFloat(value) || 0;
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      let salePrice = MRP;

      if (Less > 0 && MRP > 0) {
        if (productsData.less_type === "Fixed") {
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
    } else if (name === "less_type") {
      const Less = parseFloat(productsData.less);
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      let salePrice = MRP;

      if (Less > 0 && MRP > 0) {
        if (value === "Fixed") {
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
    } else if (name === "sale_price") {
      const SalePrice = parseFloat(value) || 0;
      let Less = 0;
      const MRP = parseFloat(productsData.max_retail_price) || 0;
      if (SalePrice > 0 && MRP > 0 && MRP > SalePrice) {
        if (productsData.less_type === "Fixed") {
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
          [name]: "",
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleProductDataSubmit = async () => {
    if (!productsData?.type_info) {
      toast.info("Please, select product type!", {
        position: "top-center",
      });
      return;
    }

    const typeToUrlMap = {
      "6880c277098c458993b32681": "/api/v1/foot-and-wear-product/create",
      "6880c255098c458993b3267b": "/api/v1/health-and-beauty-product/create",
      "6880c24c098c458993b32679": "/api/v1/kids-product/create",
      "6880c244098c458993b32677": "/api/v1/women-product/create",
      "6880c239098c458993b32675": "/api/v1/men-product/create",
      "6880c25e098c458993b3267d": "/api/v1/bag-and-accessories-product/create",
      "6880c282098c458993b32683": "/api/v1/home-decor-product/create",
    };

    const url = typeToUrlMap[productsData?.type_info];

    setClickOnSubmit(true);
    setProgressing(true);
    const formData = new FormData();

    for (const key in productsData) {
      if (key !== "detail_product_image") {
        formData.append(key, productsData[key]);
      } else {
        productsData[key] &&
          productsData[key].forEach((image, i) => {
            if (i < 9) {
              formData.append("detail_product_image", image.file);
            }
          });
      }
    }
    formData.append("store_info", userCredential?.merchantId);
    formData.append("is_active", false);
    await axiosWithFormData
      .post(url, formData)
      .then((result) => {
        setProductData([]);
        setImageWeb("");
        setImageApp("");
        handleSteps("reset");
        setProgressing(false);
        swalMessage({ message: "Product Info Successfully Added!" });
      })
      .catch((error) => {
        console.log("error message from product add", error);
        swalMessageError({ message: "Something went wrong!" });
        setProgressing(false);

        const errorMsg = formatServerError(error?.response?.data?.errors);

        setErrorsServer(errorMsg);
      });
  };

  const { validateFirstStep } = useValidation();
  const basiInfoValidation = () => {
    const errorsData = validateFirstStep(productsData);
    handleSteps("next");
  };

  return (
    <div>
      {progressing && <LinearProgress color="secondary" />}
      <p className="text-2xl font-bold text-center my-8 text-yellow-600">
        Add Product Item To{" "}
        <span className="text-green-600"> {userCredential?.shopName}</span>
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
                duringUpdate={false}
                setShowSavedImg={setShowSavedImg}
                shop_id={userCredential?.merchantId}
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
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                padding: "2em 1.3em",
              }}
            >
              {activeSteps === 0 ? (
                <div />
              ) : (
                <Button
                  color="warning"
                  onClick={() => handleSteps("prev")}
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        style={{ color: "white", marginRight: "10px" }}
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
    </div>
  );
};

export default AddGroceryItems;
