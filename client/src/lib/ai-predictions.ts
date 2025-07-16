export interface PricePrediction {
  itemName: string;
  currentPrice: number;
  predicted30DayPrice: number;
  priceDirection: "UP" | "DOWN" | "STABLE";
  confidence: number; // 0-1
  smartBuyScore: number; // 1-10
  predictionFactors: {
    economicTrends: number;
    seasonality: number;
    historicalPatterns: number;
    supplyDemand: number;
  };
  recommendedAction: "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR";
  expectedSavings: number;
}

export interface UserPreferences {
  location: string;
  shoppingFrequency: "weekly" | "biweekly" | "monthly";
  budgetPriority: "savings" | "convenience" | "quality";
  riskTolerance: "conservative" | "moderate" | "aggressive";
}

// Simulated AI prediction engine
export const generatePricePredictions = (
  priceData: any[],
  economicData: any,
  userPreferences?: UserPreferences
): PricePrediction[] => {
  return priceData.map((item) => {
    // Simulate ML model calculations
    const economicWeight = calculateEconomicWeight(economicData);
    const seasonalWeight = calculateSeasonalWeight(item.itemName);
    const historicalWeight = calculateHistoricalWeight(item);
    const supplyDemandWeight = calculateSupplyDemandWeight(item.itemName);
    
    // Combine factors for prediction
    const predictionFactors = {
      economicTrends: economicWeight,
      seasonality: seasonalWeight,
      historicalPatterns: historicalWeight,
      supplyDemand: supplyDemandWeight
    };
    
    // Calculate predicted price change
    const totalWeight = Object.values(predictionFactors).reduce((sum, val) => sum + val, 0) / 4;
    const priceChangePercent = (totalWeight - 0.5) * 0.3; // ±15% max change
    const predicted30DayPrice = item.currentPrice * (1 + priceChangePercent);
    
    // Determine direction and confidence
    const priceDirection = Math.abs(priceChangePercent) < 0.02 ? "STABLE" : 
                          priceChangePercent > 0 ? "UP" : "DOWN";
    const confidence = Math.min(0.95, Math.max(0.6, Math.abs(totalWeight - 0.5) * 2));
    
    // Calculate Smart Buy Score (1-10)
    const smartBuyScore = calculateSmartBuyScore(
      item,
      predicted30DayPrice,
      confidence,
      userPreferences
    );
    
    // Determine recommended action
    const recommendedAction = getRecommendedAction(smartBuyScore, priceDirection, confidence);
    
    // Calculate expected savings
    const expectedSavings = Math.max(0, item.currentPrice - predicted30DayPrice);
    
    return {
      itemName: item.itemName,
      currentPrice: item.currentPrice,
      predicted30DayPrice: Math.round(predicted30DayPrice * 100) / 100,
      priceDirection,
      confidence: Math.round(confidence * 100) / 100,
      smartBuyScore,
      predictionFactors,
      recommendedAction,
      expectedSavings: Math.round(expectedSavings * 100) / 100
    };
  });
};

const calculateEconomicWeight = (economicData: any): number => {
  // Higher inflation and lower GDP growth suggest price increases
  const inflationImpact = Math.min(1, economicData.inflationRate / 10); // Normalize to 0-1
  const gdpImpact = 1 - Math.min(1, Math.max(0, economicData.gdpGrowth / 5)); // Inverse relationship
  return (inflationImpact + gdpImpact) / 2;
};

const calculateSeasonalWeight = (itemName: string): number => {
  const month = new Date().getMonth();
  const seasonalPatterns: Record<string, number[]> = {
    "Eggs": [0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 0.8], // Higher in winter (baking season)
    "Gas": [0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4], // Higher in summer
    "Milk": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5], // Stable year-round
    "Bread": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], // Stable year-round
    "Ground Beef": [0.6, 0.6, 0.5, 0.4, 0.7, 0.8, 0.9, 0.8, 0.6, 0.5, 0.7, 0.8], // Higher during grilling season
    "Rice": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] // Stable year-round
  };
  
  return seasonalPatterns[itemName]?.[month] || 0.5;
};

const calculateHistoricalWeight = (item: any): number => {
  // Use current vs average price to predict trend continuation
  const priceRatio = item.currentPrice / item.averagePrice30Day;
  
  if (priceRatio < 0.9) return 0.3; // Likely to revert upward
  if (priceRatio > 1.1) return 0.7; // Likely to continue upward
  return 0.5; // Stable
};

