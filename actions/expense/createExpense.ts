import { ApiClient } from '../../lib/api';
import { CreateExpensePayload, SingleExpenseResponse } from 'types/expense';

export const createExpense = async (payload: CreateExpensePayload): Promise<SingleExpenseResponse> => {
  try {
    const result = await ApiClient.post<any>('/expenses', payload);
    if (result.success && result.data?.success && result.data.data) {
      return { success: true, data: result.data.data };
    }
    return { success: false, error: result.error || result.data?.error || 'Failed to create expense' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 