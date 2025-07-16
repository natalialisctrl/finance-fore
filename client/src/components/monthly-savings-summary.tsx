import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Target, Calendar } from "lucide-react";

interface MonthlySavingsSummaryProps {
  predictions: any[];
}

export function MonthlySavingsSummary({ predictions }: MonthlySavingsSummaryProps) {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [animatedItems, setAnimatedItems] = useState(0);

  const totalPotentialSavings = predictions.reduce((sum, p) => sum + p.expectedSavings, 0);
  const highPriorityItems = predictions.filter(p => p.smartBuyScore >= 8).length;
  const projectedMonthlySavings = totalPotentialSavings * 4; // Assuming weekly shopping

  useEffect(() => {
    const duration = 1500;
    const steps = 40;
    const savingsStep = projectedMonthlySavings / steps;
    const itemsStep = highPriorityItems / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedSavings(Math.min(savingsStep * currentStep, projectedMonthlySavings));
      setAnimatedItems(Math.min(itemsStep * currentStep, highPriorityItems));
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [projectedMonthlySavings, highPriorityItems]);

  const savingsGoal = 150; // Monthly savings goal
  const progressPercent = Math.min((animatedSavings / savingsGoal) * 100, 100);

  return (
    <Card className="glass-card border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-blue-50 dark:from-orange-900/20 dark:to-blue-900/20 glow-pulse" style={{boxShadow: 'none'}}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center glow-pulse icon-container cursor-pointer pulse-orange">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Potential Monthly Savings
            </h3>
            <p className="text-orange-600 dark:text-orange-400 text-sm">
              Based on current AI recommendations
            </p>
          </div>
        </div>

        {/* Main Savings Amount */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ${animatedSavings.toFixed(0)}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Projected monthly savings
          </div>
        </div>

        {/* Progress toward goal */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress to goal</span>
            <span className="font-medium text-slate-900 dark:text-white">${savingsGoal}</span>
          </div>
          
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-blue-500 rounded-full transition-all duration-1500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="text-xs text-center text-slate-500 dark:text-slate-400">
            {progressPercent.toFixed(0)}% of monthly goal achieved
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round(animatedItems)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              High Priority
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {predictions.length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Items Tracked
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {Math.round((animatedSavings / 30) * 7)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Weekly Est.
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Top Opportunities</span>
            <Badge className="bg-gradient-to-r from-orange-100 to-blue-100 dark:from-orange-900/20 dark:to-blue-900/20 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800">
              {predictions.filter(p => p.recommendedAction === "BUY_NOW").length} Buy Now
            </Badge>
          </div>
          
          {predictions
            .filter(p => p.recommendedAction === "BUY_NOW" && p.expectedSavings > 0)
            .slice(0, 3)
            .map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-white/60 to-blue-50/50 dark:from-white/5 dark:to-blue-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
                <span className="text-sm text-slate-900 dark:text-white font-medium">
                  {item.itemName}
                </span>
                <span className="text-sm bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent font-bold">
                  +${item.expectedSavings.toFixed(2)}
                </span>
              </div>
            ))}
        </div>

        {/* Timing Indicator */}
        <div className="mt-6 pt-4 border-t border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>
              Best shopping window: {['This weekend', 'Next week', 'Mid-month'][Math.floor(Math.random() * 3)]}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}