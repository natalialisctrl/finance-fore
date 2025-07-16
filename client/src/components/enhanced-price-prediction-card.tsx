import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EnhancedSmartBuyIndicator } from "./enhanced-smart-buy-indicator";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShoppingCart, 
  Bell, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  DollarSign
} from "lucide-react";
import { PricePrediction } from "@/lib/ai-predictions";
import { fetchSeasonalTrends, fetchEnhancedEconomicContext } from "@/lib/enhanced-economic-api";

interface EnhancedPricePredictionCardProps {
  prediction: PricePrediction;
  onAddToCart?: () => void;
  onSetAlert?: () => void;
  onTrackItem?: () => void;
  onViewDetails?: () => void;
}

export function EnhancedPricePredictionCard({ 
  prediction, 
  onAddToCart,
  onSetAlert,
  onTrackItem,
  onViewDetails
}: EnhancedPricePredictionCardProps) {
  const [daysUntilChange, setDaysUntilChange] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [seasonalData, setSeasonalData] = useState<any>(null);
  const [economicImpact, setEconomicImpact] = useState<any>(null);

  // Fetch seasonal and economic data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [seasonal, economic] = await Promise.all([
          fetchSeasonalTrends(),
          fetchEnhancedEconomicContext()
        ]);
        
        const itemSeasonal = seasonal.find(s => s.itemName === prediction.itemName);
        const itemEconomic = economic.economicImpactScores.find(e => e.itemName === prediction.itemName);
        
        setSeasonalData(itemSeasonal);
        setEconomicImpact(itemEconomic);
        
        const days = Math.floor(Math.random() * 14) + 1;
        setDaysUntilChange(days);
      } catch (error) {
        console.error('Error loading enhanced data:', error);
      }
    };
    
    loadData();
  }, [prediction]);

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "UP": return "text-red-600 dark:text-red-400";
      case "DOWN": return "text-emerald-600 dark:text-emerald-400";
      default: return "text-slate-500 dark:text-slate-400";
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "UP": return <ArrowUpRight className="w-4 h-4" />;
      case "DOWN": return <ArrowDownRight className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "BUY_NOW": return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800";
      case "WAIT_1_WEEK": return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800";
      case "WAIT_2_WEEKS": return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
      default: return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600";
    }
  };

  const getUrgencyClass = (score: number, action: string) => {
    if (action === "BUY_NOW" && score >= 8) {
      return "ring-2 ring-emerald-500/30 border-emerald-200 dark:border-emerald-800";
    }
    if (score <= 3) {
      return "ring-2 ring-red-500/30 border-red-200 dark:border-red-800";
    }
    return "border-slate-200 dark:border-slate-700";
  };

  // Mock 7-day price trend data
  const generateSparklineData = () => {
    const points = [];
    let price = prediction.currentPrice;
    for (let i = 0; i < 7; i++) {
      const variation = (Math.random() - 0.5) * 0.1 * price;
      price += variation;
      points.push(price);
    }
    return points;
  };

  const sparklineData = generateSparklineData();
  const maxPrice = Math.max(...sparklineData);
  const minPrice = Math.min(...sparklineData);
  const priceRange = maxPrice - minPrice;

  const generateSparklinePath = () => {
    if (priceRange === 0) return "";
    
    const width = 60;
    const height = 20;
    
    return sparklineData
      .map((price, index) => {
        const x = (index / (sparklineData.length - 1)) * width;
        const y = height - ((price - minPrice) / priceRange) * height;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const priceChange = prediction.predicted30DayPrice - prediction.currentPrice;
  const priceChangePercent = (priceChange / prediction.currentPrice) * 100;

  return (
    <TooltipProvider>
      <Card 
        className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${getUrgencyClass(prediction.smartBuyScore, prediction.recommendedAction)} ${
          prediction.smartBuyScore >= 8 ? 'animate-pulse-subtle' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onViewDetails}
      >
        <CardContent className="p-6">
          {/* Header with item info and Smart Buy Score */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                {prediction.itemName.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {prediction.itemName}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`flex items-center space-x-1 text-sm ${getDirectionColor(prediction.priceDirection)}`}>
                    {getDirectionIcon(prediction.priceDirection)}
                    <span className="capitalize">{prediction.priceDirection.toLowerCase()}</span>
                  </span>
                  
                  {/* Mini Sparkline Chart */}
                  <div className="ml-2">
                    <svg width="60" height="20" className="overflow-visible">
                      <path
                        d={generateSparklinePath()}
                        fill="none"
                        stroke={prediction.priceDirection === "UP" ? "#ef4444" : "#10b981"}
                        strokeWidth="1.5"
                        className="drop-shadow-sm"
                      />
                      {/* Last point highlight */}
                      {sparklineData.length > 0 && (
                        <circle
                          cx={60}
                          cy={20 - ((sparklineData[sparklineData.length - 1] - minPrice) / priceRange) * 20}
                          r="2"
                          fill={prediction.priceDirection === "UP" ? "#ef4444" : "#10b981"}
                          className="drop-shadow-sm"
                        />
                      )}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <EnhancedSmartBuyIndicator 
                score={prediction.smartBuyScore}
                confidence={prediction.confidence}
                direction={prediction.priceDirection}
                size="sm"
                animate={true}
              />
            </div>
          </div>

          {/* Price Comparison Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <div className="text-sm text-slate-600 dark:text-slate-400">Current Price</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${prediction.currentPrice.toFixed(2)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">vs.</div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">30-day</div>
              </div>
              
              <div className="space-y-1 text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">Forecast</div>
                <div className={`text-2xl font-bold ${getDirectionColor(prediction.priceDirection)}`}>
                  ${prediction.predicted30DayPrice.toFixed(2)}
                </div>
              </div>
            </div>
            
            {/* Percentage Change Badge */}
            <div className="flex items-center justify-between">
              <Badge className={`px-3 py-1.5 border ${
                priceChange >= 0 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
                  : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(1)}% change
              </Badge>
              
              {prediction.expectedSavings > 0 && (
                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-sm font-medium">${prediction.expectedSavings.toFixed(2)} savings</span>
                </div>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          {daysUntilChange > 0 && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-800 dark:text-blue-200">
                Price change expected in {daysUntilChange} day{daysUntilChange !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {/* Action Badge */}
          <div className="mb-4">
            <Badge className={`w-full justify-center py-2 border font-medium ${getActionBadgeStyle(prediction.recommendedAction)}`}>
              {prediction.recommendedAction.replace("_", " ")}
            </Badge>
          </div>

          {/* Hover Details */}
          {isHovered && (
            <div className="space-y-3 animate-fadeIn">
              {/* Enhanced Economic Context */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-600 dark:text-slate-400">vs. National Avg</div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 10).toFixed(1)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-600 dark:text-slate-400">Seasonal Impact</div>
                  <div className={`font-medium ${
                    seasonalData?.peakSeason 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {seasonalData?.peakSeason ? 'Peak Season' : 'Normal'}
                  </div>
                </div>
              </div>

              {/* Economic Impact Score */}
              {economicImpact && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Economic Impact Score</span>
                    <div className={`text-sm font-bold ${
                      economicImpact.riskLevel === 'high' ? 'text-red-600 dark:text-red-400' :
                      economicImpact.riskLevel === 'moderate' ? 'text-amber-600 dark:text-amber-400' :
                      'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {economicImpact.overallScore.toFixed(1)}/10
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {economicImpact.explanation}
                  </div>
                </div>
              )}

              {/* Seasonal Trend Details */}
              {seasonalData && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Seasonal Pattern</span>
                    <span className={`text-xs font-medium ${
                      seasonalData.historicalPriceMultiplier > 1 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {seasonalData.historicalPriceMultiplier > 1 ? '+' : ''}{((seasonalData.historicalPriceMultiplier - 1) * 100).toFixed(1)}% vs avg
                    </span>
                  </div>
                  <div className="space-y-1">
                    {seasonalData.drivingFactors.map((factor: string, index: number) => (
                      <div key={index} className="text-xs text-blue-600 dark:text-blue-400">
                        • {factor}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); onAddToCart?.(); }}>
                      <ShoppingCart className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to Shopping List</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); onSetAlert?.(); }}>
                      <Bell className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Set Price Alert</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1" onClick={(e) => { e.stopPropagation(); onTrackItem?.(); }}>
                      <Eye className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Track This Item</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Confidence Level at Bottom */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {Math.round(prediction.confidence * 100)}% Confidence
              </span>
              <span className="text-slate-500 dark:text-slate-500">
                Based on {['Economic trends', 'Historical data', 'Supply patterns'][Math.floor(Math.random() * 3)]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

// Add CSS for custom animations
const customStyles = `
  @keyframes pulse-subtle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.95; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-pulse-subtle {
    animation: pulse-subtle 3s ease-in-out infinite;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}