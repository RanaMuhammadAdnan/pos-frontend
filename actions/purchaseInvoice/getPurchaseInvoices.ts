'use server';
import { ApiClient } from '../../lib/api';
import { PurchaseInvoice, PurchaseInvoicesPaginatedResponse } from '../../types/purchaseInvoice';

export const getPurchaseInvoicesAction = async (filters: Record<string, any> = {}): Promise<PurchaseInvoicesPaginatedResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.vendorId) params.append('vendorId', filters.vendorId.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/purchase-invoices${queryString ? `?${queryString}` : ''}`;
    
    const result = await ApiClient.get<any>(endpoint);
    
    if (result.success && result.data) {
      // The backend returns: { success: true, data: { invoices, pagination } }
      // The ApiClient wraps it: { success: true, data: { success: true, data: { invoices, pagination } } }
      return { 
        success: true, 
        data: result.data.data
      };
    }
    
    return { success: false, error: result.error || 'Failed to fetch purchase invoices' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 