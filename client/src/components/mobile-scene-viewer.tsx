import { useState } from 'react';
import { X, Play, Lock } from 'lucide-react';

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

interface MobileSceneViewerProps {
  scene: SceneGoal;
  isOpen: boolean;
  onClose: () => void;
}

const GOAL_CATEGORIES = [
  { value: 'car', label: 'Dream Car', icon: '🚗' },
  { value: 'home', label: 'Home Purchase', icon: '🏠' },
  { value: 'vacation', label: 'Dream Vacation', icon: '✈️' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'business', label: 'Start Business', icon: '💼' },
  { value: 'other', label: 'Other Goal', icon: '🎯' }
];

export function MobileSceneViewer({ scene, isOpen, onClose }: MobileSceneViewerProps) {
  const getCategoryInfo = (category: string) => {
    return GOAL_CATEGORIES.find(cat => cat.value === category) || GOAL_CATEGORIES[5];
  };

  const getProgressPercentage = (current: number, target: number): number => {
    if (!target || target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-lg">{getCategoryInfo(scene.category).icon}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{scene.title}</h3>
              <p className="text-white/70 text-sm">{scene.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Video Container - Optimized for Mobile */}
        <div className="flex-1 p-4">
          <div className="w-full aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl overflow-hidden border-2 border-purple-500/30">
            <div className="relative w-full h-full">
              {/* Mobile-Optimized Video Content */}
              <div className="absolute inset-0">
                {/* Render video content based on category */}
                {scene.category === 'car' && (
                  <div className="w-full h-full bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-800 opacity-20">
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900 opacity-50"></div>
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full h-1 bg-white opacity-60"></div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-red-800 rounded-lg shadow-2xl">
                      <div className="absolute top-1 left-1 right-1 h-4 bg-red-900 rounded opacity-80"></div>
                      <div className="absolute bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                )}
                {scene.category === 'home' && (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 relative overflow-hidden">
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-amber-100 relative">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-16 border-r-16 border-b-12 border-transparent border-b-red-600"></div>
                      <div className="absolute top-6 left-2 w-4 h-6 bg-amber-800 rounded-sm"></div>
                      <div className="absolute top-6 right-2 w-6 h-4 bg-blue-300 rounded-sm"></div>
                    </div>
                  </div>
                )}
                {scene.category === 'vacation' && (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute top-2 left-2 w-12 h-12 bg-yellow-400 rounded-full opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-yellow-200"></div>
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-brown-600"></div>
                    <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-green-500 rounded-full"></div>
                  </div>
                )}
                {(scene.category === 'education' || scene.category === 'business' || scene.category === 'other') && (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <span className="text-3xl">{getCategoryInfo(scene.category).icon}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mobile Progressive Video Reveal Overlay */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 5 }).map((_, index) => {
                  const isUnlocked = index < scene.unlockedElements;
                  const segmentWidth = 100 / 5;
                  
                  return (
                    <div
                      key={index}
                      className="flex-1 relative transition-all duration-1000"
                      style={{ width: `${segmentWidth}%` }}
                    >
                      {/* Mobile-optimized overlay for locked segments */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center">
                          <div className="text-center">
                            <Lock className="w-6 h-6 text-white/60 mx-auto mb-1" />
                            <div className="text-xs text-white/60">Locked</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Smooth gradient transitions for mobile */}
                      {!isUnlocked && index > 0 && scene.unlockedElements === index && (
                        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-black/90 -ml-3"></div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Mobile Video Progress Indicator */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-sm font-medium">Dream Revealed</span>
                    <span className="text-purple-300 text-sm font-bold">
                      {scene.unlockedElements}/5 segments
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-2 rounded-sm transition-all duration-500 ${
                          index < scene.unlockedElements
                            ? 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-sm'
                            : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-2 text-xs text-white/70">
                    {scene.unlockedElements === 0 && "Save to start revealing your dream"}
                    {scene.unlockedElements === 1 && "Environment unlocked - keep saving!"}
                    {scene.unlockedElements === 2 && "Main subject visible - halfway there!"}
                    {scene.unlockedElements === 3 && "Details emerging - almost complete!"}
                    {scene.unlockedElements === 4 && "Lifestyle scenes revealed - final push!"}
                    {scene.unlockedElements === 5 && "Complete dream visualization unlocked!"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Next Unlock Preview */}
          {scene.unlockedElements < 5 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-semibold">Next Unlock</h4>
                  <p className="text-white/70 text-sm">Save ${((scene.targetAmount / 5) * (scene.unlockedElements + 1) - scene.currentAmount).toLocaleString()} more</p>
                </div>
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          )}

          {/* Mobile Savings Progress */}
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <h4 className="text-white font-semibold mb-3">Savings Progress</h4>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/70 text-sm">${scene.currentAmount.toLocaleString()}</span>
              <span className="text-white/70 text-sm">${scene.targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(scene.currentAmount, scene.targetAmount)}%` }}
              ></div>
            </div>
            <div className="text-center">
              <span className="text-white font-semibold text-lg">
                {getProgressPercentage(scene.currentAmount, scene.targetAmount).toFixed(1)}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}