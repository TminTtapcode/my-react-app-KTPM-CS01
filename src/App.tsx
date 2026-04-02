// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

// Lazy load các trang để tăng tốc độ khởi động web
const MainLayout = React.lazy(() => import('./views/layouts/MainLayout'));
const LoginPage = React.lazy(() => import('./views/pages/LoginPage'));

// Tạm tạo các component rỗng để App không báo lỗi (Lát mình code thật sau)
const DashboardPage = React.lazy(() => import('./views/pages/DashboardPage'));
const EmployeePage = React.lazy(() => import('./views/pages/EmployeePage'));
const AttendancePage = React.lazy(() => import('./views/pages/AttendancePage'));
const LeavePage = React.lazy(() => import('./views/pages/LeavePage'));
const PayrollPage = React.lazy(() => import('./views/pages/PayrollPage'));
const AnnouncementPage = React.lazy(() => import('./views/pages/AnnouncementPage'));
const TransactionPage = () => <div className="p-4">Trang Tài chính</div>;
const HrReportPage = React.lazy(() => import('./views/pages/HrReportPage'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="vh-100 d-flex justify-content-center align-items-center">Đang tải hệ thống...</div>}>
        <Routes>
          {/* ========================================== */}
          {/* VÙNG CÔNG CỘNG (Ai cũng vào được) */}
          {/* ========================================== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403" element={<div className="p-5 text-center text-danger fw-bold fs-3">403 - BẠN KHÔNG CÓ QUYỀN TRUY CẬP TRANG NÀY!</div>} />

          {/* ========================================== */}
          {/* VÙNG BẢO MẬT (Phải đăng nhập mới được vào) */}
          {/* ========================================== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              
              {/* Nhóm 1: Tính năng chung (Role nào cũng vào được) */}
              <Route index element={<DashboardPage />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="leave" element={<LeavePage />} />
              <Route path="announcements" element={<AnnouncementPage />} />
              <Route path="payroll" element={<PayrollPage />} />

              {/* Nhóm 2: Dành riêng cho HR & Admin (Quản lý hồ sơ, Lương) */}
              <Route element={<ProtectedRoute allowedRoles={['HR', 'Admin']} />}>
                <Route path="employees" element={<EmployeePage />} />
                <Route path='hr-report' element={<HrReportPage />} />
              </Route>

              {/* Nhóm 3: Dành riêng cho Admin (Tài chính) */}
              <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                <Route path="transactions" element={<TransactionPage />} />
              </Route>

            </Route>
          </Route>
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;