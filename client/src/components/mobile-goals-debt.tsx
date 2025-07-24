import { Button } from "@/components/ui/button";
import { Target, TrendingDown, Plus, Shield, Zap, AlertTriangle, Trophy } from "lucide-react";

export function MobileGoalsDebt() {
  return (
    <div className="space-y-4">
      {/* Futuristic Goals Section */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-4 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="headline text-white text-lg">Financial Goals</h3>
              <p className="text-white/60 text-xs">Smart Target Management</p>
            </div>
          </div>
          <Button className="btn-coral text-xs px-3 py-2 rounded-xl">
            <Plus className="w-3 h-3 mr-1" />
            Add Goal
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Emergency Fund */}
          <div className="bg-black/30 backdrop-blur-md border border-green-400/20 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="subheading text-white">Emergency Fund</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-bold gradient-gold">35%</div>
                <Zap className="w-3 h-3 text-green-400" />
              </div>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 border border-white/10 mb-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full shadow-lg" style={{width: '35%'}}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/80">$3,500</span>
              <span className="text-white/80">$10,000</span>
            </div>
            <div className="text-xs text-green-300 mt-1 text-center">On track • $180/week</div>
          </div>
          
          {/* Vacation Fund */}
          <div className="bg-black/30 backdrop-blur-md border border-blue-400/20 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                <span className="subheading text-white">Vacation Fund</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-bold gradient-coral-gold">24%</div>
                <Zap className="w-3 h-3 text-blue-400" />
              </div>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 border border-white/10 mb-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-3 rounded-full shadow-lg" style={{width: '24%'}}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/80">$1,200</span>
              <span className="text-white/80">$5,000</span>
            </div>
            <div className="text-xs text-blue-300 mt-1 text-center">Ahead of schedule • $95/week</div>
          </div>
        </div>
      </div>

      {/* Futuristic Debt Section */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-4 glow-border-gold">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="headline text-white text-lg">Debt Payoff</h3>
              <p className="text-white/60 text-xs">Strategic Elimination Plan</p>
            </div>
          </div>
          <Button className="btn-coral text-xs px-3 py-2 rounded-xl">
            <Plus className="w-3 h-3 mr-1" />
            Add Debt
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Credit Card */}
          <div className="bg-black/30 backdrop-blur-md border border-red-400/20 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="subheading text-white">Credit Card</span>
              </div>
              <div className="text-sm font-bold text-red-400">$2,500</div>
            </div>
            <div className="text-xs text-white/60 mb-2">Min: $75 • 18.99% APR</div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-red-300">Priority: High</div>
              <div className="text-xs text-white/70">8 months left</div>
            </div>
          </div>
          
          {/* Student Loan */}
          <div className="bg-black/30 backdrop-blur-md border border-orange-400/20 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-400" />
                <span className="subheading text-white">Student Loan</span>
              </div>
              <div className="text-sm font-bold text-orange-400">$15,000</div>
            </div>
            <div className="text-xs text-white/60 mb-2">Min: $200 • 4.5% APR</div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-orange-300">Priority: Medium</div>
              <div className="text-xs text-white/70">5.2 years left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}