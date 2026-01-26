import React, { useState, useCallback } from 'react';
import { Mic, ArrowRight, TrendingUp, MessageCircle, CheckCircle } from 'lucide-react';

export default function MandiSenseWireframes() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [negotiationData, setNegotiationData] = useState({
    vendorText: '',
    buyerText: '',
    commodity: 'tomatoes'
  });
  const [marketData, setMarketData] = useState({
    coherence: 0.425,
    trustDensity: 0.598,
    patternStability: 0.321
  });
  const [alignmentSignal, setAlignmentSignal] = useState(
    "This agreement aligns with today's typical pricing patterns. The negotiation reflected balanced market behavior."
  );

  // Process negotiation function - defined before use
  const processNegotiation = useCallback(async () => {
    if (!negotiationData.vendorText || !negotiationData.buyerText) {
      alert('Please enter both vendor and buyer messages');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/simulate_negotiation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_text: negotiationData.vendorText,
          buyer_text: negotiationData.buyerText,
          commodity: negotiationData.commodity
        })
      });

      const data = await response.json();
      
      // Update market data
      setMarketData({
        coherence: data.market_context.coherence,
        trustDensity: data.market_context.trust_density,
        patternStability: data.market_context.pattern_stability
      });

      // Store signal for alignment screen
      setAlignmentSignal(data.vendor.signal || data.buyer.signal || 
        "[System maintains silence - insufficient confidence for meaningful guidance]");

      alert('Negotiation processed! View Market Context to see updated collective memory.');
      
    } catch (error) {
      console.error('Error processing negotiation:', error);
      alert('Error processing negotiation');
    }
  }, [negotiationData]);

  // Generate live signal function
  const generateLiveSignal = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/generate_signal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_text: negotiationData.vendorText || 'Quality produce, 26 rupees per kg, fair price',
          buyer_text: negotiationData.buyerText || 'I trust your quality, 25 rupees works',
          commodity: negotiationData.commodity
        })
      });

      const data = await response.json();
      setAlignmentSignal(data.signal);
      
      // Update market data
      setMarketData(prev => ({
        ...prev,
        coherence: data.market_coherence,
        trustDensity: data.trust_density
      }));

    } catch (error) {
      console.error('Error generating signal:', error);
      setAlignmentSignal('[System maintains silence - connection error]');
    }
  }, [negotiationData]);

  const screens = [
    {
      title: "Screen 1: Negotiation & Translation",
      description: "Real-time multilingual interaction",
      component: <NegotiationScreen 
        negotiationData={negotiationData}
        setNegotiationData={setNegotiationData}
        processNegotiation={processNegotiation}
      />
    },
    {
      title: "Screen 2: Market Context",
      description: "Live price bands and demand signals",
      component: <MarketContextScreen marketData={marketData} />
    },
    {
      title: "Screen 3: Alignment Reflection",
      description: "Non-punitive collective feedback",
      component: <AlignmentScreen 
        alignmentSignal={alignmentSignal}
        generateLiveSignal={generateLiveSignal}
      />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">MandiSense Interface</h1>
          <p className="text-slate-600">Mobile-first design for informal market negotiations</p>
          <div className="mt-2 text-sm">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Live System</span>
            <span className="ml-2 text-slate-600">Coherence: {marketData.coherence.toFixed(3)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {screens.map((screen, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScreen(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeScreen === idx
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-2">{screens[activeScreen].title}</h2>
          <p className="text-slate-600 text-sm mb-6">{screens[activeScreen].description}</p>
          {screens[activeScreen].component}
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4">
          <p className="text-slate-700 text-sm text-center">
            <strong>Design Philosophy:</strong> Every element serves comprehension, not persuasion. The interface disappears into the negotiation.
          </p>
        </div>
      </div>
    </div>
  );
}

function NegotiationScreen({ negotiationData, setNegotiationData, processNegotiation }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-700 font-bold text-sm">V</span>
            </div>
            <div>
              <div className="text-xs text-slate-500">Vendor</div>
              <div className="text-sm font-medium text-slate-700">Speaking Telugu</div>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
            Active
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-3">
          <div className="text-xs text-slate-500 mb-1">Commodity selected:</div>
          <select 
            value={negotiationData.commodity}
            onChange={(e) => setNegotiationData(prev => ({...prev, commodity: e.target.value}))}
            className="text-lg font-bold text-slate-800 bg-transparent border-none outline-none"
          >
            <option value="tomatoes">Tomatoes, 50kg</option>
            <option value="onions">Onions, 30kg</option>
            <option value="rice">Rice, 25kg</option>
          </select>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
            <div className="text-xs text-blue-600 mb-1">Vendor (Telugu)</div>
            <input
              type="text"
              value={negotiationData.vendorText}
              onChange={(e) => setNegotiationData(prev => ({...prev, vendorText: e.target.value}))}
              placeholder="నేను 25 రూపాయలు కిలో ఇవ్వగలను"
              className="w-full text-slate-800 font-medium bg-transparent border-none outline-none"
            />
            <div className="text-xs text-slate-500 mt-2">Translated: "I can offer ₹25 per kg"</div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
            <div className="text-xs text-green-600 mb-1">Buyer (Hindi)</div>
            <input
              type="text"
              value={negotiationData.buyerText}
              onChange={(e) => setNegotiationData(prev => ({...prev, buyerText: e.target.value}))}
              placeholder="यह बहुत ज्यादा है। ₹20 में दे सकते हैं?"
              className="w-full text-slate-800 font-medium bg-transparent border-none outline-none"
            />
            <div className="text-xs text-slate-500 mt-2">Translated: "That's too much. Can you do ₹20?"</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={processNegotiation}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Mic className="w-5 h-5" />
          Process Negotiation
        </button>
        <button 
          onClick={() => setNegotiationData(prev => ({...prev, vendorText: '', buyerText: ''}))}
          className="px-6 bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="text-xs text-slate-500 text-center">
        Conversation is private. No recording. No identity tracking.
      </div>
    </div>
  );
}

function MarketContextScreen({ marketData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border-2 border-indigo-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-indigo-900">Today's Market Context</h3>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-xs text-slate-600 mb-2">Typical Price Range (Tomatoes)</div>
            <div className="relative h-8 bg-white rounded-lg overflow-hidden border border-slate-200">
              <div className="absolute inset-0 flex items-center px-3">
                <div className="flex-1 relative">
                  <div className="h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full"></div>
                  <div className="absolute left-0 top-0 h-full flex items-center">
                    <span className="text-xs font-medium text-slate-700">₹18</span>
                  </div>
                  <div className="absolute right-0 top-0 h-full flex items-center">
                    <span className="text-xs font-medium text-slate-700">₹24</span>
                  </div>
                  <div className="absolute left-1/2 top-0 h-full flex items-center -ml-4">
                    <div className="w-8 h-4 bg-indigo-600 rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1 text-center">Current offer: ₹25/kg</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Market Coherence</div>
              <div className="text-lg font-bold text-slate-800">{marketData.coherence.toFixed(3)}</div>
              <div className="text-xs text-slate-500">Collective intelligence</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="text-xs text-slate-600 mb-1">Trust Density</div>
              <div className="text-lg font-bold text-slate-800">{marketData.trustDensity.toFixed(3)}</div>
              <div className="text-xs text-slate-500">Market trust level</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
        <div className="text-xs text-amber-800 mb-2 font-medium">Context Note</div>
        <div className="text-sm text-slate-700">
          This context reflects collective behavioral patterns from anonymous interactions. It does not suggest a "correct" price—only what patterns emerge from the market.
        </div>
      </div>

      <div className="text-center">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
          Continue Negotiation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AlignmentScreen({ alignmentSignal, generateLiveSignal }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Deal Completed</h3>
        <div className="text-slate-600 mt-1">₹22 per kg • 50kg • Total: ₹1,100</div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-bold text-blue-900">Market Alignment Signal</h4>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
          <p className="text-slate-800 leading-relaxed">
            {alignmentSignal}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Similar Deals Today</div>
            <div className="text-lg font-bold text-slate-800">47</div>
            <div className="text-xs text-slate-500">Range: ₹20-₹24/kg</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="text-xs text-slate-600 mb-1">Market Consistency</div>
            <div className="text-lg font-bold text-green-600">High</div>
            <div className="text-xs text-slate-500">Fair trading pattern</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 border-2 border-slate-200">
        <div className="text-xs text-slate-600 mb-2 font-medium">What This Means</div>
        <div className="text-sm text-slate-700 space-y-2">
          <p>This signal reflects collective market behavior, not individual judgment. It helps both parties understand how this deal compares to anonymous patterns.</p>
          <p className="text-xs text-slate-500">No scores are saved. No identities are tracked. This reflection exists only for this transaction.</p>
        </div>
      </div>

      <div className="space-y-3">
        <button 
          onClick={generateLiveSignal}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Generate Live Signal from Backend
        </button>
        <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors">
          Start New Negotiation
        </button>
      </div>
    </div>
  );
}