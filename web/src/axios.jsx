import axios from 'axios';

const api = axios.create({
  // baseURL: "", // Your API base URL
  baseURL: '', // Your API base URL
  withCredentials: true,
});

export default api;