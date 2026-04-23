import { anthropic, callClaudeJSON, SONNET } from "./claude";

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
  confidence: number;
  smartBuyScore: number;
  recommendedAction: "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR";
  reasoning: string;
  keyFactors: string[];
  expectedSavings: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  analysisSource: "Claude claude-sonnet-4-6" | "Public-data algorithm";
}

export async function getAIPricePrediction(input: AIAnalysisInput): Promise<AIPredictionResult> {
  if (!anthropic) return getAlgorithmicPricePrediction(input);

  try {
    const prompt = `You are a financial analyst AI specializing in consumer price predictions. Analyze the data and provide price forecasting.

ITEM: ${input.itemName}
CURRENT PRICE: $${input.currentPrice}
RECENT PRICE HISTORY: [${input.historicalPrices.join(', ')}]

ECONOMIC CONTEXT:
- Inflation Rate: ${input.economicIndicators.inflationRate}%
- GDP Growth: ${input.economicIndicators.gdpGrowth}%
- Consumer Price Index: ${input.economicIndicators.consumerPriceIndex}
${input.seasonalData ? `\nSEASONAL INFO: Month ${input.seasonalData.month}, Category: ${input.seasonalData.category}` : ''}

Provide a 30-day price prediction. Return ONLY this JSON object:
{
  "predictedPrice30Day": number,
  "priceDirection": "UP" | "DOWN" | "STABLE",
  "confidence": number between 0.6 and 0.95,
  "smartBuyScore": integer 1-10,
  "recommendedAction": "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR",
  "reasoning": "brief factual explanation",
  "keyFactors": ["factor1", "factor2", "factor3"],
  "expectedSavings": number,
  "riskLevel": "LOW" | "MEDIUM" | "HIGH"
}

Rules:
- BUY_NOW: Score 8-10, excellent deal or price rising soon
- WAIT_1_WEEK: Score 4-7, moderate savings possible
- WAIT_2_WEEKS: Score 1-4, significant drop expected
- MONITOR: Stable, no immediate action needed
- Price predictions max ±15% from current`;

    const analysis = await callClaudeJSON<any>(prompt, SONNET, 600);
    if (!analysis) throw new Error("No Claude response");

    return {
      predictedPrice30Day: Math.max(0, Number(analysis.predictedPrice30Day) || input.currentPrice),
      priceDirection: ["UP", "DOWN", "STABLE"].includes(analysis.priceDirection) ? analysis.priceDirection : "STABLE",
      confidence: Math.min(0.95, Math.max(0.6, Number(analysis.confidence) || 0.75)),
      smartBuyScore: Math.min(10, Math.max(1, Math.round(Number(analysis.smartBuyScore) || 5))),
      recommendedAction: ["BUY_NOW", "WAIT_1_WEEK", "WAIT_2_WEEKS", "MONITOR"].includes(analysis.recommendedAction)
        ? analysis.recommendedAction : "MONITOR",
      reasoning: String(analysis.reasoning || "Claude analysis based on economic indicators"),
      keyFactors: Array.isArray(analysis.keyFactors) ? analysis.keyFactors.slice(0, 5) : ["Economic trends", "Historical data"],
      expectedSavings: Math.max(0, Number(analysis.expectedSavings) || 0),
      riskLevel: ["LOW", "MEDIUM", "HIGH"].includes(analysis.riskLevel) ? analysis.riskLevel : "MEDIUM",
      analysisSource: "Claude claude-sonnet-4-6",
    };
  } catch (error) {
    console.warn(`Claude prediction unavailable for ${input.itemName}; using algorithm.`);
    return getAlgorithmicPricePrediction(input);
  }
}

