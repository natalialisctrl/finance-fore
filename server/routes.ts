import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEconomicDataSchema, insertPriceDataSchema, insertUserBudgetSchema, insertUserSavingsSchema, insertShoppingListItemSchema, insertTrackedItemSchema, insertVideoGoalSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { getAIPricePrediction, getBatchAIPredictions, type AIAnalysisInput } from "./ai-service";
import { PlaidService } from "./plaid-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  const buildVideoSegments = (targetAmount: number, descriptions: string[]) => {
    const segmentThreshold = targetAmount / 5;
    return descriptions.map((description, index) => ({
      segmentNumber: index + 1,
      unlockThreshold: segmentThreshold * (index + 1),
      description,
      isUnlocked: false,
    }));
  };

  const seedDemoVideoGoals = async (userId: string) => {
    if (userId !== "demo-natalia") return;

    const existing = await storage.getVideoGoals(userId);
    if (existing.length > 0) return;

    await storage.addVideoGoal({
      userId,
      goalTitle: "Tesla Model 3 Dream Car",
      goalDescription: "A literal AI-style scene of the car being revealed, detailed, driven, and delivered as the goal gets funded.",
      goalType: "car",
      targetAmount: 35000,
      currentAmount: 8750,
      videoUrl: null,
      videoSegments: buildVideoSegments(35000, [
        "Garage lights reveal the car",
        "Headlights and silhouette appear",
        "Interior and wheels render in",
        "Driving lifestyle shot unlocks",
        "Keys and full delivery scene",
      ]),
      unlockedSegments: 1,
    });

    await storage.addVideoGoal({
      userId,
      goalTitle: "First Home Down Payment",
      goalDescription: "A progressive home scene that unlocks the street view, front door, interior, lived-in moments, and final move-in.",
      goalType: "house",
      targetAmount: 60000,
      currentAmount: 24000,
      videoUrl: null,
      videoSegments: buildVideoSegments(60000, [
        "Street view opens",
        "Front door and windows appear",
        "Interior rooms light up",
        "Life inside the home unlocks",
        "Full move-in scene",
      ]),
      unlockedSegments: 2,
    });
  };

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
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      if (!data || new Date(data.lastUpdated) < fiveMinutesAgo) {
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
      const existingData = await storage.getEconomicData();
      if (existingData) {
        return res.json({
          ...existingData,
          dataSource: `${existingData.dataSource}; refresh service error, showing latest stored values`
        });
      }
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
  async function ensureStarterPriceData() {
    const existing = await storage.getAllPriceData();
    const economic = await storage.getEconomicData();
    const oilPrice = economic?.oilPrices && Number.isFinite(economic.oilPrices) ? economic.oilPrices : 75.5;
    const existingNames = new Set(existing.map((item) => item.itemName));
    const essentials = [
      {
        itemName: "Gas",
        currentPrice: 3.45,
        averagePrice30Day: 3.52,
        priceRange: { min: 3.19, max: 3.89 },
        recommendation: "CONSIDER" as const,
        percentageChange: -2.0,
        emoji: "⛽",
        description: "National regular gasoline benchmark influenced by WTI crude, refining margins, and seasonal demand",
        lastUpdated: new Date()
      },
      {
        itemName: "Eggs",
        currentPrice: 3.18,
        averagePrice30Day: 3.31,
        priceRange: { min: 2.89, max: 4.29 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -3.9,
        emoji: "🥚",
        description: "Dozen large eggs; volatility tied to feed costs, flock health, and CPI food-at-home trends",
        lastUpdated: new Date()
      },
      {
        itemName: "Chicken Breast",
        currentPrice: 4.29,
        averagePrice30Day: 4.18,
        priceRange: { min: 3.79, max: 5.19 },
        recommendation: "CONSIDER" as const,
        percentageChange: 2.6,
        emoji: "🍗",
        description: "Boneless chicken breast per pound; sensitive to feed, energy, and grocery demand",
        lastUpdated: new Date()
      },
      {
        itemName: "WTI Crude Oil",
        currentPrice: oilPrice,
        averagePrice30Day: Math.round(oilPrice * 0.98 * 100) / 100,
        priceRange: { min: Math.round(oilPrice * 0.9 * 100) / 100, max: Math.round(oilPrice * 1.12 * 100) / 100 },
        recommendation: "CONSIDER" as const,
        percentageChange: 2.0,
        emoji: "🛢️",
        description: "Live WTI crude benchmark from public market data; included because oil drives gas, shipping, and food costs",
        lastUpdated: new Date()
      },
      {
        itemName: "Milk",
        currentPrice: 4.04,
        averagePrice30Day: 4.08,
        priceRange: { min: 3.69, max: 4.59 },
        recommendation: "CONSIDER" as const,
        percentageChange: -1.0,
        emoji: "🥛",
        description: "Gallon of whole milk; usually steadier but affected by transport and dairy supply costs",
        lastUpdated: new Date()
      },
      {
        itemName: "Bread",
        currentPrice: 2.02,
        averagePrice30Day: 2.08,
        priceRange: { min: 1.79, max: 2.49 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -2.9,
        emoji: "🍞",
        description: "White bread loaf; wheat, labor, and delivery costs influence the forecast",
        lastUpdated: new Date()
      },
      {
        itemName: "Ground Beef",
        currentPrice: 5.39,
        averagePrice30Day: 5.22,
        priceRange: { min: 4.69, max: 6.19 },
        recommendation: "WAIT" as const,
        percentageChange: 3.3,
        emoji: "🥩",
        description: "Ground beef per pound; grilling demand and cattle supply create seasonal pressure",
        lastUpdated: new Date()
      },
      {
        itemName: "Rice",
        currentPrice: 1.72,
        averagePrice30Day: 1.78,
        priceRange: { min: 1.49, max: 2.09 },
        recommendation: "BUY_NOW" as const,
        percentageChange: -3.4,
        emoji: "🍚",
        description: "Long-grain white rice per pound; stable pantry staple for budget optimization",
        lastUpdated: new Date()
      }
    ];

    const missingEssentials = essentials.filter((item) => !existingNames.has(item.itemName));
    if (missingEssentials.length > 0) {
      await Promise.all(missingEssentials.map((item) => storage.updatePriceData(item)));
      return await storage.getAllPriceData();
    }

    return existing;
  }

  app.get("/api/price-data", async (req, res) => {
    try {
      const data = await ensureStarterPriceData();
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
      let data = await storage.getUserBudgets(userId, month);
      if (data.length === 0 && userId === "demo-natalia") {
        const starterBudgets = [
          { userId, category: "Groceries", budgetAmount: 520, spentAmount: 338, month },
          { userId, category: "Gas", budgetAmount: 240, spentAmount: 166, month },
          { userId, category: "Utilities", budgetAmount: 310, spentAmount: 244, month },
          { userId, category: "Dining Out", budgetAmount: 260, spentAmount: 178, month },
          { userId, category: "Emergency Fund", budgetAmount: 400, spentAmount: 400, month },
          { userId, category: "Shopping", budgetAmount: 180, spentAmount: 93, month }
        ];

        data = await Promise.all(starterBudgets.map((budget) => storage.updateUserBudget(budget)));
      }
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
        return res.json({
          id: 0,
          userId,
          weeklyTotal: 0,
          projectedMonthly: 0,
          bestPurchases: [],
          weekOf
        });
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

      const itemsForPrediction = Array.isArray(priceData) && priceData.length > 0 ? priceData : await ensureStarterPriceData();

      const aiInputs: AIAnalysisInput[] = itemsForPrediction.map((item: any) => ({
        itemName: item.itemName,
        currentPrice: Number(item.currentPrice),
        historicalPrices: [
          Number(item.priceRange?.min ?? item.currentPrice),
          Number(item.averagePrice30Day ?? item.currentPrice),
          Number(item.priceRange?.max ?? item.currentPrice),
          Number(item.currentPrice)
        ],
        economicIndicators: {
          inflationRate: Number(economicData.inflationRate ?? 2.7),
          gdpGrowth: Number(economicData.gdpGrowth ?? 2.8),
          consumerPriceIndex: Number(economicData.consumerPriceIndex ?? 319.8)
        },
        seasonalData: {
          month: new Date().getMonth(),
          category: getCategoryFromItemName(item.itemName)
        }
      }));

      const aiResults = await getBatchAIPredictions(aiInputs);
      const predictions = aiResults.map((result, index) => {
        const item = itemsForPrediction[index];
        const priceDirection = result.priceDirection === "UP" || result.priceDirection === "DOWN" ? result.priceDirection : "STABLE";
        return {
          itemName: item.itemName,
          currentPrice: Number(item.currentPrice),
          predicted30DayPrice: result.predictedPrice30Day,
          priceDirection,
          confidence: result.confidence,
          smartBuyScore: result.smartBuyScore,
          predictionFactors: {
            economicTrends: Math.min(1, Math.max(0.1, Number(economicData.inflationRate ?? 2.7) / 5)),
            seasonality: Math.min(1, Math.max(0.1, getSeasonalFactor(item.itemName, new Date().getMonth()) + 0.5)),
            historicalPatterns: Number(item.currentPrice) <= Number(item.averagePrice30Day) ? 0.75 : 0.45,
            supplyDemand: item.itemName.includes("Oil") || item.itemName === "Gas" ? 0.8 : 0.62
          },
          recommendedAction: result.recommendedAction,
          expectedSavings: result.expectedSavings,
          reasoning: result.reasoning,
          keyFactors: result.keyFactors,
          riskLevel: result.riskLevel,
          analysisSource: result.analysisSource
        };
      });

      res.json(predictions);
    } catch (error) {
      console.error("Price predictions error:", error);
      const itemsForPrediction = Array.isArray(req.body?.priceData) && req.body.priceData.length > 0 ? req.body.priceData : await ensureStarterPriceData();
      const economicData = req.body?.economicData || {};
      const predictions = itemsForPrediction.map((item: any) => {
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
          priceDirection: predictedPrice > item.currentPrice ? "UP" : "DOWN",
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
          })(),
          reasoning: "Fallback forecast based on inflation, GDP, seasonality, and current-vs-average price",
          keyFactors: ["Inflation trend", "Seasonality", "Current price vs 30-day average", "Supply and demand"],
          riskLevel: confidence > 0.82 ? "LOW" : "MEDIUM",
          analysisSource: "Public-data algorithm"
        };
      });
      res.json(predictions);
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
      "Chicken Breast": [0.01, 0, -0.01, -0.01, 0.01, 0.02, 0.03, 0.02, 0.01, 0, 0.01, 0.02],
      "WTI Crude Oil": [-0.03, -0.02, 0, 0.02, 0.04, 0.05, 0.05, 0.03, 0.01, -0.02, -0.03, -0.03],
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
      "WTI Crude Oil": "Energy",
      "Ground Beef": "Meat",
      "Chicken Breast": "Meat",
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

      let economicData = await storage.getEconomicData();
      if (!economicData) {
        const { economicDataService } = await import('./economic-api');
        economicData = await economicDataService.fetchRealEconomicData();
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
      let trackedItems = await storage.getTrackedItems(userId);
      if (trackedItems.length === 0 && userId === "demo-natalia") {
        const priceItems = await ensureStarterPriceData();
        const coreItems = ["Gas", "Eggs", "Chicken Breast", "WTI Crude Oil"];
        const seededItems = coreItems.map((name) => {
          const item = priceItems.find((priceItem) => priceItem.itemName === name);
          const scoreByItem: Record<string, number> = {
            "Gas": 6.8,
            "Eggs": 8.4,
            "Chicken Breast": 5.9,
            "WTI Crude Oil": 7.2
          };
          const actionByItem: Record<string, string> = {
            "Gas": "MONITOR",
            "Eggs": "BUY_NOW",
            "Chicken Breast": "WAIT_1_WEEK",
            "WTI Crude Oil": "MONITOR"
          };
          return {
            userId,
            itemName: name,
            currentPrice: item?.currentPrice ?? 0,
            targetPrice: item ? Math.round(item.currentPrice * 0.94 * 100) / 100 : undefined,
            smartBuyScore: scoreByItem[name],
            recommendedAction: actionByItem[name],
            confidence: 0.82,
            priceAlerts: 1
          };
        });
        trackedItems = await Promise.all(seededItems.map((item) => storage.addTrackedItem(item)));
      }
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
      await seedDemoVideoGoals(userId);
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

  // Initialize Plaid service
  const plaidService = new PlaidService(storage);

  // Bank integration routes
  app.post("/api/plaid/link-token", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const linkToken = await plaidService.createLinkToken(userId);
      res.json({ link_token: linkToken });
    } catch (error) {
      console.error("Error creating link token:", error);
      res.status(500).json({ message: "Failed to create link token" });
    }
  });

  app.post("/api/plaid/exchange-token", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { public_token, metadata } = req.body;
      
      const result = await plaidService.exchangePublicToken(userId, public_token, metadata);
      res.json(result);
    } catch (error) {
      console.error("Error exchanging token:", error);
      res.status(500).json({ message: "Failed to connect bank account" });
    }
  });

  app.get("/api/bank-accounts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accounts = await storage.getBankAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching bank accounts:", error);
      res.status(500).json({ message: "Failed to fetch bank accounts" });
    }
  });

  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 100;
      const transactions = await storage.getTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/bank-accounts/:id/sync", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accountId = parseInt(req.params.id);
      
      const accounts = await storage.getBankAccounts(userId);
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account) {
        return res.status(404).json({ message: "Bank account not found" });
      }

      const syncResult = await plaidService.syncTransactions(account);
      res.json(syncResult);
    } catch (error) {
      console.error("Error syncing transactions:", error);
      res.status(500).json({ message: "Failed to sync transactions" });
    }
  });

  app.post("/api/plaid/webhook", async (req, res) => {
    try {
      await plaidService.handleWebhook(req.body);
      res.json({ acknowledged: true });
    } catch (error) {
      console.error("Error handling webhook:", error);
      res.status(500).json({ message: "Failed to handle webhook" });
    }
  });

  app.get("/api/bank-sync-logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getBankSyncLogs(userId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching sync logs:", error);
      res.status(500).json({ message: "Failed to fetch sync logs" });
    }
  });

  // ─── IP-based geolocation (no browser permission needed) ───────────────
  // Server-side cache: key = IP, value = { result, expiresAt }
  const geoCache = new Map<string, { result: any; expiresAt: number }>();

  app.get("/api/geolocate", async (req, res) => {
    try {
      // Extract real client IP
      const forwarded = req.headers["x-forwarded-for"];
      const rawIp = Array.isArray(forwarded) ? forwarded[0] : (forwarded?.split(",")[0] ?? req.socket.remoteAddress ?? "");
      const ip = rawIp.trim().replace(/^::ffff:/, "");
      const cacheKey = ip || "auto";

      // Return cached result if still fresh (1 hour)
      const cached = geoCache.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        return res.json(cached.result);
      }

      // Try ip-api.com first (free, 1000 req/min, no key needed)
      let result: any = null;
      try {
        const ipApiUrl = ip && ip !== "127.0.0.1" && ip !== "::1"
          ? `http://ip-api.com/json/${ip}?fields=status,city,regionName,region,countryCode,country,lat,lon,timezone,zip`
          : `http://ip-api.com/json/?fields=status,city,regionName,region,countryCode,country,lat,lon,timezone,zip`;
        const r = await fetch(ipApiUrl, { signal: AbortSignal.timeout(4000) });
        if (r.ok) {
          const d = await r.json() as any;
          if (d.status === "success" && d.city) {
            result = {
              city: d.city,
              state: d.regionName || d.region || "",
              stateCode: d.region || "",
              country: d.country || "United States",
              countryCode: d.countryCode || "US",
              lat: d.lat || 0,
              lng: d.lon || 0,
              timezone: d.timezone || "America/New_York",
              postalCode: d.zip || "",
            };
          }
        }
      } catch { /* fallthrough to ipapi.co */ }

      // Fallback: ipapi.co
      if (!result) {
        const url2 = ip && ip !== "127.0.0.1" && ip !== "::1"
          ? `https://ipapi.co/${ip}/json/`
          : `https://ipapi.co/json/`;
        const r2 = await fetch(url2, {
          headers: { "User-Agent": "Foresee-App/1.0" },
          signal: AbortSignal.timeout(5000),
        });
        if (r2.ok) {
          const d2 = await r2.json() as any;
          if (!d2.error && d2.city) {
            result = {
              city: d2.city,
              state: d2.region || d2.region_code || "",
              stateCode: d2.region_code || "",
              country: d2.country_name || "United States",
              countryCode: d2.country_code || "US",
              lat: d2.latitude || 0,
              lng: d2.longitude || 0,
              timezone: d2.timezone || "America/New_York",
              postalCode: d2.postal || "",
            };
          }
        }
      }

      if (!result) throw new Error("All geo providers failed");

      // Cache for 1 hour
      geoCache.set(cacheKey, { result, expiresAt: Date.now() + 3600_000 });
      res.json(result);
    } catch (err: any) {
      console.error("Geolocate error:", err.message);
      res.status(200).json({ city: null, state: null, error: err.message });
    }
  });

  // ─── AI location-specific financial alerts ──────────────────────────────
  app.post("/api/location-alerts", async (req, res) => {
    try {
      const { city, state, country } = req.body as { city: string; state: string; country?: string };
      if (!city) return res.status(400).json({ message: "city required" });

      // Pull live economic data to ground the AI
      const eco = await storage.getEconomicData();
      const gasRows = await storage.getAllPriceData();
      const gasItem = gasRows.find(p => p.itemName.toLowerCase().includes("gas") || p.itemName.toLowerCase().includes("fuel"));
      const gasPrice = gasItem?.currentPrice ?? 3.45;

      const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const location = `${city}${state ? `, ${state}` : ""}${country && country !== "United States" ? `, ${country}` : ""}`;

      const OpenAI = (await import("openai")).default;
      const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

      if (!openai) {
        // Fallback algorithmic alerts without AI
        return res.json(buildAlgorithmicAlerts(city, state, gasPrice, eco));
      }

      const prompt = `You are a hyper-accurate personal finance intelligence engine. Today is ${today}.

The user is located in ${location}. Generate 4 genuinely specific, financially actionable alerts for this EXACT location right now.

LIVE ECONOMIC DATA:
- CPI Inflation: ${eco?.inflationRate ?? 3.3}%
- GDP Growth: ${eco?.gdpGrowth ?? 2.8}%
- Federal Funds Rate: ${eco?.interestRate ?? 4.33}%
- Unemployment: ${eco?.unemploymentRate ?? 4.3}%
- WTI Oil Price: $${eco?.oilPrices ?? 92.5}/barrel
- Gas (national avg): $${gasPrice.toFixed(2)}/gallon

REQUIREMENTS:
- Each alert must reference REAL, CURRENT conditions specific to ${location} (e.g., local gas prices, local housing market, seasonal weather costs, state-specific taxes or policies)
- Use REAL dollar amounts (e.g., gas prices in California are ~$0.50 higher than national avg due to state taxes)
- Include a specific financial action (e.g., "fill up today, price will rise $0.12 this week")
- Confidence must be honest (not all 95%)
- For gas: adjust for state taxes (CA +$0.68, TX +$0.20, NY +$0.49, FL +$0.28, etc.)

Return ONLY a JSON array, no markdown. Schema:
[{
  "id": "alert-1",
  "type": "gas" | "grocery" | "housing" | "weather" | "economic",
  "severity": "low" | "medium" | "high",
  "title": "short title (6 words max)",
  "message": "2-3 sentence specific factual explanation with dollar amounts",
  "prediction": "concise prediction with specific $ or % number",
  "confidence": 55-92,
  "daysOut": 1-14,
  "actionSuggestion": "specific actionable step with dollar impact",
  "icon": "emoji"
}]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const raw = completion.choices[0].message.content ?? "{}";
      let alerts: any[] = [];
      try {
        const parsed = JSON.parse(raw);
        // Handle both {alerts:[]} and [] root shapes
        alerts = Array.isArray(parsed) ? parsed : (parsed.alerts ?? parsed.data ?? Object.values(parsed)[0] ?? []);
      } catch {
        alerts = buildAlgorithmicAlerts(city, state, gasPrice, eco);
      }

      res.json(alerts.slice(0, 5));
    } catch (err: any) {
      console.error("Location alerts error:", err.message);
      res.status(500).json({ message: "Failed to generate alerts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function buildAlgorithmicAlerts(city: string, state: string, gasPrice: number, eco: any) {
  const stateGasSurcharge: Record<string, number> = {
    CA: 0.68, NY: 0.49, PA: 0.59, IL: 0.54, WA: 0.52, HI: 0.16,
    TX: 0.20, FL: 0.28, OH: 0.38, MI: 0.27, GA: 0.32, NC: 0.38,
  };
  const sc = stateGasSurcharge[state?.toUpperCase()] ?? 0.15;
  const localGas = (gasPrice + sc).toFixed(2);
  const inflation = eco?.inflationRate ?? 3.3;

  return [
    {
      id: "alert-gas",
      type: "gas",
      severity: gasPrice > 3.8 ? "high" : "medium",
      title: `Gas prices near ${city}`,
      message: `National average is $${gasPrice.toFixed(2)}/gal. ${state} state taxes add ~$${sc.toFixed(2)}, putting local prices around $${localGas}/gal. Oil at $${eco?.oilPrices ?? 92}/barrel signals prices may rise within the week.`,
      prediction: `+$0.08–0.15/gal increase likely in 5–7 days`,
      confidence: 72,
      daysOut: 7,
      actionSuggestion: `Fill your tank today — waiting 7 days could cost $2–4 extra per fill-up.`,
      icon: "⛽",
    },
    {
      id: "alert-grocery",
      type: "grocery",
      severity: "medium",
      title: `Grocery prices up ${inflation}% YoY`,
      message: `CPI is running at ${inflation}% annually. Protein and dairy categories are seeing the steepest increases — averaging 5–7% above last year in most ${state} metros including ${city}.`,
      prediction: `Grocery spend up ~$18–35/month vs. last year`,
      confidence: 81,
      daysOut: 30,
      actionSuggestion: `Buy canned/frozen proteins in bulk this week to lock in current pricing before the next index update.`,
      icon: "🛒",
    },
    {
      id: "alert-housing",
      type: "housing",
      severity: eco?.interestRate > 5 ? "high" : "medium",
      title: `Mortgage rates near ${eco?.interestRate ?? 4.3}%`,
      message: `The 30-year fixed rate tracks near ${(eco?.interestRate ?? 4.33 + 1.5).toFixed(2)}% in the current environment. In the ${city} metro, that translates to roughly $${Math.round((250000 * 0.006))} more per month vs. two years ago on a $250k loan.`,
      prediction: `Rates hold or rise slightly over next 30 days`,
      confidence: 65,
      daysOut: 30,
      actionSuggestion: `If you plan to buy in ${city} this year, getting pre-approved now locks your rate before any Fed moves.`,
      icon: "🏠",
    },
    {
      id: "alert-economic",
      type: "economic",
      severity: "low",
      title: `Local job market healthy`,
      message: `National unemployment at ${eco?.unemploymentRate ?? 4.3}% with GDP growing at ${eco?.gdpGrowth ?? 2.8}%. Consumer spending remains strong but wage growth is moderating, which may soften discretionary spending in ${city} over the next quarter.`,
      prediction: `No major local downturn expected in 60 days`,
      confidence: 58,
      daysOut: 60,
      actionSuggestion: `Good window to negotiate raises or freelance rates while the labor market stays tight.`,
      icon: "📊",
    },
  ];
}
