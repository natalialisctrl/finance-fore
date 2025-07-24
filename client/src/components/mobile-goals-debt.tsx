import { Button } from "@/components/ui/button";
import { Target, TrendingDown, Plus, Shield, Zap, AlertTriangle, Trophy, Brain, Cpu, Waves, Activity, Radar, Orbit } from "lucide-react";

export function MobileGoalsDebt() {
  return (
    <div className="space-y-8">
      {/* Advanced AI Goals Section */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden">
        {/* Quantum Field Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-3 left-6 w-1 h-1 bg-[#d4c4a0] rounded-full animate-ping"></div>
          <div className="absolute top-8 right-10 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-6 left-16 w-1 h-1 bg-[#d4c4a0] rounded-full animate-ping delay-1000"></div>
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#353c4a] via-[#d4c4a0] to-[#fc304ed6] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative">
              <Brain className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#d4c4a0] to-[#c9b892] rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h3 className="headline text-white text-xl">AI Goal System™</h3>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Radar className="w-3 h-3" />
                <span>Quantum Target Intelligence v2.8</span>
                <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button className="btn-coral text-xs px-4 py-2 rounded-2xl shadow-lg border border-white/20">
            <Plus className="w-3 h-3 mr-1" />
            Smart Goal
          </Button>
        </div>
        
        <div className="space-y-6 relative z-10">
          {/* Enhanced Emergency Fund */}
          <div className="bg-black/30 backdrop-blur-md border border-[#d4c4a0]/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4c4a0]/5 to-transparent animate-pulse"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#353c4a] to-[#d4c4a0] rounded-xl flex items-center justify-center relative">
                  <Shield className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping"></div>
                </div>
                <span className="subheading text-white text-lg">Emergency Vault</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-base font-bold gradient-coral font-mono">35.0%</div>
                <Activity className="w-4 h-4 text-[#d4c4a0] animate-pulse" />
              </div>
            </div>
            <div className="w-full bg-black/50 rounded-full h-4 border border-white/20 mb-3 relative overflow-hidden">
              <div className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#353c4a] h-4 rounded-full shadow-2xl relative" style={{width: '35%'}}>
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span className="text-white/90">$3,500</span>
              <span className="text-white/90">$10,000</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-[#d4c4a0]">
              <Cpu className="w-3 h-3 animate-spin" />
              <span>AI Tracking • $180/week optimized</span>
              <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping"></div>
            </div>
          </div>
          
          {/* Enhanced Vacation Fund */}
          <div className="bg-black/30 backdrop-blur-md border border-[#d4c4a0]/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4c4a0]/5 to-transparent animate-pulse"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#353c4a] to-[#d4c4a0] rounded-xl flex items-center justify-center relative">
                  <Trophy className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping"></div>
                </div>
                <span className="subheading text-white text-lg">Adventure Fund</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-base font-bold gradient-coral-navy font-mono">24.0%</div>
                <Waves className="w-4 h-4 text-[#d4c4a0] animate-bounce" />
              </div>
            </div>
            <div className="w-full bg-black/50 rounded-full h-4 border border-white/20 mb-3 relative overflow-hidden">
              <div className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#353c4a] h-4 rounded-full shadow-2xl relative" style={{width: '24%'}}>
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            <div className="flex justify-between text-sm font-mono mb-2">
              <span className="text-white/90">$1,200</span>
              <span className="text-white/90">$5,000</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-[#d4c4a0]">
              <Orbit className="w-3 h-3 animate-spin" />
              <span>Quantum Analysis • $95/week accelerated</span>
              <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Debt Elimination System */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border-gold relative overflow-hidden">
        {/* Quantum Elimination Field */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
          <div className="absolute top-10 right-12 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-8 left-20 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping delay-1500"></div>
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-pink-400 to-rose-300 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative">
              <Brain className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-300 rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h3 className="headline text-white text-xl">Debt Elimination AI™</h3>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Zap className="w-3 h-3" />
                <span>Strategic AI Engine v4.1</span>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button className="btn-coral text-xs px-4 py-2 rounded-2xl shadow-lg border border-white/20">
            <Plus className="w-3 h-3 mr-1" />
            Add Target
          </Button>
        </div>
        
        <div className="space-y-6 relative z-10">
          {/* Advanced Credit Card Target */}
          <div className="bg-black/30 backdrop-blur-md border border-red-400/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/5 to-transparent animate-pulse"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-400 rounded-xl flex items-center justify-center relative">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 rounded-full animate-ping"></div>
                </div>
                <div>
                  <span className="subheading text-white text-lg">Credit Card Debt</span>
                  <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <Cpu className="w-3 h-3" />
                    <span>Quantum Elimination Protocol</span>
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-red-400 font-mono">$2,500</div>
            </div>
            <div className="bg-black/40 p-3 rounded-xl mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-2">
                <span>Min Payment: $75</span>
                <span>APR: 18.99%</span>
              </div>
              <div className="w-full bg-red-900/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-pink-400 h-2 rounded-full" style={{width: '67%'}}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-300 font-mono">PRIORITY: CRITICAL</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-white/70">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>8 months left</span>
              </div>
            </div>
          </div>
          
          {/* Advanced Student Loan Target */}
          <div className="bg-black/30 backdrop-blur-md border border-orange-400/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/5 to-transparent animate-pulse"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-xl flex items-center justify-center relative">
                  <Target className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full animate-ping"></div>
                </div>
                <div>
                  <span className="subheading text-white text-lg">Student Loan</span>
                  <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <Waves className="w-3 h-3" />
                    <span>Long-term AI Strategy</span>
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-orange-400 font-mono">$15,000</div>
            </div>
            <div className="bg-black/40 p-3 rounded-xl mb-3">
              <div className="flex justify-between text-xs text-white/80 mb-2">
                <span>Min Payment: $200</span>
                <span>APR: 4.5%</span>
              </div>
              <div className="w-full bg-orange-900/30 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-yellow-400 h-2 rounded-full" style={{width: '25%'}}></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-300 font-mono">PRIORITY: MEDIUM</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-white/70">
                <Orbit className="w-3 h-3 animate-spin" />
                <span>5.2 years projected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}