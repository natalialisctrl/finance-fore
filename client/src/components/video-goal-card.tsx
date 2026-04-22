import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Lock, Unlock, Zap, Target, TrendingUp, Sparkles, Film, X } from "lucide-react";
import type { VideoGoal } from "@shared/schema";

type SceneSegment = {
  segmentNumber: number;
  unlockThreshold: number;
  description: string;
  isUnlocked?: boolean;
};

interface VideoGoalCardProps {
  goal: VideoGoal;
  onUpdateProgress: (goalId: number, newAmount: number) => void;
}

const getGoalIcon = (goalType: string) => {
  if (goalType === "house") return "🏠";
  if (goalType === "vacation") return "✈️";
  if (goalType === "gadget") return "📱";
  return "🚗";
};

const getSceneSegments = (goal: VideoGoal, segmentThreshold: number, currentAmount: number): SceneSegment[] => {
  const title = goal.goalTitle || "your goal";
  const templates: Record<string, string[]> = {
    car: [
      `A cinematic garage wakes up around ${title}`,
      "Headlights turn on and reveal the exact car silhouette",
      "The dashboard, wheels, and color details render in",
      "The car rolls into a city-night lifestyle shot",
      "Final delivery scene: keys, driveway, and full dream reveal",
    ],
    house: [
      `Golden-hour street view forms around ${title}`,
      "Front door, windows, and landscaping become visible",
      "Kitchen, living room, and warm interior lights unlock",
      "Family/lifestyle moments fill in the home scene",
      "Complete move-in scene with the full house revealed",
    ],
    vacation: [
      `The destination opens with the first shot of ${title}`,
      "Flights, bags, and arrival details render into the scene",
      "Hotel, beach, mountains, or city landmarks unlock",
      "Food, activities, and memory shots extend the video",
      "Full trip montage plays from departure to final sunset",
    ],
    gadget: [
      `A studio product reveal begins for ${title}`,
      "The device silhouette, screen glow, and specs appear",
      "Hands-on use, apps, and accessories unlock",
      "Lifestyle shots show the gadget in your daily routine",
      "Final ownership scene completes the generated product film",
    ],
  };

  const descriptions = templates[goal.goalType] || templates.car;

  return descriptions.map((description, index) => ({
    segmentNumber: index + 1,
    unlockThreshold: segmentThreshold * (index + 1),
    description,
    isUnlocked: currentAmount >= segmentThreshold * (index + 1),
  }));
};

