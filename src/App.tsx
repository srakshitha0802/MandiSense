import React, { useState, useEffect } from 'react';
import './assets/styles/theme.css';
import { languageService, SUPPORTED_LANGUAGES } from './services/LanguageService';
import { realDataService, MarketPrice, WeatherData, NewsItem } from './services/RealDataService';
import { blockchainService, BlockchainTransaction, SmartContract } from './services/BlockchainService';
import { aiService, PricePrediction, YieldForecast, DiseaseDetection } from './services/AIService';
import { iotService, IoTDevice, SensorData, SmartIrrigation } from './services/IoTService';
import { voiceAssistantService } from './services/VoiceAssistantService';
import { chatbotService, ChatMessage } from './services/ChatbotService';
import { userProfileService, UserProfile } from './services/UserProfileService';

// Enhanced Header with language switching and user profile
const Header = ({ 
  currentPage, 
  setCurrentPage, 
  currentLanguage, 
  onLanguageChange,
  user,
  onShowProfile 
}: { 
  currentPage: string; 
  setCurrentPage: (page: string) => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  user: UserProfile | null;
  onShowProfile: () => void;
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const t = (key: string) => languageService.translate(key);

  return (
    <header className="header">
      <div className="header-content">
        <button type="button" className="logo" onClick={() => setCurrentPage('home')}>🌾 MandiSense</button>
        <nav className="nav">
          <button type="button" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>{t('nav.home')}</button>
          <button type="button" className={`nav-link ${currentPage === 'market' ? 'active' : ''}`} onClick={() => setCurrentPage('market')}>{t('nav.market')}</button>
          <button type="button" className={`nav-link ${currentPage === 'prices' ? 'active' : ''}`} onClick={() => setCurrentPage('prices')}>{t('nav.prices')}</button>
          <button type="button" className={`nav-link ${currentPage === 'trade' ? 'active' : ''}`} onClick={() => setCurrentPage('trade')}>{t('nav.trade')}</button>
          <button type="button" className={`nav-link ${currentPage === 'analytics' ? 'active' : ''}`} onClick={() => setCurrentPage('analytics')}>{t('nav.analytics')}</button>
          <button type="button" className={`nav-link ${currentPage === 'blockchain' ? 'active' : ''}`} onClick={() => setCurrentPage('blockchain')}>🔗 Blockchain</button>
          <button type="button" className={`nav-link ${currentPage === 'iot' ? 'active' : ''}`} onClick={() => setCurrentPage('iot')}>🌐 IoT Farm</button>
          <button type="button" className={`nav-link ${currentPage === 'ai' ? 'active' : ''}`} onClick={() => setCurrentPage('ai')}>🤖 AI Assistant</button>
          <button type="button" className={`nav-link ${currentPage === 'chat' ? 'active' : ''}`} onClick={() => setCurrentPage('chat')}>💬 AI Chat</button>
        </nav>
        
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.flag} {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-50" style={{minWidth: '200px'}}>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageMenu(false);
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              👤 {user?.name || 'Guest'}
              {user?.verified && <span className="ml-1 text-green">✓</span>}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg z-50" style={{minWidth: '150px'}}>
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    onShowProfile();
                    setShowUserMenu(false);
                  }}
                >
                  {t('nav.profile')}
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  {t('nav.settings')}
                </button>
                <hr className="my-1" />
                <button 
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    userProfileService.clearUserData();
                    window.location.reload();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// User Profile Setup and Management Component
const UserProfilePage = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    name: '',
    email: '',
    phone: '',
    type: 'farmer',
    location: {
      state: '',
      district: '',
      village: '',
      coordinates: [0, 0],
      pincode: ''
    },
    preferences: {
      language: 'en',
      currency: 'INR',
      notifications: {
        sms: true,
        whatsapp: true,
        email: true,
        push: true
      },
      priceAlerts: []
    }
  });
  const [farmData, setFarmData] = useState({
    farmSize: '',
    soilType: '',
    irrigationType: '',
    crops: [{ name: '', area: '', season: '', variety: '' }],
    equipment: [] as string[],
    certifications: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  const currentUser = userProfileService.getCurrentUser();
  const isEditing = !!currentUser;

  useEffect(() => {
    if (currentUser) {
      setProfileData(currentUser);
      if (currentUser.farmDetails) {
        setFarmData({
          farmSize: currentUser.farmDetails.farmSize.toString(),
          soilType: currentUser.farmDetails.soilType,
          irrigationType: currentUser.farmDetails.irrigationType,
          crops: currentUser.farmDetails.crops.map(crop => ({
            name: crop.name,
            area: crop.area.toString(),
            season: crop.season,
            variety: crop.variety
          })),
          equipment: currentUser.farmDetails.equipment,
          certifications: currentUser.farmDetails.certifications
        });
      }
    }
  }, [currentUser]);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileData.type === 'farmer') {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleFarmDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  const addCrop = () => {
    setFarmData({
      ...farmData,
      crops: [...farmData.crops, { name: '', area: '', season: '', variety: '' }]
    });
  };

  const updateCrop = (index: number, field: string, value: string) => {
    const updatedCrops = farmData.crops.map((crop, i) => 
      i === index ? { ...crop, [field]: value } : crop
    );
    setFarmData({ ...farmData, crops: updatedCrops });
  };

  const removeCrop = (index: number) => {
    setFarmData({
      ...farmData,
      crops: farmData.crops.filter((_, i) => i !== index)
    });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let user: UserProfile;
      
      if (isEditing) {
        user = await userProfileService.updateUserProfile(profileData);
      } else {
        user = await userProfileService.createUserProfile(profileData);
      }

      // Add farm details if user is a farmer
      if (profileData.type === 'farmer' && farmData.farmSize) {
        await userProfileService.addFarmDetails({
          farmSize: parseFloat(farmData.farmSize),
          soilType: farmData.soilType,
          irrigationType: farmData.irrigationType,
          crops: farmData.crops
            .filter(crop => crop.name && crop.area)
            .map(crop => ({
              name: crop.name,
              area: parseFloat(crop.area),
              season: crop.season,
              variety: crop.variety
            })),
          equipment: farmData.equipment,
          certifications: farmData.certifications
        });
      }

      // Set user language preference
      if (profileData.preferences?.language) {
        languageService.setLanguage(profileData.preferences.language);
      }

      // Set chatbot user context
      chatbotService.setUserContext({
        name: user.name,
        type: user.type,
        location: `${user.location.district}, ${user.location.state}`,
        crops: user.farmDetails?.crops.map(c => c.name) || [],
        experience: 'intermediate'
      });

      onComplete();
    } catch (error) {
      console.error('Failed to save user profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleBasicInfoSubmit}>
            <h2 className="text-xl font-bold mb-4">👤 Basic Information</h2>
            
            <div className="mb-4">
              <label className="mb-1 font-bold">Full Name *</label>
              <input
                type="text"
                className="input"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">Email *</label>
              <input
                type="email"
                className="input"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">Phone Number *</label>
              <input
                type="tel"
                className="input"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">User Type *</label>
              <select
                className="input"
                value={profileData.type}
                onChange={(e) => setProfileData({...profileData, type: e.target.value as any})}
                required
              >
                <option value="farmer">Farmer</option>
                <option value="trader">Trader</option>
                <option value="buyer">Buyer</option>
                <option value="supplier">Supplier</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">Preferred Language</label>
              <select
                className="input"
                value={profileData.preferences?.language || 'en'}
                onChange={(e) => setProfileData({
                  ...profileData,
                  preferences: { ...profileData.preferences!, language: e.target.value }
                })}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Next: Location Details →
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleLocationSubmit}>
            <h2 className="text-xl font-bold mb-4">📍 Location Information</h2>
            
            <div className="grid grid-2 mb-4">
              <div>
                <label className="mb-1 font-bold">State *</label>
                <select
                  className="input"
                  value={profileData.location?.state}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    location: { ...profileData.location!, state: e.target.value }
                  })}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                </select>
              </div>
              <div>
                <label className="mb-1 font-bold">District *</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.location?.district}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    location: { ...profileData.location!, district: e.target.value }
                  })}
                  required
                  placeholder="Enter district"
                />
              </div>
            </div>

            <div className="grid grid-2 mb-4">
              <div>
                <label className="mb-1 font-bold">Village/City *</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.location?.village}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    location: { ...profileData.location!, village: e.target.value }
                  })}
                  required
                  placeholder="Enter village or city"
                />
              </div>
              <div>
                <label className="mb-1 font-bold">PIN Code *</label>
                <input
                  type="text"
                  className="input"
                  value={profileData.location?.pincode}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    location: { ...profileData.location!, pincode: e.target.value }
                  })}
                  required
                  placeholder="Enter PIN code"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="btn btn-secondary">
                ← Back
              </button>
              <button type="submit" className="btn btn-primary">
                {profileData.type === 'farmer' ? 'Next: Farm Details →' : 'Next: Preferences →'}
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleFarmDetailsSubmit}>
            <h2 className="text-xl font-bold mb-4">🌾 Farm Details</h2>
            
            <div className="grid grid-2 mb-4">
              <div>
                <label className="mb-1 font-bold">Farm Size (acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="input"
                  value={farmData.farmSize}
                  onChange={(e) => setFarmData({...farmData, farmSize: e.target.value})}
                  required
                  placeholder="Enter farm size"
                />
              </div>
              <div>
                <label className="mb-1 font-bold">Soil Type *</label>
                <select
                  className="input"
                  value={farmData.soilType}
                  onChange={(e) => setFarmData({...farmData, soilType: e.target.value})}
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Silt">Silt</option>
                  <option value="Black Cotton">Black Cotton</option>
                  <option value="Red">Red</option>
                  <option value="Alluvial">Alluvial</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">Irrigation Type *</label>
              <select
                className="input"
                value={farmData.irrigationType}
                onChange={(e) => setFarmData({...farmData, irrigationType: e.target.value})}
                required
              >
                <option value="">Select irrigation type</option>
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood">Flood/Basin</option>
                <option value="Furrow">Furrow</option>
                <option value="Rain-fed">Rain-fed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1 font-bold">Crops Grown</label>
              {farmData.crops.map((crop, index) => (
                <div key={index} className="grid grid-4 gap-2 mb-2">
                  <input
                    type="text"
                    className="input"
                    placeholder="Crop name"
                    value={crop.name}
                    onChange={(e) => updateCrop(index, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    placeholder="Area (acres)"
                    value={crop.area}
                    onChange={(e) => updateCrop(index, 'area', e.target.value)}
                  />
                  <select
                    className="input"
                    value={crop.season}
                    onChange={(e) => updateCrop(index, 'season', e.target.value)}
                  >
                    <option value="">Season</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                    <option value="Perennial">Perennial</option>
                  </select>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      className="input"
                      placeholder="Variety"
                      value={crop.variety}
                      onChange={(e) => updateCrop(index, 'variety', e.target.value)}
                    />
                    {farmData.crops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCrop(index)}
                        className="btn btn-secondary btn-sm"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCrop} className="btn btn-secondary btn-sm">
                + Add Crop
              </button>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(2)} className="btn btn-secondary">
                ← Back
              </button>
              <button type="submit" className="btn btn-primary">
                Next: Preferences →
              </button>
            </div>
          </form>
        );

      case 4:
        return (
          <form onSubmit={handleFinalSubmit}>
            <h2 className="text-xl font-bold mb-4">⚙️ Preferences & Notifications</h2>
            
            <div className="mb-4">
              <label className="mb-1 font-bold">Notification Preferences</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences?.notifications.sms}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        notifications: {
                          ...profileData.preferences!.notifications,
                          sms: e.target.checked
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  SMS Notifications
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences?.notifications.whatsapp}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        notifications: {
                          ...profileData.preferences!.notifications,
                          whatsapp: e.target.checked
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  WhatsApp Notifications
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences?.notifications.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        notifications: {
                          ...profileData.preferences!.notifications,
                          email: e.target.checked
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  Email Notifications
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.preferences?.notifications.push}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      preferences: {
                        ...profileData.preferences!,
                        notifications: {
                          ...profileData.preferences!.notifications,
                          push: e.target.checked
                        }
                      }
                    })}
                    className="mr-2"
                  />
                  Push Notifications
                </label>
              </div>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded">
              <h3 className="font-bold mb-2">🎯 What you'll get:</h3>
              <ul className="text-sm space-y-1">
                <li>• Personalized price alerts for your crops</li>
                <li>• Weather updates for your location</li>
                <li>• AI-powered farming recommendations</li>
                <li>• Market insights tailored to your needs</li>
                <li>• Voice assistant in your preferred language</li>
                <li>• Smart trading suggestions</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(profileData.type === 'farmer' ? 3 : 2)} className="btn btn-secondary">
                ← Back
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Complete Setup')}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {isEditing ? '✏️ Edit Profile' : '🚀 Welcome to MandiSense!'}
          </h1>
          <p className="text-gray">
            {isEditing ? 'Update your profile information' : 'Let\'s set up your profile to get personalized recommendations'}
          </p>
          
          {/* Progress indicator */}
          <div className="flex items-center mt-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNum ? 'bg-green text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    step > stepNum ? 'bg-green' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray mt-2">
            <span>Basic Info</span>
            <span>Location</span>
            <span>{profileData.type === 'farmer' ? 'Farm Details' : 'Skip'}</span>
            <span>Preferences</span>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

