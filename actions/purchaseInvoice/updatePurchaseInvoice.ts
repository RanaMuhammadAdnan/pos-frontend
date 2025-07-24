'use server';
import { ApiClient } from '../../lib/api';
import { PurchaseInvoice, PurchaseInvoiceResponse } from 'types/purchaseInvoice';

export const updatePurchaseInvoiceAction = async (id: number, payload: any): Promise<PurchaseInvoiceResponse> => {
  try {
    const result = await ApiClient.put(`/purchase-invoices/${id}`, payload);
    const data = (result as { data?: PurchaseInvoice }).data;
    if (data && data.id) {
      return { success: true, data };
    }
    return { success: false, error: (result as any)?.error || 'Failed to update purchase invoice' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 