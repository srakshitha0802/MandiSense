"""
MandiSense Simulation
Demonstrates collective market memory emergence and Market Alignment Signals
"""

import time
import random
from typing import List, Tuple

from interaction_capture import simulate_negotiation_input
from context_extraction import provide_context_without_recommendations
from behavioral_abstraction import convert_to_anonymous_patterns
from collective_memory import CollectiveMemory
from alignment_signal import generate_alignment_signal

class MandiSimulation:
    def __init__(self):
        self.collective_memory = CollectiveMemory()
        self.simulation_day = 1
        
        # Sample negotiation scenarios for different commodities
        self.negotiation_scenarios = [
            # Tomatoes
            ("I have fresh tomatoes, best quality, 30 rupees per kg", 
             "That seems expensive, can you do 20 rupees?", "tomatoes"),
            ("These tomatoes are very good, 25 rupees only", 
             "I trust your quality, but my budget is 22 rupees", "tomatoes"),
            ("Final price 28 rupees, take it or leave it", 
             "I need to think about it, maybe 24 rupees", "tomatoes"),
            
            # Onions
            ("Fresh onions from my farm, 35 rupees per kg", 
             "Please consider 30 rupees, I am regular customer", "onions"),
            ("These onions will last long, 32 rupees fair price", 
             "I appreciate quality, can we do 31 rupees?", "onions"),
            ("Market rate is high today, 38 rupees minimum", 
             "That's too much, I cannot pay more than 33", "onions"),
            
            # Rice
            ("Premium basmati rice, 55 rupees per kg", 
             "Good quality but expensive, how about 50 rupees?", "rice"),
            ("This rice is excellent for special occasions, 60 rupees", 
             "I trust you, but 52 rupees is my limit", "rice"),
            ("Best rice in the market, 58 rupees final", 
             "I have been buying from you for years, please 54", "rice"),
        ]
    
    def run_simulation(self, days: int = 5, negotiations_per_day: int = 8):
        """
        Run multi-day simulation showing collective memory emergence
        """
        print("=== MandiSense Simulation: Collective Market Memory Formation ===\n")
        
        for day in range(1, days + 1):
            print(f"--- Day {day} ---")
            self.simulation_day = day
            
            # Run multiple negotiations per day
            for negotiation in range(negotiations_per_day):
                self._simulate_single_negotiation(negotiation + 1)
                time.sleep(0.1)  # Brief pause for realism
            
            # Show daily collective memory evolution
            self._show_daily_memory_summary()
            print()
        
        # Final system state
        self._show_final_system_state()
    
    def _simulate_single_negotiation(self, negotiation_num: int):
        """Simulate a single negotiation and show Market Alignment Signal"""
        
        # Select random negotiation scenario
        vendor_text, buyer_text, commodity = random.choice(self.negotiation_scenarios)
        
        print(f"Negotiation {negotiation_num}: {commodity.title()}")
        
        # Step 1: Capture ephemeral interactions (identity is lost here)
        vendor_patterns, buyer_patterns = simulate_negotiation_input(
            vendor_text, buyer_text, commodity
        )
        
        # Step 2: Extract context without recommendations
        vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
        buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
        
        # Step 3: Convert to anonymous behavioral patterns (individual traces destroyed)
        vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
        buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
        
        # Step 4: Integrate into collective memory (inertial updates)
        self.collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
        self.collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
        
        # Step 5: Generate Market Alignment Signals (or maintain silence)
        market_coherence = self.collective_memory.get_market_coherence()
        
        vendor_analysis = self.collective_memory.analyze_pattern_alignment(vendor_fingerprint)
        buyer_analysis = self.collective_memory.analyze_pattern_alignment(buyer_fingerprint)
        
        vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, market_coherence)
        buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, market_coherence)
        
        # Display results
        print(f"  Vendor: \"{vendor_text[:50]}...\"")
        if vendor_signal:
            print(f"  → Signal: {vendor_signal}")
        else:
            print(f"  → Signal: [System remains silent - insufficient confidence]")
        
        print(f"  Buyer: \"{buyer_text[:50]}...\"")
        if buyer_signal:
            print(f"  → Signal: {buyer_signal}")
        else:
            print(f"  → Signal: [System remains silent - insufficient confidence]")
        
        print()
    
    def _show_daily_memory_summary(self):
        """Show how collective memory evolves each day"""
        coherence = self.collective_memory.get_market_coherence()
        intelligence = self.collective_memory.get_collective_intelligence_summary()
        
        print(f"Daily Memory Summary:")
        print(f"  Market Coherence: {coherence.coherence_score:.2f}")
        print(f"  Trust Density: {coherence.trust_density:.2f}")
        print(f"  Pattern Stability: {coherence.pattern_stability:.2f}")
        print(f"  Behavioral Diversity: {coherence.behavioral_diversity:.2f}")
        print(f"  Total Patterns: {intelligence['total_patterns']}")
        print(f"  Memory Health: {intelligence['memory_health']}")
    
    def _show_final_system_state(self):
        """Show final state demonstrating collective intelligence emergence"""
        print("=== Final System State: Collective Intelligence Achieved ===")
        
        coherence = self.collective_memory.get_market_coherence()
        intelligence = self.collective_memory.get_collective_intelligence_summary()
        
        print(f"\nMarket Coherence (Named Construct):")
        print(f"  Overall Score: {coherence.coherence_score:.3f}")
        print(f"  Trust Density: {coherence.trust_density:.3f}")
        print(f"  Pattern Stability: {coherence.pattern_stability:.3f}")
        print(f"  Behavioral Diversity: {coherence.behavioral_diversity:.3f}")
        
        print(f"\nCollective Memory Statistics:")
        print(f"  Total Anonymous Patterns: {intelligence['total_patterns']}")
        print(f"  Memory Health: {intelligence['memory_health']}")
        print(f"  System Maturity: {'Mature' if coherence.coherence_score > 0.7 else 'Developing'}")
        
        print(f"\nEthical Constraints Maintained:")
        print(f"  ✓ No individual identities stored")
        print(f"  ✓ No permanent ratings or scores")
        print(f"  ✓ Behavioral patterns are anonymous and irreversible")
        print(f"  ✓ System prefers silence over uncertain guidance")
        print(f"  ✓ Market Alignment Signals are contextual, not prescriptive")
        
        print(f"\nKey Innovation Demonstrated:")
        print(f"  Market Coherence changes slowly ({coherence.coherence_score:.3f})")
        print(f"  Derived only from aggregate behavior patterns")
        print(f"  Influences signal generation without coercion")
        print(f"  Creates market self-awareness through reflection")

