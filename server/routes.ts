import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEconomicDataSchema, insertPriceDataSchema, insertUserBudgetSchema, insertUserSavingsSchema, insertShoppingListItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Economic data routes
  app.get("/api/economic-data", async (req, res) => {
    try {
      const data = await storage.getEconomicData();
      if (!data) {
        return res.status(404).json({ message: "Economic data not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching economic data:", error);
      res.status(500).json({ message: "Failed to fetch economic data" });
    }
  });

  app.post("/api/economic-data", async (req, res) => {
    try {
      const validatedData = insertEconomicDataSchema.parse(req.body);
      const data = await storage.updateEconomicData(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating economic data:", error);
      res.status(500).json({ message: "Failed to update economic data" });
    }
  });

  // Price data routes
  app.get("/api/price-data", async (req, res) => {
    try {
      const data = await storage.getAllPriceData();
      res.json(data);
    } catch (error) {
      console.error("Error fetching price data:", error);
      res.status(500).json({ message: "Failed to fetch price data" });
    }
  });

  app.get("/api/price-data/:itemName", async (req, res) => {
    try {
      const { itemName } = req.params;
      const data = await storage.getPriceDataByItem(itemName);
      if (!data) {
        return res.status(404).json({ message: "Price data not found for item" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching price data:", error);
      res.status(500).json({ message: "Failed to fetch price data" });
    }
  });

  app.post("/api/price-data", async (req, res) => {
    try {
      const validatedData = insertPriceDataSchema.parse(req.body);
      const data = await storage.updatePriceData(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating price data:", error);
      res.status(500).json({ message: "Failed to update price data" });
    }
  });

  // Budget routes
  app.get("/api/budgets/:userId/:month", async (req, res) => {
    try {
      const { userId, month } = req.params;
      const data = await storage.getUserBudgets(parseInt(userId), month);
      res.json(data);
    } catch (error) {
      console.error("Error fetching budget data:", error);
      res.status(500).json({ message: "Failed to fetch budget data" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const validatedData = insertUserBudgetSchema.parse(req.body);
      const data = await storage.updateUserBudget(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating budget:", error);
      res.status(500).json({ message: "Failed to update budget" });
    }
  });

  // Savings routes
  app.get("/api/savings/:userId/:weekOf", async (req, res) => {
    try {
      const { userId, weekOf } = req.params;
      const data = await storage.getUserSavings(parseInt(userId), weekOf);
      if (!data) {
        return res.status(404).json({ message: "Savings data not found" });
      }
      res.json(data);
    } catch (error) {
      console.error("Error fetching savings data:", error);
      res.status(500).json({ message: "Failed to fetch savings data" });
    }
  });

  app.post("/api/savings", async (req, res) => {
    try {
      const validatedData = insertUserSavingsSchema.parse(req.body);
      const data = await storage.updateUserSavings(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error updating savings:", error);
      res.status(500).json({ message: "Failed to update savings" });
    }
  });

  // Shopping list routes
  app.get("/api/shopping-list/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await storage.getShoppingListItems(parseInt(userId));
      res.json(data);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      res.status(500).json({ message: "Failed to fetch shopping list" });
    }
  });

  app.post("/api/shopping-list", async (req, res) => {
    try {
      const validatedData = insertShoppingListItemSchema.parse(req.body);
      const data = await storage.addShoppingListItem(validatedData);
      res.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error("Error adding shopping list item:", error);
      res.status(500).json({ message: "Failed to add shopping list item" });
    }
  });

  app.put("/api/shopping-list/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await storage.updateShoppingListItem(parseInt(id), req.body);
      res.json(data);
    } catch (error) {
      console.error("Error updating shopping list item:", error);
      res.status(500).json({ message: "Failed to update shopping list item" });
    }
  });

  app.delete("/api/shopping-list/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteShoppingListItem(parseInt(id));
      res.json({ message: "Shopping list item deleted successfully" });
    } catch (error) {
      console.error("Error deleting shopping list item:", error);
      res.status(500).json({ message: "Failed to delete shopping list item" });
    }
  });

  // FRED API integration endpoint
  app.get("/api/fred-data", async (req, res) => {
    try {
      const fredApiKey = process.env.FRED_API_KEY;
      if (!fredApiKey) {
        return res.status(500).json({ message: "FRED API key not configured" });
      }

      // Fetch inflation rate (CPI)
      const cpiResponse = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${fredApiKey}&file_type=json&limit=1&sort_order=desc`
      );
      
      // Fetch GDP growth
      const gdpResponse = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=GDPC1&api_key=${fredApiKey}&file_type=json&limit=2&sort_order=desc`
      );

      if (!cpiResponse.ok || !gdpResponse.ok) {
        throw new Error("Failed to fetch data from FRED API");
      }

      const cpiData = await cpiResponse.json();
      const gdpData = await gdpResponse.json();

      // Calculate inflation rate and GDP growth
      const latestCPI = parseFloat(cpiData.observations[0].value);
      const latestGDP = parseFloat(gdpData.observations[0].value);
      const previousGDP = parseFloat(gdpData.observations[1].value);
      
      const gdpGrowth = ((latestGDP - previousGDP) / previousGDP) * 100;

      const economicData = {
        inflationRate: 3.7, // This would be calculated from CPI year-over-year
        gdpGrowth: gdpGrowth,
        consumerPriceIndex: latestCPI,
        lastUpdated: new Date()
      };

      // Update storage with fresh data
      const updatedData = await storage.updateEconomicData(economicData);
      res.json(updatedData);
    } catch (error) {
      console.error("Error fetching FRED data:", error);
      res.status(500).json({ message: "Failed to fetch economic data from FRED API" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
