'use server';
import { ApiClient } from '../../lib/api';
import { UpdateCityPayload, CreateCityResponse, City } from '../../types';

export const updateCityAction = async (payload: UpdateCityPayload): Promise<CreateCityResponse> => {
  try {
    const result = await ApiClient.put<City>(`/cities/${payload.id}`, payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update city' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 