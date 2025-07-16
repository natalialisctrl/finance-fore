export interface RegionalEconomicData {
  region: string;
  regionalInflation: number;
  nationalInflation: number;
  unemploymentRate: number;
  costOfLivingIndex: number;
  housingMarketIndex: number;
  lastUpdated: Date;
}

export interface SupplyChainAlert {
  id: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affectedItems: string[];
  expectedDuration: string;
  priceImpact: number; // percentage
  region: string;
  source: string;
  dateReported: Date;
}

export interface SeasonalTrend {
  itemName: string;
  month: number;
  historicalPriceMultiplier: number; // 1.0 = average, 1.2 = 20% above average
  confidence: number;
  drivingFactors: string[];
  peakSeason: boolean;
}

export interface EconomicImpactScore {
  itemName: string;
  overallScore: number; // 1-10, higher = more economic sensitivity
  factors: {
    inflationSensitivity: number;
    supplyChainVulnerability: number;
    seasonalVolatility: number;
    energyCostImpact: number;
    laborCostImpact: number;
    transportationImpact: number;
  };
  explanation: string;
  riskLevel: "low" | "moderate" | "high" | "extreme";
}

export interface EnhancedEconomicContext {
  regional: RegionalEconomicData;
  supplyChainAlerts: SupplyChainAlert[];
  seasonalTrends: SeasonalTrend[];
  economicImpactScores: EconomicImpactScore[];
  marketSentiment: {
    consumerConfidence: number;
    businessOptimism: number;
    inflationExpectations: number;
  };
}

// Mock data generators for demonstration
export const fetchRegionalEconomicData = async (region: string = "US-National"): Promise<RegionalEconomicData> => {
  // In production, this would fetch from real economic APIs
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    region,
    regionalInflation: 3.2 + (Math.random() - 0.5) * 0.8,
    nationalInflation: 3.1,
    unemploymentRate: 3.8 + (Math.random() - 0.5) * 0.6,
    costOfLivingIndex: 102.5 + (Math.random() - 0.5) * 5,
    housingMarketIndex: 145.8 + (Math.random() - 0.5) * 10,
    lastUpdated: new Date()
  };
};

export const fetchSupplyChainAlerts = async (): Promise<SupplyChainAlert[]> => {
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return [
    {
      id: "sc-001",
      category: "Food & Beverage",
      severity: "medium",
      description: "Drought conditions affecting grain production in midwest regions",
      affectedItems: ["Bread", "Eggs", "Milk"],
      expectedDuration: "2-3 months",
      priceImpact: 8.5,
      region: "US-Midwest",
      source: "USDA",
      dateReported: new Date(Date.now() - 86400000 * 5)
    },
    {
      id: "sc-002", 
      category: "Energy",
      severity: "high",
      description: "Shipping delays due to port congestion affecting fuel costs",
      affectedItems: ["Gas", "Transportation"],
      expectedDuration: "1-2 months",
      priceImpact: 12.3,
      region: "US-West Coast",
      source: "DOT",
      dateReported: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: "sc-003",
      category: "Consumer Goods",
      severity: "low",
      description: "Seasonal manufacturing slowdown",
      affectedItems: ["Electronics", "Appliances"],
      expectedDuration: "3-4 weeks",
      priceImpact: 3.2,
      region: "US-National",
      source: "BLS",
      dateReported: new Date(Date.now() - 86400000 * 7)
    }
  ];
};

export const fetchSeasonalTrends = async (): Promise<SeasonalTrend[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const currentMonth = new Date().getMonth() + 1;
  
  return [
    {
      itemName: "Gas",
      month: currentMonth,
      historicalPriceMultiplier: currentMonth >= 5 && currentMonth <= 8 ? 1.15 : 0.95,
      confidence: 0.87,
      drivingFactors: ["Summer driving season", "Refinery maintenance"],
      peakSeason: currentMonth >= 5 && currentMonth <= 8
    },
    {
      itemName: "Eggs",
      month: currentMonth,
      historicalPriceMultiplier: currentMonth >= 11 || currentMonth <= 2 ? 1.08 : 0.98,
      confidence: 0.73,
      drivingFactors: ["Holiday baking demand", "Avian flu seasonality"],
      peakSeason: currentMonth >= 11 || currentMonth <= 2
    },
    {
      itemName: "Milk",
      month: currentMonth,
      historicalPriceMultiplier: currentMonth >= 6 && currentMonth <= 8 ? 1.05 : 1.0,
      confidence: 0.65,
      drivingFactors: ["Summer heat stress on cattle", "School demand patterns"],
      peakSeason: currentMonth >= 6 && currentMonth <= 8
    },
    {
      itemName: "Bread",
      month: currentMonth,
      historicalPriceMultiplier: currentMonth >= 10 && currentMonth <= 12 ? 1.12 : 0.96,
      confidence: 0.81,
      drivingFactors: ["Harvest season costs", "Holiday demand"],
      peakSeason: currentMonth >= 10 && currentMonth <= 12
    }
  ];
};

