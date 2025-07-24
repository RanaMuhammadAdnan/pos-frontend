'use server';
import { ApiClient } from '../../lib/api';
import { StockAlertsResponse } from '../../types';

export const getStockAlertsAction = async (): Promise<StockAlertsResponse> => {
  try {
    const result = await ApiClient.get<{ alerts: any[] }>('/items/alerts');
    
    if (result.success && result.data) {
      return { 
        success: true, 
        data: {
          alerts: result.data.alerts
        }
      };
    }
    
    return { success: false, error: result.error || 'Failed to fetch stock alerts' };
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' };
  }
}; 