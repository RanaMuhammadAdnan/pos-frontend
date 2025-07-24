'use server';
import { ApiClient } from '../../lib/api';
import { CreateItemPayload, SingleItemResponse } from '../../types';

export const createItemAction = async (payload: CreateItemPayload): Promise<SingleItemResponse> => {
  try {
    console.log(payload)
    const result = await ApiClient.post<any>('/items', payload);
    console.log({result})
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create item' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 