import userLogOut from '@/@core/hooks/logout';
import { AdminUrl } from '@/@core/utlis/secretVariable';
import axios from 'axios';
import { useSelector } from 'react-redux';

//const Name "axiosInterceptorInstance" rename to  "axiosWithCredential";
const axiosWithCredential = axios.create({
  baseURL: AdminUrl, // Replace with your API base URL
});

// Request interceptor
axiosWithCredential.interceptors.request.use(
  (config) => {
    // Modify the request config here (add headers, authentication tokens)
    const userData = JSON.parse(localStorage.getItem('userCredential'));
    config.headers['Content-Type'] = 'application/json';
    // If token is present add it to request's Authorization Header
    if (userData !== null && userData !== undefined && userData !== '') {
      config.headers['Authorization'] = `Bearer ${userData?.token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors here

    return Promise.reject(error);
  }
);
// End of Request interceptor

// Response interceptor
axiosWithCredential.interceptors.response.use(
  (response) => {
    return response; // Modify the response data here
  },
  (error) => {
    //console.log('Error', error);
    if (error?.response?.status === 401) {
      userLogOut();
    }
    return Promise.reject(error); // Handle response errors here
  }
);
// End of Response interceptor

//export default axiosInterceptorInstance;

export default axiosWithCredential;
