import { ApiClient } from '../../lib/api';

export const deletePurchaseInvoiceAction = async (id: number) => {
  const result = await ApiClient.delete(`/purchase-invoices/${id}`);
  return result;
}; 