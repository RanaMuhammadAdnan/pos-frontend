'use server';
import { ApiClient } from '../../lib/api';
import { CreateCustomerPayload, CreateCustomerResponse, Customer } from '../../types';

export const createCustomerAction = async (payload: CreateCustomerPayload): Promise<CreateCustomerResponse> => {
  try {
    const result = await ApiClient.post<Customer>('/customers', payload);
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to create customer' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 