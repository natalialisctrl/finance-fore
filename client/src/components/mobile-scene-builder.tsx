import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Plus, Brain, Cpu, Waves, Activity, Zap, Film } from "lucide-react";
import { VideoGoalCard } from "@/components/video-goal-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { VideoGoal, InsertVideoGoal } from "@shared/schema";

export function MobileSceneBuilder() {
  const [isCreating, setIsCreating] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goalTitle: "",
    goalDescription: "",
    goalType: "car" as "car" | "house" | "vacation" | "gadget",
    targetAmount: 0
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = "demo-natalia"; // Use actual user ID in real app

  // Fetch video goals
  const { data: videoGoals = [], isLoading, refetch } = useQuery({
    queryKey: ['video-goals', userId],
    queryFn: async () => {
      const response = await fetch(`/api/video-goals/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch video goals');
      return response.json() as Promise<VideoGoal[]>;
    },
    refetchOnWindowFocus: true,
    staleTime: 0 // Always refetch to show latest data
  });

  // Create video goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: InsertVideoGoal) => {
      const response = await fetch("/api/video-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Dream Scene Created",
        description: "Your AI video goal has been generated successfully!",
      });
      // Force immediate refresh
      queryClient.invalidateQueries({ queryKey: ['video-goals', userId] });
      refetch();
      setIsCreating(false);
      setNewGoal({ goalTitle: "", goalDescription: "", goalType: "car", targetAmount: 0 });
    },
    onError: (error) => {
      console.error("Error creating video goal:", error);
      toast({
        title: "Error",
        description: `Failed to create video goal: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  // Update video goal progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ goalId, newAmount }: { goalId: number; newAmount: number }) => {
      const response = await fetch(`/api/video-goals/${goalId}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentAmount: newAmount }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-goals', userId] });
      refetch();
      toast({
        title: "Progress Updated",
        description: "Your savings progress has been updated!",
      });
    },
    onError: (error) => {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  const buildVideoSegments = (goalType: string, targetAmount: number) => {
    const segmentThreshold = Math.floor(targetAmount / 5);
    const sceneSegments: Record<string, string[]> = {
      car: ["Garage lights reveal the car", "Headlights and silhouette appear", "Interior and wheels render in", "Driving lifestyle shot unlocks", "Keys and full delivery scene"],
      house: ["Street view opens", "Front door and windows appear", "Interior rooms light up", "Life inside the home unlocks", "Full move-in scene"],
      vacation: ["Destination teaser opens", "Flight and arrival appear", "Hotel and landmarks unlock", "Activities extend the scene", "Full trip montage"],
      gadget: ["Studio reveal opens", "Screen glow and shape appear", "Features and accessories unlock", "Daily-use scene extends", "Full ownership reveal"],
    };
    const descriptions = sceneSegments[goalType] || sceneSegments.car;
    return descriptions.map((description, index) => ({
      segmentNumber: index + 1,
      unlockThreshold: segmentThreshold * (index + 1),
      description,
      isUnlocked: false,
    }));
  };

  const handleCreateGoal = () => {
    console.log("Creating goal with data:", newGoal);
    
    if (!newGoal.goalTitle || !newGoal.targetAmount || newGoal.targetAmount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    const videoSegments = buildVideoSegments(newGoal.goalType, Number(newGoal.targetAmount));

    const goalData: InsertVideoGoal = {
      userId,
      goalTitle: newGoal.goalTitle.trim(),
      goalDescription: (newGoal.goalDescription || "").trim(),
      goalType: newGoal.goalType,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      videoUrl: null,
      videoSegments,
      unlockedSegments: 0,
    };

    console.log("Sending goal data to API:", goalData);
    createGoalMutation.mutate(goalData);
  };

  const handleUpdateProgress = (goalId: number, newAmount: number) => {
    updateProgressMutation.mutate({ goalId, newAmount });
  };

  return (
    <div className="space-y-8">
      {/* Advanced AI Header */}
      <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border-gold relative overflow-hidden">
        {/* AI Network Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
          <div className="absolute top-6 right-8 w-1 h-1 bg-[#f39c12] rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-12 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping delay-1000"></div>
        </div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#fc304ed6] via-[#f39c12] to-[#f1c40f] rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative">
              <Brain className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white/50"></div>
            </div>
            <div>
              <h3 className="headline text-white text-xl">AI Scene Builder™</h3>
              <div className="flex items-center space-x-2 text-white/60 text-xs">
                <Cpu className="w-3 h-3" />
                <span>Progressive AI scene engine</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button 
            className="btn-coral text-xs px-4 py-2 rounded-2xl shadow-lg border border-white/20"
            onClick={() => setIsCreating(!isCreating)}
            data-testid="button-generate-scene"
          >
            <Plus className="w-3 h-3 mr-1" />
            Generate Scene
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center relative z-10">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Activity className="w-3 h-3 text-[#fc304ed6] animate-pulse" />
            </div>
            <div className="text-lg font-bold gradient-coral pulse-metric">{videoGoals.length}</div>
                <div className="text-xs text-white/70">AI Films</div>
            <div className="text-xs text-[#d4c4a0] mt-1">● Active</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Waves className="w-3 h-3 text-[#f39c12] animate-bounce" />
            </div>
            <div className="text-lg font-bold gradient-coral-navy pulse-metric">
              ${videoGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-white/70">Total Saved</div>
            <div className="text-xs text-[#d4c4a0] mt-1">● Growing</div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-1 right-1">
              <Zap className="w-3 h-3 text-[#fc304ed6] animate-pulse" />
            </div>
            <div className="text-lg font-bold gradient-coral pulse-metric">
              ${videoGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-white/70">Total Target</div>
            <div className="text-xs text-[#d4c4a0] mt-1">● Optimized</div>
          </div>
        </div>
      </div>

      {/* Create New Goal Form */}
      {isCreating && (
        <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-white text-lg font-semibold mb-4">Create New AI Goal Film</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goalTitle" className="text-white/80">Dream Title</Label>
                <Input
                  id="goalTitle"
                  value={newGoal.goalTitle}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, goalTitle: e.target.value }))}
                  placeholder="e.g., Tesla Model 3, Beach House, Europe Trip"
                  className="bg-black/30 border-white/20 text-white"
                  data-testid="input-goal-title"
                />
              </div>
              
              <div>
                <Label htmlFor="goalType" className="text-white/80">Dream Type</Label>
                <Select
                  value={newGoal.goalType}
                  onValueChange={(value: "car" | "house" | "vacation" | "gadget") => 
                    setNewGoal(prev => ({ ...prev, goalType: value }))
                  }
                >
                  <SelectTrigger className="bg-black/30 border-white/20 text-white" data-testid="select-goal-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Car</SelectItem>
                    <SelectItem value="house">🏠 House</SelectItem>
                    <SelectItem value="vacation">✈️ Vacation</SelectItem>
                    <SelectItem value="gadget">📱 Gadget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetAmount" className="text-white/80">Target Amount ($)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  min="1"
                  step="1000"
                  value={newGoal.targetAmount || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setNewGoal(prev => ({ ...prev, targetAmount: value }));
                  }}
                  placeholder="35000"
                  className="bg-black/30 border-white/20 text-white"
                  data-testid="input-target-amount"
                />
              </div>

              <div>
                <Label htmlFor="goalDescription" className="text-white/80">Description (Optional)</Label>
                <Input
                  id="goalDescription"
                  value={newGoal.goalDescription}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, goalDescription: e.target.value }))}
                  placeholder="Describe your dream in detail"
                  className="bg-black/30 border-white/20 text-white"
                  data-testid="input-goal-description"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleCreateGoal}
                  disabled={createGoalMutation.isPending}
                  className="btn-coral flex-1"
                  data-testid="button-generate-ai-scene"
                >
                  <Film className="w-4 h-4 mr-2" />
                  {createGoalMutation.isPending ? "Generating..." : "Generate AI Film"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="border-white/30 text-white hover:bg-white/10"
                  data-testid="button-cancel-goal"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Goals List */}

      {isLoading ? (
        <div className="text-center text-white/60 py-8">
          <Brain className="w-8 h-8 mx-auto mb-4 animate-pulse" />
          <p>Loading your dream scenes...</p>
        </div>
      ) : videoGoals.length === 0 ? (
        <div className="text-center text-white/60 py-8">
          <Target className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p data-testid="text-empty-scenes">No dream scenes yet. Create your first AI goal film and watch it grow as you save.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-white text-sm mb-4">Your AI films get longer and reveal more of the literal goal scene as progress grows.</p>
          {videoGoals.map((goal) => (
            <VideoGoalCard
              key={goal.id}
              goal={goal}
              onUpdateProgress={handleUpdateProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}