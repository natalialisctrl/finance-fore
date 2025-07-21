import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingDown, Plus } from "lucide-react";

export function MobileGoalsDebt() {
  return (
    <div className="space-y-4">
      {/* Goals Section */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">Goals</h3>
            </div>
            <Button size="sm" className="touch-manipulation">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Emergency Fund</span>
                <span className="text-white/70">35%</span>
              </div>
              <Progress value={35} className="h-2" />
              <div className="text-xs text-white/60 mt-1">$3,500 / $10,000</div>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white">Vacation Fund</span>
                <span className="text-white/70">24%</span>
              </div>
              <Progress value={24} className="h-2" />
              <div className="text-xs text-white/60 mt-1">$1,200 / $5,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debt Section */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">Debts</h3>
            </div>
            <Button size="sm" className="touch-manipulation">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">Credit Card</span>
                <span className="text-red-400">$2,500</span>
              </div>
              <div className="text-xs text-white/60">Min: $75 • 18.99% APR</div>
            </div>
            
            <div className="bg-white/10 p-3 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">Student Loan</span>
                <span className="text-red-400">$15,000</span>
              </div>
              <div className="text-xs text-white/60">Min: $200 • 4.5% APR</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}