import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchBudgetData } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Target } from "lucide-react";

export function BudgetTracker() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  const { data: budgetData, isLoading } = useQuery({
    queryKey: ["/api/budgets/1", currentMonth],
    queryFn: () => fetchBudgetData(1, currentMonth),
  });

  const getBudgetProgress = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getBudgetStatus = (progress: number) => {
    if (progress >= 90) return { color: "text-red-600 dark:text-red-400", bg: "bg-red-500" };
    if (progress >= 75) return { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500" };
    return { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" };
  };

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Budget Tracker</h3>
          <Button variant="outline" size="sm">
            Edit Budget
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Budget Overview */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">Monthly Budget</h4>
            {budgetData?.map((budget) => {
              const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
              const status = getBudgetStatus(progress);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {budget.category}
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      ${budget.spentAmount} / ${budget.budgetAmount}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              );
            })}
          </div>

          {/* Spending Insights */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">Spending Insights</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    On track this month
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    You're 15% under budget so far
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Gas budget alert
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Consider bulk buying when prices drop
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    Optimal buying window
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Next week ideal for grocery stock-up
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">Smart Recommendations</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Inflation Adjustment
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    With current inflation at 3.7%, consider increasing your grocery budget by $25/month and stocking up on non-perishables this week.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
