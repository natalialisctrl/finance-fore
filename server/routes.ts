import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEconomicDataSchema, insertPriceDataSchema, insertUserBudgetSchema, insertUserSavingsSchema, insertShoppingListItemSchema, insertTrackedItemSchema, insertVideoGoalSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getAIPricePrediction, getBatchAIPredictions, type AIAnalysisInput } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Demo login for testing
  app.post('/api/demo-login', async (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'natalia' && password === '1234') {
      // Create or get demo user
      const demoUser = {
        id: 'demo-natalia',
        email: 'natalia@demo.com',
        firstName: 'Natalia',
        lastName: 'Demo',
        profileImageUrl: null,
      };
      
      try {
        const user = await storage.upsertUser(demoUser);
        
        // Set demo session flag
        (req.session as any).demoUserId = 'demo-natalia';
        (req.session as any).demoLoginTime = Date.now();
        
        console.log("Demo session created for:", user.id);
        res.json({ success: true, user });
      } catch (error) {
        console.error("Demo login error:", error);
        res.status(500).json({ message: "Demo login failed" });
      }
    } else {
      res.status(401).json({ message: "Invalid demo credentials" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo auth user endpoint (check demo session)
  app.get('/api/demo-auth/user', async (req, res) => {
    try {
      const demoUserId = (req.session as any)?.demoUserId;
      const demoLoginTime = (req.session as any)?.demoLoginTime;
      
      console.log("Demo auth check - UserId:", demoUserId, "LoginTime:", demoLoginTime);
      
      if (demoUserId === 'demo-natalia' && demoLoginTime && (Date.now() - demoLoginTime < 24 * 60 * 60 * 1000)) {
        const user = await storage.getUser('demo-natalia');
        if (user) {
          console.log("Demo user authenticated successfully");
          res.json(user);
          return;
        }
      }
      
      console.log("Demo authentication failed");
      res.status(401).json({ message: "No demo session" });
    } catch (error) {
      console.error("Demo auth error:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Economic data routes
  app.get("/api/economic-data", async (req, res) => {
    try {
      let data = await storage.getEconomicData();
      
      // Check if data is stale (older than 1 hour) or doesn't exist
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      if (!data || new Date(data.lastUpdated) < oneHourAgo) {
        // Import the economic data service
        const { economicDataService } = await import('./economic-api');
        data = await economicDataService.fetchRealEconomicData();
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching economic data:", error);
      res.status(500).json({ message: "Failed to fetch economic data" });
    }
  });

  // Endpoint to force refresh economic data
  app.post("/api/economic-data/refresh", async (req, res) => {
    try {
      const { economicDataService } = await import('./economic-api');
      const data = await economicDataService.fetchRealEconomicData();
      res.json(data);
    } catch (error) {
      console.error("Error refreshing economic data:", error);
      res.status(500).json({ message: "Failed to refresh economic data" });
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
      const data = await storage.getUserBudgets(userId, month);
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
      const data = await storage.getUserSavings(userId, weekOf);
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
      const data = await storage.getShoppingListItems(userId);
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

  // Fast price predictions endpoint using algorithmic predictions
  app.post("/api/price-predictions", async (req, res) => {
    try {
      const { priceData, economicData, userPreferences } = req.body;

      if (!priceData || !economicData) {
        return res.status(400).json({ message: "Missing required data" });
      }

      // Use fast algorithmic predictions
      const predictions = priceData.map((item: any) => {
        // Calculate price prediction based on economic indicators
        const inflationImpact = (economicData.inflationRate / 100) * 0.3;
        const gdpImpact = (economicData.gdpGrowth / 100) * 0.2;
        const seasonalFactor = getSeasonalFactor(item.itemName, new Date().getMonth());
        
        const baseChange = inflationImpact + gdpImpact + seasonalFactor;
        const predictedPrice = item.currentPrice * (1 + baseChange);
        
        // Calculate Smart Buy Score (1-10)
        const priceChange = (predictedPrice - item.currentPrice) / item.currentPrice;
        let smartBuyScore;
        if (priceChange > 0.05) smartBuyScore = Math.max(1, 4 - priceChange * 20);
        else if (priceChange < -0.03) smartBuyScore = Math.min(10, 8 + Math.abs(priceChange) * 15);
        else smartBuyScore = 5 + Math.random() * 2;
        
        smartBuyScore = Math.round(smartBuyScore * 10) / 10;
        
        // Determine recommended action
        let recommendedAction;
        if (smartBuyScore >= 8) recommendedAction = "BUY_NOW";
        else if (smartBuyScore <= 4) recommendedAction = "WAIT_2_WEEKS";
        else if (smartBuyScore <= 5.5) recommendedAction = "WAIT_1_WEEK";
        else recommendedAction = "MONITOR";
        
        const confidence = 0.75 + Math.random() * 0.15; // 75-90% confidence
        
        return {
          itemName: item.itemName,
          currentPrice: item.currentPrice,
          predicted30DayPrice: Math.round(predictedPrice * 100) / 100,
          priceDirection: predictedPrice > item.currentPrice ? "up" : "down",
          confidence: Math.round(confidence * 100) / 100,
          smartBuyScore,
          predictionFactors: {
            economicTrends: 0.8,
            seasonality: seasonalFactor + 0.5,
            historicalPatterns: 0.7,
            supplyDemand: 0.6
          },
          recommendedAction,
          expectedSavings: (() => {
            // Calculate potential savings based on price direction and timing
            if (recommendedAction === "BUY_NOW" && predictedPrice > item.currentPrice) {
              // Good deal now - savings from avoiding future price increase
              return Math.round((predictedPrice - item.currentPrice) * 100) / 100;
            } else if (recommendedAction.includes("WAIT") && predictedPrice < item.currentPrice) {
              // Wait for better price - savings from price decrease
              return Math.round((item.currentPrice - predictedPrice) * 100) / 100;
            } else {
              // Generate reasonable savings based on smart buy score for demonstration
              const baseSavings = item.currentPrice * 0.05; // 5% base potential
              const scoreMultiplier = smartBuyScore >= 8 ? 1.5 : smartBuyScore <= 4 ? 0.8 : 1.0;
              return Math.round(baseSavings * scoreMultiplier * 100) / 100;
            }
          })()
        };
      });

      res.json(predictions);
    } catch (error) {
      console.error("Price predictions error:", error);
      res.status(500).json({ message: "Price prediction service failed" });
    }
  });

  // Helper function for seasonal factors
  function getSeasonalFactor(itemName: string, month: number): number {
    const seasonalPatterns: Record<string, number[]> = {
      "Eggs": [0.02, 0.01, -0.01, -0.02, -0.03, -0.03, -0.02, -0.01, 0.01, 0.03, 0.04, 0.03],
      "Gas": [-0.06, -0.06, -0.05, -0.04, -0.02, 0.04, 0.04, 0.03, 0.02, -0.04, -0.05, -0.06],
      "Milk": [0, 0, 0, 0, 0, 0, 0.01, 0.01, 0, 0, 0, 0],
      "Bread": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "Ground Beef": [0.01, 0.01, 0, -0.01, 0.02, 0.03, 0.04, 0.03, 0.01, 0, 0.02, 0.03],
      "Rice": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    
    return seasonalPatterns[itemName]?.[month] || 0;
  }

  // Helper function to categorize items
  function getCategoryFromItemName(itemName: string): string {
    const categories: Record<string, string> = {
      "Eggs": "Dairy & Eggs",
      "Milk": "Dairy & Eggs", 
      "Bread": "Bakery",
      "Gas": "Energy",
      "Ground Beef": "Meat",
      "Rice": "Grains"
    };
    return categories[itemName] || "General";
  }

  // Gas price prediction endpoint
  app.post("/api/gas-predictions", async (req, res) => {
    try {
      const { location } = req.body;
      if (!location) {
        return res.status(400).json({ message: "Location data required" });
      }

      // Get current economic data
      const economicData = await storage.getEconomicData();
      if (!economicData) {
        return res.status(500).json({ message: "Economic data not available" });
      }

      // Transform economic data to match gas predictor interface
      const economicIndicators = {
        inflationRate: economicData.inflationRate || 3.2,
        gdpGrowth: economicData.gdpGrowth || 2.8,
        consumerPriceIndex: economicData.consumerPriceIndex || 309.7,
        unemploymentRate: economicData.unemploymentRate || 3.8,
        oilPrices: economicData.oilPrices || 75.0,
        dollarStrength: economicData.dollarStrength || 102.0
      };

      // Import gas price predictor
      const { gasPricePredictor } = await import('./gas-price-predictor');
      const prediction = await gasPricePredictor.predictGasPrices(location, economicIndicators);
      
      res.json(prediction);
    } catch (error) {
      console.error("Gas prediction error:", error);
      res.status(500).json({ message: "Gas prediction service failed" });
    }
  });

  // Tracked Items endpoints
  app.get("/api/tracked-items/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const trackedItems = await storage.getTrackedItems(userId);
      res.json(trackedItems);
    } catch (error) {
      console.error("Error fetching tracked items:", error);
      res.status(500).json({ message: "Failed to fetch tracked items" });
    }
  });

  app.post("/api/tracked-items", async (req, res) => {
    try {
      const parsed = insertTrackedItemSchema.parse(req.body);
      const trackedItem = await storage.addTrackedItem(parsed);
      res.json(trackedItem);
    } catch (error) {
      console.error("Error adding tracked item:", error);
      res.status(400).json({ message: error.message || "Failed to add tracked item" });
    }
  });

  app.delete("/api/tracked-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTrackedItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tracked item:", error);
      res.status(500).json({ message: "Failed to delete tracked item" });
    }
  });

  // Video Goals Routes
  app.get("/api/video-goals/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const goals = await storage.getVideoGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching video goals:", error);
      res.status(500).json({ message: "Failed to fetch video goals" });
    }
  });

  app.post("/api/video-goals", async (req, res) => {
    try {
      const parsed = insertVideoGoalSchema.parse(req.body);
      const goal = await storage.addVideoGoal(parsed);
      res.json(goal);
    } catch (error) {
      console.error("Error creating video goal:", error);
      res.status(400).json({ message: error.message || "Failed to create video goal" });
    }
  });

  app.put("/api/video-goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.updateVideoGoal(id, req.body);
      res.json(goal);
    } catch (error) {
      console.error("Error updating video goal:", error);
      res.status(500).json({ message: "Failed to update video goal" });
    }
  });

  app.delete("/api/video-goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteVideoGoal(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting video goal:", error);
      res.status(500).json({ message: "Failed to delete video goal" });
    }
  });

  // AI Budget Redistribution Route
  app.post("/api/budget-redistribution", async (req, res) => {
    try {
      const { budgetRedistributor } = await import("./ai-budget-redistribution");
      const scenarioInput = req.body;
      
      const redistributionResult = await budgetRedistributor.redistributeBudget(scenarioInput);
      res.json(redistributionResult);
    } catch (error) {
      console.error("Error redistributing budget:", error);
      res.status(500).json({ message: "Failed to redistribute budget" });
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
