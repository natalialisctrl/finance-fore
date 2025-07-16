export interface PriceTrend {
  date: string;
  price: number;
}

export interface RecommendationResult {
  action: "BUY_NOW" | "CONSIDER" | "WAIT";
  reason: string;
  potentialSavings: number;
}

export const calculateRecommendation = (
  currentPrice: number,
  averagePrice: number,
  inflationRate: number
): RecommendationResult => {
  const percentageChange = ((currentPrice - averagePrice) / averagePrice) * 100;
  const potentialSavings = averagePrice - currentPrice;

  if (percentageChange <= -15) {
    return {
      action: "BUY_NOW",
      reason: `${Math.abs(percentageChange).toFixed(0)}% below average`,
      potentialSavings: Math.max(0, potentialSavings)
    };
  } else if (percentageChange <= -5) {
    return {
      action: "CONSIDER",
      reason: `${Math.abs(percentageChange).toFixed(0)}% below average`,
      potentialSavings: Math.max(0, potentialSavings)
    };
  } else {
    return {
      action: "WAIT",
      reason: `${percentageChange.toFixed(0)}% above average`,
      potentialSavings: 0
    };
  }
};

export const generatePriceTrends = (
  currentPrice: number,
  averagePrice: number,
  months: number = 6
): PriceTrend[] => {
  const trends: PriceTrend[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const seasonalFactor = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.1;
    const price = averagePrice * (1 + variation + seasonalFactor);
    
    trends.push({
      date: date.toISOString().slice(0, 7), // YYYY-MM format
      price: Math.round(price * 100) / 100
    });
  }
  
  // Ensure the last trend point reflects current price
  if (trends.length > 0) {
    trends[trends.length - 1].price = currentPrice;
  }
  
  return trends;
};

export const calculateWeeklySavings = (
  purchases: Array<{
    item: string;
    pricePaid: number;
    averagePrice: number;
    quantity: number;
  }>
): {
  weeklyTotal: number;
  bestPurchases: Array<{ item: string; saved: number }>;
  projectedMonthly: number;
} => {
  let weeklyTotal = 0;
  const bestPurchases: Array<{ item: string; saved: number }> = [];

  purchases.forEach(purchase => {
    const savings = (purchase.averagePrice - purchase.pricePaid) * purchase.quantity;
    if (savings > 0) {
      weeklyTotal += savings;
      bestPurchases.push({
        item: purchase.item,
        saved: Math.round(savings * 100) / 100
      });
    }
  });

  // Sort by savings amount and take top 3
  bestPurchases.sort((a, b) => b.saved - a.saved);
  const topPurchases = bestPurchases.slice(0, 3);

  const projectedMonthly = (weeklyTotal * 52) / 12; // Weekly * 52 weeks / 12 months

  return {
    weeklyTotal: Math.round(weeklyTotal * 100) / 100,
    bestPurchases: topPurchases,
    projectedMonthly: Math.round(projectedMonthly * 100) / 100
  };
};

export const getOptimalBuyingWindow = (
  priceTrends: PriceTrend[],
  currentPrice: number
): {
  recommendation: string;
  expectedPriceChange: number;
  timeframe: string;
} => {
  if (priceTrends.length < 3) {
    return {
      recommendation: "Insufficient data for prediction",
      expectedPriceChange: 0,
      timeframe: ""
    };
  }

  // Simple trend analysis
  const recentTrends = priceTrends.slice(-3);
  const priceChanges = recentTrends.slice(1).map((trend, index) => 
    trend.price - recentTrends[index].price
  );
  
  const averageChange = priceChanges.reduce((sum, change) => sum + change, 0) / priceChanges.length;
  const expectedPriceChange = averageChange;

  if (expectedPriceChange < -0.1) {
    return {
      recommendation: "Prices expected to continue falling",
      expectedPriceChange: Math.round(expectedPriceChange * 100) / 100,
      timeframe: "Wait 1-2 weeks"
    };
  } else if (expectedPriceChange > 0.1) {
    return {
      recommendation: "Prices expected to rise",
      expectedPriceChange: Math.round(expectedPriceChange * 100) / 100,
      timeframe: "Buy within next week"
    };
  } else {
    return {
      recommendation: "Prices relatively stable",
      expectedPriceChange: Math.round(expectedPriceChange * 100) / 100,
      timeframe: "Buy when convenient"
    };
  }
};
