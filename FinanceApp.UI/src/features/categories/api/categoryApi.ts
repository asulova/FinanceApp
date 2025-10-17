import axios from 'axios';

export interface Category {
  id: number;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const response = await axios.get('/api/categories');
  return response.data;
}
