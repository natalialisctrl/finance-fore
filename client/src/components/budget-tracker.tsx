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
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export function BudgetTracker() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // 3D Chart Rotation State
  const [rotation, setRotation] = useState({ x: -10, y: 0, z: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);
  
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

  // 3D Touch Interaction Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setLastTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - lastTouch.x;
    const deltaY = touch.clientY - lastTouch.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
      z: prev.z
    }));
    
    setLastTouch({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse interaction for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastTouch({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastTouch.x;
    const deltaY = e.clientY - lastTouch.y;
    
    setRotation(prev => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
      z: prev.z
    }));
    
    setLastTouch({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Auto-rotation when not interacting
  useEffect(() => {
    if (isDragging) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.2
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isDragging]);

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
                    <div className="text-sm text-white">
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
          {/* 3D Interactive Budget Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-slate-900 dark:text-white">3D Budget Overview</h4>
              <div className="text-xs text-[#d4c4a0] bg-black/20 px-2 py-1 rounded-full border border-[#d4c4a0]/20">
                Touch & Drag to Rotate
              </div>
            </div>
            <div 
              ref={chartRef}
              className="h-96 bg-gradient-to-br from-[#051421]/90 to-[#051421]/70 backdrop-blur-xl rounded-xl p-6 relative overflow-hidden cursor-grab active:cursor-grabbing"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ perspective: '1000px' }}
            >
              {/* Subtle Ambient Glow */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fc304ed6]/20 to-transparent animate-pulse"></div>
              </div>
              
              {/* True 3D Chart Container */}
              <div 
                className="relative z-10 h-full flex items-center justify-center transform-gpu transition-transform duration-75"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 3D Pie Chart - Pure CSS Implementation */}
                <div className="relative w-64 h-64">
                  {budgetData?.map((budget, index) => {
                    const totalBudget = budgetData.reduce((sum, b) => sum + b.budgetAmount, 0);
                    const percentage = (budget.budgetAmount / totalBudget) * 100;
                    let cumulativePercentage = 0;
                    
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += (budgetData[i].budgetAmount / totalBudget) * 100;
                    }
                    
                    const colors = [
                      '#fc304ed6', '#d4c4a0', '#3b5998', '#f1c40f', '#2dd4bf', 
                      '#9333ea', '#f97316', '#3b82f6', '#ec4899', '#06b6d4'
                    ];
                    
                    const color = colors[index % 10];
                    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
                    const endAngle = (cumulativePercentage + percentage) * 3.6;
                    
                    return (
                      <div
                        key={budget.id}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, transparent ${startAngle}deg, ${color} ${startAngle}deg, ${color} ${endAngle}deg, transparent ${endAngle}deg)`,
                          transformStyle: 'preserve-3d',
                          transform: `translateZ(${10 + index * 4}px)`,
                          boxShadow: `0 0 20px ${color}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
                          border: `1px solid ${color}aa`,
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
                        }}
                      >
                        {/* Category Label */}
                        <div 
                          className="absolute text-xs font-bold text-white drop-shadow-lg pointer-events-none"
                          style={{
                            left: `${50 + 35 * Math.cos(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}%`,
                            top: `${50 + 35 * Math.sin(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}%`,
                            transform: 'translate(-50%, -50%) translateZ(30px)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                          }}
                        >
                          {budget.category}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* 3D Center Hub */}
                  <div 
                    className="absolute inset-1/3 bg-gradient-to-br from-[#051421] to-[#051421]/80 rounded-full border-2 border-[#fc304ed6]/60 flex items-center justify-center"
                    style={{
                      transform: 'translateZ(60px)',
                      boxShadow: '0 0 30px rgba(252, 48, 77, 0.4), inset 0 2px 8px rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#fc304ed6]">
                        {formatCurrency(budgetData?.reduce((sum, b) => sum + b.budgetAmount, 0) || 0)}
                      </div>
                      <div className="text-xs text-[#d4c4a0]">Total Budget</div>
                    </div>
                  </div>
                </div>
              
                {/* Interactive 3D Controls */}
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  <div className="w-2 h-2 bg-[#fc304ed6] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-[#051421] border border-[#d4c4a0]/50 rounded-full animate-pulse delay-200"></div>
                </div>
                
                {/* Touch Instructions */}
                <div className="absolute top-2 left-2 text-xs text-[#d4c4a0]/70">
                  {isDragging ? '🔄 Rotating...' : '👆 Touch & drag to rotate'}
                </div>
            </div>
            
            </div>
            
            {/* 3D Budget Legend with Holographic Effects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {budgetData?.map((budget, index) => {
                const progress = getBudgetProgress(budget.spentAmount, budget.budgetAmount);
                const colorInfo = [
                  { bg: '#fc304ed6', name: 'Coral', glow: 'shadow-coral' },
                  { bg: '#d4c4a0', name: 'Champagne', glow: 'shadow-champagne' },
                  { bg: '#051421', name: 'Navy', glow: 'shadow-navy' },
                  { bg: '#f1c40f', name: 'Gold', glow: 'shadow-gold' },
                  { bg: '#2dd4bf', name: 'Emerald', glow: 'shadow-emerald' },
                  { bg: '#9333ea', name: 'Purple', glow: 'shadow-purple' },
                  { bg: '#f97316', name: 'Orange', glow: 'shadow-orange' },
                  { bg: '#3b82f6', name: 'Blue', glow: 'shadow-blue' },
                  { bg: '#ec4899', name: 'Pink', glow: 'shadow-pink' },
                  { bg: '#06b6d4', name: 'Cyan', glow: 'shadow-cyan' }
                ][index % 10];
                
                return (
                  <div key={budget.id} className="group relative">
                    {/* Holographic Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#051421]/30 via-[#051421]/20 to-[#051421]/30 rounded-lg blur-sm group-hover:blur-none transition-all duration-300"></div>
                    
                    <div className="relative flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-sm border border-[#d4c4a0]/20 hover:border-[#fc304ed6]/40 transition-all duration-300">
                      {/* 3D Color Indicator */}
                      <div className="relative flex-shrink-0">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg relative overflow-hidden"
                          style={{ 
                            backgroundColor: colorInfo.bg,
                            boxShadow: `0 0 12px ${colorInfo.bg}40, inset 0 1px 2px rgba(255,255,255,0.3)`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-full"></div>
                        </div>
                        <div className="absolute -inset-1 rounded-full animate-ping opacity-20" style={{ backgroundColor: colorInfo.bg }}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate flex items-center gap-2">
                          {budget.category}
                          <div className="text-xs text-[#d4c4a0] font-mono bg-black/30 px-1 rounded">
                            {colorInfo.name}
                          </div>
                        </div>
                        <div className="text-xs text-[#d4c4a0] font-mono">
                          {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.budgetAmount)}
                        </div>
                      </div>
                      
                      {/* 3D Progress Badge */}
                      <div className={`relative text-xs px-3 py-1 rounded-full font-bold transition-all duration-300 ${
                        progress > 90 ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30' :
                        progress > 75 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white shadow-lg shadow-yellow-500/30' :
                        'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20 rounded-full"></div>
                        <span className="relative">{progress.toFixed(0)}%</span>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#fc304ed6]/0 via-[#fc304ed6]/5 to-[#fc304ed6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Spending Analytics & Insights */}
          <div className="space-y-4 text-justify bg-[#04050a00]">
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
                    <div className="text-xs text-white">
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
                    <div className="text-xs text-white">
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
                    <div className="text-xs text-white">
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
                <div className="text-xs text-white">Total Spent</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-lg">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(budgetData?.reduce((sum, b) => sum + (b.budgetAmount - b.spentAmount), 0) || 0)}
                </div>
                <div className="text-xs text-white">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
