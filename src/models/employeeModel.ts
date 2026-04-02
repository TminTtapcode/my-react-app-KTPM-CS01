// src/models/employeeModel.ts
import axiosClient from '../api/axiosClient';

// Lấy danh sách từ các ViewSet tương ứng trong Backend
export const fetchEmployeesAPI = () => axiosClient.get('user/');
export const fetchRolesAPI = () => axiosClient.get('role/');
export const fetchDepartmentsAPI = () => axiosClient.get('department/');

// Tạo mới nhân viên
export const createEmployeeAPI = (data: any) => axiosClient.post('user/', data);