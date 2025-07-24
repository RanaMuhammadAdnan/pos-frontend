'use server';
import { ApiClient } from '../../lib/api';

export interface DeleteItemResponse {
  success: boolean;
  error?: string;
}

export const deleteItemAction = async (id: number): Promise<DeleteItemResponse> => {
  try {
    const result = await ApiClient.delete(`/items/${id}`);
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Failed to delete item' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 