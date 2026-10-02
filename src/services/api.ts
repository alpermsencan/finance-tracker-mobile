import axios, { AxiosInstance } from 'axios';

// Default Railway API base URL (user can update this or toggle to custom domain)
export let CURRENT_API_URL = 'https://finance-tracker-backend.up.railway.app/api';

export function setApiUrl(newUrl: string) {
  CURRENT_API_URL = newUrl.endsWith('/api') ? newUrl : `${newUrl}/api`;
  apiClient.defaults.baseURL = CURRENT_API_URL;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: CURRENT_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const mockToken = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  if (config.headers) {
    config.headers.Authorization = `Bearer ${mockToken}`;
  }
  return config;
});

export interface Bill {
  id: string;
  title?: string;
  vendorName: string;
  vendorCategory?: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  recurrenceInterval?: string;
  daysRemaining?: number;
}

export interface BalanceSummary {
  month: string;
  incomeTotal: number;
  expenseTotal: number;
  netBalance: number;
  categories: Record<string, number>;
}

export interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  currentSpent: number;
  remainingAmount: number;
  progressPercentage: number;
  warning: string | null;
}

export interface CurrencyRates {
  usdToTry: number;
  eurToTry: number;
  goldPerGram: number;
}

export const api = {
  getUpcomingBills: async (days: number = 3): Promise<Bill[]> => {
    const { data } = await apiClient.get<Bill[]>(`/bills/upcoming?days=${days}`);
    return data;
  },
  getAllBills: async (): Promise<Bill[]> => {
    const { data } = await apiClient.get<Bill[]>('/bills');
    return data;
  },
  createBill: async (bill: Partial<Bill>): Promise<Bill> => {
    const { data } = await apiClient.post<Bill>('/bills', bill);
    return data;
  },
  payBill: async (billId: string): Promise<any> => {
    const { data } = await apiClient.patch(`/bills/${billId}/pay`);
    return data;
  },
  getBalance: async (month?: string): Promise<BalanceSummary> => {
    const url = month ? `/transactions/balance?month=${month}` : '/transactions/balance';
    const { data } = await apiClient.get<BalanceSummary>(url);
    return data;
  },
  getBudgets: async (): Promise<Budget[]> => {
    const { data } = await apiClient.get<Budget[]>('/budgets');
    return data;
  },
  createBudget: async (budget: { category: string; limitAmount: number; startDate: string; endDate: string }): Promise<Budget> => {
    const { data } = await apiClient.post<Budget>('/budgets', budget);
    return data;
  },
  getCurrencyRates: async (): Promise<CurrencyRates> => {
    const { data } = await apiClient.get<CurrencyRates>('/currency/rates');
    return data;
  },
};
