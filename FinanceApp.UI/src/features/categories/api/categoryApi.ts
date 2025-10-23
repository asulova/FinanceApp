import type { Category } from '../types';
import api from '../../../config/axiosConfig';
import { API_URL } from '../../../config';

export async function getCategories(token: string): Promise<Category[]> {
    const response = await api.get<Category[]>(
        `${API_URL}/api/categories`,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
  );
  return response.data;
}

export async function addCategory(category: { name: string; description?: string }, token: string): Promise<Category> {
  const response = await api.post(
    `${API_URL}/api/categories`,
    category,
      {
          headers: { Authorization: `Bearer ${token}` }
      }
  );
  return response.data;
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  await api.delete(
    `${API_URL}/api/categories/${id}`,
      {
          headers: { Authorization: `Bearer ${token}` }
      }
  );
}

export async function editCategory(id: number, description: string, token: string): Promise<{ message: string }> {
    const response = await api.put(
        `${API_URL}/api/categories/${id}`,
        { description },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
}
