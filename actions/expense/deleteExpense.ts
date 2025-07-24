import { ApiClient } from '../../lib/api';

export const deleteExpense = async (id: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await ApiClient.delete<any>(`/expenses/${id}`);
    if (result.success && result.data?.success) {
      return { success: true };
    }
    return { success: false, error: result.error || result.data?.error || 'Failed to delete expense' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 