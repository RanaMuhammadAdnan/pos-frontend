'use server';
import { ApiClient } from '../../lib/api';
import { PaymentRequest } from '../../types';

export const recordPayment = async (invoiceId: number, paymentData: PaymentRequest): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const result = await ApiClient.post<any>(`/sale-invoices/${invoiceId}/payment`, paymentData);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to record payment' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 