import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userLogOut from '../../logout';
import { useRouter } from 'next/navigation';
import {
  v1_ChangeUserPassword,
  v1_VerifyUser,
} from '@/@core/constants/api-endpoint';
import { handleUserReducer } from '@/store/reducer/auth-reducer';
import { swalMessage } from '@/@core/components/message/swal-message';
import formatServerError from '@/@core/utlis/formatServerErrors';
import axiosWithCredential from '@/configs/axios/axiosWithCredential';

export const useAdmin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const manageUser = (data, action, reset, setErrorsServer) => {
    axiosWithCredential
      .put(`${v1_ChangeUserPassword}/${dataInfo._id}`, data)
      .then((res) => {
        swalMessage({ message: 'Updated successfully!' });
        LoadAllUser();
        setErrorsServer([]);
      })
      .catch((error) => {
        console.log(error?.response?.data?.errors);
        const errorMsg = formatServerError(error?.response?.data?.errors);
        setErrorsServer(errorMsg);
      });
  };

  const saveLoggedInUserInfo = () => {
    const user_credential = JSON.parse(localStorage.getItem('userCredential'));
       dispatch(
          handleUserReducer({
            type: 'SAVE_LOGIN_USER_INFO',
            data: user_credential,
          }
        )
    );
  };

  
  useEffect(() => {
    if (error) {
      userLogOut();
    }
  }, [error]);

  return {
    manageUser,
    saveLoggedInUserInfo,
  };
};
