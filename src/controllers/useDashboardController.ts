// src/controllers/useDashboardController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchEmployeesAPI } from '../models/employeeModel';
import { fetchAttendancesAPI } from '../models/attendanceModel';
import { fetchPayrollsAPI } from '../models/payrollModel';
import { fetchAnnouncementsAPI } from '../models/announcementModel';
import { useAuthStore } from '../stores/auth.store';

export const useDashboardController = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Gọi 4 API cùng lúc để lấy toàn bộ nguyên liệu
        const [empRes, attRes, payRes, annRes]: any = await Promise.all([
          fetchEmployeesAPI(), fetchAttendancesAPI(), fetchPayrollsAPI(), fetchAnnouncementsAPI()
        ]);

        const emps = empRes?.results || (Array.isArray(empRes) ? empRes : []);
        const atts = attRes?.results || (Array.isArray(attRes) ? attRes : []);
        const pays = payRes?.results || (Array.isArray(payRes) ? payRes : []);
        const anns = annRes?.results || (Array.isArray(annRes) ? annRes : []);

        // 1. LẤY 3 THÔNG BÁO MỚI NHẤT
        setRecentAnnouncements([...anns].reverse().slice(0, 3));

        // 2. TÍNH TOÁN THỐNG KÊ (Dựa theo Role)
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

        if (user?.role === 'Admin' || user?.role === 'HR') {
          // Thống kê cho Quản lý
          const totalEmployees = emps.length;
          const presentToday = atts.filter((a: any) => a.work_date === today && a.check_in_time).length;
          const totalPayroll = pays
            .filter((p: any) => p.month === currentMonth && p.year === currentYear)
            .reduce((sum: number, p: any) => sum + Number(p.net_pay), 0);

          setStats({ totalEmployees, presentToday, totalPayroll, type: 'Admin' });
        } else {
          // Thống kê cho Nhân viên
          const myProfile = emps.find((e: any) => e.id === user?.id);
          const baseSalary = Number(myProfile?.base_salary) || 0;
          
          const myAttsThisMonth = atts.filter((a: any) => a.user === user?.id && a.work_date.startsWith(monthPrefix));
          const workDays = myAttsThisMonth.filter((a: any) => a.status === 'Present').length;
          const estSalary = (baseSalary / 22) * workDays; // Tạm tính nhẩm nhanh

          setStats({ workDays, estSalary, type: 'Employee' });
        }
      } catch (error) {
        console.error(error);
        toast.error('Có lỗi khi tải dữ liệu tổng quan!');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) loadData();
  }, [user]);

  return { loading, stats, recentAnnouncements, currentUser: user };
};