function AIProgressiveScene({ goal, unlockedSegments, progressPercentage, expanded = false }: { goal: VideoGoal; unlockedSegments: number; progressPercentage: number; expanded?: boolean }) {
  const visibleWidth = Math.max(18, Math.min(100, progressPercentage));
  const runtimeSeconds = Math.max(8, Math.round((visibleWidth / 100) * 75));
  const icon = getGoalIcon(goal.goalType);
  const isCar = goal.goalType === "car";
  const isHouse = goal.goalType === "house";
  const isVacation = goal.goalType === "vacation";
  const isGadget = goal.goalType === "gadget";

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl ${expanded ? "aspect-video" : "min-h-[240px]"}`} data-testid={`scene-preview-${goal.id}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,48,78,0.28),transparent_30%),radial-gradient(circle_at_80%_25%,rgba(212,196,160,0.22),transparent_28%),linear-gradient(135deg,#06111f,#101827_48%,#06070d)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
      <div className="absolute inset-y-0 left-0 overflow-hidden transition-all duration-700" style={{ width: `${visibleWidth}%` }}>
        <div className="relative h-full min-w-[720px] bg-gradient-to-br from-[#182536] via-[#201123] to-[#05070c]">
          <div className="absolute left-8 top-8 flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#d4c4a0]" />
            AI rendering {runtimeSeconds}s scene
          </div>
          <div className="absolute right-12 top-10 h-14 w-14 rounded-full bg-[#d4c4a0]/80 blur-sm animate-pulse" />
          <div className="absolute left-0 right-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {isCar && (
            <>
              <div className="absolute bottom-16 left-0 h-20 w-full bg-slate-950/80 skew-y-[-2deg]" />
              <div className="absolute bottom-24 left-10 h-1 w-[620px] bg-gradient-to-r from-transparent via-[#d4c4a0] to-transparent animate-[sceneDrift_5s_linear_infinite]" />
              <div className="absolute bottom-28 left-32 h-20 w-56 rounded-[42px_42px_18px_18px] bg-gradient-to-r from-[#fc304e] to-[#9b1730] shadow-[0_0_55px_rgba(252,48,78,0.45)]">
                <div className="absolute left-14 top-4 h-9 w-24 rounded-t-3xl bg-white/18 border border-white/20" />
                <div className="absolute -left-4 top-11 h-3 w-12 rounded-full bg-[#d4c4a0] blur-sm" />
                <div className="absolute bottom-[-12px] left-8 h-8 w-8 rounded-full border-4 border-slate-900 bg-[#d4c4a0]" />
                <div className="absolute bottom-[-12px] right-9 h-8 w-8 rounded-full border-4 border-slate-900 bg-[#d4c4a0]" />
              </div>
            </>
          )}

          {isHouse && (
            <>
              <div className="absolute bottom-12 left-28 h-32 w-56 rounded-xl bg-gradient-to-br from-slate-200/90 to-[#d4c4a0]/70 shadow-[0_0_60px_rgba(212,196,160,0.28)]" />
              <div className="absolute bottom-40 left-20 h-24 w-72 rotate-[-3deg] bg-gradient-to-r from-[#fc304e] to-[#7f1d2d] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
              <div className="absolute bottom-16 left-48 h-20 w-12 rounded-t-lg bg-black/55 border border-white/20" />
              <div className="absolute bottom-28 left-40 h-10 w-12 rounded bg-[#f8e4a8]/80 animate-pulse" />
              <div className="absolute bottom-28 left-[230px] h-10 w-12 rounded bg-[#f8e4a8]/80 animate-pulse" />
              <div className="absolute bottom-8 left-0 h-14 w-full bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950" />
            </>
          )}

          {isVacation && (
            <>
              <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-[#0b5d70] to-[#27a6bd]" />
              <div className="absolute bottom-24 left-0 h-12 w-full bg-gradient-to-r from-[#d4c4a0] via-[#f6d99e] to-[#d4c4a0]" />
              <div className="absolute left-24 top-24 text-5xl animate-[float_4s_ease-in-out_infinite]">✈️</div>
              <div className="absolute bottom-36 left-80 h-32 w-10 bg-[#5a3419]" />
              <div className="absolute bottom-60 left-72 text-6xl rotate-[-18deg]">🌴</div>
              <div className="absolute bottom-12 left-36 h-2 w-80 rounded-full bg-white/55 animate-[sceneDrift_4s_linear_infinite]" />
            </>
          )}

          {isGadget && (
            <>
              <div className="absolute bottom-12 left-40 h-56 w-28 rounded-[2rem] border-4 border-slate-200 bg-gradient-to-br from-slate-950 to-black shadow-[0_0_70px_rgba(252,48,78,0.45)]">
                <div className="absolute inset-3 rounded-[1.35rem] bg-gradient-to-br from-[#fc304e]/50 via-[#182536] to-[#d4c4a0]/40" />
                <div className="absolute left-1/2 top-3 h-2 w-10 -translate-x-1/2 rounded-full bg-black" />
                <div className="absolute bottom-8 left-7 h-10 w-10 rounded-xl bg-white/20 animate-pulse" />
              </div>
              <div className="absolute bottom-24 left-80 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 w-12 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md animate-pulse" style={{ animationDelay: `${index * 160}ms` }} />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-8 left-8 max-w-[430px]">
            <div className="mb-2 text-4xl drop-shadow-2xl">{icon}</div>
            <div className="text-2xl font-bold text-white drop-shadow-lg">{goal.goalTitle}</div>
            <div className="mt-1 text-sm text-white/70">{goal.goalDescription || "A generated vision of the exact goal you are saving toward."}</div>
          </div>
        </div>
      </div>
      {visibleWidth < 100 && (
        <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-black/72 backdrop-blur-[2px] transition-all duration-700" style={{ width: `${100 - visibleWidth}%` }} data-testid={`locked-scene-area-${goal.id}`}>
          <div className="mx-4 rounded-2xl border border-white/15 bg-black/60 p-4 text-center text-white/75">
            <Lock className="mx-auto mb-2 h-5 w-5 text-[#d4c4a0]" />
            <div className="text-xs font-semibold uppercase tracking-[0.25em]">Future footage locked</div>
            <div className="mt-1 text-xs text-white/50">Save more to extend the scene</div>
          </div>
        </div>
      )}
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
        <div className="rounded-full border border-white/15 bg-black/55 px-3 py-1 text-xs text-white/75 backdrop-blur-md" data-testid={`text-unlocked-runtime-${goal.id}`}>
          {unlockedSegments}/5 chapters • {runtimeSeconds}s unlocked
        </div>
        <div className="rounded-full border border-[#fc304e]/35 bg-[#fc304e]/20 px-3 py-1 text-xs text-white backdrop-blur-md">
          {progressPercentage.toFixed(0)}% rendered
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-[#fc304e] to-[#d4c4a0] transition-all duration-700" style={{ width: `${visibleWidth}%` }} />
      </div>
    </div>
  );
}

export function VideoGoalCard({ goal, onUpdateProgress }: VideoGoalCardProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const currentAmount = goal.currentAmount || 0;
  const progressPercentage = Math.min((currentAmount / goal.targetAmount) * 100, 100);
  const segmentThreshold = goal.targetAmount / 5;
  const unlockedSegments = Math.min(5, Math.floor(currentAmount / segmentThreshold));
  const nextUnlockAmount = Math.min(goal.targetAmount, (unlockedSegments + 1) * segmentThreshold);
  const amountToNextUnlock = Math.max(0, nextUnlockAmount - currentAmount);
  const videoSegments = getSceneSegments(goal, segmentThreshold, currentAmount);
  const addAmount = Math.max(100, Math.round(goal.targetAmount * 0.05));

  const handleAddToGoal = () => {
    const newAmount = Math.min(currentAmount + addAmount, goal.targetAmount);
    onUpdateProgress(goal.id, newAmount);
  };

  return (
    <div className="foresee-card bg-black/40 backdrop-blur-xl border-white/10 p-6 glow-border relative overflow-hidden" data-testid={`card-video-goal-${goal.id}`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-4 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping" />
        <div className="absolute top-6 right-8 w-1 h-1 bg-[#f39c12] rounded-full animate-pulse" />
        <div className="absolute bottom-4 left-12 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping delay-1000" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-10 bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-2xl flex items-center justify-center text-xl border border-red-300/20 shadow-2xl relative">
              {getGoalIcon(goal.goalType)}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#d4c4a0] to-[#c9b892] rounded-full animate-spin border border-white/50" />
            </div>
            <div>
              <h4 className="subheading text-white text-lg" data-testid={`text-goal-title-${goal.id}`}>{goal.goalTitle}</h4>
              <div className="text-xs text-white/60 flex flex-wrap items-center gap-1">
                <Film className="w-3 h-3" />
                <span>Generated goal scene • gets longer as you save</span>
                <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 text-xs px-3 py-2 rounded-2xl shadow-lg"
            onClick={() => setIsVideoOpen(true)}
            data-testid={`button-view-scene-${goal.id}`}
          >
            <Play className="w-3 h-3 mr-1" />
            Play AI Scene
          </Button>
        </div>

        <AIProgressiveScene goal={goal} unlockedSegments={unlockedSegments} progressPercentage={progressPercentage} />

        <div className="space-y-5">
          <div className="relative">
            <div className="flex justify-between text-sm mb-3 font-mono">
              <span className="text-white/90" data-testid={`text-current-amount-${goal.id}`}>${currentAmount.toLocaleString()}</span>
              <span className="text-[#fc304ed6]" data-testid={`text-progress-percent-${goal.id}`}>{progressPercentage.toFixed(1)}%</span>
              <span className="text-white/90">${goal.targetAmount.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-4 bg-black/50 border border-white/20" />
            <div className="text-sm text-white/70 text-center mt-3 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#fc304ed6] animate-pulse" />
              {unlockedSegments >= 5 ? (
                <span data-testid={`text-scene-complete-${goal.id}`}>Full AI scene unlocked</span>
              ) : (
                <span data-testid={`text-next-unlock-${goal.id}`}>Next scene chapter unlocks at ${nextUnlockAmount.toLocaleString()} (${amountToNextUnlock.toLocaleString()} more)</span>
              )}
              <div className="w-2 h-2 bg-[#d4c4a0] rounded-full animate-ping" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
            {videoSegments.map((segment) => (
              <div
                key={segment.segmentNumber}
                className={`rounded-2xl border p-3 transition-all duration-500 ${
                  segment.isUnlocked
                    ? "border-[#fc304ed6]/60 bg-gradient-to-br from-[#fc304ed6]/20 to-[#f39c12]/15 text-white"
                    : "border-white/15 bg-black/25 text-white/50"
                }`}
                data-testid={`segment-${goal.id}-${segment.segmentNumber}`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold">Chapter {segment.segmentNumber}</span>
                  {segment.isUnlocked ? <Unlock className="h-4 w-4 text-[#d4c4a0]" /> : <Lock className="h-4 w-4" />}
                </div>
                <div className="text-xs leading-relaxed">{segment.description}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-gradient-to-br from-[#353c4a]/20 to-[#051421]/20 backdrop-blur-md border border-[#d4c4a0]/30 p-4 rounded-2xl text-center relative overflow-hidden">
              <div className="absolute top-1 right-1">
                <TrendingUp className="w-3 h-3 text-[#d4c4a0] animate-bounce" />
              </div>
              <div className="font-bold gradient-coral text-base">${Math.max(50, goal.targetAmount / 60).toFixed(0)}</div>
              <div className="text-[#d4c4a0] text-xs">Monthly Target</div>
              <div className="text-xs text-[#d4c4a0] mt-1">Scene grows with every update</div>
            </div>
            <Button
              onClick={handleAddToGoal}
              className="btn-coral h-full min-h-[84px] flex flex-col items-center justify-center space-y-1"
              disabled={currentAmount >= goal.targetAmount}
              data-testid={`button-add-progress-${goal.id}`}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs">Add ${addAmount.toLocaleString()} progress</span>
            </Button>
          </div>
        </div>

        {isVideoOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" data-testid={`modal-ai-scene-${goal.id}`}>
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-6 max-w-5xl w-full relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white z-10 rounded-full border border-white/15 bg-white/5 p-2"
                data-testid={`button-close-scene-${goal.id}`}
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-6 pr-10">
                <h3 className="text-white text-xl font-semibold mb-2">{goal.goalTitle} generated scene</h3>
                <p className="text-white/60 text-sm">
                  This is the current unlocked film cut. Saving more extends the visible scene and unlocks more literal details.
                </p>
              </div>
              <AIProgressiveScene goal={goal} unlockedSegments={unlockedSegments} progressPercentage={progressPercentage} expanded />
              <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-5">
                {videoSegments.map((segment) => (
                  <div
                    key={segment.segmentNumber}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      segment.isUnlocked
                        ? "bg-green-900/30 border-green-500/50 text-green-200"
                        : "bg-gray-900/30 border-gray-600/50 text-gray-400"
                    }`}
                  >
                    <div className="mb-1">
                      {segment.isUnlocked ? <Unlock className="w-4 h-4 mx-auto" /> : <Lock className="w-4 h-4 mx-auto" />}
                    </div>
                    <div className="text-xs font-medium">{segment.description}</div>
                    <div className="text-xs mt-1">${segment.unlockThreshold.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                {unlockedSegments >= 5 ? (
                  <div className="text-green-400">
                    <p className="text-lg font-bold mb-2">Complete AI goal scene unlocked</p>
                    <p className="text-sm text-white/60">The full visual story is now available because the savings goal is complete.</p>
                  </div>
                ) : (
                  <Button onClick={handleAddToGoal} className="btn-coral" data-testid={`button-modal-add-progress-${goal.id}`}>
                    <Zap className="w-4 h-4 mr-2" />
                    Add ${addAmount.toLocaleString()} progress
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
