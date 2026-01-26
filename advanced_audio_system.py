"""
Advanced MandiSense Audio System with Real-Time Voice Translation
Multilingual voice processing with advanced audio features
"""

import asyncio
import json
import time
import threading
from typing import Dict, List, Optional, Tuple, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import numpy as np
from datetime import datetime
import queue
import logging

# Audio processing imports (would be actual libraries in production)
try:
    import speech_recognition as sr
    import pyttsx3
    import pyaudio
    import wave
    import webrtcvad
    AUDIO_AVAILABLE = True
except ImportError:
    AUDIO_AVAILABLE = False
    print("Audio libraries not available. Using mock implementations.")

class AudioLanguage(Enum):
    HINDI = "hi-IN"
    TAMIL = "ta-IN"
    TELUGU = "te-IN"
    BENGALI = "bn-IN"
    MARATHI = "mr-IN"
    GUJARATI = "gu-IN"
    KANNADA = "kn-IN"
    MALAYALAM = "ml-IN"
    PUNJABI = "pa-IN"
    ODIA = "or-IN"
    ENGLISH = "en-IN"

class AudioQuality(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    ULTRA = "ultra"

class VoiceGender(Enum):
    MALE = "male"
    FEMALE = "female"
    NEUTRAL = "neutral"

@dataclass
class AudioConfig:
    """Advanced audio configuration"""
    sample_rate: int = 16000
    channels: int = 1
    chunk_size: int = 1024
    format: str = "int16"
    quality: AudioQuality = AudioQuality.HIGH
    noise_reduction: bool = True
    echo_cancellation: bool = True
    auto_gain_control: bool = True
    voice_activity_detection: bool = True
    real_time_processing: bool = True

@dataclass
class VoiceProfile:
    """Voice profile for personalized synthesis"""
    language: AudioLanguage
    gender: VoiceGender
    speed: float = 1.0
    pitch: float = 1.0
    volume: float = 0.8
    accent: str = "neutral"
    emotion: str = "neutral"
    formality: str = "polite"

@dataclass
class AudioSegment:
    """Audio segment with metadata"""
    audio_data: bytes
    language: AudioLanguage
    confidence: float
    timestamp: float
    duration: float
    speaker_id: str
    text_content: str = ""
    emotion: str = "neutral"
    background_noise_level: float = 0.0

@dataclass
class TranslationResult:
    """Translation result with audio and metadata"""
    original_text: str
    translated_text: str
    original_language: AudioLanguage
    target_language: AudioLanguage
    confidence: float
    audio_data: bytes
    voice_profile: VoiceProfile
    processing_time: float
    cultural_adaptation: Dict[str, Any] = field(default_factory=dict)

class AdvancedSpeechRecognizer:
    """Advanced speech recognition with multilingual support"""
    
    def __init__(self, config: AudioConfig):
        self.config = config
        self.recognizer = sr.Recognizer() if AUDIO_AVAILABLE else None
        self.microphone = sr.Microphone() if AUDIO_AVAILABLE else None
        self.vad = webrtcvad.Vad(2) if AUDIO_AVAILABLE else None  # Aggressiveness level 2
        self.is_listening = False
        self.audio_queue = queue.Queue()
        self.recognition_callbacks: List[Callable] = []
        
        # Language-specific recognition models
        self.language_models = {
            AudioLanguage.HINDI: "hi-IN",
            AudioLanguage.TAMIL: "ta-IN",
            AudioLanguage.TELUGU: "te-IN",
            AudioLanguage.BENGALI: "bn-IN",
            AudioLanguage.MARATHI: "mr-IN",
            AudioLanguage.GUJARATI: "gu-IN",
            AudioLanguage.KANNADA: "kn-IN",
            AudioLanguage.MALAYALAM: "ml-IN",
            AudioLanguage.PUNJABI: "pa-IN",
            AudioLanguage.ODIA: "or-IN",
            AudioLanguage.ENGLISH: "en-IN"
        }
        
        if AUDIO_AVAILABLE and self.recognizer:
            # Adjust for ambient noise
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
    
    def start_continuous_listening(self, callback: Callable[[AudioSegment], None]):
        """Start continuous audio listening with real-time processing"""
        if not AUDIO_AVAILABLE:
            print("Audio not available - using mock continuous listening")
            return
        
        self.is_listening = True
        self.recognition_callbacks.append(callback)
        
        def listen_continuously():
            while self.is_listening:
                try:
                    with self.microphone as source:
                        # Listen for audio with timeout
                        audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=5)
                        
                        # Process audio in separate thread
                        threading.Thread(
                            target=self._process_audio_segment,
                            args=(audio, callback),
                            daemon=True
                        ).start()
                        
                except sr.WaitTimeoutError:
                    continue
                except Exception as e:
                    logging.error(f"Continuous listening error: {e}")
                    time.sleep(0.1)
        
        # Start listening thread
        threading.Thread(target=listen_continuously, daemon=True).start()
    
    def _process_audio_segment(self, audio, callback: Callable[[AudioSegment], None]):
        """Process individual audio segment"""
        try:
            # Detect language automatically
            detected_language = self._detect_language(audio)
            
            # Convert speech to text
            text = self.recognizer.recognize_google(
                audio, 
                language=self.language_models[detected_language]
            )
            
            # Create audio segment
            segment = AudioSegment(
                audio_data=audio.get_wav_data(),
                language=detected_language,
                confidence=0.85,  # Mock confidence
                timestamp=time.time(),
                duration=len(audio.get_wav_data()) / (self.config.sample_rate * 2),
                speaker_id=self._identify_speaker(audio),
                text_content=text,
                emotion=self._detect_emotion_from_audio(audio),
                background_noise_level=self._measure_noise_level(audio)
            )
            
            callback(segment)
            
        except sr.UnknownValueError:
            # Could not understand audio
            pass
        except sr.RequestError as e:
            logging.error(f"Speech recognition error: {e}")
    
    def _detect_language(self, audio) -> AudioLanguage:
        """Detect language from audio (mock implementation)"""
        # In production, this would use advanced language detection
        return AudioLanguage.HINDI  # Default for demo
    
    def _identify_speaker(self, audio) -> str:
        """Identify speaker from audio characteristics"""
        # Mock speaker identification
        return f"speaker_{hash(str(audio.get_wav_data()[:100])) % 1000}"
    
    def _detect_emotion_from_audio(self, audio) -> str:
        """Detect emotion from audio characteristics"""
        # Mock emotion detection
        emotions = ["neutral", "happy", "concerned", "excited", "calm"]
        return emotions[hash(str(audio.get_wav_data()[:50])) % len(emotions)]
    
    def _measure_noise_level(self, audio) -> float:
        """Measure background noise level"""
        # Mock noise level measurement
        return 0.1  # Low noise level
    
    def stop_listening(self):
        """Stop continuous listening"""
        self.is_listening = False
        self.recognition_callbacks.clear()

