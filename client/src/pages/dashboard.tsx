import { EconomicDashboard } from "@/components/economic-dashboard";
import { AIPredictionsDashboard } from "@/components/ai-predictions-dashboard";
import { PriceTrackingGrid } from "@/components/price-tracking-grid";
import { ChartsAndAnalytics } from "@/components/charts-analytics";
import { BudgetTracker } from "@/components/budget-tracker";
import { EnhancedBudgetTracker } from "@/components/enhanced-budget-tracker";
import { ShoppingList } from "@/components/shopping-list";
import { EconomicTrendPrediction } from "@/components/economic-trend-prediction";
import { MinimalistFloatingDollars } from "@/components/minimalist-floating-dollars";
import { GoalsDebtDashboard } from "@/components/goals-debt-dashboard";
import { ScenarioPlanning } from "@/components/scenario-planning";
import { NotificationsCenter } from "@/components/notifications-center";
import { SecurityPrivacyDashboard } from "@/components/security-privacy-dashboard";
import { AISpendingCoach } from "@/components/ai-spending-coach";
import { LifeModeSettings } from "@/components/life-mode-settings";
import { LocationAlerts } from "@/components/location-alerts";
import { LocationSettings } from "@/components/location-settings";
import { SmartSceneBuilder } from "@/components/smart-scene-builder";
import { MobileSafeWrapper } from "@/components/mobile-safe-wrapper";
import { MobileGoalsDebt } from "@/components/mobile-goals-debt";
import { MobileSceneBuilder } from "@/components/mobile-scene-builder";
import { MobileScenarioPlanning } from "@/components/mobile-scenario-planning";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
// import { useAuth } from "@/hooks/useAuth"; // Auto-login mode
import { CreditCard, User, LogOut, TrendingUp, ShoppingCart, DollarSign, PiggyBank, AlertTriangle, CheckCircle, Clock, MapPin, MoreVertical, X, BarChart3, Brain, Wallet, Target, Calculator, Bell, Shield } from "lucide-react";
import { ForeseeLogo } from "@/components/foresee-logo";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


