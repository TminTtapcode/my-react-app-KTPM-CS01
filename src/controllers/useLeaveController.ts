// src/controllers/useLeaveController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchLeavesAPI, createLeaveAPI, updateLeaveStatusAPI } from '../models/leaveModel';
import { fetchEmployeesAPI } from '../models/employeeModel'; // Tận dụng lại hàm này
import { useAuthStore } from '../stores/auth.store';

export const useLeaveController = () => {
  const { user } = useAuthStore();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form dữ liệu xin nghỉ
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    leave_type: 'ANNUAL', // Mặc định là nghỉ phép năm
    reason: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [leaveRes, empRes]: any = await Promise.all([
        fetchLeavesAPI(),
        fetchEmployeesAPI()
      ]);
      
      // Đảo ngược mảng để đơn mới nhất lên đầu
      const data = (leaveRes.results || leaveRes).reverse();
      setLeaves(data);
      setEmployees(empRes.results || empRes);
    } catch (error) {
      toast.error('Lỗi tải dữ liệu nghỉ phép!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Nhân viên Gửi đơn xin nghỉ
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Lỗi bảo mật: Không tìm thấy ID!');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        user: user.id, // Ai đang đăng nhập thì gửi đơn cho người đó
        status: 'Pending' // Trạng thái chờ duyệt
      };
      
      await createLeaveAPI(payload);
      toast.success('Đã gửi đơn xin nghỉ thành công! Chờ quản lý duyệt.');
      setShowModal(false);
      setFormData({ start_date: '', end_date: '', leave_type: 'ANNUAL', reason: '' });
      loadData();
    } catch (error) {
      toast.error('Lỗi khi gửi đơn xin nghỉ!');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin/HR Duyệt hoặc Từ chối đơn
  const handleUpdateStatus = async (leaveId: number, newStatus: string) => {
    try {
      await updateLeaveStatusAPI(leaveId, {
        status: newStatus,
        approved_by: user?.id // Ghi nhận ID của quản lý đã duyệt
      });
      toast.success(`Đã ${newStatus === 'Approved' ? 'Duyệt' : 'Từ chối'} đơn nghỉ phép!`);
      loadData();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái đơn!');
    }
  };

  return { 
    leaves, employees, loading, showModal, setShowModal, formData, 
    handleInputChange, handleSubmit, handleUpdateStatus, currentUser: user,
    submitting 
  };
};