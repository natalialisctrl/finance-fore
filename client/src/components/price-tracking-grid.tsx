import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPriceData, fetchEconomicData } from "@/lib/economic-api";
import { generatePricePredictions } from "@/lib/ai-predictions";
import { EnhancedSmartBuyIndicator } from "@/components/enhanced-smart-buy-indicator";
import { EnhancedPriceAlerts } from "@/components/enhanced-price-alerts";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Calendar, TrendingUp, TrendingDown, History } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export function PriceTrackingGrid() {
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["/api/price-data"],
    queryFn: fetchPriceData,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  const { data: economicData, isLoading: isEconomicLoading } = useQuery({
    queryKey: ["/api/economic-data"],
    queryFn: fetchEconomicData,
  });

  const isLoading = isPriceLoading || isEconomicLoading;

  // Generate historical comparison data (simulated)
  const generateHistoricalData = (currentPrice: number) => {
    const data = [];
    const basePrice = currentPrice * (0.8 + Math.random() * 0.4); // Historical base
    
    for (let i = 0; i < 12; i++) {
      const variance = 0.1 * Math.sin((i / 12) * Math.PI * 2); // Seasonal pattern
      const noise = (Math.random() - 0.5) * 0.05; // Random noise
      const price = basePrice * (1 + variance + noise);
      data.push({ 
        month: i, 
        price: Math.max(0, price),
        date: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return data;
  };

  const getYearOverYearChange = (currentPrice: number, historicalData: any[]) => {
    const lastYearPrice = historicalData[historicalData.length - 1]?.price || currentPrice;
    const change = ((currentPrice - lastYearPrice) / lastYearPrice) * 100;
    return {
      percentage: change,
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      amount: Math.abs(currentPrice - lastYearPrice)
    };
  };
  
  // Generate AI predictions for Smart Buy Scores
  const predictions = priceData && economicData ? 
    generatePricePredictions(priceData, economicData) : [];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "BUY_NOW":
        return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200";
      case "CONSIDER":
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200";
      case "WAIT":
        return "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200";
    }
  };

  const getProgressColor = (recommendation: string) => {
    switch (recommendation) {
      case "BUY_NOW":
        return "bg-red-500";
      case "CONSIDER":
        return "bg-amber-500";
      case "WAIT":
        return "bg-emerald-500";
      default:
        return "bg-slate-500";
    }
  };

  const getProgressWidth = (currentPrice: number, priceRange: { min: number; max: number }) => {
    const range = priceRange.max - priceRange.min;
    const position = currentPrice - priceRange.min;
    return Math.min(Math.max((position / range) * 100, 0), 100);
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-10 w-32" />
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
      {/* Enhanced Price Alerts Component */}
      <EnhancedPriceAlerts priceData={priceData} />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Price Tracking & Recommendations
          </h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <History className="w-4 h-4" />
            <span>Historical comparison enabled</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Weekly View
          </Button>
          <Button className="bg-primary text-white hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Item to Track
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {priceData?.map((item) => {
          const prediction = predictions.find(p => p.itemName === item.itemName);
          const historicalData = generateHistoricalData(item.currentPrice);
          const yearOverYear = getYearOverYearChange(item.currentPrice, historicalData);
          
          return (
            <Card key={item.id} className="glass-card glow-continuous">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-2xl pulse-orange">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.itemName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {prediction && (
                      <EnhancedSmartBuyIndicator 
                        score={prediction.smartBuyScore}
                        confidence={prediction.confidence}
                        direction={prediction.priceDirection}
                        size="sm"
                        animate={true}
                      />
                    )}
                    <Badge className={`px-2 py-1 text-xs font-medium ${getRecommendationColor(item.recommendation)}`}>
                      {item.recommendation.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ${item.currentPrice.toFixed(2)}
                  </span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      item.percentageChange < 0 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {item.percentageChange > 0 ? '+' : ''}{item.percentageChange}% vs avg
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      30-day avg: ${item.averagePrice30Day.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Historical comparison */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    {yearOverYear.direction === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    ) : yearOverYear.direction === 'down' ? (
                      <TrendingDown className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 bg-slate-400 rounded-full" />
                    )}
                    <span className={`${
                      yearOverYear.direction === 'up' ? 'text-red-600' :
                      yearOverYear.direction === 'down' ? 'text-emerald-600' : 'text-slate-600'
                    }`}>
                      {yearOverYear.percentage > 0 ? '+' : ''}{yearOverYear.percentage.toFixed(1)}% vs last year
                    </span>
                  </div>
                </div>

                {/* Mini historical chart */}
                <div className="h-8 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke={yearOverYear.direction === 'up' ? '#ef4444' : '#10b981'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(item.recommendation)}`}
                    style={{ width: `${getProgressWidth(item.currentPrice, item.priceRange)}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Price Range</span>
                  <span className="text-slate-600 dark:text-slate-300">
                    ${item.priceRange.min.toFixed(2)} - ${item.priceRange.max.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}
