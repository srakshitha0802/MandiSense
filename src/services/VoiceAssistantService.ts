// Advanced Voice Assistant with Native Language Support
export interface VoiceCommand {
  id: string;
  text: string;
  language: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  timestamp: string;
}

export interface VoiceResponse {
  id: string;
  text: string;
  language: string;
  audioUrl?: string;
  actions?: VoiceAction[];
  timestamp: string;
}

export interface VoiceAction {
  type: 'navigate' | 'search' | 'trade' | 'alert' | 'call_api';
  payload: Record<string, any>;
}

export interface SpeechSynthesisConfig {
  language: string;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

class VoiceAssistantService {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private currentLanguage = 'en-IN';
  private voices: SpeechSynthesisVoice[] = [];
  
  // Language-specific voice configurations
  private voiceConfigs: Record<string, SpeechSynthesisConfig> = {
    'en': { language: 'en-IN', voice: 'Google हिन्दी', rate: 1.0, pitch: 1.0, volume: 1.0 },
    'hi': { language: 'hi-IN', voice: 'Google हिन्दी', rate: 0.9, pitch: 1.1, volume: 1.0 },
    'ta': { language: 'ta-IN', voice: 'Google தமிழ்', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'te': { language: 'te-IN', voice: 'Google తెలుగు', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'mr': { language: 'mr-IN', voice: 'Google मराठी', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'gu': { language: 'gu-IN', voice: 'Google ગુજરાતી', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'kn': { language: 'kn-IN', voice: 'Google ಕನ್ನಡ', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'ml': { language: 'ml-IN', voice: 'Google മലയാളം', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'pa': { language: 'pa-IN', voice: 'Google ਪੰਜਾਬੀ', rate: 0.9, pitch: 1.0, volume: 1.0 },
    'bn': { language: 'bn-IN', voice: 'Google বাংলা', rate: 0.9, pitch: 1.0, volume: 1.0 }
  };

  // Intent patterns for different languages
  private intentPatterns: Record<string, Record<string, RegExp[]>> = {
    en: {
      price_inquiry: [/what.*price.*tomato/i, /price.*onion/i, /cost.*rice/i],
      weather_check: [/weather.*today/i, /rain.*forecast/i, /temperature/i],
      trade_order: [/buy.*tomato/i, /sell.*rice/i, /place.*order/i],
      market_status: [/market.*open/i, /trading.*hours/i, /market.*status/i],
      help: [/help/i, /assist/i, /guide/i]
    },
    hi: {
      price_inquiry: [/टमाटर.*कीमत/i, /प्याज.*दाम/i, /चावल.*रेट/i],
      weather_check: [/आज.*मौसम/i, /बारिश.*पूर्वानुमान/i, /तापमान/i],
      trade_order: [/टमाटर.*खरीदना/i, /चावल.*बेचना/i, /ऑर्डर.*देना/i],
      market_status: [/मंडी.*खुली/i, /व्यापार.*समय/i, /बाजार.*स्थिति/i],
      help: [/मदद/i, /सहायता/i, /गाइड/i]
    },
    ta: {
      price_inquiry: [/தக்காளி.*விலை/i, /வெங்காயம்.*விலை/i, /அரிசி.*விலை/i],
      weather_check: [/இன்று.*வானிலை/i, /மழை.*முன்னறிவிப்பு/i, /வெப்பநிலை/i],
      trade_order: [/தக்காளி.*வாங்க/i, /அரிசி.*விற்க/i, /ஆர்டர்.*கொடு/i],
      market_status: [/சந்தை.*திறந்து/i, /வர்த்தக.*நேரம்/i, /சந்தை.*நிலை/i],
      help: [/உதவி/i, /வழிகாட்டி/i, /கைடு/i]
    }
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoiceRecognition();
    this.loadVoices();
  }

  private initializeVoiceRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
      this.recognition.lang = this.currentLanguage;
    }
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    
    // Load voices when they become available
    if (this.voices.length === 0) {
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices();
      };
    }
  }

  // Start voice recognition
  async startListening(language: string = 'en'): Promise<VoiceCommand> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        // Fallback: use text input simulation for unsupported browsers
        console.warn('Speech recognition not supported, using fallback');
        const fallbackCommand: VoiceCommand = {
          id: `voice_${Date.now()}`,
          text: '',
          language,
          confidence: 0,
          intent: 'unknown',
          entities: {},
          timestamp: new Date().toISOString()
        };
        reject(new Error('Speech recognition not supported in this browser'));
        return;
      }

      try {
        this.currentLanguage = this.getLanguageCode(language);
        this.recognition.lang = this.currentLanguage;
        this.isListening = true;

        this.recognition.onresult = (event: any) => {
          if (event.results && event.results[0]) {
            const result = event.results[0];
            const transcript = result[0]?.transcript || '';
            const confidence = result[0]?.confidence || 0;

            const command: VoiceCommand = {
              id: `voice_${Date.now()}`,
              text: transcript,
              language,
              confidence,
              intent: this.detectIntent(transcript, language),
              entities: this.extractEntities(transcript, language),
              timestamp: new Date().toISOString()
            };

            this.isListening = false;
            resolve(command);
          } else {
            this.isListening = false;
            reject(new Error('No speech recognition result'));
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          reject(new Error(`Speech recognition error: ${event.error || 'unknown error'}`));
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };

        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        reject(new Error(`Failed to start speech recognition: ${error}`));
      }
    });
  }

