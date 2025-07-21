import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, TrendingDown } from "lucide-react";

export function MobileScenarioPlanning() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">Scenario Planning</h3>
            </div>
            <Button size="sm" className="touch-manipulation">
              <Calculator className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-white">3</div>
              <div className="text-xs text-white/70">Scenarios</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">+$750</div>
              <div className="text-xs text-white/70">Potential</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">$750</div>
              <div className="text-xs text-white/70">Costs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Cards */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">💰</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Pay Raise (+15%)</h4>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-bold text-green-400">+$750/mo</span>
            </div>
          </div>
          
          <p className="text-xs text-white/70 mb-3">
            Potential promotion with 15% salary increase
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-white">12 months</div>
              <div className="text-white/70">Duration</div>
            </div>
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-green-400">$9,000</div>
              <div className="text-white/70">Total Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🏠</span>
              <div>
                <h4 className="text-sm font-semibold text-white">New Car Purchase</h4>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">-$450/mo</span>
            </div>
          </div>
          
          <p className="text-xs text-white/70 mb-3">
            Financing a $25,000 vehicle over 5 years
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-white">60 months</div>
              <div className="text-white/70">Duration</div>
            </div>
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-red-400">$27,000</div>
              <div className="text-white/70">Total Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">📈</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Economic Recession</h4>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-sm font-bold text-red-400">-$300/mo</span>
            </div>
          </div>
          
          <p className="text-xs text-white/70 mb-3">
            Potential economic downturn affecting investments
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-white">18 months</div>
              <div className="text-white/70">Duration</div>
            </div>
            <div className="bg-white/10 p-2 rounded text-center">
              <div className="font-semibold text-red-400">$5,400</div>
              <div className="text-white/70">Total Impact</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}