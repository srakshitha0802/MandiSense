"""
Market Alignment Signal Generator
Pure function that generates contextual reflections or maintains silence
"""

from typing import Optional, Dict
from behavioral_abstraction import BehavioralFingerprint
from collective_memory import MarketCoherence

class AlignmentSignalGenerator:
    def __init__(self):
        # Confidence thresholds for signal generation
        self._minimum_confidence = 0.15  # Lower threshold to show signals
        self._high_confidence = 0.5   # Adjusted for realistic scenarios
        
        # Silence-first approach - prefer no signal over misleading signal
        self._silence_preference = True
    
    def generate_market_alignment_signal(
        self, 
        fingerprint: BehavioralFingerprint, 
        alignment_analysis: Dict,
        market_coherence: MarketCoherence
    ) -> Optional[str]:
        """
        Generate Market Alignment Signal or return None (silence)
        Pure function - no side effects, no persistence
        """
        # Silence-first logic - explicit preference for no signal
        confidence = alignment_analysis.get('confidence_level', 0.0)
        
        if confidence < self._minimum_confidence:
            # System chooses silence over uncertain guidance
            return None
        
        # Analyze behavioral alignment with collective patterns
        signal_type = self._determine_signal_type(fingerprint, alignment_analysis, market_coherence)
        
        if signal_type == 'insufficient_data':
            # Explicit silence when data is insufficient
            return None
        
        # Generate contextual reflection based on collective patterns
        signal_text = self._generate_contextual_reflection(
            signal_type, 
            alignment_analysis, 
            market_coherence,
            confidence
        )
        
        return signal_text
    
    def _determine_signal_type(
        self, 
        fingerprint: BehavioralFingerprint, 
        analysis: Dict,
        coherence: MarketCoherence
    ) -> str:
        """Determine type of alignment signal to generate"""
        
        pattern_familiarity = analysis.get('pattern_familiarity', 0.0)
        trust_alignment = analysis.get('trust_alignment', 0.0)
        coherence_score = coherence.coherence_score
        
        # Insufficient data check - prefer silence
        if pattern_familiarity < 0.3 and coherence_score < 0.5:
            return 'insufficient_data'
        
        # Strong positive alignment
        if (trust_alignment > 0.8 and 
            pattern_familiarity > 0.7 and 
            fingerprint.market_alignment == 'market_building'):
            return 'strong_positive_alignment'
        
        # Moderate positive alignment
        if (trust_alignment > 0.6 and 
            pattern_familiarity > 0.5):
            return 'moderate_positive_alignment'
        
        # Pattern deviation (not judgment, just observation)
        if (pattern_familiarity < 0.3 and 
            coherence_score > 0.6):
            return 'pattern_deviation'
        
        # Trust pattern observation
        if trust_alignment < 0.4 and coherence.trust_density > 0.7:
            return 'trust_pattern_observation'
        
        # Default to neutral observation
        return 'neutral_observation'
    
    def _generate_contextual_reflection(
        self, 
        signal_type: str, 
        analysis: Dict, 
        coherence: MarketCoherence,
        confidence: float
    ) -> str:
        """
        Generate contextual reflection based on collective patterns
        Language is reflective, not prescriptive or judgmental
        """
        
        if signal_type == 'strong_positive_alignment':
            return self._generate_positive_alignment_signal(analysis, coherence, confidence)
        
        elif signal_type == 'moderate_positive_alignment':
            return self._generate_moderate_alignment_signal(analysis, coherence, confidence)
        
        elif signal_type == 'pattern_deviation':
            return self._generate_deviation_observation(analysis, coherence, confidence)
        
        elif signal_type == 'trust_pattern_observation':
            return self._generate_trust_observation(analysis, coherence, confidence)
        
        elif signal_type == 'neutral_observation':
            return self._generate_neutral_reflection(analysis, coherence, confidence)
        
        else:
            # Default to silence for unknown signal types
            return None
    
    def _generate_positive_alignment_signal(self, analysis: Dict, coherence: MarketCoherence, confidence: float) -> str:
        """Generate signal for strong positive alignment"""
        trust_density = coherence.trust_density
        
        if trust_density > 0.8:
            return "This negotiation approach aligns with patterns that consistently build market trust."
        elif coherence.behavioral_diversity > 0.7:
            return "This interaction style matches successful relationship-building patterns in the market."
        else:
            return "This negotiation approach reflects collective patterns that support market stability."
    
    def _generate_moderate_alignment_signal(self, analysis: Dict, coherence: MarketCoherence, confidence: float) -> str:
        """Generate signal for moderate alignment"""
        pattern_stability = coherence.pattern_stability
        
        if pattern_stability > 0.7:
            return "This negotiation style aligns with established market patterns."
        else:
            return "This approach reflects common negotiation patterns in the current market."
    
    def _generate_deviation_observation(self, analysis: Dict, coherence: MarketCoherence, confidence: float) -> str:
        """Generate observation about pattern deviation - not judgment"""
        coherence_score = coherence.coherence_score
        
        if coherence_score > 0.8:
            return "This negotiation approach differs from recent collective market patterns."
        elif coherence.trust_density > 0.7:
            return "This interaction style is less common in current market behavior."
        else:
            return "This approach represents a different pattern from typical market interactions."
    
    def _generate_trust_observation(self, analysis: Dict, coherence: MarketCoherence, confidence: float) -> str:
        """Generate observation about trust patterns"""
        trust_density = coherence.trust_density
        
        if trust_density > 0.8:
            return "This negotiation style differs from the trust-building patterns common in this market."
        else:
            return "This approach contrasts with relationship-focused patterns seen in recent interactions."
    
    def _generate_neutral_reflection(self, analysis: Dict, coherence: MarketCoherence, confidence: float) -> str:
        """Generate neutral reflection when no strong patterns emerge"""
        if confidence > 0.8:
            return "This negotiation reflects standard market interaction patterns."
        else:
            # Lower confidence - more cautious language
            return "This interaction follows typical negotiation approaches."
    
    def should_remain_silent(self, analysis: Dict, coherence: MarketCoherence) -> bool:
        """
        Explicit silence logic - system chooses not to provide signal
        Silence is preferred over uncertain or potentially misleading guidance
        """
        confidence = analysis.get('confidence_level', 0.0)
        
        # Silence conditions - adjusted for demonstration
        if confidence < self._minimum_confidence:
            return True
        
        if coherence.coherence_score < 0.2:  # Very low threshold
            # Market coherence too low for meaningful signals
            return True
        
        if analysis.get('pattern_familiarity', 0.0) < 0.1:  # Very low threshold
            # Insufficient pattern data
            return True
        
        return False

def generate_alignment_signal(
    fingerprint: BehavioralFingerprint, 
    alignment_analysis: Dict,
    market_coherence: MarketCoherence
) -> Optional[str]:
    """
    Main function to generate Market Alignment Signal
    Returns signal text or None (silence)
    Pure function with no side effects
    """
    generator = AlignmentSignalGenerator()
    
    # Check if system should remain silent
    if generator.should_remain_silent(alignment_analysis, market_coherence):
        return None
    
    # Generate contextual reflection
    signal = generator.generate_market_alignment_signal(
        fingerprint, 
        alignment_analysis, 
        market_coherence
    )
    
    return signal