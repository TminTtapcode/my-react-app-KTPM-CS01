// src/controllers/useEmployeeController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchEmployeesAPI, fetchRolesAPI, fetchDepartmentsAPI, createEmployeeAPI } from '../models/employeeModel';

export const useEmployeeController = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form data khớp với UserDetailSerializer trong Django
  const [formData, setFormData] = useState({
    username: '',
    password: '', // DRF ModelSerializer thường cần thêm xử lý password ở view, ta cứ gửi lên
    full_name: '',
    email: '',
    role: '',       // Khóa ngoại (Gửi ID)
    department: '', // Khóa ngoại (Gửi ID)
    base_salary: 0,
    hire_date: new Date().toISOString().split('T')[0]
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [empRes, roleRes, depRes]: any = await Promise.all([
        fetchEmployeesAPI(),
        fetchRolesAPI(),
        fetchDepartmentsAPI()
      ]);
      // DRF mặc định trả về mảng, nếu có phân trang (pagination) thì nó nằm trong .results
      setEmployees(empRes.results || empRes);
      setRoles(roleRes.results || roleRes);
      setDepartments(depRes.results || depRes);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu từ máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEmployeeAPI(formData);
      toast.success('Thêm nhân viên thành công!');
      setShowAddModal(false);
      loadAllData(); // Tải lại danh sách mới
      
      // Reset form
      setFormData({ username: '', password: '', full_name: '', email: '', role: '', department: '', base_salary: 0, hire_date: new Date().toISOString().split('T')[0] });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra khi tạo nhân viên. Hãy kiểm tra lại dữ liệu!');
    } finally {
      setSubmitting(false);
    }
  };

  return { employees, roles, departments, loading, showAddModal, setShowAddModal, formData, handleInputChange, handleSubmit, submitting };
};