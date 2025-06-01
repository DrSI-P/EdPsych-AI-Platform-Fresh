'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Languages, 
  Settings, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useI18n } from './i18n-provider';
import { 
  SupportedLanguage, 
  UserLanguagePreferences,
  MultilingualAccessibilityOptions
} from '@/lib/i18n/types';
import { I18nService } from '@/lib/i18n/i18nService';

interface LanguageSettingsProps {
  userId: string;
  className?: string;
}

export const LanguageSettings: React.FC<LanguageSettingsProps> = ({
  userId,
  className = ''
}) => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const [preferences, setPreferences] = useState<UserLanguagePreferences | null>(null);
  const [accessibilityOptions, setAccessibilityOptions] = useState<MultilingualAccessibilityOptions>({
    simplifiedLanguage: false,
    glossaryTerms: true,
    culturalContextNotes: true,
    readingLevel: 'intermediate',
    specialEducationalNeedsAdaptations: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const i18nService = I18nService.getInstance();
  
  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userPreferences = await i18nService.getUserLanguagePreferences(userId);
        setPreferences(userPreferences);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading language preferences:', err);
        setError(t('error_loading_preferences', 'settings'));
        setIsLoading(false);
      }
    };
    
    loadPreferences();
  }, [userId, t]);
  
  // Handle primary language change
  const handlePrimaryLanguageChange = async (language: SupportedLanguage) => {
    if (!preferences) return;
    
    try {
      const updatedPreferences: UserLanguagePreferences = {
        ...preferences,
        primaryLanguage: language
      };
      
      setPreferences(updatedPreferences);
      
      // Apply language change immediately
      await changeLanguage(language);
    } catch (err) {
      console.error('Error changing primary language:', err);
      setError(t('error_changing_language', 'settings'));
    }
  };
  
  // Handle toggle changes
  const handleToggleChange = (field: keyof Omit<UserLanguagePreferences, 'userId' | 'primaryLanguage' | 'secondaryLanguages'>) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [field]: !preferences[field]
    });
  };
  
  // Handle accessibility option changes
  const handleAccessibilityOptionChange = (field: keyof MultilingualAccessibilityOptions, value) => {
    setAccessibilityOptions({
      ...accessibilityOptions,
      [field]: value
    });
  };
  
  // Save preferences
  const savePreferences = async () => {
    if (!preferences) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const success = await i18nService.updateUserLanguagePreferences(preferences);
      
      if (success) {
        setSuccessMessage(t('preferences_saved', 'settings'));
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(t('error_saving_preferences', 'settings'));
      }
      
      setIsSaving(false);
    } catch (err) {
      console.error('Error saving language preferences:', err);
      setError(t('error_saving_preferences', 'settings'));
      setIsSaving(false);
    }
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('language_settings', 'settings')}</CardTitle>
          <CardDescription>
            {t('language_settings_description', 'settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-centre justify-centre p-6">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>{t('loading', 'common')}</span>
        </CardContent>
      </Card>
    );
  }
  
  // If error and no preferences, show error state
  if (error && !preferences) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('language_settings', 'settings')}</CardTitle>
          <CardDescription>
            {t('language_settings_description', 'settings')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-centre text-destructive p-6">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>
            {t('retry', 'common')}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  // If no preferences (shouldn't happen but just in case)
  if (!preferences) {
    return null;
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t('language_settings', 'settings')}</CardTitle>
        <CardDescription>
          {t('language_settings_description', 'settings')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">
              <Globe className="h-4 w-4 mr-2" />
              {t('general', 'settings')}
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Settings className="h-4 w-4 mr-2" />
              {t('accessibility', 'settings')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6 pt-4">
            {/* Primary Language */}
            <div className="space-y-2">
              <Label htmlFor="primaryLanguage">
                {t('primary_language', 'settings')}
              </Label>
              <Select
                value={preferences.primaryLanguage}
                onValueChange={(value) => handlePrimaryLanguageChange(value as SupportedLanguage)}
              >
                <SelectTrigger id="primaryLanguage">
                  <SelectValue placeholder={t('select_language', 'settings')} />
                </SelectTrigger>
                <SelectContent>
                  {i18nService.getEnabledLanguages().map(language => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.nativeName} ({language.englishName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('primary_language_description', 'settings')}
              </p>
            </div>
            
            <Separator />
            
            {/* Auto-detect */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="autoDetect">
                  {t('auto_detect_language', 'settings')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('auto_detect_description', 'settings')}
                </p>
              </div>
              <Switch
                id="autoDetect"
                checked={preferences.autoDetect}
                onCheckedChange={() => handleToggleChange('autoDetect')}
              />
            </div>
            
            {/* Translate Content */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="translateContent">
                  {t('translate_platform_content', 'settings')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('translate_platform_description', 'settings')}
                </p>
              </div>
              <Switch
                id="translateContent"
                checked={preferences.translateContent}
                onCheckedChange={() => handleToggleChange('translateContent')}
              />
            </div>
            
            {/* Translate User Content */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="translateUserContent">
                  {t('translate_user_content', 'settings')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('translate_user_description', 'settings')}
                </p>
              </div>
              <Switch
                id="translateUserContent"
                checked={preferences.translateUserContent}
                onCheckedChange={() => handleToggleChange('translateUserContent')}
              />
            </div>
            
            {/* Translate Communications */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="translateCommunications">
                  {t('translate_communications', 'settings')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('translate_communications_description', 'settings')}
                </p>
              </div>
              <Switch
                id="translateCommunications"
                checked={preferences.translateCommunications}
                onCheckedChange={() => handleToggleChange('translateCommunications')}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-6 pt-4">
            {/* Simplified Language */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="simplifiedLanguage">
                  {t('simplified_language', 'accessibility')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('simplified_language_description', 'accessibility')}
                </p>
              </div>
              <Switch
                id="simplifiedLanguage"
                checked={accessibilityOptions.simplifiedLanguage}
                onCheckedChange={() => handleAccessibilityOptionChange('simplifiedLanguage', !accessibilityOptions.simplifiedLanguage)}
              />
            </div>
            
            {/* Glossary Terms */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="glossaryTerms">
                  {t('glossary_terms', 'accessibility')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('glossary_terms_description', 'accessibility')}
                </p>
              </div>
              <Switch
                id="glossaryTerms"
                checked={accessibilityOptions.glossaryTerms}
                onCheckedChange={() => handleAccessibilityOptionChange('glossaryTerms', !accessibilityOptions.glossaryTerms)}
              />
            </div>
            
            {/* Cultural Context Notes */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="culturalContextNotes">
                  {t('cultural_context_notes', 'accessibility')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('cultural_context_description', 'accessibility')}
                </p>
              </div>
              <Switch
                id="culturalContextNotes"
                checked={accessibilityOptions.culturalContextNotes}
                onCheckedChange={() => handleAccessibilityOptionChange('culturalContextNotes', !accessibilityOptions.culturalContextNotes)}
              />
            </div>
            
            {/* Reading Level */}
            <div className="space-y-2">
              <Label htmlFor="readingLevel">
                {t('reading_level', 'accessibility')}
              </Label>
              <Select
                value={accessibilityOptions.readingLevel}
                onValueChange={(value) => handleAccessibilityOptionChange('readingLevel', value)}
              >
                <SelectTrigger id="readingLevel">
                  <SelectValue placeholder={t('select_reading_level', 'accessibility')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t('beginner', 'accessibility')}</SelectItem>
                  <SelectItem value="intermediate">{t('intermediate', 'accessibility')}</SelectItem>
                  <SelectItem value="advanced">{t('advanced', 'accessibility')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {t('reading_level_description', 'accessibility')}
              </p>
            </div>
            
            {/* Special Educational Needs Adaptations */}
            <div className="flex items-centre justify-between">
              <div>
                <Label htmlFor="specialEducationalNeedsAdaptations">
                  {t('sen_adaptations', 'accessibility')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('sen_adaptations_description', 'accessibility')}
                </p>
              </div>
              <Switch
                id="specialEducationalNeedsAdaptations"
                checked={accessibilityOptions.specialEducationalNeedsAdaptations}
                onCheckedChange={() => handleAccessibilityOptionChange('specialEducationalNeedsAdaptations', !accessibilityOptions.specialEducationalNeedsAdaptations)}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Error message */}
        {error && (
          <div className="flex items-centre text-destructive mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="flex items-centre text-green-600 mt-4">
            <Check className="h-4 w-4 mr-2" />
            <span className="text-sm">{successMessage}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t('cancel', 'common')}
        </Button>
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('saving', 'common')}
            </>
          ) : (
            t('save_changes', 'common')
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LanguageSettings;
