import { Button } from "@/components/ui/button";
import { Target, Plus, Camera, Sparkles, Eye, Zap } from "lucide-react";

export function MobileSceneBuilder() {
  return (
    <div className="space-y-4">
      {/* Futuristic Header */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-4 glow-border-gold">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#e74c3c] via-[#f39c12] to-[#f1c40f] rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="headline text-white text-lg">Dream Scene Builder</h3>
              <p className="text-white/60 text-xs">AI-Generated Goal Visualization</p>
            </div>
          </div>
          <Button className="btn-coral text-xs px-3 py-2 rounded-xl">
            <Plus className="w-3 h-3 mr-1" />
            Create
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="text-base font-bold gradient-gold pulse-metric">2</div>
            <div className="text-xs text-white/70">Active Scenes</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="text-base font-bold gradient-coral-gold pulse-metric">$23.7K</div>
            <div className="text-xs text-white/70">Total Saved</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="text-base font-bold gradient-gold pulse-metric">$740</div>
            <div className="text-xs text-white/70">Weekly Goal</div>
          </div>
        </div>
      </div>

      {/* Dream Car Scene */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-4 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-red-400 rounded-lg flex items-center justify-center text-lg">
              🚗
            </div>
            <div>
              <h4 className="subheading text-white">Dream Car Fund</h4>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Tesla Model 3 • AI Vision Active
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs px-2 py-1">
            <Camera className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
        
        <div className="space-y-4">
          {/* Enhanced Progress */}
          <div className="relative">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/80">$8,750</span>
              <span className="text-white/80">$35,000</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 border border-white/10">
              <div className="bg-gradient-to-r from-[#e74c3c] to-[#f39c12] h-3 rounded-full shadow-lg" style={{width: '25%'}}></div>
            </div>
            <div className="text-xs text-white/70 text-center mt-2 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-[#e74c3c]" />
              25% Complete • Video Unlocking
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 backdrop-blur-md border border-blue-400/20 p-3 rounded-xl text-center">
              <div className="font-bold gradient-gold text-sm">$290</div>
              <div className="text-blue-200 text-xs">Weekly Target</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 backdrop-blur-md border border-purple-400/20 p-3 rounded-xl text-center">
              <div className="font-bold gradient-coral-gold text-sm">22mo</div>
              <div className="text-purple-200 text-xs">Time Left</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Home Scene */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-4 glow-border-gold">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-emerald-400 rounded-lg flex items-center justify-center text-lg">
              🏠
            </div>
            <div>
              <h4 className="subheading text-white">Dream Home Fund</h4>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Down Payment • AI Vision Ready
              </div>
            </div>
          </div>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs px-2 py-1">
            <Camera className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/80">$15,000</span>
              <span className="text-white/80">$60,000</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 border border-white/10">
              <div className="bg-gradient-to-r from-[#f1c40f] to-[#e74c3c] h-3 rounded-full shadow-lg" style={{width: '25%'}}></div>
            </div>
            <div className="text-xs text-white/70 text-center mt-2 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-[#f1c40f]" />
              25% Complete • Next Video: 30%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 backdrop-blur-md border border-green-400/20 p-3 rounded-xl text-center">
              <div className="font-bold gradient-gold text-sm">$450</div>
              <div className="text-green-200 text-xs">Weekly Target</div>
            </div>
            <div className="bg-gradient-to-br from-orange-600/20 to-red-500/20 backdrop-blur-md border border-orange-400/20 p-3 rounded-xl text-center">
              <div className="font-bold gradient-coral-gold text-sm">36mo</div>
              <div className="text-orange-200 text-xs">Time Left</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}