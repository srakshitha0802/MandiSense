// Multi-language support service
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
];

// Comprehensive translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.market': 'Market',
    'nav.prices': 'Prices',
    'nav.trade': 'Trade',
    'nav.analytics': 'Analytics',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    
    // Home Page
    'home.welcome': 'Welcome to MandiSense 2.0',
    'home.subtitle': 'Your smart agricultural trading platform',
    'home.liveprices': 'Live Prices',
    'home.liveprices.desc': 'Real-time commodity prices from 500+ markets',
    'home.smarttrading': 'Smart Trading',
    'home.smarttrading.desc': 'AI-powered negotiation and trading tools',
    'home.analytics': 'Analytics',
    'home.analytics.desc': 'Market insights and price predictions',
    'home.quickstats': 'Quick Stats',
    'home.markets': 'Markets',
    'home.traders': 'Traders',
    'home.commodities': 'Commodities',
    'home.support': 'Support',
    
    // Market Page
    'market.title': 'Live Market Prices',
    'market.subtitle': 'Real-time prices from agricultural markets across India',
    'market.search': 'Search Commodity',
    'market.search.placeholder': 'Search commodities...',
    'market.filter.location': 'Filter by Location',
    'market.filter.all': 'All Locations',
    'market.sort': 'Sort by',
    'market.sort.name': 'Name',
    'market.sort.price': 'Price',
    'market.sort.change': 'Change',
    'market.sort.volume': 'Volume',
    'market.active': 'Active Markets',
    'market.trending': 'Trending Up',
    'market.avgprice': 'Avg Price',
    'market.totalvolume': 'Total Volume',
    'market.perkg': 'per kg',
    'market.volume': 'Volume',
    'market.high': 'High',
    'market.low': 'Low',
    'market.viewdetails': 'View Details',
    
    // Trading
    'trade.title': 'Trading Hub',
    'trade.subtitle': 'Buy and sell agricultural commodities',
    'trade.buyorder': 'Buy Order',
    'trade.sellorder': 'Sell Order',
    'trade.commodity': 'Commodity',
    'trade.quantity': 'Quantity (kg)',
    'trade.price': 'Price (₹/kg)',
    'trade.location': 'Location',
    'trade.ordersummary': 'Order Summary',
    'trade.totalvalue': 'Total Value',
    'trade.create': 'Create',
    'trade.myorders': 'My Orders',
    'trade.negotiations': 'Active Negotiations',
    'trade.accept': 'Accept',
    'trade.counter': 'Counter',
    
    // Analytics
    'analytics.title': 'Market Analytics',
    'analytics.subtitle': 'AI-powered insights and market intelligence',
    'analytics.predictions': 'AI Price Predictions',
    'analytics.topperformers': 'Top Performers',
    'analytics.alerts': 'Market Alerts',
    'analytics.confidence': 'Confidence',
    'analytics.nextdays': 'Next 30 days',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.refresh': 'Refresh',
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.market': 'बाज़ार',
    'nav.prices': 'कीमतें',
    'nav.trade': 'व्यापार',
    'nav.analytics': 'विश्लेषण',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.settings': 'सेटिंग्स',
    
    // Home Page
    'home.welcome': 'मंडीसेंस 2.0 में आपका स्वागत है',
    'home.subtitle': 'आपका स्मार्ट कृषि व्यापार मंच',
    'home.liveprices': 'लाइव कीमतें',
    'home.liveprices.desc': '500+ बाजारों से वास्तविक समय की कमोडिटी कीमतें',
    'home.smarttrading': 'स्मार्ट ट्रेडिंग',
    'home.smarttrading.desc': 'AI-संचालित बातचीत और व्यापारिक उपकरण',
    'home.analytics': 'विश्लेषण',
    'home.analytics.desc': 'बाजार अंतर्दृष्टि और मूल्य पूर्वानुमान',
    'home.quickstats': 'त्वरित आंकड़े',
    'home.markets': 'बाज़ार',
    'home.traders': 'व्यापारी',
    'home.commodities': 'वस्तुएं',
    'home.support': 'सहायता',
    
    // Market Page
    'market.title': 'लाइव बाजार कीमतें',
    'market.subtitle': 'भारत भर के कृषि बाजारों से वास्तविक समय की कीमतें',
    'market.search': 'कमोडिटी खोजें',
    'market.search.placeholder': 'कमोडिटी खोजें...',
    'market.filter.location': 'स्थान के अनुसार फ़िल्टर करें',
    'market.filter.all': 'सभी स्थान',
    'market.sort': 'इसके अनुसार क्रमबद्ध करें',
    'market.sort.name': 'नाम',
    'market.sort.price': 'कीमत',
    'market.sort.change': 'परिवर्तन',
    'market.sort.volume': 'मात्रा',
    'market.active': 'सक्रिय बाज़ार',
    'market.trending': 'बढ़ते हुए',
    'market.avgprice': 'औसत कीमत',
    'market.totalvolume': 'कुल मात्रा',
    'market.perkg': 'प्रति किलो',
    'market.volume': 'मात्रा',
    'market.high': 'उच्च',
    'market.low': 'निम्न',
    'market.viewdetails': 'विवरण देखें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.close': 'बंद करें',
    'common.submit': 'जमा करें',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.refresh': 'रीफ्रेश करें',
  },
  
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.market': 'சந்தை',
    'nav.prices': 'விலைகள்',
    'nav.trade': 'வர்த்தகம்',
    'nav.analytics': 'பகுப்பாய்வு',
    'nav.profile': 'சுயவிவரம்',
    'nav.settings': 'அமைப்புகள்',
    
    // Home Page
    'home.welcome': 'மண்டிசென்ஸ் 2.0 க்கு வரவேற்கிறோம்',
    'home.subtitle': 'உங்கள் ஸ்மார்ட் விவசாய வர்த்தக தளம்',
    'home.liveprices': 'நேரடி விலைகள்',
    'home.liveprices.desc': '500+ சந்தைகளில் இருந்து நிகழ்நேர பொருட்களின் விலைகள்',
    'home.smarttrading': 'ஸ்மார்ட் டிரேடிங்',
    'home.smarttrading.desc': 'AI-இயங்கும் பேச்சுவார்த்தை மற்றும் வர்த்தக கருவிகள்',
    'home.analytics': 'பகுப்பாய்வு',
    'home.analytics.desc': 'சந்தை நுண்ணறிவு மற்றும் விலை முன்னறிவிப்புகள்',
    'home.quickstats': 'விரைவு புள்ளிவிவரங்கள்',
    'home.markets': 'சந்தைகள்',
    'home.traders': 'வர்த்தகர்கள்',
    'home.commodities': 'பொருட்கள்',
    'home.support': 'ஆதரவு',
    
    // Market Page
    'market.title': 'நேரடி சந்தை விலைகள்',
    'market.subtitle': 'இந்தியா முழுவதும் உள்ள விவசாய சந்தைகளில் இருந்து நிகழ்நேர விலைகள்',
    'market.search': 'பொருள் தேடுங்கள்',
    'market.search.placeholder': 'பொருட்களைத் தேடுங்கள்...',
    'market.filter.location': 'இடத்தின் அடிப்படையில் வடிகட்டவும்',
    'market.filter.all': 'அனைத்து இடங்களும்',
    'market.sort': 'இதன் அடிப்படையில் வரிசைப்படுத்தவும்',
    'market.sort.name': 'பெயர்',
    'market.sort.price': 'விலை',
    'market.sort.change': 'மாற்றம்',
    'market.sort.volume': 'அளவு',
    'market.active': 'செயலில் உள்ள சந்தைகள்',
    'market.trending': 'உயர்ந்து வரும்',
    'market.avgprice': 'சராசரி விலை',
    'market.totalvolume': 'மொத்த அளவு',
    'market.perkg': 'ஒரு கிலோவுக்கு',
    'market.volume': 'அளவு',
    'market.high': 'உயர்ந்த',
    'market.low': 'குறைந்த',
    'market.viewdetails': 'விவரங்களைப் பார்க்கவும்',
    
    // Common
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.delete': 'நீக்கு',
    'common.edit': 'திருத்து',
    'common.view': 'பார்',
    'common.close': 'மூடு',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.search': 'தேடு',
    'common.filter': 'வடிகட்டு',
    'common.sort': 'வரிசைப்படுत்து',
    'common.refresh': 'புதுப்பிக்கவும்',
  }
};

