'use server';
import { ApiClient } from '../../lib/api';
import { PurchaseInvoice, PurchaseInvoiceResponse } from 'types/purchaseInvoice';

export const updatePurchaseInvoiceAction = async (id: number, payload: any): Promise<PurchaseInvoiceResponse> => {
  try {
    const result = await ApiClient.put(`/purchase-invoices/${id}`, payload);
    
    // Handle the new response format with nested data
    if (result.success && result.data?.success && result.data.data) {
      return { success: true, data: result.data.data };
    }
    
    // Handle direct success response
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update purchase invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 