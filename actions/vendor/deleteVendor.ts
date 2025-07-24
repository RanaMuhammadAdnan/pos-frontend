'use server';
import { ApiClient } from '../../lib/api';

export interface DeleteVendorResponse {
  success: boolean;
  error?: string;
}

export const deleteVendorAction = async (id: number): Promise<DeleteVendorResponse> => {
  try {
    const result = await ApiClient.delete(`/vendors/${id}`);
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Failed to delete vendor' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 