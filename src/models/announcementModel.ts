// src/models/announcementModel.ts
import axiosClient from '../api/axiosClient';

export const fetchAnnouncementsAPI = () => axiosClient.get('announcement/');
export const createAnnouncementAPI = (data: any) => axiosClient.post('announcement/', data);
export const deleteAnnouncementAPI = (id: number) => axiosClient.delete(`announcement/${id}/`);