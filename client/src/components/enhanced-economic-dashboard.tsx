import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchEnhancedEconomicContext } from "@/lib/enhanced-economic-api";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Thermometer,
  Truck,
  Factory,
  MapPin,
  Clock,
  BarChart3,
  Zap,
  Users,
  Building
} from "lucide-react";

export function EnhancedEconomicDashboard() {
  const { data: economicContext, isLoading } = useQuery({
    queryKey: ["/api/enhanced-economic-context"],
    queryFn: () => fetchEnhancedEconomicContext(),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
      case "high": return "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
      case "medium": return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800";
      default: return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "extreme": return "text-red-600 dark:text-red-400";
      case "high": return "text-orange-600 dark:text-orange-400";
      case "moderate": return "text-amber-600 dark:text-amber-400";
      default: return "text-emerald-600 dark:text-emerald-400";
    }
  };

  const formatPercentage = (value: number, showSign: boolean = true) => {
    const formatted = value.toFixed(1);
    return showSign && value > 0 ? `+${formatted}%` : `${formatted}%`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!economicContext) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Enhanced Economic Context
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Regional indicators, supply chain alerts, and seasonal trends
          </p>
        </div>
      </div>

      {/* Regional Economic Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Regional Economic Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Regional Inflation</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatPercentage(economicContext.regional.regionalInflation)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">vs. National</span>
                  <span className={`font-medium ${
                    economicContext.regional.regionalInflation > economicContext.regional.nationalInflation 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {formatPercentage(economicContext.regional.regionalInflation - economicContext.regional.nationalInflation)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Unemployment</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatPercentage(economicContext.regional.unemploymentRate)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Cost of Living</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {economicContext.regional.costOfLivingIndex.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Housing Market Index</span>
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  {economicContext.regional.housingMarketIndex.toFixed(1)}
                </span>
              </div>
              <Progress 
                value={Math.min((economicContext.regional.housingMarketIndex / 200) * 100, 100)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Market Sentiment */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Market Sentiment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Consumer Confidence</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {economicContext.marketSentiment.consumerConfidence.toFixed(1)}
                  </span>
                </div>
                <Progress value={economicContext.marketSentiment.consumerConfidence} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Business Optimism</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {economicContext.marketSentiment.businessOptimism.toFixed(1)}
                  </span>
                </div>
                <Progress value={economicContext.marketSentiment.businessOptimism} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Inflation Expectations</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatPercentage(economicContext.marketSentiment.inflationExpectations)}
                  </span>
                </div>
                <Progress value={(economicContext.marketSentiment.inflationExpectations / 10) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Alerts */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Truck className="w-5 h-5" />
          <span>Supply Chain Alerts</span>
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {economicContext.supplyChainAlerts.map((alert) => (
            <Alert key={alert.id} className={`border ${getSeverityColor(alert.severity)}`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.category}</span>
                  <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm">{alert.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{alert.expectedDuration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatPercentage(alert.priceImpact)} impact</span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Affects: {alert.affectedItems.join(", ")} • {alert.region}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </div>

      {/* Economic Impact Scores */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>Economic Impact Scores</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {economicContext.economicImpactScores.map((score) => (
            <Card key={score.itemName} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{score.itemName}</h4>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getRiskColor(score.riskLevel)}`}>
                      {score.overallScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">impact</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  {Object.entries(score.factors).map(([factor, value]) => (
                    <div key={factor} className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 capitalize">
                        {factor.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={value * 100} className="w-12 h-1" />
                        <span className="text-slate-500 dark:text-slate-400 w-8">
                          {(value * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Badge className={`w-full justify-center text-xs ${
                  score.riskLevel === "high" ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200" :
                  score.riskLevel === "moderate" ? "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200" :
                  "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200"
                }`}>
                  {score.riskLevel.toUpperCase()} RISK
                </Badge>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {score.explanation}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Seasonal Trends */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Thermometer className="w-5 h-5" />
          <span>Current Seasonal Trends</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {economicContext.seasonalTrends.map((trend) => (
            <Card key={trend.itemName} className={`glass-card ${trend.peakSeason ? 'ring-2 ring-amber-200 dark:ring-amber-800' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{trend.itemName}</h4>
                  {trend.peakSeason && (
                    <Badge className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-xs">
                      PEAK
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Price vs. Average</span>
                    <span className={`font-medium ${
                      trend.historicalPriceMultiplier > 1 
                        ? 'text-red-600 dark:text-red-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {trend.historicalPriceMultiplier > 1 ? '+' : ''}{((trend.historicalPriceMultiplier - 1) * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Confidence</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {(trend.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Driving Factors:</div>
                    <div className="space-y-1">
                      {trend.drivingFactors.map((factor, index) => (
                        <div key={index} className="text-xs text-slate-500 dark:text-slate-400">
                          • {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}