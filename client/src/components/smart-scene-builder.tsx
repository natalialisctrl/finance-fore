import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { Target, Plus, Camera, Play, Lock, Unlock, AlertTriangle, X, Star } from 'lucide-react';

interface SceneGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  description: string;
  weeklyGoal: number;
  monthsToGoal: number;
  unlockedElements: number;
  totalElements: number;
  isCompleted: boolean;
}

const GOAL_CATEGORIES = [
  { value: 'car', label: 'Dream Car', icon: '🚗' },
  { value: 'home', label: 'Home Purchase', icon: '🏠' },
  { value: 'vacation', label: 'Dream Vacation', icon: '✈️' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'business', label: 'Start Business', icon: '💼' },
  { value: 'other', label: 'Other Goal', icon: '🎯' }
];

export function SmartSceneBuilder() {
  const [scenes, setScenes] = useState<SceneGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<SceneGoal | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setScenes([
          {
            id: '1',
            title: 'Dream Car Fund',
            targetAmount: 35000,
            currentAmount: 8750,
            targetDate: '2026-06-01',
            category: 'car',
            description: 'Save for a Tesla Model 3',
            weeklyGoal: 290,
            monthsToGoal: 22,
            unlockedElements: 1,
            totalElements: 5,
            isCompleted: false
          },
          {
            id: '2',
            title: 'Home Down Payment',
            targetAmount: 60000,
            currentAmount: 15000,
            targetDate: '2027-01-01',
            category: 'home',
            description: 'Save for house down payment',
            weeklyGoal: 450,
            monthsToGoal: 36,
            unlockedElements: 2,
            totalElements: 5,
            isCompleted: false
          }
        ]);
        setLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error loading scenes:", err);
      setError("Failed to load scenes");
      setLoading(false);
    }
  }, []);

  const getProgressPercentage = (current: number, target: number): number => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryInfo = (category: string) => {
    return GOAL_CATEGORIES.find(cat => cat.value === category) || GOAL_CATEGORIES[5];
  };

  if (error) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-white">Unable to load scene data</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 touch-manipulation"
            size="sm"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-white">Loading scene builder...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Scene Builder Header */}
      <Card className="glass-card pulse-orange">
        <CardContent className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white">Smart Scene Builder</h3>
                <p className="text-xs sm:text-sm text-white/70 hidden sm:block">Visual goal tracking system</p>
              </div>
            </div>
            <Button size="sm" className="touch-manipulation text-xs sm:text-sm">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              <span className="hidden sm:inline">Create Scene</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>

          {/* Goals Overview Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-white">
                {scenes.length}
              </div>
              <div className="text-xs text-white/70">Active Scenes</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-green-400">
                ${scenes.reduce((sum, scene) => sum + scene.currentAmount, 0).toLocaleString()}
              </div>
              <div className="text-xs text-white/70">Total Saved</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-blue-400">
                ${scenes.reduce((sum, scene) => sum + scene.weeklyGoal, 0)}
              </div>
              <div className="text-xs text-white/70">Weekly Goal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Scene Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {scenes.map((scene) => {
          const progress = getProgressPercentage(scene.currentAmount, scene.targetAmount);
          const categoryInfo = getCategoryInfo(scene.category);
          const questProgress = (scene.unlockedElements / scene.totalElements) * 100;
          
          return (
            <Card key={scene.id} className="glass-card hover:scale-102 transition-transform touch-manipulation">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl">{categoryInfo.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white text-sm sm:text-base">{scene.title}</h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {categoryInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="touch-manipulation">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Progress Section */}
                  <div>
                    <div className="flex justify-between text-xs sm:text-sm text-white/80 mb-1">
                      <span>${scene.currentAmount.toLocaleString()}</span>
                      <span>${scene.targetAmount.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2 mb-1" />
                    <div className="text-xs text-white/70 text-center">
                      {progress.toFixed(0)}% Complete
                    </div>
                  </div>

                  {/* Quest Progress */}
                  <div className="bg-white/10 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">Scene Elements</span>
                      <span className="text-xs text-white/70">
                        {scene.unlockedElements}/{scene.totalElements}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: scene.totalElements }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 h-2 rounded ${
                            index < scene.unlockedElements 
                              ? 'bg-green-500' 
                              : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Weekly Goal & Timeline */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-500/20 p-2 rounded text-center">
                      <div className="font-semibold text-blue-200">${scene.weeklyGoal}</div>
                      <div className="text-blue-300">Weekly Goal</div>
                    </div>
                    <div className="bg-purple-500/20 p-2 rounded text-center">
                      <div className="font-semibold text-purple-200">{scene.monthsToGoal}mo</div>
                      <div className="text-purple-300">Time Left</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 touch-manipulation text-xs"
                      onClick={() => {
                        setSelectedScene(scene);
                        setIsViewerOpen(true);
                      }}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      View Scene
                    </Button>
                    <Button size="sm" variant="outline" className="touch-manipulation">
                      {scene.unlockedElements > 0 ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    </Button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/60 leading-relaxed">
                    {scene.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create New Scene Card */}
      <Card className="glass-card border-dashed border-2 border-white/30 hover:border-white/50 transition-colors">
        <CardContent className="p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1">Create New Scene</h4>
              <p className="text-sm text-white/70">Build a visual goal moodboard</p>
            </div>
            <Button className="touch-manipulation">
              <Camera className="w-4 h-4 mr-2" />
              Start Building
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simple Scene Viewer - Mobile Safe */}
      {isViewerOpen && selectedScene && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getCategoryInfo(selectedScene.category).icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedScene.title}</h3>
                  <p className="text-sm text-white/70">{selectedScene.description}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsViewerOpen(false)}
                className="touch-manipulation"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* AI Dream Video Player */}
              <div className="relative">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-purple-400" />
                  Your Dream Visualization
                </h4>
                
                {/* Video Container */}
                <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl overflow-hidden border-2 border-purple-500/30">
                  <div className="aspect-video relative">
                    {/* Video Placeholder - AI Generated Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Play className="w-8 h-8 text-purple-300" />
                        </div>
                        <p className="text-white/80 font-medium mb-2">AI Dream Video</p>
                        <p className="text-white/60 text-sm">
                          {getCategoryInfo(selectedScene.category).label}: {selectedScene.title}
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Reveal Overlay */}
                    <div className="absolute inset-0 flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 transition-all duration-500 ${
                            index < selectedScene.unlockedElements
                              ? 'bg-transparent'
                              : 'bg-black/80 backdrop-blur-sm'
                          }`}
                          style={{
                            background: index >= selectedScene.unlockedElements 
                              ? `linear-gradient(to right, 
                                  ${index === 0 ? 'transparent' : 'rgba(0,0,0,0.8)'}, 
                                  rgba(0,0,0,0.8))`
                              : 'transparent'
                          }}
                        >
                          {index >= selectedScene.unlockedElements && (
                            <div className="h-full flex items-center justify-center">
                              <Lock className="w-6 h-6 text-white/40" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Progress Indicator */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/80 text-sm">Video Unlocked</span>
                          <span className="text-purple-300 text-sm font-bold">
                            {selectedScene.unlockedElements}/5 segments
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div
                              key={index}
                              className={`flex-1 h-2 rounded transition-all ${
                                index < selectedScene.unlockedElements
                                  ? 'bg-purple-400'
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Next Unlock Preview */}
                {selectedScene.unlockedElements < 5 && (
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 font-medium text-sm">Next Unlock</p>
                        <p className="text-white/70 text-xs">
                          Save ${((selectedScene.targetAmount / 5) * (selectedScene.unlockedElements + 1) - selectedScene.currentAmount).toLocaleString()} more
                        </p>
                      </div>
                      <div className="text-purple-300">
                        <Lock className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Savings Progress */}
              <div>
                <h4 className="font-semibold text-white mb-3">Savings Progress</h4>
                <div className="flex justify-between text-sm text-white/80 mb-2">
                  <span>${selectedScene.currentAmount.toLocaleString()}</span>
                  <span>${selectedScene.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={getProgressPercentage(selectedScene.currentAmount, selectedScene.targetAmount)} className="h-3 mb-2" />
                <div className="text-center text-sm text-white/70">
                  {getProgressPercentage(selectedScene.currentAmount, selectedScene.targetAmount).toFixed(1)}% Complete
                </div>
              </div>

              {/* Video Unlock Milestones */}
              <div>
                <h4 className="font-semibold text-white mb-3">Video Unlock Timeline</h4>
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const unlockAmount = (selectedScene.targetAmount / 5) * (index + 1);
                    const isUnlocked = selectedScene.currentAmount >= unlockAmount;
                    const isCurrent = index === selectedScene.unlockedElements;
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-all ${
                          isUnlocked
                            ? 'bg-green-500/20 border-green-500/50 text-green-200'
                            : isCurrent
                            ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 animate-pulse'
                            : 'bg-white/10 border-white/20 text-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {isUnlocked ? (
                              <Star className="w-5 h-5 text-green-400" />
                            ) : isCurrent ? (
                              <Target className="w-5 h-5 text-purple-400" />
                            ) : (
                              <Lock className="w-5 h-5" />
                            )}
                            <div>
                              <p className="font-medium text-sm">Segment {index + 1}</p>
                              <p className="text-xs opacity-80">
                                {index === 0 && "Opening scene & environment"}
                                {index === 1 && "Main subject introduction"}
                                {index === 2 && "Detailed features & highlights"}
                                {index === 3 && "Action sequences & lifestyle"}
                                {index === 4 && "Complete dream visualization"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              ${unlockAmount.toLocaleString()}
                            </p>
                            <p className="text-xs opacity-70">
                              {isUnlocked ? "Unlocked" : isCurrent ? "Next" : "Locked"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button className="w-full touch-manipulation" onClick={() => setIsViewerOpen(false)}>
                  <Play className="w-4 h-4 mr-2" />
                  Generate AI Dream Video
                </Button>
                <Button variant="outline" className="w-full touch-manipulation" onClick={() => setIsViewerOpen(false)}>
                  <Camera className="w-4 h-4 mr-2" />
                  Customize Scene Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}