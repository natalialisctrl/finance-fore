import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { fetchEconomicData, refreshFredData } from "@/lib/economic-api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp, TrendingDown, Activity, AlertTriangle, Droplets,
  BarChart3, DollarSign, Home, Percent, Briefcase, Settings, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// ─── Card definitions ────────────────────────────────────────────────────────

interface CardDef {
  id: string;
  label: string;
  sublabel: string;
  category: "macro" | "housing" | "market";
}

const ALL_CARDS: CardDef[] = [
  { id: "inflation",    label: "Inflation Rate",       sublabel: "CPI YoY",              category: "macro"   },
  { id: "gdp",          label: "GDP Growth",            sublabel: "Quarterly",             category: "macro"   },
  { id: "cpi",          label: "Consumer Price Index",  sublabel: "Urban Consumers",       category: "macro"   },
  { id: "unemployment", label: "Unemployment Rate",     sublabel: "U-3 BLS",               category: "macro"   },
  { id: "fedRate",      label: "Fed Funds Rate",        sublabel: "Federal Reserve",       category: "macro"   },
  { id: "mortgage",     label: "30-Yr Mortgage",        sublabel: "Housing Market",        category: "housing" },
  { id: "oil",          label: "WTI Crude Oil",         sublabel: "Per barrel",            category: "market"  },
  { id: "dollar",       label: "Dollar Index (DXY)",    sublabel: "USD Strength",          category: "market"  },
];

const CATEGORY_LABELS: Record<string, string> = {
  macro:   "Macro Economics",
  housing: "Housing Market",
  market:  "Commodity & Currency",
};

const DEFAULT_VISIBLE = ["inflation", "gdp", "unemployment", "fedRate", "mortgage", "oil"];
const LS_KEY = "foresee_eco_cards";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sparkline(current: number, trend: "up" | "down" | "stable") {
  const v = current * 0.1;
  return Array.from({ length: 12 }, (_, i) => {
    let val = current;
    if (trend === "up")   val += (v * (i / 12)) + (Math.random() - 0.5) * v * 0.3;
    if (trend === "down") val -= (v * (i / 12)) + (Math.random() - 0.5) * v * 0.3;
    if (trend === "stable") val += (Math.random() - 0.5) * v * 0.2;
    return { value: Math.max(0, val) };
  });
}

function trendColor(trend: "up" | "down" | "stable", positive: "up" | "down" = "up") {
  if (trend === positive)   return "#10b981"; // emerald
  if (trend === "stable")   return "#f59e0b"; // amber
  return "#ef4444";                           // red
}

function healthSummary(d: any) {
  let score = 45;
  const alerts: string[] = [];
  if (d.inflationRate > 4)   { score -= 35; alerts.push("High inflation severely eroding purchasing power"); }
  else if (d.inflationRate > 3) { score -= 25; alerts.push("Elevated inflation reducing buying power"); }
  else if (d.inflationRate > 2.5) { score -= 15; alerts.push("Moderate inflation rising faster than wages"); }
  if (d.gdpGrowth < 1)   { score -= 25; alerts.push("Economic slowdown — job market uncertain"); }
  else if (d.gdpGrowth < 2) { score -= 10; alerts.push("Sluggish growth — be cautious with major purchases"); }
  if (d.consumerPriceIndex > 310) { score -= 20; alerts.push("Consumer prices at concerning levels"); }
  else if (d.consumerPriceIndex > 300) { score -= 12; alerts.push("Rising consumer costs affecting households"); }
  score -= 8;
  alerts.push("Current economic conditions challenging for most households");
  const s = Math.max(5, score);
  const status = s >= 70 ? "Good" : s >= 50 ? "Caution" : s >= 30 ? "Concerning" : "Critical";
  return { score: s, status, alerts };
}

// ─── Individual metric card ───────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  sublabel: string;
  value: string;
  unit?: string;
  trend: "up" | "down" | "stable";
  trendLabel: string;
  positiveDirection?: "up" | "down";
  icon: React.ElementType;
  iconColor: string;
  sparkData: { value: number }[];
}