class AdvancedTextToSpeech:
    """Advanced text-to-speech with multilingual and voice customization"""
    
    def __init__(self, config: AudioConfig):
        self.config = config
        self.tts_engine = pyttsx3.init() if AUDIO_AVAILABLE else None
        self.voice_profiles: Dict[str, VoiceProfile] = {}
        self.synthesis_queue = queue.Queue()
        self.is_processing = False
        
        # Language-specific voice settings
        self.language_voices = {
            AudioLanguage.HINDI: {"rate": 150, "voice_id": "hindi"},
            AudioLanguage.TAMIL: {"rate": 140, "voice_id": "tamil"},
            AudioLanguage.TELUGU: {"rate": 145, "voice_id": "telugu"},
            AudioLanguage.BENGALI: {"rate": 150, "voice_id": "bengali"},
            AudioLanguage.MARATHI: {"rate": 150, "voice_id": "marathi"},
            AudioLanguage.GUJARATI: {"rate": 145, "voice_id": "gujarati"},
            AudioLanguage.KANNADA: {"rate": 145, "voice_id": "kannada"},
            AudioLanguage.MALAYALAM: {"rate": 140, "voice_id": "malayalam"},
            AudioLanguage.PUNJABI: {"rate": 150, "voice_id": "punjabi"},
            AudioLanguage.ODIA: {"rate": 145, "voice_id": "odia"},
            AudioLanguage.ENGLISH: {"rate": 160, "voice_id": "english"}
        }
        
        if AUDIO_AVAILABLE and self.tts_engine:
            self._initialize_voices()
    
    def _initialize_voices(self):
        """Initialize available voices"""
        if not AUDIO_AVAILABLE:
            return
        
        voices = self.tts_engine.getProperty('voices')
        for voice in voices:
            print(f"Available voice: {voice.id}")
    
    def create_voice_profile(self, profile_id: str, profile: VoiceProfile):
        """Create custom voice profile"""
        self.voice_profiles[profile_id] = profile
    
    def synthesize_speech(self, text: str, language: AudioLanguage, 
                         voice_profile: Optional[VoiceProfile] = None) -> bytes:
        """Synthesize speech with advanced voice customization"""
        if not AUDIO_AVAILABLE:
            # Mock audio data
            return b"mock_audio_data_" + text.encode()
        
        try:
            # Configure voice settings
            if voice_profile:
                self._apply_voice_profile(voice_profile)
            else:
                self._apply_language_settings(language)
            
            # Generate speech
            audio_file = f"temp_audio_{int(time.time())}.wav"
            self.tts_engine.save_to_file(text, audio_file)
            self.tts_engine.runAndWait()
            
            # Read audio data
            with open(audio_file, 'rb') as f:
                audio_data = f.read()
            
            # Clean up temp file
            import os
            os.remove(audio_file)
            
            return audio_data
            
        except Exception as e:
            logging.error(f"Speech synthesis error: {e}")
            return b"error_audio_data"
    
    def _apply_voice_profile(self, profile: VoiceProfile):
        """Apply voice profile settings"""
        if not AUDIO_AVAILABLE:
            return
        
        # Set speech rate
        rate = self.tts_engine.getProperty('rate')
        self.tts_engine.setProperty('rate', int(rate * profile.speed))
        
        # Set volume
        self.tts_engine.setProperty('volume', profile.volume)
        
        # Apply language-specific settings
        self._apply_language_settings(profile.language)
    
    def _apply_language_settings(self, language: AudioLanguage):
        """Apply language-specific TTS settings"""
        if not AUDIO_AVAILABLE:
            return
        
        settings = self.language_voices.get(language, {"rate": 150})
        self.tts_engine.setProperty('rate', settings["rate"])