const calculateSupplyDemandWeight = (itemName: string): number => {
  // Simulate supply/demand factors for different items
  const supplyDemandFactors: Record<string, number> = {
    "Eggs": 0.4, // Recent supply chain issues
    "Gas": 0.7, // Geopolitical tensions
    "Milk": 0.5, // Stable supply
    "Bread": 0.5, // Stable supply
    "Ground Beef": 0.6, // Feed cost pressures
    "Rice": 0.4 // Global surplus
  };
  
  return supplyDemandFactors[itemName] || 0.5;
};

const calculateSmartBuyScore = (
  item: any,
  predictedPrice: number,
  confidence: number,
  userPreferences?: UserPreferences
): number => {
  let score = 5; // Base score
  
  // Factor 1: Current vs predicted price (40% weight)
  const priceDifference = (predictedPrice - item.currentPrice) / item.currentPrice;
  if (priceDifference > 0.1) score -= 3; // Prices going up significantly
  else if (priceDifference > 0.05) score -= 1.5; // Prices going up moderately
  else if (priceDifference < -0.05) score += 2; // Prices going down
  
  // Factor 2: Current vs historical average (30% weight)
  const avgDifference = (item.currentPrice - item.averagePrice30Day) / item.averagePrice30Day;
  if (avgDifference < -0.15) score += 2; // Great deal vs average
  else if (avgDifference < -0.05) score += 1; // Good deal vs average
  else if (avgDifference > 0.1) score -= 1.5; // Expensive vs average
  
  // Factor 3: Confidence level (20% weight)
  score += (confidence - 0.8) * 2.5; // Boost for high confidence
  
  // Factor 4: User preferences adjustment (10% weight)
  if (userPreferences) {
    if (userPreferences.riskTolerance === "aggressive" && priceDifference < 0) score += 0.5;
    if (userPreferences.riskTolerance === "conservative" && priceDifference > 0) score -= 0.5;
    if (userPreferences.budgetPriority === "savings" && avgDifference < 0) score += 0.5;
  }
  
  return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
};

const getRecommendedAction = (
  smartBuyScore: number,
  priceDirection: string,
  confidence: number
): "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR" => {
  if (smartBuyScore >= 8 && confidence > 0.8) return "BUY_NOW";
  if (smartBuyScore >= 6.5 && priceDirection === "UP") return "BUY_NOW";
  if (smartBuyScore < 4 && priceDirection === "DOWN") return "WAIT_2_WEEKS";
  if (smartBuyScore < 5.5 && priceDirection === "DOWN") return "WAIT_1_WEEK";
  return "MONITOR";
};

// Personalized recommendations based on user patterns
export const generatePersonalizedRecommendations = (
  predictions: PricePrediction[],
  userPreferences: UserPreferences,
  purchaseHistory?: any[]
): {
  topRecommendations: PricePrediction[];
  budgetOptimization: string[];
  timingAdvice: string[];
} => {
  // Sort by Smart Buy Score
  const topRecommendations = predictions
    .filter(p => p.smartBuyScore >= 7)
    .sort((a, b) => b.smartBuyScore - a.smartBuyScore)
    .slice(0, 3);
  
  const budgetOptimization = [
    "Stock up on eggs and bread this week - prices expected to rise 8-12% next month",
    "Delay milk purchases for 1-2 weeks - 15% price drop predicted",
    "Consider bulk buying rice - stable prices with good current deals"
  ];
  
  const timingAdvice = [
    `Based on your ${userPreferences.shoppingFrequency} shopping pattern, optimal next trip: ${getOptimalShoppingDate(predictions)}`,
    "Gas prices peak in 10 days - fill up before then",
    "Weekend grocery prices typically 3-5% higher - shop weekdays when possible"
  ];
  
  return {
    topRecommendations,
    budgetOptimization,
    timingAdvice
  };
};

const getOptimalShoppingDate = (predictions: PricePrediction[]): string => {
  // Calculate best shopping day based on predictions
  const avgSavings = predictions.reduce((sum, p) => sum + p.expectedSavings, 0) / predictions.length;
  const daysToWait = avgSavings > 2 ? 3 : avgSavings > 1 ? 1 : 0;
  
  const optimalDate = new Date();
  optimalDate.setDate(optimalDate.getDate() + daysToWait);
  
  return optimalDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};