'use server';
import { ApiClient } from '../../lib/api';

export const updateSaleInvoiceStatus = async (id: number, status: 'complete' | 'pending' | 'returned'): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const result = await ApiClient.patch<any>(`/sale-invoices/${id}/status`, { status });
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update sale invoice status' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 