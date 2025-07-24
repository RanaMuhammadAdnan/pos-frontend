'use server';
import { ApiClient } from '../../lib/api';
import { CityResponse, City } from '../../types';

export const getCitiesAction = async (): Promise<CityResponse> => {
  try {
    const result = await ApiClient.get<any>('/cities');
    // Unwrap the nested structure if present
    if (result && result.success && Array.isArray(result.data?.data)) {
      return { success: true, data: result.data.data };
    }
    // Fallback for error
    return { success: false, error: result.error || result.data?.error || 'Failed to fetch cities' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 