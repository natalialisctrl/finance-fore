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
import foreseeVideo from "@/assets/foresee-blinking-logo.mov";
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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black overflow-hidden">
      {/* Advanced AI Network Background */}
      <div className="fixed inset-0 z-0">
        {/* Primary quantum field */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fc304ed6]/5 via-transparent to-[#d4c4a0]/5 animate-pulse"></div>
        
        {/* Floating quantum particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse opacity-30 delay-500"></div>
          <div className="absolute bottom-1/4 left-1/2 w-1 h-1 bg-white rounded-full animate-ping opacity-10 delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-[#fc304ed6]/40 rounded-full animate-pulse opacity-25 delay-1500"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#d4c4a0] rounded-full animate-ping opacity-20 delay-2000"></div>
        </div>
        
        {/* Data stream lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#fc304ed6]/20 to-transparent animate-pulse"></div>
          <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-[#d4c4a0]/15 to-transparent animate-pulse delay-700"></div>
        </div>
      </div>
      {/* Main Dashboard Content */}
      <div className="relative z-10">
        {/* Quantum Navigation Header */}
        <header className="relative border-b border-white/10 backdrop-blur-3xl bg-gradient-to-r from-black/40 via-slate-900/20 to-black/40 sticky top-0 z-40 overflow-hidden">
          {/* Header particle effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-10 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative container mx-auto px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ForeseeLogo size="md" className="text-white" />
            </div>
            
            
          </div>
        </header>



        {/* Quantum Intelligence Navigation */}
        <div className="relative z-50 mx-6 mt-6 mb-8">
          <div className="relative glass-morphism p-3 rounded-2xl overflow-hidden group hover:neo-brutalism-card transition-all duration-500 border border-white/10">
            {/* Navigation ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#fc304ed6]/5 via-transparent to-[#d4c4a0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Data stream indicators */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fc304ed6]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-[#d4c4a0]/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite_reverse]"></div>
            
            <div className="relative flex space-x-2">
              {[
                { id: 'dashboard', label: 'AI Core', icon: BarChart3, shortLabel: 'Core' },
                { id: 'ai-predictions', label: 'AI Matrix', icon: Brain, shortLabel: 'AI' },
                { id: 'budget-goals', label: 'Quantum Goals', icon: Target, shortLabel: 'Goals' },
                { id: 'planning', label: 'Future Sync', icon: Calculator, shortLabel: 'Sync' },
                { id: 'settings', label: 'Control Hub', icon: Bell, shortLabel: 'Hub' }
              ].map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative flex-1 flex flex-col items-center py-3 px-3 rounded-xl transition-all duration-500 transform touch-manipulation animate-[fadeInUp_0.8s_ease-out] ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-[#fc304ed6] via-[#d4c4a0]/80 to-[#fc304ed6] text-white scale-105 shadow-[0_10px_30px_rgba(252,48,77,0.4)] border border-white/30'
                      : 'text-white/75 hover:text-white hover:bg-white/10 hover:scale-102 hover:shadow-[0_5px_20px_rgba(255,255,255,0.1)]'
                  }`}
                  style={{
                    minHeight: '56px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {/* Active state shimmer effect */}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-xl"></div>
                  )}
                  
                  <tab.icon className={`mb-1 transition-all duration-300 ${
                    activeTab === tab.id ? 'w-5 h-5 text-white animate-pulse' : 'w-4 h-4 text-white/80 group-hover:scale-110'
                  }`} />
                  <span className={`text-xs font-medium leading-tight transition-all duration-300 ${
                    activeTab === tab.id ? 'text-white font-semibold' : 'text-white/85'
                  }`}>
                    {tab.shortLabel}
                  </span>
                  
                  {/* Quantum indicator for active tab */}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
                      <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantum Hero Matrix - AI Core Tab */}
        {activeTab === 'dashboard' && (
          <div className="relative z-40 max-w-7xl mx-auto px-6 py-16 pl-[24px] pr-[24px] pt-[32px] pb-[32px] overflow-hidden min-h-[60vh]">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
                style={{
                  filter: 'brightness(0.8) contrast(1.1)',
                  objectPosition: 'center'
                }}
                src={foreseeVideo}
              />
              {/* Video overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#051421]/10 to-[#051421]/40"></div>
            </div>

            <div className="relative z-10 text-center">
              <div 
                className={`relative group inline-block ${titleSpinning ? 'spinning' : ''}`}
                onClick={handleTitleClick}
              >
                <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6 fade-in leading-tight">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                    Know what's coming.
                  </span>
                  <br/>
                  <span className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#fc304ed6] bg-clip-text text-transparent animate-pulse drop-shadow-lg">
                    Spend with clarity.
                  </span>
                </h1>
                
                {/* Quantum field around title */}
                <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#fc304ed6] rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
              
              
            </div>

            
          </div>
        )}


      </div>
      {/* Main Content */}
      <div className={`relative z-30 ${activeTab === 'dashboard' ? 'mt-4' : 'mt-6'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 pl-[15px] pr-[15px] pt-[0px] pb-[0px]">
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
