import { ApiClient } from '../../lib/api';
import { UpdateExpensePayload, SingleExpenseResponse } from 'types/expense';

export const updateExpense = async (id: number, payload: UpdateExpensePayload): Promise<SingleExpenseResponse> => {
  try {
    const result = await ApiClient.put<any>(`/expenses/${id}`, payload);
    if (result.success && result.data?.success && result.data.data) {
      return { success: true, data: result.data.data };
    }
    return { success: false, error: result.error || result.data?.error || 'Failed to update expense' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 