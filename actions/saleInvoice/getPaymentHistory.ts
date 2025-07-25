'use server';
import { ApiClient } from '../../lib/api';

export interface PaymentHistoryItem {
  id: number;
  saleInvoiceId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryResponse {
  success: boolean;
  data?: {
    invoice: any;
    paymentHistory: PaymentHistoryItem[];
  };
  error?: string;
}

export const getPaymentHistory = async (invoiceId: number): Promise<PaymentHistoryResponse> => {
  try {
    const result = await ApiClient.get<any>(`/sale-invoices/${invoiceId}/payment-history`);
    
    if (result.success && result.data) {
      // The backend returns: { success: true, data: { invoice, paymentHistory } }
      // The ApiClient wraps it: { success: true, data: { success: true, data: { invoice, paymentHistory } } }
      const responseData = result.data.data || result.data;
      return { 
        success: true, 
        data: responseData
      };
    }
    
    return { success: false, error: result.error || 'Failed to fetch payment history' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 