'use client';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAdmin } from '@/@core/hooks/fetch-data/admin/useAdmin';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import icon from '../../assets/img/No Tension-06.png';
import axiosWithoutCredential from '@/configs/axios/axiosWithoutCredential';
import { toast } from 'react-toastify';
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
    password: '',
    showPassword: false,
  });

  
  const { isVerified, isLoggedIn } = useSelector((state) => state.user);

  const { saveLoggedInUserInfo } = useAdmin();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userCredential'));
    if (userData !== null && userData !== undefined && userData !== '') {
      if (!isVerified) {
        console.log('Verify Again');
        // verifyUser();
      }
    }
    if (isVerified && isLoggedIn) {
      router.push('/admin/dashboard');
    }
  }, [isVerified]);


  const onSubmit = async (data) => {
     axiosWithoutCredential
      .put('/api/v1/user/login-merchant-user', data)
      .then((result) => {
        toast.success('Merchant User Logged in Successfully!', {
          position: 'top-center',
        });
        localStorage.setItem('userCredential',JSON.stringify(result?.data?.result));
        saveLoggedInUserInfo();
        router.push('/admin/dashboard');
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message, {
          position: 'top-center',
        });
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center overflow-hidden  "
      style={{
        backgroundImage:
          "url('https://i.ibb.co/dxpQbZQ/portal-login-banner.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="absolute top-32 z-10">
        <div className="w-44 lg:w-56 lg:h-10">
          <Image
            width={224}
            height={40}
            src={icon}
            alt="notension"
            className="object-contain w-full"
          />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/10 p-10 rounded-lg shadow-xl z-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white font-serif">
            Admin Panel
          </h2>
        </div>

        <form
          noValidate
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email-phone"
                className="block text-sm font-medium text-white"
              >
               Phone Number
              </label>
              <input
                id="contact"
                name="contact"
                type="text"
                required
                {...register('contact', { required: true })}
                defaultValue={'+8801859168695'}
                className="mt-1 appearance-none block
                 w-full px-3 py-2 border border-gray-300 rounded-md
                 shadow-sm placeholder-gray-400 focus:outline-none
               focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Phone"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                {...register('password', { required: true })}
                required
                defaultValue={'406444'}
                className="mt-1 appearance-none block w-full px-3 py-2
                border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border 
              border-transparent text-sm font-medium rounded-md text-white bg-indigo-600
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit(onSubmit)}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