class RealTimeTranslator:
    """Real-time multilingual translator with cultural adaptation"""
    
    def __init__(self):
        self.translation_cache: Dict[str, TranslationResult] = {}
        self.cultural_adapters: Dict[AudioLanguage, 'CulturalAdapter'] = {}
        self.translation_models = self._initialize_translation_models()
        
        # Initialize cultural adapters
        for language in AudioLanguage:
            self.cultural_adapters[language] = CulturalAdapter(language)
    
    def _initialize_translation_models(self) -> Dict:
        """Initialize translation models for each language pair"""
        # Mock translation models - in production would use actual ML models
        return {
            "models_loaded": True,
            "supported_pairs": len(AudioLanguage) * (len(AudioLanguage) - 1)
        }
    
    async def translate_realtime(self, text: str, source_lang: AudioLanguage, 
                               target_lang: AudioLanguage, 
                               context: Dict = None) -> TranslationResult:
        """Perform real-time translation with cultural adaptation"""
        start_time = time.time()
        
        # Check cache first
        cache_key = f"{text}_{source_lang.value}_{target_lang.value}"
        if cache_key in self.translation_cache:
            cached_result = self.translation_cache[cache_key]
            cached_result.processing_time = time.time() - start_time
            return cached_result
        
        # Perform translation
        translated_text = await self._translate_text(text, source_lang, target_lang)
        
        # Apply cultural adaptation
        cultural_adapter = self.cultural_adapters[target_lang]
        adapted_text = cultural_adapter.adapt_text(translated_text, context or {})
        
        # Create voice profile for target language
        voice_profile = self._create_voice_profile(target_lang, context)
        
        # Generate audio
        tts = AdvancedTextToSpeech(AudioConfig())
        audio_data = tts.synthesize_speech(adapted_text, target_lang, voice_profile)
        
        # Create result
        result = TranslationResult(
            original_text=text,
            translated_text=adapted_text,
            original_language=source_lang,
            target_language=target_lang,
            confidence=0.92,  # Mock confidence
            audio_data=audio_data,
            voice_profile=voice_profile,
            processing_time=time.time() - start_time,
            cultural_adaptation=cultural_adapter.get_adaptation_details()
        )
        
        # Cache result
        self.translation_cache[cache_key] = result
        
        return result
    
    async def _translate_text(self, text: str, source_lang: AudioLanguage, 
                            target_lang: AudioLanguage) -> str:
        """Translate text between languages"""
        # Mock translation - in production would use actual translation service
        translations = {
            ("What is the price?", AudioLanguage.ENGLISH, AudioLanguage.HINDI): "कीमत क्या है?",
            ("Premium tomatoes available", AudioLanguage.ENGLISH, AudioLanguage.TAMIL): "பிரீமியம் தக்காளி கிடைக்கிறது",
            ("I want to buy vegetables", AudioLanguage.ENGLISH, AudioLanguage.TELUGU): "నేను కూరగాయలు కొనాలనుకుంటున్నాను",
            ("Good quality rice", AudioLanguage.ENGLISH, AudioLanguage.BENGALI): "ভাল মানের চাল",
        }
        
        key = (text, source_lang, target_lang)
        if key in translations:
            return translations[key]
        
        # Fallback translation
        return f"[{target_lang.value}] {text}"
    
    def _create_voice_profile(self, language: AudioLanguage, context: Dict) -> VoiceProfile:
        """Create appropriate voice profile for language and context"""
        return VoiceProfile(
            language=language,
            gender=VoiceGender.NEUTRAL,
            speed=1.0,
            pitch=1.0,
            volume=0.8,
            accent="neutral",
            emotion="polite",
            formality="respectful"
        )

