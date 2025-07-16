import { db } from "./db";
import { economicData, priceData, userBudgets, userSavings } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Seed economic data
    await db.insert(economicData).values({
      inflationRate: 3.7,
      gdpGrowth: 2.4,
      consumerPriceIndex: 298.2,
      lastUpdated: new Date()
    }).onConflictDoNothing();

    // Seed price data
    const items = [
      {
        itemName: "Eggs",
        currentPrice: 2.89,
        averagePrice30Day: 3.52,
        priceRange: { min: 2.49, max: 3.99 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -18,
        emoji: "🥚",
        description: "Grade A Large",
        lastUpdated: new Date()
      },
      {
        itemName: "Gas",
        currentPrice: 3.42,
        averagePrice30Day: 3.71,
        priceRange: { min: 3.15, max: 4.25 },
        recommendation: "CONSIDER" as const,
        percentageChange: -8,
        emoji: "⛽",
        description: "Regular Unleaded",
        lastUpdated: new Date()
      },
      {
        itemName: "Milk",
        currentPrice: 4.29,
        averagePrice30Day: 3.83,
        priceRange: { min: 3.49, max: 4.99 },
        recommendation: "WAIT" as const,
        percentageChange: 12,
        emoji: "🥛",
        description: "Whole Milk (Gallon)",
        lastUpdated: new Date()
      },
      {
        itemName: "Bread",
        currentPrice: 1.89,
        averagePrice30Day: 2.25,
        priceRange: { min: 1.69, max: 2.89 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -16,
        emoji: "🍞",
        description: "White Sandwich Loaf",
        lastUpdated: new Date()
      },
      {
        itemName: "Ground Beef",
        currentPrice: 6.79,
        averagePrice30Day: 5.92,
        priceRange: { min: 5.49, max: 7.99 },
        recommendation: "WAIT" as const,
        percentageChange: 15,
        emoji: "🥩",
        description: "80/20 Ground Chuck (lb)",
        lastUpdated: new Date()
      },
      {
        itemName: "Chicken Breast",
        currentPrice: 3.89,
        averagePrice30Day: 4.25,
        priceRange: { min: 3.49, max: 5.99 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -8,
        emoji: "🐔",
        description: "Boneless Skinless (lb)",
        lastUpdated: new Date()
      }
    ];

    for (const item of items) {
      await db.insert(priceData).values(item).onConflictDoNothing();
    }

    // Seed budget data (assuming userId 1)
    const budgetData = [
      { userId: 1, category: "Groceries", budgetAmount: 400, spentAmount: 287, month: "2025-07" },
      { userId: 1, category: "Gas", budgetAmount: 150, spentAmount: 98, month: "2025-07" },
      { userId: 1, category: "Dining Out", budgetAmount: 200, spentAmount: 134, month: "2025-07" },
      { userId: 1, category: "Entertainment", budgetAmount: 100, spentAmount: 67, month: "2025-07" }
    ];

    for (const budget of budgetData) {
      await db.insert(userBudgets).values(budget).onConflictDoNothing();
    }

    // Seed savings data
    const currentWeek = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    await db.insert(userSavings).values({
      userId: 1,
      weeklyTotal: 23.47,
      projectedMonthly: 94.32,
      bestPurchases: [
        { item: "Eggs", saved: 8.20 },
        { item: "Bread", saved: 6.15 },
        { item: "Gas", saved: 9.12 }
      ],
      weekOf: currentWeek
    }).onConflictDoNothing();

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();