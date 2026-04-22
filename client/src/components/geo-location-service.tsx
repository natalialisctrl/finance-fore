import { useState, useEffect, useCallback } from 'react';

// ── Module-level singleton so every hook instance shares one request ──────
let _geoPromise: Promise<any> | null = null;
let _geoResult: any = null;

async function fetchGeoOnce(): Promise<any> {
  if (_geoResult) return _geoResult;
  if (_geoPromise) return _geoPromise;
  _geoPromise = fetch('/api/geolocate').then(r => r.json()).then(d => {
    _geoResult = d;
    _geoPromise = null;
    return d;
  });
  return _geoPromise;
}

export interface LocationData {
  city: string;
  state: string;
  stateCode?: string;
  country: string;
  countryCode?: string;
  lat: number;
  lng: number;
  timezone: string;
  postalCode?: string;
}

export interface LocationAlert {
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
  const [error, setError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState<string>('');

  const fetchAlerts = useCallback(async (loc: LocationData) => {
    try {
      const r = await fetch('/api/location-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: loc.city, state: loc.state, country: loc.country }),
      });
      if (!r.ok) throw new Error('Failed to fetch alerts');
      const data = await r.json();
      setLocationAlerts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.warn('Location alerts fetch failed:', e.message);
      setLocationAlerts([]);
    }
  }, []);

  const detect = useCallback(async (overrideCity?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use singleton so multiple hook instances share one network request
      const geo = await fetchGeoOnce();

      let loc: LocationData;

      if (overrideCity) {
        // User manually entered a city — use it, keep other geo fields for context
        loc = {
          city: overrideCity,
          state: geo.state || '',
          stateCode: geo.stateCode || '',
          country: geo.country || 'United States',
          countryCode: geo.countryCode || 'US',
          lat: geo.lat || 0,
          lng: geo.lng || 0,
          timezone: geo.timezone || 'America/New_York',
          postalCode: geo.postalCode || '',
        };
      } else if (geo.city) {
        loc = geo as LocationData;
      } else {
        // IP geo returned no city (e.g. VPN, localhost) — prompt manual entry
        setError('Could not detect city automatically. Enter your city below.');
        setIsLoading(false);
        return;
      }

      setLocation(loc);
      // Persist so next load is instant
      localStorage.setItem('foresee_location', JSON.stringify(loc));
      await fetchAlerts(loc);
    } catch (e: any) {
      console.error('Location detection error:', e);
      setError('Location detection failed. Enter your city below.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchAlerts]);

  useEffect(() => {
    // Try to restore cached location immediately for instant display
    try {
      const cached = localStorage.getItem('foresee_location');
      if (cached) {
        const loc = JSON.parse(cached) as LocationData;
        setLocation(loc);
        // Still refresh alerts in background
        fetchAlerts(loc).then(() => setIsLoading(false));
        return;
      }
    } catch { /* ignore */ }
    detect();
  }, [detect, fetchAlerts]);

  const submitManualCity = useCallback((city: string) => {
    detect(city);
  }, [detect]);

  return {
    location,
    locationAlerts,
    isLoading,
    error,
    manualCity,
    setManualCity,
    submitManualCity,
    // Reset singleton so a manual refresh always hits the server fresh
    refreshAlerts: () => { _geoResult = null; _geoPromise = null; detect(); },
  };
}

export default function GeoLocationService() {
  return null;
}
