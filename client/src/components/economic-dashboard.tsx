import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { fetchEconomicData, refreshFredData } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function EconomicDashboard() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: economicData, isLoading, refetch } = useQuery({
    queryKey: ["/api/economic-data"],
    queryFn: fetchEconomicData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshFredData();
      await refetch();
      toast({
        title: "Data Updated",
        description: "Economic indicators have been refreshed from FRED API",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to refresh economic data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!economicData) {
    return (
      <div className="mb-8">
        <Card className="p-6">
          <CardContent>
            <p className="text-center text-slate-500 dark:text-slate-400">
              Unable to load economic data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Economic Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4" />
            <span>Last updated: {formatTimestamp(economicData.lastUpdated)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Updating..." : "Refresh"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Inflation Rate Card */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Inflation Rate</h3>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {economicData.inflationRate.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-red-600 dark:text-red-400">+0.2%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GDP Growth Card */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">GDP Growth</h3>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {economicData.gdpGrowth.toFixed(1)}%
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-emerald-600 dark:text-emerald-400">+0.1%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">quarterly growth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumer Price Index Card */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Consumer Price Index</h3>
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                {economicData.consumerPriceIndex.toFixed(1)}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-amber-600 dark:text-amber-400">+1.1%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">year over year</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