class CulturalAdapter:
    """Cultural adaptation for different languages and regions"""
    
    def __init__(self, language: AudioLanguage):
        self.language = language
        self.cultural_rules = self._load_cultural_rules()
        self.formality_patterns = self._load_formality_patterns()
        self.regional_variations = self._load_regional_variations()
    
    def _load_cultural_rules(self) -> Dict:
        """Load cultural adaptation rules for the language"""
        rules = {
            AudioLanguage.HINDI: {
                "greetings": ["नमस्ते", "आदाब"],
                "politeness_markers": ["जी", "कृपया"],
                "respect_terms": ["साहब", "जी"]
            },
            AudioLanguage.TAMIL: {
                "greetings": ["வணக்கம்"],
                "politeness_markers": ["தயவுசெய்து"],
                "respect_terms": ["ஐயா", "அம்மா"]
            },
            AudioLanguage.TELUGU: {
                "greetings": ["నమస్కారం"],
                "politeness_markers": ["దయచేసి"],
                "respect_terms": ["గారు", "అన్న"]
            }
        }
        return rules.get(self.language, {})
    
    def _load_formality_patterns(self) -> Dict:
        """Load formality patterns for the language"""
        return {
            "formal": {"prefix": "", "suffix": "", "tone": "respectful"},
            "informal": {"prefix": "", "suffix": "", "tone": "friendly"},
            "business": {"prefix": "", "suffix": "", "tone": "professional"}
        }
    
    def _load_regional_variations(self) -> Dict:
        """Load regional variations for the language"""
        return {
            "north": {"accent": "northern", "vocabulary": "standard"},
            "south": {"accent": "southern", "vocabulary": "regional"},
            "east": {"accent": "eastern", "vocabulary": "traditional"},
            "west": {"accent": "western", "vocabulary": "modern"}
        }
    
    def adapt_text(self, text: str, context: Dict) -> str:
        """Adapt text for cultural appropriateness"""
        adapted_text = text
        
        # Apply formality
        formality = context.get('formality', 'formal')
        if formality in self.formality_patterns:
            pattern = self.formality_patterns[formality]
            adapted_text = f"{pattern['prefix']}{adapted_text}{pattern['suffix']}"
        
        # Add cultural markers
        if 'add_respect' in context and context['add_respect']:
            respect_terms = self.cultural_rules.get('respect_terms', [])
            if respect_terms:
                adapted_text = f"{respect_terms[0]} {adapted_text}"
        
        return adapted_text
    
    def get_adaptation_details(self) -> Dict:
        """Get details about cultural adaptations applied"""
        return {
            "language": self.language.value,
            "cultural_rules_applied": len(self.cultural_rules),
            "formality_support": True,
            "regional_variations": len(self.regional_variations)
        }

