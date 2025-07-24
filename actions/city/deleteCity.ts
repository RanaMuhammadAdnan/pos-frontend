'use server';
import { ApiClient } from '../../lib/api';

export interface DeleteCityResponse {
  success: boolean;
  error?: string;
}

export const deleteCityAction = async (id: number): Promise<DeleteCityResponse> => {
  try {
    const result = await ApiClient.delete(`/cities/${id}`);
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Failed to delete city' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 