export const generateEconomicImpactScores = async (items: string[]): Promise<EconomicImpactScore[]> => {
  await new Promise(resolve => setTimeout(resolve, 180));
  
  return items.map(itemName => {
    const baseScores = {
      "Gas": { overall: 9.2, inflation: 0.95, supply: 0.85, seasonal: 0.8, energy: 0.98, labor: 0.4, transport: 0.9 },
      "Eggs": { overall: 7.8, inflation: 0.7, supply: 0.9, seasonal: 0.85, energy: 0.3, labor: 0.6, transport: 0.7 },
      "Milk": { overall: 6.5, inflation: 0.65, supply: 0.75, seasonal: 0.6, energy: 0.4, labor: 0.7, transport: 0.8 },
      "Bread": { overall: 5.9, inflation: 0.6, supply: 0.8, seasonal: 0.7, energy: 0.2, labor: 0.8, transport: 0.6 },
      "Bananas": { overall: 8.1, inflation: 0.5, supply: 0.95, seasonal: 0.9, energy: 0.1, labor: 0.9, transport: 0.95 },
      "Chicken": { overall: 7.2, inflation: 0.7, supply: 0.85, seasonal: 0.5, energy: 0.3, labor: 0.75, transport: 0.7 }
    };
    
    const scores = baseScores[itemName as keyof typeof baseScores] || baseScores["Bread"];
    
    return {
      itemName,
      overallScore: scores.overall,
      factors: {
        inflationSensitivity: scores.inflation,
        supplyChainVulnerability: scores.supply,
        seasonalVolatility: scores.seasonal,
        energyCostImpact: scores.energy,
        laborCostImpact: scores.labor,
        transportationImpact: scores.transport
      },
      explanation: generateImpactExplanation(itemName, scores.overall),
      riskLevel: scores.overall >= 8 ? "high" : scores.overall >= 6 ? "moderate" : "low"
    };
  });
};

function generateImpactExplanation(itemName: string, score: number): string {
  const explanations: Record<string, string> = {
    "Gas": "Highly sensitive to geopolitical events, crude oil prices, and seasonal demand fluctuations.",
    "Eggs": "Vulnerable to avian flu outbreaks, feed costs, and seasonal production variations.",
    "Milk": "Affected by feed prices, weather conditions, and dairy farm operational costs.",
    "Bread": "Influenced by wheat prices, energy costs for production, and seasonal demand patterns.",
    "Bananas": "Highly dependent on international supply chains, weather conditions, and transportation costs.",
    "Chicken": "Sensitive to feed costs, processing facility capacity, and seasonal demand shifts."
  };
  
  return explanations[itemName] || "Price influenced by various economic and supply chain factors.";
}

export const fetchEnhancedEconomicContext = async (region: string = "US-National"): Promise<EnhancedEconomicContext> => {
  const [regional, supplyChainAlerts, seasonalTrends] = await Promise.all([
    fetchRegionalEconomicData(region),
    fetchSupplyChainAlerts(),
    fetchSeasonalTrends()
  ]);
  
  const itemNames = ["Gas", "Eggs", "Milk", "Bread", "Bananas", "Chicken"];
  const economicImpactScores = await generateEconomicImpactScores(itemNames);
  
  return {
    regional,
    supplyChainAlerts,
    seasonalTrends,
    economicImpactScores,
    marketSentiment: {
      consumerConfidence: 68.5 + (Math.random() - 0.5) * 10,
      businessOptimism: 72.3 + (Math.random() - 0.5) * 8,
      inflationExpectations: 3.8 + (Math.random() - 0.5) * 0.6
    }
  };
};