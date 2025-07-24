'use server';
import { ApiClient } from '../../lib/api';
import { CustomerResponse, Customer } from '../../types';

export const getCustomersAction = async (): Promise<CustomerResponse> => {
  try {
    const result = await ApiClient.get<Customer[]>('/customers');
    
    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error || 'Failed to fetch customers' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 