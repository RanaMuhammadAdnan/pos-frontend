'use server';
import { ApiClient } from '../../lib/api';
import { PurchaseInvoice, CreatePurchaseInvoicePayload, PurchaseInvoiceResponse } from '../../types/purchaseInvoice';

export const createPurchaseInvoiceAction = async (payload: CreatePurchaseInvoicePayload): Promise<PurchaseInvoiceResponse> => {
  try {
    const result = await ApiClient.post<PurchaseInvoice>('/purchase-invoices', payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create purchase invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 