class LanguageService {
  private currentLanguage: string = 'en';
  private listeners: ((lang: string) => void)[] = [];

  constructor() {
    // Load saved language from localStorage
    const saved = localStorage.getItem('mandisense_language');
    if (saved && SUPPORTED_LANGUAGES.find(l => l.code === saved)) {
      this.currentLanguage = saved;
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  setLanguage(languageCode: string): void {
    if (SUPPORTED_LANGUAGES.find(l => l.code === languageCode)) {
      this.currentLanguage = languageCode;
      localStorage.setItem('mandisense_language', languageCode);
      this.notifyListeners();
    }
  }

  translate(key: string, params?: Record<string, string>): string {
    const langTranslations = translations[this.currentLanguage] || translations.en;
    let translation = langTranslations[key] || translations.en[key] || key;
    
    // If translation is still the key itself, try English
    if (translation === key && this.currentLanguage !== 'en') {
      translation = translations.en[key] || key;
    }
    
    // Replace parameters if provided
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }
    
    return translation;
  }

  // Get translation with language fallback chain
  translateWithFallback(key: string, fallbackLanguages: string[] = ['en'], params?: Record<string, string>): string {
    // Try current language first
    let translation = this.translate(key, params);
    
    // If not found, try fallback languages
    if (translation === key || translation.startsWith('{{')) {
      for (const lang of fallbackLanguages) {
        if (lang !== this.currentLanguage) {
          const fallbackTranslations = translations[lang] || {};
          translation = fallbackTranslations[key] || key;
          if (translation !== key) {
            break;
          }
        }
      }
    }
    
    return translation;
  }

  // Check if a translation exists
  hasTranslation(key: string): boolean {
    const langTranslations = translations[this.currentLanguage] || {};
    return key in langTranslations;
  }

  addLanguageChangeListener(callback: (lang: string) => void): void {
    this.listeners.push(callback);
  }

  removeLanguageChangeListener(callback: (lang: string) => void): void {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  getSupportedLanguages(): Language[] {
    return SUPPORTED_LANGUAGES;
  }

  getCurrentLanguageInfo(): Language {
    return SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage) || SUPPORTED_LANGUAGES[0];
  }
}

export const languageService = new LanguageService();