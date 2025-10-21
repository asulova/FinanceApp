import axios from 'axios';
import { API_URL } from '../../../config';
import type { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
  const response = await axios.get(`${API_URL}/api/categories`);
  return response.data;
}

export async function addCategory(category: { name: string; description?: string }): Promise<Category> {
  const response = await axios.post(`${API_URL}/api/categories`, category);
  return response.data;
}
