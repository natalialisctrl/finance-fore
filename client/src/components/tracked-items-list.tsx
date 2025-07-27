import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface TrackedItem {
  id: number;
  userId: string;
  itemName: string;
  currentPrice: number;
  targetPrice?: number;
  smartBuyScore: number;
  recommendedAction: string;
  confidence: number;
  priceAlerts: number;
  createdAt: string;
  lastUpdated: string;
}

interface TrackedItemsListProps {
  userId: string;
}

export function TrackedItemsList({ userId }: TrackedItemsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trackedItems = [], isLoading } = useQuery({
    queryKey: [`/api/tracked-items/${userId}`],
  });

  const deleteTrackedItem = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/tracked-items/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tracked-items/${userId}`] });
      toast({
        title: "Item Removed",
        description: "Stopped tracking this item",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove tracked item",
        variant: "destructive",
      });
    },
  });

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "BUY_NOW": return "bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/20 dark:to-blue-900/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
      case "WAIT_1_WEEK": return "bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800";
      case "WAIT_2_WEEKS": return "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      default: return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-600";
    }
  };

  const getPriceDirection = (score: number) => {
    if (score >= 7) return { icon: TrendingUp, color: "text-green-600 dark:text-green-400" };
    if (score <= 4) return { icon: TrendingDown, color: "text-red-600 dark:text-red-400" };
    return { icon: Minus, color: "text-slate-600 dark:text-slate-400" };
  };

  if (isLoading) {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Loading Tracked Items...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (trackedItems.length === 0) {
    return (
      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Tracked Items</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400 text-center py-8">
            No items being tracked yet. Click "MONITOR" on any item in the AI Predictions to start tracking!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5" />
          <span>Tracked Items ({trackedItems.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trackedItems.map((item: TrackedItem) => {
            const { icon: DirectionIcon, color } = getPriceDirection(item.smartBuyScore);
            
            return (
              <div key={item.id} className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-xl flex items-center justify-center">
                      {item.itemName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {item.itemName}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          ${item.currentPrice.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <DirectionIcon className={`w-4 h-4 ${color}`} />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Score: {item.smartBuyScore}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={`px-3 py-1 border ${getActionBadgeStyle(item.recommendedAction)}`}>
                      {item.recommendedAction.replace("_", " ")}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTrackedItem.mutate(item.id)}
                      disabled={deleteTrackedItem.isPending}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  <span>Tracking since {new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}