function getAlgorithmicPricePrediction(input: AIAnalysisInput): AIPredictionResult {
  const inflationRate = input.economicIndicators.inflationRate / 100;
  const gdpGrowth = input.economicIndicators.gdpGrowth / 100;
  const averagePrice = Number(input.historicalPrices[1]) || input.currentPrice;
  const currentValueSignal = averagePrice > 0 ? (averagePrice - input.currentPrice) / averagePrice : 0;
  const seasonalWeight = getSeasonalWeight(input.itemName, input.seasonalData?.month || new Date().getMonth());
  const energyPressure = input.itemName === "Gas" || input.itemName.includes("Oil") ? 0.018 : 0;
  const foodPressure = ["Eggs", "Chicken Breast", "Ground Beef", "Milk", "Bread"].includes(input.itemName) ? 0.01 : 0.004;
  const seasonalPressure = (seasonalWeight - 0.5) * 0.08;
  const macroPressure = inflationRate * 0.45 - gdpGrowth * 0.08;
  const valueReversionPressure = -currentValueSignal * 0.25;
  const priceChangePercent = Math.max(-0.12, Math.min(0.12, macroPressure + seasonalPressure + energyPressure + foodPressure + valueReversionPressure));
  const predictedPrice = Math.max(0.01, input.currentPrice * (1 + priceChangePercent));
  const priceDirection = Math.abs(priceChangePercent) < 0.02 ? "STABLE" : priceChangePercent > 0 ? "UP" : "DOWN";
  const confidence = Math.min(0.88, Math.max(0.68, Math.abs(priceChangePercent) * 3.5 + Math.abs(currentValueSignal) * 1.8 + 0.68));

  let smartBuyScore = 5.5;
  smartBuyScore += currentValueSignal * 28;
  if (priceDirection === "UP") smartBuyScore += 1.4;
  if (priceDirection === "DOWN") smartBuyScore -= 1.4;
  if (input.itemName === "Eggs" || input.itemName === "Rice" || input.itemName === "Bread") smartBuyScore += 0.8;
  smartBuyScore = Math.round(Math.max(1, Math.min(10, smartBuyScore)) * 10) / 10;

  let recommendedAction: "BUY_NOW" | "WAIT_1_WEEK" | "WAIT_2_WEEKS" | "MONITOR" = "MONITOR";
  if (smartBuyScore >= 7.5) recommendedAction = "BUY_NOW";
  else if (smartBuyScore <= 3.8) recommendedAction = "WAIT_2_WEEKS";
  else if (smartBuyScore <= 5.2 || priceDirection === "DOWN") recommendedAction = "WAIT_1_WEEK";

  const expectedSavings = recommendedAction !== "BUY_NOW" ? Math.max(0, input.currentPrice - predictedPrice) : 0;

  return {
    predictedPrice30Day: Math.round(predictedPrice * 100) / 100,
    priceDirection,
    confidence: Math.round(confidence * 100) / 100,
    smartBuyScore,
    recommendedAction,
    reasoning: "Economic analysis using inflation trends, seasonality, and current vs. average price.",
    keyFactors: ["Inflation rate", "GDP growth", "Seasonal patterns", "Current vs. 30-day average"],
    expectedSavings: Math.round(expectedSavings * 100) / 100,
    riskLevel: confidence > 0.75 ? "LOW" : confidence > 0.65 ? "MEDIUM" : "HIGH",
    analysisSource: "Public-data algorithm",
  };
}

function getSeasonalWeight(itemName: string, month: number): number {
  const patterns: Record<string, number[]> = {
    "Eggs":         [0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.4, 0.5, 0.6, 0.8, 0.9, 0.8],
    "Gas":          [0.4, 0.4, 0.5, 0.6, 0.8, 0.9, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4],
    "Milk":         [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.6, 0.5, 0.5, 0.5, 0.5],
    "Bread":        [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    "Ground Beef":  [0.6, 0.6, 0.5, 0.4, 0.7, 0.8, 0.9, 0.8, 0.6, 0.5, 0.7, 0.8],
    "Chicken Breast":[0.55, 0.55, 0.52, 0.5, 0.58, 0.62, 0.65, 0.63, 0.58, 0.55, 0.57, 0.6],
    "WTI Crude Oil":[0.45, 0.48, 0.52, 0.58, 0.65, 0.72, 0.75, 0.72, 0.65, 0.55, 0.5, 0.47],
    "Rice":         [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
  };
  return patterns[itemName]?.[month] ?? 0.5;
}

export async function getBatchAIPredictions(inputs: AIAnalysisInput[]): Promise<AIPredictionResult[]> {
  const batchSize = 3;
  const results: AIPredictionResult[] = [];
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(input => getAIPricePrediction(input)));
    results.push(...batchResults);
    if (i + batchSize < inputs.length) await new Promise(r => setTimeout(r, 500));
  }
  return results;
}
