import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const economicData = pgTable("economic_data", {
  id: serial("id").primaryKey(),
  inflationRate: real("inflation_rate").notNull(),
  gdpGrowth: real("gdp_growth").notNull(),
  consumerPriceIndex: real("consumer_price_index").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
});

export const priceData = pgTable("price_data", {
  id: serial("id").primaryKey(),
  itemName: text("item_name").notNull(),
  currentPrice: real("current_price").notNull(),
  averagePrice30Day: real("average_price_30_day").notNull(),
  priceRange: jsonb("price_range").$type<{ min: number; max: number }>().notNull(),
  recommendation: text("recommendation").$type<"BUY_NOW" | "CONSIDER" | "WAIT">().notNull(),
  percentageChange: real("percentage_change").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description").notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
});

export const userBudgets = pgTable("user_budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(),
  budgetAmount: real("budget_amount").notNull(),
  spentAmount: real("spent_amount").notNull(),
  month: text("month").notNull(), // Format: "2024-07"
});

export const userSavings = pgTable("user_savings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  weeklyTotal: real("weekly_total").notNull(),
  projectedMonthly: real("projected_monthly").notNull(),
  bestPurchases: jsonb("best_purchases").$type<Array<{ item: string; saved: number }>>().notNull(),
  weekOf: text("week_of").notNull(), // Format: "2024-07-15"
});

export const shoppingListItems = pgTable("shopping_list_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  estimatedPrice: real("estimated_price").notNull(),
  averagePrice: real("average_price").notNull(),
  recommendation: text("recommendation").$type<"BUY_NOW" | "CONSIDER" | "WAIT">().notNull(),
  savings: real("savings").notNull(),
  completed: integer("completed").notNull().default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEconomicDataSchema = createInsertSchema(economicData).omit({
  id: true,
});

export const insertPriceDataSchema = createInsertSchema(priceData).omit({
  id: true,
});

export const insertUserBudgetSchema = createInsertSchema(userBudgets).omit({
  id: true,
});

export const insertUserSavingsSchema = createInsertSchema(userSavings).omit({
  id: true,
});

export const insertShoppingListItemSchema = createInsertSchema(shoppingListItems).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EconomicData = typeof economicData.$inferSelect;
export type InsertEconomicData = z.infer<typeof insertEconomicDataSchema>;

export type PriceData = typeof priceData.$inferSelect;
export type InsertPriceData = z.infer<typeof insertPriceDataSchema>;

export type UserBudget = typeof userBudgets.$inferSelect;
export type InsertUserBudget = z.infer<typeof insertUserBudgetSchema>;

export type UserSavings = typeof userSavings.$inferSelect;
export type InsertUserSavings = z.infer<typeof insertUserSavingsSchema>;

export type ShoppingListItem = typeof shoppingListItems.$inferSelect;
export type InsertShoppingListItem = z.infer<typeof insertShoppingListItemSchema>;
