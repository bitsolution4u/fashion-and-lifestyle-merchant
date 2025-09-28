'use client';
import { useSelector } from 'react-redux';
import Login from './auth/page';
import { useAdmin } from '@/@core/hooks/fetch-data/admin/useAdmin';
import { useEffect, useState } from 'react';
import RoundLoader from '@/@core/components/loader/round-loader';
import { useRouter } from 'next/navigation';

export default function Start() {
  const router = useRouter();
  const { isVerified, isLoggedIn } = useSelector((state) => state.user);
  // const { verifyUser } = useAdmin();
  const [checkLoggedIn, setCheckLoggedIn] = useState(false);

  // useEffect(() => {
  //   if (isVerified && isLoggedIn) {
  //     router.push('/admin/dashboard');
  //   }

  //   const userData = JSON.parse(localStorage.getItem('userCredential'))?.token;

  //   if (userData !== null && userData !== undefined && userData !== '') {
  //     if (!isVerified) {
  //       // verifyUser();
  //     }
  //   } else {
  //     setCheckLoggedIn(true);
  //   }
  // }, [isVerified]);

  return (
    <>
      {/* {!isVerified && !checkLoggedIn ? (
        <div className="flex justify-center h-[100vh] items-center">
          <RoundLoader />
        </div>
      ) : ( */}
        <div
        // className=" min-h-screen flex justify-center items-center"
        >
          <Login />
        </div>
      {/* )} */}
    </>
  );
}
