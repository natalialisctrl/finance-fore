import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Settings, Car, ShoppingCart, Home, Sun, Briefcase, Crosshair, Check, TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronRight, Zap, RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PermissionMode = 'always' | 'while_using' | 'never';

interface LocationPreferences {
  city: string;
  state: string;
  stateCode: string;
  zipCode: string;
  lat: number;
  lng: number;
  permissionMode: PermissionMode;
  alertTypes: {
    gas: boolean;
    grocery: boolean;
    housing: boolean;
    weather: boolean;
    economic: boolean;
  };
  storePreferences: {
    groceryStores: string[];
    gasStations: string[];
  };
  alertRadius: number;
}

interface HousingPrediction {
  medianPrice: number;
  medianPriceLabel: string;
  yoyChange: number;
  daysOnMarket: number;
  inventoryMonths: number;
  affordabilityIndex: 'low' | 'medium' | 'high';
  forecast90Day: number;
  forecastDirection: 'UP' | 'DOWN' | 'STABLE';
  neighborhoodsToWatch: string[];
  riskFactors: string[];
  recommendation: 'BUY_NOW' | 'WAIT' | 'RENT' | 'MONITOR';
  recommendationReason: string;
  confidence: number;
  marketTemp: 'hot' | 'warm' | 'cool' | 'cold';
}

const GROCERY_STORES = [
  { id: 'walmart', name: 'Walmart', tracks: 'Weekly rollback prices, Great Value brand deals' },
  { id: 'kroger', name: 'Kroger', tracks: 'Digital coupons, Fuel Points, Kroger brand sales' },
  { id: 'heb', name: 'H-E-B', tracks: 'Meal Deals, Texas-local produce pricing' },
  { id: 'target', name: 'Target', tracks: 'Circle offers, Good & Gather brand discounts' },
  { id: 'costco', name: 'Costco', tracks: 'Bulk price per unit, Kirkland Signature deals' },
  { id: 'traderjoes', name: "Trader Joe's", tracks: 'Seasonal items, frozen meal prices' },
  { id: 'wholefoodsmarket', name: 'Whole Foods', tracks: 'Prime member deals, 365 brand discounts' },
  { id: 'aldi', name: 'ALDI', tracks: 'ALDI Finds, lowest-cost essentials basket' },
  { id: 'publix', name: 'Publix', tracks: 'BOGO weekly specials, deli deals' },
  { id: 'samsclub', name: "Sam's Club", tracks: 'Member savings, bulk protein & dairy pricing' },
];

const GAS_STATIONS = [
  { id: 'shell', name: 'Shell', tracks: 'Regular/Premium daily price, Shell Fuel Rewards' },
  { id: 'chevron', name: 'Chevron', tracks: 'Regular price + Techron premium grade' },
  { id: 'exxon', name: 'Exxon', tracks: 'Regular/Diesel, Synergy Supreme+ pricing' },
  { id: 'bp', name: 'BP', tracks: 'Regular price + BPme Rewards discount' },
  { id: 'valero', name: 'Valero', tracks: 'Regular/Diesel lowest-cost index tracking' },
  { id: 'quiktrip', name: 'QuikTrip', tracks: 'Regular price, loyalty discount points' },
  { id: 'racetrack', name: 'RaceTrac', tracks: 'Regular price, often cheapest in region' },
  { id: 'costcogas', name: 'Costco Gas', tracks: 'Members-only price (avg $0.20 below market)' },
  { id: 'buccees', name: "Buc-ee's", tracks: 'Large-volume pricing, often lowest around I-roads' },
  { id: 'wawa', name: 'Wawa', tracks: 'Regular price, Wawa Rewards card discount' },
];

