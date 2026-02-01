// Advanced AI Chatbot with Multi-language Support
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  language: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'action';
  metadata?: Record<string, any>;
}

export interface ChatContext {
  userId: string;
  sessionId: string;
  language: string;
  userProfile: {
    name: string;
    type: 'farmer' | 'trader' | 'buyer' | 'supplier';
    location: string;
    crops: string[];
    experience: string;
  };
  conversationHistory: ChatMessage[];
  currentTopic?: string;
  entities: Record<string, any>;
}

export interface ChatIntent {
  name: string;
  confidence: number;
  entities: Record<string, any>;
  actions: ChatAction[];
}

export interface ChatAction {
  type: 'navigate' | 'search' | 'api_call' | 'form_fill' | 'voice_response';
  payload: Record<string, any>;
}

class ChatbotService {
  private context: ChatContext;
  private knowledgeBase: Record<string, any>;
  private intentClassifier: Record<string, RegExp[]>;

  constructor() {
    this.initializeKnowledgeBase();
    this.initializeIntentClassifier();
    this.context = this.createDefaultContext();
  }

  private createDefaultContext(): ChatContext {
    return {
      userId: 'user_' + Date.now(),
      sessionId: 'session_' + Date.now(),
      language: 'en',
      userProfile: {
        name: 'Farmer',
        type: 'farmer',
        location: 'Maharashtra',
        crops: ['tomatoes', 'onions'],
        experience: 'intermediate'
      },
      conversationHistory: [],
      entities: {}
    };
  }

  private initializeKnowledgeBase(): void {
    this.knowledgeBase = {
      // Crop information in multiple languages
      crops: {
        en: {
          tomatoes: {
            name: 'Tomatoes',
            season: 'Kharif and Rabi',
            soilType: 'Well-drained loamy soil',
            waterRequirement: 'Moderate to high',
            diseases: ['Early blight', 'Late blight', 'Bacterial wilt'],
            bestPractices: [
              'Plant in well-drained soil',
              'Maintain proper spacing',
              'Regular pruning required',
              'Support with stakes'
            ],
            marketTips: [
              'Grade A tomatoes fetch 20% premium',
              'Best selling time is early morning',
              'Pack in ventilated crates',
              'Avoid harvesting in rain'
            ]
          },
          onions: {
            name: 'Onions',
            season: 'Rabi',
            soilType: 'Sandy loam with good drainage',
            waterRequirement: 'Moderate',
            diseases: ['Purple blotch', 'Downy mildew', 'Onion fly'],
            bestPractices: [
              'Plant in raised beds',
              'Proper curing after harvest',
              'Avoid overwatering',
              'Regular weeding essential'
            ],
            marketTips: [
              'Properly cured onions last longer',
              'Size grading increases price',
              'Store in ventilated areas',
              'Export quality fetches premium'
            ]
          }
        },
        hi: {
          tomatoes: {
            name: 'टमाटर',
            season: 'खरीफ और रबी',
            soilType: 'अच्छी जल निकासी वाली दोमट मिट्टी',
            waterRequirement: 'मध्यम से अधिक',
            diseases: ['अर्ली ब्लाइट', 'लेट ब्लाइट', 'बैक्टीरियल विल्ट'],
            bestPractices: [
              'अच्छी जल निकासी वाली मिट्टी में लगाएं',
              'उचित दूरी बनाए रखें',
              'नियमित छंटाई आवश्यक',
              'डंडों से सहारा दें'
            ],
            marketTips: [
              'ग्रेड ए टमाटर 20% अधिक कीमत दिलाते हैं',
              'सुबह जल्दी बेचना सबसे अच्छा',
              'हवादार क्रेट में पैक करें',
              'बारिश में तुड़ाई न करें'
            ]
          }
        }
      },

      // Market information
      markets: {
        en: {
          tradingHours: 'Markets open from 6 AM to 8 PM',
          peakHours: 'Best prices between 7-10 AM',
          documentation: 'Bring quality certificate and transport receipt',
          paymentMethods: 'Cash, UPI, Bank transfer, Crypto payments accepted'
        },
        hi: {
          tradingHours: 'बाजार सुबह 6 बजे से रात 8 बजे तक खुले रहते हैं',
          peakHours: 'सुबह 7-10 बजे के बीच सबसे अच्छी कीमतें',
          documentation: 'गुणवत्ता प्रमाणपत्र और परिवहन रसीद लाएं',
          paymentMethods: 'नकद, UPI, बैंक ट्रांसफर, क्रिप्टो भुगतान स्वीकार'
        }
      },

      // Weather and farming tips
      farming: {
        en: {
          irrigation: {
            drip: 'Drip irrigation saves 30-50% water',
            sprinkler: 'Good for large fields, uniform coverage',
            flood: 'Traditional method, high water usage'
          },
          fertilizers: {
            organic: 'Improves soil health, slower release',
            chemical: 'Quick results, requires careful application',
            bio: 'Eco-friendly, enhances soil microbes'
          }
        },
        hi: {
          irrigation: {
            drip: 'ड्रिप सिंचाई 30-50% पानी बचाती है',
            sprinkler: 'बड़े खेतों के लिए अच्छा, समान कवरेज',
            flood: 'पारंपरिक तरीका, अधिक पानी का उपयोग'
          },
          fertilizers: {
            organic: 'मिट्टी की सेहत सुधारता है, धीमी रिलीज',
            chemical: 'त्वरित परिणाम, सावधान उपयोग आवश्यक',
            bio: 'पर्यावरण अनुकूल, मिट्टी के सूक्ष्मजीव बढ़ाता है'
          }
        }
      }
    };
  }

