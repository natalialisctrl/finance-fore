import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain, MessageCircle, TrendingUp, TrendingDown, Target, Coffee, Car, Home, ShoppingBag, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SpendingInsight {
  category: string;
  currentSpend: number;
  averageSpend: number;
  variance: number;
  variancePercent: number;
  suggestion: string;
  tone: 'encouraging' | 'warning' | 'neutral';
  icon: string;
}

interface AICoachMessage {
  id: string;
  message: string;
  category: string;
  actionSuggestion?: {
    text: string;
    action: () => void;
  };
  timestamp: Date;
}

export function AISpendingCoach() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [coachMessages, setCoachMessages] = useState<AICoachMessage[]>([]);

  const { data: budgetData } = useQuery({
    queryKey: ['/api/budgets/demo-natalia/2025-07'],
  });

  const { data: economicData } = useQuery({
    queryKey: ['/api/economic-data'],
  });

  useEffect(() => {
    if (budgetData) {
      generateSpendingInsights();
      generateCoachMessages();
    }
  }, [budgetData]);

  const generateSpendingInsights = () => {
    if (!budgetData || !Array.isArray(budgetData)) return;

    const newInsights: SpendingInsight[] = budgetData.map((budget: any) => {
      const variance = budget.spentAmount - (budget.budgetAmount * 0.75); // Assume 75% is typical
      const variancePercent = (variance / (budget.budgetAmount * 0.75)) * 100;
      
      return {
        category: budget.category,
        currentSpend: budget.spentAmount,
        averageSpend: budget.budgetAmount * 0.75,
        variance,
        variancePercent,
        suggestion: generateSuggestion(budget.category, variancePercent),
        tone: variancePercent > 20 ? 'warning' : variancePercent < -10 ? 'encouraging' : 'neutral',
        icon: getCategoryIcon(budget.category)
      };
    }).filter(insight => Math.abs(insight.variancePercent) > 5);

    setInsights(newInsights);
  };

  const generateCoachMessages = () => {
    const messages: AICoachMessage[] = [
      {
        id: '1',
        message: "You spent $110 more than usual on coffee this month. Want to cap it next month, or should we shift funds from dining out?",
        category: "Coffee & Drinks",
        actionSuggestion: {
          text: "Set coffee budget cap",
          action: () => console.log("Setting coffee budget cap")
        },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        message: "Great job staying under budget on groceries! You've saved $85 this month. Want to put that toward your emergency fund?",
        category: "Groceries",
        actionSuggestion: {
          text: "Transfer to savings",
          action: () => console.log("Transferring to savings")
        },
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        message: "I noticed you're spending more on gas lately. With prices expected to rise 8% next week, consider filling up today to save about $12.",
        category: "Transportation",
        actionSuggestion: {
          text: "Set gas price alert",
          action: () => console.log("Setting gas price alert")
        },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      }
    ];

    setCoachMessages(messages);
  };

  const generateSuggestion = (category: string, variancePercent: number): string => {
    const suggestions = {
      'Groceries': variancePercent > 0 
        ? "Consider meal planning to reduce grocery overspending"
        : "Great job staying under budget! Maybe try bulk buying for even more savings",
      'Transportation': variancePercent > 0 
        ? "Gas prices are high right now. Consider carpooling or combining trips"
        : "You're doing well on transport costs. Perfect time to consider that road trip!",
      'Entertainment': variancePercent > 0 
        ? "Entertainment spending is up. Maybe try some free local events this week?"
        : "You're being smart with entertainment. Treat yourself to something special!",
      'Dining Out': variancePercent > 0 
        ? "Restaurant spending is higher than usual. Want to try some new home recipes?"
        : "Nice work on dining costs. You've earned that nice dinner out!"
    };

    return suggestions[category as keyof typeof suggestions] || 
           (variancePercent > 0 ? "Consider reducing spending in this category" : "You're doing great in this area!");
  };

  const getCategoryIcon = (category: string): string => {
    const icons = {
      'Groceries': '🛒',
      'Transportation': '⛽',
      'Entertainment': '🎬',
      'Dining Out': '🍽️',
      'Coffee & Drinks': '☕',
      'Shopping': '🛍️',
      'Healthcare': '🏥'
    };
    return icons[category as keyof typeof icons] || '💰';
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'encouraging': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Spending Coach</h3>
              <p className="text-white">Personalized insights from your spending patterns</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
            {coachMessages.length} insights
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Latest Coach Message */}
        {coachMessages.length > 0 && (
          <div className="glass-card p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <div className="flex items-start space-x-3">
              <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1" />
              <div className="flex-1">
                <p className="text-white mb-3">{coachMessages[0].message}</p>
                {coachMessages[0].actionSuggestion && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0"
                    onClick={coachMessages[0].actionSuggestion.action}
                  >
                    {coachMessages[0].actionSuggestion.text}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Spending Insights Preview */}
        <div className="space-y-3">
          {insights.slice(0, isExpanded ? insights.length : 2).map((insight: SpendingInsight, index: number) => (
            <div key={index} className="glass-card p-3 bg-white/20 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{insight.icon}</span>
                  <div>
                    <div className="font-medium text-white">{insight.category}</div>
                    <div className="text-sm text-white">
                      ${insight.currentSpend.toFixed(0)} vs ${insight.averageSpend.toFixed(0)} typical
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {insight.variancePercent > 0 ? 
                      <TrendingUp className="w-4 h-4 text-red-500" /> : 
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    }
                    <span className={`text-sm font-medium ${insight.variancePercent > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {insight.variancePercent > 0 ? '+' : ''}{insight.variancePercent.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className={`text-sm mt-2 ${getToneColor(insight.tone)}`}>
                {insight.suggestion}
              </p>
            </div>
          ))}
        </div>

        {/* View All Messages Dialog */}
        <div className="flex space-x-2">
          {insights.length > 2 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1"
            >
              {isExpanded ? 'Show Less' : `View All ${insights.length} Insights`}
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Coach Conversation</span>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {coachMessages.map((message) => (
                  <div key={message.id} className="glass-card p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {message.category}
                          </Badge>
                          <span className="text-xs text-white">
                            {message.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white mb-3">{message.message}</p>
                        {message.actionSuggestion && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={message.actionSuggestion.action}
                          >
                            {message.actionSuggestion.text}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}