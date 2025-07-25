'use server';
import { ApiClient } from '../../lib/api';
import { SaleInvoice } from '../../types';

export const getSaleInvoiceById = async (id: number): Promise<{ success: boolean; data?: SaleInvoice; error?: string }> => {
  try {
    const result = await ApiClient.get<any>(`/sale-invoices/${id}`);
    
    if (result.success && result.data) {
      // The backend returns: saleInvoice directly
      // The ApiClient wraps it: { success: true, data: saleInvoice }
      return { success: true, data: result.data.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch sale invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 