import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Settings, Car, ShoppingCart, Home, Sun, Briefcase, Search, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationPreferences {
  city: string;
  state: string;
  zipCode: string;
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
  alertRadius: number; // miles
  alertTiming: {
    urgentDays: number; // 1-3 days
    mediumDays: number; // 4-7 days  
    longTermDays: number; // 8-30 days
  };
}

const GROCERY_STORES = [
  'H-E-B', 'Whole Foods', 'Central Market', 'Randalls', 'Walmart', 'Target', 
  'Costco', 'Sam\'s Club', 'Trader Joe\'s', 'Kroger'
];

const GAS_STATIONS = [
  'Shell', 'Exxon', 'Chevron', 'BP', 'Valero', 'Texaco', 'Conoco', 
  'QuikTrip', 'RaceTrac', 'Wawa', 'Buc-ee\'s'
];

const US_STATES = [
  'TX', 'CA', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI'
];

export function LocationSettings() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [preferences, setPreferences] = useState<LocationPreferences>({
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    alertTypes: {
      gas: true,
      grocery: true,
      housing: false,
      weather: true,
      economic: true
    },
    storePreferences: {
      groceryStores: ['H-E-B', 'Central Market'],
      gasStations: ['Shell', 'Exxon']
    },
    alertRadius: 15,
    alertTiming: {
      urgentDays: 3,
      mediumDays: 7,
      longTermDays: 30
    }
  });

  const handleLocationDetect = async () => {
    setIsDetecting(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // In a real app, you'd reverse geocode these coordinates
            const { latitude, longitude } = position.coords;
            
            // Simulate reverse geocoding for demonstration
            setPreferences(prev => ({
              ...prev,
              city: 'Austin',
              state: 'TX',
              zipCode: '78701'
            }));
            
            toast({
              title: "Location Detected",
              description: "Your location has been set to Austin, TX",
            });
          },
          () => {
            toast({
              title: "Location Detection Failed",
              description: "Please enter your location manually",
              variant: "destructive"
            });
          }
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to detect location",
        variant: "destructive"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleAlertTypeToggle = (type: keyof LocationPreferences['alertTypes']) => {
    setPreferences(prev => ({
      ...prev,
      alertTypes: {
        ...prev.alertTypes,
        [type]: !prev.alertTypes[type]
      }
    }));
  };

  const handleStoreToggle = (store: string, type: 'groceryStores' | 'gasStations') => {
    setPreferences(prev => ({
      ...prev,
      storePreferences: {
        ...prev.storePreferences,
        [type]: prev.storePreferences[type].includes(store)
          ? prev.storePreferences[type].filter(s => s !== store)
          : [...prev.storePreferences[type], store]
      }
    }));
  };

  const handleSave = () => {
    // In a real app, save to backend
    localStorage.setItem('locationPreferences', JSON.stringify(preferences));
    
    toast({
      title: "Location Settings Saved",
      description: `Monitoring ${preferences.city}, ${preferences.state} for ${Object.entries(preferences.alertTypes).filter(([_, enabled]) => enabled).length} alert types`,
    });
    
    setIsDialogOpen(false);
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'gas': return <Car className="w-4 h-4" />;
      case 'grocery': return <ShoppingCart className="w-4 h-4" />;
      case 'housing': return <Home className="w-4 h-4" />;
      case 'weather': return <Sun className="w-4 h-4" />;
      case 'economic': return <Briefcase className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const activeAlertsCount = Object.values(preferences.alertTypes).filter(Boolean).length;

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location Settings</h3>
              <p className="text-white">Customize your location-based alerts</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location & Alert Settings</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {/* Location Settings */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Your Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={preferences.city}
                        onChange={(e) => setPreferences(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Austin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={preferences.state} onValueChange={(value) => setPreferences(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        value={preferences.zipCode}
                        onChange={(e) => setPreferences(prev => ({ ...prev, zipCode: e.target.value }))}
                        placeholder="78701"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLocationDetect}
                    disabled={isDetecting}
                    className="w-full md:w-auto"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isDetecting ? 'Detecting...' : 'Auto-Detect Location'}
                  </Button>
                </div>

                {/* Alert Types */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Alert Types</h4>
                  <div className="space-y-3">
                    {Object.entries(preferences.alertTypes).map(([type, enabled]) => (
                      <div key={type} className="flex items-center justify-between p-3 glass-card">
                        <div className="flex items-center space-x-3">
                          {getAlertTypeIcon(type)}
                          <div>
                            <div className="font-medium text-white capitalize">{type}</div>
                            <div className="text-sm text-white">
                              {type === 'gas' && 'Price changes at local gas stations'}
                              {type === 'grocery' && 'Sales and price changes at grocery stores'}
                              {type === 'housing' && 'Rental market trends and mortgage rates'}
                              {type === 'weather' && 'Weather impacts on utility costs'}
                              {type === 'economic' && 'Local economic trends and job market'}
                            </div>
                          </div>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => handleAlertTypeToggle(type as keyof LocationPreferences['alertTypes'])}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Store Preferences */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Store Preferences</h4>
                  
                  {preferences.alertTypes.grocery && (
                    <div>
                      <Label className="mb-2 block">Grocery Stores</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {GROCERY_STORES.map((store) => (
                          <Button
                            key={store}
                            variant={preferences.storePreferences.groceryStores.includes(store) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleStoreToggle(store, 'groceryStores')}
                            className="justify-start"
                          >
                            {preferences.storePreferences.groceryStores.includes(store) && (
                              <Check className="w-3 h-3 mr-1" />
                            )}
                            {store}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {preferences.alertTypes.gas && (
                    <div>
                      <Label className="mb-2 block">Gas Stations</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {GAS_STATIONS.map((station) => (
                          <Button
                            key={station}
                            variant={preferences.storePreferences.gasStations.includes(station) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleStoreToggle(station, 'gasStations')}
                            className="justify-start"
                          >
                            {preferences.storePreferences.gasStations.includes(station) && (
                              <Check className="w-3 h-3 mr-1" />
                            )}
                            {station}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Alert Timing */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Alert Timing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="urgentDays">Urgent Alerts (Days)</Label>
                      <Input
                        id="urgentDays"
                        type="number"
                        min="1"
                        max="3"
                        value={preferences.alertTiming.urgentDays}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          alertTiming: { ...prev.alertTiming, urgentDays: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mediumDays">Medium Priority (Days)</Label>
                      <Input
                        id="mediumDays"
                        type="number"
                        min="4"
                        max="7"
                        value={preferences.alertTiming.mediumDays}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          alertTiming: { ...prev.alertTiming, mediumDays: Number(e.target.value) }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="longTermDays">Long Term (Days)</Label>
                      <Input
                        id="longTermDays"
                        type="number"
                        min="8"
                        max="30"
                        value={preferences.alertTiming.longTermDays}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          alertTiming: { ...prev.alertTiming, longTermDays: Number(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Location */}
        <div className="glass-card p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <div>
              <h4 className="font-semibold text-white">{preferences.city}, {preferences.state}</h4>
              <p className="text-xs text-white">{preferences.zipCode} • Within {preferences.alertRadius} miles</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{activeAlertsCount}</div>
              <div className="text-xs text-white">Active Alert Types</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-400">
                {preferences.storePreferences.groceryStores.length + preferences.storePreferences.gasStations.length}
              </div>
              <div className="text-xs text-white">Monitored Stores</div>
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white">Quick Settings</h4>
          <div className="space-y-2">
            {Object.entries(preferences.alertTypes).map(([type, enabled]) => (
              <div key={type} className="flex items-center justify-between p-2 glass-card bg-white/5">
                <div className="flex items-center space-x-2">
                  {getAlertTypeIcon(type)}
                  <span className="text-sm text-white capitalize">{type} Alerts</span>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleAlertTypeToggle(type as keyof LocationPreferences['alertTypes'])}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}