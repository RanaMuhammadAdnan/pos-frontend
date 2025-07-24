'use server';
import { ApiClient } from '../../lib/api';
import { SaleInvoice, UpdateSaleInvoiceRequest } from '../../types';

export const updateSaleInvoice = async (data: UpdateSaleInvoiceRequest): Promise<{ success: boolean; data?: SaleInvoice; error?: string }> => {
  try {
    const result = await ApiClient.put<SaleInvoice>(`/sale-invoices/${data.id}`, data);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update sale invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 