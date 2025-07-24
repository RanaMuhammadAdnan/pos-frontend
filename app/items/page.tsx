import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import { Layout } from 'components/common';
import { ItemsContent } from 'components/items/ItemsContent';
import { getItemsAction } from 'actions';

export default async function ItemsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  const result = await getItemsAction();

  // Create the expected data structure for ItemsContent
  const serializedData = {
    success: result.success,
    data: result.data
      ? {
          items: Array.isArray(result.data.items)
            ? result.data.items.map((item) => ({
                id: item.id,
                name: item.name,
                sku: item.sku,
                description: item.description,
                grossPrice: Number(item.grossPrice || 0),
                tax: Number(item.tax || 0),
                discount: Number(item.discount || 0),
                netPrice: Number(item.netPrice),
                sellingPrice: Number(item.sellingPrice),
                currentStock: Number(item.currentStock),
                minStockLevel: Number(item.minStockLevel),
                vendorId: item.vendorId,
                isActive: item.isActive,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                vendor: item.vendor
                  ? {
                      id: item.vendor.id,
                      name: item.vendor.name,
                      phone: item.vendor.phone || '',
                      address: '', // Backend doesn't provide address, so use empty string
                      email: item.vendor.email
                    }
                  : undefined,
              }))
            : [],
          pagination: result.data.pagination
            ? {
                total: Number(result.data.pagination.total),
                page: Number(result.data.pagination.page),
                limit: Number(result.data.pagination.limit),
                totalPages: Number(result.data.pagination.totalPages),
              }
            : { total: 0, page: 1, limit: 10, totalPages: 0 },
        }
      : undefined,
    error: result.error,
  };

  return (
    <Layout>
      <ItemsContent initialData={serializedData} />
    </Layout>
  );
} 