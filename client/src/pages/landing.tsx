import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calculator, ShoppingCart, Brain, Target } from "lucide-react";
import { ForeseeLogo } from "@/components/foresee-logo";
import { useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

export default function Landing() {
  // Auto-login when landing page loads
  useEffect(() => {
    const autoLogin = async () => {
      try {
        await apiRequest("/api/demo-login", "POST", { username: "natalia", password: "1234" });
        // Reload to trigger authentication check
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        // Ignore errors, user can still manually log in
      }
    };
    autoLogin();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black overflow-hidden">
      {/* Advanced Glassmorphism Background */}
      <div className="fixed inset-0 z-0">
        {/* Primary gradient field */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fc304ed6]/5 via-transparent to-[#d4c4a0]/5 animate-pulse"></div>
        
        {/* Floating particles */}
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

      <div className="relative z-10">
        {/* Modern Navigation Header */}
        <header className="relative border-b border-white/10 backdrop-blur-3xl bg-gradient-to-r from-black/40 via-slate-900/20 to-black/40 overflow-hidden">
          {/* Header particle effects */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/2 left-10 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-10 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative container mx-auto px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <ForeseeLogo size="md" className="text-white" />
              <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
              <div className="text-sm text-[#d4c4a0] font-mono opacity-80">
                Smart Financial Intelligence
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="group relative bg-gradient-to-r from-[#fc304ed6]/80 via-[#d4c4a0]/60 to-[#fc304ed6]/80 text-white font-medium px-6 py-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(252,48,77,0.3)] border border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative">Sign In</div>
              </Button>
              <Button 
                onClick={() => window.location.href = '/demo-login'}
                className="group relative glass-morphism text-white font-medium px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:neo-brutalism-card border border-white/20"
              >
                Demo Login
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-6xl mx-auto">
              <div className="relative group inline-block mb-8">
                <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                    Smart Financial
                  </span>
                  <br/>
                  <span className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#fc304ed6] bg-clip-text text-transparent animate-pulse">
                    Forecasting
                  </span>
                </h1>
                
                {/* Animated field around title */}
                <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 left-0 w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#fc304ed6] rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
              
              <p className="text-xl text-[#d4c4a0] max-w-4xl mx-auto mb-12 font-light leading-relaxed opacity-90">
                AI-powered price predictions and smart budgeting for intelligent financial decision making.
                <br className="hidden md:block" />
                Real-time economic insights for your local economy, from gas prices to groceries.
              </p>
              
              {/* Connection indicators */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
                <div className="flex items-center gap-2 glass-morphism px-6 py-3 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/80 font-mono">AI ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 glass-morphism px-6 py-3 rounded-full">
                  <div className="w-2 h-2 bg-[#fc304ed6] rounded-full animate-ping"></div>
                  <span className="text-sm text-white/80 font-mono">LIVE DATA</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <div className="text-center relative glass-morphism p-8 rounded-2xl max-w-md mx-auto">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-[#fc304ed6] border-r-[#d4c4a0] mx-auto mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#fc304ed6] to-[#d4c4a0] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-lg text-white font-light mb-2">
                    Loading Dashboard...
                  </p>
                  <p className="text-sm text-[#d4c4a0] opacity-80">
                    Preparing personalized insights for Natalia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-light text-white mb-6">
                <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                  Beyond Traditional Budgeting
                </span>
                <br/>
                <span className="bg-gradient-to-r from-[#fc304ed6] via-[#d4c4a0] to-[#fc304ed6] bg-clip-text text-transparent">
                  Smart Economic Intelligence
                </span>
              </h3>
              <p className="text-lg text-[#d4c4a0] max-w-3xl mx-auto opacity-90 font-light">
                AI-powered systems processing real-time economic data for intelligent financial decision making
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Neural Predictions",
                  description: "Quantum algorithms analyzing inflation, GDP, and consumer price index to forecast local market trends with unprecedented accuracy",
                  gradient: "from-[#fc304ed6] to-[#d4c4a0]"
                },
                {
                  icon: TrendingUp,
                  title: "Economic Intelligence Matrix",
                  description: "Real-time processing of Federal Reserve data streams combined with neural network analysis for hyper-local price predictions",
                  gradient: "from-[#d4c4a0] to-[#fc304ed6]"
                },
                {
                  icon: Calculator,
                  title: "Quantum Budget Engine",
                  description: "Advanced budget optimization with velocity tracking and category-based neural recommendations for maximum efficiency",
                  gradient: "from-purple-500 to-indigo-600"
                },
                {
                  icon: ShoppingCart,
                  title: "Neural Shopping Matrix",
                  description: "Optimal purchase timing algorithms with automated price alerts and market volatility predictions",
                  gradient: "from-emerald-500 to-teal-600"
                },
                {
                  icon: Target,
                  title: "Personalized AI Insights",
                  description: "Hyper-personalized recommendations powered by machine learning analysis of spending patterns and financial behavior",
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  icon: DollarSign,
                  title: "Savings Intelligence Hub",
                  description: "Advanced analytics tracking with predictive monthly projections and quantum financial optimization strategies",
                  gradient: "from-pink-500 to-rose-600"
                }
              ].map((feature, index) => (
                <div key={index} className="group relative glass-morphism p-8 rounded-2xl overflow-hidden hover:neo-brutalism-card transition-all duration-500 animate-[fadeInUp_0.8s_ease-out]" style={{animationDelay: `${index * 100}ms`}}>
                  {/* Holographic effects */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-[#fc304ed6] rounded-full animate-ping"></div>
                    <div className="absolute bottom-2 left-2 w-1 h-1 bg-[#d4c4a0] rounded-full animate-pulse delay-500"></div>
                  </div>
                  
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#fc304ed6]/20`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-light text-white mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-[#d4c4a0] opacity-80 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 backdrop-blur-md border-white/20 p-8">
              <CardContent className="text-center">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                  Ready to Transform Your Financial Future?
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of users making smarter financial decisions with AI-powered insights
                </p>
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Free Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/20 backdrop-blur-md bg-white/10 dark:bg-black/10 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Financial Forecast. Powered by AI for smarter financial decisions.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}