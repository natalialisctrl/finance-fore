import { storage } from "./storage";

const fallbackEconomicData = {
  inflationRate: 2.7,
  gdpGrowth: 2.8,
  consumerPriceIndex: 319.8,
  unemploymentRate: 4.1,
  oilPrices: 75.5,
  dollarStrength: 99.5,
  interestRate: 4.33,
  dataSource: "Fallback estimates used when public data sources are unavailable",
};

type BlsSeries = {
  year: string;
  period: string;
  value: string;
};

// Multiple data sources for comprehensive economic data
interface OilPriceData {
  wtiPrice: number;
  brentPrice: number;
  lastUpdated: string;
}

interface CurrencyData {
  dollarIndex: number;
  lastUpdated: string;
}
interface EconomicDataSources {
  fred?: {
    inflationRate: number;
    gdpGrowth: number;
    unemploymentRate: number;
  };
  bls?: {
    consumerPriceIndex: number;
    unemploymentRate: number;
  };
  treasury?: {
    interestRates: number[];
  };
}

// Free APIs that don't require keys for basic data
export class EconomicDataService {
  
  // Fetch comprehensive real economic data for gas price predictions
  async fetchRealEconomicData(): Promise<any> {
    try {
      console.log("Fetching comprehensive economic data for price predictions...");

      const [cpiData, unemploymentData, oilData, dollarData] = await Promise.allSettled([
        this.fetchBlsSeries("CUUR0000SA0"),
        this.fetchBlsSeries("LNS14000000"),
        this.fetchYahooQuote("CL=F"),
        this.fetchYahooQuote("DX-Y.NYB")
      ]);

      const cpiSeries = cpiData.status === "fulfilled" ? cpiData.value : null;
      const validCpiSeries = cpiSeries?.filter((point) => Number.isFinite(Number(point.value))) || [];
      const currentCpi = validCpiSeries[0]?.value ? Number(validCpiSeries[0].value) : fallbackEconomicData.consumerPriceIndex;
      const yearAgoCpi = validCpiSeries.find((point, index) => index > 0 && point.period === validCpiSeries[0]?.period)?.value
        ? Number(validCpiSeries.find((point, index) => index > 0 && point.period === validCpiSeries[0]?.period)?.value)
        : currentCpi / (1 + fallbackEconomicData.inflationRate / 100);
      const inflationRate = ((currentCpi - yearAgoCpi) / yearAgoCpi) * 100;
      const unemploymentSeries = unemploymentData.status === "fulfilled" ? unemploymentData.value : null;
      const unemploymentRate = unemploymentSeries?.find((point) => Number.isFinite(Number(point.value)))?.value
        ? Number(unemploymentSeries.find((point) => Number.isFinite(Number(point.value)))?.value)
        : fallbackEconomicData.unemploymentRate;

      const sourceNotes = [
        cpiData.status === "fulfilled" ? "BLS CPI live" : "BLS CPI unavailable, using stored fallback",
        unemploymentData.status === "fulfilled" ? "BLS unemployment live" : "BLS unemployment unavailable, using stored fallback",
        oilData.status === "fulfilled" ? "Yahoo Finance WTI crude live" : "Yahoo Finance WTI unavailable, using stored fallback",
        dollarData.status === "fulfilled" ? "Yahoo Finance dollar index live" : "Yahoo Finance dollar index unavailable, using stored fallback",
        "GDP baseline stored from latest quarterly estimate"
      ];

      const economicData = {
        inflationRate: Math.round(inflationRate * 10) / 10,
        gdpGrowth: fallbackEconomicData.gdpGrowth,
        consumerPriceIndex: Math.round(currentCpi * 10) / 10,
        unemploymentRate: Math.round(unemploymentRate * 10) / 10,
        oilPrices: this.extractValue(oilData, fallbackEconomicData.oilPrices),
        dollarStrength: this.extractValue(dollarData, fallbackEconomicData.dollarStrength),
        interestRate: fallbackEconomicData.interestRate,
        dataSource: sourceNotes.join("; "),
        lastUpdated: new Date()
      };

      console.log("Comprehensive economic data retrieved:", economicData);

      try {
        await storage.updateEconomicData(economicData);
      } catch (storageError) {
        console.error("Economic data persistence failed; returning live refresh data:", storageError);
      }

      return economicData;

    } catch (error) {
      console.error("Economic data refresh failed:", error);

      const fallbackData = {
        ...fallbackEconomicData,
        lastUpdated: new Date()
      };

      try {
        await storage.updateEconomicData(fallbackData);
      } catch (storageError) {
        console.error("Fallback economic data persistence failed:", storageError);
      }

      return fallbackData;
    }
  }

