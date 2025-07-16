import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SmartBuyIndicatorProps {
  score: number;
  confidence: number;
  direction: "UP" | "DOWN" | "STABLE";
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function SmartBuyIndicator({ 
  score, 
  confidence, 
  direction, 
  size = "md",
  showDetails = false 
}: SmartBuyIndicatorProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 6) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
    if (score >= 6) return "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
    return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const getDirectionIcon = () => {
    switch (direction) {
      case "UP": return <TrendingUp className="w-3 h-3" />;
      case "DOWN": return <TrendingDown className="w-3 h-3" />;
      default: return <Minus className="w-3 h-3" />;
    }
  };

  const getDirectionColor = () => {
    switch (direction) {
      case "UP": return "text-red-500";
      case "DOWN": return "text-emerald-500";
      default: return "text-slate-500";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-8 h-8 text-xs";
      case "lg": return "w-16 h-16 text-xl";
      default: return "w-12 h-12 text-sm";
    }
  };

  const getRecommendation = (score: number) => {
    if (score >= 8) return "Strong Buy";
    if (score >= 6) return "Consider";
    if (score >= 4) return "Wait";
    return "Avoid";
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`${getSizeClasses()} ${getScoreBg(score)} border rounded-lg flex flex-col items-center justify-center relative`}>
        <div className={`font-bold ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          AI
        </div>
        
        {/* Direction indicator */}
        <div className={`absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border ${getDirectionColor()}`}>
          {getDirectionIcon()}
        </div>
      </div>
      
      {showDetails && (
        <div className="flex flex-col">
          <div className={`text-sm font-medium ${getScoreColor(score)}`}>
            {getRecommendation(score)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {Math.round(confidence * 100)}% confidence
          </div>
        </div>
      )}
    </div>
  );
}