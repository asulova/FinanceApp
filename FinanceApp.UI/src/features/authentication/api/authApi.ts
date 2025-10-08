import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7276';

export const login = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/api/users/login`, data);

export const register = (data: { email: string; password: string; firstName: string; lastName: string }) =>
  axios.post(`${API_URL}/api/users/register`, data);
