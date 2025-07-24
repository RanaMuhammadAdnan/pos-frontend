'use server';
import { ApiClient } from '../../lib/api';

export const getPurchaseInvoiceByIdAction = async (id: number) => {
  const result = await ApiClient.get<any>(`/purchase-invoices/${id}`);
  // Unwrap nested data if present
  if (result && result.success && result.data?.success && result.data.data) {
    return { success: true, data: result.data.data };
  }
  return { success: false, error: result.error || result.data?.error || 'Failed to fetch purchase invoice' };
}; 