import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Calculator, Zap, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

interface Budget {
  id: number;
  userId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
}

interface BudgetStatus {
  status: 'on-track' | 'warning' | 'over-budget';
  color: string;
}

interface VelocityStatus {
  velocity: number;
  status: 'fast' | 'normal' | 'slow';
  message: string;
}

interface Recommendation {
  category: string;
  type: 'alert' | 'warning' | 'opportunity';
  message: string;
  potential: number;
}

export function EnhancedBudgetTracker() {
  // Mobile-safe early return for complex state
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Budget Tracker</h3>
              <p className="text-sm text-white/70">Track your spending goals</p>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-white/80 mb-4">Mobile version loading...</p>
            <div className="animate-pulse bg-white/20 h-4 rounded mb-2"></div>
            <div className="animate-pulse bg-white/20 h-4 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const [whatIfDialogOpen, setWhatIfDialogOpen] = useState(false);

  // Get current period for budget calculations
  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  const { data: budgetData, isLoading } = useQuery<Budget[]>({
    queryKey: ['/api/budgets/demo-natalia', getCurrentPeriod()],
  });

  // Calculate budget progress percentage
  const getBudgetProgress = (spent: number, budget: number): number => {
    return Math.min((spent / budget) * 100, 100);
  };

  // Determine budget status based on progress
  const getBudgetStatus = (progress: number): BudgetStatus => {
    if (progress >= 100) {
      return { status: 'over-budget', color: 'text-red-500' };
    } else if (progress >= 80) {
      return { status: 'warning', color: 'text-yellow-500' };
    }
    return { status: 'on-track', color: 'text-green-500' };
  };

  // Calculate spending velocity
  const getSpendingVelocity = (spent: number, budget: number): VelocityStatus => {
    const currentDay = new Date().getDate();
    const daysInMonth = new Date().getDate();
    const expectedSpent = (budget / 30) * currentDay;
    const velocity = spent / expectedSpent;

    if (velocity > 1.2) {
      return { velocity, status: 'fast', message: 'Spending fast' };
    } else if (velocity < 0.8) {
      return { velocity, status: 'slow', message: 'Under budget' };
    }
    return { velocity, status: 'normal', message: 'On track' };
  };

  // Generate category-based savings recommendations
  const getSavingsRecommendations = (budgetData: Budget[]): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
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

  // Generate trend data for spending patterns
  const generateSpendingTrend = (currentSpent: number, budget: number) => {
    const data = [];
    const daysInMonth = 30;
    const dailyBudget = budget / daysInMonth;
    const currentDay = new Date().getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const projected = dailyBudget * day;
      const actual = day <= currentDay ? (currentSpent / currentDay) * day : undefined;
      
      data.push({
        day,
        projected,
        actual
      });
    }
    
    return data;
  };

  if (isLoading) {
    return (
      <Card className="mb-6 sm:mb-8">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Budget Overview */}
      <Card className="glass-card pulse-orange">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  Budget Tracker
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                  Advanced spending analysis and velocity tracking
                </p>
              </div>
            </div>
            <Dialog open={whatIfDialogOpen} onOpenChange={setWhatIfDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm touch-manipulation">
                  <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">What-If</span>
                  <span className="sm:hidden">If</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:w-auto max-w-lg">
                <DialogHeader>
                  <DialogTitle>Budget What-If Scenario</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    See how budget adjustments would affect your spending goals
                  </p>
                  <div className="text-center py-8 text-slate-500">
                    What-if calculator implementation...
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {budgetData?.map((budget) => {
              const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
              const status = getBudgetStatus(progress);
              const velocity = getSpendingVelocity(budget.spentAmount, budget.budgetAmount);
              const trendData = generateSpendingTrend(budget.spentAmount, budget.budgetAmount);
              
              return (
                <div key={budget.id} className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg touch-manipulation">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      {budget.category}
                    </span>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Zap className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        velocity.status === 'fast' ? 'text-red-500' :
                        velocity.status === 'slow' ? 'text-emerald-500' : 'text-blue-500'
                      }`} />
                      <span className="text-xs text-slate-500">{velocity.velocity.toFixed(1)}x</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">
                        ${budget.spentAmount} / ${budget.budgetAmount}
                      </span>
                      <span className={status.color}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    {/* Mobile-optimized velocity indicator */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`${
                        velocity.status === 'fast' ? 'text-red-600' :
                        velocity.status === 'slow' ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {velocity.message}
                      </span>
                      <span className="text-white">
                        ${(budget.budgetAmount - budget.spentAmount).toFixed(0)} left
                      </span>
                    </div>
                    
                    {/* Condensed mobile trend chart */}
                    <div className="h-6 sm:h-8 mt-2">
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

      {/* Mobile-Optimized Savings Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                  Smart Recommendations
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
                  AI-powered savings suggestions
                </p>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className={`p-3 sm:p-4 rounded-lg border-l-4 touch-manipulation ${
                  rec.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                  rec.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' :
                  'bg-green-50 dark:bg-green-900/20 border-green-500'
                }`}>
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    {rec.type === 'alert' ? 
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" /> :
                      rec.type === 'warning' ? 
                      <TrendingDown className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" /> :
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-medium ${
                        rec.type === 'alert' ? 'text-red-800 dark:text-red-300' :
                        rec.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
                        'text-green-800 dark:text-green-300'
                      }`}>
                        {rec.category}
                      </p>
                      <p className={`text-xs sm:text-sm ${
                        rec.type === 'alert' ? 'text-red-700 dark:text-red-400' :
                        rec.type === 'warning' ? 'text-yellow-700 dark:text-yellow-400' :
                        'text-green-700 dark:text-green-400'
                      }`}>
                        {rec.message}
                      </p>
                      {rec.potential > 0 && (
                        <p className={`text-xs font-medium mt-1 ${
                          rec.type === 'alert' ? 'text-red-800 dark:text-red-300' :
                          rec.type === 'warning' ? 'text-yellow-800 dark:text-yellow-300' :
                          'text-green-800 dark:text-green-300'
                        }`}>
                          Potential: ${rec.potential.toFixed(0)}
                        </p>
                      )}
                    </div>
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