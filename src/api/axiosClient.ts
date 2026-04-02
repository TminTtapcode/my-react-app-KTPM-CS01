// src/api/axiosClient.ts
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';
import toast from 'react-hot-toast';

const axiosClient = axios.create({
  // Mọi request nghiệp vụ sẽ tự động nối thêm đoạn này ở đầu
  baseURL: 'http://127.0.0.1:8000/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Chiều đi: Gắn Token vào mọi Request
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Chiều về: Bắt lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;