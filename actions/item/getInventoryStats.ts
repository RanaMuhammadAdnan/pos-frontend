'use server';
import { ApiClient } from '../../lib/api';

export interface InventoryStatsResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const getInventoryStatsAction = async (): Promise<InventoryStatsResponse> => {
  try {
    const result = await ApiClient.get<any>('/items/stats');
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch inventory stats' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 