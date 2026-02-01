// User Profile and Data Management Service
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'farmer' | 'trader' | 'buyer' | 'supplier';
  location: {
    state: string;
    district: string;
    village: string;
    coordinates: [number, number];
    pincode: string;
  };
  farmDetails?: {
    farmSize: number; // in acres
    soilType: string;
    irrigationType: string;
    crops: {
      name: string;
      area: number;
      season: string;
      variety: string;
    }[];
    equipment: string[];
    certifications: string[];
  };
  tradingDetails?: {
    businessName: string;
    license: string;
    specialization: string[];
    tradingVolume: number;
    preferredMarkets: string[];
  };
  preferences: {
    language: string;
    currency: string;
    notifications: {
      sms: boolean;
      whatsapp: boolean;
      email: boolean;
      push: boolean;
    };
    priceAlerts: {
      commodity: string;
      minPrice: number;
      maxPrice: number;
      active: boolean;
    }[];
  };
  financials: {
    bankAccount: {
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    };
    upiId?: string;
    walletBalance: number;
    creditLimit: number;
    transactions: Transaction[];
  };
  createdAt: string;
  lastActive: string;
  verified: boolean;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'payment' | 'withdrawal' | 'deposit';
  commodity?: string;
  quantity?: number;
  price?: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  counterparty?: string;
  paymentMethod: string;
  transactionHash?: string;
}

export interface UserInput {
  field: string;
  value: any;
  timestamp: string;
  source: 'manual' | 'voice' | 'chat' | 'form';
}

class UserProfileService {
  private currentUser: UserProfile | null = null;
  private userInputs: UserInput[] = [];
  private listeners: ((user: UserProfile) => void)[] = [];

  constructor() {
    this.loadUserProfile();
  }

  // Load user profile from localStorage
  private loadUserProfile(): void {
    const savedProfile = localStorage.getItem('mandisense_user_profile');
    if (savedProfile) {
      this.currentUser = JSON.parse(savedProfile);
    }
  }

  // Save user profile to localStorage
  private saveUserProfile(): void {
    if (this.currentUser) {
      localStorage.setItem('mandisense_user_profile', JSON.stringify(this.currentUser));
      this.notifyListeners();
    }
  }

