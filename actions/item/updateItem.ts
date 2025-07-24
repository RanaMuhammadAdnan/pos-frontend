'use server';
import { ApiClient } from '../../lib/api';
import { UpdateItemPayload, SingleItemResponse } from '../../types';

export const updateItemAction = async (payload: UpdateItemPayload): Promise<SingleItemResponse> => {
  try {
    const { id, ...updateData } = payload;
    const result = await ApiClient.put<any>(`/items/${id}`, updateData);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update item' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 