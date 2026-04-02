// src/controllers/useHrReportController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchEmployeesAPI, fetchDepartmentsAPI, fetchRolesAPI } from '../models/employeeModel'; // Tái sử dụng Model cũ

export const useHrReportController = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Lấy toàn bộ dữ liệu Nhân sự, Phòng ban, Chức vụ
        const [empRes, depRes, roleRes]: any = await Promise.all([
          fetchEmployeesAPI(), fetchDepartmentsAPI(), fetchRolesAPI()
        ]);

        const employees = empRes?.results || (Array.isArray(empRes) ? empRes : []);
        const departments = depRes?.results || (Array.isArray(depRes) ? depRes : []);
        const roles = roleRes?.results || (Array.isArray(roleRes) ? roleRes : []);

        const totalEmp = employees.length;

        // 1. Tính số nhân viên mới tuyển trong tháng này
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newHires = employees.filter((e: any) => {
          if (!e.hire_date) return false;
          const hDate = new Date(e.hire_date);
          return hDate.getMonth() === currentMonth && hDate.getFullYear() === currentYear;
        });

        // 2. Thống kê theo Phòng ban (kèm phần trăm)
        const depStats = departments.map((dep: any) => {
          const count = employees.filter((e: any) => e.department === dep.id).length;
          const percent = totalEmp === 0 ? 0 : Math.round((count / totalEmp) * 100);
          return { name: dep.name, count, percent };
        }).sort((a: any, b: any) => b.count - a.count); // Sắp xếp phòng đông nhất lên đầu

        // 3. Thống kê theo Chức vụ
        const roleStats = roles.map((role: any) => {
          const count = employees.filter((e: any) => e.role === role.id).length;
          const percent = totalEmp === 0 ? 0 : Math.round((count / totalEmp) * 100);
          return { name: role.name, count, percent };
        }).sort((a: any, b: any) => b.count - a.count);

        // Lưu tất cả vào 1 cục State
        setStats({
          totalEmp,
          newHiresCount: newHires.length,
          newHiresList: newHires,
          depStats,
          roleStats
        });

      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu báo cáo!');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return { loading, stats };
};