  // Create new user profile with user inputs
  async createUserProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      type: userData.type || 'farmer',
      location: userData.location || {
        state: '',
        district: '',
        village: '',
        coordinates: [0, 0],
        pincode: ''
      },
      preferences: {
        language: userData.preferences?.language || 'en',
        currency: 'INR',
        notifications: {
          sms: true,
          whatsapp: true,
          email: true,
          push: true
        },
        priceAlerts: []
      },
      financials: {
        bankAccount: {
          accountNumber: '',
          ifscCode: '',
          bankName: ''
        },
        walletBalance: 0,
        creditLimit: 0,
        transactions: []
      },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      verified: false,
      ...userData
    };

    this.currentUser = newUser;
    this.saveUserProfile();
    return newUser;
  }

  // Update user profile with new data
  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    // Record user input
    Object.keys(updates).forEach(key => {
      this.recordUserInput(key, (updates as any)[key], 'manual');
    });

    this.currentUser = { ...this.currentUser, ...updates };
    this.currentUser.lastActive = new Date().toISOString();
    this.saveUserProfile();
    return this.currentUser;
  }

  // Add farm details with user input
  async addFarmDetails(farmData: UserProfile['farmDetails']): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    this.recordUserInput('farmDetails', farmData, 'form');
    this.currentUser.farmDetails = farmData;
    this.saveUserProfile();
  }

  // Add crop to user's farm
  async addCrop(cropData: {
    name: string;
    area: number;
    season: string;
    variety: string;
  }): Promise<void> {
    if (!this.currentUser?.farmDetails) {
      throw new Error('Farm details not found');
    }

    this.recordUserInput('newCrop', cropData, 'form');
    this.currentUser.farmDetails.crops.push(cropData);
    this.saveUserProfile();
  }

  // Add price alert with user preferences
  async addPriceAlert(alertData: {
    commodity: string;
    minPrice: number;
    maxPrice: number;
  }): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    const alert = {
      ...alertData,
      active: true
    };

    this.recordUserInput('priceAlert', alert, 'form');
    this.currentUser.preferences.priceAlerts.push(alert);
    this.saveUserProfile();
  }

  // Record transaction
  async recordTransaction(transactionData: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    const transaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...transactionData
    };

    this.recordUserInput('transaction', transaction, 'manual');
    this.currentUser.financials.transactions.unshift(transaction);

    // Update wallet balance based on transaction
    if (transaction.type === 'deposit') {
      this.currentUser.financials.walletBalance += transaction.amount;
    } else if (transaction.type === 'withdrawal' || transaction.type === 'buy') {
      this.currentUser.financials.walletBalance -= transaction.amount;
    } else if (transaction.type === 'sell') {
      this.currentUser.financials.walletBalance += transaction.amount;
    }

    this.saveUserProfile();
    return transaction;
  }

  // Record user input for analytics
  recordUserInput(field: string, value: any, source: UserInput['source']): void {
    const input: UserInput = {
      field,
      value,
      timestamp: new Date().toISOString(),
      source
    };

    this.userInputs.push(input);
    
    // Keep only last 1000 inputs
    if (this.userInputs.length > 1000) {
      this.userInputs = this.userInputs.slice(-1000);
    }

    // Save to localStorage
    localStorage.setItem('mandisense_user_inputs', JSON.stringify(this.userInputs));
  }

  // Get current user profile
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  // Get user inputs for analytics
  getUserInputs(): UserInput[] {
    return this.userInputs;
  }

  // Get user preferences
  getUserPreferences(): UserProfile['preferences'] | null {
    return this.currentUser?.preferences || null;
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserProfile['preferences']>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    this.recordUserInput('preferences', preferences, 'form');
    this.currentUser.preferences = { ...this.currentUser.preferences, ...preferences };
    this.saveUserProfile();
  }

  // Get user's crops
  getUserCrops(): { name: string; area: number; season: string; variety: string; }[] {
    return this.currentUser?.farmDetails?.crops || [];
  }

  // Get user's transactions
  getUserTransactions(): Transaction[] {
    return this.currentUser?.financials.transactions || [];
  }

  // Get user's price alerts
  getPriceAlerts(): UserProfile['preferences']['priceAlerts'] {
    return this.currentUser?.preferences.priceAlerts || [];
  }

  // Check if user has specific crop
  hasCrop(cropName: string): boolean {
    return this.getUserCrops().some(crop => 
      crop.name.toLowerCase() === cropName.toLowerCase()
    );
  }

  // Get user's location
  getUserLocation(): UserProfile['location'] | null {
    return this.currentUser?.location || null;
  }

  // Verify user profile
  async verifyUser(verificationData: {
    aadharNumber?: string;
    panNumber?: string;
    farmCertificate?: string;
    tradingLicense?: string;
  }): Promise<boolean> {
    if (!this.currentUser) {
      throw new Error('No user profile found');
    }

    this.recordUserInput('verification', verificationData, 'form');
    
    // Simulate verification process
    setTimeout(() => {
      if (this.currentUser) {
        this.currentUser.verified = true;
        this.saveUserProfile();
      }
    }, 2000);

    return true;
  }

