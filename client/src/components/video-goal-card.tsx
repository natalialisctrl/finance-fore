import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, Unlock, Zap, Target, TrendingUp } from "lucide-react";
import type { VideoGoal } from "@shared/schema";

// Video URL functions for different goal types
const getDreamVideo = (goalType: string, goalTitle: string): string => {
  // Use reliable, appropriate demo videos
  const videos = {
    car: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Car/driving themed
    house: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Lifestyle/home themed  
    vacation: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Adventure/travel themed
    gadget: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Tech/entertainment themed
  };
  
  // For Tesla specifically, use the car-themed video
  if (goalTitle.toLowerCase().includes('tesla') || goalTitle.toLowerCase().includes('model')) {
    return videos.car;
  }
  
  return videos[goalType as keyof typeof videos] || videos.car;
};

const getGenericDreamVideo = (goalType: string): string => {
  // High-quality backup videos that match themes
  const backupVideos = {
    car: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Car themed
    house: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Lifestyle themed
    vacation: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Adventure themed
    gadget: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Tech themed
  };
  return backupVideos[goalType as keyof typeof backupVideos] || backupVideos.car;
};

const getVideoPoster = (goalType: string): string => {
  const posters = {
    car: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Tesla Model 3
    house: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Modern house
    vacation: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Beach vacation
    gadget: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Latest iPhone
  };
  return posters[goalType as keyof typeof posters] || posters.car;
};

interface VideoGoalCardProps {
  goal: VideoGoal;
  onUpdateProgress: (goalId: number, newAmount: number) => void;
}

