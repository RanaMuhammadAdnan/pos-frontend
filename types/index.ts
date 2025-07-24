export * from './vendor';
export * from './item';
export * from './city';
export * from './customer';
export * from './saleInvoice';
export * from './purchaseInvoice';

export interface PaymentHistoryItem {
  id: number;
  saleInvoiceId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 