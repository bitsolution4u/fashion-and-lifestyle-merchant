"use client";

import CustomTextField from "@/@core/components/mui/text-field";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";

const typeInfo = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const StoreSettingCard = () => {
  const { handleSubmit } = useForm();
  const userCredential = useSelector((state) => state.user.loginUserInfo);
  const { saveLoggedInUserInfo } = useAdmin();

  const initialStoreInfo = {
    min_delivery_charge: 0,
    min_purchage_amount: 0,
    delivery_notice: "",
    isShowingMsg: "Yes",
    facebook_link: "",
    max_delivery_charge: 0,
    shop_notice: "",
    popup_message: "",
    website_address: "",
    is_closed: "No",
  };

  const [StoreInfo, setStoreInfo] = useState(initialStoreInfo);
  const [progressing, setProgressing] = useState(false);

  // Convert numbers to Bangla
  const toBn = (n) => n.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

  // Auto-login if user not available
  useEffect(() => {
    if (!userCredential) {
      saveLoggedInUserInfo();
    }
  }, [userCredential, saveLoggedInUserInfo]);

  // Fetch store-info from API
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        if (!userCredential?.merchantId) return;

        const result = await axiosWithoutCredential.get(
          `/api/v1/store-info/single-store/${userCredential.merchantId}`
        );
        const data = result?.data?.data;
        setStoreInfo({
          min_delivery_charge: data?.min_delivery_charge,
          min_purchage_amount: data?.min_purchage_amount,
          delivery_notice: data?.delivery_notice,
          isShowingMsg: data?.isShowingMsg,
          facebook_link: data?.facebook_link,
          max_delivery_charge: data?.max_delivery_charge,
          shop_notice: data?.shop_notice,
          popup_message: data?.popup_message,
          website_address: data?.website_address,
          is_closed: data?.is_closed,
        });
      } catch (error) {
        console.error("Store data fetch error:", error);
      }
    };

    fetchStoreData();
  }, [userCredential]);

  console.log(StoreInfo);

  // Handle input changes
  const handleStoreInfoChange = (value, name) => {
    if (name === "min_purchage_amount") {
      let notice = "";

      if (Number(StoreInfo.min_delivery_charge) === 0) {
        notice = "ডেলিভারি চার্জ ফ্রি";
      } else if (
        Number(StoreInfo.min_delivery_charge) <
        Number(StoreInfo.max_delivery_charge)
      ) {
        notice = `${toBn(value)} টাকার অর্ডার করলে ডেলিভারি চার্জ ${toBn(
          StoreInfo.min_delivery_charge
        )} টাকা`;
      }

      setStoreInfo((prev) => ({
        ...prev,
        delivery_notice: notice,
        [name]: value,
      }));
    } else if (name === "min_delivery_charge") {
      let notice = "";

      if (Number(value) === 0) {
        notice = "ডেলিভারি চার্জ ফ্রি";
      } else if (Number(value) < Number(StoreInfo.max_delivery_charge)) {
        if (Number(StoreInfo?.min_purchage_amount) > 0) {
          notice = `${toBn(
            StoreInfo.min_purchage_amount
          )} টাকার অর্ডার করলে ডেলিভারি চার্জ ${toBn(value)} টাকা`;
        }
      }

      setStoreInfo((prev) => ({
        ...prev,
        delivery_notice: notice,
        [name]: value,
      }));
    } else if (name === "max_delivery_charge") {
      if (Number(value) === 0) {
        setStoreInfo((prev) => ({
          ...prev,
          delivery_notice: "ডেলিভারি চার্জ ফ্রি",
          min_delivery_charge: 0,
          min_purchage_amount: 0,
          [name]: value,
        }));
      } else {
        setStoreInfo((prev) => ({
          ...prev,
          min_delivery_charge: value,
          delivery_notice: `ডেলিভারি চার্জ ${toBn(value)} টাকা`,
          [name]: value,
        }));
      }
    } else {
      setStoreInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = async () => {
    setProgressing(true);
    try {
      await axiosWithoutCredential.put(
        `/api/v1/store-info/set-store-config/${userCredential?.merchantId}`,
        StoreInfo
      );
      setProgressing(false);
      toast.success("Store Setting Updated Successfully", {
        position: "top-center",
      });
    } catch (err) {
      console.error(err);
      setProgressing(false);

      toast.error("Something went wrong!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="p-10">
      <form>
        <Typography
          sx={{
            color: "#db2777",
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
            fontSize: 22,
          }}
        >
          Update Store Information
        </Typography>

        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Grid container spacing={4}>
              {/* LEFT SIDE */}
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  type="text"
                  label="Maximum Delivery Charge (সর্বোচ্চ ডেলিভারি চার্জ)"
                  value={StoreInfo.max_delivery_charge ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "max_delivery_charge")
                  }
                  sx={{ mt: 2 }}
                />

                <CustomTextField
                  fullWidth
                  type="text"
                  label="Minimum Delivery Charge (সর্বনিম্ন ডেলিভারি চার্জ)"
                  value={StoreInfo.min_delivery_charge ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "min_delivery_charge")
                  }
                  sx={{ mt: 2 }}
                />

                <CustomTextField
                  fullWidth
                  type="text"
                  label="Minimum Purchase Amount (ন্যূনতম ক্রয়মূল্য)"
                  value={StoreInfo.min_purchage_amount ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "min_purchage_amount")
                  }
                  sx={{ mt: 2 }}
                />

                <CustomTextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Delivery Notice (ডেলিভারি নোটিশ)"
                  value={StoreInfo.delivery_notice ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "delivery_notice")
                  }
                  sx={{ mt: 2 }}
                />

                <CustomTextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Shop Notice (দোকানের নোটিশ)"
                  value={StoreInfo.shop_notice ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "shop_notice")
                  }
                  sx={{ mt: 2 }}
                />
              </Grid>

              {/* RIGHT SIDE */}
              <Grid item xs={12} md={6}>
                <CustomTextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Popup Message"
                  value={StoreInfo.popup_message ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "popup_message")
                  }
                  sx={{ mt: 2 }}
                />

                <InputLabel sx={{ mt: 3, fontWeight: 600 }}>
                  Is Showing Msg? (পপ-আপ মেসেজ দেখাবেন?)
                </InputLabel>
                <Select
                  options={typeInfo}
                  value={StoreInfo.isShowingMsg ? typeInfo[0] : typeInfo[1]}
                  onChange={(option) =>
                    handleStoreInfoChange(option?.value, "isShowingMsg")
                  }
                />

                <CustomTextField
                  fullWidth
                  type="text"
                  label="Website Address"
                  value={StoreInfo.website_address ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "website_address")
                  }
                  sx={{ mt: 2 }}
                />

                <CustomTextField
                  fullWidth
                  type="text"
                  label="Facebook Link"
                  value={StoreInfo.facebook_link ?? ""}
                  onChange={(e) =>
                    handleStoreInfoChange(e.target.value, "facebook_link")
                  }
                  sx={{ mt: 2 }}
                />

                <InputLabel sx={{ mt: 3, fontWeight: 600 }}>
                  Is Closed ? (দোকান কি বন্ধ?)
                </InputLabel>
                <Select
                  options={typeInfo}
                  value={StoreInfo.is_closed ? typeInfo[0] : typeInfo[1]}
                  onChange={(option) =>
                    handleStoreInfoChange(option?.value, "is_closed")
                  }
                />
              </Grid>
            </Grid>

            {/* BUTTON */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              {progressing ? (
                <Button variant="contained" sx={{ background: "#db2777" }}>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                  Wait...
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  sx={{ background: "#db2777" }}
                >
                  Save
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default StoreSettingCard;
