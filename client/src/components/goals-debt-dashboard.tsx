import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingDown, Calendar, Plus, DollarSign, AlertTriangle } from "lucide-react";

interface FinancialGoal {
  id: number;
  title: string;
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  priority: number;
  status: string;
  aiRecommendations?: {
    suggestedAdjustment: string;
  };
}

interface DebtAccount {
  id: number;
  accountName: string;
  debtType: string;
  currentBalance: number;
  minimumPayment: number;
  interestRate: number;
  payoffStrategy: string;
}

export function GoalsDebtDashboard() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [debts, setDebts] = useState<DebtAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe data loading with error handling
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setGoals([
          {
            id: 1,
            title: "Emergency Fund",
            goalType: "emergency_fund",
            targetAmount: 10000,
            currentAmount: 3500,
            targetDate: "2025-12-31",
            monthlyContribution: 500,
            priority: 1,
            status: "active",
            aiRecommendations: {
              suggestedAdjustment: "Increase monthly contribution by $150"
            }
          },
          {
            id: 2,
            title: "Vacation Fund",
            goalType: "savings",
            targetAmount: 5000,
            currentAmount: 1200,
            targetDate: "2025-06-01",
            monthlyContribution: 400,
            priority: 2,
            status: "active"
          }
        ]);

        setDebts([
          {
            id: 1,
            accountName: "Credit Card - Chase",
            debtType: "credit_card",
            currentBalance: 2500,
            minimumPayment: 75,
            interestRate: 18.99,
            payoffStrategy: "avalanche"
          },
          {
            id: 2,
            accountName: "Student Loan",
            debtType: "student_loan",
            currentBalance: 15000,
            minimumPayment: 200,
            interestRate: 4.5,
            payoffStrategy: "avalanche"
          }
        ]);

        setIsLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error loading goals/debts:", err);
      setError("Failed to load data");
      setIsLoading(false);
    }
  }, []);

  // Safe calculation functions
  const getProgressPercentage = (current: number, target: number): number => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getMonthsToGoal = (current: number, target: number, monthly: number): number => {
    if (!monthly || monthly <= 0) return 999;
    const remaining = target - current;
    return Math.ceil(remaining / monthly);
  };

  const getPayoffTime = (balance: number, payment: number, rate: number): number => {
    if (!payment || payment <= 0) return 999;
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return Math.ceil(balance / payment);
    return Math.ceil(-Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate));
  };

  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-white">Unable to load goals and debt data</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 touch-manipulation"
            size="sm"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-white">Loading goals and debts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Goals Section */}
      <Card className="glass-card pulse-orange">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Financial Goals</h3>
                <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Track your savings objectives</p>
              </div>
            </div>
            <Button size="sm" className="touch-manipulation text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Add Goal</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const monthsLeft = getMonthsToGoal(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
              
              return (
                <div key={goal.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 touch-manipulation">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white text-sm sm:text-base">{goal.title}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {goal.priority === 1 ? 'High' : goal.priority === 2 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm text-white/80">
                      <span>${goal.currentAmount.toLocaleString()}</span>
                      <span>${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex justify-between items-center text-xs text-white/70">
                      <span>{progress.toFixed(0)}% complete</span>
                      <span>{monthsLeft} months left</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/60">Monthly: ${goal.monthlyContribution}</span>
                      <Calendar className="w-3 h-3 text-white/60" />
                    </div>
                    
                    {goal.aiRecommendations && (
                      <div className="bg-blue-500/20 p-2 rounded text-xs text-blue-200">
                        💡 {goal.aiRecommendations.suggestedAdjustment}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Debt Section */}
      <Card className="glass-card">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Debt Management</h3>
                <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Payoff strategy tracking</p>
              </div>
            </div>
            <Button size="sm" className="touch-manipulation text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Add Debt</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {debts.map((debt) => {
              const payoffMonths = getPayoffTime(debt.currentBalance, debt.minimumPayment, debt.interestRate);
              
              return (
                <div key={debt.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 touch-manipulation">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white text-sm sm:text-base">{debt.accountName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {debt.debtType.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Balance:</span>
                      <span className="text-red-400 font-semibold">${debt.currentBalance.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Min Payment: ${debt.minimumPayment}</span>
                      <span>{debt.interestRate}% APR</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-white/70">
                      <span>Payoff: {payoffMonths > 999 ? '∞' : payoffMonths} months</span>
                      <span className="capitalize">{debt.payoffStrategy}</span>
                    </div>
                    
                    <div className="bg-red-500/20 p-2 rounded text-xs text-red-200">
                      💡 Consider increasing payment by $50 to save 8 months
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg sm:text-xl font-bold text-red-400">
                  ${debts.reduce((sum, debt) => sum + debt.currentBalance, 0).toLocaleString()}
                </div>
                <div className="text-xs text-white/70">Total Debt</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  ${debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)}
                </div>
                <div className="text-xs text-white/70">Monthly Payments</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}