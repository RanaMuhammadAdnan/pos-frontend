'use server';
import { ApiClient } from '../../lib/api';
import { SaleInvoiceStats } from '../../types';

export const getSaleInvoiceStats = async (): Promise<{ success: boolean; data?: SaleInvoiceStats; error?: string }> => {
  try {
    const result = await ApiClient.get<SaleInvoiceStats>('/sale-invoices/stats');
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch sale invoice stats' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 