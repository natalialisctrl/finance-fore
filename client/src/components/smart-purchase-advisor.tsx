import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Clock, 
  TrendingDown, 
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Timer,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PurchaseRecommendation {
  id: string;
  itemName: string;
  currentPrice: number;
  suggestedAction: 'buy_now' | 'wait' | 'delay' | 'avoid';
  reason: string;
  timeframe: string;
  potentialSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  priceHistory: number[];
  predictedPrice: number;
  budgetImpact: {
    category: string;
    currentSpending: number;
    budgetRemaining: number;
    overdraftRisk: boolean;
  };
}

export function SmartPurchaseAdvisor() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<PurchaseRecommendation[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('week');

  const { data: priceData } = useQuery({
    queryKey: ['/api/price-data'],
  });

  const { data: budgetData } = useQuery({
    queryKey: ['/api/budgets/demo-natalia/2025-07'],
  });

  useEffect(() => {
    generatePurchaseRecommendations();
  }, [priceData, budgetData, selectedTimeframe]);

  const generatePurchaseRecommendations = () => {
    if (!priceData || !budgetData) return;

    const newRecommendations: PurchaseRecommendation[] = [
      {
        id: 'laptop-delay',
        itemName: 'MacBook Pro 16" M3',
        currentPrice: 2499,
        suggestedAction: 'delay',
        reason: 'Price expected to drop 8% next week after new model announcement. Delaying also prevents overdraft.',
        timeframe: '6-8 days',
        potentialSavings: 199,
        riskLevel: 'low',
        confidence: 92,
        priceHistory: [2599, 2549, 2499, 2450, 2399],
        predictedPrice: 2299,
        budgetImpact: {
          category: 'Electronics',
          currentSpending: 450,
          budgetRemaining: 200,
          overdraftRisk: true
        }
      },
      {
        id: 'gas-urgent',
        itemName: 'Gasoline Fill-up',
        currentPrice: 3.45,
        suggestedAction: 'buy_now',
        reason: 'Gas prices spiking 12% by Thursday due to refinery issues. Fill up today to save $15-20.',
        timeframe: 'Within 24 hours',
        potentialSavings: 18,
        riskLevel: 'high',
        confidence: 87,
        priceHistory: [3.25, 3.32, 3.38, 3.45, 3.89],
        predictedPrice: 3.89,
        budgetImpact: {
          category: 'Transportation',
          currentSpending: 180,
          budgetRemaining: 120,
          overdraftRisk: false
        }
      },
      {
        id: 'groceries-stock',
        itemName: 'Non-perishable Groceries',
        currentPrice: 85,
        suggestedAction: 'buy_now',
        reason: 'Grocery inflation trending up 3% this week. Stock up on staples now to lock in current prices.',
        timeframe: 'This weekend',
        potentialSavings: 25,
        riskLevel: 'medium',
        confidence: 74,
        priceHistory: [82, 83, 84, 85, 88],
        predictedPrice: 88,
        budgetImpact: {
          category: 'Groceries',
          currentSpending: 320,
          budgetRemaining: 180,
          overdraftRisk: false
        }
      },
      {
        id: 'coffee-maker-wait',
        itemName: 'Breville Coffee Machine',
        currentPrice: 299,
        suggestedAction: 'wait',
        reason: 'Prime Day sale in 2 weeks typically offers 25% off kitchen appliances. Wait for better deal.',
        timeframe: '2 weeks',
        potentialSavings: 75,
        riskLevel: 'low',
        confidence: 85,
        priceHistory: [349, 329, 299, 249, 224],
        predictedPrice: 224,
        budgetImpact: {
          category: 'Home & Kitchen',
          currentSpending: 120,
          budgetRemaining: 380,
          overdraftRisk: false
        }
      },
      {
        id: 'subscription-avoid',
        itemName: 'Premium Streaming Service',
        currentPrice: 15.99,
        suggestedAction: 'avoid',
        reason: 'You\'re already over budget on entertainment. Cancel or wait until next month to stay on track.',
        timeframe: 'Skip this month',
        potentialSavings: 15.99,
        riskLevel: 'medium',
        confidence: 90,
        priceHistory: [12.99, 13.99, 14.99, 15.99, 15.99],
        predictedPrice: 15.99,
        budgetImpact: {
          category: 'Entertainment',
          currentSpending: 85,
          budgetRemaining: -5,
          overdraftRisk: false
        }
      }
    ];

    setRecommendations(newRecommendations);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy_now': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'wait': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'delay': return <Timer className="w-4 h-4 text-orange-500" />;
      case 'avoid': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy_now': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'wait': return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'delay': return 'bg-orange-500/20 text-orange-600 border-orange-500/30';
      case 'avoid': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'buy_now': return 'Buy Now';
      case 'wait': return 'Wait for Better Price';
      case 'delay': return 'Delay Purchase';
      case 'avoid': return 'Skip for Now';
      default: return 'Monitor';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high': return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">High Risk</Badge>;
      case 'medium': return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Medium Risk</Badge>;
      case 'low': return <Badge className="bg-green-500/20 text-green-600 border-green-500/30">Low Risk</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleTakeAction = (recommendation: PurchaseRecommendation) => {
    const actionMessages = {
      buy_now: `Added "${recommendation.itemName}" to priority purchase list. Best time to buy is now!`,
      wait: `Set price alert for "${recommendation.itemName}". You'll be notified when price drops.`,
      delay: `Purchase delayed for "${recommendation.itemName}". Added reminder for ${recommendation.timeframe}.`,
      avoid: `"${recommendation.itemName}" removed from shopping list to protect your budget.`
    };

    toast({
      title: "Action Taken",
      description: actionMessages[recommendation.suggestedAction],
    });
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Purchase Advisor</h3>
              <p className="text-white">AI-powered timing recommendations for your purchases</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="glass-card px-3 py-1 text-sm text-white bg-transparent border-white/20 rounded-lg"
            >
              <option value="today" className="bg-slate-800">Today</option>
              <option value="week" className="bg-slate-800">This Week</option>
              <option value="month" className="bg-slate-800">This Month</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-card p-4 bg-white/20 dark:bg-white/5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                {getActionIcon(rec.suggestedAction)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white">{rec.itemName}</h4>
                    <Badge className={getActionColor(rec.suggestedAction)}>
                      {getActionText(rec.suggestedAction)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-white mb-2">
                    <span>${rec.currentPrice}</span>
                    <span>→</span>
                    <span className={rec.predictedPrice < rec.currentPrice ? 'text-green-400' : 'text-red-400'}>
                      ${rec.predictedPrice}
                    </span>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-yellow-500" />
                      <span className="text-yellow-400">Save ${rec.potentialSavings}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {getRiskBadge(rec.riskLevel)}
                <div className="text-xs text-white">{rec.confidence}% confidence</div>
              </div>
            </div>

            <p className="text-sm text-white mb-3">{rec.reason}</p>

            {/* Budget Impact */}
            <div className="glass-card p-3 bg-white/10 mb-3">
              <div className="flex items-center justify-between text-xs text-white mb-2">
                <span>{rec.budgetImpact.category} Budget</span>
                <span>${rec.budgetImpact.currentSpending} / ${rec.budgetImpact.currentSpending + rec.budgetImpact.budgetRemaining}</span>
              </div>
              <Progress 
                value={(rec.budgetImpact.currentSpending / (rec.budgetImpact.currentSpending + rec.budgetImpact.budgetRemaining)) * 100} 
                className="h-2 mb-2"
              />
              {rec.budgetImpact.overdraftRisk && (
                <div className="flex items-center space-x-1 text-xs text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>Overdraft risk if purchased now</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-white">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{rec.timeframe}</span>
                </div>
                {rec.suggestedAction === 'buy_now' && (
                  <div className="flex items-center space-x-1 text-red-400 animate-pulse">
                    <Timer className="w-3 h-3" />
                    <span>Time sensitive</span>
                  </div>
                )}
              </div>

              <Button 
                size="sm" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                onClick={() => handleTakeAction(rec)}
              >
                {rec.suggestedAction === 'buy_now' ? 'Add to Cart' : 
                 rec.suggestedAction === 'wait' ? 'Set Alert' :
                 rec.suggestedAction === 'delay' ? 'Snooze' : 'Remove'}
              </Button>
            </div>
          </div>
        ))}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="glass-card p-3 text-center">
            <div className="text-lg font-bold text-green-500">$317</div>
            <div className="text-xs text-white">Potential Savings</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-lg font-bold text-blue-500">3</div>
            <div className="text-xs text-white">Active Recommendations</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-lg font-bold text-orange-500">87%</div>
            <div className="text-xs text-white">Prediction Accuracy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}