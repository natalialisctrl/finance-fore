import { Button } from "@/components/ui/button";
import { Target, Plus, Camera, Sparkles, Eye, Zap, Brain, Cpu, Waves, Activity } from "lucide-react";

export function MobileSceneBuilder() {
  return (
    <div className="space-y-8">
      {/* Advanced AI Header */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border-gold relative overflow-hidden">
        {/* Neural Network Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-1 h-1 bg-[#e74c3c] rounded-full animate-ping"></div>
          <div className="absolute top-6 right-8 w-1 h-1 bg-[#f39c12] rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-12 w-1 h-1 bg-[#e74c3c] rounded-full animate-ping delay-1000"></div>
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#e74c3c] via-[#f39c12] to-[#f1c40f] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative">
              <Brain className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h3 className="headline text-white text-xl">Neural Scene Builder™</h3>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Cpu className="w-3 h-3" />
                <span>Quantum-AI Vision Engine v3.2</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button className="btn-coral text-xs px-4 py-2 rounded-2xl shadow-lg border border-white/20">
            <Plus className="w-3 h-3 mr-1" />
            Generate Scene
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center relative z-10">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Activity className="w-3 h-3 text-[#e74c3c] animate-pulse" />
            </div>
            <div className="text-lg font-bold gradient-coral pulse-metric">2</div>
            <div className="text-xs text-white/70">Neural Scenes</div>
            <div className="text-xs text-green-400 mt-1">●  Processing</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Waves className="w-3 h-3 text-[#f39c12] animate-bounce" />
            </div>
            <div className="text-lg font-bold gradient-coral-navy pulse-metric">$23.7K</div>
            <div className="text-xs text-white/70">Quantum Saved</div>
            <div className="text-xs text-blue-400 mt-1">● +2.3% today</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Zap className="w-3 h-3 text-[#e74c3c] animate-pulse" />
            </div>
            <div className="text-lg font-bold gradient-coral pulse-metric">$740</div>
            <div className="text-xs text-white/70">AI Target</div>
            <div className="text-xs text-yellow-400 mt-1">● Optimized</div>
          </div>
        </div>
      </div>

      {/* Advanced Dream Car Scene */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden">
        {/* Holographic Scan Lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e74c3c]/5 to-transparent animate-pulse"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-10 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-2xl flex items-center justify-center text-xl border border-red-300/20 shadow-2xl relative">
              🚗
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-spin border border-white/50"></div>
            </div>
            <div>
              <h4 className="subheading text-white text-lg">Tesla Model 3 Fund</h4>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>HyperVision™ AI • Real-time Analysis</span>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs px-3 py-2 rounded-2xl shadow-lg">
            <Camera className="w-3 h-3 mr-1" />
            Hologram View
          </Button>
        </div>
        
        <div className="space-y-6 relative z-10">
          {/* Quantum Progress Scanner */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-3 font-mono">
              <span className="text-white/90">$8,750</span>
              <span className="text-[#e74c3c]">25.0%</span>
              <span className="text-white/90">$35,000</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-4 border border-white/20 relative overflow-hidden">
              <div className="bg-gradient-to-r from-[#e74c3c] via-[#f39c12] to-[#f1c40f] h-4 rounded-full shadow-2xl relative" style={{width: '25%'}}>
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            <div className="text-sm text-white/70 text-center mt-3 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-[#e74c3c] animate-pulse" />
              <span>Quantum Progress • Next Frame Unlock: 30%</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <Cpu className="w-3 h-3 text-cyan-400 animate-spin" />
              </div>
              <div className="font-bold gradient-coral text-base">$290</div>
              <div className="text-blue-200 text-xs">Neural Target</div>
              <div className="text-xs text-cyan-300 mt-1">● AI Optimized</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <Waves className="w-3 h-3 text-pink-400 animate-bounce" />
              </div>
              <div className="font-bold gradient-coral-navy text-base">22mo</div>
              <div className="text-purple-200 text-xs">Quantum Time</div>
              <div className="text-xs text-pink-300 mt-1">● Accelerating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Advanced Dream Home Scene */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border-gold relative overflow-hidden">
        {/* Advanced Holographic Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f1c40f]/5 to-transparent animate-pulse"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-10 bg-gradient-to-r from-green-600 via-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center text-xl border border-green-300/20 shadow-2xl relative">
              🏠
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-300 rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h4 className="subheading text-white text-lg">Dream Home Fund</h4>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>QuantumSpace™ AI • 3D Modeling Ready</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs px-3 py-2 rounded-2xl shadow-lg">
            <Camera className="w-3 h-3 mr-1" />
            AR Preview
          </Button>
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="relative">
            <div className="flex justify-between text-sm mb-3 font-mono">
              <span className="text-white/90">$15,000</span>
              <span className="text-[#f1c40f]">25.0%</span>
              <span className="text-white/90">$60,000</span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-4 border border-white/20 relative overflow-hidden">
              <div className="bg-gradient-to-r from-[#f1c40f] via-[#e67e22] to-[#e74c3c] h-4 rounded-full shadow-2xl relative" style={{width: '25%'}}>
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            <div className="text-sm text-white/70 text-center mt-3 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4 text-[#f1c40f] animate-pulse" />
              <span>Neural Analysis • Next AR Frame: 30%</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <Cpu className="w-3 h-3 text-emerald-400 animate-spin" />
              </div>
              <div className="font-bold gradient-coral text-base">$450</div>
              <div className="text-green-200 text-xs">Quantum Goal</div>
              <div className="text-xs text-emerald-300 mt-1">● Accelerated</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <Waves className="w-3 h-3 text-orange-400 animate-bounce" />
              </div>
              <div className="font-bold gradient-coral-navy text-base">36mo</div>
              <div className="text-orange-200 text-xs">Neural Time</div>
              <div className="text-xs text-orange-300 mt-1">● Optimizing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}