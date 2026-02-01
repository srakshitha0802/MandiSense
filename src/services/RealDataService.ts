// Real data service with multiple data sources
export interface MarketPrice {
  commodity: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high24h: number;
  low24h: number;
  location: string;
  market: string;
  timestamp: string;
  quality: string;
  unit: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  forecast: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'high' | 'medium' | 'low';
  commodities: string[];
}

class RealDataService {
  private apiKey = 'demo_key'; // In production, use environment variables
  private baseUrl = 'https://api.mandisense.com'; // Mock API endpoint
  
  // Real market data sources
  private dataSources = {
    government: 'https://agmarknet.gov.in/SearchCmmMkt.aspx',
    ncdex: 'https://www.ncdex.com/market-data',
    mcx: 'https://www.mcxindia.com/market-data',
    apmc: 'https://www.apmc.gov.in/market-prices'
  };

  // Cache for performance
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getMarketPrices(): Promise<MarketPrice[]> {
    const cacheKey = 'market_prices';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // In production, this would fetch from real APIs
      const data = await this.fetchRealMarketData();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch real market data:', error);
      return this.getFallbackMarketData();
    }
  }

  private async fetchRealMarketData(): Promise<MarketPrice[]> {
    // Simulate real API calls to government and exchange data
    const realData: MarketPrice[] = [
      {
        commodity: 'Tomatoes',
        price: 45.50,
        change: 2.30,
        changePercent: 5.33,
        volume: '12,500',
        high24h: 48.00,
        low24h: 42.10,
        location: 'Maharashtra',
        market: 'Pune APMC',
        timestamp: new Date().toISOString(),
        quality: 'Grade A',
        unit: 'kg'
      },
      {
        commodity: 'Onions',
        price: 38.75,
        change: -1.25,
        changePercent: -3.12,
        volume: '8,300',
        high24h: 41.00,
        low24h: 36.50,
        location: 'Gujarat',
        market: 'Rajkot APMC',
        timestamp: new Date().toISOString(),
        quality: 'Grade B',
        unit: 'kg'
      },
      {
        commodity: 'Rice (Basmati)',
        price: 5250.00,
        change: 75.00,
        changePercent: 1.45,
        volume: '25,200',
        high24h: 5300.00,
        low24h: 5180.00,
        location: 'Punjab',
        market: 'Amritsar Grain Market',
        timestamp: new Date().toISOString(),
        quality: 'Premium',
        unit: 'quintal'
      },
      {
        commodity: 'Wheat',
        price: 2150.00,
        change: 25.00,
        changePercent: 1.18,
        volume: '18,900',
        high24h: 2180.00,
        low24h: 2120.00,
        location: 'Madhya Pradesh',
        market: 'Indore Mandi',
        timestamp: new Date().toISOString(),
        quality: 'FAQ',
        unit: 'quintal'
      },
      {
        commodity: 'Green Chilli',
        price: 80.25,
        change: 3.75,
        changePercent: 4.90,
        volume: '4,200',
        high24h: 85.00,
        low24h: 75.50,
        location: 'Andhra Pradesh',
        market: 'Guntur Mirchi Yard',
        timestamp: new Date().toISOString(),
        quality: 'Teja',
        unit: 'kg'
      },
      {
        commodity: 'Potatoes',
        price: 28.90,
        change: 0.65,
        changePercent: 2.30,
        volume: '15,700',
        high24h: 30.50,
        low24h: 27.80,
        location: 'Uttar Pradesh',
        market: 'Agra Sabzi Mandi',
        timestamp: new Date().toISOString(),
        quality: 'Medium',
        unit: 'kg'
      }
    ];

    // Add real-time price fluctuations
    return realData.map(item => ({
      ...item,
      price: item.price + (Math.random() - 0.5) * 2,
      change: item.change + (Math.random() - 0.5) * 0.5,
      timestamp: new Date().toISOString()
    }));
  }

  async getWeatherData(location: string): Promise<WeatherData> {
    const cacheKey = `weather_${location}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // In production, integrate with weather APIs like OpenWeatherMap
      const data = await this.fetchWeatherData(location);
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getFallbackWeatherData(location);
    }
  }

  private async fetchWeatherData(location: string): Promise<WeatherData> {
    // Simulate weather API call
    const weatherData: WeatherData = {
      location,
      temperature: 28 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      rainfall: Math.random() * 50,
      forecast: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
      impact: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral'
    };

    return weatherData;
  }

  async getMarketNews(): Promise<NewsItem[]> {
    const cacheKey = 'market_news';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const data = await this.fetchMarketNews();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Failed to fetch market news:', error);
      return this.getFallbackNewsData();
    }
  }

  private async fetchMarketNews(): Promise<NewsItem[]> {
    // In production, integrate with news APIs
    const newsData: NewsItem[] = [
      {
        id: '1',
        title: 'Tomato prices surge due to unseasonal rains in Maharashtra',
        summary: 'Heavy rainfall in key growing regions has disrupted supply chains, leading to a 15% price increase.',
        source: 'Agricultural Times',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        impact: 'high',
        commodities: ['Tomatoes']
      },
      {
        id: '2',
        title: 'Record wheat harvest expected in Punjab this season',
        summary: 'Favorable weather conditions and improved farming techniques are expected to boost wheat production by 12%.',
        source: 'Farm News India',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        impact: 'medium',
        commodities: ['Wheat']
      },
      {
        id: '3',
        title: 'Export demand drives up basmati rice prices',
        summary: 'Strong international demand, particularly from Middle East markets, has pushed basmati prices higher.',
        source: 'Export India',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        impact: 'medium',
        commodities: ['Rice']
      }
    ];

    return newsData;
  }

  // Historical price data for analytics
  async getHistoricalPrices(commodity: string, days: number = 30): Promise<any[]> {
    const cacheKey = `historical_${commodity}_${days}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    const data = this.generateHistoricalData(commodity, days);
    this.setCachedData(cacheKey, data);
    return data;
  }

  private generateHistoricalData(commodity: string, days: number): any[] {
    const basePrice = this.getBasePriceForCommodity(commodity);
    const data: any[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movements
      const volatility = 0.03; // 3% daily volatility
      const trend = Math.sin(i / 10) * 0.01; // Seasonal trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const priceMultiplier = 1 + trend + randomChange;
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(basePrice * priceMultiplier * 100) / 100,
        volume: Math.floor(Math.random() * 5000) + 1000,
        high: Math.round(basePrice * priceMultiplier * 1.05 * 100) / 100,
        low: Math.round(basePrice * priceMultiplier * 0.95 * 100) / 100,
        open: Math.round(basePrice * priceMultiplier * 0.98 * 100) / 100,
        close: Math.round(basePrice * priceMultiplier * 100) / 100
      });
    }
    
    return data;
  }

  private getBasePriceForCommodity(commodity: string): number {
    const basePrices: Record<string, number> = {
      'Tomatoes': 45,
      'Onions': 38,
      'Potatoes': 28,
      'Rice': 5200,
      'Wheat': 2150,
      'Green Chilli': 80,
      'Beetroot': 35,
      'Carrots': 32,
      'Cabbage': 25,
      'Cauliflower': 40
    };
    return basePrices[commodity] || 50;
  }

  private getFallbackMarketData(): MarketPrice[] {
    return [
      {
        commodity: 'Tomatoes',
        price: 45.00,
        change: 2.50,
        changePercent: 5.88,
        volume: '12,500',
        high24h: 48.00,
        low24h: 42.00,
        location: 'Maharashtra',
        market: 'Local APMC',
        timestamp: new Date().toISOString(),
        quality: 'Grade A',
        unit: 'kg'
      }
    ];
  }

  private getFallbackWeatherData(location: string): WeatherData {
    return {
      location,
      temperature: 28,
      humidity: 65,
      rainfall: 10,
      forecast: 'Partly Cloudy',
      impact: 'neutral'
    };
  }

  private getFallbackNewsData(): NewsItem[] {
    return [
      {
        id: '1',
        title: 'Market Update Available',
        summary: 'Latest market information is being updated.',
        source: 'MandiSense',
        timestamp: new Date().toISOString(),
        impact: 'low',
        commodities: ['General']
      }
    ];
  }

  private getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Real-time price updates via WebSocket (simulated)
  subscribeToRealTimeUpdates(callback: (data: MarketPrice[]) => void): () => void {
    const interval = setInterval(async () => {
      const prices = await this.getMarketPrices();
      callback(prices);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }
}

export const realDataService = new RealDataService();