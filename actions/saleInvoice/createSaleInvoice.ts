'use server';
import { ApiClient } from '../../lib/api';
import { SaleInvoice, CreateSaleInvoiceRequest } from '../../types';

export const createSaleInvoice = async (data: CreateSaleInvoiceRequest): Promise<{ success: boolean; data?: SaleInvoice; error?: string }> => {
  try {
    const result = await ApiClient.post<SaleInvoice>('/sale-invoices', data);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create sale invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 