'use server';
import { ApiClient } from '../../lib/api';
import { CreateCityPayload, CreateCityResponse, City } from '../../types';

export const createCityAction = async (payload: CreateCityPayload): Promise<CreateCityResponse> => {
  try {
    const result = await ApiClient.post<City>('/cities', payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create city' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 