  private initializeIntentClassifier(): void {
    this.intentClassifier = {
      price_inquiry: [
        /what.*price.*of/i, /price.*for/i, /cost.*of/i, /rate.*of/i,
        /कीमत.*क्या/i, /दाम.*कितना/i, /रेट.*क्या/i,
        /விலை.*என்ன/i, /விலை.*எவ்வளவு/i
      ],
      crop_advice: [
        /how.*grow/i, /farming.*tips/i, /cultivation/i, /best.*practices/i,
        /कैसे.*उगाएं/i, /खेती.*टिप्स/i, /उत्पादन/i,
        /எப்படி.*வளர்க்க/i, /விவசாய.*குறிப்புகள்/i
      ],
      weather_info: [
        /weather/i, /rain/i, /temperature/i, /climate/i,
        /मौसम/i, /बारिश/i, /तापमान/i,
        /வானிலை/i, /மழை/i, /வெப்பநிலை/i
      ],
      market_info: [
        /market.*hours/i, /trading.*time/i, /market.*open/i,
        /बाजार.*समय/i, /मंडी.*खुली/i, /व्यापार.*समय/i,
        /சந்தை.*நேரம்/i, /வர்த்தக.*நேரம்/i
      ],
      disease_help: [
        /disease/i, /pest/i, /problem.*crop/i, /plant.*sick/i,
        /बीमारी/i, /कीट/i, /फसल.*समस्या/i,
        /நோய்/i, /பூச்சி/i, /பயிர்.*பிரச்சனை/i
      ],
      trading_help: [
        /how.*trade/i, /buy.*sell/i, /place.*order/i,
        /कैसे.*व्यापार/i, /खरीदना.*बेचना/i, /ऑर्डर.*देना/i,
        /எப்படி.*வர்த்தகம்/i, /வாங்க.*விற்க/i
      ]
    };
  }

  // Main chat processing function
  async processMessage(message: string, language: string = 'en'): Promise<ChatMessage> {
    // Add user message to history
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      text: message,
      sender: 'user',
      language,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    this.context.conversationHistory.push(userMessage);
    this.context.language = language;

    // Classify intent and extract entities
    const intent = this.classifyIntent(message, language);
    const entities = this.extractEntities(message, language);

    // Generate response based on intent
    const responseText = await this.generateResponse(intent, entities, language);

    // Create bot response
    const botMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      text: responseText,
      sender: 'bot',
      language,
      timestamp: new Date().toISOString(),
      type: 'text',
      metadata: {
        intent: intent.name,
        confidence: intent.confidence,
        entities
      }
    };

