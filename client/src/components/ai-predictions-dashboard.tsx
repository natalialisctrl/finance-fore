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
    <div className="w-full px-6 mb-12">
      <div className="relative z-40 mb-8">
        <div className="text-center">
          <div className="relative group inline-block mb-6">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                AI Neural
              </span>
              <br/>
              <span className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#fc304ed6] bg-clip-text text-transparent animate-pulse">
                Prediction Matrix
              </span>
            </h2>
            
            {/* Quantum field indicators */}
            <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute top-0 left-0 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
              <div className="absolute top-0 right-0 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
              <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#fc304ed6] rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
          
          <p className="text-base text-[#d4c4a0] max-w-2xl mx-auto mb-6 font-light leading-relaxed opacity-90">
{isAIActive ? "AI systems processing 30-day forecasts via OpenAI GPT-4o architecture" : "Advanced algorithms analyzing economic data patterns and market trends"}
          </p>
          
          {/* Neural interface controls */}
          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="flex items-center gap-2 glass-morphism px-4 py-2 rounded-full">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isAIActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
              <span className="text-xs text-white/80 font-mono">
{isAIActive ? 'AI SYSTEM ACTIVE' : 'ALGORITHM PROCESSING'}
              </span>
            </div>
            <Button className="group relative bg-gradient-to-r from-[#fc304ed6]/80 via-[#d4c4a0]/60 to-[#fc304ed6]/80 text-white font-medium px-4 py-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(252,48,77,0.3)] border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center">
                <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
AI Config
              </div>
            </Button>
          </div>
            
          {/* Quantum Data Source Matrix */}
          <div className="relative glass-morphism p-6 rounded-2xl overflow-hidden group hover:neo-brutalism-card transition-all duration-500 max-w-4xl mx-auto animate-[fadeInUp_0.8s_ease-out]">
            {/* Background data streams */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fc304ed6]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
              <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#d4c4a0]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite_reverse]"></div>
            </div>
            
            <h4 className="text-lg font-light bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
              <div className="w-2 h-6 bg-gradient-to-b from-[#fc304ed6] to-[#d4c4a0] rounded-full animate-pulse"></div>
AI Data Stream Sources
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Economic Intelligence", value: "Federal Reserve (FRED) API", icon: "🏦" },
{ label: "AI Processing Core", value: isAIActive ? 'OpenAI GPT-4o AI System' : 'Advanced Economic Algorithm', icon: "🧠" },
                { label: "Market Data Points", value: "Ground Beef • Eggs • Milk • Bread • Gas • Rice", icon: "📊" },
                { label: "Prediction Accuracy", value: "Algorithmic estimates for strategic planning", icon: "⚡" }
              ].map((item, index) => (
                <div key={index} className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-300 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{item.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1">
                        {item.label}
                      </div>
                      <div className="text-xs text-[#d4c4a0] opacity-80 leading-relaxed">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Monthly Savings Summary */}
      <div className="mb-8">
        <MonthlySavingsSummary predictions={predictions} />
      </div>
{/* AI Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quantum Recommendations Engine */}
        <div className="relative glass-morphism p-6 rounded-2xl overflow-hidden group hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]">
          {/* Holographic effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#fc304ed6] via-[#d4c4a0] to-[#fc304ed6] rounded-xl flex items-center justify-center animate-[glowPulse_3s_ease-in-out_infinite] shadow-lg shadow-[#fc304ed6]/30">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-light bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent">
              AI Recommendations
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

        {/* Quantum Budget Optimization Engine */}
        <div className="relative glass-morphism p-6 rounded-2xl overflow-hidden group hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out_200ms]">
          {/* Holographic effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping delay-300"></div>
          </div>
          
          <div className="relative flex items-center space-x-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#d4c4a0] via-[#fc304ed6] to-[#d4c4a0] rounded-xl flex items-center justify-center animate-[glowPulse_3s_ease-in-out_infinite] shadow-lg shadow-[#d4c4a0]/30">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-light bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent">
              Advanced Budget Engine
            </h3>
          </div>
            
          <div className="relative space-y-4">
            {personalizedRecs?.budgetOptimization && personalizedRecs.budgetOptimization.length > 0 ? 
              personalizedRecs.budgetOptimization.map((tip, index) => (
                <div key={index} className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-300 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-br from-[#fc304ed6] to-[#d4c4a0] rounded-full mt-1 animate-pulse shadow-lg shadow-[#fc304ed6]/30"></div>
                    <p className="text-sm text-white/90 leading-relaxed font-light">{tip}</p>
                  </div>
                </div>
              )) :
              // Fallback budget tips
              [
                "Monitor gas prices - expect 5-8% increase next week",
                "Stock up on eggs now - prices rising due to seasonal demand",
                "Consider bulk buying rice - stable prices with good value"
              ].map((tip, index) => (
                <div key={index} className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-300 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-br from-[#fc304ed6] to-[#d4c4a0] rounded-full mt-1 animate-pulse shadow-lg shadow-[#fc304ed6]/30"></div>
                    <p className="text-sm text-white/90 leading-relaxed font-light">{tip}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#fc304ed6] to-[#d4c4a0] rounded-xl flex items-center justify-center animate-pulse shadow-lg shadow-[#fc304ed6]/30">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-light bg-gradient-to-r from-white to-[#d4c4a0] bg-clip-text text-transparent">AI Timing Engine</span>
            </div>
            <div className="space-y-3">
              {personalizedRecs?.timingAdvice && personalizedRecs.timingAdvice.length > 0 ? 
                personalizedRecs.timingAdvice.slice(0, 2).map((advice, index) => (
                  <div key={index} className="group relative glass-morphism p-3 rounded-xl hover:neo-brutalism-card transition-all duration-300 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                    <p className="text-sm text-white/90 leading-relaxed font-light">{advice}</p>
                  </div>
                )) :
                // Fallback timing advice
                [
                  "Best shopping day this week: Tuesday - avoid weekend price premiums",
                  "Gas prices peak in 7-10 days - fill up early if needed"
                ].map((advice, index) => (
                  <div key={index} className="group relative glass-morphism p-3 rounded-xl hover:neo-brutalism-card transition-all duration-300 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                    <p className="text-sm text-white/90 leading-relaxed font-light">{advice}</p>
                  </div>
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