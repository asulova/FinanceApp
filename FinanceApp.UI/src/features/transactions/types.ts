export interface Transaction {
  id?: number;
  amount: number;
  date: string;
  description: string;
  categoryId: number;
  type: 'INCOME' | 'EXPENSE';
  categoryName: string;
}
