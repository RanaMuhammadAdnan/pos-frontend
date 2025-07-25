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
      // The API returns: { success: true, data: { saleInvoices: [...], pagination: {...} } }
      const { saleInvoices, pagination } = result.data.data;
      
      return { 
        success: true, 
        data: { 
          saleInvoices: saleInvoices || [], 
          pagination: pagination || { total: 0, page: 1, limit: 10, totalPages: 0 } 
        } 
      };
    }
    
    return { success: false, error: result.error || 'Failed to fetch sale invoices' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 