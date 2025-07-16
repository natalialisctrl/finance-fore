import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { fetchPriceData, fetchSavingsData } from "@/lib/economic-api";
import { generatePriceTrends } from "@/lib/price-calculator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

export function ChartsAndAnalytics() {
  const [selectedItem, setSelectedItem] = useState("All Items");
  
  const { data: priceData, isLoading: isPriceLoading } = useQuery({
    queryKey: ["/api/price-data"],
    queryFn: fetchPriceData,
  });

  const { data: savingsData, isLoading: isSavingsLoading } = useQuery({
    queryKey: ["/api/savings/1", new Date().toISOString().slice(0, 10)],
    queryFn: () => fetchSavingsData(1, new Date().toISOString().slice(0, 10)),
  });

  // Generate chart data based on selected item
  const getChartData = () => {
    if (!priceData) return [];

    if (selectedItem === "All Items") {
      // Generate aggregated trends for all items
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      return months.map((month, index) => {
        const data: any = { month };
        priceData.forEach(item => {
          const trends = generatePriceTrends(item.currentPrice, item.averagePrice30Day, 6);
          data[item.itemName] = trends[index]?.price || item.currentPrice;
        });
        return data;
      });
    } else {
      // Generate trends for selected item
      const item = priceData.find(p => p.itemName === selectedItem);
      if (!item) return [];
      
      const trends = generatePriceTrends(item.currentPrice, item.averagePrice30Day, 6);
      return trends.map((trend, index) => ({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index],
        price: trend.price
      }));
    }
  };

  const chartData = getChartData();
  const colors = ["#EF4444", "#3B82F6", "#8B5CF6", "#F59E0B", "#10B981", "#EC4899"];

  if (isPriceLoading || isSavingsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Price Trends Chart */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" style={{boxShadow: 'none', filter: 'drop-shadow(0 4px 8px rgba(255, 140, 66, 0.1))'}}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Price Trends (6 Months)
            </h3>
            <select 
              className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 text-sm text-slate-900 dark:text-white"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="All Items">All Items</option>
              {priceData?.map(item => (
                <option key={item.id} value={item.itemName}>{item.itemName}</option>
              ))}
            </select>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${value.toFixed(2)}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                
                {selectedItem === "All Items" ? (
                  priceData?.map((item, index) => (
                    <Line
                      key={item.id}
                      type="monotone"
                      dataKey={item.itemName}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Savings Calculator */}
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700" style={{boxShadow: 'none', filter: 'drop-shadow(0 4px 8px rgba(255, 140, 66, 0.1))'}}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Weekly Savings Summary
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div>
                <div className="font-medium text-emerald-900 dark:text-emerald-300">
                  Total Saved This Week
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400">
                  From smart timing
                </div>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${savingsData?.weeklyTotal.toFixed(2) || "0.00"}
              </div>
            </div>

            <div className="space-y-3">
              {savingsData?.bestPurchases.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {index === 0 ? "Best Purchase: " : "Smart timing on "}{purchase.item}
                  </span>
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ${purchase.saved.toFixed(2)} saved
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Projected Monthly Savings
                </span>
                <span className="text-lg font-bold text-primary">
                  ${savingsData?.projectedMonthly.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
