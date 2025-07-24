export interface Item {
  id: number;
  name: string;
  sku: string;
  grossPrice: number;
  tax: number;
  discount: number;
  netPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  currentStock: number;
  vendorId?: number;
  vendor?: {
    id: number;
    name: string;
    email?: string;
    phone: string;
  };
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemPayload {
  name: string;
  sku: string;
  grossPrice: number;
  tax: number;
  discount: number;
  sellingPrice: number;
  minStockLevel: number;
  vendorId?: number;
  currentStock: number;
  description?: string;
}

export interface UpdateItemPayload {
  id: number;
  name?: string;
  sku?: string;
  grossPrice?: number;
  tax?: number;
  discount?: number;
  sellingPrice?: number;
  minStockLevel?: number;
  vendorId?: number;
  currentStock?: number;
  isActive?: boolean;
  description?: string;
}

export interface UpdateStockPayload {
  quantity: number;
  type: 'add' | 'subtract';
}

export interface ItemResponse {
  success: boolean;
  data?: Item;
  error?: string;
}

export interface SingleItemResponse {
  success: boolean;
  data?: Item;
  error?: string;
}

export interface ItemsPaginatedResponse {
  success: boolean;
  data?: {
    items: Item[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  error?: string;
}

export interface StockAlert {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minStockLevel: number;
  vendor?: {
    id: number;
    name: string;
    email?: string;
    phone: string;
  };
  needsRestock: boolean;
}

export interface StockAlertsResponse {
  success: boolean;
  data?: {
    alerts: StockAlert[];
  };
  error?: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  lowStockPercentage: string;
}

export interface InventoryStatsResponse {
  success: boolean;
  data?: InventoryStats;
  error?: string;
}

export interface UpdateStockResponse {
  success: boolean;
  data?: Item & {
    stockUpdated: boolean;
    previousStock: number;
    newStock: number;
  };
  error?: string;
}

// Filter and search interfaces
export interface ItemFilters {
  search?: string;
  vendorId?: number;
  lowStock?: boolean;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Common units for items
export const ITEM_UNITS = [
  'piece',
  'kg',
  'gram',
  'liter',
  'ml',
  'box',
  'pack',
  'dozen',
  'pair',
  'set',
  'roll',
  'sheet',
  'ream',
  'bottle',
  'can',
  'bag',
  'container',
  'unit',
  'item'
] as const;

export type ItemUnit = typeof ITEM_UNITS[number]; 