// Get personalized recommendations based on user data
  getPersonalizedRecommendations(): any[] {
    if (!this.currentUser) return [];

    const recommendations: any[] = [];
    const userCrops = this.getUserCrops();
    const location = this.getUserLocation();

    // Crop-specific recommendations
    userCrops.forEach(crop => {
      recommendations.push({
        type: 'crop_advice',
        title: `${crop.name} Farming Tips`,
        description: `Optimize your ${crop.name} cultivation for better yields`,
        priority: 'high',
        action: 'view_crop_guide',
        data: { crop: crop.name }
      });
    });

    // Location-specific recommendations
    if (location) {
      recommendations.push({
        type: 'weather_alert',
        title: `Weather Update for ${location.district}`,
        description: 'Check weather conditions affecting your crops',
        priority: 'medium',
        action: 'view_weather',
        data: { location: location.district }
      });
    }

    // Market recommendations
    recommendations.push({
      type: 'market_opportunity',
      title: 'Best Selling Prices Today',
      description: 'Find the best markets for your produce',
      priority: 'high',
      action: 'view_markets',
      data: { crops: userCrops.map(c => c.name) }
    });

    return recommendations;
  }

  // Add listener for profile changes
  addProfileListener(callback: (user: UserProfile) => void): void {
    this.listeners.push(callback);
  }

  // Remove listener
  removeProfileListener(callback: (user: UserProfile) => void): void {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  // Notify all listeners
  private notifyListeners(): void {
    if (this.currentUser) {
      this.listeners.forEach(listener => listener(this.currentUser!));
    }
  }

  // Export user data
  exportUserData(): string {
    return JSON.stringify({
      profile: this.currentUser,
      inputs: this.userInputs
    }, null, 2);
  }

  // Import user data
  importUserData(data: string): void {
    try {
      const parsed = JSON.parse(data);
      if (parsed.profile) {
        this.currentUser = parsed.profile;
        this.saveUserProfile();
      }
      if (parsed.inputs) {
        this.userInputs = parsed.inputs;
        localStorage.setItem('mandisense_user_inputs', JSON.stringify(this.userInputs));
      }
    } catch (error) {
      throw new Error('Invalid user data format');
    }
  }

  // Clear all user data
  clearUserData(): void {
    this.currentUser = null;
    this.userInputs = [];
    localStorage.removeItem('mandisense_user_profile');
    localStorage.removeItem('mandisense_user_inputs');
  }

  // Get user analytics
  getUserAnalytics(): any {
    const inputs = this.getUserInputs();
    const transactions = this.getUserTransactions();
    
    const mostUsedFeatures = this.getMostUsedFeatures();
    const activityPattern = this.getActivityPattern();
    
    return {
      totalInputs: inputs.length,
      inputsBySource: inputs.reduce((acc, input) => {
        acc[input.source] = (acc[input.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalTransactions: transactions.length,
      transactionVolume: transactions.reduce((sum, txn) => sum + txn.amount, 0),
      mostUsedFeatures,
      activityPattern
    };
  }

  private getMostUsedFeatures(): string[] {
    const inputs = this.getUserInputs();
    if (!inputs || inputs.length === 0) {
      return ['market_prices', 'weather', 'trading'];
    }
    
    const featureCount = inputs.reduce((acc, input) => {
      acc[input.field] = (acc[input.field] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(featureCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);
  }

  private getActivityPattern(): any {
    const inputs = this.getUserInputs();
    if (!inputs || inputs.length === 0) {
      return {
        hourlyActivity: new Array(24).fill(0),
        peakHour: 9,
        totalActivity: 0
      };
    }
    
    const hourlyActivity = new Array(24).fill(0);
    
    inputs.forEach(input => {
      try {
        const hour = new Date(input.timestamp).getHours();
        if (hour >= 0 && hour < 24) {
          hourlyActivity[hour]++;
        }
      } catch (error) {
        // Skip invalid timestamps
      }
    });

    const maxActivity = Math.max(...hourlyActivity);
    const peakHour = maxActivity > 0 ? hourlyActivity.indexOf(maxActivity) : 9;

    return {
      hourlyActivity,
      peakHour,
      totalActivity: hourlyActivity.reduce((sum, count) => sum + count, 0)
    };
  }
}

export const userProfileService = new UserProfileService();