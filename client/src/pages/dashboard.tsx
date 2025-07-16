import { EconomicDashboard } from "@/components/economic-dashboard";
import { PriceTrackingGrid } from "@/components/price-tracking-grid";
import { ChartsAndAnalytics } from "@/components/charts-analytics";
import { BudgetTracker } from "@/components/budget-tracker";
import { ShoppingList } from "@/components/shopping-list";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, CreditCard, User } from "lucide-react";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  EconoSmart Budget
                </h1>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#dashboard" className="text-primary font-medium">
                Dashboard
              </a>
              <a href="#tracking" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Price Tracking
              </a>
              <a href="#budget" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Budget
              </a>
              <a href="#reports" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                Reports
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EconomicDashboard />
        <PriceTrackingGrid />
        <ChartsAndAnalytics />
        <BudgetTracker />
        <ShoppingList />
      </div>
    </div>
  );
}