export default function Dashboard() {
  const { theme } = useTheme();
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [videoInteracted, setVideoInteracted] = useState(false);
  const [titleSpinning, setTitleSpinning] = useState(false);
  const queryClient = useQueryClient();

  // Handle title 3D interaction
  const handleTitleClick = () => {
    setTitleSpinning(true);
    setTimeout(() => setTitleSpinning(false), 600);
  };

  // Handle scroll-triggered 3D effect on mobile
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.innerWidth <= 768) { // Mobile only
            setTitleSpinning(true);
            setTimeout(() => setTitleSpinning(false), 400);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Video interaction handler for mobile
  const handleVideoInteraction = () => {
    if (!videoInteracted) {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true; // Ensure muted for autoplay
        video.play().catch(e => {
          console.log('Video play failed:', e);
          // Show fallback if video fails
          const fallback = document.querySelector('.video-fallback');
          if (fallback) {
            (fallback as HTMLElement).style.display = 'block';
          }
        });
        setVideoInteracted(true);
      }
    }
  };

  // Force video play on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      handleVideoInteraction();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mutation to add shopping list item
  const addItemMutation = useMutation({
    mutationFn: async (item: any) => {
      return await apiRequest("POST", "/api/shopping-list", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shopping-list"] });
      toast({
        title: "Item Added",
        description: `${newItemName} has been added to your shopping list!`,
      });
      setIsAddDialogOpen(false);
      setNewItemName("");
      setNewItemQuantity("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add item to shopping list.",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    
    addItemMutation.mutate({
      userId: user.id,
      itemName: newItemName,
      quantity: parseInt(newItemQuantity) || 1,
      estimatedPrice: Math.random() * 10 + 2, // Random price for demo
      averagePrice: Math.random() * 10 + 2,
      recommendation: "CONSIDER",
      savings: 0,
      completed: 0
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#243447] to-[#2e4057]">
      {/* Foresee Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e74c3c]/20 to-transparent animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-[#e74c3c]/20 rounded-full float-1"></div>
          <div className="absolute top-40 right-20 w-6 h-6 border border-[#e74c3c]/30 rounded-sm float-2"></div>
          <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-[#e74c3c]/25 rotate-45 float-3"></div>
          <div className="absolute bottom-20 right-1/3 w-5 h-5 border border-[#e74c3c]/20 rounded-full float-4"></div>
        </div>
      </div>
      {/* Main Dashboard Content */}
      <div className="relative z-10">
        {/* Dashboard Header */}
        <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <ForeseeLogo size="md" className="text-white" />
            <div className="flex items-center space-x-4">
              <span className="text-white/80 body-text pl-[1px] pr-[1px] mt-[-9px] mb-[-9px] ml-[-15px] mr-[-15px] text-justify pt-[5px] pb-[5px]">Welcome back, {user.firstName}</span>
              <Button 
                onClick={() => window.location.href = '/api/logout'}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 pl-[0px] pr-[0px]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>



        {/* Foresee Navigation Tabs */}
        <div className="relative z-50 mx-4 mt-4 mb-6">
          <div className="foresee-card bg-black/30 backdrop-blur-xl border-white/10 rounded-xl p-2">
            <div className="flex space-x-1">
              {[
                { id: 'dashboard', label: 'Home', icon: BarChart3, shortLabel: 'Home' },
                { id: 'ai-predictions', label: 'AI Insights', icon: Brain, shortLabel: 'AI' },
                { id: 'budget-goals', label: 'Budget & Goals', icon: Target, shortLabel: 'Goals' },
                { id: 'planning', label: 'Smart Planning', icon: Calculator, shortLabel: 'Plan' },
                { id: 'settings', label: 'Settings', icon: Bell, shortLabel: 'Set' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex flex-col items-center py-2 px-2 rounded-lg transition-all duration-300 transform touch-manipulation ${
                    activeTab === tab.id
                      ? 'bg-accent-coral text-white scale-105 shadow-lg border border-white/20'
                      : 'text-white/75 hover:text-white hover:bg-white/10'
                  }`}
                  style={{
                    minHeight: '48px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <tab.icon className={`mb-1 transition-all duration-200 ${
                    activeTab === tab.id ? 'w-4 h-4 text-white' : 'w-4 h-4 text-white/80'
                  }`} />
                  <span className={`text-xs font-medium leading-tight transition-all duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'text-white/85'
                  }`}>
                    {tab.shortLabel}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Foresee Hero Section - Only show on Home tab */}
        {activeTab === 'dashboard' && (
          <div className="relative z-40 max-w-6xl mx-auto px-4 py-6">
            <div className="text-center">
              <div 
                className={`headline text-white mb-4 fade-in ${titleSpinning ? 'spinning' : ''}`}
                onClick={handleTitleClick}
              >
                Financial Foresight<br/>
                <span className="accent-coral">in Real Time</span>
              </div>
              <p className="subheading text-white/80 max-w-2xl mx-auto mb-6 slide-up">
                AI-powered predictions for your local economy. Make smarter decisions with real-time intelligence.
              </p>
            </div>

            {/* Foresee Stats Cards with Futuristic Effects */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="foresee-card bg-black/40 backdrop-blur-md glow-border-gold p-3 text-center fade-in-stagger">
                <div className="text-lg font-bold gradient-gold mb-1 pulse-metric">94%</div>
                <div className="text-white/70 text-xs">AI Accuracy</div>
              </div>
              <div className="foresee-card bg-black/40 backdrop-blur-md glow-border p-3 text-center fade-in-stagger">
                <div className="text-lg font-bold gradient-coral-gold mb-1 pulse-metric">$2,340</div>
                <div className="text-white/70 text-xs">Monthly Savings</div>
              </div>
              <div className="foresee-card bg-black/40 backdrop-blur-md glow-border-gold p-3 text-center fade-in-stagger">
                <div className="text-lg font-bold gradient-gold mb-1 pulse-metric">8.7/10</div>
                <div className="text-white/70 text-xs">Smart Buy Score</div>
              </div>
            </div>
          </div>
        )}


      </div>
      {/* Main Content */}
      <div className={`relative z-30 ${activeTab === 'dashboard' ? 'mt-4' : 'mt-6'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          {activeTab === 'dashboard' && (
            <>
              <div className="fade-in-up">
                <EconomicDashboard />
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                <ChartsAndAnalytics />
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BudgetTracker />
                  <AISpendingCoach />
                </div>
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
                <ShoppingList />
              </div>
            </>
          )}
          
          {activeTab === 'ai-predictions' && (
            <div className="space-y-8">
              <div className="fade-in-up">
                <AIPredictionsDashboard />
              </div>
              <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                <PriceTrackingGrid />
              </div>
            </div>
          )}
          
          {activeTab === 'budget-goals' && (
            <div className="space-y-4 sm:space-y-8">
              {/* Mobile-First Approach */}
              <div className="block sm:hidden">
                <MobileSceneBuilder />
                <div className="mt-4">
                  <MobileGoalsDebt />
                </div>
              </div>
              
              {/* Desktop Components */}
              <div className="hidden sm:block">
                <div className="fade-in">
                  <MobileSafeWrapper fallbackTitle="Scene Builder Error" componentName="SmartSceneBuilder">
                    <SmartSceneBuilder />
                  </MobileSafeWrapper>
                </div>
                <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                  <MobileSafeWrapper fallbackTitle="Budget Tracker Error" componentName="EnhancedBudgetTracker">
                    <EnhancedBudgetTracker />
                  </MobileSafeWrapper>
                </div>
                <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                  <MobileSafeWrapper fallbackTitle="Goals & Debt Error" componentName="GoalsDebtDashboard">
                    <GoalsDebtDashboard />
                  </MobileSafeWrapper>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'planning' && (
            <div className="space-y-4 sm:space-y-8">
              {/* Mobile-First Approach */}
              <div className="block sm:hidden">
                <MobileScenarioPlanning />
              </div>
              
              {/* Desktop Components */}
              <div className="hidden sm:block">
                <div className="fade-in">
                  <MobileSafeWrapper fallbackTitle="Scenario Planning Error" componentName="ScenarioPlanning">
                    <ScenarioPlanning />
                  </MobileSafeWrapper>
                </div>
                <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                  <MobileSafeWrapper fallbackTitle="Economic Trends Error" componentName="EconomicTrendPrediction">
                    <EconomicTrendPrediction />
                  </MobileSafeWrapper>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LocationSettings />
                  <LocationAlerts />
                </div>
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <LifeModeSettings />
                  <NotificationsCenter />
                </div>
              </div>
              <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                <SecurityPrivacyDashboard />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