  // Stop voice recognition
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Text-to-speech in native languages
  async speak(text: string, language: string = 'en'): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const config = this.voiceConfigs[language] || this.voiceConfigs['en'];
      
      // Find the best voice for the language
      const voice = this.voices.find(v => 
        v.lang.startsWith(config.language) || v.name.includes(config.voice)
      ) || this.voices.find(v => v.lang.startsWith('en'));

      if (voice) {
        utterance.voice = voice;
      }

      utterance.lang = config.language;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  // Process voice command and generate response
  async processVoiceCommand(command: VoiceCommand): Promise<VoiceResponse> {
    const response: VoiceResponse = {
      id: `response_${Date.now()}`,
      text: '',
      language: command.language,
      actions: [],
      timestamp: new Date().toISOString()
    };

    switch (command.intent) {
      case 'price_inquiry':
        response.text = await this.handlePriceInquiry(command);
        response.actions = [{ type: 'navigate', payload: { page: 'market' } }];
        break;

      case 'weather_check':
        response.text = await this.handleWeatherCheck(command);
        break;

      case 'trade_order':
        response.text = await this.handleTradeOrder(command);
        response.actions = [{ type: 'navigate', payload: { page: 'trade' } }];
        break;

      case 'market_status':
        response.text = await this.handleMarketStatus(command);
        break;

      case 'help':
        response.text = this.getHelpMessage(command.language);
        break;

      default:
        response.text = this.getDefaultResponse(command.language);
    }

    return response;
  }

  private detectIntent(text: string, language: string): string {
    const patterns = this.intentPatterns[language] || this.intentPatterns['en'];
    
    for (const [intent, regexList] of Object.entries(patterns)) {
      for (const regex of regexList) {
        if (regex.test(text)) {
          return intent;
        }
      }
    }
    
    return 'unknown';
  }

  private extractEntities(text: string, language: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract commodities
    const commodities = ['tomato', 'onion', 'rice', 'wheat', 'potato', 'टमाटर', 'प्याज', 'चावल', 'गेहूं', 'आलू'];
    for (const commodity of commodities) {
      if (text.toLowerCase().includes(commodity.toLowerCase())) {
        entities.commodity = commodity;
        break;
      }
    }

    // Extract quantities
    const quantityMatch = text.match(/(\d+)\s*(kg|किलो|kilo)/i);
    if (quantityMatch) {
      entities.quantity = parseInt(quantityMatch[1]);
      entities.unit = quantityMatch[2];
    }

    // Extract prices
    const priceMatch = text.match(/(\d+)\s*(rupee|रुपए|₹)/i);
    if (priceMatch) {
      entities.price = parseInt(priceMatch[1]);
    }

    return entities;
  }

  private async handlePriceInquiry(command: VoiceCommand): Promise<string> {
    const commodity = command.entities.commodity || 'tomato';
    
    // Simulate real price lookup
    const prices: Record<string, number> = {
      'tomato': 45, 'टमाटर': 45,
      'onion': 38, 'प्याज': 38,
      'rice': 52, 'चावल': 52,
      'wheat': 35, 'गेहूं': 35
    };

    const price = prices[commodity.toLowerCase()] || 40;
    
    const responses: Record<string, string> = {
      'en': `The current price of ${commodity} is ₹${price} per kg in the market.`,
      'hi': `${commodity} की वर्तमान कीमत बाजार में ₹${price} प्रति किलो है।`,
      'ta': `${commodity} இன் தற்போதைய விலை சந்தையில் கிலோ ₹${price} ஆகும்।`
    };

    return responses[command.language] || responses['en'];
  }

