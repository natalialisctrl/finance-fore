import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Zap, TrendingDown, TrendingUp, ArrowRight, CheckCircle, X, AlertTriangle, Lightbulb } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BudgetFix {
  id: string;
  category: string;
  issue: string;
  currentSpend: number;
  currentBudget: number;
  overspendAmount: number;
  suggestedBudget: number;
  alternatives: string[];
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  autoApplicable: boolean;
  estimatedSavings: number;
  reasoning: string;
}

interface BudgetAdjustment {
  fromCategory: string;
  toCategory?: string;
  adjustmentAmount: number;
  adjustmentType: 'reduce' | 'reallocate' | 'freeze';
  newBudget: number;
}

export function AutomatedBudgetFixer() {
  const [budgetFixes, setBudgetFixes] = useState<BudgetFix[]>([]);
  const [selectedFix, setSelectedFix] = useState<BudgetFix | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: budgetData } = useQuery({
    queryKey: ['/api/budgets/demo-natalia/2025-07'],
  });

  const applyFixMutation = useMutation({
    mutationFn: async (adjustment: BudgetAdjustment) => {
      return await fetch('/api/budgets/apply-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adjustment)
      }).then(res => res.json());
    },
    onSuccess: () => {
      toast({
        title: "Budget Fix Applied",
        description: "Your budget has been automatically adjusted",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/budgets'] });
      setIsDialogOpen(false);
    }
  });

  useEffect(() => {
    if (budgetData) {
      generateBudgetFixes();
    }
  }, [budgetData]);

  const generateBudgetFixes = () => {
    if (!budgetData || !Array.isArray(budgetData)) return;

    const fixes: BudgetFix[] = [];
    const currentDate = new Date();
    const monthProgress = (currentDate.getDate() / 30) * 100;

    budgetData.forEach((budget: any) => {
      const spendRate = (budget.spentAmount / budget.budgetAmount) * 100;
      const expectedSpendRate = monthProgress;
      
      // Detect overspending patterns
      if (spendRate > expectedSpendRate + 20) {
        const overspendAmount = budget.spentAmount - (budget.budgetAmount * (expectedSpendRate / 100));
        
        fixes.push({
          id: `fix-${budget.category.toLowerCase()}`,
          category: budget.category,
          issue: getIssueDescription(budget.category, spendRate, expectedSpendRate),
          currentSpend: budget.spentAmount,
          currentBudget: budget.budgetAmount,
          overspendAmount,
          suggestedBudget: Math.max(budget.budgetAmount - 50, budget.spentAmount + 50),
          alternatives: getAlternatives(budget.category),
          confidence: calculateConfidence(spendRate, expectedSpendRate),
          priority: spendRate > expectedSpendRate + 40 ? 'high' : spendRate > expectedSpendRate + 30 ? 'medium' : 'low',
          autoApplicable: budget.category !== 'Emergency Fund' && budget.category !== 'Savings',
          estimatedSavings: Math.min(overspendAmount * 0.7, 100),
          reasoning: getReasoningMessage(budget.category, overspendAmount)
        });
      }
    });

    setBudgetFixes(fixes);
  };

  const getIssueDescription = (category: string, spendRate: number, expectedRate: number) => {
    const overspendPercentage = Math.round(spendRate - expectedRate);
    
    switch (category) {
      case 'Dining Out':
        return `You're overspending on delivery and restaurants by ${overspendPercentage}%. Want me to lower your dining budget by $50 and suggest meal prep options?`;
      case 'Entertainment':
        return `Entertainment spending is ${overspendPercentage}% over pace. Should I reduce this budget and recommend free activities?`;
      case 'Shopping':
        return `Shopping expenses are ${overspendPercentage}% above target. I can implement a 48-hour purchase delay and reduce the budget.`;
      case 'Transportation':
        return `Transportation costs are ${overspendPercentage}% over budget. Consider carpooling options or reducing ride-share usage?`;
      case 'Personal Care':
        return `Personal care spending is ${overspendPercentage}% high. I can suggest DIY alternatives and adjust the budget accordingly.`;
      default:
        return `${category} spending is ${overspendPercentage}% over pace this month. Want me to automatically adjust the budget?`;
    }
  };

  const getAlternatives = (category: string): string[] => {
    switch (category) {
      case 'Dining Out':
        return [
          'Set up meal prep Sundays with $30/week grocery budget boost',
          'Use coupon apps like Honey and Rakuten for delivery',
          'Limit restaurant visits to 2x per week maximum',
          'Batch cook freezer meals on weekends'
        ];
      case 'Entertainment':
        return [
          'Find free events in your area using Eventbrite',
          'Use library resources for books, movies, and events',
          'Host potluck game nights instead of going out',
          'Take advantage of happy hour pricing'
        ];
      case 'Shopping':
        return [
          'Implement a 48-hour waiting period for non-essential purchases',
          'Use price comparison apps before buying',
          'Set up automatic savings transfers on payday',
          'Try the "one in, one out" rule for clothes and items'
        ];
      case 'Transportation':
        return [
          'Use public transit or bike for short trips',
          'Carpool with coworkers 2-3 days per week',
          'Combine errands into single trips',
          'Walk or bike for trips under 2 miles'
        ];
      default:
        return [
          'Set up automatic budget alerts at 75% spending',
          'Review and compare prices before purchases',
          'Look for subscription services you can cancel',
          'Consider generic or store brands for savings'
        ];
    }
  };

  const calculateConfidence = (spendRate: number, expectedRate: number): number => {
    const difference = spendRate - expectedRate;
    if (difference > 50) return 95;
    if (difference > 30) return 85;
    if (difference > 20) return 75;
    return 65;
  };

  const getReasoningMessage = (category: string, overspendAmount: number): string => {
    return `Based on your spending pattern, reducing ${category} budget by $50 and implementing alternatives could save you $${Math.round(overspendAmount * 0.7)} this month while maintaining your lifestyle quality.`;
  };

  const handleApplyFix = (fix: BudgetFix) => {
    const adjustment: BudgetAdjustment = {
      fromCategory: fix.category,
      adjustmentAmount: fix.currentBudget - fix.suggestedBudget,
      adjustmentType: 'reduce',
      newBudget: fix.suggestedBudget
    };

    applyFixMutation.mutate(adjustment);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  if (budgetFixes.length === 0) {
    return (
      <Card className="glass-card border-none">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Budget Looking Good!</h3>
          <p className="text-white">No overspending detected. Your budgets are on track.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated Budget Fixer</h3>
              <p className="text-white">Smart suggestions to optimize your spending</p>
            </div>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30">
            {budgetFixes.length} fixes available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {budgetFixes.map((fix) => (
          <div key={fix.id} className="glass-card p-4 bg-white/10 hover:bg-white/15 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-white">{fix.category}</h4>
                  <Badge className={`text-xs ${getPriorityColor(fix.priority)}`}>
                    {fix.priority}
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-white">
                    <span>{fix.confidence}% confidence</span>
                  </div>
                </div>
                <p className="text-white text-sm mb-3">{fix.issue}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-white mb-1">Current Spending</div>
                <div className="text-lg font-bold text-red-400">${fix.currentSpend}</div>
              </div>
              <div>
                <div className="text-xs text-white mb-1">Suggested Budget</div>
                <div className="text-lg font-bold text-green-400">${fix.suggestedBudget}</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-white font-medium">Smart Alternative:</span>
              </div>
              <p className="text-xs text-white">{fix.alternatives[0]}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-white">
                Estimated monthly savings: <span className="font-bold text-green-400">${fix.estimatedSavings}</span>
              </div>
              <div className="flex space-x-2">
                <Dialog open={selectedFix?.id === fix.id && isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFix(fix)}
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Budget Fix: {fix.category}</span>
                      </DialogTitle>
                    </DialogHeader>
                    
                    {selectedFix && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">Current Issue</h4>
                          <p className="text-white text-sm">{selectedFix.issue}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass-card p-4">
                            <h5 className="font-medium text-white mb-2">Current Budget</h5>
                            <div className="text-2xl font-bold text-red-400">${selectedFix.currentBudget}</div>
                            <div className="text-sm text-white">Spent: ${selectedFix.currentSpend}</div>
                          </div>
                          <div className="glass-card p-4">
                            <h5 className="font-medium text-white mb-2">Suggested Budget</h5>
                            <div className="text-2xl font-bold text-green-400">${selectedFix.suggestedBudget}</div>
                            <div className="text-sm text-white">Savings: ${selectedFix.estimatedSavings}/month</div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-white mb-3">Smart Alternatives</h5>
                          <div className="space-y-2">
                            {selectedFix.alternatives.map((alternative, index) => (
                              <div key={index} className="flex items-start space-x-2 glass-card p-3">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <span className="text-sm text-white">{alternative}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
                          <h5 className="font-medium text-white mb-2">AI Reasoning</h5>
                          <p className="text-sm text-white">{selectedFix.reasoning}</p>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => handleApplyFix(selectedFix)}
                            disabled={applyFixMutation.isPending}
                            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                          >
                            {applyFixMutation.isPending ? 'Applying...' : 'Apply Fix'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                
                {fix.autoApplicable && (
                  <Button
                    size="sm"
                    onClick={() => handleApplyFix(fix)}
                    disabled={applyFixMutation.isPending}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0 text-xs"
                  >
                    Auto-Fix
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {budgetFixes.length > 0 && (
          <div className="glass-card p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 mt-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-semibold text-white">Total Potential Savings</h4>
                <p className="text-xs text-white">
                  Implementing all fixes could save you{' '}
                  <span className="font-bold text-green-400">
                    ${budgetFixes.reduce((sum, fix) => sum + fix.estimatedSavings, 0)}
                  </span>{' '}
                  per month
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}