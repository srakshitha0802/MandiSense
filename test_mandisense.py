from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app, origins="*")

collective_patterns = []
CONFIDENCE_THRESHOLD = 0.7

@app.route('/')
def index():
    return '''<!DOCTYPE html>
<html>
<head>
    <title>MandiSense - Fixed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f7fa; }
        .container { max-width: 800px; margin: 0 auto; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .voice-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .voice-panel { border: 1px solid #ddd; padding: 15px; border-radius: 6px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .form-group select, .form-group textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        .voice-button { background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
        .voice-button:disabled { background: #bdc3c7; cursor: not-allowed; }
        .voice-button.recording { background: #e74c3c; }
        .btn { background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 4px; width: 100%; cursor: pointer; }
        .btn:disabled { background: #bdc3c7; cursor: not-allowed; }
        .translation-display { background: #f8f9fa; padding: 12px; border-radius: 4px; margin-top: 10px; min-height: 60px; }
        .signal-card { background: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .error { background: #fdf2f2; border-left: 4px solid #e74c3c; color: #c0392b; padding: 15px; border-radius: 4px; }
        @media (max-width: 600px) { .voice-controls { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="section">
            <h1>MandiSense - Fixed & Functional</h1>
            <p>AI-powered collective market memory with ethical restraint</p>
        </div>
        
        <div class="section">
            <h2>Voice Translation</h2>
            <div class="voice-controls">
                <div class="voice-panel">
                    <h3>Vendor (Seller)</h3>
                    <div class="form-group">
                        <label for="vendorLanguage">Language:</label>
                        <select id="vendorLanguage">
                            <option value="hindi">Hindi</option>
                            <option value="tamil">Tamil</option>
                            <option value="telugu">Telugu</option>
                            <option value="english">English</option>
                        </select>
                    </div>
                    <button class="voice-button" id="vendorRecord">Record</button>
                    <button class="voice-button" id="vendorStop" disabled>Stop</button>
                    <div class="translation-display" id="vendorTranslation">
                        <div>Click record to start voice input...</div>
                    </div>
                </div>
                
                <div class="voice-panel">
                    <h3>Customer (Buyer)</h3>
                    <div class="form-group">
                        <label for="customerLanguage">Language:</label>
                        <select id="customerLanguage">
                            <option value="tamil">Tamil</option>
                            <option value="hindi">Hindi</option>
                            <option value="telugu">Telugu</option>
                            <option value="english">English</option>
                        </select>
                    </div>
                    <button class="voice-button" id="customerRecord">Record</button>
                    <button class="voice-button" id="customerStop" disabled>Stop</button>
                    <div class="translation-display" id="customerTranslation">
                        <div>Click record to start voice input...</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Process Negotiation</h2>
            <form id="negotiationForm">
                <div class="form-group">
                    <label for="vendorText">Vendor Text:</label>
                    <textarea id="vendorText" rows="3" placeholder="Enter vendor text or use voice input above..."></textarea>
                </div>
                <div class="form-group">
                    <label for="buyerText">Buyer Text:</label>
                    <textarea id="buyerText" rows="3" placeholder="Enter buyer text or use voice input above..."></textarea>
                </div>
                <div class="form-group">
                    <label for="commodity">Commodity:</label>
                    <select id="commodity">
                        <option value="tomatoes">Tomatoes</option>
                        <option value="onions">Onions</option>
                        <option value="rice">Rice</option>
                        <option value="vegetables">Vegetables</option>
                    </select>
                </div>
                <button type="submit" class="btn" id="processBtn">Process Negotiation</button>
            </form>
            <div id="results" style="display: none;"></div>
        </div>
    </div>

    <script>
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const speechSupported = !!SpeechRecognition;
        let isRecording = false;
        let currentRecognition = null;
        
        const speechLanguageCodes = {
            'hindi': 'hi-IN',
            'tamil': 'ta-IN', 
            'telugu': 'te-IN',
            'english': 'en-IN'
        };
        
        function startRecording(speaker) {
            if (isRecording) return;
            
            if (!speechSupported) {
                const text = prompt('Enter ' + speaker + ' text (Speech not supported):');
                if (text) handleSpeechResult(speaker, text);
                return;
            }
            
            const recognition = new SpeechRecognition();
            const languageSelect = document.getElementById(speaker + 'Language');
            const recordBtn = document.getElementById(speaker + 'Record');
            const stopBtn = document.getElementById(speaker + 'Stop');
            const translationDiv = document.getElementById(speaker + 'Translation');
            
            recognition.lang = speechLanguageCodes[languageSelect.value] || 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;
            
            recognition.onresult = function(event) {
                const text = event.results[0][0].transcript;
                handleSpeechResult(speaker, text);
            };
            
            recognition.onerror = function(event) {
                console.error('Speech error:', event.error);
                handleSpeechError(speaker, event.error);
            };
            
            recognition.onend = function() {
                stopRecording(speaker);
            };
            
            isRecording = true;
            currentRecognition = recognition;
            recordBtn.disabled = true;
            recordBtn.classList.add('recording');
            stopBtn.disabled = false;
            translationDiv.innerHTML = '<div>Listening...</div>';
            
            recognition.start();
            
            setTimeout(function() {
                if (isRecording) stopRecording(speaker);
            }, 10000);
        }
        
        function stopRecording(speaker) {
            if (!isRecording) return;
            
            isRecording = false;
            const recordBtn = document.getElementById(speaker + 'Record');
            const stopBtn = document.getElementById(speaker + 'Stop');
            
            recordBtn.disabled = false;
            recordBtn.classList.remove('recording');
            stopBtn.disabled = true;
            
            if (currentRecognition) {
                currentRecognition.stop();
                currentRecognition = null;
            }
        }
        
        function handleSpeechResult(speaker, text) {
            const sourceLanguage = document.getElementById(speaker + 'Language').value;
            const targetLanguage = document.getElementById(speaker === 'vendor' ? 'customerLanguage' : 'vendorLanguage').value;
            const translationDiv = document.getElementById(speaker + 'Translation');
            const textArea = document.getElementById(speaker === 'vendor' ? 'vendorText' : 'buyerText');
            
            textArea.value = text;
            translationDiv.innerHTML = '<div>Original: ' + text + '</div><div>Translating...</div>';
            
            translateText(text, sourceLanguage, targetLanguage)
                .then(function(result) {
                    translationDiv.innerHTML = '<div>Original: ' + text + '</div><div>Translated: ' + result.translated_text + '</div>';
                })
                .catch(function(error) {
                    translationDiv.innerHTML = '<div>Original: ' + text + '</div><div>Translation failed</div>';
                });
        }
        
        function handleSpeechError(speaker, error) {
            const translationDiv = document.getElementById(speaker + 'Translation');
            translationDiv.innerHTML = '<div>Speech error: ' + error + '</div><div>Please use text input instead</div>';
            stopRecording(speaker);
        }
        
        async function translateText(text, sourceLanguage, targetLanguage) {
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    source_language: sourceLanguage,
                    target_language: targetLanguage
                })
            });
            return await response.json();
        }
        
        async function processNegotiation(vendorText, buyerText, commodity) {
            const response = await fetch('/api/process_negotiation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendor_text: vendorText,
                    buyer_text: buyerText,
                    commodity: commodity
                })
            });
            return await response.json();
        }
        
        function displayResults(data) {
            const resultsDiv = document.getElementById('results');
            let html = '<h3>Processing Results</h3>';
            
            if (data.vendor_signal && data.vendor_signal.confidence > 0) {
                html += '<div class="signal-card"><h4>Vendor Signal</h4><p>' + data.vendor_signal.text + '</p><small>Confidence: ' + (data.vendor_signal.confidence * 100).toFixed(1) + '%</small></div>';
            }
            
            if (data.buyer_signal && data.buyer_signal.confidence > 0) {
                html += '<div class="signal-card"><h4>Buyer Signal</h4><p>' + data.buyer_signal.text + '</p><small>Confidence: ' + (data.buyer_signal.confidence * 100).toFixed(1) + '%</small></div>';
            }
            
            html += '<div class="signal-card"><h4>Processing Info</h4><p>Patterns: ' + (data.collective_patterns_count || 0) + '</p><small>Time: ' + (data.processing_time || 'N/A') + '</small></div>';
            
            resultsDiv.innerHTML = html;
            resultsDiv.style.display = 'block';
        }
        
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('vendorRecord').addEventListener('click', function() { startRecording('vendor'); });
            document.getElementById('vendorStop').addEventListener('click', function() { stopRecording('vendor'); });
            document.getElementById('customerRecord').addEventListener('click', function() { startRecording('customer'); });
            document.getElementById('customerStop').addEventListener('click', function() { stopRecording('customer'); });
            
            document.getElementById('negotiationForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const vendorText = document.getElementById('vendorText').value.trim();
                const buyerText = document.getElementById('buyerText').value.trim();
                const commodity = document.getElementById('commodity').value;
                const processBtn = document.getElementById('processBtn');
                const resultsDiv = document.getElementById('results');
                
                if (!vendorText || !buyerText) {
                    resultsDiv.innerHTML = '<div class="error">Please provide both vendor and buyer input</div>';
                    resultsDiv.style.display = 'block';
                    return;
                }
                
                processBtn.disabled = true;
                processBtn.textContent = 'Processing...';
                resultsDiv.innerHTML = '<div>Processing negotiation...</div>';
                resultsDiv.style.display = 'block';
                
                try {
                    const result = await processNegotiation(vendorText, buyerText, commodity);
                    displayResults(result);
                } catch (error) {
                    resultsDiv.innerHTML = '<div class="error">Processing failed: ' + error.message + '</div>';
                } finally {
                    processBtn.disabled = false;
                    processBtn.textContent = 'Process Negotiation';
                }
            });
        });
    </script>
</body>
</html>'''

