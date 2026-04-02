// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

interface ProtectedRouteProps {
  allowedRoles?: string[]; // Danh sách các chức vụ được phép đi qua
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  // 1. CHƯA ĐĂNG NHẬP: Đá văng ra trang Login
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. SAI CHỨC VỤ: Nếu Route có yêu cầu Role, mà User không có quyền
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />; 
  }

  // 3. HỢP LỆ: Mở cửa cho đi tiếp vào component bên trong
  return <Outlet />;
};

export default ProtectedRoute;