class AudioStreamProcessor:
    """Real-time audio stream processing with advanced features"""
    
    def __init__(self, config: AudioConfig):
        self.config = config
        self.is_processing = False
        self.audio_buffer = queue.Queue(maxsize=100)
        self.processing_callbacks: List[Callable] = []
        self.noise_reducer = NoiseReducer() if config.noise_reduction else None
        self.echo_canceller = EchoCanceller() if config.echo_cancellation else None
        self.auto_gain = AutoGainControl() if config.auto_gain_control else None
    
    def start_stream_processing(self, callback: Callable[[AudioSegment], None]):
        """Start real-time audio stream processing"""
        self.is_processing = True
        self.processing_callbacks.append(callback)
        
        def process_stream():
            while self.is_processing:
                try:
                    if not self.audio_buffer.empty():
                        audio_data = self.audio_buffer.get(timeout=0.1)
                        processed_audio = self._process_audio_data(audio_data)
                        
                        if processed_audio:
                            for cb in self.processing_callbacks:
                                cb(processed_audio)
                except queue.Empty:
                    continue
                except Exception as e:
                    logging.error(f"Stream processing error: {e}")
        
        threading.Thread(target=process_stream, daemon=True).start()
    
    def _process_audio_data(self, audio_data: bytes) -> Optional[AudioSegment]:
        """Process raw audio data with advanced features"""
        try:
            # Apply noise reduction
            if self.noise_reducer:
                audio_data = self.noise_reducer.reduce_noise(audio_data)
            
            # Apply echo cancellation
            if self.echo_canceller:
                audio_data = self.echo_canceller.cancel_echo(audio_data)
            
            # Apply auto gain control
            if self.auto_gain:
                audio_data = self.auto_gain.adjust_gain(audio_data)
            
            # Create audio segment
            segment = AudioSegment(
                audio_data=audio_data,
                language=AudioLanguage.HINDI,  # Default
                confidence=0.8,
                timestamp=time.time(),
                duration=len(audio_data) / (self.config.sample_rate * 2),
                speaker_id="unknown",
                background_noise_level=0.1
            )
            
            return segment
            
        except Exception as e:
            logging.error(f"Audio processing error: {e}")
            return None
    
    def add_audio_data(self, audio_data: bytes):
        """Add audio data to processing queue"""
        if not self.audio_buffer.full():
            self.audio_buffer.put(audio_data)
    
    def stop_processing(self):
        """Stop stream processing"""
        self.is_processing = False
        self.processing_callbacks.clear()

# Audio processing utility classes
class NoiseReducer:
    """Advanced noise reduction"""
    def reduce_noise(self, audio_data: bytes) -> bytes:
        # Mock noise reduction
        return audio_data

class EchoCanceller:
    """Echo cancellation"""
    def cancel_echo(self, audio_data: bytes) -> bytes:
        # Mock echo cancellation
        return audio_data

