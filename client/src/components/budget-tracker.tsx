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
    <Card className="relative group bg-gradient-to-br from-black/20 via-slate-900/10 to-black/30 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] hover:shadow-[0_35px_80px_-15px_rgba(252,48,77,0.3)] transition-all duration-700 overflow-hidden mb-8 animate-[fadeInUp_1s_ease-out]">
      {/* Futuristic Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fc304ed6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      <div className="absolute -inset-1 bg-gradient-to-r from-[#fc304ed6]/20 via-transparent to-[#d4c4a0]/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-1000"></div>
      
      {/* Floating Particle System */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse opacity-30 delay-500"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping opacity-10 delay-1000"></div>
      </div>
      
      <CardContent className="relative p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-light tracking-wide bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent flex items-center gap-4">
            <div className="w-3 h-10 bg-gradient-to-b from-[#fc304ed6] to-[#d4c4a0] rounded-full animate-pulse shadow-lg shadow-[#fc304ed6]/50"></div>
            Budget Intelligence
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="group relative bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0]/80 to-[#fc304ed6] text-white font-medium px-6 py-3 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(252,48,77,0.4)] border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Initialize Budget
                </div>
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
            <div className="h-96 bg-gradient-to-br from-black/40 via-slate-900/20 to-black/60 backdrop-blur-2xl rounded-2xl p-8 relative overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group hover:shadow-[0_25px_60px_rgba(252,48,77,0.2)] transition-all duration-500">
              {/* Advanced Holographic Effects */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fc304ed6]/10 to-transparent animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4c4a0]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#fc304ed6]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite_reverse]"></div>
              </div>
              
              {/* Floating Data Points */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping opacity-30"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse opacity-40 delay-700"></div>
                <div className="absolute top-1/2 left-8 w-1 h-1 bg-white rounded-full animate-ping opacity-20 delay-1500"></div>
              </div>
              
              {/* 3D Interactive Chart Container */}
              <div className="relative z-10 h-full perspective-1000">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {/* 3D Gradient Definitions */}
                      <linearGradient id="champagne3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f4e9d1" />
                        <stop offset="50%" stopColor="#d4c4a0" />
                        <stop offset="100%" stopColor="#b8a882" />
                      </linearGradient>
                      <linearGradient id="coral3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff5a4a" />
                        <stop offset="50%" stopColor="#fc304ed6" />
                        <stop offset="100%" stopColor="#e02d42" />
                      </linearGradient>
                      <linearGradient id="navy3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1a2536" />
                        <stop offset="50%" stopColor="#051421" />
                        <stop offset="100%" stopColor="#030b12" />
                      </linearGradient>
                      <linearGradient id="gold3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffd700" />
                        <stop offset="50%" stopColor="#f1c40f" />
                        <stop offset="100%" stopColor="#d4af37" />
                      </linearGradient>
                      <linearGradient id="emerald3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#50e3c2" />
                        <stop offset="50%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#14b8a6" />
                      </linearGradient>
                      <linearGradient id="purple3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="50%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <linearGradient id="orange3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                      <linearGradient id="blue3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                      <linearGradient id="darkgreen3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#166534" />
                        <stop offset="100%" stopColor="#14532d" />
                      </linearGradient>
                      <linearGradient id="cyan3D" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                      
                      {/* 3D Shadow Effects */}
                      <filter id="shadow3D">
                        <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#000000" floodOpacity="0.6"/>
                      </filter>
                      <filter id="glow3D">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    <Pie
                      data={budgetData?.map((budget, index) => ({
                        name: budget.category,
                        value: budget.budgetAmount,
                        spent: budget.spentAmount,
                        remaining: budget.budgetAmount - budget.spentAmount,
                        fill: [
                          'url(#coral3D)', 'url(#champagne3D)', 'url(#navy3D)', 'url(#gold3D)', 'url(#emerald3D)',
                          'url(#purple3D)', 'url(#orange3D)', 'url(#blue3D)', 'url(#darkgreen3D)', 'url(#cyan3D)'
                        ][index % 10]
                      }))}
                      cx="50%"
                      cy="45%"
                      startAngle={90}
                      endAngle={450}
                      innerRadius={60}
                      outerRadius={130}
                      paddingAngle={3}
                      dataKey="value"
                      className="transform-gpu transition-transform duration-300 hover:scale-105"
                      style={{
                        filter: 'drop-shadow(0 8px 16px rgba(252, 48, 77, 0.3))',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {budgetData?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={[
                            'url(#coral3D)', 'url(#champagne3D)', 'url(#navy3D)', 'url(#gold3D)', 'url(#emerald3D)',
                            'url(#purple3D)', 'url(#orange3D)', 'url(#blue3D)', 'url(#darkgreen3D)', 'url(#cyan3D)'
                          ][index % 10]}
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth={2}
                          filter="url(#shadow3D)"
                          className="transition-all duration-300 hover:brightness-110"
                        />
                      ))}
                    </Pie>
                    
                    {/* Clean, Readable Tooltip */}
                    <Tooltip 
                      formatter={(value: any, name: any, props: any) => [
                        `Budget: ${formatCurrency(value)}`,
                        `Spent: ${formatCurrency(props.payload.spent)}`,
                        `Remaining: ${formatCurrency(props.payload.remaining)}`
                      ]}
                      labelFormatter={(label: any, payload: any) => {
                        if (payload && payload.length > 0) {
                          return payload[0].payload.name;
                        }
                        return label;
                      }}
                      labelStyle={{ 
                        color: '#e5e7eb', 
                        fontWeight: '600',
                        fontSize: '15px',
                        marginBottom: '8px'
                      }}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.92)',
                        border: '1px solid rgba(252, 48, 77, 0.6)',
                        borderRadius: '10px',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.7)',
                        color: '#d1d5db',
                        fontSize: '13px',
                        fontWeight: '500',
                        padding: '10px'
                      }}
                      itemStyle={{
                        color: '#d1d5db',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                      cursor={{ fill: 'rgba(252, 48, 77, 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                
              </div>
              

            </div>
            
            {/* Advanced AI Network Data Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-52 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#fc304ed6]/30">
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
                  { bg: '#166534', name: 'Dark Green', glow: 'shadow-green' },
                  { bg: '#06b6d4', name: 'Cyan', glow: 'shadow-cyan' }
                ][index % 10];
                
                return (
                  <div key={budget.id} className="group relative animate-[fadeInUp_0.8s_ease-out] hover:scale-[1.02] transition-all duration-300" style={{animationDelay: `${index * 100}ms`}}>
                    {/* AI Data Streams */}
                    <div className="absolute -inset-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute top-1/2 -left-3 w-6 h-[1px] bg-gradient-to-r from-transparent via-[#fc304ed6]/60 to-transparent animate-pulse"></div>
                      <div className="absolute top-1/2 -right-3 w-6 h-[1px] bg-gradient-to-l from-transparent via-[#d4c4a0]/60 to-transparent animate-pulse delay-300"></div>
                      <div className="absolute -top-3 left-1/2 w-[1px] h-6 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse delay-500"></div>
                    </div>
                    
                    {/* Advanced Holographic Container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-slate-900/15 to-black/50 rounded-xl blur-sm group-hover:blur-none transition-all duration-500 animate-[hologramFlicker_4s_ease-in-out_infinite]"></div>
                    
                    <div className="relative flex items-center space-x-4 p-4 rounded-xl glass-morphism hover:neo-brutalism-card transition-all duration-500 group-hover:animate-[glowPulse_2s_ease-in-out_infinite]">
                      {/* Quantum Data Orb */}
                      <div className="relative flex-shrink-0">
                        <div 
                          className="w-5 h-5 rounded-full shadow-2xl relative overflow-hidden border border-white/20 animate-[glowPulse_3s_ease-in-out_infinite]"
                          style={{ 
                            backgroundColor: colorInfo.bg,
                            boxShadow: `0 0 20px ${colorInfo.bg}60, inset 0 2px 4px rgba(255,255,255,0.2), 0 0 40px ${colorInfo.bg}30`
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/30 rounded-full"></div>
                          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                        </div>
                        <div className="absolute -inset-2 rounded-full animate-ping opacity-20" style={{ backgroundColor: colorInfo.bg }}></div>
                        <div className="absolute -inset-3 rounded-full border border-white/10 animate-pulse opacity-30"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-light text-white truncate flex items-center gap-3 mb-1">
                          <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent font-medium">
                            {budget.category}
                          </span>
                          <div className="text-xs text-[#d4c4a0] font-mono bg-black/40 px-2 py-1 rounded-full border border-[#d4c4a0]/20 backdrop-blur-sm">
                            {colorInfo.name}
                          </div>
                        </div>
                        <div className="text-xs text-[#d4c4a0] font-mono opacity-80 flex items-center gap-2">
                          <span className="bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] w-2 h-[1px] rounded-full animate-pulse"></span>
                          {formatCurrency(budget.spentAmount)} of {formatCurrency(budget.budgetAmount)}
                        </div>
                      </div>
                      
                      {/* Quantum Progress Indicator */}
                      <div className={`relative text-xs px-4 py-2 rounded-xl font-medium transition-all duration-500 backdrop-blur-sm border ${
                        progress > 90 ? 'bg-gradient-to-r from-red-600/80 to-red-500/80 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-400/30' :
                        progress > 75 ? 'bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] border-yellow-400/30' :
                        'bg-gradient-to-r from-emerald-600/80 to-emerald-500/80 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-emerald-400/30'
                      } hover:scale-110 group-hover:animate-pulse`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 rounded-xl"></div>
                        <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-50"></div>
                        <span className="relative font-mono">{progress.toFixed(0)}%</span>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#fc304ed6]/0 via-[#fc304ed6]/5 to-[#fc304ed6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced AI Analytics Matrix */}
          <div className="space-y-6">
            {/* AI Insights Panel */}
            <div className="space-y-4">
              <h4 className="font-light text-xl bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-2 h-6 bg-gradient-to-b from-[#fc304ed6] to-[#d4c4a0] rounded-full animate-pulse"></div>
                AI Intelligence Feed
              </h4>
              <div className="space-y-4">
                <div className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-1 animate-pulse shadow-lg shadow-amber-500/50"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1">
                        Economic Pressure Detected
                      </div>
                      <div className="text-xs text-[#d4c4a0] opacity-90 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] w-3 h-[1px] rounded-full animate-pulse"></span>
                        Inflation trends affecting budget stability
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: '100ms'}}>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full mt-1 animate-ping shadow-lg shadow-red-500/50"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1">
                        Energy Cost Spike Alert
                      </div>
                      <div className="text-xs text-[#d4c4a0] opacity-90 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] w-3 h-[1px] rounded-full animate-pulse"></span>
                        Strategic bulk purchasing recommended
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative glass-morphism p-4 rounded-xl hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: '200ms'}}>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mt-1 animate-pulse shadow-lg shadow-blue-500/50"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-1">
                        Optimal Purchase Window
                      </div>
                      <div className="text-xs text-[#d4c4a0] opacity-90 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] w-3 h-[1px] rounded-full animate-pulse"></span>
                        Market analysis suggests next week optimal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Strategic Recommendations */}
            <div className="space-y-4">
              <h4 className="font-light text-xl bg-gradient-to-r from-white via-slate-200 to-[#d4c4a0] bg-clip-text text-transparent flex items-center gap-3">
                <div className="w-2 h-6 bg-gradient-to-b from-[#fc304ed6] to-[#d4c4a0] rounded-full animate-pulse"></div>
                Strategic Optimization
              </h4>
              <div className="relative glass-morphism p-6 rounded-xl hover:neo-brutalism-card transition-all duration-500 overflow-hidden group animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: '300ms'}}>
                {/* Background Data Stream */}
                <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#fc304ed6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-2 right-2 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
                  <div className="absolute top-6 right-4 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-300"></div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <AlertCircle className="w-6 h-6 text-[#fc304ed6] animate-pulse" />
                    <div className="absolute -inset-1 border border-[#fc304ed6]/30 rounded-full animate-ping"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] bg-clip-text text-transparent mb-2">
                      Economic Adjustment Protocol
                    </div>
                    <div className="text-xs text-[#d4c4a0] opacity-90 leading-relaxed">
                      Current inflation rate at 3.2% suggests budget optimization: increase grocery allocation by $50/month, prioritize essential spending categories, and implement strategic purchase timing for maximum efficiency.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantum Financial Dashboard */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group glass-morphism p-6 rounded-xl hover:neo-brutalism-card transition-all duration-500 overflow-hidden animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: '400ms'}}>
                {/* Floating Data Points */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping opacity-30"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse opacity-40"></div>
                
                <div className="text-2xl font-light bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] bg-clip-text text-transparent mb-2">
                  {formatCurrency(budgetData?.reduce((sum, b) => sum + b.spentAmount, 0) || 0)}
                </div>
                <div className="text-xs text-[#d4c4a0] font-mono opacity-80 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-[#fc304ed6] to-[#d4c4a0] w-4 h-[1px] rounded-full animate-pulse"></span>
                  Total Expenditure
                </div>
              </div>
              <div className="relative group glass-morphism p-6 rounded-xl hover:neo-brutalism-card transition-all duration-500 overflow-hidden animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: '500ms'}}>
                {/* Floating Data Points */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse opacity-40"></div>
                
                <div className="text-2xl font-light bg-gradient-to-r from-emerald-400 to-[#d4c4a0] bg-clip-text text-transparent mb-2">
                  {formatCurrency(budgetData?.reduce((sum, b) => sum + (b.budgetAmount - b.spentAmount), 0) || 0)}
                </div>
                <div className="text-xs text-[#d4c4a0] font-mono opacity-80 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-emerald-400 to-[#d4c4a0] w-4 h-[1px] rounded-full animate-pulse"></span>
                  Available Balance
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
