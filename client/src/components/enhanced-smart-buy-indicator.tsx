import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Shield, AlertTriangle, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EnhancedSmartBuyIndicatorProps {
  score: number;
  confidence: number;
  direction: "UP" | "DOWN" | "STABLE";
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  animate?: boolean;
}

export function EnhancedSmartBuyIndicator({ 
  score, 
  confidence, 
  direction, 
  size = "md",
  showDetails = false,
  animate = true
}: EnhancedSmartBuyIndicatorProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  // Animated number counting
  useEffect(() => {
    if (!animate) {
      setAnimatedScore(score);
      setAnimatedConfidence(confidence * 100);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const scoreStep = score / steps;
    const confidenceStep = (confidence * 100) / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.min(scoreStep * currentStep, score));
      setAnimatedConfidence(Math.min(confidenceStep * currentStep, confidence * 100));
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score, confidence, animate]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return { 
      text: "text-emerald-600 dark:text-emerald-400", 
      stroke: "#10b981",
      glow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
    };
    if (score >= 6) return { 
      text: "text-amber-600 dark:text-amber-400", 
      stroke: "#f59e0b",
      glow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
    };
    return { 
      text: "text-red-600 dark:text-red-400", 
      stroke: "#ef4444",
      glow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]"
    };
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <Shield className="w-3 h-3 text-emerald-500" />;
    if (confidence >= 0.6) return <AlertTriangle className="w-3 h-3 text-amber-500" />;
    return <HelpCircle className="w-3 h-3 text-red-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "from-emerald-400 to-emerald-600";
    if (confidence >= 0.6) return "from-amber-400 to-amber-600";
    return "from-red-400 to-red-600";
  };

  const getDirectionIcon = () => {
    switch (direction) {
      case "UP": return <TrendingUp className="w-3 h-3 text-red-500" />;
      case "DOWN": return <TrendingDown className="w-3 h-3 text-emerald-500" />;
      default: return <Minus className="w-3 h-3 text-slate-500" />;
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case "sm": return { 
        container: "w-16 h-16", 
        circle: 56, 
        text: "text-lg", 
        subText: "text-xs" 
      };
      case "lg": return { 
        container: "w-24 h-24", 
        circle: 88, 
        text: "text-3xl", 
        subText: "text-sm" 
      };
      default: return { 
        container: "w-20 h-20", 
        circle: 72, 
        text: "text-2xl", 
        subText: "text-xs" 
      };
    }
  };

  const getUrgencyClass = (score: number) => {
    if (score <= 3) return "animate-pulse";
    if (score >= 8) return "animate-pulse";
    return "";
  };

  const config = getSizeConfig();
  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * (config.circle / 2 - 8);
  const scoreOffset = circumference - (animatedScore / 10) * circumference;
  const confidenceOffset = circumference - (animatedConfidence / 100) * circumference;

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-3">
        {/* Animated Circular Progress Ring */}
        <div className={`relative ${config.container} ${getUrgencyClass(score)}`}>
          <svg 
            className={`transform -rotate-90 ${colors.glow}`} 
            width={config.circle} 
            height={config.circle}
          >
            {/* Background circle */}
            <circle
              cx={config.circle / 2}
              cy={config.circle / 2}
              r={config.circle / 2 - 8}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-slate-200 dark:text-slate-700"
            />
            
            {/* Score progress circle */}
            <circle
              cx={config.circle / 2}
              cy={config.circle / 2}
              r={config.circle / 2 - 8}
              stroke={colors.stroke}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={scoreOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 6px ${colors.stroke}40)`
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`font-bold ${colors.text} ${config.text}`}>
              {Math.round(animatedScore)}
            </div>
            <div className={`${colors.text} ${config.subText} opacity-70`}>
              AI
            </div>
          </div>
          
          {/* Direction indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-600">
            {getDirectionIcon()}
          </div>
        </div>
        
        {showDetails && (
          <div className="flex flex-col space-y-2">
            {/* Confidence Level with Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                {getConfidenceIcon(confidence)}
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {Math.round(animatedConfidence)}% Confidence
                </span>
              </div>
              
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${getConfidenceColor(confidence)} transition-all duration-1000 ease-out`}
                  style={{ width: `${animatedConfidence}%` }}
                />
              </div>
            </div>
            
            {/* Action Recommendation */}
            <Tooltip>
              <TooltipTrigger>
                <div className={`text-sm font-medium ${colors.text}`}>
                  {score >= 8 ? "Strong Buy" : score >= 6 ? "Consider" : score >= 4 ? "Wait" : "Avoid"}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs max-w-48">
                  {confidence >= 0.8 
                    ? "High confidence prediction based on strong data patterns"
                    : confidence >= 0.6 
                    ? "Moderate confidence with some uncertainty factors"
                    : "Lower confidence due to volatile market conditions"
                  }
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}