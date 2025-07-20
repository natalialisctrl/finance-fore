import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
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
  aiRecommendations?: any;
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
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddDebt, setShowAddDebt] = useState(false);

  // Sample data for demonstration
  useEffect(() => {
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
          suggestedAdjustment: "Increase monthly contribution by $150 to reach goal 3 months earlier"
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
        minimumPayment: 150,
        interestRate: 4.5,
        payoffStrategy: "avalanche"
      }
    ]);
  }, []);

  const getGoalTypeColor = (type: string) => {
    const colors = {
      emergency_fund: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200",
      savings: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200",
      debt_payoff: "bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200",
      investment: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
    };
    return colors[type] || "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200";
  };

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case "credit_card": return "💳";
      case "student_loan": return "🎓";
      case "mortgage": return "🏠";
      case "personal_loan": return "💰";
      default: return "💳";
    }
  };

  const calculateMonthsToGoal = (target: number, current: number, monthly: number) => {
    if (monthly <= 0) return "N/A";
    return Math.ceil((target - current) / monthly);
  };

  const calculateDebtPayoffTime = (balance: number, payment: number, rate: number) => {
    if (payment <= 0 || rate <= 0) return "N/A";
    const monthlyRate = rate / 100 / 12;
    const months = Math.log(1 + (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate);
    return Math.ceil(months);
  };

  return (
    <div className="space-y-8">
      {/* Goals Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Financial Goals
            </h2>
          </div>
          <Button 
            onClick={() => setShowAddGoal(true)}
            className="btn-premium ripple"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const monthsLeft = calculateMonthsToGoal(goal.targetAmount, goal.currentAmount, goal.monthlyContribution);
            
            return (
              <Card key={goal.id} className="glass-card scale-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {goal.title}
                      </h3>
                      <Badge className={`${getGoalTypeColor(goal.goalType)} text-xs`}>
                        {goal.goalType.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        ${goal.currentAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        of ${goal.targetAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Progress</span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {progress.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Months Left</span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {monthsLeft} months
                      </div>
                    </div>
                  </div>

                  {goal.aiRecommendations?.suggestedAdjustment && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-2">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>AI Suggestion:</strong> {goal.aiRecommendations.suggestedAdjustment}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Debt Management Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Debt Management
            </h2>
          </div>
          <Button 
            onClick={() => setShowAddDebt(true)}
            className="btn-premium ripple"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Debt
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {debts.map((debt) => {
            const payoffMonths = calculateDebtPayoffTime(debt.currentBalance, debt.minimumPayment, debt.interestRate);
            
            return (
              <Card key={debt.id} className="glass-card scale-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDebtTypeIcon(debt.debtType)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {debt.accountName}
                        </h3>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {debt.debtType.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ${debt.currentBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {debt.interestRate}% APR
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Min Payment</span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        ${debt.minimumPayment}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Payoff Time</span>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {payoffMonths} months
                      </div>
                    </div>
                  </div>

                  <Badge className={`${debt.payoffStrategy === 'avalanche' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200' : 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200'}`}>
                    {debt.payoffStrategy.toUpperCase()} STRATEGY
                  </Badge>

                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>Tip:</strong> Consider increasing payment by $50 to save $
                        {Math.round(debt.currentBalance * 0.1)} in interest
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-pulse">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              ${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total Savings Progress
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-pulse">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              ${debts.reduce((sum, debt) => sum + debt.currentBalance, 0).toLocaleString()}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total Debt Balance
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-pulse">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {Math.round(goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0))}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Monthly Goal Contributions
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}