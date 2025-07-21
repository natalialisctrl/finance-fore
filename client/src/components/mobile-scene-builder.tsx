import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Camera } from "lucide-react";

export function MobileSceneBuilder() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">Scene Builder</h3>
            </div>
            <Button size="sm" className="touch-manipulation">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-white">2</div>
              <div className="text-xs text-white/70">Scenes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">$23.7K</div>
              <div className="text-xs text-white/70">Saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-400">$740</div>
              <div className="text-xs text-white/70">Weekly</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scene Cards */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚗</span>
              <div>
                <h4 className="text-sm font-semibold text-white">Dream Car Fund</h4>
                <div className="text-xs text-white/60">Tesla Model 3</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="touch-manipulation">
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/80">$8,750</span>
                <span className="text-white/80">$35,000</span>
              </div>
              <Progress value={25} className="h-2" />
              <div className="text-xs text-white/70 text-center mt-1">25% Complete</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-500/20 p-2 rounded text-center">
                <div className="font-semibold text-blue-200">$290</div>
                <div className="text-blue-300">Weekly</div>
              </div>
              <div className="bg-purple-500/20 p-2 rounded text-center">
                <div className="font-semibold text-purple-200">22mo</div>
                <div className="text-purple-300">Left</div>
              </div>
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
                <h4 className="text-sm font-semibold text-white">Home Down Payment</h4>
                <div className="text-xs text-white/60">House purchase</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="touch-manipulation">
              <Camera className="w-3 h-3" />
            </Button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/80">$15,000</span>
                <span className="text-white/80">$60,000</span>
              </div>
              <Progress value={25} className="h-2" />
              <div className="text-xs text-white/70 text-center mt-1">25% Complete</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-500/20 p-2 rounded text-center">
                <div className="font-semibold text-blue-200">$450</div>
                <div className="text-blue-300">Weekly</div>
              </div>
              <div className="bg-purple-500/20 p-2 rounded text-center">
                <div className="font-semibold text-purple-200">36mo</div>
                <div className="text-purple-300">Left</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}