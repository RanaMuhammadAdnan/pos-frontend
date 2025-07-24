'use server';
import { ApiClient } from '../../lib/api';

export interface DeleteCustomerResponse {
  success: boolean;
  error?: string;
}

export const deleteCustomerAction = async (id: number): Promise<DeleteCustomerResponse> => {
  try {
    const result = await ApiClient.delete(`/customers/${id}`);
    
    if (result.success) {
      return { success: true };
    }
    
    return { success: false, error: result.error || 'Failed to delete customer' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 