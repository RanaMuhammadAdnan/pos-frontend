'use server';
import { ApiClient } from '../../lib/api';
import { CreateVendorPayload, CreateVendorResponse, Vendor } from '../../types';

export const createVendorAction = async (payload: CreateVendorPayload): Promise<CreateVendorResponse> => {
  try {
    const result = await ApiClient.post<Vendor>('/vendors', payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create vendor' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 