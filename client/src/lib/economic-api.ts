export interface EconomicIndicators {
  inflationRate: number;
  gdpGrowth: number;
  consumerPriceIndex: number;
  lastUpdated: Date;
}

export interface PriceItem {
  id: number;
  itemName: string;
  currentPrice: number;
  averagePrice30Day: number;
  priceRange: { min: number; max: number };
  recommendation: "BUY_NOW" | "CONSIDER" | "WAIT";
  percentageChange: number;
  emoji: string;
  description: string;
  lastUpdated: Date;
}

export interface BudgetCategory {
  id: number;
  userId: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
}

export interface SavingsData {
  id: number;
  userId: number;
  weeklyTotal: number;
  projectedMonthly: number;
  bestPurchases: Array<{ item: string; saved: number }>;
  weekOf: string;
}

export interface ShoppingListItem {
  id: number;
  userId: number;
  itemName: string;
  quantity: number;
  estimatedPrice: number;
  averagePrice: number;
  recommendation: "BUY_NOW" | "CONSIDER" | "WAIT";
  savings: number;
  completed: number;
  createdAt: Date;
}

export const fetchEconomicData = async (): Promise<EconomicIndicators> => {
  const response = await fetch('/api/economic-data');
  if (!response.ok) {
    throw new Error('Failed to fetch economic data');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: new Date(data.lastUpdated)
  };
};

export const fetchPriceData = async (): Promise<PriceItem[]> => {
  const response = await fetch('/api/price-data');
  if (!response.ok) {
    throw new Error('Failed to fetch price data');
  }
  const data = await response.json();
  return data.map((item: any) => ({
    ...item,
    lastUpdated: new Date(item.lastUpdated)
  }));
};

export const fetchBudgetData = async (userId: number, month: string): Promise<BudgetCategory[]> => {
  const response = await fetch(`/api/budgets/${userId}/${month}`);
  if (!response.ok) {
    throw new Error('Failed to fetch budget data');
  }
  return response.json();
};

export const fetchSavingsData = async (userId: number, weekOf: string): Promise<SavingsData> => {
  const response = await fetch(`/api/savings/${userId}/${weekOf}`);
  if (!response.ok) {
    throw new Error('Failed to fetch savings data');
  }
  return response.json();
};

export const fetchShoppingListData = async (userId: number): Promise<ShoppingListItem[]> => {
  const response = await fetch(`/api/shopping-list/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shopping list data');
  }
  const data = await response.json();
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt)
  }));
};

export const updateShoppingListItem = async (id: number, updates: Partial<ShoppingListItem>) => {
  const response = await fetch(`/api/shopping-list/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error('Failed to update shopping list item');
  }
  return response.json();
};

export const refreshFredData = async (): Promise<EconomicIndicators> => {
  const response = await fetch('/api/fred-data');
  if (!response.ok) {
    throw new Error('Failed to refresh FRED data');
  }
  const data = await response.json();
  return {
    ...data,
    lastUpdated: new Date(data.lastUpdated)
  };
};
