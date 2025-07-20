import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Calculator, Lightbulb, AlertCircle } from "lucide-react";

interface BudgetScenario {
  id: number;
  scenarioName: string;
  scenarioType: string;
  baselineIncome: number;
  adjustedIncome: number;
  additionalExpenses: any;
  projectedOutcome: any;
  isActive: boolean;
}

export function ScenarioPlanningDashboard() {
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<BudgetScenario | null>(null);
  
  // Sample scenarios for demonstration
  useEffect(() => {
    const sampleScenarios = [
      {
        id: 1,
        scenarioName: "20% Salary Increase",
        scenarioType: "pay_raise",
        baselineIncome: 75000,
        adjustedIncome: 90000,
        additionalExpenses: {
          "Higher Tax Bracket": 2400,
          "Increased 401k": 1800
        },
        projectedOutcome: {
          netMonthlyIncrease: 950,
          yearlyProjection: 11400,
          savingsImpact: 5700,
          budgetRecommendations: [
            "Allocate extra $500/month to emergency fund",
            "Increase investment contributions by $300/month",
            "Consider higher rent cap of $2200/month"
          ]
        },
        isActive: false
      },
      {
        id: 2,
        scenarioName: "Job Loss Scenario",
        scenarioType: "job_loss",
        baselineIncome: 75000,
        adjustedIncome: 24000, // Unemployment benefits
        additionalExpenses: {
          "COBRA Health Insurance": 600,
          "Job Search Costs": 200
        },
        projectedOutcome: {
          monthlyShortfall: -3450,
          emergencyFundDuration: 8,
          criticalActions: [
            "Reduce discretionary spending by 70%",
            "Consider temporary housing downsizing",
            "Apply for unemployment benefits immediately"
          ]
        },
        isActive: false
      },
      {
        id: 3,
        scenarioName: "Home Purchase",
        scenarioType: "major_purchase",
        baselineIncome: 75000,
        adjustedIncome: 75000,
        additionalExpenses: {
          "Mortgage Payment": 1800,
          "Property Tax": 300,
          "Home Insurance": 150,
          "Maintenance Fund": 200
        },
        projectedOutcome: {
          monthlyNetChange: -1150,
          downPaymentNeeded: 60000,
          affordabilityScore: 7.2,
          recommendations: [
            "Save additional $35,000 for down payment",
            "Reduce entertainment budget by $200/month",
            "Consider properties under $350,000"
          ]
        },
        isActive: true
      }
    ];
    
    setScenarios(sampleScenarios);
    setActiveScenario(sampleScenarios.find(s => s.isActive) || null);
  }, []);

  const getScenarioTypeIcon = (type: string) => {
    switch (type) {
      case "pay_raise": return <TrendingUp className="w-5 h-5" />;
      case "job_loss": return <TrendingDown className="w-5 h-5" />;
      case "major_purchase": return <DollarSign className="w-5 h-5" />;
      default: return <Calculator className="w-5 h-5" />;
    }
  };

  const getScenarioTypeColor = (type: string) => {
    const colors = {
      pay_raise: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
      job_loss: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800",
      major_purchase: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      life_event: "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800"
    };
    return colors[type] || "bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Scenario Planning
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Model "what-if" scenarios and their financial impact
            </p>
          </div>
        </div>
        <Button className="btn-premium ripple">
          <Calculator className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      {/* Scenario Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card 
            key={scenario.id} 
            className={`glass-card scale-in cursor-pointer hover:scale-105 transition-all duration-300 ${scenario.isActive ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
            onClick={() => setActiveScenario(scenario)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getScenarioTypeColor(scenario.scenarioType)}`}>
                    {getScenarioTypeIcon(scenario.scenarioType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {scenario.scenarioName}
                    </h3>
                    {scenario.isActive && (
                      <Badge className="mt-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Baseline Income</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(scenario.baselineIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Adjusted Income</span>
                  <span className={`font-medium ${scenario.adjustedIncome > scenario.baselineIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(scenario.adjustedIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Net Impact</span>
                  <span className={`font-bold ${scenario.adjustedIncome > scenario.baselineIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {scenario.adjustedIncome > scenario.baselineIncome ? '+' : ''}
                    {formatCurrency(scenario.adjustedIncome - scenario.baselineIncome)}
                  </span>
                </div>
              </div>

              {scenario.projectedOutcome && scenario.projectedOutcome.affordabilityScore && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Affordability Score</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${scenario.projectedOutcome.affordabilityScore > 7 ? 'bg-green-500' : scenario.projectedOutcome.affordabilityScore > 5 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {scenario.projectedOutcome.affordabilityScore}/10
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Section */}
      {activeScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  AI Insights for {activeScenario.scenarioName}
                </h3>
              </div>

              <div className="space-y-4">
                {activeScenario.projectedOutcome.budgetRecommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-900 dark:text-blue-100">{rec}</p>
                  </div>
                )) || activeScenario.projectedOutcome.criticalActions?.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-900 dark:text-red-100">{action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                Financial Impact Analysis
              </h3>

              <div className="space-y-4">
                {activeScenario.projectedOutcome.netMonthlyIncrease && (
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm text-green-800 dark:text-green-200">Monthly Net Increase</span>
                    <span className="font-bold text-green-600">
                      +{formatCurrency(activeScenario.projectedOutcome.netMonthlyIncrease)}
                    </span>
                  </div>
                )}

                {activeScenario.projectedOutcome.monthlyShortfall && (
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm text-red-800 dark:text-red-200">Monthly Shortfall</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(activeScenario.projectedOutcome.monthlyShortfall)}
                    </span>
                  </div>
                )}

                {activeScenario.projectedOutcome.emergencyFundDuration && (
                  <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">Emergency Fund Duration</span>
                    <span className="font-bold text-yellow-600">
                      {activeScenario.projectedOutcome.emergencyFundDuration} months
                    </span>
                  </div>
                )}

                {activeScenario.projectedOutcome.downPaymentNeeded && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm text-blue-800 dark:text-blue-200">Down Payment Required</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(activeScenario.projectedOutcome.downPaymentNeeded)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations Section */}
      {activeScenario && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
              Recommended Action Plan for {activeScenario.scenarioName}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                  Immediate Actions
                </h4>
                <div className="space-y-2">
                  {(activeScenario.projectedOutcome.budgetRecommendations || 
                    activeScenario.projectedOutcome.criticalActions || 
                    activeScenario.projectedOutcome.recommendations || [])
                    .slice(0, 2).map((action, index) => (
                    <div key={index} className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-green-200 dark:border-green-800">
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                  3-Month Plan
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                    Review and adjust budget allocations
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
                    Monitor spending against new targets
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center">
                  <span className="w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs mr-2">3</span>
                  Long-term Strategy
                </h4>
                <div className="space-y-2">
                  <div className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                    Reassess financial goals quarterly
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                    Build contingency plans for similar scenarios
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}