import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar, Brain } from 'lucide-react';
import { AIBudgetRedistribution } from '@/components/ai-budget-redistribution';

interface Scenario {
  id: string;
  title: string;
  type: 'income_change' | 'major_purchase' | 'life_event' | 'economic_shift';
  impact: 'positive' | 'negative' | 'neutral';
  monthlyChange: number;
  duration: number;
  description: string;
  recommendations: string[];
}

const SCENARIO_TYPES = [
  { value: 'income_change', label: 'Income Change', icon: '💰' },
  { value: 'major_purchase', label: 'Major Purchase', icon: '🏠' },
  { value: 'life_event', label: 'Life Event', icon: '👶' },
  { value: 'economic_shift', label: 'Economic Shift', icon: '📈' }
];

export function ScenarioPlanning() {
  const [scenarios] = useState<Scenario[]>([
    {
      id: '1',
      title: 'Pay Raise (+15%)',
      type: 'income_change',
      impact: 'positive',
      monthlyChange: 750,
      duration: 12,
      description: 'Potential promotion with 15% salary increase',
      recommendations: [
        'Increase retirement contributions by $300/month',
        'Boost emergency fund to 8 months expenses',
        'Consider upgrading investment portfolio'
      ]
    },
    {
      id: '2',
      title: 'New Car Purchase',
      type: 'major_purchase',
      impact: 'negative',
      monthlyChange: -450,
      duration: 60,
      description: 'Financing a $25,000 vehicle over 5 years',
      recommendations: [
        'Reduce discretionary spending by $200/month',
        'Consider certified pre-owned to lower payments',
        'Shop around for best financing rates'
      ]
    },
    {
      id: '3',
      title: 'Economic Recession',
      type: 'economic_shift',
      impact: 'negative',
      monthlyChange: -300,
      duration: 18,
      description: 'Potential economic downturn affecting investments',
      recommendations: [
        'Build larger emergency fund (12 months)',
        'Reduce high-risk investments',
        'Focus on debt payoff and cash reserves'
      ]
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showBudgetAnalysis, setShowBudgetAnalysis] = useState<string | null>(null);

  const getScenarioTypeInfo = (type: string) => {
    return SCENARIO_TYPES.find(t => t.value === type) || SCENARIO_TYPES[0];
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return TrendingUp;
      case 'negative': return TrendingDown;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Header */}
      <Card className="glass-card pulse-orange">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Scenario Planning</h3>
                <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Model financial what-if scenarios</p>
              </div>
            </div>
            <Button size="sm" className="touch-manipulation text-xs sm:text-sm">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">New Scenario</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">
                {scenarios.length}
              </div>
              <div className="text-xs text-white/70">Active Scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-400">
                +${scenarios.filter(s => s.impact === 'positive').reduce((sum, s) => sum + s.monthlyChange, 0)}
              </div>
              <div className="text-xs text-white/70">Potential Gains</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-red-400">
                ${Math.abs(scenarios.filter(s => s.impact === 'negative').reduce((sum, s) => sum + s.monthlyChange, 0))}
              </div>
              <div className="text-xs text-white/70">Potential Costs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Scenario Cards */}
      <div className="space-y-3 sm:space-y-4">
        {scenarios.map((scenario) => {
          const typeInfo = getScenarioTypeInfo(scenario.type);
          const ImpactIcon = getImpactIcon(scenario.impact);
          const isSelected = selectedScenario === scenario.id;
          
          return (
            <Card 
              key={scenario.id} 
              className={`glass-card transition-all touch-manipulation ${
                isSelected ? 'ring-2 ring-orange-500 ring-opacity-50' : 'hover:scale-102'
              }`}
              onClick={() => setSelectedScenario(isSelected ? null : scenario.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="text-lg sm:text-xl">{typeInfo.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm sm:text-base">{scenario.title}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {typeInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ImpactIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${getImpactColor(scenario.impact)}`} />
                    <span className={`font-bold text-sm sm:text-base ${getImpactColor(scenario.impact)}`}>
                      {scenario.monthlyChange > 0 ? '+' : ''}${scenario.monthlyChange}/mo
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-white/70 mb-3">
                  {scenario.description}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                  <div className="bg-white/10 p-2 rounded text-center">
                    <div className="text-sm sm:text-base font-semibold text-white">
                      {scenario.duration} months
                    </div>
                    <div className="text-xs text-white/70">Duration</div>
                  </div>
                  <div className="bg-white/10 p-2 rounded text-center">
                    <div className={`text-sm sm:text-base font-semibold ${getImpactColor(scenario.impact)}`}>
                      ${Math.abs(scenario.monthlyChange * scenario.duration).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/70">Total Impact</div>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-white/20 animate-in slide-in-from-top-2">
                    <h5 className="font-medium text-white mb-2 text-sm">AI Recommendations:</h5>
                    <div className="space-y-2">
                      {scenario.recommendations.map((rec, index) => (
                        <div 
                          key={index}
                          className="flex items-start space-x-2 text-xs sm:text-sm"
                        >
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-white/80">{rec}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        className="flex-1 touch-manipulation text-xs"
                        onClick={() => setShowBudgetAnalysis(scenario.id)}
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        AI Budget Analysis
                      </Button>
                      <Button size="sm" variant="outline" className="touch-manipulation text-xs">
                        Details
                      </Button>
                    </div>
                  </div>
                )}

                {!isSelected && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full touch-manipulation text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedScenario(scenario.id);
                    }}
                  >
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Custom Scenario */}
      <Card className="glass-card border-dashed border-2 border-white/30 hover:border-white/50 transition-colors">
        <CardContent className="p-4 sm:p-6 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">Create Custom Scenario</h4>
              <p className="text-xs sm:text-sm text-white/70">Model your unique financial situation</p>
            </div>
            <Button className="touch-manipulation text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Build Scenario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Budget Redistribution Modal */}
      {showBudgetAnalysis && (
        <div className="mt-6">
          <AIBudgetRedistribution
            scenario={scenarios.find(s => s.id === showBudgetAnalysis)!}
            onClose={() => setShowBudgetAnalysis(null)}
          />
        </div>
      )}
    </div>
  );
}