MOCK_TRANSLATIONS = {
    ('What is the price?', 'english', 'hindi'): 'Keemat kya hai?',
    ('Premium tomatoes available', 'english', 'tamil'): 'Premium tomato kidaikkirathu',
    ('I want to buy vegetables', 'english', 'telugu'): 'Nenu kooragayalu konali',
    ('Keemat kya hai?', 'hindi', 'english'): 'What is the price?',
    ('Tamatar acche hain', 'hindi', 'tamil'): 'Thakkali nalladu'
}

@app.route('/api/translate', methods=['POST'])
def translate_text():
    data = request.get_json()
    text = data.get('text', '').strip()
    source_lang = data.get('source_language', 'english')
    target_lang = data.get('target_language', 'hindi')
    
    if not text:
        return jsonify({'error': 'Text is required'}), 400
    
    if source_lang == target_lang:
        translated = text
        confidence = 1.0
    else:
        key = (text, source_lang, target_lang)
        if key in MOCK_TRANSLATIONS:
            translated = MOCK_TRANSLATIONS[key]
            confidence = 0.95
        else:
            translated = f"[{target_lang.upper()}] {text}"
            confidence = 0.6
    
    return jsonify({
        'original_text': text,
        'translated_text': translated,
        'source_language': source_lang,
        'target_language': target_lang,
        'confidence': confidence
    })

