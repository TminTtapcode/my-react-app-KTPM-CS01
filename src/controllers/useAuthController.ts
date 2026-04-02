import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/auth.store';
import { loginAPI, fetchUserProfileAPI } from '../models/authModel'; // Import thêm hàm mới



export const useAuthController = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // NHỊP 1: Xin Token
      const tokenData = await loginAPI(username, password);
      const accessToken = tokenData.access_token; 

      // NHỊP 2: Cầm Token gọi API /user/me/ vừa tạo ở Backend
      const userProfile = await fetchUserProfileAPI(accessToken);

      // Dịch ID Role của user này thành chữ

      const userInfo = {
        id: userProfile.id,
        username: userProfile.username,
        full_name: userProfile.full_name || userProfile.username,
        role: userProfile.role_name || 'Employee',
        department: userProfile.department
      };

      // Cất Token và User Info vào kho chứa
      login(userInfo, accessToken);
      
      toast.success(`Chào mừng ${userInfo.full_name} trở lại!`);
      navigate('/'); 
      
    } catch (error: any) {
      console.error(error);
      toast.error('Đăng nhập thất bại. Kiểm tra lại thông tin!');
    } finally {
      setLoading(false);
    }
  };

  return { username, setUsername, password, setPassword, loading, handleLogin };
};