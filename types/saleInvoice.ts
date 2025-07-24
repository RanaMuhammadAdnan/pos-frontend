import { Customer } from './customer';
import { Item } from './item';

export interface SaleInvoice {
  id: number;
  invoiceNumber: string;
  customerId: number;
  invoiceDate: string;
  subtotal: number;
  discountAmount: number;
  netAmount: number;
  totalAmount: number;
  remainingAmount: number;
  profit: number;
  status: 'complete' | 'pending' | 'returned';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  items?: SaleInvoiceItem[];
}

export interface SaleInvoiceItem {
  id: number;
  saleInvoiceId: number;
  itemId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  item?: Item;
}

export interface CreateSaleInvoiceRequest {
  invoiceNumber: string;
  customerId: number;
  invoiceDate?: string;
  items: Array<{
    itemId: number;
    quantity: number;
    discount?: number; // Discount per unit
  }>;
  notes?: string;
}

export interface UpdateSaleInvoiceRequest extends CreateSaleInvoiceRequest {
  id: number;
}

export interface SaleInvoiceListResponse {
  saleInvoices: SaleInvoice[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SaleInvoiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: number;
  status?: 'complete' | 'pending' | 'returned';
}

export interface PaymentRequest {
  amount: number;
  paymentMethod?: string;
  notes?: string;
}

export interface SaleInvoiceStats {
  totalInvoices: number;
  totalRevenue: number;
  totalDiscount: number;
  totalProfit: number;
  totalRemaining: number;
  pendingInvoices: number;
  completeInvoices: number;
} 