    this.context.conversationHistory.push(botMessage);
    return botMessage;
  }

  private classifyIntent(message: string, language: string): ChatIntent {
    let bestMatch = { name: 'general', confidence: 0.3 };

    for (const [intentName, patterns] of Object.entries(this.intentClassifier)) {
      for (const pattern of patterns) {
        if (pattern.test(message)) {
          const confidence = this.calculateConfidence(message, pattern);
          if (confidence > bestMatch.confidence) {
            bestMatch = { name: intentName, confidence };
          }
        }
      }
    }

    return {
      name: bestMatch.name,
      confidence: bestMatch.confidence,
      entities: {},
      actions: []
    };
  }

  private calculateConfidence(message: string, pattern: RegExp): number {
    const match = message.match(pattern);
    if (!match) return 0;
    
    // Simple confidence based on match length and message length
    const matchLength = match[0].length;
    const messageLength = message.length;
    return Math.min(0.9, (matchLength / messageLength) * 2);
  }

  private extractEntities(message: string, language: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Extract crops
    const cropNames = {
      en: ['tomato', 'onion', 'potato', 'rice', 'wheat', 'chilli'],
      hi: ['टमाटर', 'प्याज', 'आलू', 'चावल', 'गेहूं', 'मिर्च'],
      ta: ['தக்காளி', 'வெங்காயம்', 'உருளைக்கிழங்கு', 'அரிசி', 'கோதுமை', 'மிளகாய்']
    };

    const crops = cropNames[language as keyof typeof cropNames] || cropNames.en;
    for (const crop of crops) {
      if (message.toLowerCase().includes(crop.toLowerCase())) {
        entities.crop = crop;
        break;
      }
    }

    // Extract quantities
    const quantityMatch = message.match(/(\d+)\s*(kg|किलो|kilo|கிலோ)/i);
    if (quantityMatch) {
      entities.quantity = parseInt(quantityMatch[1]);
      entities.unit = quantityMatch[2];
    }

    // Extract prices
    const priceMatch = message.match(/(\d+)\s*(rupee|रुपए|₹|ரூபாய்)/i);
    if (priceMatch) {
      entities.price = parseInt(priceMatch[1]);
    }

    // Extract locations
    const locations = ['maharashtra', 'gujarat', 'punjab', 'karnataka', 'tamil nadu'];
    for (const location of locations) {
      if (message.toLowerCase().includes(location)) {
        entities.location = location;
        break;
      }
    }

    return entities;
  }

  private async generateResponse(intent: ChatIntent, entities: Record<string, any>, language: string): Promise<string> {
    switch (intent.name) {
      case 'price_inquiry':
        return this.handlePriceInquiry(entities, language);
      
      case 'crop_advice':
        return this.handleCropAdvice(entities, language);
      
      case 'weather_info':
        return this.handleWeatherInfo(entities, language);
      
      case 'market_info':
        return this.handleMarketInfo(language);
      
      case 'disease_help':
        return this.handleDiseaseHelp(entities, language);
      
      case 'trading_help':
        return this.handleTradingHelp(language);
      
      default:
        return this.handleGeneralQuery(language);
    }
  }

  private handlePriceInquiry(entities: Record<string, any>, language: string): string {
    const crop = entities.crop || 'tomato';
    const currentPrice = Math.floor(Math.random() * 50) + 30; // Simulate real price
    
    const responses = {
      en: `The current market price for ${crop} is ₹${currentPrice} per kg. Prices have been stable this week. Would you like to see the price trend or place an order?`,
      hi: `${crop} की वर्तमान बाजार कीमत ₹${currentPrice} प्रति किलो है। इस सप्ताह कीमतें स्थिर रही हैं। क्या आप कीमत का रुझान देखना चाहते हैं या ऑर्डर देना चाहते हैं?`,
      ta: `${crop} இன் தற்போதைய சந்தை விலை கிலோ ₹${currentPrice} ஆகும். இந்த வாரம் விலைகள் நிலையாக உள்ளன. விலை போக்கைப் பார்க்க விரும்புகிறீர்களா அல்லது ஆர்டர் செய்ய விரும்புகிறீர்களா?`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleCropAdvice(entities: Record<string, any>, language: string): string {
    const crop = entities.crop || 'tomatoes';
    const cropInfo = this.knowledgeBase.crops[language]?.[crop] || this.knowledgeBase.crops.en[crop];

    if (!cropInfo) {
      const responses = {
        en: `I'd be happy to help with farming advice! Could you specify which crop you're interested in? I have detailed information about tomatoes, onions, rice, wheat, and many others.`,
        hi: `मुझे खेती की सलाह देने में खुशी होगी! क्या आप बता सकते हैं कि आप किस फसल में रुचि रखते हैं? मेरे पास टमाटर, प्याज, चावल, गेहूं और कई अन्य की विस्तृत जानकारी है।`,
        ta: `விவசாய ஆலோசனை வழங்க நான் மகிழ்ச்சியடைகிறேன்! எந்த பயிரில் நீங்கள் ஆர்வமாக உள்ளீர்கள் என்று குறிப்பிட முடியுமா? தக்காளி, வெங்காயம், அரிசி, கோதுமை மற்றும் பல பற்றிய விரிவான தகவல்கள் என்னிடம் உள்ளன.`
      };
      return responses[language as keyof typeof responses] || responses.en;
    }

    const responses = {
      en: `Here's advice for growing ${cropInfo.name}:\n\n🌱 Season: ${cropInfo.season}\n🌍 Soil: ${cropInfo.soilType}\n💧 Water: ${cropInfo.waterRequirement}\n\n📋 Best Practices:\n${cropInfo.bestPractices.map((tip: string) => `• ${tip}`).join('\n')}\n\n💰 Market Tips:\n${cropInfo.marketTips.map((tip: string) => `• ${tip}`).join('\n')}`,
      hi: `${cropInfo.name} उगाने की सलाह:\n\n🌱 मौसम: ${cropInfo.season}\n🌍 मिट्टी: ${cropInfo.soilType}\n💧 पानी: ${cropInfo.waterRequirement}\n\n📋 सर्वोत्तम प्रथाएं:\n${cropInfo.bestPractices.map((tip: string) => `• ${tip}`).join('\n')}\n\n💰 बाजार टिप्स:\n${cropInfo.marketTips.map((tip: string) => `• ${tip}`).join('\n')}`,
      ta: `${cropInfo.name} வளர்ப்பதற்கான ஆலோசனை:\n\n🌱 பருவம்: ${cropInfo.season}\n🌍 மண்: ${cropInfo.soilType}\n💧 நீர்: ${cropInfo.waterRequirement}\n\n📋 சிறந்த நடைமுறைகள்:\n${cropInfo.bestPractices.map((tip: string) => `• ${tip}`).join('\n')}\n\n💰 சந்தை குறிப்புகள்:\n${cropInfo.marketTips.map((tip: string) => `• ${tip}`).join('\n')}`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleWeatherInfo(entities: Record<string, any>, language: string): string {
    // Simulate weather data
    const weather = {
      temperature: 28 + Math.floor(Math.random() * 10),
      condition: 'Partly Cloudy',
      humidity: 60 + Math.floor(Math.random() * 30),
      rainfall: Math.floor(Math.random() * 20),
      windSpeed: 5 + Math.floor(Math.random() * 15)
    };

    const responses = {
      en: `🌤️ Current Weather:\n• Temperature: ${weather.temperature}°C\n• Condition: ${weather.condition}\n• Humidity: ${weather.humidity}%\n• Expected rainfall: ${weather.rainfall}mm\n• Wind speed: ${weather.windSpeed} km/h\n\n🌾 Farming Impact: Good conditions for most crops. Consider irrigation if rainfall is below 10mm.`,
      hi: `🌤️ वर्तमान मौसम:\n• तापमान: ${weather.temperature}°C\n• स्थिति: ${weather.condition}\n• नमी: ${weather.humidity}%\n• अपेक्षित बारिश: ${weather.rainfall}mm\n• हवा की गति: ${weather.windSpeed} km/h\n\n🌾 खेती पर प्रभाव: अधिकांश फसलों के लिए अच्छी स्थिति। यदि बारिश 10mm से कम है तो सिंचाई पर विचार करें।`,
      ta: `🌤️ தற்போதைய வானிலை:\n• வெப்பநிலை: ${weather.temperature}°C\n• நிலை: ${weather.condition}\n• ஈரப்பதம்: ${weather.humidity}%\n• எதிர்பார்க்கப்படும் மழை: ${weather.rainfall}mm\n• காற்றின் வேகம்: ${weather.windSpeed} km/h\n\n🌾 விவசாய தாக்கம்: பெரும்பாலான பயிர்களுக்கு நல்ல நிலைமைகள். மழை 10mm க்கும் குறைவாக இருந்தால் நீர்ப்பாசனத்தை கருத்தில் கொள்ளுங்கள்.`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleMarketInfo(language: string): string {
    const marketInfo = this.knowledgeBase.markets[language] || this.knowledgeBase.markets.en;

    const responses = {
      en: `🏪 Market Information:\n\n⏰ ${marketInfo.tradingHours}\n💰 ${marketInfo.peakHours}\n📄 ${marketInfo.documentation}\n💳 ${marketInfo.paymentMethods}\n\nWould you like specific information about any particular market or commodity?`,
      hi: `🏪 बाजार की जानकारी:\n\n⏰ ${marketInfo.tradingHours}\n💰 ${marketInfo.peakHours}\n📄 ${marketInfo.documentation}\n💳 ${marketInfo.paymentMethods}\n\nक्या आप किसी विशेष बाजार या वस्तु के बारे में विशिष्ट जानकारी चाहते हैं?`,
      ta: `🏪 சந்தை தகவல்:\n\n⏰ ${marketInfo.tradingHours}\n💰 ${marketInfo.peakHours}\n📄 ${marketInfo.documentation}\n💳 ${marketInfo.paymentMethods}\n\nகுறிப்பிட்ட சந்தை அல்லது பொருள் பற்றிய குறிப்பிட்ட தகவல் வேண்டுமா?`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleDiseaseHelp(entities: Record<string, any>, language: string): string {
    const crop = entities.crop || 'general';

    const responses = {
      en: `🔬 Disease & Pest Management:\n\nFor accurate diagnosis, I recommend:\n1. Upload a clear photo of affected plants\n2. Describe symptoms (yellowing, spots, wilting)\n3. Mention when symptoms started\n\n🚨 Common issues this season:\n• Early blight in tomatoes\n• Aphids in various crops\n• Fungal infections due to humidity\n\nWould you like to upload a photo for AI-powered disease detection?`,
      hi: `🔬 रोग और कीट प्रबंधन:\n\nसटीक निदान के लिए, मैं सुझाता हूं:\n1. प्रभावित पौधों की स्पष्ट तस्वीर अपलोड करें\n2. लक्षणों का वर्णन करें (पीलापन, धब्बे, मुरझाना)\n3. बताएं कि लक्षण कब शुरू हुए\n\n🚨 इस मौसम की आम समस्याएं:\n• टमाटर में अर्ली ब्लाइट\n• विभिन्न फसलों में एफिड\n• नमी के कारण फंगल संक्रमण\n\nक्या आप AI-संचालित रोग पहचान के लिए फोटो अपलोड करना चाहते हैं?`,
      ta: `🔬 நோய் மற்றும் பூச்சி மேலாண்மை:\n\nதுல்லியமான நோயறிதலுக்கு, நான் பரிந்துரைக்கிறேன்:\n1. பாதிக்கப்பட்ட தாவரங்களின் தெளிவான புகைப்படத்தை பதிவேற்றவும்\n2. அறிகுறிகளை விவரிக்கவும் (மஞ்சள், புள்ளிகள், வாடுதல்)\n3. அறிகுறிகள் எப்போது தொடங்கின என்று குறிப்பிடவும்\n\n🚨 இந்த பருவத்தின் பொதுவான பிரச்சினைகள்:\n• தக்காளியில் ஆரம்ப கருகல்\n• பல்வேறு பயிர்களில் அசுவினி\n• ஈரப்பதம் காரணமாக பூஞ்சை தொற்று\n\nAI-இயங்கும் நோய் கண்டறிதலுக்கு புகைப்படத்தை பதிவேற்ற விரும்புகிறீர்களா?`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleTradingHelp(language: string): string {
    const responses = {
      en: `💼 Trading Guide:\n\n📋 How to Trade:\n1. Check current market prices\n2. Choose order type (Market/Limit/Stop)\n3. Set quantity and price\n4. Review and confirm order\n\n💡 Trading Tips:\n• Market orders execute immediately\n• Limit orders wait for your target price\n• Use stop orders to limit losses\n• Check quality grades for better prices\n\n🔒 Our platform offers:\n• Blockchain-secured transactions\n• Smart contract escrow\n• Real-time price updates\n• Multi-language support\n\nReady to start trading?`,
      hi: `💼 ट्रेडिंग गाइड:\n\n📋 कैसे व्यापार करें:\n1. वर्तमान बाजार कीमतें चेक करें\n2. ऑर्डर प्रकार चुनें (मार्केट/लिमिट/स्टॉप)\n3. मात्रा और कीमत सेट करें\n4. समीक्षा करें और ऑर्डर की पुष्टि करें\n\n💡 ट्रेडिंग टिप्स:\n• मार्केट ऑर्डर तुरंत निष्पादित होते हैं\n• लिमिट ऑर्डर आपकी लक्षित कीमत का इंतजार करते हैं\n• नुकसान सीमित करने के लिए स्टॉप ऑर्डर का उपयोग करें\n• बेहतर कीमतों के लिए गुणवत्ता ग्रेड चेक करें\n\n🔒 हमारा प्लेटफॉर्म प्रदान करता है:\n• ब्लॉकचेन-सुरक्षित लेनदेन\n• स्मार्ट कॉन्ट्रैक्ट एस्क्रो\n• रियल-टाइम कीमत अपडेट\n• बहुभाषी समर्थन\n\nव्यापार शुरू करने के लिए तैयार हैं?`,
      ta: `💼 வர்த்தக வழிகாட்டி:\n\n📋 எப்படி வர்த்தகம் செய்வது:\n1. தற்போதைய சந்தை விலைகளைச் சரிபார்க்கவும்\n2. ஆர்டர் வகையைத் தேர்ந்தெடுக்கவும் (மார்க்கெட்/லிமிட்/ஸ்டாப்)\n3. அளவு மற்றும் விலையை அமைக்கவும்\n4. மதிப்பாய்வு செய்து ஆர்டரை உறுதிப்படுத்தவும்\n\n💡 வர்த்தக குறிப்புகள்:\n• மார்க்கெட் ஆர்டர்கள் உடனடியாக செயல்படுத்தப்படும்\n• லிமிட் ஆர்டர்கள் உங்கள் இலக்கு விலைக்காக காத்திருக்கும்\n• இழப்புகளை கட்டுப்படுத்த ஸ்டாப் ஆர்டர்களைப் பயன்படுத்தவும்\n• சிறந்த விலைகளுக்கு தர தரங்களைச் சரிபார்க்கவும்\n\n🔒 எங்கள் தளம் வழங்குகிறது:\n• பிளாக்செயின்-பாதுகாக்கப்பட்ட பரிவர்த்தனைகள்\n• ஸ்மார்ட் கான்ட்ராக்ட் எஸ்க்ரோ\n• நிகழ்நேர விலை புதுப்பிப்புகள்\n• பல மொழி ஆதரவு\n\nவர்த்தகம் தொடங்க தயாரா?`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  private handleGeneralQuery(language: string): string {
    const responses = {
      en: `Hello! I'm your AI farming assistant. I can help you with:\n\n🌾 Crop advice and best practices\n💰 Current market prices and trends\n🌤️ Weather information and farming impact\n🏪 Market hours and trading information\n🔬 Disease diagnosis and treatment\n💼 Trading guidance and order placement\n\nWhat would you like to know about? You can ask me anything related to farming, trading, or markets!`,
      hi: `नमस्ते! मैं आपका AI कृषि सहायक हूं। मैं आपकी मदद कर सकता हूं:\n\n🌾 फसल सलाह और सर्वोत्तम प्रथाएं\n💰 वर्तमान बाजार कीमतें और रुझान\n🌤️ मौसम की जानकारी और खेती पर प्रभाव\n🏪 बाजार के घंटे और व्यापारिक जानकारी\n🔬 रोग निदान और उपचार\n💼 ट्रेडिंग गाइडेंस और ऑर्डर प्लेसमेंट\n\nआप क्या जानना चाहते हैं? आप मुझसे खेती, व्यापार या बाजारों से संबंधित कुछ भी पूछ सकते हैं!`,
      ta: `வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். நான் உங்களுக்கு உதவ முடியும்:\n\n🌾 பயிர் ஆலோசனை மற்றும் சிறந்த நடைமுறைகள்\n💰 தற்போதைய சந்தை விலைகள் மற்றும் போக்குகள்\n🌤️ வானிலை தகவல் மற்றும் விவசாய தாக்கம்\n🏪 சந்தை நேரங்கள் மற்றும் வர்த்தக தகவல்\n🔬 நோய் கண்டறிதல் மற்றும் சிகிச்சை\n💼 வர்த்தக வழிகாட்டுதல் மற்றும் ஆர்டர் வைப்பு\n\nநீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்? விவசாயம், வர்த்தகம் அல்லது சந்தைகள் தொடர்பான எதையும் என்னிடம் கேட்கலாம்!`
    };

    return responses[language as keyof typeof responses] || responses.en;
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return this.context.conversationHistory;
  }

  // Clear conversation
  clearConversation(): void {
    this.context.conversationHistory = [];
    this.context.entities = {};
    this.context.currentTopic = undefined;
  }

  // Set user context
  setUserContext(userProfile: Partial<ChatContext['userProfile']>): void {
    this.context.userProfile = { ...this.context.userProfile, ...userProfile };
  }

  // Get personalized greeting
  getPersonalizedGreeting(language: string): string {
    const name = this.context.userProfile.name;
    const type = this.context.userProfile.type;
    
    const greetings = {
      en: `Hello ${name}! Welcome back to MandiSense. As a ${type}, I'm here to help you with farming, trading, and market insights. What can I assist you with today?`,
      hi: `नमस्ते ${name}! MandiSense में वापस स्वागत है। एक ${type} के रूप में, मैं खेती, व्यापार और बाजार की जानकारी में आपकी मदद के लिए यहां हूं। आज मैं आपकी किस चीज में सहायता कर सकता हूं?`,
      ta: `வணக்கம் ${name}! MandiSense க்கு மீண்டும் வரவேற்கிறோம். ஒரு ${type} ஆக, விவசாயம், வர்த்தகம் மற்றும் சந்தை நுண்ணறிவுகளில் உங்களுக்கு உதவ நான் இங்கே இருக்கிறேன். இன்று நான் உங்களுக்கு எதில் உதவ முடியும்?`
    };

    return greetings[language as keyof typeof greetings] || greetings.en;
  }

  // Process image for disease detection
  async processImageMessage(imageData: string, language: string): Promise<ChatMessage> {
    // Simulate AI image processing
    const diseases = [
      { name: 'Early Blight', confidence: 87, severity: 'medium' },
      { name: 'Bacterial Spot', confidence: 23, severity: 'low' }
    ];

    const mainDisease = diseases[0];
    
    const responses = {
      en: `🔬 AI Disease Analysis Complete!\n\n📊 Detected: ${mainDisease.name}\n🎯 Confidence: ${mainDisease.confidence}%\n⚠️ Severity: ${mainDisease.severity}\n\n💊 Recommended Treatment:\n• Apply copper-based fungicide\n• Remove affected leaves\n• Improve air circulation\n• Avoid overhead watering\n\n📞 Would you like to connect with a local agricultural expert?`,
      hi: `🔬 AI रोग विश्लेषण पूर्ण!\n\n📊 पहचाना गया: ${mainDisease.name}\n🎯 विश्वास: ${mainDisease.confidence}%\n⚠️ गंभीरता: ${mainDisease.severity}\n\n💊 अनुशंसित उपचार:\n• कॉपर-आधारित फंगीसाइड लगाएं\n• प्रभावित पत्तियों को हटाएं\n• हवा का संचार सुधारें\n• ऊपरी पानी से बचें\n\n📞 क्या आप स्थानीय कृषि विशेषज्ञ से जुड़ना चाहते हैं?`,
      ta: `🔬 AI நோய் பகுப்பாய்வு முடிந்தது!\n\n📊 கண்டறியப்பட்டது: ${mainDisease.name}\n🎯 நம்பிக்கை: ${mainDisease.confidence}%\n⚠️ தீவிரம்: ${mainDisease.severity}\n\n💊 பரிந்துரைக்கப்பட்ட சிகிச்சை:\n• செம்பு அடிப்படையிலான பூஞ்சைக் கொல்லியைப் பயன்படுத்தவும்\n• பாதிக்கப்பட்ட இலைகளை அகற்றவும்\n• காற்று சுழற்சியை மேம்படுத்தவும்\n• மேல் நீர்ப்பாசனத்தைத் தவிர்க்கவும்\n\n📞 உள்ளூர் விவசாய நிபுணருடன் இணைக்க விரும்புகிறீர்களா?`
    };

    const botMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      text: responses[language as keyof typeof responses] || responses.en,
      sender: 'bot',
      language,
      timestamp: new Date().toISOString(),
      type: 'text',
      metadata: {
        intent: 'disease_detection',
        confidence: mainDisease.confidence,
        entities: { disease: mainDisease.name, severity: mainDisease.severity }
      }
    };

    this.context.conversationHistory.push(botMessage);
    return botMessage;
  }
}

export const chatbotService = new ChatbotService();