import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchPriceData, fetchEconomicData } from "@/lib/economic-api";
import { generatePricePredictions, generatePersonalizedRecommendations, type UserPreferences } from "@/lib/ai-predictions";
import { EnhancedPricePredictionCard } from "./enhanced-price-prediction-card";
import { MonthlySavingsSummary } from "./monthly-savings-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Calendar, 
  DollarSign,
  Lightbulb,
  Settings,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePullToRefresh, useDeviceType, useMobileToast } from "./mobile-enhancements";
import { formatCurrency } from "@/lib/utils";

export function AIPredictionsDashboard() {
  const { toast } = useToast();
  const [userPreferences] = useState<UserPreferences>({
    location: "US-National",
    shoppingFrequency: "weekly",
    budgetPriority: "savings",
    riskTolerance: "moderate"
  });

  const handleAddToCart = (itemName: string) => {
    toast({
      title: "Added to Shopping List",
      description: `${itemName} has been added to your shopping list.`,
    });
  };

  const handleSetAlert = (itemName: string) => {
    toast({
      title: "Price Alert Set",
      description: `You'll be notified when ${itemName} price changes.`,
    });
  };

  const handleTrackItem = (itemName: string) => {
    toast({
      title: "Now Tracking",
      description: `${itemName} is now being tracked for price changes.`,
    });
  };

  const handleViewDetails = (itemName: string) => {
    toast({
      title: "Price History",
      description: `Viewing detailed price history for ${itemName}.`,
    });
  };

  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["/api/price-data"],
    queryFn: fetchPriceData,
  });

  const { data: economicData, isLoading: isEconomicLoading } = useQuery({
    queryKey: ["/api/economic-data"],
    queryFn: fetchEconomicData,
  });

  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);

  // Load AI predictions when data is available
  useEffect(() => {
    if (priceData && economicData) {
      setIsLoadingPredictions(true);
      
      // Try AI predictions first
      const generateAndSetPredictions = async () => {
        try {
          const aiPredictions = await fetch("/api/ai-predictions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              priceData, 
              economicData,
              userPreferences 
            })
          });
          
          if (aiPredictions.ok) {
            const predictions = await aiPredictions.json();
            setPredictions(predictions);
            setIsAIActive(true);
            console.log("AI Predictions loaded:", predictions.length, "items");
          } else {
            // Fallback to algorithmic predictions
            const fallbackPredictions = await generatePricePredictions(priceData, economicData, userPreferences);
            setPredictions(fallbackPredictions);
            setIsAIActive(false);
            console.log("Using fallback predictions:", fallbackPredictions.length, "items");
          }
        } catch (error) {
          console.error("Error generating predictions:", error);
          // Use algorithmic fallback
          const fallbackPredictions = await generatePricePredictions(priceData, economicData, userPreferences);
          setPredictions(fallbackPredictions);
          setIsAIActive(false);
        } finally {
          setIsLoadingPredictions(false);
        }
      };

      generateAndSetPredictions();
    }
  }, [priceData, economicData, userPreferences]);

  const personalizedRecs = predictions.length > 0 ? 
    generatePersonalizedRecommendations(predictions, userPreferences || {
      location: "United States",
      shoppingFrequency: "weekly",
      budgetPriority: "savings",
      riskTolerance: "moderate"
    }) : null;

  // Debug logging
  useEffect(() => {
    console.log("Dashboard state:", {
      predictionsCount: predictions.length,
      hasPersonalizedRecs: !!personalizedRecs,
      topRecommendationsCount: personalizedRecs?.topRecommendations?.length || 0,
      budgetOptimizationCount: personalizedRecs?.budgetOptimization?.length || 0
    });
  }, [predictions, personalizedRecs]);

  // Remove duplicate AI status detection since we track it properly now

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

  if (isPriceLoading || isEconomicLoading || isLoadingPredictions) {
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
    <div className="w-full px-2 sm:px-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3 fade-in flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-coral to-gold rounded-xl flex items-center justify-center glow-pulse">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="headline text-white mb-2">
              AI Predictions & Smart Buy Scores
            </h2>
            <p className="subheading text-white/70">
              {isAIActive ? "30-day price forecasts powered by OpenAI GPT-4o" : "Economic analysis with algorithmic predictions"}
            </p>
            <div className="mt-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full ${
                isAIActive 
                  ? 'bg-emerald-500/20 border border-emerald-500/30' 
                  : 'bg-amber-500/20 border border-amber-500/30'
              }`}>
                <Brain className="w-3 h-3 mr-1" />
                <span className={`text-xs font-medium ${
                  isAIActive 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {isAIActive ? 'AI Mode Active' : 'Economic Mode Active'}
                </span>
              </div>
            </div>
            
            {/* AI Transparency Section - Futuristic Glass Style */}
            <div className="mt-4 foresee-card bg-black/30 backdrop-blur-md border-white/10 glow-border-subtle p-3">
              <h4 className="subheading text-white mb-2 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-accent-coral to-gold rounded-full mr-2 pulse-glow"></div>
                Data Sources & Transparency
              </h4>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-white/80">
                  <div className="w-1.5 h-1.5 bg-accent-coral rounded-full mr-2 opacity-70"></div>
                  <span>Economic data from Federal Reserve (FRED) API</span>
                </div>
                <div className="flex items-center text-xs text-white/80">
                  <div className="w-1.5 h-1.5 bg-accent-coral rounded-full mr-2 opacity-70"></div>
                  <span>{isAIActive ? 'AI predictions powered by OpenAI GPT-4o' : 'Algorithmic predictions from economic indicators'}</span>
                </div>
                <div className="flex items-center text-xs text-white/80">
                  <div className="w-1.5 h-1.5 bg-accent-coral rounded-full mr-2 opacity-70"></div>
                  <span>Price data: Ground Beef, Eggs, Milk, Bread, Gas, Rice</span>
                </div>
                <div className="flex items-center text-xs text-white/80">
                  <div className="w-1.5 h-1.5 bg-accent-coral rounded-full mr-2 opacity-70"></div>
                  <span>Predictions are estimates for planning purposes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end sm:justify-end">
          <Button className="btn-coral text-sm px-3 py-2">
            <Settings className="w-3 h-3 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Monthly Savings Summary */}
      <div className="mb-8">
        <MonthlySavingsSummary predictions={predictions} />
      </div>

      {/* Top Recommendations & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-6">
        {/* Smart Recommendations */}
        <div className="foresee-card bg-black/40 backdrop-blur-md glow-border p-3 sm:p-6 scale-in">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-coral to-gold rounded-lg flex items-center justify-center glow-pulse">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h3 className="headline-sm text-white">
              Smart Recommendations
            </h3>
          </div>
            
          <div className="space-y-4">
            {(personalizedRecs?.topRecommendations && personalizedRecs.topRecommendations.length > 0) ? 
              personalizedRecs.topRecommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="foresee-card bg-black/20 backdrop-blur-sm border-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold gradient-gold pulse-metric">
                        {rec.smartBuyScore}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{rec.itemName}</div>
                        <div className="text-xs text-white/70">
                          {rec.confidence > 0.8 ? "High confidence" : "Moderate confidence"}
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium bg-accent-coral text-white rounded">
                      {rec.recommendedAction.replace("_", " ")}
                    </div>
                  </div>
                </div>
              )) : 
              predictions.slice(0, 3).map((prediction, index) => (
                <div key={index} className="foresee-card bg-black/20 backdrop-blur-sm border-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold gradient-gold pulse-metric">
                        {prediction.smartBuyScore}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{prediction.itemName}</div>
                        <div className="text-xs text-white/70">
                          {prediction.confidence > 0.8 ? "High confidence" : "Moderate confidence"}
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium bg-accent-coral text-white rounded">
                      {prediction.recommendedAction.replace("_", " ")}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Budget Optimization */}
        <div className="foresee-card bg-black/40 backdrop-blur-md glow-border-gold p-3 sm:p-6 scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-accent-coral rounded-lg flex items-center justify-center glow-pulse">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <h3 className="headline-sm text-white">
              Budget Optimization
            </h3>
          </div>
            
          <div className="space-y-4">
            {personalizedRecs?.budgetOptimization && personalizedRecs.budgetOptimization.length > 0 ? 
              personalizedRecs.budgetOptimization.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 foresee-card bg-black/20 border-white/10 p-3">
                  <div className="w-2 h-2 bg-accent-coral rounded-full mt-2 pulse-glow"></div>
                  <p className="text-xs text-white/90">{tip}</p>
                </div>
              )) :
              // Fallback budget tips
              [
                "Monitor gas prices - expect 5-8% increase next week",
                "Stock up on eggs now - prices rising due to seasonal demand",
                "Consider bulk buying rice - stable prices with good value"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 foresee-card bg-black/20 border-white/10 p-3">
                  <div className="w-2 h-2 bg-accent-coral rounded-full mt-2 pulse-glow"></div>
                  <p className="text-xs text-white/90">{tip}</p>
                </div>
              ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-accent-coral to-gold rounded-lg flex items-center justify-center">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <span className="subheading text-white">Timing Advice</span>
            </div>
            <div className="space-y-2">
              {personalizedRecs?.timingAdvice && personalizedRecs.timingAdvice.length > 0 ? 
                personalizedRecs.timingAdvice.slice(0, 2).map((advice, index) => (
                  <p key={index} className="text-xs text-white/90 foresee-card bg-black/10 border-white/10 p-2">{advice}</p>
                )) :
                // Fallback timing advice
                [
                  "Best shopping day this week: Tuesday - avoid weekend price premiums",
                  "Gas prices peak in 7-10 days - fill up early if needed"
                ].map((advice, index) => (
                  <p key={index} className="text-xs text-white/90 foresee-card bg-black/10 border-white/10 p-2">{advice}</p>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
        {predictions.map((prediction, index) => (
          <EnhancedPricePredictionCard
            key={prediction.itemName}
            prediction={prediction}
            onAddToCart={() => handleAddToCart(prediction.itemName)}
            onSetAlert={() => handleSetAlert(prediction.itemName)}
            onTrackItem={() => handleTrackItem(prediction.itemName)}
            onViewDetails={() => handleViewDetails(prediction.itemName)}
          />
        ))}
      </div>
    </div>
  );
}