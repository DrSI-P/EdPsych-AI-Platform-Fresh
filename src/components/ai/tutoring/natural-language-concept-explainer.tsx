import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  BookOpen, 
  Sparkles, 
  Send, 
  Loader2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';

import { useAIService } from '@/lib/ai/ai-service';
import { LearningStyle } from '@/lib/learning-path/types';

/**
 * Natural Language Concept Explanation Component
 * 
 * Provides multi-modal explanations of educational concepts with
 * adaptive complexity based on student profile and learning style.
 */
export function NaturalLanguageConceptExplainer({
  subject,
  topic,
  keyStage,
  learningStyle = LearningStyle.VISUAL,
  proficiencyLevel,
  onExplanationComplete,
  onExplanationSave
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const aiService = useAIService();
  const messageEndRef = useRef(null);
  
  // State for user input
  const [userQuery, setUserQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for explanations
  const [explanations, setExplanations] = useState([]);
  const [currentExplanation, setCurrentExplanation] = useState(null);
  const [explanationMode, setExplanationMode] = useState('standard'); // standard, simplified, advanced
  const [explanationFormat, setExplanationFormat] = useState('auto'); // auto, text, visual, interactive
  
  // State for feedback
  const [feedbackRatings, setFeedbackRatings] = useState({});
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  
  // State for concept relationships
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  
  // Initialize with welcome message
  useEffect(() => {
    if (explanations.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'system',
        content: `I can explain concepts about ${topic} in ${subject}. What would you like to understand better?`,
        timestamp: new Date().toISOString()
      };
      
      setExplanations([welcomeMessage]);
      
      // Set initial follow-up questions
      setFollowUpQuestions([
        `What is ${topic}?`,
        `Why is ${topic} important?`,
        `How does ${topic} work?`,
        `Can you give an example of ${topic}?`
      ]);
    }
  }, [subject, topic, explanations.length]);
  
  // Scroll to bottom of explanations
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [explanations]);
  
  // Handle user query submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userQuery.trim()) return;
    
    // Add user query to explanations
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'query',
      content: userQuery,
      timestamp: new Date().toISOString()
    };
    
    setExplanations(prev => [...prev, userMessage]);
    setUserQuery('');
    setIsProcessing(true);
    
    try {
      // Add thinking indicator
      const thinkingMessage = {
        id: `thinking-${Date.now()}`,
        type: 'thinking',
        timestamp: new Date().toISOString()
      };
      
      setExplanations(prev => [...prev, thinkingMessage]);
      
      // Generate explanation
      await generateExplanation(userQuery);
      
      // Remove thinking indicator
      setExplanations(prev => prev.filter(exp => exp.id !== thinkingMessage.id));
    } catch (error) {
      console.error('Error generating explanation:', error);
      
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'error',
        content: 'Sorry, I encountered an error while generating an explanation. Please try again.',
        timestamp: new Date().toISOString()
      };
      
      setExplanations(prev => [...prev.filter(exp => exp.id !== `thinking-${Date.now()}`), errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate explanation
  const generateExplanation = async (query) => {
    try {
      // In a real implementation, this would call the AI service
      // For now, we'll simulate the response
      
      // Prepare context for AI
      const context = {
        subject,
        topic,
        keyStage,
        learningStyle,
        proficiencyLevel,
        explanationMode,
        explanationFormat,
        previousExplanations: explanations.filter(exp => exp.type === 'explanation').slice(-3)
      };
      
      // Create prompt for AI
      const prompt = `
        Generate an educational explanation about "${query}" related to ${topic} in ${subject}.
        The explanation should be suitable for UK Key Stage ${keyStage}.
        The student's learning style is ${learningStyle} and their proficiency level is ${proficiencyLevel}.
        The explanation mode should be ${explanationMode} (standard, simplified, or advanced).
        The explanation format should prioritize ${explanationFormat === 'auto' ? 'the appropriate format for their learning style' : explanationFormat}.
        
        Include:
        1. A clear explanation of the concept
        2. Examples that illustrate the concept
        3. Visual descriptions or analogies where appropriate
        4. Connections to previously learned concepts
        5. Real-world applications
        
        The explanation should be engaging, accurate, and aligned with UK curriculum standards.
      `;
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate explanation based on learning style and query
      let explanationContent = '';
      let explanationType = 'explanation';
      let explanationMedia = null;
      
      // Check if query is about a mathematical concept
      if (subject === 'Mathematics' && 
          (query.toLowerCase().includes('fraction') || 
           query.toLowerCase().includes('decimal') || 
           query.toLowerCase().includes('percentage'))) {
        
        explanationContent = generateMathExplanation(query, learningStyle, explanationMode);
        
        // Add visual aid for visual learners
        if (learningStyle === LearningStyle.VISUAL) {
          explanationMedia = {
            type: 'image',
            url: '/assets/math-visual-aid.png',
            alt: 'Visual representation of fractions and decimals'
          };
        }
        
        // Add related concepts
        setRelatedConcepts([
          { id: 'rc1', name: 'Equivalent Fractions', relevance: 'high' },
          { id: 'rc2', name: 'Decimal Place Value', relevance: 'high' },
          { id: 'rc3', name: 'Percentage Conversion', relevance: 'medium' },
          { id: 'rc4', name: 'Ratio and Proportion', relevance: 'medium' }
        ]);
      } 
      // Check if query is about a scientific concept
      else if (subject === 'Science' && 
               (query.toLowerCase().includes('water cycle') || 
                query.toLowerCase().includes('states of matter'))) {
        
        explanationContent = generateScienceExplanation(query, learningStyle, explanationMode);
        
        // Add visual aid for visual learners
        if (learningStyle === LearningStyle.VISUAL) {
          explanationMedia = {
            type: 'image',
            url: '/assets/science-visual-aid.png',
            alt: 'Visual representation of the water cycle'
          };
        }
        
        // Add related concepts
        setRelatedConcepts([
          { id: 'rc1', name: 'Evaporation', relevance: 'high' },
          { id: 'rc2', name: 'Condensation', relevance: 'high' },
          { id: 'rc3', name: 'Precipitation', relevance: 'high' },
          { id: 'rc4', name: 'States of Matter', relevance: 'medium' }
        ]);
      }
      // Default explanation for other queries
      else {
        explanationContent = `
          # ${capitalizeFirstLetter(topic)}
          
          ${topic} is an important concept in ${subject} that helps us understand how different elements relate to each other.
          
          ## Key Points
          
          - ${topic} involves understanding relationships between different components
          - It builds on previous knowledge of basic principles in ${subject}
          - Understanding ${topic} helps with problem-solving and critical thinking
          
          ## Examples
          
          Here's a simple example to illustrate ${topic}:
          
          [Example would be tailored to the specific topic and subject]
          
          ## Real-World Applications
          
          ${topic} is used in many real-world situations, such as:
          
          1. Problem-solving in everyday scenarios
          2. Making informed decisions based on available information
          3. Understanding complex systems and how they interact
          
          ## Further Exploration
          
          Would you like to know more about any specific aspect of ${topic}?
        `;
        
        // Add related concepts
        setRelatedConcepts([
          { id: 'rc1', name: `Basic ${topic} Principles`, relevance: 'high' },
          { id: 'rc2', name: `Advanced ${topic} Applications`, relevance: 'medium' },
          { id: 'rc3', name: `${topic} in Real-World Contexts`, relevance: 'medium' },
          { id: 'rc4', name: `History of ${topic}`, relevance: 'low' }
        ]);
      }
      
      // Create explanation object
      const explanation = {
        id: `explanation-${Date.now()}`,
        type: 'explanation',
        content: explanationContent,
        media: explanationMedia,
        query: query,
        timestamp: new Date().toISOString(),
        mode: explanationMode,
        format: explanationFormat
      };
      
      // Add explanation to state
      setExplanations(prev => [...prev, explanation]);
      setCurrentExplanation(explanation);
      
      // Generate follow-up questions
      generateFollowUpQuestions(query, explanationContent);
      
    } catch (error) {
      console.error('Error generating explanation:', error);
      throw error;
    }
  };
  
  // Generate math explanation based on learning style and mode
  const generateMathExplanation = (query, style, mode) => {
    // Base content adjusted for proficiency level
    let baseContent = '';
    
    if (mode === 'simplified') {
      baseContent = `
        # Fractions and Decimals - Simplified Explanation
        
        Fractions and decimals are different ways to show parts of a whole number.
        
        ## Fractions
        
        A fraction has two parts:
        - The top number (numerator) tells us how many parts we have
        - The bottom number (denominator) tells us how many equal parts make up the whole
        
        For example, in 3/4:
        - 3 is the numerator (we have 3 parts)
        - 4 is the denominator (the whole is divided into 4 equal parts)
        
        ## Decimals
        
        Decimals are another way to show parts of a whole using a decimal point.
        
        For example:
        - 0.5 means half (or 1/2)
        - 0.25 means a quarter (or 1/4)
        - 0.75 means three-quarters (or 3/4)
        
        ## Converting Between Them
        
        To change a fraction to a decimal, divide the top number by the bottom number:
        - 1/4 = 1 ÷ 4 = 0.25
        - 3/4 = 3 ÷ 4 = 0.75
        
        Would you like to try some simple examples?
      `;
    } else if (mode === 'advanced') {
      baseContent = `
        # Fractions, Decimals, and Their Relationships - Advanced Explanation
        
        Fractions and decimals are different representations of rational numbers, each with specific properties and applications.
        
        ## Fraction Properties
        
        A fraction (p/q) represents the quotient of two integers p and q (where q ≠ 0):
        - p is the numerator, representing the number of equal parts being considered
        - q is the denominator, representing the total number of equal parts in the whole
        
        Fractions can be:
        - Proper (p < q): Represent values less than 1 (e.g., 3/4)
        - Improper (p ≥ q): Represent values greater than or equal to 1 (e.g., 5/4)
        - Mixed numbers: Combination of a whole number and a proper fraction (e.g., 1¼)
        
        ## Decimal Representation
        
        Decimals use place value positions to represent fractional parts:
        - Tenths (10⁻¹)
        - Hundredths (10⁻²)
        - Thousandths (10⁻³)
        
        Decimals can be:
        - Terminating: The digits end (e.g., 0.25)
        - Recurring: The digits repeat infinitely (e.g., 0.333... or 0.̅3)
        
        ## Conversion Principles
        
        Converting fractions to decimals involves division of p by q:
        - Terminating decimals occur when the prime factorization of q contains only 2s and 5s
        - Recurring decimals occur when the prime factorization of q contains factors other than 2 and 5
        
        ## Advanced Applications
        
        Understanding the relationship between fractions and decimals is crucial for:
        - Algebraic manipulations
        - Calculus operations
        - Number theory
        - Computer representation of numbers (floating-point arithmetic)
        
        Would you like to explore any of these concepts in greater depth?
      `;
    } else { // standard mode
      baseContent = `
        # Understanding Fractions and Decimals
        
        Fractions and decimals are different ways to represent parts of a whole or divisions between numbers.
        
        ## Fractions
        
        A fraction consists of two numbers separated by a line:
        
        Numerator / Denominator
        
        - The numerator (top number) tells us how many parts we're considering
        - The denominator (bottom number) tells us how many equal parts make up the whole
        
        For example, in the fraction 3/4:
        - 3 is the numerator (we have 3 parts)
        - 4 is the denominator (the whole is divided into 4 equal parts)
        
        ## Decimals
        
        Decimals use a decimal point to separate whole numbers from fractional parts.
        
        For example:
        - 0.5 represents five tenths (or 5/10, which simplifies to 1/2)
        - 0.25 represents twenty-five hundredths (or 25/100, which simplifies to 1/4)
        - 0.75 represents seventy-five hundredths (or 75/100, which simplifies to 3/4)
        
        ## Converting Between Fractions and Decimals
        
        To convert a fraction to a decimal:
        1. Divide the numerator by the denominator
           - Example: 3/4 = 3 ÷ 4 = 0.75
        
        To convert a decimal to a fraction:
        1. Write the decimal as a fraction with the decimal part as numerator
        2. Use the appropriate power of 10 as denominator
        3. Simplify if possible
           - Example: 0.75 = 75/100 = 3/4
        
        Would you like to see more examples or practice problems?
      `;
    }
    
    // Adapt explanation based on learning style
    if (style === LearningStyle.VISUAL) {
      return `${baseContent}
        
        ## Visual Representation
        
        Here's how we can visualize fractions and decimals:
        
        Fraction 3/4:
        [□□□□]
        [■■■□]
        
        Decimal 0.75:
        [□□□□□□□□□□]
        [■■■■■■■□□□]
        
        The colored squares represent the parts we're considering, while the empty squares represent the remaining parts of the whole.
        
        This visual representation helps us see that 3/4 and 0.75 represent the same value - three parts out of four equal parts.
      `;
    } else if (style === LearningStyle.AUDITORY) {
      return `${baseContent}
        
        ## Verbal Patterns and Memory Aids
        
        When working with fractions and decimals, these verbal patterns can help:
        
        For fractions:
        - "Numerator OVER denominator" (e.g., "three OVER four")
        - "The denominator NAMES the parts, the numerator COUNTS the parts"
        
        For converting fractions to decimals:
        - "Divide the TOP by the BOTTOM" (e.g., "divide 3 by 4 to get 0.75")
        
        Common fraction-decimal equivalents to memorize by saying aloud:
        - "One half equals zero point five" (1/2 = 0.5)
        - "One quarter equals zero point two five" (1/4 = 0.25)
        - "Three quarters equals zero point seven five" (3/4 = 0.75)
        
        Try reading these aloud to help remember the patterns and relationships.
      `;
    } else if (style === LearningStyle.KINESTHETIC) {
      return `${baseContent}
        
        ## Hands-On Activities
        
        Here are some activities you can try to understand fractions and decimals:
        
        1. Fraction Folding:
           - Take a piece of paper
           - Fold it in half to show 1/2
           - Fold it again to show 1/4
           - Fold it once more to show 1/8
           - Unfold and count the sections to see the relationship
        
        2. Decimal Measuring:
           - Use a ruler with centimeters (100 parts of a meter)
           - Measure 75 centimeters
           - This represents 0.75 of a meter or 75/100 (which simplifies to 3/4)
        
        3. Fraction-Decimal Matching:
           - Cut a circle into 4 equal parts
           - Take 3 pieces (representing 3/4)
           - Fill a container with water to 75% (representing 0.75)
           - Notice how they represent the same amount
        
        Try these activities to physically experience the concepts!
      `;
    } else { // Read/Write style
      return `${baseContent}
        
        ## Key Definitions and Properties
        
        **Fraction**: A numerical quantity that represents a part of a whole or a ratio of two numbers.
        
        **Decimal**: A number expressed in the base-10 number system, using a decimal point to separate the whole number part from the fractional part.
        
        **Properties of Fractions**:
        1. Equivalent fractions: Fractions that represent the same value (e.g., 1/2 = 2/4 = 3/6)
        2. Simplifying fractions: Dividing both numerator and denominator by their greatest common factor
        3. Improper fractions: Numerator greater than denominator (e.g., 5/4)
        4. Mixed numbers: Whole number plus proper fraction (e.g., 1 1/4)
        
        **Properties of Decimals**:
        1. Place value: Each position represents a power of 10 (tenths, hundredths, etc.)
        2. Terminating decimals: Decimals that end (e.g., 0.75)
        3. Recurring decimals: Decimals with repeating patterns (e.g., 0.333...)
        
        **Conversion Formulas**:
        - Fraction to decimal: numerator ÷ denominator
        - Decimal to fraction: decimal = numerator/10^n (where n is the number of decimal places)
        
        Take notes on these definitions and formulas for future reference.
      `;
    }
  };
  
  // Generate science explanation based on learning style and mode
  const generateScienceExplanation = (query, style, mode) => {
    // Base content adjusted for proficiency level
    let baseContent = '';
    
    if (mode === 'simplified') {
      baseContent = `
        # The Water Cycle - Simplified Explanation
        
        The water cycle shows how water moves around our planet.
        
        ## Main Steps
        
        1. Evaporation: The sun heats water in oceans, lakes, and rivers, turning it into water vapor (a gas)
        
        2. Condensation: The water vapor cools high in the sky and turns into clouds
        
        3. Precipitation: When the clouds get heavy with water, it falls as rain, snow, or hail
        
        4. Collection: The water falls back into oceans, lakes, and rivers, and the cycle starts again
        
        The water cycle is important because it gives us fresh water to drink and use.
      `;
    } else if (mode === 'advanced') {
      baseContent = `
        # The Hydrologic Cycle: Advanced Processes and Global Impact
        
        The hydrologic (water) cycle is a complex biogeochemical cycle that describes the continuous movement and transformation of water throughout Earth's systems.
        
        ## Thermodynamic Processes
        
        1. Evaporation: Liquid water absorbs thermal energy and transitions to water vapor (endothermic process)
           - Rate depends on temperature, humidity, wind speed, and surface area
           - Approximately 86% of global evaporation occurs from oceans
        
        2. Transpiration: Release of water vapor from plants through stomata
           - Controlled by guard cells responding to environmental conditions
           - Contributes ~10% of moisture to the atmosphere
        
        3. Condensation: Water vapor releases latent heat and forms liquid droplets (exothermic process)
           - Requires condensation nuclei (aerosols, dust particles)
           - Forms clouds through adiabatic cooling in rising air masses
        
        4. Precipitation: Formation and falling of water droplets or ice crystals
           - Collision-coalescence process in warm clouds
           - Bergeron process in cold clouds (involving ice crystal formation)
        
        5. Infiltration and Percolation: Movement of water through soil and rock
           - Governed by Darcy's Law and soil porosity
           - Creates groundwater reservoirs in aquifers
        
        ## Global Water Budget and Residence Times
        
        - Oceans contain 97.2% of Earth's water (residence time: ~3,000 years)
        - Ice caps/glaciers: 2.15% (residence time: ~10,000 years)
        - Groundwater: 0.61% (residence time: ~300 years)
        - Atmosphere: 0.001% (residence time: ~9 days)
        
        ## Climate Change Impacts
        
        The hydrologic cycle is being altered by anthropogenic climate change:
        - Intensification of cycle (increased evaporation and precipitation)
        - Shifting precipitation patterns
        - Changes in extreme weather event frequency
        - Sea level rise affecting coastal hydrology
        
        Would you like to explore the mathematical models used to predict hydrologic cycle changes?
      `;
    } else { // standard mode
      baseContent = `
        # The Water Cycle
        
        The water cycle, also known as the hydrologic cycle, is the continuous movement of water on, above, and below Earth's surface.
        
        ## Key Processes
        
        1. Evaporation: The process where water changes from a liquid to a gas (water vapor)
           - Occurs primarily from oceans, lakes, and rivers
           - Driven by solar energy (the sun heats the water)
        
        2. Transpiration: The release of water vapor from plants through their leaves
           - Combined with evaporation, this is sometimes called "evapotranspiration"
        
        3. Condensation: The process where water vapor changes back to liquid water
           - Occurs when water vapor cools and forms clouds
           - Tiny water droplets form around dust, salt, or smoke particles in the air
        
        4. Precipitation: Water falling from clouds as rain, snow, sleet, or hail
           - Occurs when water droplets in clouds become too heavy to remain suspended
        
        5. Collection: Water returning to bodies of water or soaking into the ground
           - Surface runoff flows into streams, rivers, and eventually oceans
           - Infiltration occurs when water soaks into the soil
           - Groundwater forms when water seeps deep underground
        
        ## Importance of the Water Cycle
        
        The water cycle is essential for life on Earth because it:
        - Provides fresh water for drinking and agriculture
        - Helps regulate Earth's temperature
        - Supports ecosystems and habitats
        - Shapes landscapes through erosion and deposition
        
        Would you like to learn more about any specific part of the water cycle?
      `;
    }
    
    // Adapt explanation based on learning style
    if (style === LearningStyle.VISUAL) {
      return `${baseContent}
        
        ## Visual Representation
        
        The water cycle can be visualized as a circular diagram:
        
        [Sun] → heats → [Ocean/Lakes] → Evaporation ↑
                                                    |
        [Plants] → Transpiration ↑                  |
                                |                   |
                                → Water Vapor → Condensation → [Clouds]
                                                                |
        [Rivers/Oceans] ← Collection ← [Ground] ← Precipitation ↓
        
        In this diagram:
        - Arrows pointing up show water changing to vapor
        - Arrows pointing down show water falling as rain or snow
        - Horizontal arrows show water moving across land or through soil
        
        This circular pattern continues indefinitely, recycling the same water throughout Earth's history.
      `;
    } else if (style === LearningStyle.AUDITORY) {
      return `${baseContent}
        
        ## Verbal Patterns and Sound Associations
        
        The water cycle can be remembered through this verbal pattern:
        
        "Evaporation up, condensation high, precipitation down, collection around."
        
        Listen for these sounds in nature that represent different parts of the water cycle:
        
        - Evaporation: The quiet hissing of water evaporating from hot surfaces
        - Condensation: The soft formation of dew in the morning
        - Precipitation: The patter of raindrops or the whisper of snowfall
        - Collection: The gurgling of streams or the rush of rivers
        
        Try creating a rhythm with these words to help remember the cycle:
        "E-VAP-or-A-tion" (5 beats)
        "CON-den-SA-tion" (4 beats)
        "PRE-ci-pi-TA-tion" (5 beats)
        "col-LEC-tion" (3 beats)
        
        This creates a 5-4-5-3 rhythm pattern that can help you recall the stages.
      `;
    } else if (style === LearningStyle.KINESTHETIC) {
      return `${baseContent}
        
        ## Hands-On Activities
        
        Try these activities to understand the water cycle:
        
        1. Make a Mini Water Cycle:
           - Fill a clear plastic bag with a small amount of water
           - Seal it and tape it to a sunny window
           - Watch as water evaporates, condenses on the sides, and "rains" back down
        
        2. Cloud in a Jar Experiment:
           - Fill a jar with hot water
           - Place a plate with ice cubes on top
           - Watch condensation form a "cloud" inside the jar
        
        3. Water Cycle Movement Game:
           - Start crouched down as a water droplet in the ocean
           - Slowly rise up and wave arms as you "evaporate"
           - Group together with others as a "cloud"
           - Fall back down as "rain"
           - Flow along the ground back to the starting point
        
        These physical activities help you experience the water cycle processes with your body and hands.
      `;
    } else { // Read/Write style
      return `${baseContent}
        
        ## Detailed Definitions and Classifications
        
        **Hydrologic Cycle Terminology**:
        
        1. **Evaporation**: The physical process where liquid water converts to gaseous water vapor.
           - Rate equation: E = (es - ea) × f(u)
           - Where: es = saturation vapor pressure, ea = actual vapor pressure, f(u) = wind function
        
        2. **Transpiration**: The biological process of water vapor release through plant stomata.
           - Controlled by: stomatal conductance, vapor pressure deficit, leaf area index
        
        3. **Condensation**: The physical process where water vapor converts to liquid water.
           - Occurs at: dew point temperature
           - Requires: condensation nuclei (hygroscopic particles)
        
        4. **Precipitation Types**:
           - Rain: Liquid water drops > 0.5mm diameter
           - Drizzle: Liquid water drops < 0.5mm diameter
           - Snow: Ice crystals formed by direct deposition
           - Sleet: Frozen raindrops
           - Hail: Layered ice formed in cumulonimbus clouds
        
        5. **Collection Processes**:
           - Infiltration: Water entry into soil surface
           - Percolation: Water movement through soil
           - Groundwater flow: Movement through aquifers
           - Surface runoff: Sheet flow across land surface
        
        **Water Cycle Quantification**:
        - Global water evaporation: ~505,000 km³/year
        - Oceanic evaporation: ~434,000 km³/year
        - Land evapotranspiration: ~71,000 km³/year
        - Global precipitation: ~505,000 km³/year
        
        Take notes on these technical terms and values for reference in your studies.
      `;
    }
  };
  
  // Generate follow-up questions based on explanation
  const generateFollowUpQuestions = (query, explanation) => {
    // In a real implementation, this would analyze the explanation
    // and generate relevant follow-up questions
    
    // For now, we'll provide static suggestions based on the query
    if (query.toLowerCase().includes('fraction') || 
        query.toLowerCase().includes('decimal')) {
      setFollowUpQuestions([
        'How do I convert fractions to decimals?',
        'What are equivalent fractions?',
        'How do I add fractions with different denominators?',
        'Can you show me a real-world example of using fractions?'
      ]);
    } else if (query.toLowerCase().includes('water cycle') || 
               query.toLowerCase().includes('states of matter')) {
      setFollowUpQuestions([
        'What causes evaporation?',
        'How do clouds form?',
        'Why is the water cycle important?',
        'How does the water cycle affect climate?'
      ]);
    } else {
      setFollowUpQuestions([
        `Can you explain ${topic} in simpler terms?`,
        `How does ${topic} relate to other concepts?`,
        `Can you give me an example problem about ${topic}?`,
        `Why is ${topic} important to learn?`
      ]);
    }
  };
  
  // Handle explanation mode change
  const handleModeChange = (mode) => {
    setExplanationMode(mode);
    
    if (currentExplanation) {
      // Regenerate the current explanation with the new mode
      generateExplanation(currentExplanation.query);
    }
    
    toast({
      title: `Explanation mode changed to ${mode}`,
      description: `Explanations will now be ${mode === 'simplified' ? 'simpler' : mode === 'advanced' ? 'more detailed' : 'standard'}.`,
    });
  };
  
  // Handle explanation format change
  const handleFormatChange = (format) => {
    setExplanationFormat(format);
    
    if (currentExplanation) {
      // Regenerate the current explanation with the new format
      generateExplanation(currentExplanation.query);
    }
    
    toast({
      title: `Explanation format changed to ${format}`,
      description: format === 'auto' ? 'Format will adapt to your learning style.' : `Explanations will prioritize ${format} elements.`,
    });
  };
  
  // Handle feedback submission
  const handleFeedback = (explanationId, rating) => {
    setFeedbackRatings(prev => ({
      ...prev,
      [explanationId]: rating
    }));
    
    toast({
      title: rating === 'helpful' ? 'Feedback: Helpful' : 'Feedback: Not Helpful',
      description: 'Thank you for your feedback. This helps improve future explanations.',
    });
    
    // In a real implementation, this would send the feedback to the server
    // and potentially adjust the AI's approach
  };
  
  // Handle follow-up question click
  const handleFollowUpClick = (question) => {
    setUserQuery(question);
  };
  
  // Handle related concept click
  const handleRelatedConceptClick = (concept) => {
    setUserQuery(`Can you explain ${concept.name}?`);
  };
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Render explanation
  const renderExplanation = (explanation) => {
    switch (explanation.type) {
      case 'query':
        return (
          <div className="bg-primary text-primary-foreground p-3 rounded-lg self-end max-w-[80%]">
            <p>{explanation.content}</p>
          </div>
        );
      
      case 'explanation':
        return (
          <Card className="w-full mb-4">
            <CardContent className="pt-6">
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{explanation.content}</div>
                
                {explanation.media && explanation.media.type === 'image' && (
                  <div className="mt-4">
                    <img 
                      src={explanation.media.url} 
                      alt={explanation.media.alt} 
                      className="max-w-full rounded-md"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button
                    variant={explanationMode === 'simplified' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('simplified')}
                  >
                    Simplified
                  </Button>
                  <Button
                    variant={explanationMode === 'standard' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('standard')}
                  >
                    Standard
                  </Button>
                  <Button
                    variant={explanationMode === 'advanced' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('advanced')}
                  >
                    Advanced
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant={feedbackRatings[explanation.id] === 'helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback(explanation.id, 'helpful')}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  <Button
                    variant={feedbackRatings[explanation.id] === 'not-helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleFeedback(explanation.id, 'not-helpful')}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'system':
        return (
          <div className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg text-center w-full text-sm text-gray-500 dark:text-gray-400">
            <p>{explanation.content}</p>
          </div>
        );
      
      case 'thinking':
        return (
          <div className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-lg flex items-center space-x-2 max-w-[80%]">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        );
      
      case 'error':
        return (
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg text-center w-full text-sm text-red-500 dark:text-red-300">
            <p>{explanation.content}</p>
          </div>
        );
      
      default:
        return <p>{explanation.content}</p>;
    }
  };
  
  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Concept Explainer</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Ask questions about {topic} in {subject} to get personalized explanations.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Explanations */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Explanation Display */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 flex flex-col">
              {explanations.map((explanation) => (
                <div
                  key={explanation.id}
                  className={`flex ${
                    explanation.type === 'query' ? 'justify-end' : 'justify-start'
                  } w-full`}
                >
                  {renderExplanation(explanation)}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Ask a question about this topic..."
                className="flex-1 min-h-[60px] max-h-[120px]"
                disabled={isProcessing}
              />
              <Button 
                type="submit" 
                className="self-end"
                disabled={!userQuery.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            
            {/* Follow-up Questions */}
            {followUpQuestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  You might want to ask:
                </p>
                <div className="flex flex-wrap gap-2">
                  {followUpQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleFollowUpClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-64 border-l border-gray-200 dark:border-gray-700 hidden md:block">
          <Tabs defaultValue="concepts">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="concepts" className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Related Concepts
              </h3>
              
              {relatedConcepts.length > 0 ? (
                <div className="space-y-2">
                  {relatedConcepts.map((concept) => (
                    <div 
                      key={concept.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-neutral-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                      onClick={() => handleRelatedConceptClick(concept)}
                    >
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{concept.name}</span>
                      </div>
                      <Badge variant={
                        concept.relevance === 'high' ? 'default' : 
                        concept.relevance === 'medium' ? 'secondary' : 
                        'outline'
                      }>
                        {concept.relevance}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ask a question to see related concepts.
                </p>
              )}
              
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mt-6 mb-3">
                Learning Progress
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Topic Understanding</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Concepts Explored</span>
                    <span>{explanations.filter(e => e.type === 'explanation').length}/10</span>
                  </div>
                  <Progress value={explanations.filter(e => e.type === 'explanation').length * 10} className="h-2" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Explanation Format
              </h3>
              
              <div className="space-y-2 mb-6">
                <Button
                  variant={explanationFormat === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFormatChange('auto')}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Auto (Based on Learning Style)
                </Button>
                
                <Button
                  variant={explanationFormat === 'text' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFormatChange('text')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text-focused
                </Button>
                
                <Button
                  variant={explanationFormat === 'visual' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFormatChange('visual')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Visual-focused
                </Button>
                
                <Button
                  variant={explanationFormat === 'interactive' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleFormatChange('interactive')}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Interactive-focused
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Info className="h-4 w-4 mr-1" />
                  <span>Current Learning Style: {learningStyle}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Reset all explanations
                    setExplanations([explanations[0]]);
                    setCurrentExplanation(null);
                    setRelatedConcepts([]);
                    
                    toast({
                      title: "Explanations reset",
                      description: "All explanations have been cleared.",
                    });
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Explanations
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default NaturalLanguageConceptExplainer;
