import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export interface AIAnalysisInput {
  itemName: string;
  currentPrice: number;
  historicalPrices: number[];
  economicIndicators: {
    inflationRate: number;
    gdpGrowth: number;
    consumerPriceIndex: number;
  };
  seasonalData?: {
    month: number;
    category: string;
  };
}

export interface AIPredictionResult {
  predictedPrice30Day: number;
  priceDirection: "UP" | "DOWN" | "STABLE";
  confidence: number; // 0-1
  smartBuyScore: number; // 1-10
  recommendedAction: "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR";
  reasoning: string;
  keyFactors: string[];
  expectedSavings: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export async function getAIPricePrediction(input: AIAnalysisInput): Promise<AIPredictionResult> {
  try {
    const prompt = `
You are a financial analyst AI specializing in consumer price predictions. Analyze the following data and provide price forecasting:

ITEM: ${input.itemName}
CURRENT PRICE: $${input.currentPrice}
RECENT PRICE HISTORY: [${input.historicalPrices.join(', ')}]

ECONOMIC CONTEXT:
- Inflation Rate: ${input.economicIndicators.inflationRate}%
- GDP Growth: ${input.economicIndicators.gdpGrowth}%
- Consumer Price Index: ${input.economicIndicators.consumerPriceIndex}

${input.seasonalData ? `SEASONAL INFO: Month ${input.seasonalData.month}, Category: ${input.seasonalData.category}` : ''}

TASK: Provide a comprehensive 30-day price prediction analysis. Consider:
1. Economic trends and their impact on this specific item
2. Historical price patterns and volatility
3. Seasonal factors (if applicable)
4. Supply chain considerations
5. Market demand indicators

Respond with JSON in this exact format:
{
  "predictedPrice30Day": number,
  "priceDirection": "UP" | "DOWN" | "STABLE",
  "confidence": number between 0.6 and 0.95,
  "smartBuyScore": integer from 1 to 10,
  "recommendedAction": "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR",
  "reasoning": "brief explanation of the prediction",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "expectedSavings": number (potential savings if waiting, 0 if buy now recommended),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH"
}

Guidelines:
- BUY_NOW: Score 8-10, excellent deal or price likely to rise soon
- WAIT_1_WEEK: Score 4-7, moderate savings possible with short wait
- WAIT_2_WEEKS: Score 1-4, significant price drop expected
- MONITOR: Stable prices, no immediate action needed
- Consider economic headwinds, inflation impacts, and seasonal trends
- Be realistic with price predictions (typically ±15% max change)
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert financial analyst with deep knowledge of consumer markets, economic indicators, and price forecasting. Provide data-driven, realistic predictions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more consistent predictions
      max_tokens: 800
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize the response
    return {
      predictedPrice30Day: Math.max(0, Number(analysis.predictedPrice30Day) || input.currentPrice),
      priceDirection: ["UP", "DOWN", "STABLE"].includes(analysis.priceDirection) ? analysis.priceDirection : "STABLE",
      confidence: Math.min(0.95, Math.max(0.6, Number(analysis.confidence) || 0.75)),
      smartBuyScore: Math.min(10, Math.max(1, Math.round(Number(analysis.smartBuyScore) || 5))),
      recommendedAction: ["BUY_NOW", "WAIT_1_WEEK", "WAIT_2_WEEKS", "MONITOR"].includes(analysis.recommendedAction) 
        ? analysis.recommendedAction : "MONITOR",
      reasoning: String(analysis.reasoning || "AI analysis based on economic indicators"),
      keyFactors: Array.isArray(analysis.keyFactors) ? analysis.keyFactors.slice(0, 5) : ["Economic trends", "Historical data"],
      expectedSavings: Math.max(0, Number(analysis.expectedSavings) || 0),
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(analysis.riskLevel) ? analysis.riskLevel : "MEDIUM"
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Enhanced fallback with better algorithmic predictions
    const inflationRate = input.economicIndicators.inflationRate / 100;
    const gdpGrowth = input.economicIndicators.gdpGrowth / 100;
    
    // Calculate more sophisticated fallback prediction
    const economicWeight = Math.min(1, inflationRate / 0.05); // Normalize inflation impact
    const gdpWeight = 1 - Math.min(1, Math.max(0, gdpGrowth / 0.05)); // GDP inverse impact
    const seasonalWeight = getSeasonalWeight(input.itemName, input.seasonalData?.month || new Date().getMonth());
    
    const combinedWeight = (economicWeight * 0.4 + gdpWeight * 0.3 + seasonalWeight * 0.3);
    const priceChangePercent = (combinedWeight - 0.5) * 0.25; // ±12.5% max change
    const predictedPrice = Math.max(0.01, input.currentPrice * (1 + priceChangePercent));
    
    // Determine direction and confidence
    const priceDirection = Math.abs(priceChangePercent) < 0.02 ? "STABLE" : 
                          priceChangePercent > 0 ? "UP" : "DOWN";
    const confidence = Math.min(0.85, Math.max(0.65, Math.abs(combinedWeight - 0.5) * 1.5 + 0.6));
    
    // Calculate Smart Buy Score based on algorithmic factors
    let smartBuyScore = 5; // Default neutral
    if (priceDirection === "DOWN" && Math.abs(priceChangePercent) > 0.05) smartBuyScore = 8;
    else if (priceDirection === "UP" && Math.abs(priceChangePercent) > 0.05) smartBuyScore = 3;
    else if (priceDirection === "STABLE") smartBuyScore = 6;
    
    // Determine action based on score and trend
    let recommendedAction: "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR" = "MONITOR";
    if (smartBuyScore >= 8) recommendedAction = "BUY_NOW";
    else if (smartBuyScore <= 4) recommendedAction = "WAIT_2_WEEKS";
    else if (smartBuyScore <= 6 && priceDirection === "DOWN") recommendedAction = "WAIT_1_WEEK";
    
    const expectedSavings = recommendedAction !== "BUY_NOW" 
      ? Math.max(0, input.currentPrice - predictedPrice) : 0;
    
    return {
      predictedPrice30Day: Math.round(predictedPrice * 100) / 100,
      priceDirection,
      confidence: Math.round(confidence * 100) / 100,
      smartBuyScore,
      recommendedAction,
      reasoning: "Economic analysis using inflation trends and seasonal patterns",
      keyFactors: ["Inflation rate", "GDP growth", "Seasonal patterns", "Historical trends"],
      expectedSavings: Math.round(expectedSavings * 100) / 100,
      riskLevel: confidence > 0.75 ? "LOW" : confidence > 0.65 ? "MEDIUM" : "HIGH"
    };
  }
}

function getSeasonalWeight(itemName: string, month: number): number {
  const seasonalPatterns: Record<string, number[]> = {
    "Eggs": [0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 0.8], // Higher in winter
    "Gas": [0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4], // Higher in summer
    "Milk": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5], // Stable
    "Bread": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], // Stable
    "Ground Beef": [0.6, 0.6, 0.5, 0.4, 0.7, 0.8, 0.9, 0.8, 0.6, 0.5, 0.7, 0.8], // Higher in grilling season
    "Rice": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] // Stable
  };
  
  return seasonalPatterns[itemName]?.[month] || 0.5;
}

export async function getBatchAIPredictions(inputs: AIAnalysisInput[]): Promise<AIPredictionResult[]> {
  // Process predictions in batches to avoid rate limits
  const batchSize = 3;
  const results: AIPredictionResult[] = [];
  
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const batchPromises = batch.map(input => getAIPrediction(input));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add a small delay between batches to respect rate limits
    if (i + batchSize < inputs.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Helper function with retry logic
async function getAIPrediction(input: AIAnalysisInput): Promise<AIPredictionResult> {
  const maxRetries = 2;
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getAIPricePrediction(input);
    } catch (error) {
      lastError = error;
      console.warn(`AI prediction attempt ${attempt} failed for ${input.itemName}:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  // Final fallback
  console.error(`All AI prediction attempts failed for ${input.itemName}, using fallback`);
  throw lastError;
}