import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Mic, MicOff, Volume2, VolumeX, Settings, Check, Info } from 'lucide-react';

/**
 * Voice Input & Speech Recognition component for EdPsych Connect
 * Provides voice input capabilities for students who struggle with typing
 */
const VoiceInputSystem = () => {
  const { data: session } = useSession();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [tempTranscript, setTempTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState({
    language: 'en-GB',
    continuous: true,
    interimResults: true,
    maxAlternatives: 1,
    autoStop: 10000, // Auto stop after 10 seconds of silence
    sensitivity: 'medium',
    punctuation: true,
    childMode: false, // Optimized for children's voices
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'cy-GB', name: 'Welsh' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'pl-PL', name: 'Polish' },
    { code: 'ur-PK', name: 'Urdu' },
  ]);
  
  // Reference to the SpeechRecognition instance
  const recognitionRef = React.useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      setErrorMessage('Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure recognition
    updateRecognitionSettings();
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setErrorMessage('');
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setErrorMessage('No speech was detected. Please try again.');
          break;
        case 'aborted':
          setErrorMessage('Speech recognition was aborted.');
          break;
        case 'audio-capture':
          setErrorMessage('No microphone was found. Please ensure your microphone is connected and permissions are granted.');
          break;
        case 'network':
          setErrorMessage('Network error occurred. Please check your internet connection.');
          break;
        case 'not-allowed':
          setErrorMessage('Microphone permission was denied. Please allow microphone access to use voice input.');
          break;
        case 'service-not-allowed':
          setErrorMessage('Speech recognition service is not allowed. Please try again later.');
          break;
        default:
          setErrorMessage(`Error occurred: ${event.error}`);
      }
    };
    
    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      // Get confidence score from the most recent result
      const confidenceScore = event.results[event.results.length - 1][0].confidence;
      setConfidence(Math.round(confidenceScore * 100));
      
      // Process results
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      // Update transcripts
      if (finalTranscript) {
        setTranscript(prev => {
          const newTranscript = prev ? `${prev} ${finalTranscript}` : finalTranscript;
          return settings.punctuation ? addPunctuation(newTranscript) : newTranscript;
        });
        setTempTranscript('');
      } else if (interimTranscript) {
        setTempTranscript(interimTranscript);
      }
    };
    
    // Clean up on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Update recognition settings when they change
  useEffect(() => {
    if (recognitionRef.current) {
      updateRecognitionSettings();
    }
  }, [settings]);
  
  // Update recognition settings
  const updateRecognitionSettings = () => {
    if (!recognitionRef.current) return;
    
    recognitionRef.current.lang = settings.language;
    recognitionRef.current.continuous = settings.continuous;
    recognitionRef.current.interimResults = settings.interimResults;
    recognitionRef.current.maxAlternatives = settings.maxAlternatives;
  };
  
  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setTempTranscript('');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition error:', error);
        setErrorMessage('Failed to start speech recognition. Please try again.');
      }
    }
  };
  
  // Clear transcript
  const clearTranscript = () => {
    setTranscript('');
    setTempTranscript('');
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  // Update a specific setting
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Speak the transcript using text-to-speech
  const speakTranscript = () => {
    if (!transcript) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = settings.language;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setErrorMessage('Text-to-speech failed. Please try again.');
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Copy transcript to clipboard
  const copyTranscript = async () => {
    if (!transcript) return;
    
    try {
      await navigator.clipboard.writeText(transcript);
      // Show success message
      const successMessage = document.getElementById('copy-success');
      successMessage.classList.remove('opacity-0');
      setTimeout(() => {
        successMessage.classList.add('opacity-0');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      setErrorMessage('Failed to copy text. Please try again.');
    }
  };
  
  // Submit transcript to the current form or input field
  const submitTranscript = () => {
    // This is a placeholder for the actual implementation
    // In a real implementation, this would find the active input field and insert the transcript
    console.log('Submitting transcript:', transcript);
    
    // Example: Find active element and insert text
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      
      activeElement.value = value.substring(0, start) + transcript + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + transcript.length;
      activeElement.focus();
      
      // Clear the transcript after submission
      clearTranscript();
    } else {
      setErrorMessage('No input field is selected. Please click on an input field and try again.');
    }
  };
  
  // Add basic punctuation to text
  const addPunctuation = (text) => {
    if (!settings.punctuation) return text;
    
    // This is a simple implementation and would be more sophisticated in a real system
    let result = text;
    
    // Capitalize first letter of sentences
    result = result.replace(/(^\s*\w|[.!?]\s*\w)/g, match => match.toUpperCase());
    
    // Add period at the end if missing
    if (!/[.!?]$/.test(result)) {
      result += '.';
    }
    
    return result;
  };
  
  // Get confidence level indicator
  const getConfidenceIndicator = () => {
    if (confidence >= 80) {
      return 'bg-green-500';
    } else if (confidence >= 60) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  };
  
  if (!isSupported) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <MicOff className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Speech Recognition Not Supported
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {errorMessage || 'Your browser does not support speech recognition. Please try using Chrome, Edge, or Safari.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voice Input System</h2>
          <button
            onClick={toggleSettings}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Speak clearly into your microphone to convert speech to text
        </p>
      </div>
      
      {/* Main Voice Input Area */}
      <div className="p-6">
        {/* Transcript Display */}
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-neutral-750 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {transcript}
              {tempTranscript && (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  {' '}{tempTranscript}
                </span>
              )}
            </p>
            {!transcript && !tempTranscript && (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {isListening ? 'Listening...' : 'Press the microphone button and start speaking'}
              </p>
            )}
          </div>
          
          {/* Confidence Indicator */}
          {isListening && (
            <div className="flex items-center mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                <div 
                  className={`h-2.5 rounded-full ${getConfidenceIndicator()}`} 
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
                {confidence}%
              </span>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full ${
                isListening 
                  ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 animate-pulse' 
                  : 'bg-primary text-white'
              }`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            
            <button
              onClick={speakTranscript}
              disabled={!transcript}
              className={`p-3 rounded-full ${
                isSpeaking
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 animate-pulse'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${!transcript ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isSpeaking ? 'Stop speaking' : 'Speak text'}
            >
              {isSpeaking ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearTranscript}
              disabled={!transcript && !tempTranscript}
              className={`px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                !transcript && !tempTranscript ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Clear
            </button>
            
            <button
              onClick={copyTranscript}
              disabled={!transcript}
              className={`px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 ${
                !transcript ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Copy
            </button>
            
            <button
              onClick={submitTranscript}
              disabled={!transcript}
              className={`px-3 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 ${
                !transcript ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Submit
            </button>
          </div>
        </div>
        
        {/* Copy Success Message */}
        <div 
          id="copy-success" 
          className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center transition-opacity duration-300 opacity-0"
        >
          <Check className="h-4 w-4 mr-2" />
          <span>Copied to clipboard!</span>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-start">
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Voice Input Settings</h3>
          
          <div className="space-y-4">
            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Continuous Listening */}
            <div className="flex items-center">
              <input
                id="continuous"
                type="checkbox"
                checked={settings.continuous}
                onChange={(e) => updateSetting('continuous', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
              />
              <label htmlFor="continuous" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Continuous listening (don't stop after silence)
              </label>
            </div>
            
            {/* Interim Results */}
            <div className="flex items-center">
              <input
                id="interimResults"
                type="checkbox"
                checked={settings.interimResults}
                onChange={(e) => updateSetting('interimResults', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
              />
              <label htmlFor="interimResults" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Show interim results while speaking
              </label>
            </div>
            
            {/* Auto Punctuation */}
            <div className="flex items-center">
              <input
                id="punctuation"
                type="checkbox"
                checked={settings.punctuation}
                onChange={(e) => updateSetting('punctuation', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
              />
              <label htmlFor="punctuation" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Auto-add punctuation
              </label>
            </div>
            
            {/* Child Mode */}
            <div className="flex items-center">
              <input
                id="childMode"
                type="checkbox"
                checked={settings.childMode}
                onChange={(e) => updateSetting('childMode', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-neutral-700"
              />
              <label htmlFor="childMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Child voice mode (optimized for younger voices)
              </label>
            </div>
            
            {/* Sensitivity */}
            <div>
              <label htmlFor="sensitivity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Microphone Sensitivity
              </label>
              <select
                id="sensitivity"
                value={settings.sensitivity}
                onChange={(e) => updateSetting('sensitivity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              >
                <option value="low">Low (fewer false activations)</option>
                <option value="medium">Medium (balanced)</option>
                <option value="high">High (better for quiet speakers)</option>
              </select>
            </div>
            
            {/* Auto Stop Timeout */}
            <div>
              <label htmlFor="autoStop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Auto-stop after silence (milliseconds)
              </label>
              <input
                id="autoStop"
                type="number"
                min="1000"
                max="60000"
                step="1000"
                value={settings.autoStop}
                onChange={(e) => updateSetting('autoStop', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {settings.autoStop / 1000} seconds of silence before automatically stopping
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Help Text */}
      <div className="p-4 bg-gray-50 dark:bg-neutral-750 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Tip:</strong> For best results, speak clearly and at a moderate pace. If you're having trouble, try adjusting the microphone sensitivity in settings.
        </p>
      </div>
    </div>
  );
};

export default VoiceInputSystem;
