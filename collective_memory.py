"""
Collective Market Memory
Maintains aggregate behavioral patterns with inertial updates
"""

import time
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from behavioral_abstraction import BehavioralFingerprint

@dataclass
class MarketCoherence:
    """
    Named construct: Market Coherence
    Measures how aligned current behavior is with collective patterns
    Changes slowly, derived only from aggregate behavior
    """
    coherence_score: float  # 0.0 to 1.0
    pattern_stability: float  # How stable patterns are over time
    trust_density: float  # Aggregate trust patterns in market
    behavioral_diversity: float  # Variety of healthy negotiation patterns
    last_updated: float = field(default_factory=time.time)

@dataclass
class CollectivePattern:
    """Aggregate behavioral pattern across many interactions"""
    pattern_type: str
    frequency: int
    success_indicators: Dict
    trust_correlation: float
    market_health_impact: float
    temporal_stability: float

class CollectiveMemory:
    def __init__(self):
        # Aggregate patterns - no individual attribution possible
        self._collective_patterns: Dict[str, CollectivePattern] = {}
        
        # Market coherence - the named construct that influences signals
        self._market_coherence = MarketCoherence(
            coherence_score=0.5,  # Start neutral
            pattern_stability=0.5,
            trust_density=0.5,
            behavioral_diversity=0.5
        )
        
        # Inertial update parameters - prevent single sessions from dominating
        self._update_weight = 0.15  # Increased for demonstration
        self._stability_threshold = 0.05  # Lower threshold for updates
        self._pattern_memory_size = 1000  # Maximum patterns to remember
    
    def integrate_behavioral_pattern(self, fingerprint: BehavioralFingerprint) -> None:
        """
        Integrate new behavioral pattern into collective memory
        Uses inertial updates - single interactions cannot dominate
        """
        pattern_key = self._generate_pattern_key(fingerprint)
        
        if pattern_key in self._collective_patterns:
            # Update existing pattern with inertial weighting
            self._update_existing_pattern(pattern_key, fingerprint)
        else:
            # Create new collective pattern
            self._create_new_collective_pattern(pattern_key, fingerprint)
        
        # Update market coherence slowly and deliberately
        self._update_market_coherence_inertially(fingerprint)
        
        # Maintain memory size limits
        self._maintain_memory_limits()
    
    def _generate_pattern_key(self, fingerprint: BehavioralFingerprint) -> str:
        """Generate key for collective pattern storage"""
        dynamics = fingerprint.negotiation_dynamics
        return f"{fingerprint.market_alignment}_{dynamics.get('opening_style', 'unknown')}"
    
    def _update_existing_pattern(self, pattern_key: str, fingerprint: BehavioralFingerprint) -> None:
        """
        Update existing pattern with inertial weighting
        Prevents single interactions from dramatically changing collective memory
        """
        existing = self._collective_patterns[pattern_key]
        
        # Inertial frequency update
        existing.frequency += 1
        
        # Inertial trust correlation update
        new_trust_score = self._calculate_trust_score(fingerprint)
        existing.trust_correlation = (
            existing.trust_correlation * (1 - self._update_weight) +
            new_trust_score * self._update_weight
        )
        
        # Inertial market health impact update
        health_impact = self._calculate_market_health_impact(fingerprint)
        existing.market_health_impact = (
            existing.market_health_impact * (1 - self._update_weight) +
            health_impact * self._update_weight
        )
        
        # Update temporal stability
        existing.temporal_stability = min(existing.temporal_stability + 0.01, 1.0)
    
    def _create_new_collective_pattern(self, pattern_key: str, fingerprint: BehavioralFingerprint) -> None:
        """Create new collective pattern from behavioral fingerprint"""
        new_pattern = CollectivePattern(
            pattern_type=pattern_key,
            frequency=1,
            success_indicators=self._extract_success_indicators(fingerprint),
            trust_correlation=self._calculate_trust_score(fingerprint),
            market_health_impact=self._calculate_market_health_impact(fingerprint),
            temporal_stability=0.1  # New patterns start with low stability
        )
        
        self._collective_patterns[pattern_key] = new_pattern
    
    def _calculate_trust_score(self, fingerprint: BehavioralFingerprint) -> float:
        """Calculate trust score from behavioral fingerprint"""
        trust_pattern = fingerprint.trust_pattern
        
        trust_scores = {
            'high_trust_collaborative': 0.9,
            'relationship_investment': 0.8,
            'standard_trust': 0.6,
            'cautious_verification': 0.4
        }
        
        return trust_scores.get(trust_pattern, 0.5)
    
    def _calculate_market_health_impact(self, fingerprint: BehavioralFingerprint) -> float:
        """Calculate impact on overall market health"""
        alignment = fingerprint.market_alignment
        dynamics = fingerprint.negotiation_dynamics
        
        # Market building behaviors have positive impact
        if alignment == 'market_building':
            return 0.8
        elif alignment == 'relationship_focused':
            return 0.7
        elif dynamics.get('opening_style') == 'collaborative':
            return 0.6
        else:
            return 0.5
    
    def _extract_success_indicators(self, fingerprint: BehavioralFingerprint) -> Dict:
        """Extract indicators of successful negotiation patterns"""
        dynamics = fingerprint.negotiation_dynamics
        
        return {
            'collaborative_elements': 1 if dynamics.get('opening_style') == 'collaborative' else 0,
            'trust_building': 1 if 'trust' in fingerprint.trust_pattern else 0,
            'relationship_focus': 1 if dynamics.get('relationship_focus') == 'relationship_priority' else 0,
            'decision_efficiency': 1 if dynamics.get('decision_approach') == 'ready_to_decide' else 0
        }
    
    def _update_market_coherence_inertially(self, fingerprint: BehavioralFingerprint) -> None:
        """
        Update market coherence slowly and deliberately
        This is the named construct that influences signal generation
        """
        # Calculate new coherence components
        new_trust_density = self._calculate_trust_density()
        new_pattern_stability = self._calculate_pattern_stability()
        new_behavioral_diversity = self._calculate_behavioral_diversity()
        
        # Inertial updates - market coherence changes slowly
        coherence = self._market_coherence
        
        # Only update if change exceeds stability threshold
        trust_change = abs(new_trust_density - coherence.trust_density)
        if trust_change > self._stability_threshold:
            coherence.trust_density = (
                coherence.trust_density * (1 - self._update_weight) +
                new_trust_density * self._update_weight
            )
        
        stability_change = abs(new_pattern_stability - coherence.pattern_stability)
        if stability_change > self._stability_threshold:
            coherence.pattern_stability = (
                coherence.pattern_stability * (1 - self._update_weight) +
                new_pattern_stability * self._update_weight
            )
        
        diversity_change = abs(new_behavioral_diversity - coherence.behavioral_diversity)
        if diversity_change > self._stability_threshold:
            coherence.behavioral_diversity = (
                coherence.behavioral_diversity * (1 - self._update_weight) +
                new_behavioral_diversity * self._update_weight
            )
        
        # Update overall coherence score
        coherence.coherence_score = (
            coherence.trust_density * 0.4 +
            coherence.pattern_stability * 0.3 +
            coherence.behavioral_diversity * 0.3
        )
        
        coherence.last_updated = time.time()
    
    def _calculate_trust_density(self) -> float:
        """Calculate aggregate trust density across all patterns"""
        if not self._collective_patterns:
            return 0.5
        
        total_trust = sum(p.trust_correlation * p.frequency for p in self._collective_patterns.values())
        total_frequency = sum(p.frequency for p in self._collective_patterns.values())
        
        return total_trust / max(total_frequency, 1)
    
    def _calculate_pattern_stability(self) -> float:
        """Calculate how stable behavioral patterns are over time"""
        if not self._collective_patterns:
            return 0.5
        
        stabilities = [p.temporal_stability for p in self._collective_patterns.values()]
        return sum(stabilities) / len(stabilities)
    
    def _calculate_behavioral_diversity(self) -> float:
        """Calculate diversity of healthy behavioral patterns"""
        if not self._collective_patterns:
            return 0.5
        
        # Count patterns with positive market health impact
        healthy_patterns = sum(1 for p in self._collective_patterns.values() 
                             if p.market_health_impact > 0.6)
        
        total_patterns = len(self._collective_patterns)
        return min(healthy_patterns / max(total_patterns, 1), 1.0)
    
    def _maintain_memory_limits(self) -> None:
        """Maintain memory size limits - remove least stable patterns"""
        if len(self._collective_patterns) > self._pattern_memory_size:
            # Remove patterns with lowest temporal stability
            patterns_by_stability = sorted(
                self._collective_patterns.items(),
                key=lambda x: x[1].temporal_stability
            )
            
            # Remove bottom 10%
            remove_count = len(self._collective_patterns) // 10
            for pattern_key, _ in patterns_by_stability[:remove_count]:
                del self._collective_patterns[pattern_key]
    
    def get_market_coherence(self) -> MarketCoherence:
        """
        Return current market coherence
        This is the named construct that influences signal generation
        """
        return self._market_coherence
    
    def analyze_pattern_alignment(self, fingerprint: BehavioralFingerprint) -> Dict:
        """
        Analyze how a behavioral pattern aligns with collective memory
        Used for generating Market Alignment Signals
        """
        coherence = self._market_coherence
        pattern_key = self._generate_pattern_key(fingerprint)
        
        # Check if pattern exists in collective memory
        if pattern_key in self._collective_patterns:
            existing_pattern = self._collective_patterns[pattern_key]
            alignment_strength = existing_pattern.frequency / 100.0  # Normalize
            trust_alignment = abs(existing_pattern.trust_correlation - self._calculate_trust_score(fingerprint))
        else:
            alignment_strength = 0.1  # New pattern
            trust_alignment = 0.5  # Unknown alignment
        
        analysis = {
            'pattern_familiarity': min(alignment_strength, 1.0),
            'trust_alignment': 1.0 - trust_alignment,  # Lower difference = better alignment
            'market_coherence_score': coherence.coherence_score,
            'pattern_stability': coherence.pattern_stability,
            'trust_density': coherence.trust_density,
            'behavioral_diversity': coherence.behavioral_diversity,
            'confidence_level': min(coherence.pattern_stability * coherence.trust_density, 1.0)
        }
        
        return analysis
    
    def get_collective_intelligence_summary(self) -> Dict:
        """
        Return summary of collective intelligence
        No individual patterns can be recovered from this data
        """
        coherence = self._market_coherence
        
        return {
            'total_patterns': len(self._collective_patterns),
            'market_coherence': coherence.coherence_score,
            'trust_density': coherence.trust_density,
            'pattern_stability': coherence.pattern_stability,
            'behavioral_diversity': coherence.behavioral_diversity,
            'memory_health': 'stable' if coherence.coherence_score > 0.7 else 'developing',
            'last_updated': coherence.last_updated
        }