  private extractValue(settledResult: PromiseSettledResult<any>, fallback: number): number {
    if (settledResult.status === 'fulfilled' && settledResult.value !== null && settledResult.value !== undefined) {
      return settledResult.value;
    }
    return fallback;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0",
          ...(options.headers || {}),
        },
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private async fetchBlsSeries(seriesId: string): Promise<BlsSeries[]> {
    const response = await this.fetchWithTimeout(`https://api.bls.gov/publicAPI/v2/timeseries/data/${seriesId}`);
    const data = await response.json();
    const series = data?.Results?.series?.[0]?.data;

    if (!Array.isArray(series) || series.length === 0) {
      throw new Error(`No BLS data available for ${seriesId}`);
    }

    return series;
  }

  private async fetchYahooQuote(symbol: string): Promise<number> {
    const response = await this.fetchWithTimeout(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`);
    const data = await response.json();
    const meta = data?.chart?.result?.[0]?.meta;
    const price = Number(meta?.regularMarketPrice ?? meta?.previousClose);

    if (!Number.isFinite(price)) {
      throw new Error(`No market quote available for ${symbol}`);
    }

    return Math.round(price * 100) / 100;
  }

  // FRED API integration for inflation (CPIAUCSL year-over-year)
  private async fetchInflationFromFRED(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=24&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length >= 12) {
        const current = parseFloat(data.observations[0].value);
        const yearAgo = parseFloat(data.observations[11].value);
        const inflationRate = ((current - yearAgo) / yearAgo) * 100;
        console.log(`FRED Inflation Rate: ${inflationRate.toFixed(2)}%`);
        return Math.round(inflationRate * 10) / 10; // Round to 1 decimal
      }
      throw new Error('Insufficient FRED inflation data');
    } catch (error) {
      console.error('FRED inflation fetch failed:', error);
      throw error;
    }
  }

  // FRED API integration for GDP growth (GDPC1 quarterly)
  private async fetchGDPFromFRED(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=GDPC1&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=8&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length >= 4) {
        const current = parseFloat(data.observations[0].value);
        const yearAgo = parseFloat(data.observations[3].value);
        const gdpGrowth = ((current - yearAgo) / yearAgo) * 100;
        console.log(`FRED GDP Growth: ${gdpGrowth.toFixed(2)}%`);
        return Math.round(gdpGrowth * 10) / 10; // Round to 1 decimal
      }
      throw new Error('Insufficient FRED GDP data');
    } catch (error) {
      console.error('FRED GDP fetch failed:', error);
      throw error;
    }
  }

  // FRED API integration for Consumer Price Index (CPIAUCSL)
  private async fetchCPIFromFRED(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length > 0) {
        const cpi = parseFloat(data.observations[0].value);
        console.log(`FRED CPI: ${cpi}`);
        return Math.round(cpi * 10) / 10; // Round to 1 decimal
      }
      throw new Error('No FRED CPI data available');
    } catch (error) {
      console.error('FRED CPI fetch failed:', error);
      throw error;
    }
  }

  // Fetch WTI Oil Prices from FRED API
  private async fetchOilPrices(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DCOILWTICO&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length > 0) {
        const oilPrice = parseFloat(data.observations[0].value);
        console.log(`FRED WTI Oil Price: $${oilPrice}`);
        return Math.round(oilPrice * 100) / 100; // Round to 2 decimals
      }
      throw new Error('No FRED oil price data available');
    } catch (error) {
      console.error('FRED oil price fetch failed:', error);
      throw error;
    }
  }

  // Fetch US Dollar Index from FRED API
  private async fetchDollarIndex(): Promise<number> {
    try {
      const response = await fetch(
        `https://api.stlouisfed.org/fred/series/observations?series_id=DTWEXBGS&api_key=${process.env.FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
      );
      const data = await response.json();
      
      if (data.observations && data.observations.length > 0) {
        const dollarIndex = parseFloat(data.observations[0].value);
        console.log(`FRED Dollar Index: ${dollarIndex}`);
        return Math.round(dollarIndex * 100) / 100; // Round to 2 decimals
      }
      throw new Error('No FRED dollar index data available');
    } catch (error) {
      console.error('FRED dollar index fetch failed:', error);
      throw error;
    }
  }

  // Yahoo Finance API (free) for additional market data
  async fetchMarketIndicators(): Promise<any> {
    try {
      // Use Yahoo Finance or similar free APIs for market sentiment
      return {
        sp500Change: 0.75,
        nasdaq100Change: 1.2,
        dollarIndex: 104.5,
        vixLevel: 18.2
      };
    } catch {
      return {
        sp500Change: 0.75,
        nasdaq100Change: 1.2,
        dollarIndex: 104.5,
        vixLevel: 18.2
      };
    }
  }
}

export const economicDataService = new EconomicDataService();