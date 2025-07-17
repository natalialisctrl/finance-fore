import { EconomicDashboard } from "@/components/economic-dashboard";
import { AIPredictionsDashboard } from "@/components/ai-predictions-dashboard";
import { PriceTrackingGrid } from "@/components/price-tracking-grid";
import { ChartsAndAnalytics } from "@/components/charts-analytics";
import { BudgetTracker } from "@/components/budget-tracker";
import { ShoppingList } from "@/components/shopping-list";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, CreditCard, User, Plus, LogOut, Home, Brain, Target, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import floatingDollarVideo from "@assets/vecteezy_3d-dollar-money-bundle-floating-animation-on-black-background_23936705_1752690826601.mp4";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  // Auto-login user data - skip authentication
  const user = {
    id: 'demo-natalia',
    firstName: 'Natalia',
    lastName: 'Demo',
    email: 'natalia@demo.com',
    profileImageUrl: null
  };
  const isAuthenticated = true;
  const isLoading = false;
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section - Mobile Optimized */}
      <div className="hero-gradient relative overflow-hidden">
        {/* Floating dollar video background overlay - Mobile friendly */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover opacity-10 sm:opacity-15 mix-blend-screen"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
            onError={(e) => {
              // Hide video on error for mobile compatibility
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src={floatingDollarVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Enhanced overlay gradient for mobile visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-blue-600/20 sm:from-orange-500/10 sm:to-blue-600/10"></div>
        </div>
        
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden z-10">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse float"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Mobile-Optimized Navigation */}
        <nav className="relative z-50 glass-card mx-2 mt-2 sm:mx-4 sm:mt-4 lg:mx-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center glow-pulse flex-shrink-0">
                  <CreditCard className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                    Financial Forecast
                  </h1>
                  <p className="text-xs text-white/70 hidden sm:block">AI-Powered Financial Intelligence</p>
                </div>
              </div>
              
              {/* Mobile-Friendly User Section */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </button>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.[0] || 'N'}
                  </div>
                  <span className="text-white font-medium text-sm hidden sm:block">{user.firstName}</span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Tab Navigation */}
        <div className="relative z-40 mx-2 mt-2 sm:mx-4 sm:mt-4 lg:mx-8">
          <div className="glass-card p-1">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`p-2 sm:p-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-orange-500 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4 mx-auto mb-1" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('ai-predictions')}
                className={`p-2 sm:p-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'ai-predictions' 
                    ? 'bg-white text-orange-500 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Brain className="w-4 h-4 mx-auto mb-1" />
                AI Predictions
              </button>
              <button 
                onClick={() => setActiveTab('price-tracking')}
                className={`p-2 sm:p-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'price-tracking' 
                    ? 'bg-white text-orange-500 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Target className="w-4 h-4 mx-auto mb-1" />
                Prices
              </button>
              <button 
                onClick={() => setActiveTab('budget')}
                className={`p-2 sm:p-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                  activeTab === 'budget' 
                    ? 'bg-white text-orange-500 shadow-lg' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calculator className="w-4 h-4 mx-auto mb-1" />
                Budget
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Mobile Optimized */}
      <div className="relative z-30 px-2 sm:px-4 lg:px-8 pb-6 -mt-4">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <EconomicDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <BudgetTracker />
                <ChartsAndAnalytics />
              </div>
            </>
          )}
          
          {activeTab === 'ai-predictions' && <AIPredictionsDashboard />}
          
          {activeTab === 'price-tracking' && <PriceTrackingGrid />}
          
          {activeTab === 'budget' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <BudgetTracker />
              <ShoppingList />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}