"""
Ephemeral Interaction Capture Layer
Simulates live negotiation inputs with immediate anonymization
"""

import time
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

@dataclass
class EphemeralInteraction:
    """Raw negotiation data - exists only during processing"""
    text: str
    language: str
    timestamp: float
    # Deliberately no user_id, session_id, or persistent identifiers

class InteractionCapture:
    def __init__(self):
        # No persistent storage - data exists only during processing
        self._current_interaction: Optional[EphemeralInteraction] = None
    
    def capture_negotiation_text(self, text: str, language: str = "hindi") -> Dict:
        """
        Capture negotiation input and immediately extract behavioral patterns
        Returns only abstracted patterns - raw data is discarded
        """
        # Create ephemeral interaction
        interaction = EphemeralInteraction(
            text=text,
            language=language,
            timestamp=time.time()
        )
        
        # Extract behavioral patterns immediately
        patterns = self._extract_negotiation_patterns(interaction)
        
        # Explicitly discard raw interaction data
        # This is where individual identity is lost by design
        interaction = None
        self._current_interaction = None
        
        return patterns
    
    def _extract_negotiation_patterns(self, interaction: EphemeralInteraction) -> Dict:
        """Extract behavioral essence, discard individual traces"""
        text = interaction.text.lower()
        
        # Extract negotiation dynamics without storing who said what
        patterns = {
            'negotiation_style': self._classify_style(text),
            'price_sensitivity': self._detect_price_sensitivity(text),
            'concession_pattern': self._detect_concession_pattern(text),
            'trust_indicators': self._detect_trust_signals(text),
            'temporal_urgency': self._detect_urgency(text)
        }
        
        # Raw text and identifiers are deliberately not included
        # Only behavioral abstractions survive this layer
        return patterns
    
    def _classify_style(self, text: str) -> str:
        """Classify negotiation approach"""
        if any(word in text for word in ['please', 'request', 'consider']):
            return 'collaborative'
        elif any(word in text for word in ['final', 'take it', 'last offer']):
            return 'competitive'
        elif any(word in text for word in ['trust', 'relationship', 'long term']):
            return 'trust_building'
        else:
            return 'neutral'
    
    def _detect_price_sensitivity(self, text: str) -> str:
        """Detect price-related behavioral patterns"""
        if any(word in text for word in ['expensive', 'high', 'too much']):
            return 'price_sensitive'
        elif any(word in text for word in ['fair', 'reasonable', 'good price']):
            return 'price_accepting'
        else:
            return 'price_neutral'
    
    def _detect_concession_pattern(self, text: str) -> str:
        """Identify concession behavior"""
        if any(word in text for word in ['maybe', 'could', 'perhaps']):
            return 'gradual_concession'
        elif any(word in text for word in ['no', 'cannot', 'impossible']):
            return 'firm_position'
        else:
            return 'flexible'
    
    def _detect_trust_signals(self, text: str) -> str:
        """Identify trust-building language"""
        if any(word in text for word in ['honest', 'promise', 'guarantee']):
            return 'trust_building'
        elif any(word in text for word in ['doubt', 'unsure', 'risky']):
            return 'trust_cautious'
        else:
            return 'trust_neutral'
    
    def _detect_urgency(self, text: str) -> str:
        """Detect temporal pressure patterns"""
        if any(word in text for word in ['urgent', 'quickly', 'now']):
            return 'high_urgency'
        elif any(word in text for word in ['time', 'think', 'consider']):
            return 'low_urgency'
        else:
            return 'normal_urgency'

def simulate_negotiation_input(vendor_text: str, buyer_text: str, commodity: str) -> Tuple[Dict, Dict]:
    """
    Simulate a negotiation exchange
    Returns behavioral patterns for both participants
    Individual identities are lost in this process
    """
    capture = InteractionCapture()
    
    # Process vendor input - identity is immediately abstracted away
    vendor_patterns = capture.capture_negotiation_text(vendor_text, "hindi")
    vendor_patterns['role'] = 'seller'  # Role, not identity
    vendor_patterns['commodity'] = commodity
    
    # Process buyer input - identity is immediately abstracted away  
    buyer_patterns = capture.capture_negotiation_text(buyer_text, "tamil")
    buyer_patterns['role'] = 'buyer'  # Role, not identity
    buyer_patterns['commodity'] = commodity
    
    return vendor_patterns, buyer_patterns