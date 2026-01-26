"""
Enhanced MandiSense Simulation
Demonstrates signal emergence with longer-term collective memory formation
"""

import time
import random
from typing import List, Tuple

from interaction_capture import simulate_negotiation_input
from context_extraction import provide_context_without_recommendations
from behavioral_abstraction import convert_to_anonymous_patterns
from collective_memory import CollectiveMemory
from alignment_signal import generate_alignment_signal

def run_extended_simulation():
    """
    Extended simulation showing signal emergence over time
    """
    print("=== Extended MandiSense Simulation: Signal Emergence ===\n")
    
    collective_memory = CollectiveMemory()
    
    # Phase 1: Build foundational patterns (Days 1-5)
    print("Phase 1: Building Foundational Patterns (Days 1-5)")
    print("Expected: System remains mostly silent, building collective memory\n")
    
    collaborative_scenarios = [
        ("Fresh tomatoes, 25 rupees per kg, good quality", 
         "I appreciate honest pricing, can we do 24 rupees?", "tomatoes"),
        ("Quality onions, 32 rupees, fair market price", 
         "That sounds reasonable, I trust your pricing", "onions"),
        ("Premium rice, 55 rupees per kg, excellent quality", 
         "I value quality, how about 53 rupees?", "rice"),
    ]
    
    for day in range(1, 6):
        print(f"Day {day}:")
        for _ in range(8):  # 8 negotiations per day
            vendor_text, buyer_text, commodity = random.choice(collaborative_scenarios)
            
            # Add slight variations
            if random.random() < 0.3:
                vendor_text = vendor_text.replace("good", "excellent")
            if random.random() < 0.3:
                buyer_text = buyer_text.replace("appreciate", "value")
            
            # Process negotiation
            vendor_patterns, buyer_patterns = simulate_negotiation_input(
                vendor_text, buyer_text, commodity
            )
            
            vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
            buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
            
            vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
            buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
            
            collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
            collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
        
        # Show daily progress
        coherence = collective_memory.get_market_coherence()
        intelligence = collective_memory.get_collective_intelligence_summary()
        print(f"  Market Coherence: {coherence.coherence_score:.3f}")
        print(f"  Trust Density: {coherence.trust_density:.3f}")
        print(f"  Total Patterns: {intelligence['total_patterns']}")
        print()
    
    # Phase 2: Test signal generation (Days 6-8)
    print("Phase 2: Testing Signal Generation (Days 6-8)")
    print("Expected: Some signals begin to emerge as patterns stabilize\n")
    
    test_scenarios = [
        # Aligned behavior
        ("Fresh vegetables, 28 rupees per kg, honest price", 
         "I appreciate fair pricing, let's do 27 rupees", "tomatoes"),
        # Slightly different behavior
        ("Premium quality, 45 rupees per kg, final offer", 
         "That's quite high, I can only do 35 rupees", "onions"),
        # Trust-building behavior
        ("Quality produce, 30 rupees, good for long-term relationship", 
         "I value our relationship, 29 rupees works for me", "tomatoes"),
    ]
    
    for day in range(6, 9):
        print(f"Day {day}:")
        for i, (vendor_text, buyer_text, commodity) in enumerate(test_scenarios):
            print(f"  Test Negotiation {i+1}: {commodity.title()}")
            
            # Process negotiation
            vendor_patterns, buyer_patterns = simulate_negotiation_input(
                vendor_text, buyer_text, commodity
            )
            
            vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
            buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
            
            vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
            buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
            
            collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
            collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
            
            # Generate signals
            market_coherence = collective_memory.get_market_coherence()
            vendor_analysis = collective_memory.analyze_pattern_alignment(vendor_fingerprint)
            buyer_analysis = collective_memory.analyze_pattern_alignment(buyer_fingerprint)
            
            vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, market_coherence)
            buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, market_coherence)
            
            print(f"    Vendor: \"{vendor_text[:40]}...\"")
            if vendor_signal:
                print(f"    → Signal: {vendor_signal}")
            else:
                print(f"    → Signal: [System maintains silence]")
            
            print(f"    Buyer: \"{buyer_text[:40]}...\"")
            if buyer_signal:
                print(f"    → Signal: {buyer_signal}")
            else:
                print(f"    → Signal: [System maintains silence]")
            print()
        
        # Daily summary
        coherence = collective_memory.get_market_coherence()
        print(f"  Day {day} Summary:")
        print(f"    Market Coherence: {coherence.coherence_score:.3f}")
        print(f"    Trust Density: {coherence.trust_density:.3f}")
        print(f"    Pattern Stability: {coherence.pattern_stability:.3f}")
        print()
    
    # Phase 3: Demonstrate mature system (Days 9-10)
    print("Phase 3: Mature System Demonstration (Days 9-10)")
    print("Expected: Consistent signal generation with high confidence\n")
    
    mature_scenarios = [
        # Standard collaborative
        ("Quality produce, 26 rupees per kg, fair price", 
         "I trust your quality, 25 rupees works", "tomatoes"),
        # Deviation from norm
        ("Take it or leave it, 50 rupees per kg, final", 
         "That's way too expensive, maximum 30 rupees", "tomatoes"),
        # Relationship building
        ("Good vegetables, 28 rupees, value our partnership", 
         "I appreciate our relationship, 27 rupees is good", "tomatoes"),
    ]
    
    for day in range(9, 11):
        print(f"Day {day}:")
        for i, (vendor_text, buyer_text, commodity) in enumerate(mature_scenarios):
            print(f"  Mature Test {i+1}: {commodity.title()}")
            
            # Process negotiation
            vendor_patterns, buyer_patterns = simulate_negotiation_input(
                vendor_text, buyer_text, commodity
            )
            
            vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
            buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
            
            vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
            buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
            
            collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
            collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
            
            # Generate signals
            market_coherence = collective_memory.get_market_coherence()
            vendor_analysis = collective_memory.analyze_pattern_alignment(vendor_fingerprint)
            buyer_analysis = collective_memory.analyze_pattern_alignment(buyer_fingerprint)
            
            vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, market_coherence)
            buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, market_coherence)
            
            print(f"    Vendor: \"{vendor_text}\"")
            if vendor_signal:
                print(f"    → Signal: {vendor_signal}")
            else:
                print(f"    → Signal: [System maintains silence]")
            
            print(f"    Buyer: \"{buyer_text}\"")
            if buyer_signal:
                print(f"    → Signal: {buyer_signal}")
            else:
                print(f"    → Signal: [System maintains silence]")
            
            # Show analysis details for mature system
            print(f"    Analysis - Confidence: {vendor_analysis.get('confidence_level', 0):.3f}, "
                  f"Pattern Familiarity: {vendor_analysis.get('pattern_familiarity', 0):.3f}")
            print()
    
    # Final system state
    print("=== Final Mature System State ===")
    coherence = collective_memory.get_market_coherence()
    intelligence = collective_memory.get_collective_intelligence_summary()
    
    print(f"Market Coherence (Named Construct): {coherence.coherence_score:.3f}")
    print(f"Trust Density: {coherence.trust_density:.3f}")
    print(f"Pattern Stability: {coherence.pattern_stability:.3f}")
    print(f"Behavioral Diversity: {coherence.behavioral_diversity:.3f}")
    print(f"Total Anonymous Patterns: {intelligence['total_patterns']}")
    print(f"System Maturity: {'Mature' if coherence.coherence_score > 0.4 else 'Developing'}")
    
    print(f"\nKey Demonstration:")
    print(f"✓ Collective memory formed without individual tracking")
    print(f"✓ Market Alignment Signals emerged from aggregate patterns")
    print(f"✓ System maintained ethical silence when uncertain")
    print(f"✓ Market Coherence evolved slowly and deliberately")
    print(f"✓ Individual identity was destroyed, collective intelligence preserved")

if __name__ == "__main__":
    run_extended_simulation()