// src/controllers/useAttendanceController.ts
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchAttendancesAPI, createAttendanceAPI, updateAttendanceAPI } from '../models/attendanceModel';
import { useAuthStore } from '../stores/auth.store';

export const useAttendanceController = () => {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rawAttendances, setRawAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Đồng hồ đếm ngược Real-time chạy mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Tải dữ liệu từ Backend
  const loadData = async () => {
    setLoading(true);
    try {
      const res: any = await fetchAttendancesAPI();
      const data = res.results || res;
      
      // CHỈ lấy lịch sử của tài khoản đang đăng nhập & Sắp xếp ngày mới nhất lên đầu
      const myAttendances = data
        .filter((a: any) => a.user === user?.id)
        .sort((a: any, b: any) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime());
        
      setRawAttendances(myAttendances);
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadData();
  }, [user]);

  // 3. Chuẩn bị dữ liệu để "đổ" ra View (Format lại ngày giờ cho đẹp)
  const logs = rawAttendances.map(att => ({
    id: att.id,
    date: new Date(att.work_date).toLocaleDateString('vi-VN'),
    checkIn: att.check_in_time ? new Date(att.check_in_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    checkOut: att.check_out_time ? new Date(att.check_out_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--',
    status: att.status === 'Present' ? 'Đúng giờ' : att.status === 'Late' ? 'Đi trễ' : att.status
  }));

  // 4. Logic kiểm tra trạng thái Check-in hôm nay
  const todayStr = new Date().toISOString().split('T')[0]; // Chuỗi YYYY-MM-DD
  const todayRecord = rawAttendances.find(a => a.work_date === todayStr);

  // isCheckedIn = true NẾU có bản ghi hôm nay VÀ đã có giờ vào VÀ chưa có giờ ra
  const isCheckedIn = !!(todayRecord && todayRecord.check_in_time && !todayRecord.check_out_time);

  // 5. Nút bấm CHECK-IN
  const handleCheckIn = async () => {
    // Kiểm tra xem hệ thống đã lấy được ID chưa
    if (!user || !user.id) {
      toast.error('Lỗi bảo mật: Không tìm thấy ID của bạn. Vui lòng Đăng xuất và Đăng nhập lại!');
      return; // Dừng lại ngay, không gọi API nữa
    }

    try {
      const payload = {
        user: user.id, // Đảm bảo chắc chắn gửi ID (số)
        work_date: todayStr,
        check_in_time: new Date().toISOString(),
        status: 'Present'
      };
      
      console.log("Đang gửi dữ liệu Check-in:", payload); // In ra console để theo dõi

      await createAttendanceAPI(payload);
      toast.success('Check-in thành công! Bắt đầu ca làm việc.');
      loadData();
    } catch (error: any) {
      // BẮT TẬN TAY LỖI TỪ BACKEND TRẢ VỀ:
      console.error("Backend báo lỗi:", error.response?.data);
      
      // Hiển thị lỗi lên màn hình để dễ sửa
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : 'Hôm nay bạn đã điểm danh rồi hoặc máy chủ lỗi!';
      toast.error(`Lỗi Check-in: ${errorMsg}`);
    }
  };

  // 6. Nút bấm CHECK-OUT
  const handleCheckOut = async () => {
    if (!todayRecord) return;
    try {
      await updateAttendanceAPI(todayRecord.id, {
        check_out_time: new Date().toISOString()
      });
      toast.success('Check-out thành công! Nghỉ ngơi thôi.');
      loadData();
    } catch (error) {
      toast.error('Lỗi khi Check-out!');
    }
  };

  return { currentTime, logs, loading, isCheckedIn, handleCheckIn, handleCheckOut };
};