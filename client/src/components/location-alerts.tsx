import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Clock, TrendingUp, TrendingDown, AlertTriangle, Car, Home, ShoppingCart, Sun, Briefcase } from 'lucide-react';
import { useLocationAlerts } from './geo-location-service';

export function LocationAlerts() {
  const { location, locationAlerts, isLoading, refreshAlerts } = useLocationAlerts();

  if (isLoading) {
    return (
      <Card className="glass-card border-none">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500/30 border-t-orange-500 rounded-full mx-auto mb-4"></div>
            <p className="text-white">Detecting your location...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-amber-500 bg-amber-500/20 border-amber-500/30';
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'gas': return <Car className="w-4 h-4" />;
      case 'grocery': return <ShoppingCart className="w-4 h-4" />;
      case 'housing': return <Home className="w-4 h-4" />;
      case 'weather': return <Sun className="w-4 h-4" />;
      case 'economic': return <Briefcase className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="glass-card border-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center glow-pulse icon-container cursor-pointer">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location Alerts</h3>
              {location ? (
                <div className="flex items-center space-x-2">
                  <p className="text-white">Local insights for {location.city}, {location.state}</p>
                </div>
              ) : (
                <p className="text-white">Location-based financial insights</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30">
              {locationAlerts.length} alerts
            </Badge>
            <Button size="sm" variant="outline" onClick={refreshAlerts}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {locationAlerts.length === 0 ? (
          <div className="glass-card p-4 text-center">
            <MapPin className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white">No location alerts at the moment</p>
            <p className="text-white text-sm">We'll notify you of local price changes and trends</p>
          </div>
        ) : (
          <div className="space-y-3">
            {locationAlerts.map((alert) => (
              <div key={alert.id} className="glass-card p-4 bg-white/10 hover:bg-white/15 transition-all">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500/30 to-red-600/30 rounded-lg flex items-center justify-center">
                      {getTypeIcon(alert.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white truncate">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-white">
                          <Clock className="w-3 h-3" />
                          <span>{alert.daysOut}d</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-white text-sm mb-2">{alert.message}</p>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-white">Prediction:</span>
                        <span className="text-xs font-medium text-orange-400">{alert.prediction}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-white">Confidence:</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                              style={{ width: `${alert.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-white">{alert.confidence}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {alert.actionSuggestion && (
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-3 mt-3">
                        <div className="flex items-start space-x-2">
                          <TrendingUp className="w-4 h-4 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-xs text-white font-medium mb-1">Recommendation:</p>
                            <p className="text-xs text-white">{alert.actionSuggestion}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Location Summary */}
        {location && (
          <div className="glass-card p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 mt-4">
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-orange-400" />
              <div>
                <h4 className="font-semibold text-white">{location.city}, {location.state}</h4>
                <p className="text-xs text-white">Monitoring local economic trends</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">
                  {locationAlerts.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-xs text-white">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-400">
                  {locationAlerts.filter(a => a.daysOut <= 3).length}
                </div>
                <div className="text-xs text-white">Next 3 Days</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}