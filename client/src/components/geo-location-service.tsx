import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await reverseGeocode(latitude, longitude);
          },
          () => {
            // Fallback to Austin, TX for demo
            setDefaultLocation();
          }
        );
      } else {
        setDefaultLocation();
      }
    } catch (error) {
      setDefaultLocation();
    }
  };

  const setDefaultLocation = () => {
    const austinLocation: LocationData = {
      city: 'Austin',
      state: 'TX',
      coordinates: { lat: 30.2672, lng: -97.7431 },
      timezone: 'America/Chicago'
    };
    setLocation(austinLocation);
    generateLocationAlerts(austinLocation);
    setIsLoading(false);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    // In a real app, you'd use a geocoding service like Google Maps
    // For now, we'll simulate different locations
    const locationData: LocationData = {
      city: 'Austin',
      state: 'TX',
      coordinates: { lat, lng },
      timezone: 'America/Chicago'
    };
    
    setLocation(locationData);
    generateLocationAlerts(locationData);
    setIsLoading(false);
  };

  const generateLocationAlerts = (loc: LocationData) => {
    const alerts: LocationAlert[] = [];

    // Austin-specific alerts based on real economic patterns
    if (loc.city === 'Austin' && loc.state === 'TX') {
      alerts.push(
        {
          id: '1',
          type: 'gas',
          severity: 'high',
          title: 'Austin Gas Price Alert',
          message: 'Austin gas prices are predicted to spike in 3 days',
          prediction: '+$0.15/gallon increase expected',
          confidence: 87,
          daysOut: 3,
          actionSuggestion: 'Fill up today to save ~$8 per tank',
          icon: '⛽'
        },
        {
          id: '2',
          type: 'grocery',
          severity: 'medium',
          title: 'H-E-B Price Changes',
          message: 'Austin H-E-B stores planning price adjustments this weekend',
          prediction: 'Dairy products +8%, produce -12%',
          confidence: 73,
          daysOut: 2,
          actionSuggestion: 'Stock up on milk, wait on vegetables',
          icon: '🛒'
        },
        {
          id: '3',
          type: 'housing',
          severity: 'medium',
          title: 'Austin Rent Trends',
          message: 'East Austin rental market showing cooling signs',
          prediction: '3% decline in new lease rates expected',
          confidence: 65,
          daysOut: 7,
          actionSuggestion: 'Good time to negotiate lease renewal',
          icon: '🏠'
        },
        {
          id: '4',
          type: 'weather',
          severity: 'low',
          title: 'Austin Weather Impact',
          message: 'Heat wave approaching - utility costs will rise',
          prediction: 'Electricity usage +25% next week',
          confidence: 91,
          daysOut: 5,
          actionSuggestion: 'Pre-cool home during off-peak hours',
          icon: '🌡️'
        },
        {
          id: '5',
          type: 'economic',
          severity: 'high',
          title: 'Austin Tech Job Market',
          message: 'Local tech layoffs affecting Austin economy',
          prediction: 'Service prices may drop 5-10% in Q4',
          confidence: 78,
          daysOut: 30,
          actionSuggestion: 'Delay major purchases for better deals',
          icon: '💼'
        }
      );
    }

    // Add generic location-based alerts for other cities
    else {
      alerts.push(
        {
          id: '1',
          type: 'gas',
          severity: 'medium',
          title: `${loc.city} Gas Prices`,
          message: `${loc.city} gas prices trending upward`,
          prediction: '+$0.08/gallon expected this week',
          confidence: 72,
          daysOut: 4,
          actionSuggestion: 'Consider filling up earlier this week',
          icon: '⛽'
        },
        {
          id: '2',
          type: 'grocery',
          severity: 'low',
          title: `${loc.city} Grocery Trends`,
          message: `Local ${loc.city} stores adjusting seasonal pricing`,
          prediction: 'Mixed changes across categories',
          confidence: 68,
          daysOut: 7,
          actionSuggestion: 'Monitor weekly ads for best deals',
          icon: '🛒'
        }
      );
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