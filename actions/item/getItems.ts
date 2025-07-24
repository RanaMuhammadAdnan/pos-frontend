'use server';
import { ApiClient } from '../../lib/api';
import { ItemsPaginatedResponse, ItemFilters } from '../../types';

export const getItemsAction = async (filters: ItemFilters = {}): Promise<ItemsPaginatedResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.vendorId) params.append('vendorId', filters.vendorId.toString());
    if (filters.lowStock) params.append('lowStock', 'true');
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const endpoint = `/items${queryString ? `?${queryString}` : ''}`;
    
    const result = await ApiClient.get<any[]>(endpoint);
    
    if (result.success && result.data) {
      // The backend returns: items array directly
      // The ApiClient wraps it: { success: true, data: items[] }
      const items = Array.isArray(result.data) ? result.data : [];
      
      // Since backend doesn't support pagination, we'll simulate it
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = items.slice(startIndex, endIndex);
      
      return { 
        success: true, 
        data: {
          items: paginatedItems,
          pagination: {
            total: items.length,
            page,
            limit,
            totalPages: Math.ceil(items.length / limit)
          }
        }
      };
    }
    
    return { success: false, error: result.error || 'Failed to fetch items' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 