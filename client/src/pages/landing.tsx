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
        await apiRequest("/api/demo-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: "natalia", password: "1234" }),
        });
        // Reload to trigger authentication check
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        // Ignore errors, user can still manually log in
      }
    };
    autoLogin();
  }, []);
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

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-md bg-black/40 dark:bg-black/60">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <ForeseeLogo size="md" className="text-white" />
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="btn-coral shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/demo-login'}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Demo Login
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="headline text-white mb-6">
                Financial Foresight<br/>
                <span className="accent-coral">in an Uncertain Economy</span>
              </h2>
              <p className="subheading text-white/80 mb-8 leading-relaxed">
                AI-powered predictions for your local economy, from gas prices to groceries.
                Make smarter purchasing decisions with real-time economic intelligence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e74c3c] mx-auto mb-4"></div>
                  <p className="text-lg text-white/90">
                    Preparing your economic dashboard...
                  </p>
                  <p className="text-sm text-white/60 mt-2">
                    Loading personalized insights for Natalia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="subheading text-center mb-12 text-white">
              Beyond Budgeting — Economic Intelligence for Your Daily Life
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="foresee-card bg-black/40 backdrop-blur-md border-white/10 text-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent-coral flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">AI Price Predictions</CardTitle>
                  <CardDescription className="text-white/70">
                    Using data on inflation, GDP, and the consumer price index, the app forecasts grocery and gas prices in your area.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="foresee-card bg-black/40 backdrop-blur-md border-white/10 text-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#4a90e2] flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">Local Economic Intelligence</CardTitle>
                  <CardDescription className="text-white/70">
                    Utilizing inflation data, GDP, consumer price index, and AI, our app predicts local prices.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Smart Budgeting</CardTitle>
                  <CardDescription>
                    Intelligent budget tracking with spending velocity and category-based recommendations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Smart Shopping</CardTitle>
                  <CardDescription>
                    Optimal purchase timing recommendations and automated price alerts
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Personalized Insights</CardTitle>
                  <CardDescription>
                    Tailored recommendations based on your spending patterns and financial goals
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Savings Tracking</CardTitle>
                  <CardDescription>
                    Track your savings with detailed analytics and projected monthly totals
                  </CardDescription>
                </CardHeader>
              </Card>
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