import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, AlertTriangle, Car, Home, ShoppingCart, Sun, Briefcase, Navigation } from 'lucide-react';
import { useLocationAlerts } from './geo-location-service';

export function LocationAlerts() {
  const { location, locationAlerts, isLoading, permissionDenied, refreshAlerts } = useLocationAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/15 border-red-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'low': return 'text-green-400 bg-green-500/15 border-green-500/30';
      default: return 'text-white/60 bg-white/10 border-white/20';
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Location Alerts</h3>
              <p className="text-white/55 text-xs leading-tight mt-0.5">
                {location && location.city !== 'Unknown Location'
                  ? `${location.city}, ${location.state}`
                  : 'Enable location for local insights'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {locationAlerts.length > 0 && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                {locationAlerts.length}
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={refreshAlerts} className="text-xs h-7 px-2">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">

        {/* Permission denied banner */}
        {permissionDenied && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <Navigation className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">Location access needed</p>
                <p className="text-white/65 text-xs mt-1 leading-relaxed">
                  To show real local prices and alerts, please enable location in your browser settings, then tap Retry below.
                </p>
                <Button
                  size="sm"
                  onClick={refreshAlerts}
                  className="mt-3 bg-amber-500 hover:bg-amber-600 text-black text-xs h-7 px-3 font-semibold"
                >
                  Retry location
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && !permissionDenied && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
            <div className="animate-spin w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full flex-shrink-0" />
            <p className="text-white/70 text-sm">Detecting your location…</p>
          </div>
        )}

        {/* Alert list */}
        {!isLoading && locationAlerts.length === 0 && (
          <div className="text-center py-6">
            <MapPin className="w-10 h-10 text-white/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm">No local alerts right now</p>
          </div>
        )}

        {locationAlerts.map((alert) => (
          <div key={alert.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500/25 to-red-600/25 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                {getTypeIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="font-semibold text-white text-sm leading-tight">{alert.title}</h4>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge className={`text-[10px] px-1.5 py-0 h-5 border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                    <span className="text-white/50 text-[10px] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />{alert.daysOut}d
                    </span>
                  </div>
                </div>

                {/* Message */}
                <p className="text-white/70 text-xs leading-relaxed mb-2">{alert.message}</p>

                {/* Prediction + confidence in a clean row */}
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="text-orange-400 text-xs font-medium">{alert.prediction}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-16 h-1.5 bg-white/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${alert.confidence}%` }}
                      />
                    </div>
                    <span className="text-white/50 text-[10px]">{alert.confidence}%</span>
                  </div>
                </div>

                {/* Recommendation */}
                {alert.actionSuggestion && (
                  <div className="flex items-start gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 p-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/80 text-xs leading-relaxed">{alert.actionSuggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Location summary */}
        {location && location.city !== 'Unknown Location' && (
          <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/8 to-red-500/8 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <span className="text-white font-medium text-sm">{location.city}, {location.state}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-base font-bold text-red-400">
                  {locationAlerts.filter(a => a.severity === 'high').length}
                </div>
                <div className="text-white/55 text-[11px]">High priority</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-amber-400">
                  {locationAlerts.filter(a => a.daysOut <= 3).length}
                </div>
                <div className="text-white/55 text-[11px]">Next 3 days</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