class AutoGainControl:
    """Automatic gain control"""
    def adjust_gain(self, audio_data: bytes) -> bytes:
        # Mock gain adjustment
        return audio_data

class AdvancedAudioSystem:
    """Complete advanced audio system with real-time capabilities"""
    
    def __init__(self, config: AudioConfig = None):
        self.config = config or AudioConfig()
        self.speech_recognizer = AdvancedSpeechRecognizer(self.config)
        self.text_to_speech = AdvancedTextToSpeech(self.config)
        self.translator = RealTimeTranslator()
        self.stream_processor = AudioStreamProcessor(self.config)
        
        # Active sessions
        self.active_sessions: Dict[str, 'AudioSession'] = {}
        self.session_counter = 0
        
        # Performance metrics
        self.metrics = {
            'total_translations': 0,
            'average_latency': 0.0,
            'recognition_accuracy': 0.0,
            'active_sessions': 0
        }
    
    def create_audio_session(self, vendor_language: AudioLanguage, 
                           customer_language: AudioLanguage) -> str:
        """Create new audio session for vendor-customer interaction"""
        session_id = f"session_{self.session_counter}"
        self.session_counter += 1
        
        session = AudioSession(
            session_id=session_id,
            vendor_language=vendor_language,
            customer_language=customer_language,
            audio_system=self
        )
        
        self.active_sessions[session_id] = session
        self.metrics['active_sessions'] = len(self.active_sessions)
        
        return session_id
    
    async def process_vendor_audio(self, session_id: str, audio_data: bytes) -> TranslationResult:
        """Process vendor audio and translate to customer language"""
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = self.active_sessions[session_id]
        return await session.process_vendor_audio(audio_data)
    
    async def process_customer_audio(self, session_id: str, audio_data: bytes) -> TranslationResult:
        """Process customer audio and translate to vendor language"""
        if session_id not in self.active_sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = self.active_sessions[session_id]
        return await session.process_customer_audio(audio_data)
    
    def close_session(self, session_id: str):
        """Close audio session"""
        if session_id in self.active_sessions:
            self.active_sessions[session_id].close()
            del self.active_sessions[session_id]
            self.metrics['active_sessions'] = len(self.active_sessions)
    
    def get_performance_metrics(self) -> Dict:
        """Get system performance metrics"""
        return self.metrics.copy()

