"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from '@/components/i18n/i18n-provider';
import { useVoiceInput } from '@/providers/voice-input-provider';
import { SupportedLanguage, TranslationNamespace } from '@/lib/i18n/types';
import { Mic, Globe, Languages, Check, AlertTriangle } from 'lucide-react';

/**
 * VoiceInputLanguageIntegration Component
 * 
 * This component integrates the voice input system with the language preferences,
 * allowing for multilingual voice recognition and commands across the platform.
 */
export function VoiceInputLanguageIntegration() {
  const { t, currentLanguage, changeLanguage, isRtl } = useI18n();
  const { isAvailable, settings, updateSettings } = useVoiceInput();
  
  // Local state for voice language settings
  const [voiceLanguage, setVoiceLanguage] = useState<string>(currentLanguage);
  const [syncWithUILanguage, setSyncWithUILanguage] = useState<boolean>(true);
  const [multilingualCommands, setMultilingualCommands] = useState<boolean>(true);
  const [accentAdaptation, setAccentAdaptation] = useState<boolean>(true);
  const [dialectRecognition, setDialectRecognition] = useState<boolean>(false);
  const [languageDetection, setLanguageDetection] = useState<boolean>(true);
  
  // Update voice language when UI language changes if sync is enabled
  useEffect(() => {
    if (syncWithUILanguage) {
      setVoiceLanguage(currentLanguage);
    }
  }, [currentLanguage, syncWithUILanguage]);
  
  // Language options with dialect variants
  const languageOptions = [
    { value: SupportedLanguage.ENGLISH_UK, label: "English (UK)", dialects: ["General", "Scottish", "Welsh", "Northern"] },
    { value: SupportedLanguage.WELSH, label: "Cymraeg (Welsh)", dialects: ["North Wales", "South Wales"] },
    { value: SupportedLanguage.POLISH, label: "Polski (Polish)", dialects: ["Standard"] },
    { value: SupportedLanguage.URDU, label: "اردو (Urdu)", dialects: ["Standard"] },
    { value: SupportedLanguage.PUNJABI, label: "ਪੰਜਾਬੀ (Punjabi)", dialects: ["Eastern", "Western"] },
    { value: SupportedLanguage.ARABIC, label: "العربية (Arabic)", dialects: ["Standard", "Levantine", "Egyptian"] }
  ];
  
  // Get current language option
  const getCurrentLanguageOption = () => {
    return languageOptions.find(option => option.value === voiceLanguage) || languageOptions[0];
  };
  
  // Sample voice commands for different languages
  const sampleCommands = {
    [SupportedLanguage.ENGLISH_UK]: ["Open dashboard", "Start lesson", "Show my progress", "Read this aloud"],
    [SupportedLanguage.WELSH]: ["Agor dangosfwrdd", "Dechrau gwers", "Dangos fy nghynnydd", "Darllen hyn yn uchel"],
    [SupportedLanguage.POLISH]: ["Otwórz panel", "Rozpocznij lekcję", "Pokaż mój postęp", "Przeczytaj to na głos"],
    [SupportedLanguage.URDU]: ["ڈیش بورڈ کھولیں", "سبق شروع کریں", "میری پیشرفت دکھائیں", "اسے بلند آواز میں پڑھیں"],
    [SupportedLanguage.PUNJABI]: ["ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ", "ਪਾਠ ਸ਼ੁਰੂ ਕਰੋ", "ਮੇਰੀ ਤਰੱਕੀ ਦਿਖਾਓ", "ਇਸਨੂੰ ਉੱਚੀ ਪੜ੍ਹੋ"],
    [SupportedLanguage.ARABIC]: ["افتح لوحة المعلومات", "ابدأ الدرس", "أظهر تقدمي", "اقرأ هذا بصوت عالٍ"]
  };
  
  // Get commands for current language
  const getCurrentLanguageCommands = () => {
    return sampleCommands[voiceLanguage as keyof typeof sampleCommands] || sampleCommands[SupportedLanguage.ENGLISH_UK];
  };
  
  // Handle language change
  const handleLanguageChange = (language: string) => {
    setVoiceLanguage(language);
    if (syncWithUILanguage) {
      changeLanguage(language as SupportedLanguage);
    }
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    // In a real implementation, this would update the voice input settings
    // For now, we'll just log the settings
    console.log('Saving voice language settings:', {
      voiceLanguage,
      syncWithUILanguage,
      multilingualCommands,
      accentAdaptation,
      dialectRecognition,
      languageDetection
    });
    
    // Mock update settings
    if (updateSettings) {
      updateSettings({
        ...settings,
        language: voiceLanguage as SupportedLanguage,
        multilingualCommands,
        accentAdaptation,
        dialectRecognition,
        languageDetection
      });
    }
  };
  
  return (
    <Card className={`w-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Languages className="mr-2 h-5 w-5" />
          {t('voice_language_integration', TranslationNamespace.ACCESSIBILITY, { default: 'Voice Input Language Integration' })}
        </CardTitle>
        <CardDescription>
          {t('voice_language_integration_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Configure multilingual voice recognition and commands' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAvailable ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sync-language" className="font-medium">
                  {t('sync_with_ui', TranslationNamespace.ACCESSIBILITY, { default: 'Sync with UI Language' })}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('sync_with_ui_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Automatically use the same language for voice input and UI' })}
                </p>
              </div>
              <Switch 
                id="sync-language" 
                checked={syncWithUILanguage} 
                onCheckedChange={setSyncWithUILanguage}
                aria-label={t('sync_with_ui', TranslationNamespace.ACCESSIBILITY, { default: 'Toggle sync with UI language' })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="voice-language">
                {t('voice_language', TranslationNamespace.ACCESSIBILITY, { default: 'Voice Recognition Language' })}
              </Label>
              <Select value={voiceLanguage} onValueChange={handleLanguageChange} disabled={syncWithUILanguage}>
                <SelectTrigger id="voice-language">
                  <SelectValue placeholder={t('select_language', TranslationNamespace.COMMON, { default: 'Select language' })} />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {syncWithUILanguage && (
                <p className="text-xs text-muted-foreground">
                  {t('language_synced', TranslationNamespace.ACCESSIBILITY, { default: 'Voice language is synced with UI language' })}
                </p>
              )}
            </div>
            
            {dialectRecognition && (
              <div className="space-y-2">
                <Label htmlFor="dialect-select">
                  {t('dialect', TranslationNamespace.ACCESSIBILITY, { default: 'Dialect/Accent' })}
                </Label>
                <Select defaultValue={getCurrentLanguageOption().dialects[0]}>
                  <SelectTrigger id="dialect-select">
                    <SelectValue placeholder={t('select_dialect', TranslationNamespace.ACCESSIBILITY, { default: 'Select dialect' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {getCurrentLanguageOption().dialects.map((dialect) => (
                      <SelectItem key={dialect} value={dialect}>
                        {dialect}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="multilingual-commands" className="font-medium">
                    {t('multilingual_commands', TranslationNamespace.ACCESSIBILITY, { default: 'Multilingual Commands' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('multilingual_commands_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Recognize commands in multiple languages' })}
                  </p>
                </div>
                <Switch 
                  id="multilingual-commands" 
                  checked={multilingualCommands} 
                  onCheckedChange={setMultilingualCommands}
                  aria-label={t('multilingual_commands', TranslationNamespace.ACCESSIBILITY, { default: 'Toggle multilingual commands' })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="accent-adaptation" className="font-medium">
                    {t('accent_adaptation', TranslationNamespace.ACCESSIBILITY, { default: 'Accent Adaptation' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('accent_adaptation_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Improve recognition for different accents' })}
                  </p>
                </div>
                <Switch 
                  id="accent-adaptation" 
                  checked={accentAdaptation} 
                  onCheckedChange={setAccentAdaptation}
                  aria-label={t('accent_adaptation', TranslationNamespace.ACCESSIBILITY, { default: 'Toggle accent adaptation' })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dialect-recognition" className="font-medium">
                    {t('dialect_recognition', TranslationNamespace.ACCESSIBILITY, { default: 'Dialect Recognition' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('dialect_recognition_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Enable specific dialect and regional accent support' })}
                  </p>
                </div>
                <Switch 
                  id="dialect-recognition" 
                  checked={dialectRecognition} 
                  onCheckedChange={setDialectRecognition}
                  aria-label={t('dialect_recognition', TranslationNamespace.ACCESSIBILITY, { default: 'Toggle dialect recognition' })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="language-detection" className="font-medium">
                    {t('language_detection', TranslationNamespace.ACCESSIBILITY, { default: 'Automatic Language Detection' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('language_detection_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Automatically detect spoken language' })}
                  </p>
                </div>
                <Switch 
                  id="language-detection" 
                  checked={languageDetection} 
                  onCheckedChange={setLanguageDetection}
                  aria-label={t('language_detection', TranslationNamespace.ACCESSIBILITY, { default: 'Toggle language detection' })}
                />
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <div className="p-3 border-b bg-muted/50">
                <h3 className="font-medium">
                  {t('available_commands', TranslationNamespace.ACCESSIBILITY, { default: 'Available Voice Commands' })}
                </h3>
              </div>
              <div className="p-3">
                <p className="text-sm mb-2">
                  {t('commands_in', TranslationNamespace.ACCESSIBILITY, { default: 'Commands in' })} {
                    languageOptions.find(option => option.value === voiceLanguage)?.label || voiceLanguage
                  }:
                </p>
                <ul className="space-y-1">
                  {getCurrentLanguageCommands().map((command, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <Mic className="h-3 w-3 mr-2 text-primary" />
                      <span>{command}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {multilingualCommands && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      {t('multilingual_enabled', TranslationNamespace.ACCESSIBILITY, { default: 'Multilingual Support Enabled' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('multilingual_enabled_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Voice commands will be recognized in multiple languages, improving accessibility for multilingual users.' })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted p-6 rounded-md text-center">
            <Mic className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">
              {t('voice_unavailable', TranslationNamespace.ACCESSIBILITY, { default: 'Voice Input Unavailable' })}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('voice_unavailable_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Voice input is not available on this device or browser.' })}
            </p>
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-left">
                    {t('browser_support', TranslationNamespace.ACCESSIBILITY, { default: 'Browser Support' })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    {t('browser_support_desc', TranslationNamespace.ACCESSIBILITY, { default: 'Voice input requires a modern browser with microphone access. Please ensure your browser is up to date and microphone permissions are granted.' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          className="w-full"
          disabled={!isAvailable}
        >
          {t('save_settings', TranslationNamespace.COMMON, { default: 'Save Settings' })}
        </Button>
      </CardFooter>
    </Card>
  );
}
