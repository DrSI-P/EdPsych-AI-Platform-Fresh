import { 
  SpeechRecognitionService, 
  SpeechRecognitionOptions, 
  SpeechRecognitionResult 
} from './speechRecognition';

export type AgeGroup = 'nursery' | 'early-primary' | 'late-primary' | 'secondary';

export interface AgeGraduatedSpeechRecognitionOptions extends SpeechRecognitionOptions {
  ageGroup: AgeGroup;
}

/**
 * Age-Graduated Speech Recognition Service
 * 
 * Extends the base speech recognition service with age-specific optimizations
 * for different developmental stages from nursery to secondary school.
 */
export class AgeGraduatedSpeechRecognitionService extends SpeechRecognitionService {
  private ageGroup: AgeGroup;
  private ageSpecificPatterns: Record<AgeGroup, [RegExp, string][]>;
  
  constructor(options: AgeGraduatedSpeechRecognitionOptions) {
    super(options);
    this.ageGroup = options.ageGroup || 'late-primary';
    this.initializeAgeSpecificPatterns();
  }
  
  /**
   * Initialize age-specific speech patterns and corrections
   */
  private initializeAgeSpecificPatterns(): void {
    // Define patterns for different age groups
    this.ageSpecificPatterns = {
      // Nursery (3-5 years) - Focus on very basic speech patterns and common mispronunciations
      'nursery': [
        [/(\b)wawa(\b)/gi, '$1water$2'],
        [/(\b)nana(\b)/gi, '$1banana$2'],
        [/(\b)tato(\b)/gi, '$1potato$2'],
        [/(\b)pease(\b)/gi, '$1please$2'],
        [/(\b)tanku(\b)/gi, '$1thank you$2'],
        [/(\b)sowwy(\b)/gi, '$1sorry$2'],
        [/(\b)yesh(\b)/gi, '$1yes$2'],
        [/(\b)no-no(\b)/gi, '$1no$2'],
        [/(\b)mine(\b)/gi, '$1my$2'],
        [/(\b)me do(\b)/gi, '$1I will do$2'],
        [/(\b)me want(\b)/gi, '$1I want$2'],
        [/(\b)me like(\b)/gi, '$1I like$2'],
        [/(\b)choo choo(\b)/gi, '$1train$2'],
        [/(\b)brmm(\b)/gi, '$1car$2'],
        [/(\b)woof woof(\b)/gi, '$1dog$2'],
        [/(\b)meow(\b)/gi, '$1cat$2'],
        [/(\b)moo(\b)/gi, '$1cow$2'],
        [/(\b)oink(\b)/gi, '$1pig$2'],
        [/(\b)baa(\b)/gi, '$1sheep$2'],
        [/(\b)tweet(\b)/gi, '$1bird$2']
      ],
      
      // Early Primary (5-8 years) - Common phonological errors and grammatical simplifications
      'early-primary': [
        [/(\b)fing(\b)/gi, '$1thing$2'],
        [/(\b)wiv(\b)/gi, '$1with$2'],
        [/(\b)dat(\b)/gi, '$1that$2'],
        [/(\b)dis(\b)/gi, '$1this$2'],
        [/(\b)free(\b)/gi, '$1three$2'],
        [/(\b)bwoken(\b)/gi, '$1broken$2'],
        [/(\b)lellow(\b)/gi, '$1yellow$2'],
        [/(\b)wed(\b)/gi, '$1red$2'],
        [/(\b)gween(\b)/gi, '$1green$2'],
        [/(\b)boo(\b)/gi, '$1blue$2'],
        [/(\b)puple(\b)/gi, '$1purple$2'],
        [/(\b)libe-wee(\b)/gi, '$1library$2'],
        [/(\b)compooter(\b)/gi, '$1computer$2'],
        [/(\b)aminal(\b)/gi, '$1animal$2'],
        [/(\b)pasghetti(\b)/gi, '$1spaghetti$2'],
        [/(\b)breffist(\b)/gi, '$1breakfast$2'],
        [/(\b)member(\b)/gi, '$1remember$2'],
        [/(\b)yesterdee(\b)/gi, '$1yesterday$2'],
        [/(\b)tomorow(\b)/gi, '$1tomorrow$2'],
        [/(\b)birfday(\b)/gi, '$1birthday$2']
      ],
      
      // Late Primary (8-11 years) - More subtle speech patterns and academic vocabulary
      'late-primary': [
        [/(\b)libary(\b)/gi, '$1library$2'],
        [/(\b)probly(\b)/gi, '$1probably$2'],
        [/(\b)intresting(\b)/gi, '$1interesting$2'],
        [/(\b)expecially(\b)/gi, '$1especially$2'],
        [/(\b)nucular(\b)/gi, '$1nuclear$2'],
        [/(\b)pacific(\b)/gi, '$1specific$2'],
        [/(\b)supposably(\b)/gi, '$1supposedly$2'],
        [/(\b)irregardless(\b)/gi, '$1regardless$2'],
        [/(\b)exscape(\b)/gi, '$1escape$2'],
        [/(\b)excape(\b)/gi, '$1escape$2'],
        [/(\b)asterik(\b)/gi, '$1asterisk$2'],
        [/(\b)aks(\b)/gi, '$1ask$2'],
        [/(\b)expresso(\b)/gi, '$1espresso$2'],
        [/(\b)excetera(\b)/gi, '$1et cetera$2'],
        [/(\b)ect(\b)/gi, '$1etc$2'],
        [/(\b)heighth(\b)/gi, '$1height$2'],
        [/(\b)secetary(\b)/gi, '$1secretary$2'],
        [/(\b)febuary(\b)/gi, '$1february$2'],
        [/(\b)artick(\b)/gi, '$1arctic$2'],
        [/(\b)antartic(\b)/gi, '$1antarctic$2']
      ],
      
      // Secondary (11+ years) - Academic and technical vocabulary, fewer corrections needed
      'secondary': [
        [/(\b)irregardless(\b)/gi, '$1regardless$2'],
        [/(\b)for all intensive purposes(\b)/gi, '$1for all intents and purposes$2'],
        [/(\b)i could care less(\b)/gi, '$1i couldn\'t care less$2'],
        [/(\b)mischievious(\b)/gi, '$1mischievous$2'],
        [/(\b)pronounciation(\b)/gi, '$1pronunciation$2'],
        [/(\b)perscription(\b)/gi, '$1prescription$2'],
        [/(\b)preform(\b)/gi, '$1perform$2'],
        [/(\b)sherbert(\b)/gi, '$1sherbet$2'],
        [/(\b)supposably(\b)/gi, '$1supposedly$2'],
        [/(\b)definately(\b)/gi, '$1definitely$2']
      ]
    };
  }
  
