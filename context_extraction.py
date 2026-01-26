"""
Context Extraction Layer
Provides market context without prescriptive pricing
"""

import random
from typing import Dict, Optional, List
from dataclasses import dataclass

@dataclass
class MarketContext:
    """Market context without individual recommendations"""
    commodity: str
    price_range_low: float
    price_range_high: float
    demand_trend: str
    supply_indicator: str
    confidence_level: float

class ContextExtractor:
    def __init__(self):
        # Mock market data - in reality would come from aggregate market activity
        self._market_data = {
            'tomatoes': {'base_low': 15, 'base_high': 25, 'volatility': 0.2},
            'onions': {'base_low': 20, 'base_high': 35, 'volatility': 0.3},
            'potatoes': {'base_low': 12, 'base_high': 20, 'volatility': 0.15},
            'rice': {'base_low': 40, 'base_high': 60, 'volatility': 0.1},
            'wheat': {'base_low': 25, 'base_high': 40, 'volatility': 0.12}
        }
    
    def extract_market_context(self, commodity: str) -> Optional[MarketContext]:
        """
        Provide market context as ranges and trends
        Never provides 'best price' or specific recommendations
        """
        if commodity not in self._market_data:
            return None
        
        base_data = self._market_data[commodity]
        
        # Add market volatility to simulate real conditions
        volatility_factor = 1 + (random.random() - 0.5) * base_data['volatility']
        
        price_low = base_data['base_low'] * volatility_factor
        price_high = base_data['base_high'] * volatility_factor
        
        # Generate demand and supply indicators without predictions
        demand_trend = random.choice(['increasing', 'stable', 'decreasing'])
        supply_indicator = random.choice(['abundant', 'normal', 'limited'])
        
        # Confidence based on data freshness and market stability
        confidence = random.uniform(0.7, 0.95)
        
        return MarketContext(
            commodity=commodity,
            price_range_low=round(price_low, 2),
            price_range_high=round(price_high, 2),
            demand_trend=demand_trend,
            supply_indicator=supply_indicator,
            confidence_level=confidence
        )
    
    def extract_linguistic_intent(self, behavioral_patterns: Dict) -> Dict:
        """
        Abstract linguistic patterns from behavioral data
        Focus on negotiation dynamics, not individual speech
        """
        intent_patterns = {
            'negotiation_phase': self._determine_negotiation_phase(behavioral_patterns),
            'communication_style': behavioral_patterns.get('negotiation_style', 'neutral'),
            'price_positioning': self._analyze_price_positioning(behavioral_patterns),
            'relationship_building': self._assess_relationship_focus(behavioral_patterns),
            'decision_readiness': self._evaluate_decision_signals(behavioral_patterns)
        }
        
        return intent_patterns
    
    def _determine_negotiation_phase(self, patterns: Dict) -> str:
        """Identify current phase of negotiation"""
        urgency = patterns.get('temporal_urgency', 'normal_urgency')
        concession = patterns.get('concession_pattern', 'flexible')
        
        if urgency == 'high_urgency' and concession == 'gradual_concession':
            return 'closing_phase'
        elif concession == 'firm_position':
            return 'opening_phase'
        else:
            return 'exploration_phase'
    
    def _analyze_price_positioning(self, patterns: Dict) -> str:
        """Analyze price-related positioning"""
        sensitivity = patterns.get('price_sensitivity', 'price_neutral')
        style = patterns.get('negotiation_style', 'neutral')
        
        if sensitivity == 'price_sensitive' and style == 'competitive':
            return 'aggressive_pricing'
        elif sensitivity == 'price_accepting' and style == 'collaborative':
            return 'value_focused'
        else:
            return 'standard_positioning'
    
    def _assess_relationship_focus(self, patterns: Dict) -> str:
        """Evaluate relationship-building emphasis"""
        trust = patterns.get('trust_indicators', 'trust_neutral')
        style = patterns.get('negotiation_style', 'neutral')
        
        if trust == 'trust_building' or style == 'trust_building':
            return 'relationship_priority'
        elif trust == 'trust_cautious':
            return 'transaction_focused'
        else:
            return 'balanced_approach'
    
    def _evaluate_decision_signals(self, patterns: Dict) -> str:
        """Assess readiness to conclude negotiation"""
        urgency = patterns.get('temporal_urgency', 'normal_urgency')
        concession = patterns.get('concession_pattern', 'flexible')
        
        if urgency == 'high_urgency' and concession != 'firm_position':
            return 'ready_to_decide'
        elif concession == 'firm_position':
            return 'position_holding'
        else:
            return 'still_exploring'

def provide_context_without_recommendations(commodity: str, behavioral_patterns: Dict) -> Dict:
    """
    Provide market context and linguistic analysis
    Explicitly avoids recommendations or 'optimal' guidance
    """
    extractor = ContextExtractor()
    
    # Get market context as ranges, never as recommendations
    market_context = extractor.extract_market_context(commodity)
    
    # Extract linguistic intent patterns
    intent_patterns = extractor.extract_linguistic_intent(behavioral_patterns)
    
    context_data = {
        'market_context': market_context,
        'intent_patterns': intent_patterns,
        'context_type': 'informational_only',  # Never prescriptive
        'recommendation_level': 'none'  # Explicit constraint
    }
    
    return context_data