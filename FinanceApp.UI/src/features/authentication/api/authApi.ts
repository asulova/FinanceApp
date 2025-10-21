import axios from 'axios';
import { API_URL } from '../../../config';

export const login = (data: { email: string; password: string }) =>
  axios.post(`${API_URL}/api/users/login`, data);

export const register = (data: { email: string; password: string; firstName: string; lastName: string }) =>
  axios.post(`${API_URL}/api/users/register`, data);
