import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchShoppingListData, updateShoppingListItem } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ShoppingList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: shoppingList, isLoading } = useQuery({
    queryKey: ["/api/shopping-list/1"],
    queryFn: () => fetchShoppingListData(1),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<any> }) =>
      updateShoppingListItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list/1"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update shopping list item",
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (id: number, completed: boolean) => {
    updateItemMutation.mutate({
      id,
      updates: { completed: completed ? 1 : 0 },
    });
  };

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case "BUY_NOW":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "CONSIDER":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "WAIT":
        return "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600";
      default:
        return "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600";
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case "BUY_NOW":
        return "Buy immediately - significant savings available";
      case "CONSIDER":
        return "Consider buying - prices may rise next week";
      case "WAIT":
        return "Wait 1-2 weeks - prices expected to drop";
      default:
        return "Buy when convenient";
    }
  };

  const getRecommendationTextColor = (recommendation: string) => {
    switch (recommendation) {
      case "BUY_NOW":
        return "text-red-600 dark:text-red-400";
      case "CONSIDER":
        return "text-amber-600 dark:text-amber-400";
      case "WAIT":
        return "text-slate-500 dark:text-slate-400";
      default:
        return "text-slate-500 dark:text-slate-400";
    }
  };

  // Mock shopping list data for demo (in real app this would come from API)
  const mockShoppingList = [
    {
      id: 1,
      itemName: "Eggs",
      quantity: 2,
      estimatedPrice: 5.78,
      averagePrice: 7.04,
      recommendation: "BUY_NOW",
      savings: 1.26,
      completed: 0,
      unit: "dozen"
    },
    {
      id: 2,
      itemName: "Bread",
      quantity: 3,
      estimatedPrice: 5.67,
      averagePrice: 6.75,
      recommendation: "BUY_NOW",
      savings: 1.08,
      completed: 0,
      unit: "loaves"
    },
    {
      id: 3,
      itemName: "Ground Beef",
      quantity: 2,
      estimatedPrice: 11.58,
      averagePrice: 12.18,
      recommendation: "CONSIDER",
      savings: 0.60,
      completed: 0,
      unit: "lbs"
    },
    {
      id: 4,
      itemName: "Milk",
      quantity: 1,
      estimatedPrice: 4.29,
      averagePrice: 3.83,
      recommendation: "WAIT",
      savings: -0.46,
      completed: 0,
      unit: "gallon"
    },
  ];

  const listItems = shoppingList || mockShoppingList;
  const totalOptimal = listItems.reduce((sum, item) => sum + item.estimatedPrice, 0);
  const totalAverage = listItems.reduce((sum, item) => sum + item.averagePrice, 0);
  const totalSavings = totalAverage - totalOptimal;

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Smart Shopping List
          </h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button size="sm" className="bg-primary text-white hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            {listItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${getRecommendationStyle(item.recommendation)}`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={item.completed === 1}
                    onCheckedChange={(checked) => handleItemToggle(item.id, !!checked)}
                    className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      {item.itemName} ({item.quantity} {item.unit || "units"})
                    </div>
                    <div className={`text-sm ${getRecommendationTextColor(item.recommendation)}`}>
                      {getRecommendationText(item.recommendation)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    ${item.estimatedPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    vs ${item.averagePrice.toFixed(2)} avg
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 dark:text-white">
                Total if bought optimally:
              </span>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  ${totalOptimal.toFixed(2)}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  Save ${totalSavings.toFixed(2)} vs avg timing
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
