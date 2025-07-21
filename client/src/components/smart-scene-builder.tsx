import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Target, Camera, Play, Lock, Unlock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SceneGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: 'car' | 'home' | 'vacation' | 'education' | 'business' | 'other';
  image?: string;
  description: string;
  weeklyGoal: number;
  monthsToGoal: number;
  unlockedElements: number;
  totalElements: number;
  quests: Quest[];
  isCompleted: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  unlockElement: string;
  weeklyTarget: number;
  estimatedWeeks: number;
}

const GOAL_CATEGORIES = [
  { value: 'car', label: 'Dream Car', icon: '🚗', elements: ['Engine', 'Wheels', 'Interior', 'Paint', 'Features'] },
  { value: 'home', label: 'Home Purchase', icon: '🏠', elements: ['Foundation', 'Walls', 'Roof', 'Kitchen', 'Garden'] },
  { value: 'vacation', label: 'Dream Vacation', icon: '✈️', elements: ['Flight', 'Hotel', 'Activities', 'Meals', 'Souvenirs'] },
  { value: 'education', label: 'Education', icon: '🎓', elements: ['Tuition', 'Books', 'Laptop', 'Certification', 'Graduation'] },
  { value: 'business', label: 'Start Business', icon: '💼', elements: ['License', 'Equipment', 'Marketing', 'Inventory', 'Launch'] },
  { value: 'other', label: 'Other Goal', icon: '🎯', elements: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Complete'] }
];

export function SmartSceneBuilder() {
  const { toast } = useToast();
  const [scenes, setScenes] = useState<SceneGoal[]>([]);
  const [activeScene, setActiveScene] = useState<SceneGoal | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: 0,
    targetDate: '',
    category: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSampleScenes();
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const loadSampleScenes = () => {
    const sampleScenes: SceneGoal[] = [
      {
        id: '1',
        title: 'Tesla Model 3',
        targetAmount: 45000,
        currentAmount: 12500,
        targetDate: new Date('2025-12-31'),
        category: 'car',
        description: 'My dream electric vehicle with autopilot',
        weeklyGoal: 625,
        monthsToGoal: 13,
        unlockedElements: 2,
        totalElements: 5,
        isCompleted: false,
        quests: [
          {
            id: 'q1',
            title: 'Engine Fund',
            description: 'Save for the electric drivetrain',
            targetAmount: 15000,
            currentAmount: 15000,
            isCompleted: true,
            unlockElement: 'Engine',
            weeklyTarget: 290,
            estimatedWeeks: 12
          },
          {
            id: 'q2',
            title: 'Premium Wheels',
            description: '19-inch sport wheels upgrade',
            targetAmount: 8000,
            currentAmount: 7200,
            isCompleted: false,
            unlockElement: 'Wheels',
            weeklyTarget: 155,
            estimatedWeeks: 2
          }
        ]
      },
      {
        id: '2',
        title: 'European Adventure',
        targetAmount: 8500,
        currentAmount: 3200,
        targetDate: new Date('2025-09-15'),
        category: 'vacation',
        description: '3-week journey through Paris, Rome, and Barcelona',
        weeklyGoal: 175,
        monthsToGoal: 8,
        unlockedElements: 1,
        totalElements: 5,
        isCompleted: false,
        quests: [
          {
            id: 'q3',
            title: 'Flight Tickets',
            description: 'Round-trip flights to Europe',
            targetAmount: 2500,
            currentAmount: 2500,
            isCompleted: true,
            unlockElement: 'Flight',
            weeklyTarget: 95,
            estimatedWeeks: 8
          }
        ]
      }
    ];
    setScenes(sampleScenes);
    setActiveScene(sampleScenes[0]);
  };

  const calculateProgress = (scene: SceneGoal) => {
    return Math.min((scene.currentAmount / scene.targetAmount) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    return GOAL_CATEGORIES.find(c => c.value === category)?.icon || '🎯';
  };

  const getUnlockAnimation = (isUnlocked: boolean) => {
    return isUnlocked 
      ? "animate-pulse bg-gradient-to-r from-green-500 to-emerald-600" 
      : "bg-gradient-to-r from-gray-400 to-gray-600 opacity-50";
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please choose an image smaller than 2MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewGoal(prev => ({ ...prev, image: e.target?.result as string }));
        toast({
          title: "Image Uploaded",
          description: "Your goal visualization is ready!",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: "Please try a different image",
          variant: "destructive"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-none">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Smart Scene Builder</h3>
              <p className="text-white">Build the life you see - Visual goal tracking</p>
            </div>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                <Camera className="w-4 h-4 mr-2" />
                New Scene
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
              <DialogHeader>
                <DialogTitle>Create Your Dream Scene</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Scene Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {newGoal.image ? (
                      <img src={newGoal.image} alt="Goal" className="max-h-32 mx-auto rounded-lg" />
                    ) : (
                      <div>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Button asChild variant="outline" size="sm">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            Upload Image
                          </label>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Goal Title</Label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Tesla Model 3"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOAL_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.icon} {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Amount ($)</Label>
                    <Input
                      type="number"
                      value={newGoal.targetAmount || ''}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
                      placeholder="45000"
                    />
                  </div>
                  <div>
                    <Label>Target Date</Label>
                    <Input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button disabled={!newGoal.title || !newGoal.targetAmount}>Create Scene</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {scenes.map((scene) => (
            <Button
              key={scene.id}
              variant={activeScene?.id === scene.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveScene(scene)}
              className="flex-shrink-0"
            >
              {getCategoryIcon(scene.category)} {scene.title}
            </Button>
          ))}
        </div>

        {activeScene && (
          <div className="space-y-4">
            <div className="glass-card p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-bold text-white">{activeScene.title}</h4>
                  <Badge className="bg-purple-500/20 text-purple-400">
                    {getCategoryIcon(activeScene.category)} {activeScene.category}
                  </Badge>
                </div>
                <p className="text-white text-sm mb-4">{activeScene.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-lg font-bold text-green-400">
                      ${activeScene.currentAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-white">Saved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">
                      ${activeScene.targetAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-white">Goal</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-pink-400">
                      ${activeScene.weeklyGoal}
                    </div>
                    <div className="text-xs text-white">Per Week</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-400">
                      {Math.ceil((activeScene.targetAmount - activeScene.currentAmount) / activeScene.weeklyGoal)}w
                    </div>
                    <div className="text-xs text-white">Remaining</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Progress</span>
                    <span>{calculateProgress(activeScene).toFixed(1)}%</span>
                  </div>
                  <Progress value={calculateProgress(activeScene)} className="h-2" />
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Play className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">Scene Elements</h4>
                <Badge className="bg-green-500/20 text-green-400">
                  {activeScene.unlockedElements}/{activeScene.totalElements} Unlocked
                </Badge>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {GOAL_CATEGORIES.find(c => c.value === activeScene.category)?.elements.map((element, index) => {
                  const isUnlocked = index < activeScene.unlockedElements;
                  return (
                    <div key={element} className="text-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mx-auto mb-1 ${getUnlockAnimation(isUnlocked)}`}>
                        {isUnlocked ? <Unlock className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4 text-gray-300" />}
                      </div>
                      <div className={`text-xs ${isUnlocked ? 'text-green-400' : 'text-gray-400'} text-center`}>
                        {element}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h4 className="font-semibold text-white">Active Quests</h4>
              </div>
              
              {activeScene.quests.slice(0, 2).map((quest) => (
                <div key={quest.id} className="glass-card p-4 bg-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium text-white text-sm">{quest.title}</h5>
                      <p className="text-xs text-white">{quest.description}</p>
                    </div>
                    <Badge className={quest.isCompleted 
                      ? 'bg-green-500/20 text-green-400 text-xs' 
                      : 'bg-blue-500/20 text-blue-400 text-xs'
                    }>
                      {quest.isCompleted ? 'Complete' : `${quest.estimatedWeeks}w left`}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-xs text-white mb-2">
                    <span>${quest.currentAmount.toLocaleString()} / ${quest.targetAmount.toLocaleString()}</span>
                    <span>{Math.min(((quest.currentAmount / quest.targetAmount) * 100), 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={Math.min((quest.currentAmount / quest.targetAmount) * 100, 100)} className="h-1" />
                  
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-white">Unlocks: {quest.unlockElement}</span>
                    <span className="text-xs text-purple-400 font-medium">${quest.weeklyTarget}/week</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {scenes.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Target className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Start Building Your Dreams</h4>
            <p className="text-white mb-4">Upload photos of your goals and watch them come to life as you save!</p>
            <Button onClick={() => setIsCreating(true)}>
              <Camera className="w-4 h-4 mr-2" />
              Create Your First Scene
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}