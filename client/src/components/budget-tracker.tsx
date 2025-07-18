import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { fetchBudgetData } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, Target, Plus, Settings, DollarSign } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function BudgetTracker() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for budget setup dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [budgetAllocations, setBudgetAllocations] = useState({
    Groceries: "",
    Gas: "",
    Entertainment: "",
    "Dining Out": "",
    Utilities: "",
    "Health & Fitness": "",
    Shopping: "",
    "Emergency Fund": "",
    Savings: "",
    Other: ""
  });
  
  const { data: budgetData, isLoading } = useQuery({
    queryKey: ["/api/budgets/demo-natalia", currentMonth],
    queryFn: () => fetchBudgetData("demo-natalia", currentMonth),
  });

  // Mutation to update budget
  const updateBudgetMutation = useMutation({
    mutationFn: async (budgets: any[]) => {
      try {
        for (const budget of budgets) {
          const response = await apiRequest("POST", "/api/budgets", budget);
          console.log("Budget created:", response);
        }
      } catch (error) {
        console.error("Budget creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets/demo-natalia", currentMonth] });
      toast({
        title: "Budget Updated",
        description: "Your budget has been successfully updated!",
      });
      setIsDialogOpen(false);
      // Reset form
      setMonthlyIncome("");
      setBudgetAllocations({
        Groceries: "",
        Gas: "",
        Entertainment: "",
        "Dining Out": "",
        Utilities: "",
        "Health & Fitness": "",
        Shopping: "",
        "Emergency Fund": "",
        Savings: "",
        Other: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget",
        variant: "destructive",
      });
    },
  });

  const handleBudgetSubmit = () => {
    const income = parseFloat(monthlyIncome);
    if (!income || income <= 0) {
      toast({
        title: "Invalid Income",
        description: "Please enter a valid monthly income amount",
        variant: "destructive",
      });
      return;
    }

    const totalAllocated = Object.values(budgetAllocations).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);

    if (totalAllocated > income) {
      toast({
        title: "Budget Exceeds Income",
        description: `Total allocated ($${totalAllocated}) exceeds your income ($${income})`,
        variant: "destructive",
      });
      return;
    }

    // Create budget entries
    const budgets = Object.entries(budgetAllocations)
      .filter(([_, amount]) => parseFloat(amount) > 0) // Only include categories with allocated amounts
      .map(([category, amount]) => ({
        userId: "demo-natalia",
        category,
        budgetAmount: parseFloat(amount),
        spentAmount: Math.random() * parseFloat(amount) * 0.7, // Random spending for demo
        month: currentMonth,
      }));

    updateBudgetMutation.mutate(budgets);
  };

  const handleAllocationChange = (category: string, value: string) => {
    setBudgetAllocations(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getTotalAllocated = () => {
    return Object.values(budgetAllocations).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };

  const getRemainingIncome = () => {
    const income = parseFloat(monthlyIncome) || 0;
    return income - getTotalAllocated();
  };

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
    <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-8" style={{boxShadow: 'none', filter: 'drop-shadow(0 4px 8px rgba(255, 140, 66, 0.1))'}}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Budget Tracker</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Set Up Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto w-[calc(100vw-16px)] sm:w-full">
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
                  Set Up Your Monthly Budget
                </DialogTitle>
                <DialogDescription>
                  Enter your monthly income and allocate it across different expense categories
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Monthly Income Input */}
                <div className="space-y-2">
                  <Label htmlFor="income" className="text-base font-semibold">Monthly Income</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter your monthly income"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Budget Allocation Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Allocate Your Budget</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Remaining: <span className={`font-semibold ${getRemainingIncome() < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatCurrency(getRemainingIncome())}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(budgetAllocations).map(([category, amount]) => (
                      <div key={category} className="space-y-2">
                        <Label htmlFor={category} className="text-sm font-medium">{category}</Label>
                        <Input
                          id={category}
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => handleAllocationChange(category, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Income:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(monthlyIncome) || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Allocated:</span>
                    <span className="font-semibold">{formatCurrency(getTotalAllocated())}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span>Remaining:</span>
                    <span className={`font-semibold ${getRemainingIncome() < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(getRemainingIncome())}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button 
                    onClick={handleBudgetSubmit}
                    disabled={updateBudgetMutation.isPending || !monthlyIncome}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600"
                  >
                    {updateBudgetMutation.isPending ? "Setting Up..." : "Set Up Budget"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Budget Pie Chart */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">Budget Overview</h4>
            <div className="h-80 bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetData?.map((budget, index) => ({
                      name: budget.category,
                      value: budget.budgetAmount,
                      spent: budget.spentAmount,
                      remaining: budget.budgetAmount - budget.spentAmount,
                      fill: [
                        '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                        '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
                      ][index % 10]
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {budgetData?.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={[
                          '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                          '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
                        ][index % 10]}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any, name: any, props: any) => [
                      formatCurrency(value),
                      `Budget: ${formatCurrency(props.payload.spent)} spent of ${formatCurrency(value)}`
                    ]}
                    labelStyle={{ color: '#1f2937' }}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Budget Legend with Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {budgetData?.map((budget, index) => {
                const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
                const color = [
                  '#FF6B35', '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
                ][index % 10];
                
                return (
                  <div key={budget.id} className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 dark:bg-black/5">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                        {budget.category}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.budgetAmount)}
                      </div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      progress > 90 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                      progress > 75 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {progress.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Analytics & Insights */}
          <div className="space-y-6">
            {/* Spending Insights */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900 dark:text-white">Spending Insights</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      Budget pressure detected
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Inflation making it harder to stay within limits
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
                      With current inflation at 3.2%, consider increasing your grocery budget by $50/month and prioritize essential purchases over discretionary spending.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500/10 to-blue-500/10 p-4 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(budgetData?.reduce((sum, b) => sum + b.spentAmount, 0) || 0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Total Spent</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(budgetData?.reduce((sum, b) => sum + (b.budgetAmount - b.spentAmount), 0) || 0)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
