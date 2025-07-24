import { ApiClient } from '../../lib/api';
import { ExpenseResponse } from 'types/expense';

export const getExpenses = async (): Promise<ExpenseResponse> => {
  try {
    const result = await ApiClient.get<any>('/expenses');
    if (result.success && Array.isArray(result.data?.data)) {
      return { success: true, data: result.data.data };
    }
    return { success: false, error: result.error || result.data?.error || 'Failed to fetch expenses' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 