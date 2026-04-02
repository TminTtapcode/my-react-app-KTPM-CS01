// src/models/leaveModel.ts
import axiosClient from '../api/axiosClient';

// Lấy danh sách đơn nghỉ phép
export const fetchLeavesAPI = () => axiosClient.get('leaverequest/');

// Tạo đơn nghỉ phép mới (Nhân viên dùng)
export const createLeaveAPI = (data: any) => axiosClient.post('leaverequest/', data);

// Cập nhật trạng thái đơn (Admin/HR dùng để Duyệt/Từ chối)
export const updateLeaveStatusAPI = (id: number, data: any) => axiosClient.patch(`leaverequest/${id}/`, data);