@app.route('/api/process_negotiation', methods=['POST'])
def process_negotiation():
    data = request.get_json()
    vendor_text = data.get('vendor_text', '').strip()
    buyer_text = data.get('buyer_text', '').strip()
    commodity = data.get('commodity', 'vegetables')
    
    if not vendor_text or not buyer_text:
        return jsonify({'error': 'Both vendor and buyer text are required'}), 400
    
    start_time = time.time()
    
    # Add to collective patterns
    pattern = {
        'vendor_text_length': len(vendor_text),
        'buyer_text_length': len(buyer_text),
        'commodity': commodity,
        'timestamp': time.time()
    }
    collective_patterns.append(pattern)
    
    if len(collective_patterns) > 100:
        collective_patterns.pop(0)
    
    # Generate alignment signals with silence-first logic
    def generate_signal():
        pattern_count = len(collective_patterns)
        
        if pattern_count < 10:
            return {
                'text': 'No reliable collective pattern available at this time.',
                'confidence': 0.0,
                'reasoning': 'Insufficient collective data'
            }
        
        mock_confidence = random.uniform(0.5, 0.9)
        
        if mock_confidence < CONFIDENCE_THRESHOLD:
            return {
                'text': 'No reliable collective pattern available at this time.',
                'confidence': mock_confidence,
                'reasoning': 'Confidence below threshold'
            }
        
        signals = [
            "This negotiation pattern appears similar to collaborative exchanges in the collective memory.",
            "The communication style reflects patterns typically associated with relationship-building approaches.",
            "This interaction shows characteristics common in trust-oriented market exchanges."
        ]
        
        return {
            'text': random.choice(signals),
            'confidence': mock_confidence,
            'reasoning': 'Pattern alignment detected'
        }
    
    vendor_signal = generate_signal()
    buyer_signal = generate_signal()
    
    processing_time = f"{(time.time() - start_time) * 1000:.0f}ms"
    
    return jsonify({
        'vendor_signal': vendor_signal,
        'buyer_signal': buyer_signal,
        'processing_time': processing_time,
        'collective_patterns_count': len(collective_patterns)
    })

if __name__ == '__main__':
    print("Starting MandiSense Fixed Web App...")
    print("Open http://localhost:5001 in your browser")
    app.run(debug=True, host='0.0.0.0', port=5001)
