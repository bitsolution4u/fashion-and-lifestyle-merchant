"use client";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAdmin } from "@/@core/hooks/fetch-data/admin/useAdmin";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import icon from "../../assets/img/no_tension_bar.png";
import LoginBanner from "../../assets/img/login_Banner.png";
import axiosWithoutCredential from "@/configs/axios/axiosWithoutCredential";
import { toast } from "react-toastify";
const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const { isVerified, isLoggedIn } = useSelector((state) => state.user);

  const { saveLoggedInUserInfo } = useAdmin();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userCredential"));
    if (userData !== null && userData !== undefined && userData !== "") {
      if (!isVerified) {
        console.log("Verify Again");
        // verifyUser();
      }
    }
    if (isVerified && isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [isVerified]);

  const onSubmit = async (data) => {
    axiosWithoutCredential
      .post("/api/v1/user/login-merchant-user", data)
      .then((result) => {
        toast.success("Merchant User Logged in Successfully!", {
          position: "top-center",
        });
        localStorage.setItem(
          "userCredential",
          JSON.stringify(result?.data?.result)
        );
        saveLoggedInUserInfo();
        router.push("/admin/dashboard");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message, {
          position: "top-center",
        });
      });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="w-72 h-72 bg-pink-200 rounded-full blur-3xl absolute top-10 left-10"></div>
        <div className="w-96 h-96 bg-pink-300/30 rounded-full blur-2xl absolute bottom-0 right-0"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 lg:p-16">
        {/* Image Section */}
        <div className="hidden lg:flex items-center justify-center md:mr-10 relative">
          <div className="absolute -inset-5 bg-gradient-to-tr from-pink-200/40 to-pink-400/30 rounded-3xl blur-2xl"></div>
          <Image
            src={LoginBanner}
            alt="Fashion & Lifestyle"
            className="w-full max-w-[900px] scale-125 object-contain drop-shadow-2xl relative z-10"
          />
        </div>

        {/* Form Section */}
        <div className="relative bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-pink-200 hover:border-pink-400 transition-all duration-500">
          {/* Decorative floating SVG */}
          <svg
            className="absolute -top-10 -left-10 w-20 h-20 text-pink-200 opacity-30"
            fill="currentColor"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              width={200}
              height={40}
              src={icon}
              alt="notension"
              className="object-contain drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2 font-poppins">
            Merchant Login
          </h2>
          <p className="text-center text-gray-600 mb-6 font-medium">
            Access your Fashion & Lifestyle Store Dashboard
          </p>

          <form
            noValidate
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="space-y-5">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  {...register("contact", { required: true })}
                  defaultValue={"+8801859168695"}
                  placeholder="Enter your phone number"
                  className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  {...register("password", { required: true })}
                  defaultValue={"406444"}
                  placeholder="Enter password"
                  className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-2xl focus:ring-pink-400 focus:border-pink-400 shadow-sm hover:shadow-md transition-all duration-300"
                />
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <a className="text-pink-600 hover:text-pink-700 hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 hover:from-pink-600 hover:to-pink-700 transition-transform duration-300"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
