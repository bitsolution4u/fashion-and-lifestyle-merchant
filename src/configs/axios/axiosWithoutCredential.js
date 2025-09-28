import { AdminUrl } from '@/@core/utlis/secretVariable';
import axios from 'axios';
axios.defaults.withCredentials = true;

const axiosWithoutCredential = axios.create({
  baseURL: AdminUrl,
  headers: {
    'Content-Type': 'application/json', // Set the Content-Type header to JSON
  },
});

export default axiosWithoutCredential;
