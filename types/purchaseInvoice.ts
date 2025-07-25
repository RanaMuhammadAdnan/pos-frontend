export interface PurchaseInvoiceItem {
  id: number;
  purchaseInvoiceId: number;
  itemId: number;
  quantity: number;
  price: number;
  item?: {
    id: number;
    name: string;
    sku: string;
    grossPrice: number;
    tax: number;
    discount: number;
    netPrice: number;
    sellingPrice: number;
  };
}

export interface PurchaseInvoice {
  id: number;
  invoiceNumber: string;
  vendorId: number;
  vendor?: {
    id: number;
    name: string;
    email?: string;
    phone: string;
    address?: string;
  };
  date: string;
  total: number;
  items?: PurchaseInvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePurchaseInvoicePayload {
  invoiceNumber: string;
  vendorId: number;
  date: string;
  items: Array<{
    itemId: number;
    quantity: number;
  }>;
}

export interface PurchaseInvoiceResponse {
  success: boolean;
  data?: PurchaseInvoice;
  error?: string;
}

export interface PurchaseInvoicesPaginatedResponse {
  success: boolean;
  data?: {
    invoices: PurchaseInvoice[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
} 