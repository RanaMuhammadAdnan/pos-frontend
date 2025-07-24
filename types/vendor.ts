export interface Vendor {
  id: number;
  name: string;
  phone: string;
  address: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVendorPayload {
  name: string;
  phone: string;
  address: string;
  email?: string;
}

export interface UpdateVendorPayload {
  id: number;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
}

export interface VendorResponse {
  success: boolean;
  data?: Vendor[];
  error?: string;
}

export interface CreateVendorResponse {
  success: boolean;
  data?: Vendor;
  error?: string;
} 