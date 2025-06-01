"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from '@/components/i18n/i18n-provider';
import { SupportedLanguage, TranslationNamespace } from '@/lib/i18n/types';
import { CurriculumContentLocalization } from './CurriculumContentLocalization';
import { VoiceInputLanguageIntegration } from './VoiceInputLanguageIntegration';
import { Globe, Languages, Check, Settings, Search } from 'lucide-react';

/**
 * EnhancedLanguageSwitcher Component
 * 
 * An improved language selection experience with search, favorites,
 * and accessibility enhancements.
 */
export function EnhancedLanguageSwitcher() {
  const { t, currentLanguage, changeLanguage, isRtl } = useI18n();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteLanguages, setFavoriteLanguages] = useState<SupportedLanguage[]>([
    SupportedLanguage.ENGLISH_UK,
    SupportedLanguage.WELSH
  ]);
  
  // Language options with metadata
  const languageOptions = [
    { value: SupportedLanguage.ENGLISH_UK, label: "English (UK)", nativeName: "English (UK)", flagCode: "gb", prevalence: "high" },
    { value: SupportedLanguage.WELSH, label: "Welsh", nativeName: "Cymraeg", flagCode: "wales", prevalence: "high" },
    { value: SupportedLanguage.POLISH, label: "Polish", nativeName: "Polski", flagCode: "pl", prevalence: "high" },
    { value: SupportedLanguage.URDU, label: "Urdu", nativeName: "اردو", flagCode: "pk", prevalence: "high" },
    { value: SupportedLanguage.PUNJABI, label: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flagCode: "in", prevalence: "high" },
    { value: SupportedLanguage.ARABIC, label: "Arabic", nativeName: "العربية", flagCode: "sa", prevalence: "medium" },
    { value: SupportedLanguage.FRENCH, label: "French", nativeName: "Français", flagCode: "fr", prevalence: "medium" },
    { value: SupportedLanguage.SPANISH, label: "Spanish", nativeName: "Español", flagCode: "es", prevalence: "medium" },
    { value: SupportedLanguage.GERMAN, label: "German", nativeName: "Deutsch", flagCode: "de", prevalence: "low" },
    { value: SupportedLanguage.ITALIAN, label: "Italian", nativeName: "Italiano", flagCode: "it", prevalence: "low" },
    { value: SupportedLanguage.PORTUGUESE, label: "Portuguese", nativeName: "Português", flagCode: "pt", prevalence: "low" },
    { value: SupportedLanguage.ROMANIAN, label: "Romanian", nativeName: "Română", flagCode: "ro", prevalence: "low" },
    { value: SupportedLanguage.BENGALI, label: "Bengali", nativeName: "বাংলা", flagCode: "bd", prevalence: "medium" },
    { value: SupportedLanguage.SOMALI, label: "Somali", nativeName: "Soomaali", flagCode: "so", prevalence: "medium" },
    { value: SupportedLanguage.TURKISH, label: "Turkish", nativeName: "Türkçe", flagCode: "tr", prevalence: "low" }
  ];
  
  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? languageOptions.filter(lang => 
        lang.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()))
    : languageOptions;
  
  // Group languages by prevalence
  const groupedLanguages = {
    high: filteredLanguages.filter(lang => lang.prevalence === "high"),
    medium: filteredLanguages.filter(lang => lang.prevalence === "medium"),
    low: filteredLanguages.filter(lang => lang.prevalence === "low")
  };
  
  // Toggle favorite language
  const toggleFavorite = (language: SupportedLanguage) => {
    if (favoriteLanguages.includes(language)) {
      setFavoriteLanguages(favoriteLanguages.filter(lang => lang !== language));
    } else {
      setFavoriteLanguages([...favoriteLanguages, language]);
    }
  };
  
  // Check if language is favorite
  const isFavorite = (language: SupportedLanguage) => {
    return favoriteLanguages.includes(language);
  };
  
  // Render language item
  const renderLanguageItem = (language: typeof languageOptions[0]) => {
    const isSelected = currentLanguage === language.value;
    const isFav = isFavorite(language.value);
    
    return (
      <div 
        key={language.value}
        className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
          isSelected ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-muted'
        }`}
        onClick={() => changeLanguage(language.value)}
      >
        <div className="flex items-center">
          <div className="w-8 h-6 mr-3 relative">
            <span className={`fi fi-${language.flagCode}`}></span>
          </div>
          <div>
            <p className="font-medium text-sm">{language.nativeName}</p>
            <p className="text-xs text-muted-foreground">{language.label}</p>
          </div>
        </div>
        <div className="flex items-center">
          {isSelected && (
            <Check className="h-4 w-4 text-primary mr-2" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 ${isFav ? 'text-amber-500' : 'text-muted-foreground'}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(language.value);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFav ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={`w-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="mr-2 h-5 w-5" />
          {t('language_preferences', TranslationNamespace.COMMON, { default: 'Language Preferences' })}
        </CardTitle>
        <CardDescription>
          {t('language_preferences_desc', TranslationNamespace.COMMON, { default: 'Choose your preferred language for the platform' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="languages">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="languages">
              {t('languages', TranslationNamespace.COMMON, { default: 'Languages' })}
            </TabsTrigger>
            <TabsTrigger value="curriculum">
              {t('curriculum', TranslationNamespace.COMMON, { default: 'Curriculum' })}
            </TabsTrigger>
            <TabsTrigger value="voice">
              {t('voice', TranslationNamespace.COMMON, { default: 'Voice' })}
            </TabsTrigger>
          </TabsList>
          
          {/* Languages Tab */}
          <TabsContent value="languages" className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('search_languages', TranslationNamespace.COMMON, { default: 'Search languages...' })}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {favoriteLanguages.length > 0 && !searchQuery && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {t('favorite_languages', TranslationNamespace.COMMON, { default: 'Favorite Languages' })}
                </h3>
                <div className="space-y-1">
                  {languageOptions
                    .filter(lang => favoriteLanguages.includes(lang.value))
                    .map(renderLanguageItem)}
                </div>
              </div>
            )}
            
            {groupedLanguages.high.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {searchQuery 
                    ? t('search_results', TranslationNamespace.COMMON, { default: 'Search Results' })
                    : t('common_languages', TranslationNamespace.COMMON, { default: 'Common Languages in UK Schools' })}
                </h3>
                <div className="space-y-1">
                  {groupedLanguages.high.map(renderLanguageItem)}
                </div>
              </div>
            )}
            
            {groupedLanguages.medium.length > 0 && !searchQuery && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {t('additional_languages', TranslationNamespace.COMMON, { default: 'Additional Languages' })}
                </h3>
                <div className="space-y-1">
                  {groupedLanguages.medium.map(renderLanguageItem)}
                </div>
              </div>
            )}
            
            {groupedLanguages.low.length > 0 && !searchQuery && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">
                  {t('other_languages', TranslationNamespace.COMMON, { default: 'Other Languages' })}
                </h3>
                <div className="space-y-1">
                  {groupedLanguages.low.map(renderLanguageItem)}
                </div>
              </div>
            )}
            
            {filteredLanguages.length === 0 && (
              <div className="text-center py-8">
                <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1">
                  {t('no_languages_found', TranslationNamespace.COMMON, { default: 'No Languages Found' })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('try_different_search', TranslationNamespace.COMMON, { default: 'Try a different search term' })}
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="pt-4">
            <CurriculumContentLocalization />
          </TabsContent>
          
          {/* Voice Tab */}
          <TabsContent value="voice" className="pt-4">
            <VoiceInputLanguageIntegration />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          {t('advanced_settings', TranslationNamespace.COMMON, { default: 'Advanced Language Settings' })}
        </Button>
      </CardFooter>
    </Card>
  );
}
