import userLogOut from '@/@core/hooks/logout';
import { AdminUrl } from '@/@core/utlis/secretVariable';
import axios from 'axios';

//const Name "axiosInterceptorInstance" rename to  "axiosWithFormData";
const axiosWithFormData = axios.create({
  baseURL: AdminUrl,
});

// Request interceptor
axiosWithFormData.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
    // const userData = JSON.parse(localStorage.getItem('userCredential'));
    config.headers['Content-Type'] = 'multipart/form-data';
    config.headers['Accept'] = '*/*';
    // If token is present add it to request's Authorization Header
    // if (userData !== null && userData !== undefined && userData !== '') {
    //   config.headers['Authorization'] = `Bearer ${userData?.token}`;
    // } else {
    //   userLogOut();
    // }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);
// End of Request interceptor

// Response interceptor
axiosWithFormData.interceptors.response.use(
  (response) => {
    return response; // Modify the response data here
  },
  (error) => {
    //console.log('Error', error.response.status);
    if (error?.response?.status === 401) {
      userLogOut();
    }
    return Promise.reject(error); // Handle response errors here
  }
);
// End of Response interceptor

//export default axiosInterceptorInstance or axiosWithFormData;

export default axiosWithFormData;
