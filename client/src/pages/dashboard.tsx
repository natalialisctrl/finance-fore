import { EconomicDashboard } from "@/components/economic-dashboard";
import { AIPredictionsDashboard } from "@/components/ai-predictions-dashboard";
import { PriceTrackingGrid } from "@/components/price-tracking-grid";
import { ChartsAndAnalytics } from "@/components/charts-analytics";
import { BudgetTracker } from "@/components/budget-tracker";
import { ShoppingList } from "@/components/shopping-list";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, CreditCard, User, Plus } from "lucide-react";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse float"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 glass-card mx-4 mt-4 lg:mx-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center glow-pulse">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    Financial Forecast
                  </h1>
                  <p className="text-xs text-white/70">AI-Powered Financial Intelligence</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#dashboard" className="text-white font-semibold">
                  Dashboard
                </a>
                <a href="#ai-predictions" className="text-white/80 hover:text-white transition-colors">
                  AI Predictions
                </a>
                <a href="#tracking" className="text-white/80 hover:text-white transition-colors">
                  Price Tracking
                </a>
                <a href="#budget" className="text-white/80 hover:text-white transition-colors">
                  Budget
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="glass-card p-3 text-white hover:bg-white/20 border-white/20"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
                
                <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 fade-in">
              Smart Financial
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 slide-up">
              Harness the power of AI to make smarter purchase decisions with real-time economic data and predictive analytics.
            </p>
          </div>

          {/* Hero Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 text-center scale-in">
              <div className="text-3xl font-bold text-white number-glow">94%</div>
              <div className="text-white/70 text-sm">Prediction Accuracy</div>
            </div>
            <div className="glass-card p-6 text-center scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-white number-glow">$2,340</div>
              <div className="text-white/70 text-sm">Avg Monthly Savings</div>
            </div>
            <div className="glass-card p-6 text-center scale-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-white number-glow">8.7/10</div>
              <div className="text-white/70 text-sm">Smart Buy Score</div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-background">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-30 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="fade-in">
            <EconomicDashboard />
          </div>
          <div className="slide-up" style={{ animationDelay: '0.2s' }}>
            <AIPredictionsDashboard />
          </div>
          <div className="slide-up" style={{ animationDelay: '0.4s' }}>
            <PriceTrackingGrid />
          </div>
          <div className="slide-up" style={{ animationDelay: '0.6s' }}>
            <ChartsAndAnalytics />
          </div>
          <div className="slide-up" style={{ animationDelay: '0.8s' }}>
            <BudgetTracker />
          </div>
          <div className="slide-up" style={{ animationDelay: '1s' }}>
            <ShoppingList />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab flex items-center justify-center ripple">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
