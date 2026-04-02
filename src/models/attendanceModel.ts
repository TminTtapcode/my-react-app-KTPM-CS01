// src/models/attendanceModel.ts
import axiosClient from '../api/axiosClient';

export const fetchAttendancesAPI = () => axiosClient.get('attendance/');

// Check-in (Tạo mới)
export const createAttendanceAPI = (data: any) => axiosClient.post('attendance/', data);

// Check-out (Cập nhật một phần - PATCH)
export const updateAttendanceAPI = (id: number, data: any) => axiosClient.patch(`attendance/${id}/`, data);