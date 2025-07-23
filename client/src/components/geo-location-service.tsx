import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { reverseGeocode, getCurrentPosition } from '@/lib/geocoding-service';

interface LocationData {
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

interface LocationAlert {
  id: string;
  type: 'gas' | 'grocery' | 'housing' | 'weather' | 'economic';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  prediction: string;
  confidence: number;
  daysOut: number;
  actionSuggestion?: string;
  icon: string;
}

export function useLocationAlerts() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationAlerts, setLocationAlerts] = useState<LocationAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserPreferences();
    detectLocation();
  }, []);

  const loadUserPreferences = () => {
    try {
      const saved = localStorage.getItem('locationPreferences');
      if (saved) {
        const prefs = JSON.parse(saved);
        setUserPreferences(prefs);
        
        // Set location from user preferences if available
        if (prefs.city && prefs.state) {
          setLocation({
            city: prefs.city,
            state: prefs.state,
            coordinates: { lat: prefs.lat || 0, lng: prefs.lng || 0 },
            timezone: prefs.timezone || 'America/New_York'
          });
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const detectLocation = async () => {
    try {
      // Try to get user's actual location using geolocation
      const coords = await getCurrentPosition();
      await processUserLocation(coords.lat, coords.lng);
    } catch (error) {
      console.warn('Location detection failed:', error);
      setDefaultLocation();
    }
  };

  const processUserLocation = async (lat: number, lng: number) => {
    try {
      // Use geocoding service to get city/state from coordinates
      const geocodeResult = await reverseGeocode(lat, lng);
      
      const locationData: LocationData = {
        city: geocodeResult?.city || `Location ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
        state: geocodeResult?.state || 'Unknown',
        coordinates: { lat, lng },
        timezone: geocodeResult?.timezone || 'America/New_York'
      };
      
      setLocation(locationData);
      generateLocationAlerts(locationData);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to process location:', error);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    // Fallback to generic location if geolocation fails
    const defaultLocation: LocationData = {
      city: 'Unknown Location',
      state: 'Unknown',
      coordinates: { lat: 0, lng: 0 },
      timezone: 'America/New_York'
    };
    setLocation(defaultLocation);
    generateLocationAlerts(defaultLocation);
    setIsLoading(false);
  };



  const generateLocationAlerts = (loc: LocationData) => {
    const alerts: LocationAlert[] = [];
    
    // Check user preferences to filter alerts
    const enabledAlertTypes = userPreferences?.alertTypes || {
      gas: true,
      grocery: true,
      housing: true,
      weather: true,
      economic: true
    };

    // Generate location-based alerts based on actual user location
    const cityName = loc.city === 'Unknown Location' ? 'your area' : loc.city;
    const gasStations = userPreferences?.storePreferences?.gasStations || ['local gas stations'];
    const groceryStores = userPreferences?.storePreferences?.groceryStores || ['local stores'];

    // Gas price alerts
    if (enabledAlertTypes.gas) {
      alerts.push({
        id: '1',
        type: 'gas',
        severity: 'medium',
        title: `Gas Price Alert - ${cityName}`,
        message: `${gasStations.join(' & ')} showing price trends in your area`,
        prediction: 'Price changes expected this week',
        confidence: 75,
        daysOut: 3,
        actionSuggestion: 'Monitor local gas prices for best timing',
        icon: '⛽'
      });
    }

    // Grocery price alerts
    if (enabledAlertTypes.grocery) {
      alerts.push({
        id: '2',
        type: 'grocery',
        severity: 'low',
        title: `Grocery Trends - ${cityName}`,
        message: `${groceryStores.join(' & ')} adjusting seasonal pricing`,
        prediction: 'Mixed price changes across categories',
        confidence: 68,
        daysOut: 5,
        actionSuggestion: 'Check weekly ads and promotions',
        icon: '🛒'
      });
    }

    // Housing market alerts
    if (enabledAlertTypes.housing) {
      alerts.push({
        id: '3',
        type: 'housing',
        severity: 'low',
        title: `Housing Market - ${cityName}`,
        message: `Local rental market showing typical seasonal patterns`,
        prediction: 'Standard market fluctuations expected',
        confidence: 65,
        daysOut: 14,
        actionSuggestion: 'Monitor local market conditions',
        icon: '🏠'
      });
    }

    // Weather impact alerts
    if (enabledAlertTypes.weather) {
      alerts.push({
        id: '4',
        type: 'weather',
        severity: 'medium',
        title: `Weather Impact - ${cityName}`,
        message: 'Seasonal weather patterns may affect utility costs',
        prediction: 'Energy usage changes expected',
        confidence: 80,
        daysOut: 7,
        actionSuggestion: 'Plan energy usage during peak times',
        icon: '🌡️'
      });
    }

    // Economic trends alerts
    if (enabledAlertTypes.economic) {
      alerts.push({
        id: '5',
        type: 'economic',
        severity: 'low',
        title: `Economic Trends - ${cityName}`,
        message: 'National economic indicators affecting local markets',
        prediction: 'Follow broader economic trends',
        confidence: 70,
        daysOut: 21,
        actionSuggestion: 'Stay informed about market changes',
        icon: '💼'
      });
    }

    setLocationAlerts(alerts);
    
    // Show toast notification for high severity alerts
    const highSeverityAlert = alerts.find(alert => alert.severity === 'high');
    if (highSeverityAlert) {
      toast({
        title: `📍 ${loc.city} Alert`,
        description: highSeverityAlert.message,
        duration: 5000,
      });
    }
  };

  return {
    location,
    locationAlerts,
    isLoading,
    refreshAlerts: () => location && generateLocationAlerts(location)
  };
}

export default function GeoLocationService() {
  return null; // This is a service component, no UI
}