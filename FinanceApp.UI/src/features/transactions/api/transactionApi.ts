import type { Transaction } from '../types';
import axios from 'axios';

export async function createTransaction(transaction: Omit<Transaction, 'id'>) {
  const response = await axios.post('/api/transactions', transaction);
  return response.data;
}
