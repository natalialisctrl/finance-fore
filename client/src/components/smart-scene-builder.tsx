import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import { Target, Plus, Camera, Play, Lock, Unlock, AlertTriangle, X, Star } from 'lucide-react';
import { MobileSceneViewer } from './mobile-scene-viewer';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
            unlockedElements: 3, // Show more progress to test video reveal
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

      {/* Mobile-Safe Scene Viewer */}
      {isViewerOpen && selectedScene && (
        <MobileSceneViewer 
          scene={selectedScene} 
          isOpen={isViewerOpen} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}
    </div>
  );
}