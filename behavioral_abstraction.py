"""
Behavioral Abstraction Layer
Converts individual interactions into anonymous behavioral patterns
"""

import hashlib
import time
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class BehavioralFingerprint:
    """Anonymous behavioral pattern - no individual traceability"""
    pattern_id: str  # Hash-based, not traceable to individuals
    negotiation_dynamics: Dict
    market_alignment: str
    trust_pattern: str
    abstraction_level: int  # Higher = more anonymous
    temporal_signature: float  # Relative timing, not absolute

class BehavioralAbstractor:
    def __init__(self):
        # Pattern clustering without individual attribution
        self._pattern_clusters = {
            'collaborative_trust': [],
            'competitive_efficient': [],
            'relationship_building': [],
            'transaction_focused': []
        }
    
    def abstract_behavioral_patterns(self, interaction_patterns: Dict, context_data: Dict) -> BehavioralFingerprint:
        """
        Convert individual behavioral data into anonymous patterns
        This is where individual identity is explicitly destroyed
        """
        # Create anonymous pattern ID using behavioral characteristics only
        # Deliberately excludes any individual identifiers
        pattern_signature = self._generate_anonymous_signature(interaction_patterns, context_data)
        
        # Extract behavioral dynamics without individual attribution
        dynamics = self._extract_negotiation_dynamics(interaction_patterns, context_data)
        
        # Classify market alignment pattern
        alignment = self._classify_market_alignment(interaction_patterns, context_data)
        
        # Abstract trust patterns
        trust_pattern = self._abstract_trust_patterns(interaction_patterns)
        
        # Determine abstraction level (higher = more anonymous)
        abstraction_level = self._calculate_abstraction_level(interaction_patterns)
        
        # Create temporal signature (relative, not absolute time)
        temporal_sig = self._create_temporal_signature(context_data)
        
        fingerprint = BehavioralFingerprint(
            pattern_id=pattern_signature,
            negotiation_dynamics=dynamics,
            market_alignment=alignment,
            trust_pattern=trust_pattern,
            abstraction_level=abstraction_level,
            temporal_signature=temporal_sig
        )
        
        # Store in appropriate cluster for collective learning
        self._cluster_behavioral_pattern(fingerprint)
        
        return fingerprint
    
    def _generate_anonymous_signature(self, patterns: Dict, context: Dict) -> str:
        """
        Generate pattern ID based only on behavioral characteristics
        Individual identity cannot be recovered from this signature
        """
        # Use only behavioral patterns, never individual identifiers
        signature_data = {
            'style': patterns.get('negotiation_style', 'neutral'),
            'price_sensitivity': patterns.get('price_sensitivity', 'neutral'),
            'trust_level': patterns.get('trust_indicators', 'neutral'),
            'market_phase': context.get('intent_patterns', {}).get('negotiation_phase', 'unknown'),
            'commodity_type': patterns.get('commodity', 'unknown')
        }
        
        # Create hash that cannot be traced back to individuals
        signature_string = str(sorted(signature_data.items()))
        pattern_hash = hashlib.sha256(signature_string.encode()).hexdigest()[:16]
        
        return f"pattern_{pattern_hash}"
    
    def _extract_negotiation_dynamics(self, patterns: Dict, context: Dict) -> Dict:
        """Extract negotiation flow patterns without individual traces"""
        intent = context.get('intent_patterns', {})
        
        dynamics = {
            'opening_style': patterns.get('negotiation_style', 'neutral'),
            'price_approach': patterns.get('price_sensitivity', 'neutral'),
            'concession_behavior': patterns.get('concession_pattern', 'flexible'),
            'communication_pattern': intent.get('communication_style', 'neutral'),
            'decision_approach': intent.get('decision_readiness', 'exploring'),
            'relationship_focus': intent.get('relationship_building', 'balanced')
        }
        
        return dynamics
    
    def _classify_market_alignment(self, patterns: Dict, context: Dict) -> str:
        """Classify how behavior aligns with typical market patterns"""
        style = patterns.get('negotiation_style', 'neutral')
        price_sensitivity = patterns.get('price_sensitivity', 'neutral')
        trust_indicators = patterns.get('trust_indicators', 'neutral')
        
        # Classify alignment with healthy market behavior
        if style == 'collaborative' and trust_indicators == 'trust_building':
            return 'market_building'
        elif style == 'competitive' and price_sensitivity == 'price_sensitive':
            return 'efficiency_focused'
        elif trust_indicators == 'trust_building':
            return 'relationship_focused'
        else:
            return 'standard_market'
    
    def _abstract_trust_patterns(self, patterns: Dict) -> str:
        """Abstract trust-related behavioral patterns"""
        trust_signals = patterns.get('trust_indicators', 'trust_neutral')
        negotiation_style = patterns.get('negotiation_style', 'neutral')
        
        if trust_signals == 'trust_building' and negotiation_style == 'collaborative':
            return 'high_trust_collaborative'
        elif trust_signals == 'trust_cautious':
            return 'cautious_verification'
        elif negotiation_style == 'trust_building':
            return 'relationship_investment'
        else:
            return 'standard_trust'
    
    def _calculate_abstraction_level(self, patterns: Dict) -> int:
        """
        Calculate how abstracted this pattern should be
        Higher levels = more anonymous, less traceable
        """
        # Base abstraction level
        level = 3
        
        # Increase abstraction for sensitive patterns
        if patterns.get('trust_indicators') == 'trust_cautious':
            level += 1
        
        if patterns.get('negotiation_style') == 'competitive':
            level += 1
        
        # Ensure minimum anonymity
        return max(level, 3)
    
    def _create_temporal_signature(self, context: Dict) -> float:
        """
        Create relative temporal signature
        Not absolute time - prevents individual tracking
        """
        # Use relative timing patterns, not absolute timestamps
        current_time = time.time()
        
        # Create signature based on market phase, not individual timing
        market_context = context.get('market_context')
        if market_context and hasattr(market_context, 'confidence_level'):
            # Use market confidence as temporal proxy
            return market_context.confidence_level
        else:
            # Default relative signature
            return 0.8
    
    def _cluster_behavioral_pattern(self, fingerprint: BehavioralFingerprint):
        """
        Add pattern to appropriate cluster for collective learning
        Individual attribution is impossible at this stage
        """
        alignment = fingerprint.market_alignment
        trust_pattern = fingerprint.trust_pattern
        
        # Cluster based on behavioral characteristics only
        if 'collaborative' in trust_pattern and alignment == 'market_building':
            cluster_key = 'collaborative_trust'
        elif alignment == 'efficiency_focused':
            cluster_key = 'competitive_efficient'
        elif 'relationship' in trust_pattern:
            cluster_key = 'relationship_building'
        else:
            cluster_key = 'transaction_focused'
        
        # Add to cluster - individual identity is already lost
        self._pattern_clusters[cluster_key].append(fingerprint)
        
        # Limit cluster size to prevent memory bloat
        if len(self._pattern_clusters[cluster_key]) > 100:
            # Remove oldest patterns (FIFO)
            self._pattern_clusters[cluster_key].pop(0)
    
    def get_cluster_statistics(self) -> Dict:
        """
        Return aggregate cluster statistics
        No individual patterns can be recovered from this data
        """
        stats = {}
        for cluster_name, patterns in self._pattern_clusters.items():
            stats[cluster_name] = {
                'pattern_count': len(patterns),
                'avg_abstraction_level': sum(p.abstraction_level for p in patterns) / max(len(patterns), 1),
                'dominant_alignment': self._get_dominant_alignment(patterns)
            }
        
        return stats
    
    def _get_dominant_alignment(self, patterns: List[BehavioralFingerprint]) -> str:
        """Get most common alignment pattern in cluster"""
        if not patterns:
            return 'unknown'
        
        alignments = [p.market_alignment for p in patterns]
        return max(set(alignments), key=alignments.count)

def convert_to_anonymous_patterns(interaction_patterns: Dict, context_data: Dict) -> BehavioralFingerprint:
    """
    Main function to convert individual interactions into anonymous behavioral patterns
    Individual identity is explicitly destroyed in this process
    """
    abstractor = BehavioralAbstractor()
    
    # This is the critical transformation where individual identity is lost
    # Raw interaction data becomes anonymous behavioral intelligence
    anonymous_pattern = abstractor.abstract_behavioral_patterns(interaction_patterns, context_data)
    
    return anonymous_pattern