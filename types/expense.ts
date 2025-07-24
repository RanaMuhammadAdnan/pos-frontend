export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string; // ISO string
}

export interface ExpenseResponse {
  success: boolean;
  data?: Expense[];
  error?: string;
}

export interface SingleExpenseResponse {
  success: boolean;
  data?: Expense;
  error?: string;
}

export interface CreateExpensePayload {
  description: string;
  amount: number;
  date: string;
}

export interface UpdateExpensePayload {
  id: number;
  description?: string;
  amount?: number;
  date?: string;
} 