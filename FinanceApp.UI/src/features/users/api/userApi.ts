import axios from 'axios';
import { API_URL } from '../../../config';

export const getUserByEmail = (email: string) =>
  axios.get(`${API_URL}/api/users?email=${encodeURIComponent(email)}`);

export const updateUserProfile = (data: { email: string; firstName: string; lastName: string }) =>
  axios.put(`${API_URL}/api/users/profile`, data);

export const getUsersList = () =>
  axios.get(`${API_URL}/api/users/list`);
