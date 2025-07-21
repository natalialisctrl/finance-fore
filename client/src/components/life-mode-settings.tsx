import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  TrendingUp, 
  Heart, 
  GraduationCap, 
  Home, 
  Baby,
  Briefcase,
  Plane,
  Shield,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LifeMode {
  id: string;
  name: string;
  emoji: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  budgetAdjustments: {
    category: string;
    adjustment: number;
    reason: string;
  }[];
  color: string;
  isActive?: boolean;
}

export function LifeModeSettings() {
  const { toast } = useToast();
  const [activeMode, setActiveMode] = useState<string>('growth');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const lifeModes: LifeMode[] = [
    {
      id: 'growth',
      name: 'Growth Mode',
      emoji: '📈',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Focused on building wealth and achieving financial goals',
      features: [
        'Spending freeze on non-essentials',
        'Aggressive savings targets (30%+)',
        'Investment opportunity alerts',
        'Side hustle income tracking',
        'Emergency fund priority'
      ],
      budgetAdjustments: [
        { category: 'Entertainment', adjustment: -40, reason: 'Minimize discretionary spending' },
        { category: 'Dining Out', adjustment: -50, reason: 'Cook more meals at home' },
        { category: 'Savings', adjustment: 150, reason: 'Boost emergency fund and investments' },
        { category: 'Transportation', adjustment: -20, reason: 'Use public transit more' }
      ],
      color: 'from-green-500 to-emerald-600',
      isActive: true
    },
    {
      id: 'healing',
      name: 'Healing Mode',
      emoji: '🧘‍♀️',
      icon: <Heart className="w-5 h-5" />,
      description: 'Prioritizing mental health and self-care during difficult times',
      features: [
        'Mental health budget allocation',
        'Therapy session tracking',
        'Self-care expense monitoring',
        'Stress-reduction spending alerts',
        'Wellness goal integration'
      ],
      budgetAdjustments: [
        { category: 'Healthcare', adjustment: 200, reason: 'Therapy and wellness services' },
        { category: 'Self-Care', adjustment: 150, reason: 'Massage, meditation apps, etc.' },
        { category: 'Entertainment', adjustment: 50, reason: 'Gentle entertainment for healing' },
        { category: 'Dining Out', adjustment: -30, reason: 'Focus on nourishing home meals' }
      ],
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'student',
      name: 'Student Mode',
      emoji: '🎓',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Optimized for students with limited income and education expenses',
      features: [
        'Textbook and supplies tracking',
        'Student discount alerts',
        'Tuition payment planning',
        'Ramen-budget meal planning',
        'Part-time income optimization'
      ],
      budgetAdjustments: [
        { category: 'Education', adjustment: 300, reason: 'Books, supplies, tuition' },
        { category: 'Groceries', adjustment: -40, reason: 'Budget-friendly meal planning' },
        { category: 'Entertainment', adjustment: -60, reason: 'Focus on free campus activities' },
        { category: 'Transportation', adjustment: -50, reason: 'Walking and campus transport' }
      ],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'moving',
      name: 'Moving Mode',
      emoji: '📦',
      icon: <Home className="w-5 h-5" />,
      description: 'Managing the chaos and expenses of relocating',
      features: [
        'Moving expense tracking',
        'Box and supply budgeting',
        'Utility setup reminders',
        'Address change checklist',
        'New city cost-of-living adjustments'
      ],
      budgetAdjustments: [
        { category: 'Moving Expenses', adjustment: 500, reason: 'Boxes, truck rental, movers' },
        { category: 'Transportation', adjustment: 100, reason: 'Extra gas for moving trips' },
        { category: 'Home & Garden', adjustment: 200, reason: 'Setting up new place' },
        { category: 'Dining Out', adjustment: 80, reason: 'Convenience during moving chaos' }
      ],
      color: 'from-orange-500 to-amber-600'
    },
    {
      id: 'newParent',
      name: 'New Parent Mode',
      emoji: '👶',
      icon: <Baby className="w-5 h-5" />,
      description: 'Adjusting finances for the beautiful chaos of parenthood',
      features: [
        'Baby expense tracking',
        'Childcare cost planning',
        'Diaper and formula budgeting',
        'Healthcare cost increases',
        'College savings setup'
      ],
      budgetAdjustments: [
        { category: 'Baby Expenses', adjustment: 400, reason: 'Diapers, formula, clothes, toys' },
        { category: 'Healthcare', adjustment: 150, reason: 'Pediatric visits and insurance' },
        { category: 'Entertainment', adjustment: -100, reason: 'Less going out, more family time' },
        { category: 'Education Savings', adjustment: 200, reason: 'Start college fund early' }
      ],
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'career',
      name: 'Career Pivot Mode',
      emoji: '💼',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Navigating job changes and career transitions',
      features: [
        'Job search expense tracking',
        'Professional development budget',
        'Network event expenses',
        'Interview travel costs',
        'Emergency fund emphasis'
      ],
      budgetAdjustments: [
        { category: 'Professional Development', adjustment: 250, reason: 'Courses, certifications, conferences' },
        { category: 'Transportation', adjustment: 100, reason: 'Interview travel and networking' },
        { category: 'Clothing', adjustment: 150, reason: 'Professional wardrobe updates' },
        { category: 'Emergency Fund', adjustment: 300, reason: 'Buffer for income uncertainty' }
      ],
      color: 'from-slate-500 to-gray-600'
    }
  ];

  const handleModeChange = (modeId: string) => {
    const newMode = lifeModes.find(mode => mode.id === modeId);
    if (newMode) {
      setActiveMode(modeId);
      toast({
        title: "Life Mode Updated",
        description: `Switched to ${newMode.name}. Your budget and recommendations have been adjusted.`,
      });
      setIsDialogOpen(false);
    }
  };

  const currentMode = lifeModes.find(mode => mode.id === activeMode);

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${currentMode?.color} rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer`}>
              {currentMode?.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Life Mode</h3>
              <p className="text-white">Adaptive budgeting for your current season</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                <Settings className="w-4 h-4 mr-2" />
                Change Mode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Choose Your Life Mode</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {lifeModes.map((mode) => (
                  <div 
                    key={mode.id} 
                    className={`glass-card p-4 cursor-pointer transition-all hover:scale-105 ${
                      activeMode === mode.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleModeChange(mode.id)}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center`}>
                        {mode.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{mode.name}</h4>
                          <span className="text-lg">{mode.emoji}</span>
                          {activeMode === mode.id && (
                            <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white mb-3">{mode.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-white mb-2">Key Features:</div>
                      {mode.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Target className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-white">{feature}</span>
                        </div>
                      ))}
                      {mode.features.length > 3 && (
                        <div className="text-xs text-white">
                          +{mode.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Mode Display */}
        {currentMode && (
          <div className="glass-card p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{currentMode.emoji}</span>
              <div>
                <h4 className="font-bold text-white">{currentMode.name}</h4>
                <p className="text-sm text-white">{currentMode.description}</p>
              </div>
            </div>

            {/* Budget Adjustments Preview */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-white">Active Adjustments:</div>
              {currentMode.budgetAdjustments.slice(0, 3).map((adjustment, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-white">{adjustment.category}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${adjustment.adjustment > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {adjustment.adjustment > 0 ? '+' : ''}${adjustment.adjustment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-green-500">85%</div>
            <div className="text-xs text-white">Mode Alignment</div>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-blue-500">12</div>
            <div className="text-xs text-white">Days Active</div>
          </div>
        </div>

        {/* Mode Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Mode Progress</span>
            <span className="text-sm text-white">Week 2 of 4</span>
          </div>
          <Progress value={50} className="h-2" />
          <p className="text-xs text-white">
            Your spending patterns are adapting well to {currentMode?.name}. Keep it up!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}