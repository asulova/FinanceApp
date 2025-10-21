import type { Transaction } from '../types';
import type { PagedResult } from '../../../types/PagedResult';
import api from '../../../config/axiosConfig';
import { API_URL } from '../../../config';

export async function createTransaction(
  transaction: Omit<Transaction, 'id'>,
  token: string
): Promise<Transaction> {
  const response = await api.post(
    `${API_URL}/api/transactions`,
    transaction,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}


export const fetchTransactions = async (
  pageNumber: number,
  pageSize: number,
  token: string
): Promise<PagedResult<Transaction>> => {
  const response = await api.get<PagedResult<Transaction>>(
    `${API_URL}/api/transactions`,
    {
      params: { pageNumber, pageSize },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
