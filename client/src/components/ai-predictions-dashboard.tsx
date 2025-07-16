import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchPriceData, fetchEconomicData } from "@/lib/economic-api";
import { generatePricePredictions, generatePersonalizedRecommendations, type UserPreferences } from "@/lib/ai-predictions";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Calendar, 
  DollarSign,
  Lightbulb,
  Settings
} from "lucide-react";
import { useState } from "react";

export function AIPredictionsDashboard() {
  const [userPreferences] = useState<UserPreferences>({
    location: "US-National",
    shoppingFrequency: "weekly",
    budgetPriority: "savings",
    riskTolerance: "moderate"
  });

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["/api/price-data"],
    queryFn: fetchPriceData,
  });

  const { data: economicData, isLoading: isEconomicLoading } = useQuery({
    queryKey: ["/api/economic-data"],
    queryFn: fetchEconomicData,
  });

  const predictions = priceData && economicData ? 
    generatePricePredictions(priceData, economicData, userPreferences) : [];

  const personalizedRecs = predictions.length > 0 ? 
    generatePersonalizedRecommendations(predictions, userPreferences) : null;

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "UP": return <TrendingUp className="w-4 h-4" />;
      case "DOWN": return <TrendingDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "UP": return "text-red-600 dark:text-red-400";
      case "DOWN": return "text-emerald-600 dark:text-emerald-400";
      default: return "text-slate-500 dark:text-slate-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 6) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-100 dark:bg-emerald-900/20";
    if (score >= 6) return "bg-amber-100 dark:bg-amber-900/20";
    return "bg-red-100 dark:bg-red-900/20";
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "BUY_NOW": return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
      case "WAIT_1_WEEK": return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
      case "WAIT_2_WEEKS": return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      default: return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
    }
  };

  if (isPriceLoading || isEconomicLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4 fade-in">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center glow-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              AI Predictions & Smart Buy Scores
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              30-day price forecasts powered by machine learning algorithms
            </p>
          </div>
        </div>
        <Button className="btn-premium ripple">
          <Settings className="w-4 h-4 mr-2" />
          Preferences
        </Button>
      </div>

      {/* Top Recommendations & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Smart Recommendations */}
        <div className="glass-card p-8 scale-in">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Smart Recommendations
            </h3>
          </div>
            
          <div className="space-y-4">
            {personalizedRecs?.topRecommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="glass-card p-4 bg-white/50 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${getScoreBg(rec.smartBuyScore)} ${getScoreColor(rec.smartBuyScore)} glow-pulse`}>
                      {rec.smartBuyScore}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{rec.itemName}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {rec.confidence > 0.8 ? "High confidence" : "Moderate confidence"}
                      </div>
                    </div>
                  </div>
                  <Badge className={`px-3 py-1.5 text-xs font-semibold ${getActionBadgeStyle(rec.recommendedAction)}`}>
                    {rec.recommendedAction.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Optimization */}
        <div className="glass-card p-8 scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Budget Optimization
            </h3>
          </div>
            
          <div className="space-y-4">
            {personalizedRecs?.budgetOptimization.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 glass-card p-3 bg-white/30 dark:bg-white/5">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-1.5 glow-pulse"></div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tip}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Timing Advice</span>
            </div>
            <div className="space-y-2">
              {personalizedRecs?.timingAdvice.slice(0, 2).map((advice, index) => (
                <p key={index} className="text-sm text-slate-600 dark:text-slate-400 glass-card p-2 bg-white/20 dark:bg-white/5">{advice}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {predictions.map((prediction, index) => (
          <div key={prediction.itemName} className="glass-card p-6 scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{prediction.itemName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`flex items-center space-x-1 text-sm ${getDirectionColor(prediction.priceDirection)}`}>
                      {getDirectionIcon(prediction.priceDirection)}
                      <span>{prediction.priceDirection.toLowerCase()}</span>
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getScoreBg(prediction.smartBuyScore)}`}>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getScoreColor(prediction.smartBuyScore)}`}>
                      {prediction.smartBuyScore}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">score</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Current</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    ${prediction.currentPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">30-day forecast</span>
                  <span className={`font-medium ${getDirectionColor(prediction.priceDirection)}`}>
                    ${prediction.predicted30DayPrice.toFixed(2)}
                  </span>
                </div>

                {prediction.expectedSavings > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Potential savings</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      ${prediction.expectedSavings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Badge className={`w-full justify-center ${getActionBadgeStyle(prediction.recommendedAction)}`}>
                    {prediction.recommendedAction.replace("_", " ")}
                  </Badge>
                </div>

                {/* Prediction Factors */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Prediction Factors</span>
                  {Object.entries(prediction.predictionFactors).map(([factor, value]) => (
                    <div key={factor} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Progress value={value * 100} className="w-16 h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}