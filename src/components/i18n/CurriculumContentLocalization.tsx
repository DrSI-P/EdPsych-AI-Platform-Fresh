"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from '@/components/i18n/i18n-provider';
import { SupportedLanguage, TranslationNamespace } from '@/lib/i18n/types';
import { BookOpen, GraduationCap, Globe, AlertTriangle, Check, Info } from 'lucide-react';

/**
 * CurriculumContentLocalization Component
 * 
 * This component provides specialized localization features for UK curriculum content,
 * ensuring educational terminology is properly translated and culturally adapted
 * across all supported languages.
 */
export function CurriculumContentLocalization() {
  const { t, currentLanguage, changeLanguage, isRtl } = useI18n();
  
  // Local state for curriculum localization settings
  const [autoLocalize, setAutoLocalize] = useState<boolean>(true);
  const [preserveTerminology, setPreserveTerminology] = useState<boolean>(true);
  const [simplifiedLanguage, setSimplifiedLanguage] = useState<boolean>(false);
  const [culturalContext, setCulturalContext] = useState<boolean>(true);
  const [keyStageSpecific, setKeyStageSpecific] = useState<boolean>(true);
  const [selectedKeyStage, setSelectedKeyStage] = useState<string>("ks2");
  const [selectedSubject, setSelectedSubject] = useState<string>("maths");
  
  // UK curriculum key stages
  const keyStages = [
    { value: "eyfs", label: "Early Years Foundation Stage" },
    { value: "ks1", label: "Key Stage 1 (Years 1-2)" },
    { value: "ks2", label: "Key Stage 2 (Years 3-6)" },
    { value: "ks3", label: "Key Stage 3 (Years 7-9)" },
    { value: "ks4", label: "Key Stage 4 (Years 10-11)" },
    { value: "ks5", label: "Key Stage 5 (Years 12-13)" }
  ];
  
  // UK curriculum subjects
  const subjects = [
    { value: "maths", label: "Mathematics" },
    { value: "english", label: "English" },
    { value: "science", label: "Science" },
    { value: "computing", label: "Computing" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "art", label: "Art and Design" },
    { value: "music", label: "Music" },
    { value: "pe", label: "Physical Education" },
    { value: "languages", label: "Languages" },
    { value: "citizenship", label: "Citizenship" },
    { value: "pshe", label: "PSHE" }
  ];
  
  // Sample curriculum terminology for demonstration
  const sampleTerminology = {
    maths: [
      { term: "Number bonds", translations: { "cy": "Bondiau rhif", "ur": "نمبر بانڈز", "pl": "Wiązania liczbowe" } },
      { term: "Place value", translations: { "cy": "Gwerth lle", "ur": "مقام کی قیمت", "pl": "Wartość pozycyjna" } },
      { term: "Times tables", translations: { "cy": "Tablau amseroedd", "ur": "ٹائمز ٹیبلز", "pl": "Tabliczka mnożenia" } }
    ],
    english: [
      { term: "Phonics", translations: { "cy": "Ffoneg", "ur": "صوتیات", "pl": "Fonika" } },
      { term: "Comprehension", translations: { "cy": "Dealltwriaeth", "ur": "فہم", "pl": "Zrozumienie" } },
      { term: "Grammar", translations: { "cy": "Gramadeg", "ur": "گرامر", "pl": "Gramatyka" } }
    ],
    science: [
      { term: "Investigation", translations: { "cy": "Ymchwiliad", "ur": "تحقیقات", "pl": "Badanie" } },
      { term: "Hypothesis", translations: { "cy": "Damcaniaeth", "ur": "مفروضہ", "pl": "Hipoteza" } },
      { term: "Variables", translations: { "cy": "Newidynnau", "ur": "متغیرات", "pl": "Zmienne" } }
    ]
  };
  
  // Get terminology for selected subject
  const getTerminology = () => {
    return sampleTerminology[selectedSubject as keyof typeof sampleTerminology] || [];
  };
  
  // Sample cultural context notes
  const culturalContextNotes = {
    "cy": "Welsh-medium education has specific terminology that may differ from direct translations. The Welsh curriculum (Cwricwlwm i Gymru) has unique elements reflecting Welsh culture and language.",
    "ur": "Urdu-speaking students may be familiar with different mathematical notation systems. Islamic educational concepts may provide useful context for certain subjects.",
    "pl": "Polish educational system uses different grade structures and assessment methods. Some mathematical notations may differ from UK standards."
  };
  
  // Get cultural context for current language
  const getCurrentCulturalContext = () => {
    return culturalContextNotes[currentLanguage as keyof typeof culturalContextNotes] || 
      "Cultural context information not available for this language.";
  };
  
  return (
    <Card className={`w-full ${isRtl ? 'rtl' : 'ltr'}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="mr-2 h-5 w-5" />
          {t('curriculum_localization', TranslationNamespace.CURRICULUM, { default: 'Curriculum Content Localization' })}
        </CardTitle>
        <CardDescription>
          {t('curriculum_localization_desc', TranslationNamespace.CURRICULUM, { default: 'Specialized localization for UK curriculum content' })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-localize" className="font-medium">
              {t('auto_localize', TranslationNamespace.CURRICULUM, { default: 'Automatic Localization' })}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t('auto_localize_desc', TranslationNamespace.CURRICULUM, { default: 'Automatically localize curriculum content' })}
            </p>
          </div>
          <Switch 
            id="auto-localize" 
            checked={autoLocalize} 
            onCheckedChange={setAutoLocalize}
            aria-label={t('auto_localize', TranslationNamespace.CURRICULUM, { default: 'Toggle automatic localization' })}
          />
        </div>
        
        {autoLocalize && (
          <Tabs defaultValue="terminology">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terminology">
                {t('terminology', TranslationNamespace.CURRICULUM, { default: 'Terminology' })}
              </TabsTrigger>
              <TabsTrigger value="cultural">
                {t('cultural_context', TranslationNamespace.CURRICULUM, { default: 'Cultural Context' })}
              </TabsTrigger>
              <TabsTrigger value="settings">
                {t('settings', TranslationNamespace.CURRICULUM, { default: 'Settings' })}
              </TabsTrigger>
            </TabsList>
            
            {/* Terminology Tab */}
            <TabsContent value="terminology" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preserve-terminology" className="font-medium">
                    {t('preserve_terminology', TranslationNamespace.CURRICULUM, { default: 'Preserve UK Terminology' })}
                  </Label>
                  <Switch 
                    id="preserve-terminology" 
                    checked={preserveTerminology} 
                    onCheckedChange={setPreserveTerminology}
                    aria-label={t('preserve_terminology', TranslationNamespace.CURRICULUM, { default: 'Toggle preserve terminology' })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('preserve_terminology_desc', TranslationNamespace.CURRICULUM, { default: 'Maintain UK educational terminology with translations' })}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject-select">
                  {t('subject', TranslationNamespace.CURRICULUM, { default: 'Subject' })}
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder={t('select_subject', TranslationNamespace.CURRICULUM, { default: 'Select subject' })} />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {t(`subject_${subject.value}`, TranslationNamespace.CURRICULUM, { default: subject.label })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border rounded-md">
                <div className="p-3 border-b bg-muted/50">
                  <h3 className="font-medium">
                    {t('curriculum_terminology', TranslationNamespace.CURRICULUM, { default: 'Curriculum Terminology' })}
                  </h3>
                </div>
                <div className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-medium">
                          {t('uk_term', TranslationNamespace.CURRICULUM, { default: 'UK Term' })}
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          {t('translation', TranslationNamespace.CURRICULUM, { default: 'Translation' })}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getTerminology().map((item, index) => (
                        <tr key={index} className={index < getTerminology().length - 1 ? "border-b" : ""}>
                          <td className="p-3 text-sm">{item.term}</td>
                          <td className="p-3 text-sm">
                            {item.translations[currentLanguage as keyof typeof item.translations] || 
                             <span className="text-muted-foreground italic">
                               {t('translation_unavailable', TranslationNamespace.CURRICULUM, { default: 'Translation unavailable' })}
                             </span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">
                      {t('terminology_note', TranslationNamespace.CURRICULUM, { default: 'Terminology Note' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('terminology_note_desc', TranslationNamespace.CURRICULUM, { default: 'UK curriculum terminology is preserved to maintain educational consistency while providing translations for understanding.' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Cultural Context Tab */}
            <TabsContent value="cultural" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cultural-context" className="font-medium">
                    {t('show_cultural_context', TranslationNamespace.CURRICULUM, { default: 'Show Cultural Context' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('show_cultural_context_desc', TranslationNamespace.CURRICULUM, { default: 'Display cultural context information for educational content' })}
                  </p>
                </div>
                <Switch 
                  id="cultural-context" 
                  checked={culturalContext} 
                  onCheckedChange={setCulturalContext}
                  aria-label={t('show_cultural_context', TranslationNamespace.CURRICULUM, { default: 'Toggle cultural context' })}
                />
              </div>
              
              {culturalContext && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="text-sm font-medium mb-2">
                      {t('cultural_context_for', TranslationNamespace.CURRICULUM, { default: 'Cultural Context for' })} {
                        t(`language_${currentLanguage}`, TranslationNamespace.COMMON, { 
                          default: currentLanguage === SupportedLanguage.ENGLISH_UK ? 'English (UK)' : currentLanguage 
                        })
                      }
                    </h3>
                    <p className="text-sm">
                      {getCurrentCulturalContext()}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">
                      {t('educational_system_differences', TranslationNamespace.CURRICULUM, { default: 'Educational System Differences' })}
                    </h4>
                    <ul className="space-y-1 text-sm list-disc pl-5">
                      <li>
                        {t('grading_systems', TranslationNamespace.CURRICULUM, { default: 'Different grading systems and assessment methods' })}
                      </li>
                      <li>
                        {t('school_structure', TranslationNamespace.CURRICULUM, { default: 'Variations in school year structure and age groupings' })}
                      </li>
                      <li>
                        {t('subject_emphasis', TranslationNamespace.CURRICULUM, { default: 'Different emphasis on certain subjects or topics' })}
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {t('cultural_sensitivity', TranslationNamespace.CURRICULUM, { default: 'Cultural Sensitivity' })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('cultural_sensitivity_desc', TranslationNamespace.CURRICULUM, { default: 'All curriculum content is adapted with cultural sensitivity while maintaining educational objectives.' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="simplified-language" className="font-medium">
                    {t('simplified_language', TranslationNamespace.CURRICULUM, { default: 'Simplified Language' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('simplified_language_desc', TranslationNamespace.CURRICULUM, { default: 'Use simplified language for accessibility' })}
                  </p>
                </div>
                <Switch 
                  id="simplified-language" 
                  checked={simplifiedLanguage} 
                  onCheckedChange={setSimplifiedLanguage}
                  aria-label={t('simplified_language', TranslationNamespace.CURRICULUM, { default: 'Toggle simplified language' })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="key-stage-specific" className="font-medium">
                    {t('key_stage_specific', TranslationNamespace.CURRICULUM, { default: 'Key Stage-Specific Content' })}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('key_stage_specific_desc', TranslationNamespace.CURRICULUM, { default: 'Adapt content based on key stage' })}
                  </p>
                </div>
                <Switch 
                  id="key-stage-specific" 
                  checked={keyStageSpecific} 
                  onCheckedChange={setKeyStageSpecific}
                  aria-label={t('key_stage_specific', TranslationNamespace.CURRICULUM, { default: 'Toggle key stage-specific content' })}
                />
              </div>
              
              {keyStageSpecific && (
                <div className="space-y-2">
                  <Label htmlFor="key-stage-select">
                    {t('key_stage', TranslationNamespace.CURRICULUM, { default: 'Key Stage' })}
                  </Label>
                  <Select value={selectedKeyStage} onValueChange={setSelectedKeyStage}>
                    <SelectTrigger id="key-stage-select">
                      <SelectValue placeholder={t('select_key_stage', TranslationNamespace.CURRICULUM, { default: 'Select key stage' })} />
                    </SelectTrigger>
                    <SelectContent>
                      {keyStages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {t(`key_stage_${stage.value}`, TranslationNamespace.CURRICULUM, { default: stage.label })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="language-select">
                  {t('content_language', TranslationNamespace.CURRICULUM, { default: 'Content Language' })}
                </Label>
                <Select 
                  value={currentLanguage} 
                  onValueChange={(value) => changeLanguage(value as SupportedLanguage)}
                >
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder={t('select_language', TranslationNamespace.COMMON, { default: 'Select language' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SupportedLanguage.ENGLISH_UK}>English (UK)</SelectItem>
                    <SelectItem value={SupportedLanguage.WELSH}>Cymraeg (Welsh)</SelectItem>
                    <SelectItem value={SupportedLanguage.POLISH}>Polski (Polish)</SelectItem>
                    <SelectItem value={SupportedLanguage.URDU}>اردو (Urdu)</SelectItem>
                    <SelectItem value={SupportedLanguage.PUNJABI}>ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    <SelectItem value={SupportedLanguage.ARABIC}>العربية (Arabic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">
                      {t('uk_curriculum_alignment', TranslationNamespace.CURRICULUM, { default: 'UK Curriculum Alignment' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('uk_curriculum_alignment_desc', TranslationNamespace.CURRICULUM, { default: 'All translations maintain alignment with UK Department for Education standards and the National Curriculum.' })}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {!autoLocalize && (
          <div className="bg-muted p-6 rounded-md text-center">
            <Globe className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">
              {t('localization_disabled', TranslationNamespace.CURRICULUM, { default: 'Curriculum Localization Disabled' })}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('localization_disabled_desc', TranslationNamespace.CURRICULUM, { default: 'Enable curriculum localization to access specialized translation features for educational content.' })}
            </p>
            <Button 
              onClick={() => setAutoLocalize(true)}
              className="mx-auto"
            >
              {t('enable_localization', TranslationNamespace.CURRICULUM, { default: 'Enable Localization' })}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          {t('curriculum_guide', TranslationNamespace.CURRICULUM, { default: 'Curriculum Guide' })}
        </Button>
        <Button>
          {t('save_settings', TranslationNamespace.COMMON, { default: 'Save Settings' })}
        </Button>
      </CardFooter>
    </Card>
  );
}
