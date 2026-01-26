"""
Web Backend for MandiSense
Serves the HTML interface and provides API endpoints for live signal generation
"""

from flask import Flask, render_template_string, jsonify, request
from flask_cors import CORS
import json
import random

from interaction_capture import simulate_negotiation_input
from context_extraction import provide_context_without_recommendations
from behavioral_abstraction import convert_to_anonymous_patterns
from collective_memory import CollectiveMemory
from alignment_signal import generate_alignment_signal

app = Flask(__name__)
CORS(app)

# Global collective memory instance
collective_memory = CollectiveMemory()

# Pre-populate with some patterns for demonstration
def initialize_collective_memory():
    """Initialize collective memory with sample patterns"""
    sample_negotiations = [
        ("Fresh tomatoes, 25 rupees per kg, good quality", 
         "I appreciate honest pricing, can we do 24 rupees?", "tomatoes"),
        ("Quality onions, 32 rupees, fair market price", 
         "That sounds reasonable, I trust your pricing", "onions"),
        ("Premium rice, 55 rupees per kg, excellent quality", 
         "I value quality, how about 53 rupees?", "rice"),
        ("Good vegetables, 28 rupees, value our partnership", 
         "I appreciate our relationship, 27 rupees is good", "tomatoes"),
        ("Fresh produce, 30 rupees per kg, honest price", 
         "I trust your quality, let's do 29 rupees", "tomatoes"),
    ]
    
    for vendor_text, buyer_text, commodity in sample_negotiations:
        # Process multiple times to build patterns
        for _ in range(3):
            vendor_patterns, buyer_patterns = simulate_negotiation_input(
                vendor_text, buyer_text, commodity
            )
            
            vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
            buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
            
            vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
            buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
            
            collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
            collective_memory.integrate_behavioral_pattern(buyer_fingerprint)

@app.route('/')
def index():
    """Serve the main HTML interface"""
    with open('index.html', 'r') as f:
        return f.read()

@app.route('/api/generate_signal', methods=['POST'])
def generate_signal():
    """Generate a live Market Alignment Signal"""
    try:
        data = request.get_json()
        
        # Get negotiation details from request
        vendor_text = data.get('vendor_text', 'Quality produce, 26 rupees per kg, fair price')
        buyer_text = data.get('buyer_text', 'I trust your quality, 25 rupees works')
        commodity = data.get('commodity', 'tomatoes')
        
        # Process the negotiation
        vendor_patterns, buyer_patterns = simulate_negotiation_input(
            vendor_text, buyer_text, commodity
        )
        
        vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
        buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
        
        vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
        buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
        
        # Integrate into collective memory
        collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
        collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
        
        # Generate signals
        market_coherence = collective_memory.get_market_coherence()
        vendor_analysis = collective_memory.analyze_pattern_alignment(vendor_fingerprint)
        buyer_analysis = collective_memory.analyze_pattern_alignment(buyer_fingerprint)
        
        vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, market_coherence)
        buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, market_coherence)
        
        # Return the signal (prefer vendor signal, fallback to buyer signal, then silence)
        signal_text = vendor_signal or buyer_signal or "[System maintains silence - insufficient confidence for meaningful guidance]"
        
        return jsonify({
            'signal': signal_text,
            'market_coherence': market_coherence.coherence_score,
            'trust_density': market_coherence.trust_density,
            'pattern_stability': market_coherence.pattern_stability,
            'confidence': vendor_analysis.get('confidence_level', 0.0),
            'pattern_familiarity': vendor_analysis.get('pattern_familiarity', 0.0)
        })
        
    except Exception as e:
        return jsonify({
            'signal': '[System maintains silence - processing error]',
            'error': str(e)
        }), 500

@app.route('/api/market_context', methods=['GET'])
def get_market_context():
    """Get current market context and collective memory state"""
    try:
        coherence = collective_memory.get_market_coherence()
        intelligence = collective_memory.get_collective_intelligence_summary()
        
        return jsonify({
            'market_coherence': coherence.coherence_score,
            'trust_density': coherence.trust_density,
            'pattern_stability': coherence.pattern_stability,
            'behavioral_diversity': coherence.behavioral_diversity,
            'total_patterns': intelligence['total_patterns'],
            'memory_health': intelligence['memory_health'],
            'system_maturity': 'Mature' if coherence.coherence_score > 0.4 else 'Developing'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/api/simulate_negotiation', methods=['POST'])
def simulate_negotiation():
    """Simulate a complete negotiation flow"""
    try:
        data = request.get_json()
        
        vendor_text = data.get('vendor_text', 'Fresh tomatoes, 25 rupees per kg')
        buyer_text = data.get('buyer_text', 'Can you do 22 rupees per kg?')
        commodity = data.get('commodity', 'tomatoes')
        
        # Process negotiation
        vendor_patterns, buyer_patterns = simulate_negotiation_input(
            vendor_text, buyer_text, commodity
        )
        
        # Get market context
        vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
        buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
        
        # Convert to behavioral patterns
        vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
        buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
        
        # Integrate into collective memory
        collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
        collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
        
        # Generate alignment signals
        market_coherence = collective_memory.get_market_coherence()
        vendor_analysis = collective_memory.analyze_pattern_alignment(vendor_fingerprint)
        buyer_analysis = collective_memory.analyze_pattern_alignment(buyer_fingerprint)
        
        vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, market_coherence)
        buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, market_coherence)
        
        return jsonify({
            'vendor': {
                'patterns': vendor_patterns,
                'signal': vendor_signal,
                'analysis': vendor_analysis
            },
            'buyer': {
                'patterns': buyer_patterns,
                'signal': buyer_signal,
                'analysis': buyer_analysis
            },
            'market_context': {
                'coherence': market_coherence.coherence_score,
                'trust_density': market_coherence.trust_density,
                'pattern_stability': market_coherence.pattern_stability
            }
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Initializing MandiSense collective memory...")
    initialize_collective_memory()
    
    coherence = collective_memory.get_market_coherence()
    print(f"Initial Market Coherence: {coherence.coherence_score:.3f}")
    print(f"Initial Trust Density: {coherence.trust_density:.3f}")
    print("MandiSense web interface starting...")
    print("Open http://localhost:8080 in your browser")
    
    app.run(debug=True, host='0.0.0.0', port=8080)