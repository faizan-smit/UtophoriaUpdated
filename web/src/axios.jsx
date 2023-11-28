import { baseUrl } from './core.mjs';
import axios from 'axios';

const api = axios.create({
  baseURL: baseUrl, // Your API base URL
  // baseURL: '', // Your API base URL
  withCredentials: true,
});

export default api;