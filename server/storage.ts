import { 
  users, 
  economicData, 
  priceData, 
  userBudgets, 
  userSavings, 
  shoppingListItems,
  type User, 
  type InsertUser,
  type EconomicData,
  type InsertEconomicData,
  type PriceData,
  type InsertPriceData,
  type UserBudget,
  type InsertUserBudget,
  type UserSavings,
  type InsertUserSavings,
  type ShoppingListItem,
  type InsertShoppingListItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Economic data methods
  getEconomicData(): Promise<EconomicData | undefined>;
  updateEconomicData(data: InsertEconomicData): Promise<EconomicData>;
  
  // Price data methods
  getAllPriceData(): Promise<PriceData[]>;
  getPriceDataByItem(itemName: string): Promise<PriceData | undefined>;
  updatePriceData(data: InsertPriceData): Promise<PriceData>;
  
  // Budget methods
  getUserBudgets(userId: number, month: string): Promise<UserBudget[]>;
  updateUserBudget(budget: InsertUserBudget): Promise<UserBudget>;
  
  // Savings methods
  getUserSavings(userId: number, weekOf: string): Promise<UserSavings | undefined>;
  updateUserSavings(savings: InsertUserSavings): Promise<UserSavings>;
  
  // Shopping list methods
  getShoppingListItems(userId: number): Promise<ShoppingListItem[]>;
  addShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingListItem(id: number, updates: Partial<ShoppingListItem>): Promise<ShoppingListItem>;
  deleteShoppingListItem(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private economicData: EconomicData | undefined;
  private priceData: Map<string, PriceData>;
  private userBudgets: Map<string, UserBudget>;
  private userSavings: Map<string, UserSavings>;
  private shoppingListItems: Map<number, ShoppingListItem>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.priceData = new Map();
    this.userBudgets = new Map();
    this.userSavings = new Map();
    this.shoppingListItems = new Map();
    this.currentId = 1;
    
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with current economic data
    this.economicData = {
      id: 1,
      inflationRate: 3.7,
      gdpGrowth: 2.4,
      consumerPriceIndex: 298.2,
      lastUpdated: new Date()
    };

    // Initialize price data for essential items
    const items = [
      {
        itemName: "Eggs",
        currentPrice: 2.89,
        averagePrice30Day: 3.52,
        priceRange: { min: 2.49, max: 3.99 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -18,
        emoji: "🥚",
        description: "Grade A Large"
      },
      {
        itemName: "Gas",
        currentPrice: 3.42,
        averagePrice30Day: 3.71,
        priceRange: { min: 3.15, max: 4.25 },
        recommendation: "CONSIDER" as const,
        percentageChange: -8,
        emoji: "⛽",
        description: "Regular Unleaded"
      },
      {
        itemName: "Milk",
        currentPrice: 4.29,
        averagePrice30Day: 3.83,
        priceRange: { min: 3.49, max: 4.99 },
        recommendation: "WAIT" as const,
        percentageChange: 12,
        emoji: "🥛",
        description: "Whole Milk (Gallon)"
      },
      {
        itemName: "Bread",
        currentPrice: 1.89,
        averagePrice30Day: 2.25,
        priceRange: { min: 1.69, max: 2.89 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -16,
        emoji: "🍞",
        description: "White Sandwich Loaf"
      },
      {
        itemName: "Ground Beef",
        currentPrice: 5.79,
        averagePrice30Day: 6.09,
        priceRange: { min: 4.99, max: 7.49 },
        recommendation: "CONSIDER" as const,
        percentageChange: -5,
        emoji: "🥩",
        description: "80/20 per lb"
      },
      {
        itemName: "Rice",
        currentPrice: 4.99,
        averagePrice30Day: 4.62,
        priceRange: { min: 3.99, max: 5.99 },
        recommendation: "WAIT" as const,
        percentageChange: 8,
        emoji: "🍚",
        description: "Long Grain White (5lb bag)"
      }
    ];

    items.forEach((item, index) => {
      this.priceData.set(item.itemName, {
        id: index + 1,
        ...item,
        lastUpdated: new Date()
      });
    });

    // Initialize default user budget
    const defaultBudgets = [
      { category: "Groceries", budgetAmount: 400, spentAmount: 248 },
      { category: "Gas & Transportation", budgetAmount: 200, spentAmount: 180 },
      { category: "Household Items", budgetAmount: 150, spentAmount: 85 }
    ];

    const currentMonth = new Date().toISOString().slice(0, 7);
    defaultBudgets.forEach((budget, index) => {
      const key = `1-${budget.category}-${currentMonth}`;
      this.userBudgets.set(key, {
        id: index + 1,
        userId: 1,
        month: currentMonth,
        ...budget
      });
    });

    // Initialize default savings data
    const currentWeek = new Date().toISOString().slice(0, 10);
    this.userSavings.set(`1-${currentWeek}`, {
      id: 1,
      userId: 1,
      weeklyTotal: 23.47,
      projectedMonthly: 94.32,
      bestPurchases: [
        { item: "Eggs", saved: 8.20 },
        { item: "Bread", saved: 6.15 },
        { item: "Gas", saved: 9.12 }
      ],
      weekOf: currentWeek
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEconomicData(): Promise<EconomicData | undefined> {
    return this.economicData;
  }

  async updateEconomicData(data: InsertEconomicData): Promise<EconomicData> {
    this.economicData = {
      id: 1,
      ...data
    };
    return this.economicData;
  }

  async getAllPriceData(): Promise<PriceData[]> {
    return Array.from(this.priceData.values());
  }

  async getPriceDataByItem(itemName: string): Promise<PriceData | undefined> {
    return this.priceData.get(itemName);
  }

  async updatePriceData(data: InsertPriceData): Promise<PriceData> {
    const existing = this.priceData.get(data.itemName);
    const id = existing?.id || this.currentId++;
    const updated: PriceData = { id, ...data };
    this.priceData.set(data.itemName, updated);
    return updated;
  }

  async getUserBudgets(userId: number, month: string): Promise<UserBudget[]> {
    return Array.from(this.userBudgets.values()).filter(
      budget => budget.userId === userId && budget.month === month
    );
  }

  async updateUserBudget(budget: InsertUserBudget): Promise<UserBudget> {
    const key = `${budget.userId}-${budget.category}-${budget.month}`;
    const existing = this.userBudgets.get(key);
    const id = existing?.id || this.currentId++;
    const updated: UserBudget = { id, ...budget };
    this.userBudgets.set(key, updated);
    return updated;
  }

  async getUserSavings(userId: number, weekOf: string): Promise<UserSavings | undefined> {
    return this.userSavings.get(`${userId}-${weekOf}`);
  }

  async updateUserSavings(savings: InsertUserSavings): Promise<UserSavings> {
    const key = `${savings.userId}-${savings.weekOf}`;
    const existing = this.userSavings.get(key);
    const id = existing?.id || this.currentId++;
    const updated: UserSavings = { id, ...savings };
    this.userSavings.set(key, updated);
    return updated;
  }

  async getShoppingListItems(userId: number): Promise<ShoppingListItem[]> {
    return Array.from(this.shoppingListItems.values()).filter(
      item => item.userId === userId
    );
  }

  async addShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem> {
    const id = this.currentId++;
    const newItem: ShoppingListItem = { id, ...item };
    this.shoppingListItems.set(id, newItem);
    return newItem;
  }

  async updateShoppingListItem(id: number, updates: Partial<ShoppingListItem>): Promise<ShoppingListItem> {
    const existing = this.shoppingListItems.get(id);
    if (!existing) {
      throw new Error(`Shopping list item with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.shoppingListItems.set(id, updated);
    return updated;
  }

  async deleteShoppingListItem(id: number): Promise<void> {
    this.shoppingListItems.delete(id);
  }
}

export const storage = new MemStorage();