function MetricCard({ label, sublabel, value, unit, trend, trendLabel, positiveDirection = "up", icon: Icon, iconColor, sparkData }: MetricCardProps) {
  const color = trendColor(trend, positiveDirection);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Activity;
  return (
    <Card className="foresee-card bg-black/40 backdrop-blur-md glow-border fade-in-stagger">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-semibold text-white leading-tight">{label}</h3>
            <p className="text-[10px] text-white/40 mt-0.5">{sublabel}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center`}
               style={{ backgroundColor: `${iconColor}18` }}>
            <Icon className="w-5 h-5" style={{ color: iconColor }} />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold gradient-gold pulse-metric leading-none">
              {value}{unit}
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendIcon className="w-3 h-3" style={{ color }} />
              <span className="text-xs" style={{ color }}>{trendLabel}</span>
            </div>
          </div>
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkData}>
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function EconomicDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Load visible card prefs from localStorage
  const [visible, setVisible] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_VISIBLE;
    } catch { return DEFAULT_VISIBLE; }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(visible));
  }, [visible]);

  const toggle = (id: string) => {
    setVisible(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const { data: economicData, isLoading } = useQuery({
    queryKey: ["/api/economic-data"],
    queryFn: fetchEconomicData,
    refetchInterval: 5 * 60 * 1000,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await refreshFredData();
      queryClient.setQueryData(["/api/economic-data"], updated);
      toast({ title: "Live data updated", description: `Refreshed at ${updated.lastUpdated.toLocaleTimeString()}.` });
    } catch (e) {
      toast({ title: "Refresh unavailable", description: "Showing latest stored data.", variant: "destructive" });
    } finally { setIsRefreshing(false); }
  };

  if (isLoading) {
    return (
      <div className="mb-8 mt-12">
        <div className="flex items-center justify-between mb-6 mt-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  if (!economicData) return null;

  const d = economicData;
  const health = healthSummary(d);
  const mortgage30yr = +(d.interestRate + 1.72).toFixed(2);

  // Build per-card render config
  type RenderCard = MetricCardProps & { id: string };
  const cardMap: Record<string, RenderCard> = {
    inflation: {
      id: "inflation", label: "Inflation Rate", sublabel: "CPI Year-over-Year",
      value: d.inflationRate.toFixed(1), unit: "%",
      trend: d.inflationRate > 3.5 ? "up" : d.inflationRate < 2.5 ? "down" : "stable",
      trendLabel: d.inflationRate > 3 ? "Elevated" : "Moderate",
      positiveDirection: "down",
      icon: TrendingUp, iconColor: "#f59e0b",
      sparkData: sparkline(d.inflationRate, d.inflationRate > 3 ? "up" : "stable"),
    },
    gdp: {
      id: "gdp", label: "GDP Growth", sublabel: "Real Quarterly Rate",
      value: d.gdpGrowth.toFixed(1), unit: "%",
      trend: d.gdpGrowth > 2.5 ? "up" : d.gdpGrowth < 1 ? "down" : "stable",
      trendLabel: `${d.gdpGrowth > 2 ? "Expanding" : d.gdpGrowth < 1 ? "Slowing" : "Modest"} growth`,
      positiveDirection: "up",
      icon: BarChart3, iconColor: "#10b981",
      sparkData: sparkline(d.gdpGrowth, d.gdpGrowth > 2 ? "up" : "stable"),
    },
    cpi: {
      id: "cpi", label: "Consumer Price Index", sublabel: "BLS All Urban Consumers",
      value: d.consumerPriceIndex.toFixed(1), unit: "",
      trend: d.consumerPriceIndex > 320 ? "up" : "stable",
      trendLabel: `${d.consumerPriceIndex > 310 ? "Elevated" : "Rising"} price level`,
      positiveDirection: "down",
      icon: DollarSign, iconColor: "#f59e0b",
      sparkData: sparkline(d.consumerPriceIndex, "up"),
    },
    unemployment: {
      id: "unemployment", label: "Unemployment Rate", sublabel: "BLS U-3 — Seasonally Adjusted",
      value: d.unemploymentRate.toFixed(1), unit: "%",
      trend: d.unemploymentRate < 4 ? "up" : d.unemploymentRate > 5 ? "down" : "stable",
      trendLabel: d.unemploymentRate < 4 ? "Near full employment" : d.unemploymentRate > 5 ? "Rising joblessness" : "Historically normal",
      positiveDirection: "up",
      icon: Briefcase, iconColor: "#8b5cf6",
      sparkData: sparkline(d.unemploymentRate, "stable"),
    },
    fedRate: {
      id: "fedRate", label: "Fed Funds Rate", sublabel: "Federal Reserve Target",
      value: d.interestRate.toFixed(2), unit: "%",
      trend: d.interestRate > 4.5 ? "down" : d.interestRate < 2 ? "up" : "stable",
      trendLabel: `Borrowing costs ${d.interestRate > 4 ? "restrictive" : "neutral"}`,
      positiveDirection: "down",
      icon: Percent, iconColor: "#ec4899",
      sparkData: sparkline(d.interestRate, "stable"),
    },
    mortgage: {
      id: "mortgage", label: "30-Yr Fixed Mortgage", sublabel: "Derived from Fed Rate + Spread",
      value: mortgage30yr.toFixed(2), unit: "%",
      trend: mortgage30yr > 7 ? "down" : mortgage30yr < 5 ? "up" : "stable",
      trendLabel: `${mortgage30yr > 7 ? "Affordability pressure" : mortgage30yr < 6 ? "Buyer-friendly" : "Elevated cost"}`,
      positiveDirection: "down",
      icon: Home, iconColor: "#06b6d4",
      sparkData: sparkline(mortgage30yr, "stable"),
    },
    oil: {
      id: "oil", label: "WTI Crude Oil", sublabel: "Live Yahoo Finance Quote",
      value: `$${d.oilPrices.toFixed(2)}`, unit: "",
      trend: d.oilPrices > 90 ? "up" : d.oilPrices < 65 ? "down" : "stable",
      trendLabel: `${d.oilPrices > 80 ? "Elevated — gas prices rising" : "Moderate oil pricing"}`,
      positiveDirection: "down",
      icon: Droplets, iconColor: "#60a5fa",
      sparkData: sparkline(d.oilPrices, "stable"),
    },
    dollar: {
      id: "dollar", label: "Dollar Index (DXY)", sublabel: "USD vs. Major Currencies",
      value: d.dollarStrength.toFixed(2), unit: "",
      trend: d.dollarStrength > 104 ? "up" : d.dollarStrength < 96 ? "down" : "stable",
      trendLabel: `USD ${d.dollarStrength > 100 ? "strong" : "weakening"}`,
      positiveDirection: "up",
      icon: DollarSign, iconColor: "#34d399",
      sparkData: sparkline(d.dollarStrength, "stable"),
    },
  };

  const visibleCards = ALL_CARDS.filter(c => visible.includes(c.id));

  return (
    <div className="mb-8 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-8">
        <div>
          <h2 className="headline-sm text-white">Economic Intelligence</h2>
          <p className="body-text text-white/70 mt-1">
            Live public data — Federal Reserve · BLS · Yahoo Finance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCustomizeOpen(o => !o)}
            size="sm"
            variant="ghost"
            className="text-white/60 hover:text-white border border-white/10 hover:border-white/30 gap-1.5"
            data-testid="button-customize-indicators"
          >
            <Settings className="w-3.5 h-3.5" />
            Customize
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            className="btn-coral"
            data-testid="button-refresh-economic"
          >
            {isRefreshing ? "Updating…" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Customize panel */}
      {customizeOpen && (
        <Card className="foresee-card bg-black/60 backdrop-blur-md border border-white/10 mb-5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Choose which indicators to display</p>
              <button onClick={() => setCustomizeOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            {(["macro", "housing", "market"] as const).map(cat => (
              <div key={cat} className="mb-3">
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">
                  {CATEGORY_LABELS[cat]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {ALL_CARDS.filter(c => c.category === cat).map(c => {
                    const on = visible.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggle(c.id)}
                        data-testid={`toggle-indicator-${c.id}`}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                          on
                            ? "bg-[#e8734a]/20 border-[#e8734a]/50 text-[#e8734a]"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
                        }`}
                      >
                        {on ? "✓ " : ""}{c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-white/30 mt-2">Your preferences are saved automatically.</p>
          </CardContent>
        </Card>
      )}

      {/* Financial Health Summary */}
      <Card className="foresee-card bg-black/40 backdrop-blur-md glow-border mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold gradient-coral-gold pulse-metric">
                {health.score}/100
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Financial Climate: <span className={
                    health.status === "Good" ? "text-emerald-400" :
                    health.status === "Caution" ? "text-amber-400" :
                    health.status === "Concerning" ? "text-orange-400" : "text-red-400"
                  }>{health.status}</span>
                </h3>
                <p className="text-xs text-white/50">Composite economic environment score</p>
              </div>
            </div>
            {health.alerts.length > 0 && (
              <div className="text-right hidden sm:block">
                <AlertTriangle className="w-5 h-5 text-amber-500 mb-1 ml-auto" />
                <span className="text-xs text-white/60">{health.alerts.length} alerts</span>
              </div>
            )}
          </div>
          {health.alerts.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {health.alerts.slice(0, 2).map((a, i) => (
                <p key={i} className="text-xs text-amber-400/80 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-amber-500 rounded-full shrink-0" />
                  {a}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Indicator grid */}
      {visibleCards.length === 0 ? (
        <Card className="foresee-card bg-black/30 border border-white/10">
          <CardContent className="p-8 text-center">
            <p className="text-white/50 text-sm">No indicators selected.</p>
            <button
              onClick={() => setCustomizeOpen(true)}
              className="mt-2 text-[#e8734a] text-xs underline"
            >
              Open Customize to add some
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {visibleCards.map(c => (
            <MetricCard key={c.id} {...cardMap[c.id]} />
          ))}
        </div>
      )}

      {/* Data Transparency */}
      <Card className="glass-card mt-4" style={{ boxShadow: "none", filter: "drop-shadow(0 4px 8px rgba(255,140,66,0.08))" }}>
        <CardContent className="p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="font-semibold text-slate-400 mb-1.5">Data Sources & Transparency</div>
            <div>· Inflation (CPI) &amp; Unemployment — U.S. Bureau of Labor Statistics (BLS) public API</div>
            <div>· WTI Crude Oil &amp; Dollar Index (DXY) — Yahoo Finance live market data</div>
            <div>· Federal Funds Rate — Federal Reserve published target range</div>
            <div>· 30-Yr Mortgage Rate — Derived from Fed rate + historical 30-yr spread (~1.72 pp)</div>
            <div>· GDP Growth — Latest published BEA quarterly estimate</div>
            <div>· Last refreshed: {d.lastUpdated.toLocaleString()}</div>
            <div>· Price forecasts are algorithmic estimates for planning purposes only</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
