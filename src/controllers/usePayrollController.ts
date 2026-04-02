// src/controllers/usePayrollController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchPayrollsAPI, createPayrollAPI, updatePayrollAPI } from '../models/payrollModel';
import { fetchEmployeesAPI } from '../models/employeeModel';
import { fetchAttendancesAPI } from '../models/attendanceModel';
import { fetchLeavesAPI } from '../models/leaveModel';
import { useAuthStore } from '../stores/auth.store';

export const usePayrollController = () => {
  const { user } = useAuthStore();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentEstimate, setCurrentEstimate] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // === TÍNH NĂNG MỚI: BỘ LỌC ===
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [payRes, empRes, attRes, leaveRes]: any = await Promise.all([
        fetchPayrollsAPI(), fetchEmployeesAPI(), fetchAttendancesAPI(), fetchLeavesAPI()
      ]);
      
      const allPayrolls = payRes?.results || (Array.isArray(payRes) ? payRes : []);
      const allEmps = empRes?.results || (Array.isArray(empRes) ? empRes : []);
      const allAtts = attRes?.results || (Array.isArray(attRes) ? attRes : []);
      const allLeaves = leaveRes?.results || (Array.isArray(leaveRes) ? leaveRes : []);

      setEmployees(allEmps);

      if (user?.role === 'Admin' || user?.role === 'HR') {
        setPayrolls([...allPayrolls].reverse());
      } else {
        setPayrolls([...allPayrolls].filter(p => p.user === user?.id).reverse());
      }

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();
      const monthPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`; 

      const myProfile = allEmps.find((e: any) => e.id === user?.id);
      const baseSalary = Number(myProfile?.base_salary) || 0;

      const myAttsThisMonth = allAtts.filter((a: any) => a.user === user?.id && a.work_date.startsWith(monthPrefix));
      const actualWorkDays = myAttsThisMonth.filter((a: any) => a.status === 'Present').length;
      const lateDays = myAttsThisMonth.filter((a: any) => a.status === 'Late').length;

      const myLeavesThisMonth = allLeaves.filter((l: any) => 
        l.user === user?.id && l.status === 'Approved' && l.leave_type === 'ANNUAL' && l.start_date.startsWith(monthPrefix)
      );
      
      let paidLeaveDays = 0;
      myLeavesThisMonth.forEach((l: any) => {
        const start = new Date(l.start_date);
        const end = new Date(l.end_date);
        const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        paidLeaveDays += diffDays;
      });

      const standardWorkDays = 22; 
      const dailyWage = baseSalary / standardWorkDays;
      const penalty = lateDays * 50000; 
      const netPay = Math.max(0, (dailyWage * (actualWorkDays + paidLeaveDays)) - penalty);

      setCurrentEstimate({
        month: currentMonth, year: currentYear, baseSalary, actualWorkDays, paidLeaveDays, lateDays, penalty, netPay
      });

    } catch (error) {
      toast.error('Lỗi tải dữ liệu bảng lương!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) loadData(); }, [user]);

  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPayrollAPI({
        user: user?.id, month: currentEstimate.month, year: currentEstimate.year,
        base_salary: currentEstimate.baseSalary, standard_work_days: 22,
        actual_work_days: currentEstimate.actualWorkDays, paid_leave_days: currentEstimate.paidLeaveDays,
        penalty_amount: currentEstimate.penalty, net_pay: currentEstimate.netPay, status: 'Paid'
      });
      toast.success('Chốt lương thành công!');
      setShowModal(false);
      loadData();
    } catch (error) {
      toast.error('Lỗi khi chốt lương!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (payrollId: number) => {
    try {
      await updatePayrollAPI(payrollId, { status: 'Paid' });
      toast.success('Đã cập nhật trạng thái thanh toán!');
      loadData();
    } catch (error) {
      toast.error('Lỗi cập nhật!');
    }
  };

  // === XỬ LÝ LỌC DỮ LIỆU ===
  const filteredPayrolls = payrolls.filter(pay => {
    const matchMonth = filterMonth ? String(pay.month) === filterMonth : true;
    const matchYear = filterYear ? String(pay.year) === filterYear : true;
    return matchMonth && matchYear;
  });

  return { 
    payrolls: filteredPayrolls, // Xuất mảng đã lọc ra View
    employees, loading, showModal, setShowModal, 
    currentEstimate, handleGeneratePayroll, handleMarkAsPaid, currentUser: user, submitting,
    filterMonth, setFilterMonth, filterYear, setFilterYear // Xuất các hàm thay đổi bộ lọc
  };
};