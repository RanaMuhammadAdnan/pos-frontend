'use server';
import { ApiClient } from '../../lib/api';

export const deleteSaleInvoice = async (id: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const result = await ApiClient.delete(`/sale-invoices/${id}`);
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Failed to delete sale invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 