  private async handleWeatherCheck(command: VoiceCommand): Promise<string> {
    // Simulate weather data
    const weather = {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      rainfall: 10
    };

    const responses: Record<string, string> = {
      'en': `Today's weather: ${weather.temperature}°C, ${weather.condition}. Humidity ${weather.humidity}%. Expected rainfall: ${weather.rainfall}mm.`,
      'hi': `आज का मौसम: ${weather.temperature}°C, ${weather.condition}। नमी ${weather.humidity}%। अपेक्षित बारिश: ${weather.rainfall}mm।`,
      'ta': `இன்றைய வானிலை: ${weather.temperature}°C, ${weather.condition}। ஈரப்பதம் ${weather.humidity}%। எதிர்பார்க்கப்படும் மழை: ${weather.rainfall}mm।`
    };

    return responses[command.language] || responses['en'];
  }

  private async handleTradeOrder(command: VoiceCommand): Promise<string> {
    const commodity = command.entities.commodity || 'tomato';
    const quantity = command.entities.quantity || 100;

    const responses: Record<string, string> = {
      'en': `I'll help you place an order for ${quantity}kg of ${commodity}. Opening the trading page now.`,
      'hi': `मैं आपको ${quantity}किलो ${commodity} के लिए ऑर्डर देने में मदद करूंगा। अब ट्रेडिंग पेज खोल रहा हूं।`,
      'ta': `${quantity}கிலो ${commodity} க்கான ஆர்டரை வைக்க உங்களுக்கு உதவுகிறேன். இப்போது வர்த்தக பக்கத்தைத் திறக்கிறேன்।`
    };

    return responses[command.language] || responses['en'];
  }

  private async handleMarketStatus(command: VoiceCommand): Promise<string> {
    const responses: Record<string, string> = {
      'en': `Markets are currently open. Trading hours: 6 AM to 8 PM. Active traders: 15,240. Total volume today: 2.5M kg.`,
      'hi': `बाजार वर्तमान में खुले हैं। व्यापारिक समय: सुबह 6 बजे से रात 8 बजे तक। सक्रिय व्यापारी: 15,240। आज कुल मात्रा: 2.5M किलो।`,
      'ta': `சந்தைகள் தற்போது திறந்துள்ளன. வர்த்தக நேரம்: காலை 6 மணி முதல் இரவு 8 மணி வரை. செயலில் உள்ள வர்த்தகர்கள்: 15,240. இன்று மொத்த அளவு: 2.5M கிலோ.`
    };

    return responses[command.language] || responses['en'];
  }

  private getHelpMessage(language: string): string {
    const responses: Record<string, string> = {
      'en': `I can help you with: Check prices, Weather updates, Place orders, Market status, Trading guidance. Just speak naturally!`,
      'hi': `मैं आपकी मदद कर सकता हूं: कीमतें चेक करना, मौसम अपडेट, ऑर्डर देना, बाजार की स्थिति, ट्रेडिंग गाइडेंस। बस स्वाभाविक रूप से बोलें!`,
      'ta': `நான் உங்களுக்கு உதவ முடியும்: விலைகளைச் சரிபார்க்க, வானிலை புதுப்பிப்புகள், ஆர்டர்கள் வைக்க, சந்தை நிலை, வர்த்தக வழிகாட்டுதல். இயல்பாகப் பேசுங்கள்!`
    };

    return responses[language] || responses['en'];
  }

  private getDefaultResponse(language: string): string {
    const responses: Record<string, string> = {
      'en': `I didn't understand that. You can ask about prices, weather, trading, or say "help" for more options.`,
      'hi': `मुझे समझ नहीं आया। आप कीमतों, मौसम, ट्रेडिंग के बारे में पूछ सकते हैं, या अधिक विकल्पों के लिए "मदद" कह सकते हैं।`,
      'ta': `எனக்கு அது புரியவில்லை. நீங்கள் விலைகள், வானிலை, வர்த்தகம் பற்றி கேட்கலாம் அல்லது மேலும் விருப்பங்களுக்கு "உதவி" என்று சொல்லலாம்.`
    };

    return responses[language] || responses['en'];
  }

  private getLanguageCode(language: string): string {
    const codes: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'bn': 'bn-IN'
    };
    return codes[language] || 'en-IN';
  }

  // Check if voice features are supported
  isVoiceSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  // Get available voices for a language
  getAvailableVoices(language: string): SpeechSynthesisVoice[] {
    const langCode = this.getLanguageCode(language);
    return this.voices.filter(voice => 
      voice.lang.startsWith(langCode.split('-')[0]) || 
      voice.lang === langCode
    );
  }

  // Set voice preferences
  setVoiceConfig(language: string, config: Partial<SpeechSynthesisConfig>): void {
    this.voiceConfigs[language] = { ...this.voiceConfigs[language], ...config };
  }
}

export const voiceAssistantService = new VoiceAssistantService();