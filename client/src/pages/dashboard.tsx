import { EconomicDashboard } from "@/components/economic-dashboard";
import { AIPredictionsDashboard } from "@/components/ai-predictions-dashboard";
import { PriceTrackingGrid } from "@/components/price-tracking-grid";
import { ChartsAndAnalytics } from "@/components/charts-analytics";
import { BudgetTracker } from "@/components/budget-tracker";
import { EnhancedBudgetTracker } from "@/components/enhanced-budget-tracker";
import { ShoppingList } from "@/components/shopping-list";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Moon, Sun, CreditCard, User, Plus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import floatingDollarVideo from "@assets/vecteezy_3d-dollar-money-bundle-floating-animation-on-black-background_23936705_1752690826601.mp4";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        {/* Floating dollar video background overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          >
            <source src={floatingDollarVideo} type="video/mp4" />
          </video>
          {/* Overlay gradient to blend video with existing background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-600/10"></div>
        </div>
        
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden z-10">
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
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`font-semibold transition-colors ${activeTab === 'dashboard' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('ai-predictions')}
                  className={`font-semibold transition-colors ${activeTab === 'ai-predictions' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                >
                  AI Predictions
                </button>
                <button 
                  onClick={() => setActiveTab('price-tracking')}
                  className={`font-semibold transition-colors ${activeTab === 'price-tracking' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Price Tracking
                </button>
                <button 
                  onClick={() => setActiveTab('budget')}
                  className={`font-semibold transition-colors ${activeTab === 'budget' ? 'text-white' : 'text-white/80 hover:text-white'}`}
                >
                  Budget
                </button>
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
                
                {user && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right text-white text-sm">
                      <div className="font-medium">
                        {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.email}
                      </div>
                      {user.email && <div className="text-xs opacity-75">{user.email}</div>}
                    </div>
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = '/api/logout'}
                      className="glass-card p-3 text-white hover:bg-white/20 border-white/20"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24 ml-[-4px] mr-[-4px] pl-[34px] pr-[34px]">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 fade-in">
              Smart Financial
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent pb-2 leading-tight">
                Intelligence
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 slide-up">
              Harness the power of AI to make smarter purchase decisions with real-time economic data and predictive analytics.
            </p>
          </div>

          {/* Hero Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pl-[3px] pr-[3px]">
            <div className="glass-card p-6 text-center scale-in pulse-orange">
              <div className="text-3xl font-bold text-white number-glow">94%</div>
              <div className="text-white/70 text-sm">Prediction Accuracy</div>
            </div>
            <div className="glass-card p-6 text-center scale-in pulse-orange" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl font-bold text-white number-glow">$2,340</div>
              <div className="text-white/70 text-sm">Avg Monthly Savings</div>
            </div>
            <div className="glass-card p-6 text-center scale-in pulse-orange" style={{ animationDelay: '0.4s' }}>
              <div className="text-3xl font-bold text-white number-glow">8.7/10</div>
              <div className="text-white/70 text-sm">Smart Buy Score</div>
            </div>
          </div>
        </div>


      </div>
      {/* Main Content */}
      <div className="relative z-30 -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <>
              <div className="fade-in">
                <EconomicDashboard />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <ChartsAndAnalytics />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                <BudgetTracker />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.6s' }}>
                <ShoppingList />
              </div>
            </>
          )}
          
          {activeTab === 'ai-predictions' && (
            <div className="fade-in">
              <AIPredictionsDashboard />
            </div>
          )}
          
          {activeTab === 'price-tracking' && (
            <div className="fade-in">
              <PriceTrackingGrid />
            </div>
          )}
          
          {activeTab === 'budget' && (
            <>
              <div className="fade-in">
                <EnhancedBudgetTracker />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <ShoppingList />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Floating Action Button */}
      <button 
        className="fab flex items-center justify-center ripple"
        onClick={() => {
          // Add item functionality - could open a modal or navigate to add item page
          console.log('Add item clicked');
        }}
      >
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
