'use server';
import { ApiClient } from '../../lib/api';
import { UpdateCustomerPayload, CreateCustomerResponse, Customer } from '../../types';

export const updateCustomerAction = async (payload: UpdateCustomerPayload): Promise<CreateCustomerResponse> => {
  try {
    const result = await ApiClient.put<Customer>(`/customers/${payload.id}`, payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to update customer' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 