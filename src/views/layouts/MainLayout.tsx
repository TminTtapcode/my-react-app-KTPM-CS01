// src/views/layouts/MainLayout.tsx
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown,Button } from 'react-bootstrap';
import { 
  FiHome, FiUsers, FiClock, FiCalendar, 
  FiDollarSign, FiBell, FiLogOut, FiActivity, FiMenu, 
  FiPieChart
} from 'react-icons/fi';
import { useAuthStore } from '../../stores/auth.store';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? 'active bg-primary text-white' : 'text-dark';

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f7fe' }}>
      
      {/* ========================================== */}
      {/* SIDEBAR (THANH ĐIỀU HƯỚNG BÊN TRÁI) */}
      {/* ========================================== */}
      <div className="bg-white shadow-sm d-flex flex-column" style={{ width: '260px', zIndex: 1000 }}>
        {/* Logo */}
        <div className="p-4 d-flex align-items-center gap-2 border-bottom">
          <div className="bg-primary text-white rounded d-flex justify-content-center align-items-center fw-bold fs-4" style={{ width: '40px', height: '40px' }}>H</div>
          <h4 className="fw-bold mb-0 text-primary"><span className="text-dark">HRM</span></h4>
        </div>

        {/* Menu Items */}
        <div className="p-3 d-flex flex-column gap-2 flex-grow-1 overflow-auto">
          <small className="text-muted fw-bold px-2 mt-2" style={{ fontSize: '11px', letterSpacing: '1px' }}>CHUNG</small>
          <Link to="/" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/')}`}><FiHome className="me-2"/> Tổng quan</Link>
          <Link to="/attendance" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/attendance')}`}><FiClock className="me-2"/> Chấm công</Link>
          <Link to="/leave" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/leave')}`}><FiCalendar className="me-2"/> Nghỉ phép</Link>
          <Link to="/announcements" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/announcements')}`}><FiBell className="me-2"/> Thông báo</Link>
          <Link to="/payroll" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/payroll')}`}><FiDollarSign className="me-2"/> Bảng lương</Link>

          {/* CHỈ HIỂN THỊ CHO HR VÀ ADMIN */}
          {(user?.role === 'HR' || user?.role === 'Admin') && (
            <>
              <small className="text-muted fw-bold px-2 mt-4" style={{ fontSize: '11px', letterSpacing: '1px' }}>QUẢN LÝ (HR/ADMIN)</small>
              <Link to="/employees" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/employees')}`}><FiUsers className="me-2"/> Hồ sơ nhân sự</Link>
              <Link to="/hr-report" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/hr-report')}`}><FiPieChart className="me-2" /> Báo cáo NS</Link>
            </>
          )}

          {/* CHỈ HIỂN THỊ CHO ADMIN */}
          {user?.role === 'Admin' && (
            <>
              <small className="text-muted fw-bold px-2 mt-4" style={{ fontSize: '11px', letterSpacing: '1px' }}>HỆ THỐNG (ADMIN)</small>
              <Link to="/transactions" className={`btn text-start border-0 fw-medium px-3 py-2 ${isActive('/transactions')}`}><FiActivity className="me-2"/> Thu chi tài chính</Link>
            </>
          )}
        </div>
        
        {/* Footer Sidebar */}
        <div className="p-3 border-top text-center text-muted" style={{ fontSize: '12px' }}>
          &copy; 2026 Tracky HRM
        </div>
      </div>

      {/* ========================================== */}
      {/* NỘI DUNG CHÍNH (HEADER + OUTLET) */}
      {/* ========================================== */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
        
        {/* HEADER */}
        <header className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center" style={{ zIndex: 999 }}>
          <div>
            <Button variant="light" className="d-md-none me-2"><FiMenu /></Button>
            <span className="text-muted fw-medium d-none d-md-inline">Hệ thống quản lý nhân sự hiện đại</span>
          </div>
          
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="fw-bold text-dark">{user?.full_name || 'Người dùng'}</div>
              <div className="text-muted" style={{ fontSize: '12px' }}>{user?.role}</div>
            </div>
            
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="border-0 p-0 rounded-circle shadow-sm" style={{ width: '40px', height: '40px' }}>
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold w-100 h-100">
                  {user?.full_name ? user.full_name.substring(0, 1).toUpperCase() : 'U'}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border-0 mt-2" style={{ borderRadius: '12px' }}>
                <Dropdown.Item className="py-2 text-danger fw-medium d-flex align-items-center" onClick={handleLogout}>
                  <FiLogOut className="me-2" /> Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* NƠI HIỂN THỊ CÁC TRANG (DASHBOARD, NHÂN VIÊN, LƯƠNG...) */}
        <main className="flex-grow-1 p-4 overflow-auto">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
};

export default MainLayout;