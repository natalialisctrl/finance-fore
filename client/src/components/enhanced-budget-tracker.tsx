import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { fetchBudgetData } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, TrendingUp, Target, Zap, Calculator, DollarSign, Calendar } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

interface WhatIfScenario {
  categoryChanges: { [key: string]: number };
  description: string;
}

export function EnhancedBudgetTracker() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [whatIfDialogOpen, setWhatIfDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  
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

  // Calculate spending velocity (rate of spending compared to time passed in month)
  const getSpendingVelocity = (spent: number, budget: number) => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthProgress = dayOfMonth / daysInMonth;
    
    const expectedSpending = budget * monthProgress;
    const actualSpending = spent;
    
    if (expectedSpending === 0) return { status: "on-track", velocity: 1, message: "Month just started" };
    
    const velocity = actualSpending / expectedSpending;
    
    if (velocity > 1.2) return { status: "fast", velocity, message: "Spending faster than planned" };
    if (velocity < 0.8) return { status: "slow", velocity, message: "Spending slower than planned" };
    return { status: "on-track", velocity, message: "On track with budget" };
  };

  // Generate category-based savings recommendations
  const getSavingsRecommendations = (budgetData: any[]) => {
    const recommendations = [];
    
    budgetData.forEach(budget => {
      const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
      const velocity = getSpendingVelocity(budget.spentAmount, budget.budgetAmount);
      
      if (progress > 80) {
        recommendations.push({
          category: budget.category,
          type: "alert",
          message: `Consider reducing ${budget.category.toLowerCase()} spending this month`,
          potential: budget.spentAmount - budget.budgetAmount * 0.8
        });
      } else if (velocity.velocity > 1.15) {
        recommendations.push({
          category: budget.category,
          type: "warning", 
          message: `${budget.category} spending pace is high - consider slowing down`,
          potential: (velocity.velocity - 1) * budget.budgetAmount * 0.5
        });
      } else if (progress < 60 && velocity.velocity < 0.9) {
        recommendations.push({
          category: budget.category,
          type: "opportunity",
          message: `Great job on ${budget.category.toLowerCase()}! Consider reallocating some budget`,
          potential: (budget.budgetAmount * 0.7) - budget.spentAmount
        });
      }
    });
    
    return recommendations;
  };

  // What-if scenario calculator
  const calculateWhatIf = (scenario: WhatIfScenario) => {
    if (!budgetData) return null;
    
    return budgetData.map(budget => {
      const change = scenario.categoryChanges[budget.category] || 0;
      const newBudget = budget.budgetAmount + change;
      const newProgress = getBudgetProgress(budget.spentAmount, newBudget);
      
      return {
        ...budget,
        originalBudget: budget.budgetAmount,
        newBudget,
        change,
        newProgress,
        improvement: getBudgetProgress(budget.spentAmount, budget.budgetAmount) - newProgress
      };
    });
  };

  // Generate trend data for spending patterns
  const generateSpendingTrend = (currentSpent: number, budget: number) => {
    const data = [];
    const daysInMonth = 30;
    const dailyBudget = budget / daysInMonth;
    const currentDay = new Date().getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      let projected = dailyBudget * day;
      let actual = day <= currentDay ? (currentSpent / currentDay) * day : null;
      
      data.push({
        day,
        projected,
        actual: actual || undefined
      });
    }
    
    return data;
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

  const recommendations = budgetData ? getSavingsRecommendations(budgetData) : [];

  return (
    <div className="space-y-6">
      {/* Enhanced Budget Overview */}
      <Card className="glass-card pulse-orange">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center pulse-orange">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Enhanced Budget Tracker
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Advanced spending analysis and velocity tracking
                </p>
              </div>
            </div>
            <Dialog open={whatIfDialogOpen} onOpenChange={setWhatIfDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>What-If</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Budget What-If Scenario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    See how budget adjustments would affect your spending goals
                  </p>
                  {/* What-if calculator content would go here */}
                  <div className="text-center py-8 text-slate-500">
                    What-if calculator implementation...
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {budgetData?.map((budget) => {
              const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
              const status = getBudgetStatus(progress);
              const velocity = getSpendingVelocity(budget.spentAmount, budget.budgetAmount);
              const trendData = generateSpendingTrend(budget.spentAmount, budget.budgetAmount);
              
              return (
                <div key={budget.id} className="space-y-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white">
                      {budget.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${
                        velocity.status === 'fast' ? 'text-red-500' :
                        velocity.status === 'slow' ? 'text-emerald-500' : 'text-blue-500'
                      }`} />
                      <span className="text-xs text-slate-500">{velocity.velocity.toFixed(1)}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        ${budget.spentAmount} / ${budget.budgetAmount}
                      </span>
                      <span className={status.color}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    {/* Spending velocity indicator */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`${
                        velocity.status === 'fast' ? 'text-red-600' :
                        velocity.status === 'slow' ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {velocity.message}
                      </span>
                      <span className="text-slate-500">
                        ${(budget.budgetAmount - budget.spentAmount).toFixed(0)} left
                      </span>
                    </div>
                    
                    {/* Mini trend chart */}
                    <div className="h-8 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData.slice(0, new Date().getDate())}>
                          <Line 
                            type="monotone" 
                            dataKey="projected" 
                            stroke="#ffffff" 
                            strokeWidth={1} 
                            strokeDasharray="3 3"
                            dot={false}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="actual" 
                            stroke={velocity.status === 'fast' ? '#ef4444' : velocity.status === 'slow' ? '#10b981' : '#3b82f6'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Savings Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass-card glow-continuous">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Smart Savings Recommendations
              </h4>
            </div>
            
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      rec.type === 'alert' ? 'bg-red-500' :
                      rec.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {rec.message}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {rec.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      ${rec.potential.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-500">potential</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}