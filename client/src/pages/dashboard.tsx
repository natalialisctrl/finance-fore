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
import { ScenarioPlanningDashboard } from "@/components/scenario-planning-dashboard";
import { NotificationsCenter } from "@/components/notifications-center";
import { SecurityPrivacyDashboard } from "@/components/security-privacy-dashboard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
// import { useAuth } from "@/hooks/useAuth"; // Auto-login mode
import { CreditCard, User, LogOut, TrendingUp, ShoppingCart, DollarSign, PiggyBank, AlertTriangle, CheckCircle, Clock, MapPin, MoreVertical, X, BarChart3, Brain, Wallet, Target, Calculator, Bell, Shield } from "lucide-react";
import ForeseeLogo from "@assets/Foresee_1753054026597.png";
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
    <div className="min-h-screen">
      {/* Minimalist Floating Dollar Animations */}
      <MinimalistFloatingDollars />
      {/* Premium Hero Section */}
      <div className="hero-gradient relative overflow-hidden">
        {/* Enhanced animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255, 193, 7, 0.4) 0%, transparent 60%),
                radial-gradient(circle at 80% 70%, rgba(255, 152, 0, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 40% 80%, rgba(255, 235, 59, 0.25) 0%, transparent 60%),
                radial-gradient(circle at 60% 20%, rgba(255, 215, 0, 0.35) 0%, transparent 50%)
              `,
              animation: 'float 8s ease-in-out infinite, pulse 4s ease-in-out infinite alternate',
              display: 'block',
              mixBlendMode: 'screen'
            }}
          >
            {/* Enhanced floating dollar symbols */}
            <div className="absolute top-1/4 left-1/4 text-6xl text-yellow-400/30 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>$</div>
            <div className="absolute top-3/4 right-1/4 text-4xl text-orange-400/40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>$</div>
            <div className="absolute bottom-1/3 left-1/3 text-5xl text-yellow-300/25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>$</div>
            <div className="absolute top-1/2 right-1/3 text-3xl text-amber-400/35 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>$</div>
            <div className="absolute top-1/3 left-2/3 text-5xl text-yellow-500/20 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }}>$</div>
            <div className="absolute bottom-1/4 right-2/3 text-4xl text-orange-300/30 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.2s' }}>$</div>
          </div>
          {/* Overlay gradient for blending */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-600/5" style={{ zIndex: 2 }}></div>
        </div>
        
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden z-10 bg-slate-900">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse float"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/10 rounded-full float" style={{ animationDelay: '4s' }}></div>
        </div>



        {/* Navigation Tabs */}
        <div className="relative z-50 mx-4 mt-4 mb-6">
          <div className="glass-card rounded-3xl p-3 bg-white/12 backdrop-blur-2xl border-2 border-white/20 shadow-2xl">
            <div className="flex space-x-2">
              {[
                { id: 'dashboard', label: 'Home', icon: BarChart3 },
                { id: 'ai-predictions', label: 'AI Insights', icon: Brain },
                { id: 'budget-goals', label: 'Budget & Goals', icon: Target },
                { id: 'planning', label: 'Smart Planning', icon: Calculator },
                { id: 'settings', label: 'Settings', icon: Bell }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 flex flex-col items-center py-4 px-2 rounded-2xl transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-br from-orange-500/35 to-orange-600/45 text-white scale-105 shadow-xl border-2 border-orange-300/60'
                      : 'text-white/75 hover:text-white hover:bg-white/15 hover:scale-102 active:scale-95'
                  }`}
                  style={{
                    minHeight: '72px',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  <tab.icon className={`mb-2 transition-all duration-200 ${
                    activeTab === tab.id ? 'w-7 h-7 text-white' : 'w-6 h-6 text-white/80'
                  }`} />
                  <span className={`text-xs font-bold leading-tight transition-all duration-200 ${
                    activeTab === tab.id ? 'text-white' : 'text-white/85'
                  }`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-orange-300 rounded-full animate-pulse shadow-lg"></div>
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-orange-600/30 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 pb-12 lg:pb-24">
          <div className="text-center">
            <div 
              className={`text-2xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 fade-in interactive-3d-title ${titleSpinning ? 'spinning' : ''}`}
              onClick={handleTitleClick}
            >
              <div className="title-content">
                <div className="text-white">Smart Financial</div>
                <div className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent pb-2 leading-tight">
                  Intelligence
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto mb-6 lg:mb-8 slide-up px-4">
              Harness the power of AI to make smarter purchase decisions with real-time economic data and predictive analytics.
            </p>
          </div>

          {/* Hero Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-12 px-2">
            <div className="glass-card p-4 lg:p-6 text-center scale-in pulse-orange">
              <div className="text-2xl lg:text-3xl font-bold text-white number-glow">94%</div>
              <div className="text-white/70 text-xs lg:text-sm">Prediction Accuracy</div>
            </div>
            <div className="glass-card p-4 lg:p-6 text-center scale-in pulse-orange" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl lg:text-3xl font-bold text-white number-glow">$2,340</div>
              <div className="text-white/70 text-xs lg:text-sm">Avg Monthly Savings</div>
            </div>
            <div className="glass-card p-4 lg:p-6 text-center scale-in pulse-orange" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl lg:text-3xl font-bold text-white number-glow">8.7/10</div>
              <div className="text-white/70 text-xs lg:text-sm">Smart Buy Score</div>
            </div>
          </div>
        </div>


      </div>
      {/* Main Content */}
      <div className="relative z-30 mt-4 lg:mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-8">
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
            <div className="space-y-8">
              <div className="fade-in">
                <AIPredictionsDashboard />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <PriceTrackingGrid />
              </div>
            </div>
          )}
          
          {activeTab === 'budget-goals' && (
            <div className="space-y-8">
              <div className="fade-in">
                <EnhancedBudgetTracker />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <GoalsDebtDashboard />
              </div>
            </div>
          )}
          
          {activeTab === 'planning' && (
            <div className="space-y-8">
              <div className="fade-in">
                <ScenarioPlanningDashboard />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <EconomicTrendPrediction />
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="fade-in">
                <NotificationsCenter />
              </div>
              <div className="slide-up" style={{ animationDelay: '0.2s' }}>
                <SecurityPrivacyDashboard />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