class AudioSession:
    """Individual audio session for vendor-customer interaction"""
    
    def __init__(self, session_id: str, vendor_language: AudioLanguage, 
                 customer_language: AudioLanguage, audio_system: AdvancedAudioSystem):
        self.session_id = session_id
        self.vendor_language = vendor_language
        self.customer_language = customer_language
        self.audio_system = audio_system
        self.is_active = True
        self.conversation_history: List[Dict] = []
        
        # Session-specific voice profiles
        self.vendor_voice_profile = VoiceProfile(
            language=vendor_language,
            gender=VoiceGender.NEUTRAL,
            formality="business"
        )
        
        self.customer_voice_profile = VoiceProfile(
            language=customer_language,
            gender=VoiceGender.NEUTRAL,
            formality="polite"
        )
    
    async def process_vendor_audio(self, audio_data: bytes) -> TranslationResult:
        """Process vendor audio and translate to customer language"""
        start_time = time.time()
        
        # Mock speech recognition
        vendor_text = self._mock_speech_recognition(audio_data, self.vendor_language)
        
        # Translate to customer language
        translation_result = await self.audio_system.translator.translate_realtime(
            vendor_text,
            self.vendor_language,
            self.customer_language,
            context={'role': 'vendor', 'formality': 'business'}
        )
        
        # Log conversation
        self.conversation_history.append({
            'timestamp': time.time(),
            'speaker': 'vendor',
            'original_text': vendor_text,
            'translated_text': translation_result.translated_text,
            'processing_time': time.time() - start_time
        })
        
        return translation_result
    
    async def process_customer_audio(self, audio_data: bytes) -> TranslationResult:
        """Process customer audio and translate to vendor language"""
        start_time = time.time()
        
        # Mock speech recognition
        customer_text = self._mock_speech_recognition(audio_data, self.customer_language)
        
        # Translate to vendor language
        translation_result = await self.audio_system.translator.translate_realtime(
            customer_text,
            self.customer_language,
            self.vendor_language,
            context={'role': 'customer', 'formality': 'polite'}
        )
        
        # Log conversation
        self.conversation_history.append({
            'timestamp': time.time(),
            'speaker': 'customer',
            'original_text': customer_text,
            'translated_text': translation_result.translated_text,
            'processing_time': time.time() - start_time
        })
        
        return translation_result
    
    def _mock_speech_recognition(self, audio_data: bytes, language: AudioLanguage) -> str:
        """Mock speech recognition for demo purposes"""
        # In production, this would use actual speech recognition
        mock_phrases = {
            AudioLanguage.HINDI: [
                "टमाटर की कीमत क्या है?",
                "यह बहुत महंगा है",
                "क्या आप कम कीमत दे सकते हैं?",
                "यह अच्छी गुणवत्ता है"
            ],
            AudioLanguage.TAMIL: [
                "தக்காளியின் விலை என்ன?",
                "இது மிகவும் விலை அதிகம்",
                "குறைந்த விலை கொடுக்க முடியுமா?",
                "இது நல்ல தரம்"
            ],
            AudioLanguage.ENGLISH: [
                "What is the price of tomatoes?",
                "This is very expensive",
                "Can you give a lower price?",
                "This is good quality"
            ]
        }
        
        phrases = mock_phrases.get(language, ["Hello"])
        return phrases[hash(str(audio_data)) % len(phrases)]
    
    def get_conversation_summary(self) -> Dict:
        """Get conversation summary"""
        return {
            'session_id': self.session_id,
            'vendor_language': self.vendor_language.value,
            'customer_language': self.customer_language.value,
            'total_exchanges': len(self.conversation_history),
            'average_processing_time': sum(h['processing_time'] for h in self.conversation_history) / max(len(self.conversation_history), 1),
            'conversation_duration': time.time() - self.conversation_history[0]['timestamp'] if self.conversation_history else 0
        }
    
    def close(self):
        """Close the session"""
        self.is_active = False

# Example usage and testing
if __name__ == "__main__":
    async def test_advanced_audio_system():
        """Test the advanced audio system"""
        print("Testing Advanced MandiSense Audio System...")
        
        # Create audio system
        config = AudioConfig(quality=AudioQuality.HIGH, real_time_processing=True)
        audio_system = AdvancedAudioSystem(config)
        
        # Create session
        session_id = audio_system.create_audio_session(
            AudioLanguage.HINDI,
            AudioLanguage.TAMIL
        )
        
        print(f"Created session: {session_id}")
        
        # Mock audio data
        vendor_audio = b"mock_vendor_audio_data"
        customer_audio = b"mock_customer_audio_data"
        
        # Process vendor audio
        vendor_result = await audio_system.process_vendor_audio(session_id, vendor_audio)
        print(f"Vendor said: {vendor_result.original_text}")
        print(f"Translated to customer: {vendor_result.translated_text}")
        print(f"Processing time: {vendor_result.processing_time:.3f}s")
        
        # Process customer audio
        customer_result = await audio_system.process_customer_audio(session_id, customer_audio)
        print(f"Customer said: {customer_result.original_text}")
        print(f"Translated to vendor: {customer_result.translated_text}")
        print(f"Processing time: {customer_result.processing_time:.3f}s")
        
        # Get session summary
        session = audio_system.active_sessions[session_id]
        summary = session.get_conversation_summary()
        print(f"Session summary: {summary}")
        
        # Get performance metrics
        metrics = audio_system.get_performance_metrics()
        print(f"System metrics: {metrics}")
        
        # Close session
        audio_system.close_session(session_id)
        print("Session closed")
    
    # Run test
    import asyncio
    asyncio.run(test_advanced_audio_system())