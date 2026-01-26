import React, { useState, useEffect } from 'react';
import { Mic, ArrowRight, TrendingUp, MessageCircle, CheckCircle } from 'lucide-react';

// API configuration
const API_BASE = 'http://localhost:8000/api';

export default function MandiSenseWireframes() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [marketData, setMarketData] = useState({
    coherence: 0,
    trustDensity: 0,
    patternStability: 0
  });
  const [negotiationData, setNegotiationData] = useState({
    vendorText: '',
    buyerText: '',
    commodity: 'tomatoes'
  });
  const [alignmentSignal, setAlignmentSignal] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const screens = [
    {
      title: "Negotiation & Translation",
      description: "Real-time multilingual exchange without recording or identity capture",
      component: <NegotiationScreen 
        negotiationData={negotiationData}
        setNegotiationData={setNegotiationData}
        onProcessNegotiation={processNegotiation}
        isLoading={isLoading}
      />
    },
    {
      title: "Market Context",
      description: "Recent collective behavior, presented without recommendation",
      component: <MarketContextScreen marketData={marketData} />
    },
    {
      title: "Alignment Reflection",
      description: "Post-deal reflection shown only when a clear pattern exists",
      component: <AlignmentScreen 
        alignmentSignal={alignmentSignal}
        onGenerateSignal={generateLiveSignal}
        isLoading={isLoading}
      />
    }
  ];

  // Load market context on component mount
  useEffect(() => {
    loadMarketContext();
  }, []);

  const loadMarketContext = async () => {
    try {
      const response = await fetch(`${API_BASE}/market_context`);
      const data = await response.json();
      setMarketData({
        coherence: data.market_coherence,
        trustDensity: data.trust_density,
        patternStability: data.pattern_stability
      });
    } catch (error) {
      console.error('Error loading market context:', error);
    }
  };

  const processNegotiation = async () => {
    if (!negotiationData.vendorText || !negotiationData.buyerText) {
      alert('Please enter both vendor and buyer messages');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/simulate_negotiation`, {
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

      // Store signals for alignment screen
      setAlignmentSignal(data.vendor.signal || data.buyer.signal || '[System maintains silence - insufficient confidence]');

      alert('Negotiation processed! View Market Context to see updated collective memory.');
      
    } catch (error) {
      console.error('Error processing negotiation:', error);
      alert('Error processing negotiation');
    } finally {
      setIsLoading(false);
    }
  };

  const generateLiveSignal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/generate_signal`, {
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
      
    } catch (error) {
      console.error('Error generating signal:', error);
      setAlignmentSignal('[System maintains silence - connection error]');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">MandiSense</h1>
          <p className="text-slate-600">A reflective interface for informal market negotiations</p>
          <div className="mt-2 text-sm text-slate-500">
            Market Coherence: {marketData.coherence.toFixed(3)} | Trust Density: {marketData.trustDensity.toFixed(3)}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {screens.map((_, idx) => (
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

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p className="text-slate-700 text-sm text-center">
            This interface does not guide outcomes. It reflects patterns only when they naturally emerge.
          </p>
        </div>
      </div>
    </div>
  );
}

function NegotiationScreen({ negotiationData, setNegotiationData, onProcessNegotiation, isLoading }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-slate-500">Vendor speaking Telugu</div>
            <div className="text-sm font-medium text-slate-700">
              <select 
                value={negotiationData.commodity}
                onChange={(e) => setNegotiationData({...negotiationData, commodity: e.target.value})}
                className="bg-transparent border-none outline-none"
              >
                <option value="tomatoes">Tomatoes • 50kg</option>
                <option value="onions">Onions • 30kg</option>
                <option value="rice">Rice • 25kg</option>
              </select>
            </div>
          </div>
          <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">Live</span>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-slate-500">Vendor message</div>
            <input
              type="text"
              value={negotiationData.vendorText}
              onChange={(e) => setNegotiationData({...negotiationData, vendorText: e.target.value})}
              placeholder="Enter vendor's offer..."
              className="w-full text-slate-800 bg-transparent border-none outline-none"
            />
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-xs text-slate-500">Buyer response</div>
            <input
              type="text"
              value={negotiationData.buyerText}
              onChange={(e) => setNegotiationData({...negotiationData, buyerText: e.target.value})}
              placeholder="Enter buyer's response..."
              className="w-full text-slate-800 bg-transparent border-none outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onProcessNegotiation}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50"
        >
          <Mic className="w-5 h-5" />
          {isLoading ? 'Processing...' : 'Process Negotiation'}
        </button>
        <button 
          onClick={() => setNegotiationData({...negotiationData, vendorText: '', buyerText: ''})}
          className="px-6 bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300"
        >
          Clear
        </button>
      </div>

      <div className="text-xs text-slate-500 text-center">
        Conversations are ephemeral. No storage. No attribution.
      </div>
    </div>
  );
}

function MarketContextScreen({ marketData }) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Recent Market Activity</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-slate-600">Market Coherence</div>
            <div className="text-lg font-bold text-slate-800">{marketData.coherence.toFixed(3)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-slate-600">Trust Density</div>
            <div className="text-lg font-bold text-slate-800">{marketData.trustDensity.toFixed(3)}</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="text-xs text-slate-600">Pattern Stability</div>
            <div className="text-lg font-bold text-slate-800">{marketData.patternStability.toFixed(3)}</div>
          </div>
        </div>

        <p className="text-sm text-slate-700 mb-4">
          Recent transactions today tended to settle within patterns that reflect collective market behavior.
        </p>
        <div className="text-xs text-slate-600">
          Context reflects anonymized outcomes from collective memory. It does not indicate a fair or expected price.
        </div>
      </div>

      <div className="text-center">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-indigo-700">
          Return to Negotiation <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function AlignmentScreen({ alignmentSignal, onGenerateSignal, isLoading }) {
  const patternAvailable = alignmentSignal && !alignmentSignal.includes('System maintains silence');

  if (!patternAvailable && alignmentSignal) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
        <p className="text-slate-700 font-medium">No clear market pattern emerged today.</p>
        <p className="text-xs text-slate-500 mt-2">
          Alignment reflections appear only when collective behavior stabilizes.
        </p>
        <button 
          onClick={onGenerateSignal}
          disabled={isLoading}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Try Generate Signal'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-slate-800">Transaction Completed</h3>
        <p className="text-slate-600">₹22 per kg • 50kg</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Market Alignment Reflection</h4>
        </div>
        <p className="text-slate-800">
          {alignmentSignal || 'Deals concluded today tended to resolve within a similar range. This agreement followed the same general pattern.'}
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <p className="text-sm text-slate-700">
          This reflection is not an evaluation. It is a momentary view of how the market behaved today.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          No scores are retained. No profiles are created.
        </p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onGenerateSignal}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Generating Live Signal...' : 'Generate Live Signal'}
        </button>
        <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-300">
          Start New Negotiation
        </button>
      </div>
    </div>
  );
}