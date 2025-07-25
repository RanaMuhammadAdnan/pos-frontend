'use server';
import { ApiClient } from '../../lib/api';

export interface UpdateStockPayload {
  quantity: number;
  type: 'add' | 'subtract';
}

export interface UpdateStockResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const updateStockAction = async (id: number, payload: UpdateStockPayload): Promise<UpdateStockResponse> => {
  try {
    // Map 'type' to 'operation' for backend compatibility
    const { type, ...rest } = payload;
    const apiPayload = { ...rest, operation: type };
    const result = await ApiClient.patch<any>(`/items/${id}/stock`, apiPayload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update stock' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 