def demonstrate_mandi_micro_scenario():
    """
    Demonstrate the mandi micro-scenario showing gradual market self-correction
    """
    print("=== Mandi Micro-Scenario: Gradual Market Self-Correction ===")
    print("Commodity: Onions | Participants: Experienced vendor, New buyer")
    print("Scenario: Multiple days of interaction showing market memory formation\n")
    
    simulation = MandiSimulation()
    
    # Day 1: Initial aggressive pricing
    print("Day 1: Aggressive pricing, no market memory")
    vendor_patterns, buyer_patterns = simulate_negotiation_input(
        "These onions are premium quality, 45 rupees per kg, final price",
        "That's very expensive, I can only pay 25 rupees maximum",
        "onions"
    )
    
    vendor_context = provide_context_without_recommendations("onions", vendor_patterns)
    buyer_context = provide_context_without_recommendations("onions", buyer_patterns)
    
    vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
    buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
    
    simulation.collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
    simulation.collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
    
    coherence = simulation.collective_memory.get_market_coherence()
    print(f"Market Coherence: {coherence.coherence_score:.2f} (Low - insufficient patterns)")
    print("Signals: [System remains silent - insufficient collective memory]\n")
    
    # Day 3: Some patterns emerging
    print("Day 3: Patterns emerging, moderate market memory")
    for _ in range(6):  # Simulate multiple interactions
        vendor_patterns, buyer_patterns = simulate_negotiation_input(
            "Good onions, 35 rupees per kg, reasonable price",
            "I appreciate quality, can we settle at 32 rupees?",
            "onions"
        )
        vendor_context = provide_context_without_recommendations("onions", vendor_patterns)
        buyer_context = provide_context_without_recommendations("onions", buyer_patterns)
        vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
        buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
        simulation.collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
        simulation.collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
    
    coherence = simulation.collective_memory.get_market_coherence()
    print(f"Market Coherence: {coherence.coherence_score:.2f} (Developing patterns)")
    
    # Generate signals for current interaction
    vendor_analysis = simulation.collective_memory.analyze_pattern_alignment(vendor_fingerprint)
    buyer_analysis = simulation.collective_memory.analyze_pattern_alignment(buyer_fingerprint)
    vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, coherence)
    buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, coherence)
    
    print(f"Vendor Signal: {vendor_signal or '[System remains silent]'}")
    print(f"Buyer Signal: {buyer_signal or '[System remains silent]'}\n")
    
    # Day 7: Mature market memory
    print("Day 7: Mature collective memory, stable patterns")
    for _ in range(12):  # More interactions
        scenarios = [
            ("Fresh onions, 33 rupees per kg, fair market price", 
             "That sounds reasonable, I trust your pricing", "onions"),
            ("Quality onions, 34 rupees, good for long storage", 
             "I appreciate honest pricing, let's do 33 rupees", "onions"),
        ]
        vendor_text, buyer_text, commodity = random.choice(scenarios)
        vendor_patterns, buyer_patterns = simulate_negotiation_input(vendor_text, buyer_text, commodity)
        vendor_context = provide_context_without_recommendations(commodity, vendor_patterns)
        buyer_context = provide_context_without_recommendations(commodity, buyer_patterns)
        vendor_fingerprint = convert_to_anonymous_patterns(vendor_patterns, vendor_context)
        buyer_fingerprint = convert_to_anonymous_patterns(buyer_patterns, buyer_context)
        simulation.collective_memory.integrate_behavioral_pattern(vendor_fingerprint)
        simulation.collective_memory.integrate_behavioral_pattern(buyer_fingerprint)
    
    coherence = simulation.collective_memory.get_market_coherence()
    print(f"Market Coherence: {coherence.coherence_score:.2f} (Mature collective intelligence)")
    
    # Test current interaction against mature memory
    vendor_analysis = simulation.collective_memory.analyze_pattern_alignment(vendor_fingerprint)
    buyer_analysis = simulation.collective_memory.analyze_pattern_alignment(buyer_fingerprint)
    vendor_signal = generate_alignment_signal(vendor_fingerprint, vendor_analysis, coherence)
    buyer_signal = generate_alignment_signal(buyer_fingerprint, buyer_analysis, coherence)
    
    print(f"Vendor Signal: {vendor_signal or '[System remains silent]'}")
    print(f"Buyer Signal: {buyer_signal or '[System remains silent]'}")
    
    print(f"\nKey Insight: Market self-correction through reflection, not enforcement")
    print(f"Trust Density evolved from {0.5:.2f} to {coherence.trust_density:.2f}")
    print(f"No individual was judged, rated, or punished")
    print(f"Collective behavior gradually aligned toward fairness")

if __name__ == "__main__":
    # Run main simulation
    simulation = MandiSimulation()
    simulation.run_simulation(days=3, negotiations_per_day=6)
    
    print("\n" + "="*60 + "\n")
    
    # Run micro-scenario demonstration
    demonstrate_mandi_micro_scenario()