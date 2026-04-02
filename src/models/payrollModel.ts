// src/models/payrollModel.ts
import axiosClient from '../api/axiosClient';

export const fetchPayrollsAPI = () => axiosClient.get('payroll/');
export const createPayrollAPI = (data: any) => axiosClient.post('payroll/', data);
export const updatePayrollAPI = (id: number, data: any) => axiosClient.patch(`payroll/${id}/`, data);