// src/controllers/useAnnouncementController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchAnnouncementsAPI, createAnnouncementAPI, deleteAnnouncementAPI } from '../models/announcementModel';
import { fetchEmployeesAPI } from '../models/employeeModel';
import { useAuthStore } from '../stores/auth.store';

export const useAnnouncementController = () => {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  // === THÊM 2 BIẾN NÀY ĐỂ XỬ LÝ XEM CHI TIẾT ===
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [annRes, empRes]: any = await Promise.all([ fetchAnnouncementsAPI(), fetchEmployeesAPI() ]);
      const annArray = annRes?.results ? annRes.results : (Array.isArray(annRes) ? annRes : []);
      const empArray = empRes?.results ? empRes.results : (Array.isArray(empRes) ? empRes : []);
      setAnnouncements([...annArray].reverse());
      setEmployees(empArray);
    } catch (error) {
      toast.error('Lỗi tải dữ liệu thông báo!');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSubmitting(true);
    try {
      await createAnnouncementAPI({ title: formData.title, content: formData.content, created_by: user.id });
      toast.success('Đã đăng thông báo mới!');
      setShowModal(false);
      setFormData({ title: '', content: '' }); 
      loadData();
    } catch (error) {
      toast.error('Lỗi khi đăng thông báo!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
      try {
        await deleteAnnouncementAPI(id);
        toast.success('Đã xóa thông báo!');
        loadData();
        setShowDetailModal(false); // Xóa xong thì đóng luôn bảng chi tiết
      } catch (error) {
        toast.error('Lỗi khi xóa!');
      }
    }
  };

  // === THÊM HÀM MỞ CHI TIẾT ===
  const handleViewDetail = (ann: any) => {
    setSelectedAnnouncement(ann);
    setShowDetailModal(true);
  };

  return { 
    announcements, employees, loading, showModal, setShowModal, 
    formData, handleInputChange, handleSubmit, handleDelete, currentUser: user, submitting,
    selectedAnnouncement, showDetailModal, setShowDetailModal, handleViewDetail // Xuất ra View
  };
};