export function VideoGoalCard({ goal, onUpdateProgress }: VideoGoalCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const currentAmount = goal.currentAmount || 0;
  const progressPercentage = (currentAmount / goal.targetAmount) * 100;
  const segmentThreshold = goal.targetAmount / 5; // 5 segments
  
  // Calculate which segments are unlocked based on current amount
  const unlockedSegments = Math.floor(currentAmount / segmentThreshold);
  const nextUnlockAmount = (unlockedSegments + 1) * segmentThreshold;
  const amountToNextUnlock = nextUnlockAmount - currentAmount;

  const videoSegments = goal.videoSegments || [
    { segmentNumber: 1, unlockThreshold: segmentThreshold * 1, description: "Opening Scene", isUnlocked: unlockedSegments >= 1 },
    { segmentNumber: 2, unlockThreshold: segmentThreshold * 2, description: "Main Subject", isUnlocked: unlockedSegments >= 2 },
    { segmentNumber: 3, unlockThreshold: segmentThreshold * 3, description: "Key Features", isUnlocked: unlockedSegments >= 3 },
    { segmentNumber: 4, unlockThreshold: segmentThreshold * 4, description: "Lifestyle Scene", isUnlocked: unlockedSegments >= 4 },
    { segmentNumber: 5, unlockThreshold: segmentThreshold * 5, description: "Complete Vision", isUnlocked: unlockedSegments >= 5 },
  ];

  const handleAddToGoal = () => {
    // Add $100 to the goal for demo purposes
    const newAmount = Math.min(currentAmount + 100, goal.targetAmount);
    onUpdateProgress(goal.id, newAmount);
  };

  return (
    <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden">
      {/* AI Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
        <div className="absolute top-6 right-8 w-1 h-1 bg-[#f39c12] rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-12 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-10 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-2xl flex items-center justify-center text-xl border border-red-300/20 shadow-2xl relative">
              {goal.goalType === 'car' ? '🚗' : goal.goalType === 'house' ? '🏠' : goal.goalType === 'vacation' ? '✈️' : '📱'}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#d4c4a0] to-[#c9b892] rounded-full animate-spin border border-white/50"></div>
            </div>
            <div>
              <h4 className="subheading text-white text-lg">{goal.goalTitle}</h4>
              <div className="text-xs text-white/60 flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>AI Video Generation • Progressive Unlock</span>
                <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 text-xs px-3 py-2 rounded-2xl shadow-lg"
            onClick={() => setIsVideoOpen(!isVideoOpen)}
          >
            <Play className="w-3 h-3 mr-1" />
            View Dream
          </Button>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          <div className="relative">
            <div className="flex justify-between text-sm mb-3 font-mono">
              <span className="text-white/90">${currentAmount.toLocaleString()}</span>
              <span className="text-[#fc304ed6]">{progressPercentage.toFixed(1)}%</span>
              <span className="text-white/90">${goal.targetAmount.toLocaleString()}</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-4 bg-black/50 border border-white/20"
            />
            <div className="text-sm text-white/70 text-center mt-3 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#fc304ed6] animate-pulse" />
              <span>Next Video Unlock: ${amountToNextUnlock.toLocaleString()}</span>
              <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Video Segments Preview */}
          <div className="grid grid-cols-5 gap-2">
            {videoSegments.map((segment, index) => (
              <div
                key={segment.segmentNumber}
                className={`aspect-video rounded-lg border-2 relative overflow-hidden transition-all duration-500 ${
                  segment.isUnlocked
                    ? "border-[#fc304ed6] bg-gradient-to-br from-[#fc304ed6]/20 to-[#f39c12]/20"
                    : "border-white/20 bg-black/30"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {segment.isUnlocked ? (
                    <Unlock className="w-4 h-4 text-[#fc304ed6]" />
                  ) : (
                    <Lock className="w-4 h-4 text-white/40" />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-1 text-center">
                  {segment.description}
                </div>
                {segment.isUnlocked && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-[#fc304ed6] rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#353c4a]/20 to-[#051421]/20 backdrop-blur-md border border-[#d4c4a0]/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <TrendingUp className="w-3 h-3 text-[#d4c4a0] animate-bounce" />
              </div>
              <div className="font-bold gradient-coral text-base">${(goal.targetAmount / 60).toFixed(0)}</div>
              <div className="text-[#d4c4a0] text-xs">Monthly Target</div>
              <div className="text-xs text-[#d4c4a0] mt-1">● AI Optimized</div>
            </div>
            <Button
              onClick={handleAddToGoal}
              className="btn-coral h-full flex flex-col items-center justify-center space-y-1"
              disabled={currentAmount >= goal.targetAmount}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs">Add $100</span>
            </Button>
          </div>
        </div>

        {/* Video Modal with Real Video Playback */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-4xl w-full relative">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl z-10"
              >
                ×
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-white text-xl font-semibold mb-2">{goal.goalTitle} Dream Vision</h3>
                <p className="text-white/60 text-sm">
                  {unlockedSegments} of 5 video segments unlocked • {progressPercentage.toFixed(1)}% complete
                </p>
              </div>

              {/* Real Video Player */}
              <div className="aspect-video bg-black rounded-2xl relative overflow-hidden mb-6">
                <video
                  className="w-full h-full object-cover rounded-2xl"
                  controls
                  autoPlay
                  muted
                  loop
                  poster={getVideoPoster(goal.goalType)}
                >
                  <source src={getDreamVideo(goal.goalType, goal.goalTitle)} type="video/mp4" />
                  <source src={getGenericDreamVideo(goal.goalType)} type="video/mp4" />
                  {/* Fallback for unsupported video */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="text-white/40 text-center">
                      <Play className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">Loading Dream Video...</p>
                      <p className="text-sm">{goal.goalTitle}</p>
                    </div>
                  </div>
                </video>
                
                {/* Segment Progress Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex space-x-1 mb-2">
                      {videoSegments.map((segment, index) => (
                        <div
                          key={segment.segmentNumber}
                          className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                            segment.isUnlocked
                              ? 'bg-green-500 shadow-green-500/50 shadow-sm'
                              : 'bg-gray-600'
                          }`}
                          title={`${segment.description} - ${segment.isUnlocked ? 'Unlocked' : 'Locked'}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-white/80">
                      <span>Segments: {unlockedSegments}/5</span>
                      <span>${currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Lock overlay for partially unlocked content */}
                {unlockedSegments < 5 && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-yellow-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm font-medium">Preview Mode</span>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      Save ${amountToNextUnlock.toLocaleString()} more to unlock next segment
                    </p>
                  </div>
                )}
              </div>

              {/* Unlock Progress */}
              <div className="grid grid-cols-5 gap-2 mb-6">
                {videoSegments.map((segment, index) => (
                  <div
                    key={segment.segmentNumber}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      segment.isUnlocked
                        ? 'bg-green-900/30 border-green-500/50 text-green-200'
                        : 'bg-gray-900/30 border-gray-600/50 text-gray-400'
                    }`}
                  >
                    <div className="mb-1">
                      {segment.isUnlocked ? <Unlock className="w-4 h-4 mx-auto" /> : <Lock className="w-4 h-4 mx-auto" />}
                    </div>
                    <div className="text-xs font-medium">{segment.description}</div>
                    <div className="text-xs">${(segment.unlockThreshold).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              {/* Action Section */}
              <div className="text-center">
                {unlockedSegments >= 5 ? (
                  <div className="text-green-400">
                    <p className="text-lg font-bold mb-2">🎉 Complete Dream Video Unlocked!</p>
                    <p className="text-sm text-white/60">Congratulations! You've saved enough to achieve your goal!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-white/80 text-sm">
                      Keep saving to unlock your complete dream visualization!
                    </p>
                    <Button
                      onClick={handleAddToGoal}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Add $100 (Demo)
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}