// Enhanced Analytics Page with User Data
const AnalyticsPage = () => {
  const [selectedMetric, setSelectedMetric] = useState('price-trends');
  const [timeframe, setTimeframe] = useState('30d');
  const [userAnalytics, setUserAnalytics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const currentUser = userProfileService.getCurrentUser();
  const userCrops = userProfileService.getUserCrops();
  const userLocation = userProfileService.getUserLocation();

  useEffect(() => {
    // Load user-specific analytics
    const analytics = userProfileService.getUserAnalytics();
    setUserAnalytics(analytics);

    // Get personalized recommendations
    const recs = userProfileService.getPersonalizedRecommendations();
    setRecommendations(recs);
  }, []);

  const analytics = {
    marketSummary: {
      totalVolume: '2.5M',
      avgPrice: '₹42.5',
      activeTraders: '15.2K',
      topCommodity: userCrops.length > 0 ? userCrops[0].name : 'Rice'
    },
    priceInsights: [
      { commodity: 'Tomatoes', prediction: '+15%', confidence: 85, trend: 'bullish' },
      { commodity: 'Onions', prediction: '-8%', confidence: 72, trend: 'bearish' },
      { commodity: 'Rice', prediction: '+5%', confidence: 91, trend: 'bullish' },
      { commodity: 'Wheat', prediction: '+2%', confidence: 68, trend: 'stable' },
    ].filter(insight => 
      userCrops.length === 0 || userCrops.some(crop => 
        crop.name.toLowerCase().includes(insight.commodity.toLowerCase())
      )
    ),
    topPerformers: [
      { commodity: 'Green Chilli', change: '+12.5%', volume: '4.2K' },
      { commodity: 'Tomatoes', change: '+8.3%', volume: '12.5K' },
      { commodity: 'Rice', change: '+5.1%', volume: '25.2K' },
    ],
    marketAlerts: [
      { 
        type: 'price-spike', 
        commodity: userCrops.length > 0 ? userCrops[0].name : 'Onions', 
        message: `Price increased by 15% in ${userLocation?.district || 'Gujarat'} markets`, 
        severity: 'high' 
      },
      { 
        type: 'supply-shortage', 
        commodity: 'Tomatoes', 
        message: `Low supply reported in ${userLocation?.state || 'Maharashtra'}`, 
        severity: 'medium' 
      },
      { type: 'demand-surge', commodity: 'Rice', message: 'High demand from export markets', severity: 'low' },
    ]
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Market Analytics</h1>
        <p className="text-gray">
          {currentUser ? `Personalized insights for ${currentUser.name}` : 'AI-powered insights and market intelligence'}
        </p>
        {userLocation && (
          <p className="text-sm text-gray">📍 {userLocation.district}, {userLocation.state}</p>
        )}
      </div>

      {/* User-specific recommendations */}
      {recommendations.length > 0 && (
        <div className="card mb-4 bg-blue-50">
          <h2 className="text-xl font-bold mb-4">🎯 Personalized Recommendations</h2>
          <div className="grid grid-2">
            {recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className={`p-3 rounded border-l-4 ${
                rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                'border-blue-400 bg-blue-50'
              }`}>
                <div className="font-bold">{rec.title}</div>
                <div className="text-sm text-gray">{rec.description}</div>
                <div className="text-xs text-gray mt-1">Priority: {rec.priority}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Analytics Dashboard */}
      {userAnalytics && (
        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-4">📊 Your Activity Analytics</h2>
          <div className="grid grid-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green">{userAnalytics.totalInputs}</div>
              <div className="text-gray">Total Interactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green">{userAnalytics.totalTransactions}</div>
              <div className="text-gray">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green">₹{userAnalytics.transactionVolume?.toLocaleString() || 0}</div>
              <div className="text-gray">Transaction Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green">{userAnalytics.peakHour || 9}:00</div>
              <div className="text-gray">Peak Activity Hour</div>
            </div>
          </div>
          
          {userAnalytics.mostUsedFeatures && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">🔥 Most Used Features</h3>
              <div className="flex gap-2 flex-wrap">
                {userAnalytics.mostUsedFeatures.map((feature: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analytics Controls */}
      <div className="card mb-4">
        <div className="grid grid-2">
          <div>
            <label className="mb-1 font-bold">Analytics View</label>
            <select
              className="input"
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="price-trends">Price Trends</option>
              <option value="volume-analysis">Volume Analysis</option>
              <option value="market-sentiment">Market Sentiment</option>
              <option value="predictions">AI Predictions</option>
              {userCrops.length > 0 && <option value="my-crops">My Crops Performance</option>}
            </select>
          </div>
          <div>
            <label className="mb-1 font-bold">Timeframe</label>
            <select
              className="input"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{analytics.marketSummary.totalVolume}</div>
          <div className="text-gray">Total Volume</div>
          <div className="text-sm text-gray">kg traded</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{analytics.marketSummary.avgPrice}</div>
          <div className="text-gray">Average Price</div>
          <div className="text-sm text-gray">across all commodities</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{analytics.marketSummary.activeTraders}</div>
          <div className="text-gray">Active Traders</div>
          <div className="text-sm text-gray">this month</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{analytics.marketSummary.topCommodity}</div>
          <div className="text-gray">Top Commodity</div>
          <div className="text-sm text-gray">by volume</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* AI Price Predictions */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🤖 AI Price Predictions</h2>
          {userCrops.length > 0 && (
            <div className="mb-3 text-sm text-blue-600">
              📌 Showing predictions for your crops
            </div>
          )}
          <div className="space-y-3">
            {analytics.priceInsights.map((insight, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold">
                    {insight.commodity}
                    {userCrops.some(crop => crop.name.toLowerCase().includes(insight.commodity.toLowerCase())) && 
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Your Crop</span>
                    }
                  </div>
                  <div className={`font-bold ${
                    insight.prediction.startsWith('+') ? 'text-green' : 'text-red-500'
                  }`}>
                    {insight.prediction}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray">Next 30 days</div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray">Confidence: {insight.confidence}%</div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      insight.trend === 'bullish' ? 'bg-green-100 text-green-700' :
                      insight.trend === 'bearish' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {insight.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📈 Top Performers</h2>
          <div className="space-y-3">
            {analytics.topPerformers.map((performer, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">
                      {performer.commodity}
                      {userCrops.some(crop => crop.name.toLowerCase().includes(performer.commodity.toLowerCase())) && 
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Your Crop</span>
                      }
                    </div>
                    <div className="text-sm text-gray">Volume: {performer.volume} kg</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green">{performer.change}</div>
                    <div className="text-sm text-gray">30 days</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Alerts */}
      <div className="card mt-4">
        <h2 className="text-xl font-bold mb-4">🚨 Market Alerts</h2>
        <div className="space-y-3">
          {analytics.marketAlerts.map((alert, index) => (
            <div key={index} className={`border rounded p-3 ${
              alert.severity === 'high' ? 'border-red-300 bg-red-50' :
              alert.severity === 'medium' ? 'border-yellow-300 bg-yellow-50' :
              'border-blue-300 bg-blue-50'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold">
                    {alert.commodity}
                    {userCrops.some(crop => crop.name.toLowerCase().includes(alert.commodity.toLowerCase())) && 
                      <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Your Crop</span>
                    }
                  </div>
                  <div className="text-sm">{alert.message}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-blue-200 text-blue-800'
                }`}>
                  {alert.severity.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Advanced Blockchain & Smart Contracts Page
const BlockchainPage = () => {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [contracts, setContracts] = useState<SmartContract[]>([]);
  const [supplyChain, setSupplyChain] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      // Load sample blockchain data
      const sampleTransactions = await Promise.all([
        blockchainService.createTransaction('trade', 'farmer_001', 'buyer_001', 50000, 'Tomatoes', 1000),
        blockchainService.createTransaction('payment', 'buyer_001', 'farmer_001', 50000, 'payment', 0),
      ]);
      
      const sampleContracts = await Promise.all([
        blockchainService.deploySmartContract('escrow', ['farmer_001', 'buyer_001'], { amount: 50000, commodity: 'Tomatoes' }),
        blockchainService.createCropInsurance('farmer_001', 'Tomatoes', 100000, 5000),
      ]);

      const supplyChainData = await blockchainService.trackSupplyChain('commodity_001');

      setTransactions(sampleTransactions);
      setContracts(sampleContracts);
      setSupplyChain(supplyChainData);
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEscrowContract = async () => {
    const contract = await blockchainService.deploySmartContract(
      'escrow',
      ['current_user', 'counterparty'],
      { amount: 75000, commodity: 'Rice', quantity: 1500 }
    );
    setContracts([contract, ...contracts]);
  };

  if (loading) {
    return <div className="text-center py-8"><div className="text-2xl">Loading blockchain data...</div></div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">🔗 Blockchain & Smart Contracts</h1>
        <p className="text-gray">Transparent, secure, and automated agricultural trading</p>
      </div>

      {/* Blockchain Stats */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{transactions.length}</div>
          <div className="text-gray">Total Transactions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{contracts.filter(c => c.status === 'active').length}</div>
          <div className="text-gray">Active Contracts</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">₹{transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</div>
          <div className="text-gray">Total Value Locked</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">99.9%</div>
          <div className="text-gray">Uptime</div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📊 Recent Transactions</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{tx.type.toUpperCase()}</div>
                    <div className="text-sm text-gray">{tx.commodity} - {tx.quantity}kg</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green">₹{tx.amount.toLocaleString()}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      tx.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray">
                  <div>From: {tx.from}</div>
                  <div>To: {tx.to}</div>
                  <div>Gas: {tx.gasUsed.toLocaleString()}</div>
                  <div>Hash: {tx.blockHash.substring(0, 20)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Contracts */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">📋 Smart Contracts</h2>
            <button onClick={createEscrowContract} className="btn btn-primary btn-sm">
              Create Escrow
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {contracts.map((contract) => (
              <div key={contract.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{contract.type.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-sm text-gray">{contract.parties.join(' ↔ ')}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    contract.status === 'active' ? 'bg-green-100 text-green-700' :
                    contract.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {contract.status}
                  </div>
                </div>
                <div className="text-xs text-gray">
                  <div>Auto-execute: {contract.autoExecute ? 'Yes' : 'No'}</div>
                  <div>Conditions: {contract.conditions.length}</div>
                  <div>Expires: {new Date(contract.expiresAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Supply Chain Tracking */}
      {supplyChain && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🚚 Supply Chain Tracking</h2>
          <div className="grid grid-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green">{supplyChain.qualityScore}%</div>
              <div className="text-gray">Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green">{supplyChain.carbonFootprint} kg</div>
              <div className="text-gray">Carbon Footprint</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green">{supplyChain.journey.length}</div>
              <div className="text-gray">Journey Steps</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {supplyChain.journey.map((step: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 p-3 border rounded">
                <div className="w-8 h-8 bg-green text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold">{step.stage}</div>
                  <div className="text-sm text-gray">{step.location} • {step.handler}</div>
                  <div className="text-xs text-gray">
                    {step.conditions.temperature}°C, {step.conditions.humidity}% humidity, {step.conditions.quality}
                  </div>
                </div>
                <div className="text-right text-sm text-gray">
                  {new Date(step.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Advanced IoT & Smart Farming Page
const IoTPage = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [irrigation, setIrrigation] = useState<SmartIrrigation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIoTData();
    
    // Simulate real-time sensor updates
    const interval = setInterval(() => {
      updateSensorData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadIoTData = async () => {
    setLoading(true);
    try {
      // Register sample IoT devices
      const sampleDevices = await Promise.all([
        iotService.registerDevice({
          name: 'Soil Sensor Alpha',
          type: 'soil_sensor',
          location: { farmId: 'farm_001', coordinates: [19.123, 73.456], zone: 'Field A' },
          status: 'online',
          batteryLevel: 85,
          firmware: 'v2.1.0'
        }),
        iotService.registerDevice({
          name: 'Weather Station Beta',
          type: 'weather_station',
          location: { farmId: 'farm_001', coordinates: [19.124, 73.457], zone: 'Central' },
          status: 'online',
          batteryLevel: 92,
          firmware: 'v1.8.0'
        }),
        iotService.registerDevice({
          name: 'Smart Camera Gamma',
          type: 'camera',
          location: { farmId: 'farm_001', coordinates: [19.125, 73.458], zone: 'Field B' },
          status: 'online',
          batteryLevel: 78,
          firmware: 'v3.0.0'
        })
      ]);

      const irrigationSystem = await iotService.getIrrigationSystem('farm_001');

      setDevices(sampleDevices);
      setIrrigation(irrigationSystem);
    } catch (error) {
      console.error('Failed to load IoT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSensorData = async () => {
    if (devices.length > 0) {
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      try {
        const newData = await iotService.collectSensorData(randomDevice.id);
        setSensorData(prev => [newData, ...prev.slice(0, 19)]); // Keep last 20 readings
      } catch (error) {
        console.error('Failed to collect sensor data:', error);
      }
    }
  };

  const controlIrrigation = async (zoneId: string, action: 'start' | 'stop') => {
    await iotService.controlIrrigation(zoneId, action, action === 'start' ? 15 : undefined);
    // Refresh irrigation data
    const updatedIrrigation = await iotService.getIrrigationSystem('farm_001');
    setIrrigation(updatedIrrigation);
  };

  if (loading) {
    return <div className="text-center py-8"><div className="text-2xl">Loading IoT systems...</div></div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">🌐 IoT Smart Farm Dashboard</h1>
        <p className="text-gray">Real-time monitoring and automated farm management</p>
      </div>

      {/* IoT Stats */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{devices.filter(d => d.status === 'online').length}</div>
          <div className="text-gray">Online Devices</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{sensorData.length}</div>
          <div className="text-gray">Data Points</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{irrigation?.efficiency.waterSaved || 0}%</div>
          <div className="text-gray">Water Saved</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{irrigation?.efficiency.yieldImprovement || 0}%</div>
          <div className="text-gray">Yield Improvement</div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        {/* Device Status */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📱 Connected Devices</h2>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{device.name}</div>
                    <div className="text-sm text-gray">{device.type.replace('_', ' ')} • {device.location.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded ${
                      device.status === 'online' ? 'bg-green-100 text-green-700' :
                      device.status === 'offline' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {device.status}
                    </div>
                    <div className="text-sm text-gray mt-1">🔋 {device.batteryLevel}%</div>
                  </div>
                </div>
                <div className="text-xs text-gray">
                  <div>Firmware: {device.firmware}</div>
                  <div>Last update: {new Date(device.lastUpdate).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Sensor Data */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">📊 Live Sensor Data</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sensorData.map((data, index) => (
              <div key={index} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">
                      {devices.find(d => d.id === data.deviceId)?.name || 'Unknown Device'}
                    </div>
                    <div className="text-sm text-gray">
                      {new Date(data.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="grid grid-2 text-sm">
                  {data.readings.soilMoisture && (
                    <div>Soil Moisture: {data.readings.soilMoisture.toFixed(1)}%</div>
                  )}
                  {data.readings.soilTemperature && (
                    <div>Soil Temp: {data.readings.soilTemperature.toFixed(1)}°C</div>
                  )}
                  {data.readings.airTemperature && (
                    <div>Air Temp: {data.readings.airTemperature.toFixed(1)}°C</div>
                  )}
                  {data.readings.humidity && (
                    <div>Humidity: {data.readings.humidity.toFixed(1)}%</div>
                  )}
                  {data.readings.soilPH && (
                    <div>Soil pH: {data.readings.soilPH.toFixed(1)}</div>
                  )}
                  {data.readings.lightIntensity && (
                    <div>Light: {(data.readings.lightIntensity / 1000).toFixed(1)}k lux</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Irrigation System */}
      {irrigation && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">💧 Smart Irrigation System</h2>
          <div className="grid grid-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green">{irrigation.efficiency.waterSaved}%</div>
              <div className="text-gray">Water Saved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green">{irrigation.efficiency.energySaved}%</div>
              <div className="text-gray">Energy Saved</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green">{irrigation.zones.length}</div>
              <div className="text-gray">Active Zones</div>
            </div>
          </div>

          <div className="grid grid-2">
            {irrigation.zones.map((zone) => (
              <div key={zone.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold">{zone.name}</div>
                    <div className="text-sm text-gray">{zone.cropType} • {zone.area} hectares</div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => controlIrrigation(zone.id, 'start')}
                      className="btn btn-primary btn-sm"
                    >
                      Start
                    </button>
                    <button 
                      onClick={() => controlIrrigation(zone.id, 'stop')}
                      className="btn btn-secondary btn-sm"
                    >
                      Stop
                    </button>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span>Soil Moisture</span>
                    <span>{zone.currentMoisture}% / {zone.targetMoisture}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green h-2 rounded-full" 
                      style={{ width: `${(zone.currentMoisture / zone.targetMoisture) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray">
                  <div>Last watered: {new Date(zone.lastWatered).toLocaleString()}</div>
                  <div>Water usage today: {zone.waterUsage}L</div>
                  <div>Next scheduled: {new Date(zone.nextScheduled).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Advanced AI Assistant Page
const AIPage = () => {
  const [predictions, setPredictions] = useState<PricePrediction | null>(null);
  const [yieldForecast, setYieldForecast] = useState<YieldForecast | null>(null);
  const [diseaseDetection, setDiseaseDetection] = useState<DiseaseDetection | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState('Tomatoes');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  useEffect(() => {
    loadAIData();
  }, [selectedCommodity]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      const [priceData, yieldData] = await Promise.all([
        aiService.predictPrices(selectedCommodity, 'Maharashtra'),
        aiService.forecastYield('farmer_001', selectedCommodity, 'Maharashtra')
      ]);

      setPredictions(priceData);
      setYieldForecast(yieldData);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        
        try {
          const detection = await aiService.detectDiseases(imageData, selectedCommodity);
          setDiseaseDetection(detection);
        } catch (error) {
          console.error('Failed to detect diseases:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="text-center py-8"><div className="text-2xl">AI is analyzing data...</div></div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">🤖 AI Assistant Dashboard</h1>
        <p className="text-gray">Advanced AI-powered insights and recommendations</p>
      </div>

      {/* AI Stats */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{predictions?.predictions.length || 0}</div>
          <div className="text-gray">Price Predictions</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{yieldForecast?.confidence.toFixed(0) || 0}%</div>
          <div className="text-gray">Forecast Accuracy</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{diseaseDetection?.healthScore || 95}%</div>
          <div className="text-gray">Crop Health Score</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">24/7</div>
          <div className="text-gray">AI Monitoring</div>
        </div>
      </div>

      {/* Commodity Selection */}
      <div className="card mb-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="mb-1 font-bold">Select Commodity for Analysis</label>
            <select
              className="input"
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="Tomatoes">Tomatoes</option>
              <option value="Onions">Onions</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Green Chilli">Green Chilli</option>
            </select>
          </div>
          <div>
            <label className="mb-1 font-bold">Upload Crop Image for Disease Detection</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input"
              style={{ width: '250px' }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        {/* AI Price Predictions */}
        {predictions && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">📈 AI Price Predictions</h2>
            <div className="mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green">₹{predictions.currentPrice.toFixed(1)}</div>
                <div className="text-gray">Current Price per kg</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {predictions.predictions.map((pred, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold">{pred.timeframe.toUpperCase()}</div>
                    <div className={`font-bold ${
                      pred.trend === 'bullish' ? 'text-green' :
                      pred.trend === 'bearish' ? 'text-red-500' :
                      'text-gray-600'
                    }`}>
                      ₹{pred.predictedPrice.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray">Confidence: {pred.confidence.toFixed(1)}%</div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      pred.trend === 'bullish' ? 'bg-green-100 text-green-700' :
                      pred.trend === 'bearish' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pred.trend.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-xs text-gray mt-1">
                    Key factors: {pred.factors.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h3 className="font-bold mb-2">🎯 Opportunities</h3>
              <ul className="text-sm space-y-1">
                {predictions.opportunities.map((opp, index) => (
                  <li key={index} className="text-green">• {opp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Yield Forecasting */}
        {yieldForecast && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">🌾 Yield Forecast</h2>
            <div className="mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green">{yieldForecast.predictedYield.toLocaleString()}</div>
                <div className="text-gray">Predicted Yield (kg)</div>
                <div className="text-sm text-gray">
                  Range: {yieldForecast.yieldRange.min.toLocaleString()} - {yieldForecast.yieldRange.max.toLocaleString()} kg
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-bold mb-2">📊 Contributing Factors</h3>
              <div className="space-y-2">
                {Object.entries(yieldForecast.factors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{factor}</span>
                      <span>{score.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green h-2 rounded-full" 
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">💡 AI Recommendations</h3>
              <div className="space-y-2">
                {yieldForecast.recommendations.map((rec, index) => (
                  <div key={index} className={`text-sm p-2 rounded ${
                    rec.priority === 'high' ? 'bg-red-50 border-l-4 border-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                    'bg-blue-50 border-l-4 border-blue-400'
                  }`}>
                    <div className="font-bold">{rec.category}: {rec.action}</div>
                    <div className="text-gray">{rec.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disease Detection */}
      {diseaseDetection && (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">🔬 AI Disease Detection Results</h2>
          <div className="grid grid-2">
            <div>
              {uploadedImage && (
                <div className="mb-4">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded crop" 
                    className="w-full h-48 object-cover rounded border"
                  />
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-green">{diseaseDetection.healthScore}%</div>
                <div className="text-gray">Overall Health Score</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">🦠 Detected Issues</h3>
              <div className="space-y-3">
                {diseaseDetection.detectedDiseases.map((disease, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold">{disease.name}</div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        disease.severity === 'critical' ? 'bg-red-200 text-red-800' :
                        disease.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                        disease.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {disease.severity.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm text-gray mb-2">
                      Confidence: {disease.confidence.toFixed(1)}%
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-bold">Treatment:</div>
                      <ul className="list-disc list-inside">
                        {disease.treatment.map((treatment, i) => (
                          <li key={i}>{treatment}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <h3 className="font-bold mb-2">📋 General Recommendations</h3>
                <ul className="text-sm space-y-1">
                  {diseaseDetection.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Advanced AI Chatbot & Voice Assistant Page
const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [chatMode, setChatMode] = useState<'text' | 'voice' | 'mixed'>('mixed');

  const currentUser = userProfileService.getCurrentUser();
  const userCrops = userProfileService.getUserCrops();
  const userLocation = userProfileService.getUserLocation();

  useEffect(() => {
    // Set user context for chatbot
    if (currentUser) {
      chatbotService.setUserContext({
        name: currentUser.name,
        type: currentUser.type,
        location: `${currentUser.location.district}, ${currentUser.location.state}`,
        crops: userCrops.map(c => c.name),
        experience: 'intermediate'
      });
    }

    // Initialize chatbot with personalized greeting
    const greeting = currentUser ? 
      chatbotService.getPersonalizedGreeting(currentLanguage) :
      "Hello! I'm your AI farming assistant. I can help you with crop advice, market prices, weather information, and trading guidance. What would you like to know?";
    
    const greetingMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      text: greeting,
      sender: 'bot',
      language: currentLanguage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages([greetingMessage]);

    // Check voice support
    setVoiceEnabled(voiceAssistantService.isVoiceSupported());
  }, [currentLanguage, currentUser]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setIsProcessing(true);

    try {
      // Record user input
      if (currentUser) {
        userProfileService.recordUserInput('chat_message', inputMessage, 'manual');
      }

      // Process message with chatbot
      const response = await chatbotService.processMessage(inputMessage, currentLanguage);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        text: inputMessage,
        sender: 'user',
        language: currentLanguage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage, response]);

      // Speak response if voice is enabled
      if (voiceEnabled && (chatMode === 'voice' || chatMode === 'mixed')) {
        await voiceAssistantService.speak(response.text, currentLanguage);
      }

      setInputMessage('');
    } catch (error) {
      console.error('Failed to process message:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = async () => {
    if (!voiceEnabled) return;

    setIsListening(true);
    setIsProcessing(true);

    try {
      // Start voice recognition
      const voiceCommand = await voiceAssistantService.startListening(currentLanguage);
      
      // Record voice input
      if (currentUser) {
        userProfileService.recordUserInput('voice_command', voiceCommand.text, 'voice');
      }
      
      // Process voice command
      const voiceResponse = await voiceAssistantService.processVoiceCommand(voiceCommand);
      
      // Add voice messages to chat
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_user`,
        text: voiceCommand.text,
        sender: 'user',
        language: currentLanguage,
        timestamp: new Date().toISOString(),
        type: 'voice',
        metadata: { confidence: voiceCommand.confidence, intent: voiceCommand.intent }
      };

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        text: voiceResponse.text,
        sender: 'bot',
        language: currentLanguage,
        timestamp: new Date().toISOString(),
        type: 'voice'
      };

      setMessages(prev => [...prev, userMessage, botMessage]);

      // Speak response
      await voiceAssistantService.speak(voiceResponse.text, currentLanguage);

    } catch (error) {
      console.error('Voice processing failed:', error);
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        text: "I'm sorry, I couldn't understand that. Please try again.",
        sender: 'bot',
        language: currentLanguage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        
        // Record image upload
        if (currentUser) {
          userProfileService.recordUserInput('image_upload', 'disease_detection_image', 'manual');
        }
        
        // Process image with chatbot
        const response = await chatbotService.processImageMessage(imageData, currentLanguage);
        
        // Add image message
        const imageMessage: ChatMessage = {
          id: `msg_${Date.now()}_user`,
          text: 'Uploaded image for disease detection',
          sender: 'user',
          language: currentLanguage,
          timestamp: new Date().toISOString(),
          type: 'image',
          metadata: { imageData }
        };

        setMessages(prev => [...prev, imageMessage, response]);

        // Speak response if voice enabled
        if (voiceEnabled && (chatMode === 'voice' || chatMode === 'mixed')) {
          await voiceAssistantService.speak(response.text, currentLanguage);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    chatbotService.clearConversation();
    
    // Add new personalized greeting
    const greeting = currentUser ? 
      chatbotService.getPersonalizedGreeting(currentLanguage) :
      "Hello! I'm your AI farming assistant. How can I help you today?";
    
    const greetingMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      text: greeting,
      sender: 'bot',
      language: currentLanguage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    setMessages([greetingMessage]);
  };

  // Generate personalized quick actions based on user data
  const getPersonalizedQuickActions = (): { text: string; label: string }[] => {
    const actions: { text: string; label: string }[] = [];
    
    if (userCrops.length > 0) {
      actions.push({
        text: `What's the price of ${userCrops[0].name}?`,
        label: `💰 ${userCrops[0].name} Price`
      });
      actions.push({
        text: `How to improve ${userCrops[0].name} yield?`,
        label: `🌱 ${userCrops[0].name} Tips`
      });
    } else {
      actions.push({
        text: 'What are today\'s tomato prices?',
        label: '💰 Check Prices'
      });
      actions.push({
        text: 'How do I grow tomatoes?',
        label: '🌱 Crop Advice'
      });
    }

    if (userLocation) {
      actions.push({
        text: `Weather forecast for ${userLocation.district}`,
        label: `🌤️ ${userLocation.district} Weather`
      });
    } else {
      actions.push({
        text: 'What\'s the weather forecast?',
        label: '🌤️ Weather'
      });
    }

    actions.push({
      text: 'Help me place a trade order',
      label: '📈 Trading Help'
    });

    return actions;
  };

  const quickActions = getPersonalizedQuickActions();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">💬 AI Chatbot & Voice Assistant</h1>
        <p className="text-gray">
          {currentUser ? 
            `Intelligent farming assistant for ${currentUser.name} with voice support in native languages` :
            'Intelligent farming assistant with voice support in native languages'
          }
        </p>
        {userLocation && (
          <p className="text-sm text-gray">📍 {userLocation.district}, {userLocation.state}</p>
        )}
        {userCrops.length > 0 && (
          <p className="text-sm text-gray">🌾 Your crops: {userCrops.map(c => c.name).join(', ')}</p>
        )}
      </div>

      {/* Chat Controls */}
      <div className="card mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <div>
              <label className="mb-1 font-bold">Language</label>
              <select
                className="input"
                value={currentLanguage}
                onChange={(e) => {
                  setCurrentLanguage(e.target.value);
                  if (currentUser) {
                    userProfileService.updatePreferences({ language: e.target.value });
                  }
                }}
                style={{ width: '150px' }}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="mb-1 font-bold">Chat Mode</label>
              <select
                className="input"
                value={chatMode}
                onChange={(e) => setChatMode(e.target.value as any)}
                style={{ width: '120px' }}
              >
                <option value="mixed">Mixed</option>
                <option value="text">Text Only</option>
                <option value="voice">Voice Only</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={clearChat} className="btn btn-secondary btn-sm">
              🗑️ Clear Chat
            </button>
            <div className={`px-3 py-1 rounded text-sm ${
              voiceEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              🎤 Voice {voiceEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="card mb-4" style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-green text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </span>
                  {message.type === 'voice' && <span className="text-xs">🎤</span>}
                  {message.type === 'image' && <span className="text-xs">📷</span>}
                  <span className="text-xs opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="whitespace-pre-wrap">{message.text}</div>
                
                {message.metadata?.confidence && (
                  <div className="text-xs opacity-75 mt-1">
                    Confidence: {(message.metadata.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-green border-t-transparent rounded-full"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 input"
              placeholder={`Type your message in ${SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessing}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isProcessing || !inputMessage.trim()}
              className="btn btn-primary"
            >
              📤 Send
            </button>
            
            {voiceEnabled && (
              <button
                onClick={handleVoiceInput}
                disabled={isProcessing}
                className={`btn ${isListening ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isListening ? '🔴 Listening...' : '🎤 Voice'}
              </button>
            )}
            
            <label className="btn btn-secondary cursor-pointer">
              📷 Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>
          
          <div className="text-xs text-gray mt-2">
            💡 Try asking: "What's the price of tomatoes?", "How to grow onions?", "Weather forecast", or upload crop images for disease detection
          </div>
        </div>
      </div>

      {/* Personalized Quick Actions */}
      <div className="card">
        <h3 className="font-bold mb-2">🚀 Quick Actions {currentUser && '(Personalized)'}</h3>
        <div className="grid grid-4 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(action.text)}
              className="btn btn-secondary btn-sm"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const t = (key: string) => languageService.translate(key);

  // Get user context for personalized content
  const currentUser = userProfileService.getCurrentUser();
  const userCrops = userProfileService.getUserCrops();
  const userLocation = userProfileService.getUserLocation();

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold mb-2">{t('home.welcome')}</h1>
        <p className="text-gray">{t('home.subtitle')}</p>
        {currentUser && (
          <p className="text-sm text-green mt-2">
            👋 Welcome back, {currentUser.name}!
          </p>
        )}
      </div>
      
      {userCrops.length > 0 && (
        <div className="card mb-4 bg-green-50">
          <h3 className="font-bold mb-2">🌾 Your Crops</h3>
          <div className="flex gap-2 flex-wrap">
            {userCrops.map((crop, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {crop.name} ({crop.area} acres)
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <h3 className="text-lg font-bold mb-2 text-green">📊 {t('home.liveprices')}</h3>
          <p className="text-gray">{t('home.liveprices.desc')}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-bold mb-2 text-green">🤝 {t('home.smarttrading')}</h3>
          <p className="text-gray">{t('home.smarttrading.desc')}</p>
        </div>
        <div className="card text-center">
          <h3 className="text-lg font-bold mb-2 text-green">📈 {t('home.analytics')}</h3>
          <p className="text-gray">{t('home.analytics.desc')}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-2">{t('home.quickstats')}</h2>
        <div className="grid grid-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green">500+</div>
            <div className="text-gray">{t('home.markets')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green">50K+</div>
            <div className="text-gray">{t('home.traders')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green">100+</div>
            <div className="text-gray">{t('home.commodities')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green">24/7</div>
            <div className="text-gray">{t('home.support')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketPage = () => {
  const [markets, setMarkets] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterLocation, setFilterLocation] = useState('all');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);

  const t = (key: string) => languageService.translate(key);

  // Load real market data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [marketData, weatherData, newsData] = await Promise.all([
          realDataService.getMarketPrices(),
          realDataService.getWeatherData('Maharashtra'),
          realDataService.getMarketNews()
        ]);
        setMarkets(marketData);
        setWeather(weatherData);
        setNews(newsData);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = realDataService.subscribeToRealTimeUpdates((updatedPrices) => {
      setMarkets(updatedPrices);
    });

    return unsubscribe;
  }, []);

  const locations = ['all', ...Array.from(new Set(markets.map(m => m.location)))];
  
  const filteredMarkets = markets
    .filter(item => 
      item.commodity.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterLocation === 'all' || item.location === filterLocation)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price': return b.price - a.price;
        case 'change': return b.changePercent - a.changePercent;
        case 'volume': return parseFloat(b.volume.replace(/,/g, '')) - parseFloat(a.volume.replace(/,/g, ''));
        default: return a.commodity.localeCompare(b.commodity);
      }
    });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{t('market.title')}</h1>
        <p className="text-gray">{t('market.subtitle')}</p>
      </div>

      {/* Weather & News Banner */}
      {weather && (
        <div className="card mb-4 bg-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">🌤️ Weather Impact - {weather.location}</h3>
              <p className="text-sm">
                {weather.temperature}°C, {weather.humidity}% humidity, {weather.forecast}
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  weather.impact === 'positive' ? 'bg-green-100 text-green-700' :
                  weather.impact === 'negative' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {weather.impact} impact
                </span>
              </p>
            </div>
            {news.length > 0 && (
              <div className="text-right">
                <div className="text-sm font-bold">📰 Latest: {news[0].title.substring(0, 50)}...</div>
                <div className="text-xs text-gray">{news[0].source}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card mb-4">
        <div className="grid grid-3">
          <div>
            <label className="mb-1 font-bold">{t('market.search')}</label>
            <input
              type="text"
              className="input"
              placeholder={t('market.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 font-bold">{t('market.filter.location')}</label>
            <select
              className="input"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              {locations.map(location => (
                <option key={location} value={location}>
                  {location === 'all' ? t('market.filter.all') : location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 font-bold">{t('market.sort')}</label>
            <select
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">{t('market.sort.name')}</option>
              <option value="price">{t('market.sort.price')}</option>
              <option value="change">{t('market.sort.change')}</option>
              <option value="volume">{t('market.sort.volume')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{filteredMarkets.length}</div>
          <div className="text-gray">{t('market.active')}</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">
            {filteredMarkets.filter(m => m.changePercent > 0).length}
          </div>
          <div className="text-gray">{t('market.trending')}</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">
            ₹{Math.round(filteredMarkets.reduce((acc, m) => acc + m.price, 0) / filteredMarkets.length)}
          </div>
          <div className="text-gray">{t('market.avgprice')}</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">
            {filteredMarkets.reduce((acc, m) => acc + parseFloat(m.volume.replace(/,/g, '')), 0).toLocaleString()}
          </div>
          <div className="text-gray">{t('market.totalvolume')}</div>
        </div>
      </div>

      {/* Market Cards */}
      <div className="grid grid-3">
        {filteredMarkets.map((item, index) => (
          <div key={index} className="card">
            <div className="mb-2">
              <h3 className="text-lg font-bold">{item.commodity}</h3>
              <p className="text-gray">{item.location} • {item.market}</p>
              <p className="text-xs text-gray">{item.quality} • {new Date(item.timestamp).toLocaleTimeString()}</p>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-bold text-green">₹{item.price.toFixed(1)}</span>
              <span className="text-gray"> {t('market.perkg')}</span>
            </div>
            <div className={`font-bold mb-2 ${item.changePercent >= 0 ? 'text-green' : 'text-red-500'}`}>
              {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
            </div>
            <div className="text-sm text-gray">
              <div>{t('market.volume')}: {item.volume} {item.unit}</div>
              <div>{t('market.high')}: ₹{item.high24h} | {t('market.low')}: ₹{item.low24h}</div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary btn-sm">{t('market.viewdetails')}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PricesPage = () => {
  const [selectedCommodity, setSelectedCommodity] = useState('tomatoes');
  const [timeRange, setTimeRange] = useState('7d');
  const [alerts, setAlerts] = useState<any[]>([]);
  const [newAlert, setNewAlert] = useState({ commodity: 'tomatoes', condition: 'above', price: '' });
  
  const currentUser = userProfileService.getCurrentUser();
  const userCrops = userProfileService.getUserCrops();
  const userAlerts = userProfileService.getPriceAlerts();

  useEffect(() => {
    // Load user's existing price alerts
    setAlerts(userAlerts.map(alert => ({
      commodity: alert.commodity,
      condition: alert.minPrice ? 'above' : 'below',
      price: alert.minPrice || alert.maxPrice,
      active: alert.active
    })));
  }, []);
  
  const commodities = {
    tomatoes: {
      name: 'Tomatoes',
      currentPrice: 45.2,
      change: 2.5,
      volume: '12.5K',
      high24h: 48.0,
      low24h: 42.1,
      history: [
        { date: '2024-01-01', price: 42, volume: 10.2 },
        { date: '2024-01-02', price: 44, volume: 11.5 },
        { date: '2024-01-03', price: 45, volume: 12.1 },
        { date: '2024-01-04', price: 43, volume: 9.8 },
        { date: '2024-01-05', price: 45.2, volume: 12.5 },
      ]
    },
    onions: {
      name: 'Onions',
      currentPrice: 38.5,
      change: -1.2,
      volume: '8.3K',
      high24h: 41.0,
      low24h: 36.2,
      history: [
        { date: '2024-01-01', price: 40, volume: 8.1 },
        { date: '2024-01-02', price: 39, volume: 7.9 },
        { date: '2024-01-03', price: 38, volume: 8.5 },
        { date: '2024-01-04', price: 39, volume: 8.2 },
        { date: '2024-01-05', price: 38.5, volume: 8.3 },
      ]
    },
    potatoes: {
      name: 'Potatoes',
      currentPrice: 28.8,
      change: 0.8,
      volume: '15.7K',
      high24h: 30.1,
      low24h: 26.5,
      history: [
        { date: '2024-01-01', price: 28, volume: 15.1 },
        { date: '2024-01-02', price: 29, volume: 16.2 },
        { date: '2024-01-03', price: 28.5, volume: 15.8 },
        { date: '2024-01-04', price: 28.2, volume: 14.9 },
        { date: '2024-01-05', price: 28.8, volume: 15.7 },
      ]
    }
  };

  // Add user's crops to commodities if not already present
  const availableCommodities = { ...commodities };
  userCrops.forEach(crop => {
    const cropKey = crop.name.toLowerCase().replace(/\s+/g, '');
    if (!availableCommodities[cropKey]) {
      availableCommodities[cropKey] = {
        name: crop.name,
        currentPrice: 35 + Math.random() * 20, // Simulate price
        change: (Math.random() - 0.5) * 10,
        volume: `${(Math.random() * 20 + 5).toFixed(1)}K`,
        high24h: 40 + Math.random() * 15,
        low24h: 25 + Math.random() * 10,
        history: Array.from({ length: 5 }, (_, i) => ({
          date: new Date(Date.now() - (4 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: 30 + Math.random() * 15,
          volume: Math.random() * 20 + 5
        }))
      };
    }
  });

  const currentData = availableCommodities[selectedCommodity as keyof typeof availableCommodities];
  const weeklyAvg = currentData.history.reduce((acc, day) => acc + day.price, 0) / currentData.history.length;

  const addAlert = async () => {
    if (newAlert.price && currentUser) {
      try {
        await userProfileService.addPriceAlert({
          commodity: newAlert.commodity,
          minPrice: newAlert.condition === 'above' ? parseFloat(newAlert.price) : 0,
          maxPrice: newAlert.condition === 'below' ? parseFloat(newAlert.price) : 999999
        });

        const updatedAlert = {
          commodity: newAlert.commodity,
          condition: newAlert.condition as 'above' | 'below',
          price: parseFloat(newAlert.price),
          active: true
        };

        setAlerts([...alerts, updatedAlert]);
        setNewAlert({ commodity: 'tomatoes', condition: 'above', price: '' });
        
        // Record user input
        userProfileService.recordUserInput('price_alert_created', updatedAlert, 'form');
        
        alert('Price alert created successfully!');
      } catch (error) {
        console.error('Failed to create price alert:', error);
        alert('Failed to create price alert. Please try again.');
      }
    } else if (!currentUser) {
      alert('Please complete your profile setup to create price alerts');
    }
  };

  const toggleAlert = (index: number) => {
    const updatedAlerts = alerts.map((alert, i) => 
      i === index ? { ...alert, active: !alert.active } : alert
    );
    setAlerts(updatedAlerts);
    
    // Record user input
    if (currentUser) {
      userProfileService.recordUserInput('price_alert_toggled', {
        alert: updatedAlerts[index],
        action: updatedAlerts[index].active ? 'enabled' : 'disabled'
      }, 'manual');
    }
  };

  // Get commodity suggestions based on user crops
  const getCommodityOptions = (): { key: string; name: string; isUserCrop: boolean }[] => {
    const options: { key: string; name: string; isUserCrop: boolean }[] = [];
    
    // Add user's crops first
    userCrops.forEach(crop => {
      const cropKey = crop.name.toLowerCase().replace(/\s+/g, '');
      options.push({ key: cropKey, name: crop.name, isUserCrop: true });
    });
    
    // Add standard commodities
    Object.entries(commodities).forEach(([key, data]) => {
      if (!options.find(opt => opt.key === key)) {
        options.push({ key, name: data.name, isUserCrop: false });
      }
    });
    
    return options;
  };

  const commodityOptions = getCommodityOptions();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Advanced Price Tracker</h1>
        <p className="text-gray">
          {currentUser ? `Personalized price tracking for ${currentUser.name}` : 'Track commodity prices with alerts and analytics'}
        </p>
        {userCrops.length > 0 && (
          <p className="text-sm text-gray">🌾 Your crops: {userCrops.map(c => c.name).join(', ')}</p>
        )}
      </div>

      {/* Controls */}
      <div className="card mb-4">
        <div className="grid grid-2">
          <div>
            <label className="mb-1 font-bold">Select Commodity:</label>
            <select 
              className="input"
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
            >
              {commodityOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.name} {option.isUserCrop && '(Your Crop)'}
                </option>
              ))}
            </select>
            {userCrops.some(crop => crop.name.toLowerCase().replace(/\s+/g, '') === selectedCommodity) && (
              <div className="text-xs text-blue-600 mt-1">
                💡 This is one of your crops - track it closely for best selling opportunities!
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 font-bold">Time Range:</label>
            <select 
              className="input"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current Price Overview */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">₹{currentData.currentPrice.toFixed(1)}</div>
          <div className="text-gray">Current Price</div>
          <div className={`font-bold ${currentData.change >= 0 ? 'text-green' : 'text-red-500'}`}>
            {currentData.change >= 0 ? '+' : ''}{currentData.change.toFixed(1)}%
          </div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold">₹{weeklyAvg.toFixed(2)}</div>
          <div className="text-gray">Weekly Average</div>
          <div className="text-sm text-gray">Last 7 days</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold text-green">₹{currentData.high24h.toFixed(1)}</div>
          <div className="text-gray">24h High</div>
          <div className="text-xl font-bold" style={{color: '#ef4444'}}>₹{currentData.low24h.toFixed(1)}</div>
          <div className="text-gray">24h Low</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold">{currentData.volume}</div>
          <div className="text-gray">Volume</div>
          <div className="text-sm text-gray">kg traded</div>
        </div>
      </div>

      {/* Price History Chart (Simple) */}
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Price History - {currentData.name}</h2>
        <div className="grid grid-5">
          {currentData.history.map((day, index) => (
            <div key={index} className="text-center p-2 border rounded">
              <div className="text-sm text-gray">{new Date(day.date).toLocaleDateString()}</div>
              <div className="font-bold text-green">₹{day.price.toFixed(1)}</div>
              <div className="text-xs text-gray">{day.volume.toFixed(1)}K kg</div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Alerts */}
      <div className="grid grid-2">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            Create Price Alert {currentUser && '(Personalized)'}
          </h2>
          {!currentUser && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-sm text-yellow-800">
                💡 Complete your profile setup to create personalized price alerts with notifications
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="mb-1 font-bold">Commodity</label>
            <select
              className="input"
              value={newAlert.commodity}
              onChange={(e) => setNewAlert({...newAlert, commodity: e.target.value})}
            >
              {commodityOptions.map(option => (
                <option key={option.key} value={option.key}>
                  {option.name} {option.isUserCrop && '(Your Crop)'}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 font-bold">Condition</label>
            <select
              className="input"
              value={newAlert.condition}
              onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
            >
              <option value="above">Price goes above</option>
              <option value="below">Price goes below</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="mb-1 font-bold">Price (₹/kg)</label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={newAlert.price}
              onChange={(e) => setNewAlert({...newAlert, price: e.target.value})}
              placeholder="Enter price"
            />
            {newAlert.commodity && availableCommodities[newAlert.commodity] && (
              <div className="text-xs text-gray mt-1">
                Current price: ₹{availableCommodities[newAlert.commodity].currentPrice.toFixed(1)}/kg
              </div>
            )}
          </div>
          <button 
            onClick={addAlert} 
            className="btn btn-primary"
            disabled={!currentUser}
          >
            {currentUser ? 'Create Alert' : 'Complete Profile to Create Alerts'}
          </button>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">
            {currentUser ? 'Your Price Alerts' : 'Active Alerts'}
          </h2>
          {alerts.length === 0 ? (
            <p className="text-gray">
              {currentUser ? 'No alerts created yet' : 'Complete profile setup to create personalized alerts'}
            </p>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">
                        {alert.commodity}
                        {userCrops.some(crop => crop.name.toLowerCase().includes(alert.commodity.toLowerCase())) && 
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Your Crop</span>
                        }
                      </div>
                      <div className="text-sm text-gray">
                        Alert when price goes {alert.condition} ₹{alert.price}
                      </div>
                      {currentUser && currentUser.preferences.notifications.sms && (
                        <div className="text-xs text-gray">📱 SMS notifications enabled</div>
                      )}
                    </div>
                    <button
                      onClick={() => toggleAlert(index)}
                      className={`btn btn-sm ${alert.active ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {alert.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentUser && alerts.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-sm text-green-800">
                ✅ Alerts will be sent via your preferred notification methods:
                <div className="mt-1">
                  {currentUser.preferences.notifications.sms && '📱 SMS '}
                  {currentUser.preferences.notifications.whatsapp && '💬 WhatsApp '}
                  {currentUser.preferences.notifications.email && '📧 Email '}
                  {currentUser.preferences.notifications.push && '🔔 Push '}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TradePage = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [formData, setFormData] = useState({
    commodity: '',
    quantity: '',
    price: '',
    location: '',
    type: 'buy',
    orderType: 'market', // market, limit, stop
    validUntil: '1d'
  });
  const [trades, setTrades] = useState([
    { id: 1, commodity: 'Tomatoes', quantity: 500, price: 45, location: 'Maharashtra', type: 'sell', status: 'active', time: '2 hours ago', orderId: 'ORD001' },
    { id: 2, commodity: 'Onions', quantity: 1000, price: 38, location: 'Gujarat', type: 'buy', status: 'completed', time: '4 hours ago', orderId: 'ORD002' },
    { id: 3, commodity: 'Rice', quantity: 2000, price: 52, location: 'Andhra Pradesh', type: 'sell', status: 'active', time: '6 hours ago', orderId: 'ORD003' },
    { id: 4, commodity: 'Wheat', quantity: 1500, price: 35, location: 'Madhya Pradesh', type: 'buy', status: 'pending', time: '8 hours ago', orderId: 'ORD004' },
  ]);
  const [negotiations, setNegotiations] = useState([
    { id: 1, commodity: 'Tomatoes', buyer: 'Raj Traders', seller: 'Farm Fresh Co.', quantity: 500, originalPrice: 45, currentPrice: 43, status: 'negotiating', messages: 3 },
    { id: 2, commodity: 'Onions', buyer: 'City Markets', seller: 'Gujarat Farms', quantity: 800, originalPrice: 38, currentPrice: 36, status: 'accepted', messages: 5 },
  ]);
  const [marketData, setMarketData] = useState<MarketPrice[]>([]);
  const [realTimeOrders, setRealTimeOrders] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  const currentUser = userProfileService.getCurrentUser();
  const userCrops = userProfileService.getUserCrops();
  const userLocation = userProfileService.getUserLocation();

  const t = (key: string) => languageService.translate(key);

  // Load real market data for trading and user transactions
  useEffect(() => {
    const loadMarketData = async () => {
      try {
        const data = await realDataService.getMarketPrices();
        setMarketData(data);
      } catch (error) {
        console.error('Failed to load market data for trading:', error);
      }
    };

    // Load user transactions
    const transactions = userProfileService.getUserTransactions();
    setUserTransactions(transactions);

    // Set default location from user profile
    if (userLocation && !formData.location) {
      setFormData(prev => ({ ...prev, location: `${userLocation.district}, ${userLocation.state}` }));
    }

    loadMarketData();

    // Real-time order book updates
    const interval = setInterval(() => {
      // Simulate real-time order matching
      setRealTimeOrders(prev => [
        ...prev.slice(-10), // Keep last 10 orders
        {
          id: Date.now(),
          commodity: ['Tomatoes', 'Onions', 'Rice'][Math.floor(Math.random() * 3)],
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          quantity: Math.floor(Math.random() * 1000) + 100,
          price: Math.floor(Math.random() * 50) + 20,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [userLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please complete your profile setup to place orders');
      return;
    }
    
    // Real order processing simulation
    const newTrade = {
      id: trades.length + 1,
      commodity: formData.commodity,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      location: formData.location,
      type: activeTab as 'buy' | 'sell',
      status: 'pending' as const,
      time: 'Just now',
      orderId: `ORD${String(trades.length + 1).padStart(3, '0')}`
    };

    setTrades([newTrade, ...trades]);

    // Record transaction in user profile
    try {
      const transaction = await userProfileService.recordTransaction({
        type: activeTab as 'buy' | 'sell',
        commodity: formData.commodity,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        amount: parseInt(formData.quantity) * parseFloat(formData.price),
        status: 'pending',
        counterparty: 'Market',
        paymentMethod: 'wallet'
      });

      setUserTransactions(prev => [transaction, ...prev]);

      // Record user input
      userProfileService.recordUserInput('trade_order', {
        type: activeTab,
        commodity: formData.commodity,
        quantity: formData.quantity,
        price: formData.price,
        orderType: formData.orderType
      }, 'form');

    } catch (error) {
      console.error('Failed to record transaction:', error);
    }
    
    // Simulate order processing
    setTimeout(() => {
      setTrades(prev => prev.map(trade => 
        trade.id === newTrade.id 
          ? { ...trade, status: 'active' as const }
          : trade
      ));
    }, 2000);

    setFormData({ 
      commodity: '', 
      quantity: '', 
      price: '', 
      location: userLocation ? `${userLocation.district}, ${userLocation.state}` : '', 
      type: activeTab,
      orderType: 'market',
      validUntil: '1d'
    });
    
    alert(`${activeTab === 'buy' ? 'Buy' : 'Sell'} order submitted for processing!`);
  };

  const totalValue = formData.quantity && formData.price ? 
    (parseInt(formData.quantity) * parseFloat(formData.price)).toFixed(2) : '0';

  const currentMarketPrice = marketData.find(m => m.commodity === formData.commodity)?.price || 0;
  const priceImpact = formData.price && currentMarketPrice ? 
    (((parseFloat(formData.price) - currentMarketPrice) / currentMarketPrice) * 100).toFixed(2) : '0';

  // Get user's crop suggestions for commodity dropdown
  const getCommoditySuggestions = (): { name: string; source: string }[] => {
    const suggestions: { name: string; source: string }[] = [];
    
    // Add user's crops first
    userCrops.forEach(crop => {
      suggestions.push({ name: crop.name, source: 'your_crop' });
    });
    
    // Add market data
    marketData.forEach(item => {
      if (!suggestions.find(s => s.name === item.commodity)) {
        suggestions.push({ name: item.commodity, source: 'market' });
      }
    });
    
    return suggestions;
  };

  const commoditySuggestions = getCommoditySuggestions();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{t('trade.title')}</h1>
        <p className="text-gray">
          {currentUser ? `Trading for ${currentUser.name}` : t('trade.subtitle')}
        </p>
        {userLocation && (
          <p className="text-sm text-gray">📍 {userLocation.district}, {userLocation.state}</p>
        )}
        {userCrops.length > 0 && (
          <p className="text-sm text-gray">🌾 Your crops: {userCrops.map(c => c.name).join(', ')}</p>
        )}
      </div>

      {/* Enhanced Trading Stats with User Data */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{trades.filter(t => t.status === 'active').length}</div>
          <div className="text-gray">Active Orders</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{userTransactions.filter(t => t.status === 'completed').length}</div>
          <div className="text-gray">Completed</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{negotiations.filter(n => n.status === 'negotiating').length}</div>
          <div className="text-gray">Negotiations</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">₹{userTransactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</div>
          <div className="text-gray">Your Volume</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Enhanced Order Creation with User Context */}
        <div className="card">
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('buy')}
                className={`btn ${activeTab === 'buy' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t('trade.buyorder')}
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`btn ${activeTab === 'sell' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {t('trade.sellorder')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-1 font-bold">{t('trade.commodity')}</label>
              <select 
                className="input"
                value={formData.commodity}
                onChange={(e) => setFormData({...formData, commodity: e.target.value})}
                required
              >
                <option value="">Select commodity</option>
                {commoditySuggestions.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name} 
                    {item.source === 'your_crop' && ' (Your Crop)'}
                    {marketData.find(m => m.commodity === item.name) && 
                      ` (₹${marketData.find(m => m.commodity === item.name)?.price.toFixed(1)}/kg)`
                    }
                  </option>
                ))}
              </select>
              {formData.commodity && userCrops.some(crop => crop.name === formData.commodity) && (
                <div className="text-xs text-blue-600 mt-1">
                  💡 This is one of your crops - you can sell directly!
                </div>
              )}
            </div>

            <div className="grid grid-2 mb-4">
              <div>
                <label className="mb-1 font-bold">Order Type</label>
                <select
                  className="input"
                  value={formData.orderType}
                  onChange={(e) => setFormData({...formData, orderType: e.target.value})}
                >
                  <option value="market">Market Order</option>
                  <option value="limit">Limit Order</option>
                  <option value="stop">Stop Order</option>
                </select>
              </div>
              <div>
                <label className="mb-1 font-bold">Valid Until</label>
                <select
                  className="input"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                >
                  <option value="1d">1 Day</option>
                  <option value="3d">3 Days</option>
                  <option value="1w">1 Week</option>
                  <option value="1m">1 Month</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="mb-1 font-bold">{t('trade.quantity')}</label>
              <input 
                type="number"
                className="input"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                placeholder="Enter quantity"
                required
              />
              {formData.commodity && userCrops.find(crop => crop.name === formData.commodity) && (
                <div className="text-xs text-gray mt-1">
                  📊 Your {formData.commodity} area: {userCrops.find(crop => crop.name === formData.commodity)?.area} acres
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="mb-1 font-bold">{t('trade.price')}</label>
              <input 
                type="number"
                step="0.1"
                className="input"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder={currentMarketPrice ? `Market: ₹${currentMarketPrice.toFixed(1)}` : "Enter price"}
                required
              />
              {priceImpact !== '0' && (
                <div className={`text-xs mt-1 ${parseFloat(priceImpact) > 0 ? 'text-green' : 'text-red-500'}`}>
                  Price impact: {priceImpact}% vs market
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="mb-1 font-bold">{t('trade.location')}</label>
              <input 
                type="text"
                className="input"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Enter location"
                required
              />
            </div>

            {/* Enhanced Order Summary with User Context */}
            {formData.quantity && formData.price && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="font-bold mb-1">{t('trade.ordersummary')}</div>
                <div className="text-sm">
                  <div>Commodity: {formData.commodity}</div>
                  <div>Quantity: {formData.quantity} kg</div>
                  <div>Price: ₹{formData.price} per kg</div>
                  <div>Order Type: {formData.orderType}</div>
                  <div>Valid Until: {formData.validUntil}</div>
                  <div className="font-bold text-green mt-2">{t('trade.totalvalue')}: ₹{totalValue}</div>
                  <div className="text-xs text-gray">
                    Est. fees: ₹{(parseFloat(totalValue) * 0.02).toFixed(2)} (2%)
                  </div>
                  {currentUser && (
                    <div className="text-xs text-gray">
                      Wallet balance: ₹{currentUser.financials.walletBalance.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full" disabled={!currentUser}>
              {!currentUser ? 'Complete Profile to Trade' : 
                `${t('trade.create')} ${activeTab === 'buy' ? t('trade.buyorder') : t('trade.sellorder')}`
              }
            </button>
          </form>
        </div>

        {/* Real-time Order Book & User Activity */}
        <div>
          <div className="card mb-4">
            <h2 className="text-xl font-bold mb-4">📊 Live Order Book</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {realTimeOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between items-center text-sm border-b pb-1">
                  <div>
                    <span className="font-bold">{order.commodity}</span>
                    <span className="ml-2 text-gray">{order.quantity}kg</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${order.type === 'buy' ? 'text-green' : 'text-red-500'}`}>
                      {order.type.toUpperCase()} ₹{order.price}
                    </div>
                    <div className="text-xs text-gray">{order.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">
              {currentUser ? 'Your Transactions' : t('trade.myorders')}
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(currentUser ? userTransactions : trades).slice(0, 4).map((item: any) => (
                <div key={item.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">
                        {item.commodity || 'N/A'} - {item.quantity}kg
                      </div>
                      <div className="text-sm text-gray">
                        ₹{item.price || (item.amount / item.quantity).toFixed(2)}/kg • {item.location || 'Market'} • {item.time || new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray">
                        {item.orderId || `Transaction ID: ${item.id}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${
                        item.type === 'buy' ? 'text-blue-600' : 'text-green'
                      }`}>
                        {item.type.toUpperCase()}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        item.status === 'active' || item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Negotiations */}
      <div className="card mt-4">
        <h2 className="text-xl font-bold mb-4">{t('trade.negotiations')}</h2>
        <div className="grid grid-2">
          {negotiations.map((nego) => (
            <div key={nego.id} className="border rounded p-3">
              <div className="font-bold mb-1">{nego.commodity} - {nego.quantity}kg</div>
              <div className="text-sm text-gray mb-2">
                {nego.buyer} ↔ {nego.seller}
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm">
                  <span className="line-through text-gray">₹{nego.originalPrice}</span>
                  <span className="ml-2 font-bold text-green">₹{nego.currentPrice}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  nego.status === 'negotiating' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {nego.status}
                </div>
              </div>
              <div className="text-xs text-gray mb-2">
                💬 {nego.messages} messages • Savings: ₹{((nego.originalPrice - nego.currentPrice) * nego.quantity).toFixed(0)}
              </div>
              {nego.status === 'negotiating' && (
                <div className="flex gap-2">
                  <button className="btn btn-sm btn-primary">{t('trade.accept')}</button>
                  <button className="btn btn-sm btn-secondary">{t('trade.counter')}</button>
                  <button className="btn btn-sm btn-secondary">💬 Chat</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app and load user profile
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      
      // Load user profile
      const existingUser = userProfileService.getCurrentUser();
      if (existingUser) {
        setUser(existingUser);
        
        // Set language from user preferences
        if (existingUser.preferences?.language) {
          languageService.setLanguage(existingUser.preferences.language);
        }
        
        // Set chatbot context
        chatbotService.setUserContext({
          name: existingUser.name,
          type: existingUser.type,
          location: `${existingUser.location.district}, ${existingUser.location.state}`,
          crops: existingUser.farmDetails?.crops.map(c => c.name) || [],
          experience: 'intermediate'
        });
      } else {
        // Show profile setup for new users
        setShowProfileSetup(true);
      }
      
      setIsLoading(false);
    };

    initializeApp();

    // Listen for profile changes
    const handleProfileChange = (updatedUser: UserProfile) => {
      setUser(updatedUser);
    };

    userProfileService.addProfileListener(handleProfileChange);
    
    return () => {
      userProfileService.removeProfileListener(handleProfileChange);
    };
  }, []);

  // Initialize language service
  useEffect(() => {
    const savedLang = languageService.getCurrentLanguage();
    setCurrentLanguage(savedLang);

    const handleLanguageChange = (lang: string) => {
      setCurrentLanguage(lang);
      
      // Update user preferences if user exists
      if (user) {
        userProfileService.updatePreferences({ language: lang });
      }
    };

    languageService.addLanguageChangeListener(handleLanguageChange);
    return () => languageService.removeLanguageChangeListener(handleLanguageChange);
  }, [user]);

  const handleLanguageChange = (languageCode: string) => {
    languageService.setLanguage(languageCode);
  };

  const handleProfileSetupComplete = () => {
    setShowProfileSetup(false);
    const updatedUser = userProfileService.getCurrentUser();
    setUser(updatedUser);
    
    // Record user onboarding completion
    if (updatedUser) {
      userProfileService.recordUserInput('profile_setup_completed', 'onboarding', 'form');
    }
  };

  const handleShowProfile = () => {
    setShowProfileSetup(true);
  };

  const renderPage = () => {
    if (showProfileSetup) {
      return <UserProfilePage onComplete={handleProfileSetupComplete} />;
    }

    switch (currentPage) {
      case 'market': return <MarketPage />;
      case 'prices': return <PricesPage />;
      case 'trade': return <TradePage />;
      case 'analytics': return <AnalyticsPage />;
      case 'blockchain': return <BlockchainPage />;
      case 'iot': return <IoTPage />;
      case 'ai': return <AIPage />;
      case 'chat': return <ChatPage />;
      default: return <HomePage />;
    }
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-green border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-xl font-bold">Loading MandiSense...</div>
            <div className="text-gray">Initializing your personalized experience</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {!showProfileSetup && (
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          user={user}
          onShowProfile={handleShowProfile}
        />
      )}
      <main className="main">
        {renderPage()}
      </main>
      
      {/* User status indicator */}
      {user && !showProfileSetup && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-3 py-2 rounded-full text-sm ${
            user.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {user.verified ? '✓ Verified User' : '⚠ Unverified'}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;