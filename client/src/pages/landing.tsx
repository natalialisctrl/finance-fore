import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Calculator, ShoppingCart, Brain, Target } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Floating Video Background */}
      <div className="fixed inset-0 z-0 opacity-20">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
        >
          <source src="/attached_assets/vecteezy_3d-dollar-money-bundle-floating-animation-on-black-background_23936705_1752690826601.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/20 backdrop-blur-md bg-white/10 dark:bg-black/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                Financial Forecast
              </h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Smart Financial Decisions with AI
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Make informed purchasing decisions with AI-powered price predictions, real-time economic analysis, 
                and personalized budget recommendations. Take control of your financial future today.
              </p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Powerful Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">AI Price Predictions</CardTitle>
                  <CardDescription>
                    Advanced machine learning algorithms predict 30-day price movements with confidence scores
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-white/70 dark:bg-black/30 backdrop-blur-md border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Economic Analysis</CardTitle>
                  <CardDescription>
                    Real-time economic indicators including inflation, GDP growth, and market trends
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