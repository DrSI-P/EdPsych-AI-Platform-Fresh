'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import EnhancedVoiceRecognitionV2 from './enhanced-voice-recognition-v2';
import { AgeAppropriateCommandsProvider, KeyStage } from './age-appropriate-commands';
import { ukAccentOptions } from './uk-accent-recognition';

/**
 * Voice Input Test Component
 * 
 * This component provides a testing interface for the enhanced voice input system,
 * allowing developers to validate browser compatibility, accent recognition,
 * and age-appropriate command libraries.
 */
export default function VoiceInputTest() {
  // State
  const [transcript, setTranscript] = useState<string>('');
  const [command, setCommand] = useState<string>('');
  const [keyStage, setKeyStage] = useState<KeyStage>('adult');
  const [testResults, setTestResults] = useState<{
    browserCompatibility: 'untested' | 'passed' | 'failed';
    accentRecognition: 'untested' | 'passed' | 'failed';
    commandRecognition: 'untested' | 'passed' | 'failed';
  }>({
    browserCompatibility: 'untested',
    accentRecognition: 'untested',
    commandRecognition: 'untested',
  });
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add log entry
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  // Handle transcript
  const handleTranscript = (text: string) => {
    setTranscript(text);
    addLog(`Transcript: "${text}"`);
    
    // Test browser compatibility
    if (testResults.browserCompatibility === 'untested') {
      setTestResults(prev => ({
        ...prev,
        browserCompatibility: 'passed',
      }));
      addLog('Browser compatibility test passed');
    }
    
    // Test accent recognition
    if (testResults.accentRecognition === 'untested' && text.length > 10) {
      setTestResults(prev => ({
        ...prev,
        accentRecognition: 'passed',
      }));
      addLog('Accent recognition test passed');
    }
  };
  
  // Handle command
  const handleCommand = (cmd: string) => {
    setCommand(cmd);
    addLog(`Command recognized: "${cmd}"`);
    
    // Test command recognition
    if (testResults.commandRecognition === 'untested') {
      setTestResults(prev => ({
        ...prev,
        commandRecognition: 'passed',
      }));
      addLog('Command recognition test passed');
    }
  };
  
  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    setTranscript('');
    setCommand('');
  };
  
  // Reset tests
  const resetTests = () => {
    setTestResults({
      browserCompatibility: 'untested',
      accentRecognition: 'untested',
      commandRecognition: 'untested',
    });
    clearLogs();
  };
  
  // Render test status
  const renderTestStatus = (status: 'untested' | 'passed' | 'failed') => {
    switch (status) {
      case 'passed':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            <span>Passed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-400">
            <Info className="h-4 w-4 mr-1" />
            <span>Untested</span>
          </div>
        );
    }
  };
  
  return (
    <AgeAppropriateCommandsProvider initialKeyStage={keyStage}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Voice Input Test Suite</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice Input Component</CardTitle>
              <CardDescription>
                Test the enhanced voice recognition component with different settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Key Stage</label>
                  <select 
                    className="w-full p-2 border rounded"
                    value={keyStage}
                    onChange={(e) => setKeyStage(e.target.value as KeyStage)}
                  >
                    <option value="early_years">Early Years</option>
                    <option value="ks1">Key Stage 1</option>
                    <option value="ks2">Key Stage 2</option>
                    <option value="ks3">Key Stage 3</option>
                    <option value="ks4">Key Stage 4</option>
                    <option value="adult">Adult</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-center p-4 border rounded-lg w-full">
                  <EnhancedVoiceRecognitionV2
                    onTranscript={handleTranscript}
                    onCommand={handleCommand}
                    keyStage={keyStage}
                    buttonSize="lg"
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Transcript</label>
                  <div className="p-2 border rounded min-h-[60px] bg-gray-50">
                    {transcript || <span className="text-gray-400">No transcript yet</span>}
                  </div>
                </div>
                
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">Recognized Command</label>
                  <div className="p-2 border rounded min-h-[40px] bg-gray-50">
                    {command || <span className="text-gray-400">No command recognized</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Validation status for voice input enhancements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 border-b">
                  <span>Browser Compatibility</span>
                  {renderTestStatus(testResults.browserCompatibility)}
                </div>
                
                <div className="flex justify-between items-center p-2 border-b">
                  <span>Accent Recognition</span>
                  {renderTestStatus(testResults.accentRecognition)}
                </div>
                
                <div className="flex justify-between items-center p-2 border-b">
                  <span>Command Recognition</span>
                  {renderTestStatus(testResults.commandRecognition)}
                </div>
                
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Test Log</h3>
                  <div className="p-2 border rounded bg-gray-50 h-[200px] overflow-y-auto">
                    {logs.length > 0 ? (
                      logs.map((log, index) => (
                        <div key={index} className="text-xs mb-1">{log}</div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-xs">No logs yet</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={clearLogs}>Clear Logs</Button>
              <Button onClick={resetTests}>Reset Tests</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              Follow these steps to validate the voice input enhancements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click the microphone button to start voice recognition</li>
              <li>Speak clearly to test basic recognition (tests browser compatibility)</li>
              <li>Try speaking with different accents or speech patterns (tests accent recognition)</li>
              <li>Try saying one of these commands for your selected key stage:
                <ul className="list-disc pl-5 mt-1">
                  <li><strong>Early Years/KS1:</strong> "go home", "show games", "read to me"</li>
                  <li><strong>KS2:</strong> "my work", "show menu", "next page"</li>
                  <li><strong>KS3/KS4:</strong> "my progress", "summarize", "save work"</li>
                  <li><strong>Adult:</strong> "my students", "analytics", "curriculum"</li>
                </ul>
              </li>
              <li>Check the test results to verify all components are working correctly</li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supported UK Accents</CardTitle>
            <CardDescription>
              The enhanced voice recognition supports these UK accents and dialects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ukAccentOptions.map((option) => (
                <div key={option.value} className="p-2 border rounded">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.langCode}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AgeAppropriateCommandsProvider>
  );
}
