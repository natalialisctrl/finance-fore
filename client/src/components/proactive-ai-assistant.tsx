import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PredictiveAlert {
  id: string;
  type: 'price_surge' | 'delay_suggestion' | 'budget_fix' | 'overdraft_warning';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  category: string;
  location?: string;
  timeframe: string;
  predictedSavings?: number;
  actionRequired: boolean;
  actions: {
    primary: {
      text: string;
      action: () => void;
    };
    secondary?: {
      text: string;
      action: () => void;
    };
  };
  confidence: number;
  timestamp: Date;
  icon: React.ReactNode;
}

export function ProactiveAIAssistant() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: priceData } = useQuery({
    queryKey: ['/api/price-data'],
  });

  const { data: budgetData } = useQuery({
    queryKey: ['/api/budgets/demo-natalia/2025-07'],
  });

  useEffect(() => {
    generateProactiveAlerts();
  }, [priceData, budgetData]);

  const generateProactiveAlerts = () => {
    const newAlerts: PredictiveAlert[] = [
      {
        id: 'gas-spike-1',
        type: 'price_surge',
        priority: 'high',
        title: 'Gas Price Surge Alert',
        message: 'Gas in Austin is expected to spike 12% by Thursday due to supply chain disruptions. Fill up now to save $15-20.',
        category: 'Transportation',
        location: 'Austin, TX',
        timeframe: '2 days',
        predictedSavings: 18,
        actionRequired: true,
        actions: {
          primary: {
            text: 'Find Nearby Stations',
            action: () => {
              toast({
                title: "Gas Station Finder",
                description: "Opening map with cheapest gas stations near you.",
              });
            }
          },
          secondary: {
            text: 'Set Price Alert',
            action: () => {
              toast({
                title: "Alert Set",
                description: "You'll be notified when gas prices drop below current levels.",
              });
            }
          }
        },
        confidence: 87,
        timestamp: new Date(),
        icon: <TrendingUp className="w-5 h-5 text-red-500" />
      },
      {
        id: 'grocery-trend-1',
        type: 'price_surge',
        priority: 'medium',
        title: 'Grocery Price Trend',
        message: 'Groceries in your area are trending up 3% this week. Stock up on non-perishables now to save $25-30.',
        category: 'Groceries',
        location: 'Austin, TX',
        timeframe: '1 week',
        predictedSavings: 27,
        actionRequired: false,
        actions: {
          primary: {
            text: 'View Shopping List',
            action: () => {
              toast({
                title: "Smart Shopping List",
                description: "Added bulk items to your shopping list with current low prices.",
              });
            }
          }
        },
        confidence: 74,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: <ShoppingCart className="w-5 h-5 text-orange-500" />
      },
      {
        id: 'delay-suggestion-1',
        type: 'delay_suggestion',
        priority: 'high',
        title: 'Smart Purchase Delay',
        message: 'If you wait 6 days to buy that $180 coffee maker, you\'ll avoid an overdraft fee and prices drop 8% next week.',
        category: 'Electronics',
        timeframe: '6 days',
        predictedSavings: 14,
        actionRequired: true,
        actions: {
          primary: {
            text: 'Snooze Purchase',
            action: () => {
              toast({
                title: "Purchase Delayed",
                description: "Coffee maker saved for next week. You'll get a reminder when prices drop.",
              });
            }
          },
          secondary: {
            text: 'Buy Now Anyway',
            action: () => {
              toast({
                title: "Purchase Confirmed",
                description: "Proceeding with purchase. Consider using your emergency buffer.",
                variant: "destructive"
              });
            }
          }
        },
        confidence: 92,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        icon: <Clock className="w-5 h-5 text-blue-500" />
      },
      {
        id: 'budget-fix-1',
        type: 'budget_fix',
        priority: 'medium',
        title: 'Automated Budget Adjustment',
        message: 'You\'re overspending on delivery by $85 this month. I can lower your restaurant budget by $50 and suggest meal prep options.',
        category: 'Dining Out',
        timeframe: 'This month',
        predictedSavings: 135,
        actionRequired: false,
        actions: {
          primary: {
            text: 'Auto-Fix Budget',
            action: () => {
              toast({
                title: "Budget Adjusted",
                description: "Restaurant budget reduced by $50. Meal prep suggestions added to your dashboard.",
              });
            }
          },
          secondary: {
            text: 'See Meal Plans',
            action: () => {
              toast({
                title: "Meal Planning",
                description: "Opening personalized meal prep suggestions based on your preferences.",
              });
            }
          }
        },
        confidence: 81,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        icon: <Target className="w-5 h-5 text-green-500" />
      },
      {
        id: 'overdraft-warning-1',
        type: 'overdraft_warning',
        priority: 'high',
        title: 'Overdraft Prevention',
        message: 'Based on your spending pattern, you might overdraft by Friday. Move $120 from savings or delay 2 pending purchases.',
        category: 'Banking',
        timeframe: '3 days',
        predictedSavings: 35, // overdraft fee savings
        actionRequired: true,
        actions: {
          primary: {
            text: 'Transfer from Savings',
            action: () => {
              toast({
                title: "Transfer Initiated",
                description: "Moving $120 from savings to checking to prevent overdraft.",
              });
            }
          },
          secondary: {
            text: 'Delay Purchases',
            action: () => {
              toast({
                title: "Purchases Delayed",
                description: "2 non-essential purchases moved to next week's budget.",
              });
            }
          }
        },
        confidence: 94,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />
      }
    ];

    // Filter out dismissed alerts
    const activeAlerts = newAlerts.filter(alert => !dismissedAlerts.includes(alert.id));
    setAlerts(activeAlerts);
  };

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    toast({
      title: "Alert Dismissed",
      description: "You can view dismissed alerts in your notification history.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500/30 bg-red-500/5';
      case 'medium': return 'border-orange-500/30 bg-orange-500/5';
      case 'low': return 'border-blue-500/30 bg-blue-500/5';
      default: return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500/20 text-red-600 border-red-500/30">High Priority</Badge>;
      case 'medium': return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30">Medium</Badge>;
      case 'low': return <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">Low</Badge>;
      default: return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const highPriorityAlerts = alerts.filter(alert => alert.priority === 'high');
  const otherAlerts = alerts.filter(alert => alert.priority !== 'high');

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Proactive AI Assistant</h3>
              <p className="text-white">Smart predictions and automated assistance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {highPriorityAlerts.length > 0 && (
              <Badge className="bg-red-500/20 text-red-600 border-red-500/30 animate-pulse">
                {highPriorityAlerts.length} urgent
              </Badge>
            )}
            <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30">
              {alerts.length} active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* High Priority Alerts */}
        {highPriorityAlerts.length > 0 && (
          <div className="space-y-3">
            {highPriorityAlerts.slice(0, isExpanded ? highPriorityAlerts.length : 2).map((alert) => (
              <Alert key={alert.id} className={`glass-card ${getPriorityColor(alert.priority)} border-2`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {alert.icon}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-white">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <AlertDescription className="text-white mb-3">
                        {alert.message}
                      </AlertDescription>
                      
                      <div className="flex items-center space-x-4 text-xs text-white mb-3">
                        {alert.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{alert.timeframe}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Brain className="w-3 h-3" />
                          <span>{alert.confidence}% confident</span>
                        </div>
                        {alert.predictedSavings && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Save ${alert.predictedSavings}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0"
                          onClick={alert.actions.primary.action}
                        >
                          {alert.actions.primary.text}
                        </Button>
                        {alert.actions.secondary && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={alert.actions.secondary.action}
                          >
                            {alert.actions.secondary.text}
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDismissAlert(alert.id)}
                          className="text-white hover:text-white/80"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {/* Other Priority Alerts */}
        {otherAlerts.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-white">Other Predictions:</div>
            {otherAlerts.slice(0, isExpanded ? otherAlerts.length : 1).map((alert) => (
              <div key={alert.id} className={`glass-card p-3 ${getPriorityColor(alert.priority)}`}>
                <div className="flex items-start space-x-3">
                  {alert.icon}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-white">{alert.title}</h5>
                      {getPriorityBadge(alert.priority)}
                    </div>
                    <p className="text-sm text-white mb-2">{alert.message}</p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0"
                        onClick={alert.actions.primary.action}
                      >
                        {alert.actions.primary.text}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDismissAlert(alert.id)}
                        className="text-white/70 hover:text-white"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse and AI Stats */}
        <div className="flex items-center justify-between pt-2">
          {alerts.length > 3 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : `View All ${alerts.length} Predictions`}
            </Button>
          )}
          
          <div className="text-xs text-white flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>87% accuracy rate</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3 text-yellow-500" />
              <span>$284 saved this month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}