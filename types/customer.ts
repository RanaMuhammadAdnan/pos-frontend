import { City } from './city';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  email?: string;
  cityId?: number;
  city?: City | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerPayload {
  name: string;
  phone: string;
  address: string;
  email?: string;
  cityId?: number;
}

export interface UpdateCustomerPayload {
  id: number;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  cityId?: number;
}

export interface CustomerResponse {
  success: boolean;
  data?: Customer[];
  error?: string;
}

export interface CreateCustomerResponse {
  success: boolean;
  data?: Customer;
  error?: string;
} 