'use server';
import { ApiClient } from '../../lib/api';
import { UpdateVendorPayload, CreateVendorResponse, Vendor } from '../../types';

export const updateVendorAction = async (payload: UpdateVendorPayload): Promise<CreateVendorResponse> => {
  try {
    const { id, ...updateData } = payload;
    const result = await ApiClient.put<Vendor>(`/vendors/${id}`, updateData);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update vendor' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 