const DEFAULT_PREFS: LocationPreferences = {
  city: '', state: '', stateCode: '', zipCode: '',
  lat: 0, lng: 0,
  permissionMode: 'while_using',
  alertTypes: { gas: true, grocery: true, housing: true, weather: true, economic: true },
  storePreferences: { groceryStores: ['walmart', 'kroger'], gasStations: ['shell', 'costcogas'] },
  alertRadius: 10,
};

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function LocationSettings() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isResolvingZip, setIsResolvingZip] = useState(false);
  const [prefs, setPrefs] = useState<LocationPreferences>(DEFAULT_PREFS);
  const [driftAlert, setDriftAlert] = useState<{ miles: number; detectedCity: string } | null>(null);
  const [housingPred, setHousingPred] = useState<HousingPrediction | null>(null);
  const [isLoadingHousing, setIsLoadingHousing] = useState(false);

  // Load saved prefs + run drift check on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('foresee_location_prefs');
      if (saved) {
        const p = JSON.parse(saved) as LocationPreferences;
        setPrefs(p);
        // Drift check: compare stored lat/lng to current IP-based location
        if (p.permissionMode !== 'never' && p.lat && p.lng) {
          fetch('/api/geolocate')
            .then(r => r.json())
            .then((geo: any) => {
              if (geo.lat && geo.lng) {
                const miles = haversineMiles(p.lat, p.lng, geo.lat, geo.lng);
                if (miles > 10) {
                  setDriftAlert({ miles: Math.round(miles), detectedCity: geo.city || 'a new location' });
                }
              }
            })
            .catch(() => {/* ignore */});
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Load housing prediction when dialog opens and housing is enabled
  useEffect(() => {
    if (isDialogOpen && prefs.alertTypes.housing && prefs.city && !housingPred) {
      fetchHousingPrediction(prefs.city, prefs.state);
    }
  }, [isDialogOpen, prefs.alertTypes.housing, prefs.city]);

  const fetchHousingPrediction = async (city: string, state: string) => {
    if (!city) return;
    setIsLoadingHousing(true);
    try {
      const r = await fetch('/api/housing-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, state }),
      });
      if (r.ok) setHousingPred(await r.json());
    } catch { /* ignore */ }
    finally { setIsLoadingHousing(false); }
  };

  // Auto detect: uses server-side IP geo (no browser permission needed)
  const handleAutoDetect = async () => {
    setIsDetecting(true);
    try {
      const r = await fetch('/api/geolocate');
      const geo = await r.json();
      if (!geo.city) throw new Error(geo.error || 'No city detected');
      const updated = {
        ...prefs,
        city: geo.city,
        state: geo.state || '',
        stateCode: geo.stateCode || '',
        zipCode: geo.postalCode || '',
        lat: geo.lat || 0,
        lng: geo.lng || 0,
      };
      setPrefs(updated);
      setDriftAlert(null);
      setHousingPred(null);
      toast({ title: 'Location detected', description: `Set to ${geo.city}${geo.state ? `, ${geo.state}` : ''}` });
    } catch (e: any) {
      toast({ title: 'Detection failed', description: e.message || 'Could not auto-detect location', variant: 'destructive' });
    } finally {
      setIsDetecting(false);
    }
  };

  // Zip code lookup
  const handleZipLookup = async (zip: string) => {
    const digits = zip.replace(/\D/g, '');
    if (digits.length !== 5) return;
    setIsResolvingZip(true);
    try {
      const r = await fetch(`/api/geocode-zip?zip=${digits}`);
      if (!r.ok) throw new Error('Zip not found');
      const geo = await r.json();
      setPrefs(prev => ({
        ...prev,
        zipCode: digits,
        city: geo.city,
        state: geo.state,
        stateCode: geo.stateCode,
        lat: geo.lat,
        lng: geo.lng,
      }));
      setHousingPred(null);
      toast({ title: 'Zip resolved', description: `${geo.city}, ${geo.stateCode}` });
    } catch {
      toast({ title: 'Invalid zip', description: 'That zip code was not found', variant: 'destructive' });
    } finally {
      setIsResolvingZip(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('foresee_location_prefs', JSON.stringify(prefs));
    // Also update the main location cache so alerts refresh
    if (prefs.city) {
      localStorage.setItem('foresee_location', JSON.stringify({
        city: prefs.city, state: prefs.state, stateCode: prefs.stateCode,
        country: 'United States', lat: prefs.lat, lng: prefs.lng,
        timezone: 'America/New_York', postalCode: prefs.zipCode,
      }));
    }
    const storeCount = prefs.storePreferences.groceryStores.length + prefs.storePreferences.gasStations.length;
    toast({
      title: 'Settings saved',
      description: `Monitoring ${prefs.city || 'your area'} — ${storeCount} stores tracked`,
    });
    setIsDialogOpen(false);
  };

  const toggleStore = (id: string, type: 'groceryStores' | 'gasStations') => {
    setPrefs(prev => ({
      ...prev,
      storePreferences: {
        ...prev.storePreferences,
        [type]: prev.storePreferences[type].includes(id)
          ? prev.storePreferences[type].filter(s => s !== id)
          : [...prev.storePreferences[type], id],
      },
    }));
  };

  const totalStores = prefs.storePreferences.groceryStores.length + prefs.storePreferences.gasStations.length;
  const activeAlertCount = Object.values(prefs.alertTypes).filter(Boolean).length;
  const locationLabel = prefs.city ? `${prefs.city}${prefs.stateCode ? `, ${prefs.stateCode}` : ''}` : 'Not set';

  const recColor = (r: string) => {
    if (r === 'BUY_NOW') return 'text-green-400';
    if (r === 'WAIT') return 'text-amber-400';
    if (r === 'RENT') return 'text-blue-400';
    return 'text-orange-400';
  };
  const recLabel = (r: string) => ({ BUY_NOW: 'Buy Now', WAIT: 'Wait to Buy', RENT: 'Renting Better', MONITOR: 'Monitor Market' }[r] ?? r);

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Location Settings</h3>
              <p className="text-white/55 text-xs mt-0.5">
                {locationLabel} · {activeAlertCount} alert types · {totalStores} stores
              </p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 text-xs">
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0d1117] border border-white/15 text-white">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Location & Alert Intelligence
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-2">

                {/* ── Permission model ─────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Location Access</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { id: 'always', label: 'Always', desc: 'Track & drift-check every visit' },
                      { id: 'while_using', label: 'While Using', desc: 'Detect each session, no background' },
                      { id: 'never', label: 'Never', desc: 'Manual entry only' },
                    ] as { id: PermissionMode; label: string; desc: string }[]).map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setPrefs(p => ({ ...p, permissionMode: opt.id }))}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          prefs.permissionMode === opt.id
                            ? 'border-cyan-400 bg-cyan-500/15'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-semibold text-sm text-white mb-0.5">{opt.label}</div>
                        <div className="text-[10px] text-white/55 leading-tight">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Location entry ───────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Your Location</p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="col-span-1">
                      <Label className="text-white/70 text-xs mb-1 block">Zip Code</Label>
                      <Input
                        value={prefs.zipCode}
                        onChange={e => setPrefs(p => ({ ...p, zipCode: e.target.value }))}
                        onBlur={e => handleZipLookup(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleZipLookup(prefs.zipCode)}
                        placeholder="e.g. 78701"
                        maxLength={5}
                        className="h-9 bg-white/8 border-white/15 text-white placeholder:text-white/30 text-sm"
                        data-testid="input-zipcode"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-white/70 text-xs mb-1 block">City</Label>
                      <Input
                        value={prefs.city}
                        onChange={e => setPrefs(p => ({ ...p, city: e.target.value }))}
                        placeholder="Austin"
                        className="h-9 bg-white/8 border-white/15 text-white placeholder:text-white/30 text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <Label className="text-white/70 text-xs mb-1 block">State</Label>
                      <Input
                        value={prefs.stateCode}
                        onChange={e => setPrefs(p => ({ ...p, stateCode: e.target.value.toUpperCase().slice(0, 2) }))}
                        placeholder="TX"
                        maxLength={2}
                        className="h-9 bg-white/8 border-white/15 text-white placeholder:text-white/30 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleAutoDetect}
                      disabled={isDetecting}
                      className="border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-xs h-8 px-3"
                      data-testid="button-auto-detect-location"
                    >
                      {isDetecting
                        ? <><RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />Detecting…</>
                        : <><Crosshair className="w-3 h-3 mr-1.5" />Auto-Detect via IP</>
                      }
                    </Button>
                    {isResolvingZip && (
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />Resolving zip…
                      </span>
                    )}
                    {prefs.city && (
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />{prefs.city}, {prefs.stateCode}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40 mt-2">
                    Auto-Detect uses your network IP — no browser permission required. Zip code entry instantly resolves your city and state.
                  </p>
                </div>

                {/* ── Alert types ──────────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Alert Types</p>
                  <div className="space-y-2">
                    {(Object.entries(prefs.alertTypes) as [keyof typeof prefs.alertTypes, boolean][]).map(([type, enabled]) => {
                      const meta: Record<string, { icon: any; label: string; desc: string }> = {
                        gas: { icon: Car, label: 'Gas Prices', desc: 'Price changes at your selected stations — with state tax breakdowns' },
                        grocery: { icon: ShoppingCart, label: 'Grocery Deals', desc: 'Weekly ad prices, digital coupons, and loss leaders at your stores' },
                        housing: { icon: Home, label: 'Housing Market', desc: 'AI-powered market prediction: price trends, days-on-market, buy/rent signals' },
                        weather: { icon: Sun, label: 'Weather Impact', desc: 'Heating/cooling cost alerts and seasonal utility spikes' },
                        economic: { icon: Briefcase, label: 'Economic Trends', desc: 'Local CPI, employment, and spending-power alerts' },
                      };
                      const m = meta[type];
                      const Icon = m.icon;
                      return (
                        <div key={type} className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                          enabled ? 'border-cyan-500/30 bg-cyan-500/8' : 'border-white/8 bg-white/4'
                        }`}>
                          <div className="flex items-start gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              enabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/8 text-white/40'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{m.label}</div>
                              <div className="text-[11px] text-white/50 leading-tight mt-0.5">{m.desc}</div>
                            </div>
                          </div>
                          <Switch
                            checked={enabled}
                            onCheckedChange={() => setPrefs(p => ({
                              ...p, alertTypes: { ...p.alertTypes, [type]: !enabled }
                            }))}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Housing prediction panel ─────────────── */}
                {prefs.alertTypes.housing && prefs.city && (
                  <div className="rounded-xl border border-blue-500/25 bg-gradient-to-br from-blue-500/10 to-indigo-500/8 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white">AI Housing Market Prediction</span>
                        <Badge className="text-[10px] bg-violet-500/20 text-violet-300 border-violet-500/30">Claude</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setHousingPred(null); fetchHousingPrediction(prefs.city, prefs.stateCode || prefs.state); }}
                        className="h-6 w-6 p-0 text-white/40 hover:text-white"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                    {isLoadingHousing ? (
                      <div className="flex items-center gap-2 py-4">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-white/60">Analyzing {prefs.city} market…</span>
                      </div>
                    ) : housingPred ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-lg bg-white/5 p-2.5 text-center">
                            <div className="text-base font-bold text-white">{housingPred.medianPriceLabel}</div>
                            <div className="text-[10px] text-white/50">Median Price</div>
                          </div>
                          <div className="rounded-lg bg-white/5 p-2.5 text-center">
                            <div className={`text-base font-bold ${housingPred.yoyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {housingPred.yoyChange >= 0 ? '+' : ''}{housingPred.yoyChange}%
                            </div>
                            <div className="text-[10px] text-white/50">YoY Change</div>
                          </div>
                          <div className="rounded-lg bg-white/5 p-2.5 text-center">
                            <div className="text-base font-bold text-white">{housingPred.daysOnMarket}d</div>
                            <div className="text-[10px] text-white/50">Days on Market</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg bg-white/5 p-2.5">
                            <div className="text-[10px] text-white/50 mb-0.5">90-Day Forecast</div>
                            <div className="flex items-center gap-1.5">
                              {housingPred.forecastDirection === 'UP' ? <TrendingUp className="w-3.5 h-3.5 text-green-400" /> :
                               housingPred.forecastDirection === 'DOWN' ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> :
                               <Minus className="w-3.5 h-3.5 text-white/50" />}
                              <span className={`text-sm font-semibold ${
                                housingPred.forecastDirection === 'UP' ? 'text-green-400' :
                                housingPred.forecastDirection === 'DOWN' ? 'text-red-400' : 'text-white/70'
                              }`}>
                                {housingPred.forecast90Day >= 0 ? '+' : ''}{housingPred.forecast90Day}%
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg bg-white/5 p-2.5">
                            <div className="text-[10px] text-white/50 mb-0.5">AI Recommendation</div>
                            <div className={`text-sm font-bold ${recColor(housingPred.recommendation)}`}>
                              {recLabel(housingPred.recommendation)}
                            </div>
                          </div>
                        </div>
                        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                          <p className="text-xs text-white/80 leading-relaxed">{housingPred.recommendationReason}</p>
                        </div>
                        {housingPred.neighborhoodsToWatch?.length > 0 && (
                          <div>
                            <p className="text-[10px] text-white/50 mb-1.5 uppercase tracking-wider">Neighborhoods to watch</p>
                            <div className="flex flex-wrap gap-1.5">
                              {housingPred.neighborhoodsToWatch.map((n, i) => (
                                <Badge key={i} className="text-[10px] bg-indigo-500/20 text-indigo-300 border-indigo-500/30">{n}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {housingPred.riskFactors?.length > 0 && (
                          <div>
                            <p className="text-[10px] text-white/50 mb-1.5 uppercase tracking-wider">Risk factors</p>
                            <div className="space-y-1">
                              {housingPred.riskFactors.map((r, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-white/65">
                                  <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                                  {r}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                              style={{ width: `${housingPred.confidence}%` }} />
                          </div>
                          <span className="text-[10px] text-white/40">{housingPred.confidence}% confidence</span>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => fetchHousingPrediction(prefs.city, prefs.stateCode || prefs.state)}
                        className="text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-0">
                        <Zap className="w-3 h-3 mr-1.5" />Generate {prefs.city} market analysis
                      </Button>
                    )}
                  </div>
                )}

                {/* ── Monitored stores ─────────────────────── */}
                <div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Monitored Stores
                    <span className="ml-2 normal-case text-white/30 font-normal">What exactly gets tracked at each</span>
                  </p>

                  {prefs.alertTypes.grocery && (
                    <div className="mb-4">
                      <p className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-green-400" />Grocery Stores
                      </p>
                      <div className="space-y-1.5">
                        {GROCERY_STORES.map(store => {
                          const active = prefs.storePreferences.groceryStores.includes(store.id);
                          return (
                            <button
                              key={store.id}
                              onClick={() => toggleStore(store.id, 'groceryStores')}
                              className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                                active ? 'border-green-500/40 bg-green-500/10' : 'border-white/8 bg-white/4 hover:bg-white/8'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                active ? 'bg-green-500 border-green-500' : 'border-white/25'
                              }`}>
                                {active && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-white">{store.name}</div>
                                <div className="text-[11px] text-white/50 leading-tight mt-0.5">{store.tracks}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {prefs.alertTypes.gas && (
                    <div>
                      <p className="text-xs text-white/60 mb-2 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-orange-400" />Gas Stations
                      </p>
                      <div className="space-y-1.5">
                        {GAS_STATIONS.map(station => {
                          const active = prefs.storePreferences.gasStations.includes(station.id);
                          return (
                            <button
                              key={station.id}
                              onClick={() => toggleStore(station.id, 'gasStations')}
                              className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                                active ? 'border-orange-500/40 bg-orange-500/10' : 'border-white/8 bg-white/4 hover:bg-white/8'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                active ? 'bg-orange-500 border-orange-500' : 'border-white/25'
                              }`}>
                                {active && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-white">{station.name}</div>
                                <div className="text-[11px] text-white/50 leading-tight mt-0.5">{station.tracks}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Save ─────────────────────────────────── */}
                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-sm border-white/15">Cancel</Button>
                  <Button onClick={handleSave} className="text-sm bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">

        {/* Drift alert banner */}
        {driftAlert && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">You've moved ~{driftAlert.miles} miles</p>
              <p className="text-white/65 text-xs mt-0.5">We detected {driftAlert.detectedCity}. Want to update your monitoring location?</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleAutoDetect} disabled={isDetecting}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-black h-7 px-2.5">
                  Yes, update
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDriftAlert(null)}
                  className="text-xs text-white/50 h-7 px-2.5">
                  Keep current
                </Button>
              </div>
            </div>
            <button onClick={() => setDriftAlert(null)} className="text-white/30 hover:text-white flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Location summary */}
        <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-cyan-500/20 p-3">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">
                {prefs.city ? locationLabel : 'No location set'}
                {prefs.zipCode && <span className="text-white/50 font-normal ml-1.5">{prefs.zipCode}</span>}
              </p>
              <p className="text-white/50 text-[11px]">
                {prefs.alertRadius} mi radius · {
                  { always: 'Always tracking', while_using: 'Tracking while using', never: 'Manual mode' }[prefs.permissionMode]
                }
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-base font-bold text-cyan-400">{activeAlertCount}</div>
              <div className="text-[10px] text-white/50">Alert types</div>
            </div>
            <div>
              <div className="text-base font-bold text-green-400">{prefs.storePreferences.groceryStores.length}</div>
              <div className="text-[10px] text-white/50">Grocery stores</div>
            </div>
            <div>
              <div className="text-base font-bold text-orange-400">{prefs.storePreferences.gasStations.length}</div>
              <div className="text-[10px] text-white/50">Gas stations</div>
            </div>
          </div>
        </div>

        {/* Quick store list */}
        {totalStores > 0 && (
          <div className="rounded-xl border border-white/8 bg-white/4 p-3">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Currently monitored</p>
            <div className="space-y-1">
              {prefs.storePreferences.groceryStores.map(id => {
                const s = GROCERY_STORES.find(g => g.id === id);
                return s ? (
                  <div key={id} className="flex items-center gap-2 text-xs">
                    <ShoppingCart className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <span className="text-white font-medium">{s.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/20" />
                    <span className="text-white/45 truncate">{s.tracks}</span>
                  </div>
                ) : null;
              })}
              {prefs.storePreferences.gasStations.map(id => {
                const s = GAS_STATIONS.find(g => g.id === id);
                return s ? (
                  <div key={id} className="flex items-center gap-2 text-xs">
                    <Car className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    <span className="text-white font-medium">{s.name}</span>
                    <ChevronRight className="w-3 h-3 text-white/20" />
                    <span className="text-white/45 truncate">{s.tracks}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Quick alert toggles */}
        <div className="space-y-1.5">
          {(Object.entries(prefs.alertTypes) as [keyof typeof prefs.alertTypes, boolean][]).map(([type, enabled]) => {
            const icons: Record<string, any> = { gas: Car, grocery: ShoppingCart, housing: Home, weather: Sun, economic: Briefcase };
            const labels: Record<string, string> = { gas: 'Gas Prices', grocery: 'Grocery Deals', housing: 'Housing Market', weather: 'Weather Impact', economic: 'Economic Trends' };
            const Icon = icons[type];
            return (
              <div key={type} className="flex items-center justify-between p-2.5 rounded-lg bg-white/4">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${enabled ? 'text-cyan-400' : 'text-white/30'}`} />
                  <span className="text-sm text-white">{labels[type]}</span>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => setPrefs(p => ({ ...p, alertTypes: { ...p.alertTypes, [type]: !enabled } }))}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
