import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Target, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BudgetCategory {
  name: string;
  currentAmount: number;
  suggestedAmount: number;
  priority: 'essential' | 'important' | 'optional';
  reasoning: string;
}

interface BudgetRedistributionResult {
  redistributedBudget: BudgetCategory[];
  monthlySavings: number;
  emergencyFundTarget: number;
  debtPayoffStrategy: string[];
  investmentStrategy: string[];
  riskAssessment: string;
  actionPlan: string[];
  confidence: number;
}

interface ScenarioInput {
  scenarioType: string;
  incomeChange: number;
  additionalExpenses?: { [key: string]: number };
  timeframe: number;
  currentBudget: { [category: string]: number };
  totalIncome: number;
  description: string;
}

interface AIBudgetRedistributionProps {
  scenario: {
    id: string;
    title: string;
    type: string;
    monthlyChange: number;
    duration: number;
    description: string;
  };
  onClose?: () => void;
}

export function AIBudgetRedistribution({ scenario, onClose }: AIBudgetRedistributionProps) {
  const [activeTab, setActiveTab] = useState("budget");
  const { toast } = useToast();

  // Sample current budget - in real app, this would come from user's actual budget
  const currentBudget = {
    "Housing": 1800,
    "Food & Dining": 600,
    "Transportation": 400,
    "Utilities": 250,
    "Insurance": 300,
    "Healthcare": 200,
    "Entertainment": 350,
    "Personal Care": 150,
    "Shopping": 300,
    "Savings": 500,
    "Emergency Fund": 200
  };

  const scenarioInput: ScenarioInput = {
    scenarioType: scenario.type === 'income_change' ? (scenario.monthlyChange > 0 ? 'pay_raise' : 'job_loss') : 
                  scenario.type === 'major_purchase' ? 'major_purchase' : 
                  scenario.type === 'economic_shift' ? 'economic_downturn' : 'pay_raise',
    incomeChange: scenario.monthlyChange,
    timeframe: scenario.duration,
    currentBudget,
    totalIncome: 5500, // Sample total income
    description: scenario.description
  };

  const redistributionMutation = useMutation({
    mutationFn: async (input: ScenarioInput) => {
      return await apiRequest("/api/budget-redistribution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }) as BudgetRedistributionResult;
    },
    onError: (error) => {
      console.error("Error getting budget redistribution:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze budget redistribution",
        variant: "destructive",
      });
    },
  });

  const { data: redistribution, isLoading } = redistributionMutation.data ? 
    { data: redistributionMutation.data, isLoading: false } : 
    { data: null, isLoading: redistributionMutation.isPending };

  const handleAnalyze = () => {
    redistributionMutation.mutate(scenarioInput);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'important': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'optional': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getChangeIcon = (current: number, suggested: number) => {
    if (suggested > current) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (suggested < current) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <ArrowRight className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden">
      {/* AI Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
        <div className="absolute top-6 right-8 w-1 h-1 bg-[#f39c12] rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-12 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#fc304ed6] via-[#f39c12] to-[#f1c40f] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative">
              <Brain className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h3 className="headline text-white text-xl">AI Budget Redistribution</h3>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Target className="w-3 h-3" />
                <span>Scenario: {scenario.title}</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!redistribution && (
              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="btn-coral text-xs px-4 py-2 rounded-2xl shadow-lg border border-white/20"
              >
                <Brain className="w-3 h-3 mr-1" />
                {isLoading ? "Analyzing..." : "Analyze Budget"}
              </Button>
            )}
            {onClose && (
              <Button
                variant="outline"
                onClick={onClose}
                className="border-white/30 text-white hover:bg-white/10 text-xs px-3 py-2 rounded-2xl"
              >
                Close
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 mx-auto mb-4 animate-pulse text-[#fc304ed6]" />
            <p className="text-white text-lg mb-2">AI Analyzing Your Budget...</p>
            <p className="text-white/60 text-sm">Processing scenario and optimizing allocations</p>
            <div className="mt-6 max-w-md mx-auto">
              <Progress value={85} className="h-2 bg-black/50 border border-white/20" />
            </div>
          </div>
        )}

        {/* Results */}
        {redistribution && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-white/20">
              <TabsTrigger value="budget" className="data-[state=active]:bg-[#fc304ed6]/20 text-white text-xs">
                Budget
              </TabsTrigger>
              <TabsTrigger value="strategy" className="data-[state=active]:bg-[#fc304ed6]/20 text-white text-xs">
                Strategy
              </TabsTrigger>
              <TabsTrigger value="risks" className="data-[state=active]:bg-[#fc304ed6]/20 text-white text-xs">
                Risks
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-[#fc304ed6]/20 text-white text-xs">
                Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="budget" className="space-y-4 mt-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-lg font-bold gradient-coral">${redistribution.monthlySavings}</div>
                    <div className="text-xs text-white/70">Monthly Savings</div>
                    <div className="text-xs text-[#d4c4a0] mt-1">● AI Optimized</div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
                    <div className="text-lg font-bold gradient-coral-navy">{redistribution.confidence}%</div>
                    <div className="text-xs text-white/70">Confidence</div>
                    <div className="text-xs text-[#d4c4a0] mt-1">● High Accuracy</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {redistribution.redistributedBudget.map((category, index) => {
                    const changePercent = category.currentAmount > 0 ? 
                      ((category.suggestedAmount - category.currentAmount) / category.currentAmount * 100) : 0;
                    
                    return (
                      <div key={index} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium text-sm">{category.name}</span>
                            <Badge className={`text-xs ${getPriorityColor(category.priority)}`}>
                              {category.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getChangeIcon(category.currentAmount, category.suggestedAmount)}
                            <span className={`text-sm font-mono ${
                              category.suggestedAmount > category.currentAmount ? 'text-green-400' : 
                              category.suggestedAmount < category.currentAmount ? 'text-red-400' : 'text-white'
                            }`}>
                              {changePercent > 0 ? '+' : ''}{changePercent.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">${category.currentAmount}</span>
                          <span className="text-white font-medium">${category.suggestedAmount}</span>
                        </div>
                        
                        <Progress 
                          value={(category.suggestedAmount / Math.max(category.currentAmount, category.suggestedAmount)) * 100} 
                          className="h-2 bg-black/50 border border-white/20 mb-2"
                        />
                        
                        <p className="text-xs text-white/60">{category.reasoning}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4 mt-6">
              <div className="grid gap-6">
                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-[#fc304ed6]" />
                    Emergency Fund Target
                  </h4>
                  <div className="text-2xl font-bold gradient-coral mb-2">${redistribution.emergencyFundTarget.toLocaleString()}</div>
                  <p className="text-white/60 text-sm">Recommended emergency fund based on your adjusted income</p>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-[#f39c12]" />
                    Debt Payoff Strategy
                  </h4>
                  <div className="space-y-2">
                    {redistribution.debtPayoffStrategy.map((strategy, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-[#d4c4a0]" />
                    Investment Strategy
                  </h4>
                  <div className="space-y-2">
                    {redistribution.investmentStrategy.map((strategy, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{strategy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risks" className="space-y-4 mt-6">
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Risk Assessment
                </h4>
                <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="text-white/90 leading-relaxed">{redistribution.riskAssessment}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-6">
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-[#fc304ed6]" />
                  Implementation Plan
                </h4>
                <div className="space-y-3">
                  {redistribution.actionPlan.map((action, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg border border-white/10">
                      <div className="w-6 h-6 bg-[#fc304ed6] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-white/90 text-sm">{action}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Button className="btn-coral flex-1">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply Budget Changes
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Save as Draft
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}