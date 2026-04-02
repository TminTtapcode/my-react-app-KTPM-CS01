import axios from 'axios';

// Hàm cũ (Nhịp 1)
export const loginAPI = async (username: string, password: string) => {
  const response = await axios.post('http://127.0.0.1:8000/o/token/', 
    { grant_type: 'password', username, password, client_id: '08IMhfSaXjduOczDatKmRxWlSiVAFS4I2HjIao4k' }, 
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data; 
};

// Hàm mới (Nhịp 2): Cầm Token đi xin Profile
export const fetchUserProfileAPI = async (token: string) => {
  const response = await axios.get('http://127.0.0.1:8000/user/me/', {
    headers: { Authorization: `Bearer ${token}` } // Đưa Token ra trình diện
  });
  return response.data;
};