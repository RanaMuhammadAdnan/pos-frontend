'use server';
import { ApiClient } from '../../lib/api';
import { VendorResponse, Vendor } from '../../types';

export const getVendorsAction = async (): Promise<VendorResponse> => {
  try {
    const result = await ApiClient.get<Vendor[]>('/vendors');
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch vendors' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 