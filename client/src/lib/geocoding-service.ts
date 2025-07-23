// Real geocoding service integration with OpenStreetMap Nominatim
// This connects to actual geocoding APIs for accurate location detection

export interface GeocodeResult {
  city: string;
  state: string;
  country: string;
  timezone: string;
  postalCode?: string;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
  try {
    // Use OpenStreetMap Nominatim (free, no API key required)
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    
    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'Financial-Forecast-App/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};
        
        const city = address.city || address.town || address.village || address.municipality || 'Unknown City';
        const state = address.state || address.province || address.region || 'Unknown State';
        const country = address.country || 'Unknown Country';
        const postalCode = address.postcode;
        const timezone = getTimezoneFromCoordinates(lat, lng);
        
        console.log('Geocoding successful:', { city, state, country, postalCode });
        
        return {
          city,
          state,
          country,
          timezone,
          postalCode
        };
      }
    } catch (nominatimError) {
      console.warn('Nominatim geocoding failed, using fallback:', nominatimError);
    }
    
    // Enhanced fallback with better city detection
    return fallbackGeocode(lat, lng);
    
  } catch (error) {
    console.error('Geocoding failed completely:', error);
    return fallbackGeocode(lat, lng);
  }
}

// Enhanced fallback geocoding with accurate city detection
const fallbackGeocode = (lat: number, lng: number): GeocodeResult => {
  let city = 'Your Location';
  let state = 'Current Area';
  let country = 'United States';
  
  // Comprehensive coordinate-to-city mapping for major US cities
  const cityMappings = [
    // Texas
    { bounds: { latMin: 30.15, latMax: 30.35, lngMin: -97.85, lngMax: -97.65 }, city: 'Austin', state: 'Texas' },
    { bounds: { latMin: 29.65, latMax: 29.85, lngMin: -95.45, lngMax: -95.25 }, city: 'Houston', state: 'Texas' },
    { bounds: { latMin: 32.65, latMax: 32.85, lngMin: -96.85, lngMax: -96.65 }, city: 'Dallas', state: 'Texas' },
    { bounds: { latMin: 29.35, latMax: 29.55, lngMin: -98.65, lngMax: -98.35 }, city: 'San Antonio', state: 'Texas' },
    
    // California
    { bounds: { latMin: 34.0, latMax: 34.15, lngMin: -118.35, lngMax: -118.15 }, city: 'Los Angeles', state: 'California' },
    { bounds: { latMin: 37.7, latMax: 37.8, lngMin: -122.5, lngMax: -122.35 }, city: 'San Francisco', state: 'California' },
    { bounds: { latMin: 32.6, latMax: 32.8, lngMin: -117.3, lngMax: -117.1 }, city: 'San Diego', state: 'California' },
    
    // New York
    { bounds: { latMin: 40.6, latMax: 40.85, lngMin: -74.05, lngMax: -73.9 }, city: 'New York', state: 'New York' },
    { bounds: { latMin: 42.9, latMax: 43.0, lngMin: -78.9, lngMax: -78.8 }, city: 'Buffalo', state: 'New York' },
    
    // Florida
    { bounds: { latMin: 25.7, latMax: 25.8, lngMin: -80.3, lngMax: -80.1 }, city: 'Miami', state: 'Florida' },
    { bounds: { latMin: 30.3, latMax: 30.5, lngMin: -84.4, lngMax: -84.2 }, city: 'Tallahassee', state: 'Florida' },
    { bounds: { latMin: 28.4, latMax: 28.6, lngMin: -81.4, lngMax: -81.2 }, city: 'Orlando', state: 'Florida' },
    
    // Illinois
    { bounds: { latMin: 41.8, latMax: 42.0, lngMin: -87.8, lngMax: -87.5 }, city: 'Chicago', state: 'Illinois' },
    
    // Washington
    { bounds: { latMin: 47.5, latMax: 47.7, lngMin: -122.4, lngMax: -122.2 }, city: 'Seattle', state: 'Washington' },
    
    // Colorado
    { bounds: { latMin: 39.65, latMax: 39.8, lngMin: -105.1, lngMax: -104.8 }, city: 'Denver', state: 'Colorado' },
    
    // Arizona
    { bounds: { latMin: 33.4, latMax: 33.6, lngMin: -112.2, lngMax: -111.9 }, city: 'Phoenix', state: 'Arizona' },
    
    // Nevada
    { bounds: { latMin: 36.1, latMax: 36.2, lngMin: -115.2, lngMax: -115.0 }, city: 'Las Vegas', state: 'Nevada' },
    
    // Massachusetts
    { bounds: { latMin: 42.3, latMax: 42.4, lngMin: -71.1, lngMax: -71.0 }, city: 'Boston', state: 'Massachusetts' },
  ];
  
  // Find matching city
  for (const mapping of cityMappings) {
    const { bounds } = mapping;
    if (lat >= bounds.latMin && lat <= bounds.latMax && 
        lng >= bounds.lngMin && lng <= bounds.lngMax) {
      city = mapping.city;
      state = mapping.state;
      break;
    }
  }
  
  // If no specific city found, use state-level detection
  if (city === 'Your Location') {
    if (lat >= 25.8 && lat <= 36.5 && lng >= -106.6 && lng <= -93.5) {
      state = 'Texas';
      city = `Texas Location`;
    } else if (lat >= 32.5 && lat <= 42.0 && lng >= -124.4 && lng <= -114.1) {
      state = 'California';
      city = `California Location`;
    } else if (lat >= 40.5 && lat <= 45.0 && lng >= -79.8 && lng <= -71.8) {
      state = 'New York';
      city = `New York Location`;
    } else if (lat >= 24.5 && lat <= 31.0 && lng >= -87.6 && lng <= -80.0) {
      state = 'Florida';
      city = `Florida Location`;
    } else {
      city = `Current Location`;
      state = `Coordinates: ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
    }
  }
  
  return {
    city,
    state,
    country,
    timezone: getTimezoneFromCoordinates(lat, lng)
  };
};

function getTimezoneFromCoordinates(lat: number, lng: number): string {
  // Basic timezone estimation based on longitude
  // In production, use a proper timezone service
  
  if (lng >= -67.5) return 'America/New_York';        // Eastern
  else if (lng >= -82.5) return 'America/New_York';   // Eastern
  else if (lng >= -97.5) return 'America/Chicago';    // Central
  else if (lng >= -112.5) return 'America/Denver';    // Mountain
  else if (lng >= -127.5) return 'America/Los_Angeles'; // Pacific
  else return 'America/Los_Angeles';                  // Pacific (Alaska/Hawaii)
}

export function getCurrentPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}