  /**
   * Process speech with age-specific optimizations
   * @override
   */
  protected processChildSpeech(text: string): string {
    // First apply base processing from parent class
    let processedText = super.processChildSpeech(text);
    
    // Then apply age-specific patterns
    const patterns = this.ageSpecificPatterns[this.ageGroup];
    if (patterns) {
      for (const [pattern, replacement] of patterns) {
        processedText = processedText.replace(pattern, replacement);
      }
    }
    
    // Apply age-specific post-processing
    switch (this.ageGroup) {
      case 'nursery':
        // For nursery, simplify complex sentences and add periods
        processedText = this.simplifyComplexSentences(processedText);
        break;
      case 'early-primary':
        // For early primary, correct common grammar issues
        processedText = this.correctEarlyPrimaryGrammar(processedText);
        break;
      case 'late-primary':
        // For late primary, enhance vocabulary and structure
        processedText = this.enhanceLatePrimaryText(processedText);
        break;
      case 'secondary':
        // For secondary, focus on academic language
        processedText = this.enhanceSecondaryText(processedText);
        break;
    }
    
    return processedText;
  }
  
  /**
   * Simplify complex sentences for nursery age group
   */
  private simplifyComplexSentences(text: string): string {
    // Break long sentences into shorter ones
    let simplified = text.replace(/(.{30,}?)(,|\s+and|\s+but|\s+or|\s+because|\s+so)(.{30,})/gi, '$1.$3');
    
    // Ensure proper capitalization after creating new sentences
    simplified = simplified.replace(/(\.\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    
    return simplified;
  }
  
  /**
   * Correct common grammar issues for early primary age group
   */
  private correctEarlyPrimaryGrammar(text: string): string {
    let corrected = text;
    
    // Fix common verb tense issues
    corrected = corrected
      .replace(/(\b)(I|we|they|you) is(\b)/gi, '$1$2 are$3')
      .replace(/(\b)(he|she|it) are(\b)/gi, '$1$2 is$3')
      .replace(/(\b)goed(\b)/gi, '$1went$2')
      .replace(/(\b)runned(\b)/gi, '$1ran$2')
      .replace(/(\b)swimmed(\b)/gi, '$1swam$2')
      .replace(/(\b)bringed(\b)/gi, '$1brought$2')
      .replace(/(\b)thinked(\b)/gi, '$1thought$2')
      .replace(/(\b)teached(\b)/gi, '$1taught$2')
      .replace(/(\b)more (bigger|smaller|taller|shorter)(\b)/gi, '$1$2$3')
      .replace(/(\b)more (better|worse|faster|slower)(\b)/gi, '$1$2$3');
    
    // Fix common article issues
    corrected = corrected
      .replace(/(\b)a (apple|orange|elephant|hour)(\b)/gi, '$1an $2$3')
      .replace(/(\b)an (ball|car|dog|tree|book|pencil)(\b)/gi, '$1a $2$3');
    
    return corrected;
  }
  
  /**
   * Enhance vocabulary and structure for late primary age group
   */
  private enhanceLatePrimaryText(text: string): string {
    let enhanced = text;
    
    // Enhance common vocabulary
    enhanced = enhanced
      .replace(/(\b)got(\b)/gi, '$1received$2')
      .replace(/(\b)big(\b)/gi, '$1large$2')
      .replace(/(\b)small(\b)/gi, '$1little$2')
      .replace(/(\b)good(\b)/gi, '$1excellent$2')
      .replace(/(\b)bad(\b)/gi, '$1poor$2')
      .replace(/(\b)nice(\b)/gi, '$1pleasant$2')
      .replace(/(\b)said(\b)/gi, '$1stated$2')
      .replace(/(\b)happy(\b)/gi, '$1delighted$2')
      .replace(/(\b)sad(\b)/gi, '$1unhappy$2')
      .replace(/(\b)scared(\b)/gi, '$1frightened$2');
    
    return enhanced;
  }
  
  /**
   * Enhance text for secondary age group with academic language
   */
  private enhanceSecondaryText(text: string): string {
    let enhanced = text;
    
    // Enhance with more academic language
    enhanced = enhanced
      .replace(/(\b)use(\b)/gi, '$1utilize$2')
      .replace(/(\b)find out(\b)/gi, '$1discover$2')
      .replace(/(\b)look at(\b)/gi, '$1examine$2')
      .replace(/(\b)think about(\b)/gi, '$1consider$2')
      .replace(/(\b)come up with(\b)/gi, '$1develop$2')
      .replace(/(\b)put together(\b)/gi, '$1compile$2')
      .replace(/(\b)look into(\b)/gi, '$1investigate$2')
      .replace(/(\b)talk about(\b)/gi, '$1discuss$2')
      .replace(/(\b)find(\b)/gi, '$1identify$2')
      .replace(/(\b)show(\b)/gi, '$1demonstrate$2');
    
    return enhanced;
  }
  
  /**
   * Update the age group
   */
  public updateAgeGroup(ageGroup: AgeGroup): void {
    this.ageGroup = ageGroup;
  }
  
  /**
   * Get the current age group
   */
  public getAgeGroup(): AgeGroup {
    return this.ageGroup;
  }
}

// Export singleton instance
let ageGraduatedSpeechRecognitionService: AgeGraduatedSpeechRecognitionService | null = null;

export function getAgeGraduatedSpeechRecognitionService(
  options?: Partial<AgeGraduatedSpeechRecognitionOptions>
): AgeGraduatedSpeechRecognitionService {
  const defaultOptions: AgeGraduatedSpeechRecognitionOptions = {
    ageGroup: 'late-primary',
    continuous: true,
    interimResults: true,
    lang: 'en-GB',
    childVoiceOptimization: true,
    maxAlternatives: 3,
    profanityFilter: true,
    specialEducationalNeeds: {
      articulation: false,
      fluency: false,
      processing: false
    }
  };
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    specialEducationalNeeds: {
      ...defaultOptions.specialEducationalNeeds,
      ...(options?.specialEducationalNeeds || {})
    }
  };
  
  if (!ageGraduatedSpeechRecognitionService) {
    ageGraduatedSpeechRecognitionService = new AgeGraduatedSpeechRecognitionService(mergedOptions);
  } else if (options) {
    // Update existing service with new options
    ageGraduatedSpeechRecognitionService.updateOptions(mergedOptions);
    
    // Update age group if specified
    if (options.ageGroup) {
      ageGraduatedSpeechRecognitionService.updateAgeGroup(options.ageGroup);
    }
  }
  
  return ageGraduatedSpeechRecognitionService;
}
