import { pgTable, text, serial, integer, real, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  budgetAmount: real("budget_amount").notNull(),
  spentAmount: real("spent_amount").notNull(),
  month: text("month").notNull(), // Format: "2024-07"
});

export const userSavings = pgTable("user_savings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  weeklyTotal: real("weekly_total").notNull(),
  projectedMonthly: real("projected_monthly").notNull(),
  bestPurchases: jsonb("best_purchases").$type<Array<{ item: string; saved: number }>>().notNull(),
  weekOf: text("week_of").notNull(), // Format: "2024-07-15"
});

export const shoppingListItems = pgTable("shopping_list_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  estimatedPrice: real("estimated_price").notNull(),
  averagePrice: real("average_price").notNull(),
  recommendation: text("recommendation").$type<"BUY_NOW" | "CONSIDER" | "WAIT">().notNull(),
  savings: real("savings").notNull(),
  completed: integer("completed").notNull().default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").notNull(),
});

export const trackedItems = pgTable("tracked_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  itemName: text("item_name").notNull(),
  currentPrice: real("current_price").notNull(),
  targetPrice: real("target_price"),
  smartBuyScore: real("smart_buy_score").notNull(),
  recommendedAction: text("recommended_action").notNull(),
  confidence: real("confidence").notNull(),
  priceAlerts: integer("price_alerts").notNull().default(1), // 0 = false, 1 = true
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = typeof users.$inferInsert;

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

export const insertTrackedItemSchema = createInsertSchema(trackedItems).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// Financial Goals and Debt Management Tables
export const financialGoals = pgTable("financial_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  goalType: varchar("goal_type").notNull(), // 'savings', 'debt_payoff', 'emergency_fund', 'investment'
  title: varchar("title").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").default(0),
  targetDate: timestamp("target_date"),
  monthlyContribution: real("monthly_contribution"),
  priority: integer("priority").default(1), // 1-5 scale
  status: varchar("status").default("active"), // 'active', 'completed', 'paused'
  aiRecommendations: jsonb("ai_recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const debtAccounts = pgTable("debt_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountName: varchar("account_name").notNull(),
  debtType: varchar("debt_type").notNull(), // 'credit_card', 'student_loan', 'mortgage', 'personal_loan'
  currentBalance: real("current_balance").notNull(),
  minimumPayment: real("minimum_payment"),
  interestRate: real("interest_rate"),
  payoffStrategy: varchar("payoff_strategy"), // 'avalanche', 'snowball', 'custom'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Scenario Planning and What-If Analysis
export const budgetScenarios = pgTable("budget_scenarios", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  scenarioName: varchar("scenario_name").notNull(),
  scenarioType: varchar("scenario_type").notNull(), // 'pay_raise', 'job_loss', 'major_purchase', 'life_event'
  baselineIncome: real("baseline_income"),
  adjustedIncome: real("adjusted_income"),
  additionalExpenses: jsonb("additional_expenses"), // JSON of expense adjustments
  scenarioData: jsonb("scenario_data"), // Flexible scenario parameters
  projectedOutcome: jsonb("projected_outcome"), // AI-generated analysis
  createdAt: timestamp("created_at").defaultNow(),
  isActive: integer("is_active").default(0), // 0 = false, 1 = true
});

// Enhanced Alert and Notification System
export const userAlerts = pgTable("user_alerts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  alertType: varchar("alert_type").notNull(), // 'price_alert', 'goal_milestone', 'budget_threshold', 'debt_progress'
  title: varchar("title").notNull(),
  message: text("message"),
  triggerCondition: jsonb("trigger_condition"), // Flexible trigger parameters
  isActive: integer("is_active").default(1), // 0 = false, 1 = true
  lastTriggered: timestamp("last_triggered"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  alertId: integer("alert_id").references(() => userAlerts.id),
  title: varchar("title").notNull(),
  message: text("message"),
  notificationType: varchar("notification_type"), // 'success', 'warning', 'info', 'urgent'
  isRead: integer("is_read").default(0), // 0 = false, 1 = true
  actionUrl: varchar("action_url"), // Optional link to relevant section
  createdAt: timestamp("created_at").defaultNow(),
});

// Account Integration Preparation (for Plaid/Banking APIs)
export const connectedAccounts = pgTable("connected_accounts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull(), // External account ID
  institutionName: varchar("institution_name"),
  accountType: varchar("account_type"), // 'checking', 'savings', 'credit_card', 'investment'
  accountName: varchar("account_name"),
  lastSyncAt: timestamp("last_sync_at"),
  isActive: integer("is_active").default(1), // 0 = false, 1 = true
  encryptedAccessToken: text("encrypted_access_token"), // Encrypted storage
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: integer("account_id").references(() => connectedAccounts.id),
  transactionId: varchar("transaction_id"), // External transaction ID
  amount: real("amount").notNull(),
  description: varchar("description"),
  category: varchar("category"),
  subcategory: varchar("subcategory"),
  merchantName: varchar("merchant_name"),
  transactionDate: timestamp("transaction_date"),
  isPending: integer("is_pending").default(0), // 0 = false, 1 = true
  aiCategorized: integer("ai_categorized").default(0), // 0 = false, 1 = true
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for new tables
export type FinancialGoal = typeof financialGoals.$inferSelect;
export type InsertFinancialGoal = typeof financialGoals.$inferInsert;
export type DebtAccount = typeof debtAccounts.$inferSelect;
export type InsertDebtAccount = typeof debtAccounts.$inferInsert;
export type BudgetScenario = typeof budgetScenarios.$inferSelect;
export type InsertBudgetScenario = typeof budgetScenarios.$inferInsert;
export type UserAlert = typeof userAlerts.$inferSelect;
export type InsertUserAlert = typeof userAlerts.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

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
