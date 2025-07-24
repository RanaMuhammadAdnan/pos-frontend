'use server';
import { ApiClient } from '../../lib/api';
import { SaleInvoiceListResponse, SaleInvoiceFilters } from '../../types';

export const getSaleInvoices = async (filters: SaleInvoiceFilters = {}): Promise<{ success: boolean; data?: SaleInvoiceListResponse; error?: string }> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.customerId) params.append('customerId', filters.customerId.toString());

    const result = await ApiClient.get<any>(`/sale-invoices?${params.toString()}`);
    if (result.success && result.data) {
      // The backend returns: { saleInvoices: [...], pagination: {...} }
      // The ApiClient wraps it: { success: true, data: { saleInvoices: [...], pagination: {...} } }
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch sale invoices' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 