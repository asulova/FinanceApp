import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7276';

export const getUserByEmail = (email: string) =>
  axios.get(`${API_URL}/api/users?email=${encodeURIComponent(email)}`);

export const updateUserProfile = (data: { email: string; firstName: string; lastName: string }) =>
  axios.put(`${API_URL}/api/users/profile`, data);

export const getUsersList = () =>
  axios.get(`${API_URL}/api/users/list`);
