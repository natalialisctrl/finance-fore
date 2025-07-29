import { 
  users, 
  economicData, 
  priceData, 
  userBudgets, 
  userSavings, 
  shoppingListItems,
  trackedItems,
  videoGoals,
  type User, 
  type InsertUser,
  type UpsertUser,
  type EconomicData,
  type InsertEconomicData,
  type PriceData,
  type InsertPriceData,
  type UserBudget,
  type InsertUserBudget,
  type UserSavings,
  type InsertUserSavings,
  type ShoppingListItem,
  type InsertShoppingListItem,
  type VideoGoal,
  type InsertVideoGoal
} from "@shared/schema";

export type TrackedItem = typeof trackedItems.$inferSelect;
export type InsertTrackedItem = typeof trackedItems.$inferInsert;
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods (Replit Auth compatible)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Economic data methods
  getEconomicData(): Promise<EconomicData | undefined>;
  updateEconomicData(data: InsertEconomicData): Promise<EconomicData>;
  
  // Price data methods
  getAllPriceData(): Promise<PriceData[]>;
  getPriceDataByItem(itemName: string): Promise<PriceData | undefined>;
  updatePriceData(data: InsertPriceData): Promise<PriceData>;
  
  // Budget methods
  getUserBudgets(userId: string, month: string): Promise<UserBudget[]>;
  updateUserBudget(budget: InsertUserBudget): Promise<UserBudget>;
  
  // Savings methods
  getUserSavings(userId: string, weekOf: string): Promise<UserSavings | undefined>;
  updateUserSavings(savings: InsertUserSavings): Promise<UserSavings>;
  
  // Shopping list methods
  getShoppingListItems(userId: string): Promise<ShoppingListItem[]>;
  addShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem>;
  updateShoppingListItem(id: number, updates: Partial<ShoppingListItem>): Promise<ShoppingListItem>;
  deleteShoppingListItem(id: number): Promise<void>;
  
  // Tracked items methods
  getTrackedItems(userId: string): Promise<TrackedItem[]>;
  addTrackedItem(item: InsertTrackedItem): Promise<TrackedItem>;
  updateTrackedItem(id: number, updates: Partial<TrackedItem>): Promise<TrackedItem>;
  deleteTrackedItem(id: number): Promise<void>;

  // Video Goals methods
  getVideoGoals(userId: string): Promise<VideoGoal[]>;
  addVideoGoal(goal: InsertVideoGoal): Promise<VideoGoal>;
  updateVideoGoal(id: number, updates: Partial<VideoGoal>): Promise<VideoGoal>;
  deleteVideoGoal(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getEconomicData(): Promise<EconomicData | undefined> {
    const [data] = await db.select().from(economicData).limit(1);
    return data || undefined;
  }

  async updateEconomicData(data: InsertEconomicData): Promise<EconomicData> {
    const existing = await this.getEconomicData();
    if (existing) {
      const [updated] = await db
        .update(economicData)
        .set(data)
        .where(eq(economicData.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(economicData)
        .values(data)
        .returning();
      return created;
    }
  }

  async getAllPriceData(): Promise<PriceData[]> {
    return await db.select().from(priceData);
  }

  async getPriceDataByItem(itemName: string): Promise<PriceData | undefined> {
    const [item] = await db.select().from(priceData).where(eq(priceData.itemName, itemName));
    return item || undefined;
  }

  async updatePriceData(data: InsertPriceData): Promise<PriceData> {
    const existing = await this.getPriceDataByItem(data.itemName);
    if (existing) {
      const [updated] = await db
        .update(priceData)
        .set(data)
        .where(eq(priceData.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(priceData)
        .values(data)
        .returning();
      return created;
    }
  }

  async getUserBudgets(userId: string, month: string): Promise<UserBudget[]> {
    return await db
      .select()
      .from(userBudgets)
      .where(and(eq(userBudgets.userId, userId), eq(userBudgets.month, month)));
  }

  async updateUserBudget(budget: InsertUserBudget): Promise<UserBudget> {
    const existing = await db
      .select()
      .from(userBudgets)
      .where(
        and(
          eq(userBudgets.userId, budget.userId),
          eq(userBudgets.category, budget.category),
          eq(userBudgets.month, budget.month)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userBudgets)
        .set(budget)
        .where(eq(userBudgets.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userBudgets)
        .values(budget)
        .returning();
      return created;
    }
  }

  async getUserSavings(userId: string, weekOf: string): Promise<UserSavings | undefined> {
    const [savings] = await db
      .select()
      .from(userSavings)
      .where(and(eq(userSavings.userId, userId), eq(userSavings.weekOf, weekOf)));
    return savings || undefined;
  }

  async updateUserSavings(savings: InsertUserSavings): Promise<UserSavings> {
    const existing = await this.getUserSavings(savings.userId, savings.weekOf);
    if (existing) {
      const [updated] = await db
        .update(userSavings)
        .set(savings)
        .where(eq(userSavings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userSavings)
        .values(savings)
        .returning();
      return created;
    }
  }

  async getShoppingListItems(userId: string): Promise<ShoppingListItem[]> {
    return await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.userId, userId));
  }

  async addShoppingListItem(item: InsertShoppingListItem): Promise<ShoppingListItem> {
    const [created] = await db
      .insert(shoppingListItems)
      .values(item)
      .returning();
    return created;
  }

  async updateShoppingListItem(id: number, updates: Partial<ShoppingListItem>): Promise<ShoppingListItem> {
    const [updated] = await db
      .update(shoppingListItems)
      .set(updates)
      .where(eq(shoppingListItems.id, id))
      .returning();
    
    if (!updated) {
      throw new Error(`Shopping list item with id ${id} not found`);
    }
    
    return updated;
  }

  async deleteShoppingListItem(id: number): Promise<void> {
    await db.delete(shoppingListItems).where(eq(shoppingListItems.id, id));
  }

  // Tracked Items Methods
  async getTrackedItems(userId: string): Promise<TrackedItem[]> {
    return await db.select().from(trackedItems).where(eq(trackedItems.userId, userId));
  }

  async addTrackedItem(item: InsertTrackedItem): Promise<TrackedItem> {
    // Check if item already being tracked
    const existing = await db.select().from(trackedItems)
      .where(and(
        eq(trackedItems.userId, item.userId),
        eq(trackedItems.itemName, item.itemName)
      ));
    
    if (existing.length > 0) {
      // Update existing tracked item
      const [updated] = await db.update(trackedItems)
        .set({
          ...item,
          lastUpdated: new Date()
        })
        .where(eq(trackedItems.id, existing[0].id))
        .returning();
      return updated;
    }
    
    // Add new tracked item
    const [newItem] = await db.insert(trackedItems).values(item).returning();
    return newItem;
  }

  async updateTrackedItem(id: number, updates: Partial<TrackedItem>): Promise<TrackedItem> {
    const [updated] = await db.update(trackedItems)
      .set({
        ...updates,
        lastUpdated: new Date()
      })
      .where(eq(trackedItems.id, id))
      .returning();
    return updated;
  }

  async deleteTrackedItem(id: number): Promise<void> {
    await db.delete(trackedItems).where(eq(trackedItems.id, id));
  }

  // Video Goals Methods
  async getVideoGoals(userId: string): Promise<VideoGoal[]> {
    return await db.select().from(videoGoals).where(eq(videoGoals.userId, userId));
  }

  async addVideoGoal(goal: InsertVideoGoal): Promise<VideoGoal> {
    const [newGoal] = await db.insert(videoGoals).values(goal).returning();
    return newGoal;
  }

  async updateVideoGoal(id: number, updates: Partial<VideoGoal>): Promise<VideoGoal> {
    const [updated] = await db.update(videoGoals)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(videoGoals.id, id))
      .returning();
    return updated;
  }

  async deleteVideoGoal(id: number): Promise<void> {
    await db.delete(videoGoals).where(eq(videoGoals.id, id));
  }
}

export const storage = new DatabaseStorage();