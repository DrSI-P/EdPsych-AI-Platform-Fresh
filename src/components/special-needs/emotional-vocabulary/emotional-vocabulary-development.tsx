'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Filter,
  Heart,
  HelpCircle,
  ImageIcon,
  Info,
  Layers,
  MessageCircle,
  Mic,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Star,
  ThumbsUp,
  User,
  Volume2,
  VolumeX
} from "lucide-react";
import Image from "next/image";

const EmotionalVocabularyDevelopment = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("explore");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ageGroup, setAgeGroup] = useState("all");
  const [emotionCategory, setEmotionCategory] = useState("all");
  const [intensity, setIntensity] = useState("all");
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [userProgress, setUserProgress] = useState({
    emotionsLearned: 0,
    activitiesCompleted: 0,
    quizzesCompleted: 0,
    masteryLevel: "beginner"
  });
  const [userPreferences, setUserPreferences] = useState({
    voiceEnabled: true,
    animationsEnabled: true,
    simplifiedView: false,
    highContrast: false,
    textSize: "medium"
  });
  const [activityHistory, setActivityHistory] = useState([]);
  const [favoriteEmotions, setFavoriteEmotions] = useState([]);
  
  // Mock data for emotions
  const emotions = [
    {
      id: "e1",
      name: "Happy",
      category: "joy",
      intensity: "medium",
      description: "A feeling of pleasure or contentment, often experienced when things are going well or when you achieve something you wanted.",
      bodyFeelings: "Warm feeling in chest, relaxed muscles, smiling, energy in body",
      triggers: ["Achieving goals", "Being with friends", "Receiving praise", "Playing games"],
      expressions: ["Smiling", "Laughing", "Bouncing or jumping", "Clapping hands"],
      synonyms: ["Joyful", "Glad", "Cheerful", "Delighted", "Pleased"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt happy when I got a gold star for my work.",
        "Playing with my friends at break time makes me happy.",
        "I was happy when my team won the match."
      ],
      strategies: [
        "Share your happiness with others",
        "Take a moment to enjoy the feeling",
        "Remember this feeling for when you feel sad"
      ],
      imageUrl: "/emotions/happy.png",
      color: "#FFD700", // Gold
      activities: ["emotion-journal", "emotion-charades", "emotion-stories"],
      relatedEmotions: ["excited", "proud", "content"]
    },
    {
      id: "e2",
      name: "Sad",
      category: "sadness",
      intensity: "medium",
      description: "A feeling of unhappiness or sorrow, often experienced when something disappointing or upsetting happens.",
      bodyFeelings: "Heavy feeling in chest, tired body, drooping shoulders, tears in eyes",
      triggers: ["Losing something", "Being left out", "Disappointment", "Missing someone"],
      expressions: ["Crying", "Frowning", "Slow movements", "Looking down"],
      synonyms: ["Unhappy", "Down", "Blue", "Gloomy", "Sorrowful"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt sad when my toy broke.",
        "I was sad when my friend was away ill.",
        "Not being invited to the party made me feel sad."
      ],
      strategies: [
        "Talk to someone you trust about your feelings",
        "Do something gentle and kind for yourself",
        "Remember that sadness passes with time"
      ],
      imageUrl: "/emotions/sad.png",
      color: "#6495ED", // Cornflower Blue
      activities: ["emotion-journal", "emotion-art", "emotion-stories"],
      relatedEmotions: ["disappointed", "lonely", "hurt"]
    },
    {
      id: "e3",
      name: "Angry",
      category: "anger",
      intensity: "high",
      description: "A strong feeling of displeasure, annoyance, or hostility, often experienced when something unfair happens or when you feel threatened.",
      bodyFeelings: "Hot face, tense muscles, racing heart, clenched fists or jaw",
      triggers: ["Being treated unfairly", "Being hurt", "Not getting your way", "Feeling threatened"],
      expressions: ["Frowning", "Yelling", "Stomping", "Crossing arms"],
      synonyms: ["Mad", "Furious", "Cross", "Irritated", "Annoyed"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt angry when someone broke my pencil.",
        "I was angry when my brother took my toy without asking.",
        "Being blamed for something I didn't do made me angry."
      ],
      strategies: [
        "Take deep breaths to calm your body",
        "Count to 10 before responding",
        "Use words to explain how you feel",
        "Move your body (run, jump, dance) to release energy"
      ],
      imageUrl: "/emotions/angry.png",
      color: "#FF4500", // OrangeRed
      activities: ["emotion-journal", "calm-corner", "emotion-thermometer"],
      relatedEmotions: ["frustrated", "annoyed", "jealous"]
    },
    {
      id: "e4",
      name: "Scared",
      category: "fear",
      intensity: "high",
      description: "A feeling of being afraid or worried about something dangerous, painful, or threatening.",
      bodyFeelings: "Racing heart, shaky hands, tight chest, butterflies in stomach",
      triggers: ["Danger", "New situations", "The dark", "Loud noises", "Being alone"],
      expressions: ["Wide eyes", "Covering face", "Freezing", "Running away"],
      synonyms: ["Afraid", "Frightened", "Terrified", "Anxious", "Worried"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt scared during the thunderstorm.",
        "I was scared when I had to speak in front of the class.",
        "The dark hallway made me feel scared."
      ],
      strategies: [
        "Talk to a trusted adult about your fears",
        "Use brave breathing (deep breaths in and out)",
        "Remind yourself of times you were brave",
        "Use positive self-talk: 'I can handle this'"
      ],
      imageUrl: "/emotions/scared.png",
      color: "#9370DB", // Medium Purple
      activities: ["emotion-journal", "brave-moments", "worry-box"],
      relatedEmotions: ["nervous", "worried", "anxious"]
    },
    {
      id: "e5",
      name: "Excited",
      category: "joy",
      intensity: "high",
      description: "A feeling of great enthusiasm and eagerness, often experienced when looking forward to something good or when something thrilling is happening.",
      bodyFeelings: "Butterflies in stomach, extra energy, wide eyes, racing heart",
      triggers: ["Special events", "Surprises", "Receiving good news", "Anticipating something fun"],
      expressions: ["Jumping up and down", "Clapping", "Fast talking", "Wide smile"],
      synonyms: ["Thrilled", "Eager", "Enthusiastic", "Animated", "Pumped"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt excited on the morning of my birthday.",
        "I was excited when we planned our school trip.",
        "Hearing the ice cream van made me excited."
      ],
      strategies: [
        "Share your excitement with others",
        "Channel extra energy into positive activities",
        "Practise patience if you need to wait",
        "Take deep breaths if excitement feels overwhelming"
      ],
      imageUrl: "/emotions/excited.png",
      color: "#FF69B4", // Hot Pink
      activities: ["emotion-journal", "emotion-charades", "energy-release"],
      relatedEmotions: ["happy", "eager", "enthusiastic"]
    },
    {
      id: "e6",
      name: "Calm",
      category: "peace",
      intensity: "low",
      description: "A feeling of peace, quiet, and relaxation, often experienced when you feel safe and content.",
      bodyFeelings: "Relaxed muscles, slow breathing, warm body, clear mind",
      triggers: ["Quiet time", "Being in nature", "After resolving a problem", "Bedtime routines"],
      expressions: ["Relaxed face", "Slow movements", "Gentle smile", "Soft voice"],
      synonyms: ["Peaceful", "Relaxed", "Tranquil", "Serene", "At ease"],
      ageGroups: ["early-years", "primary", "secondary"],
      examples: [
        "I felt calm while listening to soft music.",
        "Reading my book made me feel calm.",
        "I was calm after taking deep breaths."
      ],
      strategies: [
        "Practise deep breathing",
        "Find a quiet space",
        "Listen to gentle music",
        "Use calming sensory items (soft toys, stress balls)"
      ],
      imageUrl: "/emotions/calm.png",
      color: "#87CEEB", // Sky Blue
      activities: ["mindfulness-moments", "calm-corner", "sensory-activities"],
      relatedEmotions: ["content", "peaceful", "relaxed"]
    },
    {
      id: "e7",
      name: "Proud",
      category: "joy",
      intensity: "medium",
      description: "A feeling of pleasure and satisfaction in your achievements or in the achievements of those close to you.",
      bodyFeelings: "Tall posture, warm chest, smiling, energetic body",
      triggers: ["Accomplishing something difficult", "Being praised", "Helping others", "Overcoming challenges"],
      expressions: ["Standing tall", "Smiling", "Showing achievements to others", "Positive self-talk"],
      synonyms: ["Accomplished", "Satisfied", "Pleased", "Successful", "Confident"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt proud when I learned to ride my bike.",
        "I was proud when I finished my difficult project.",
        "Helping my little sister made me feel proud."
      ],
      strategies: [
        "Celebrate your achievements",
        "Share your success with people who support you",
        "Remember this feeling when facing new challenges",
        "Create a 'proud moments' journal"
      ],
      imageUrl: "/emotions/proud.png",
      color: "#FFA500", // Orange
      activities: ["emotion-journal", "achievement-wall", "strength-spotting"],
      relatedEmotions: ["happy", "confident", "satisfied"]
    },
    {
      id: "e8",
      name: "Embarrassed",
      category: "shame",
      intensity: "medium",
      description: "A feeling of self-consciousness, shame, or awkwardness, often experienced when you make a mistake in front of others or when attention is drawn to you in an uncomfortable way.",
      bodyFeelings: "Hot face, wanting to hide, looking down, tense shoulders",
      triggers: ["Making mistakes in public", "Being teased", "Standing out", "Awkward situations"],
      expressions: ["Blushing", "Covering face", "Looking away", "Nervous laugh"],
      synonyms: ["Self-conscious", "Awkward", "Mortified", "Humiliated", "Uncomfortable"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt embarrassed when I tripped in front of the class.",
        "I was embarrassed when I got the answer wrong.",
        "Spilling my drink made me feel embarrassed."
      ],
      strategies: [
        "Remember that everyone makes mistakes",
        "Use humor appropriately",
        "Focus on how to move forward",
        "Practise self-compassion"
      ],
      imageUrl: "/emotions/embarrassed.png",
      color: "#FF6347", // Tomato
      activities: ["emotion-journal", "perspective-taking", "self-compassion"],
      relatedEmotions: ["shy", "uncomfortable", "self-conscious"]
    },
    {
      id: "e9",
      name: "Confused",
      category: "surprise",
      intensity: "medium",
      description: "A feeling of being unable to understand or make sense of something, often experienced when faced with new or complex information.",
      bodyFeelings: "Furrowed brow, tilted head, tension in forehead, restless body",
      triggers: ["New information", "Unclear instructions", "Contradictions", "Complex problems"],
      expressions: ["Frowning", "Head tilting", "Asking questions", "Slow responses"],
      synonyms: ["Puzzled", "Perplexed", "Bewildered", "Uncertain", "Mixed-up"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt confused when the directions changed.",
        "I was confused by the new math problem.",
        "The complicated game rules made me confused."
      ],
      strategies: [
        "Ask questions",
        "Break information into smaller parts",
        "Use visual aids or drawings",
        "Take your time to process information"
      ],
      imageUrl: "/emotions/confused.png",
      color: "#9932CC", // Dark Orchid
      activities: ["emotion-journal", "question-box", "visual-mapping"],
      relatedEmotions: ["uncertain", "puzzled", "curious"]
    },
    {
      id: "e10",
      name: "Frustrated",
      category: "anger",
      intensity: "medium",
      description: "A feeling of being upset or annoyed as a result of being unable to change or achieve something, often experienced when facing obstacles or difficulties.",
      bodyFeelings: "Tense muscles, clenched jaw, hot face, restless energy",
      triggers: ["Difficult tasks", "Not being understood", "Repeated failures", "Interruptions"],
      expressions: ["Sighing", "Frowning", "Giving up", "Short temper"],
      synonyms: ["Annoyed", "Irritated", "Exasperated", "Agitated", "Bothered"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt frustrated when my tower kept falling down.",
        "I was frustrated when I couldn't solve the puzzle.",
        "Not being able to find my book made me frustrated."
      ],
      strategies: [
        "Take a break and come back later",
        "Break tasks into smaller steps",
        "Ask for help when needed",
        "Use calming techniques before trying again"
      ],
      imageUrl: "/emotions/frustrated.png",
      color: "#CD5C5C", // Indian Red
      activities: ["emotion-journal", "problem-solving", "calm-corner"],
      relatedEmotions: ["angry", "annoyed", "impatient"]
    },
    {
      id: "e11",
      name: "Nervous",
      category: "fear",
      intensity: "medium",
      description: "A feeling of worry, unease, or anxiety about something with an uncertain outcome, often experienced before important events or new situations.",
      bodyFeelings: "Butterflies in stomach, shaky hands, racing heart, sweaty palms",
      triggers: ["Tests or performances", "New situations", "Meeting new people", "Being judged"],
      expressions: ["Fidgeting", "Avoiding eye contact", "Speaking quickly", "Pacing"],
      synonyms: ["Anxious", "Uneasy", "Apprehensive", "Worried", "Jittery"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt nervous before my spelling test.",
        "I was nervous on the first day of school.",
        "Speaking in front of the class made me nervous."
      ],
      strategies: [
        "Practise deep breathing",
        "Prepare and practise ahead of time",
        "Use positive self-talk",
        "Visualise success"
      ],
      imageUrl: "/emotions/nervous.png",
      color: "#7FFFD4", // Aquamarine
      activities: ["emotion-journal", "brave-moments", "relaxation-techniques"],
      relatedEmotions: ["anxious", "worried", "scared"]
    },
    {
      id: "e12",
      name: "Jealous",
      category: "anger",
      intensity: "medium",
      description: "A feeling of resentment towards someone because they have something that you want or wish you had, often experienced when comparing yourself to others.",
      bodyFeelings: "Tight chest, hot face, tense jaw, heavy feeling",
      triggers: ["Others receiving attention", "Others' achievements", "Possessions", "Friendships"],
      expressions: ["Frowning", "Avoiding", "Complaining", "Seeking attention"],
      synonyms: ["Envious", "Resentful", "Covetous", "Green with envy", "Bitter"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt jealous when my friend got a new toy.",
        "I was jealous when someone else was chosen first.",
        "Seeing others get more attention made me jealous."
      ],
      strategies: [
        "Focus on your own strengths and achievements",
        "Practise gratitude for what you have",
        "Talk about your feelings with a trusted person",
        "Set personal goals rather than comparing to others"
      ],
      imageUrl: "/emotions/jealous.png",
      color: "#32CD32", // Lime Green
      activities: ["emotion-journal", "gratitude-practise", "strength-spotting"],
      relatedEmotions: ["envious", "resentful", "insecure"]
    },
    {
      id: "e13",
      name: "Lonely",
      category: "sadness",
      intensity: "medium",
      description: "A feeling of sadness because one has no friends or company, often experienced when isolated or disconnected from others.",
      bodyFeelings: "Empty feeling inside, heavy heart, tired body, quiet voice",
      triggers: ["Being alone", "Feeling different", "Moving to a new place", "Conflict with friends"],
      expressions: ["Withdrawing", "Quiet voice", "Looking down", "Seeking connection"],
      synonyms: ["Isolated", "Abandoned", "Solitary", "Left out", "Disconnected"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt lonely when no one sat with me at lunch.",
        "I was lonely after moving to a new school.",
        "Weekends without friends can make me feel lonely."
      ],
      strategies: [
        "Reach out to someone you trust",
        "Join clubs or activities to meet people",
        "Practise self-care activities you enjoy",
        "Remember that many people feel lonely sometimes"
      ],
      imageUrl: "/emotions/lonely.png",
      color: "#4682B4", // Steel Blue
      activities: ["emotion-journal", "connection-building", "self-care"],
      relatedEmotions: ["sad", "isolated", "left out"]
    },
    {
      id: "e14",
      name: "Grateful",
      category: "joy",
      intensity: "medium",
      description: "A feeling of thankfulness and appreciation, often experienced when recognising good things in your life or when someone helps you.",
      bodyFeelings: "Warm heart, relaxed body, smiling, open posture",
      triggers: ["Receiving help", "Having needs met", "Recognising good things", "Overcoming difficulties"],
      expressions: ["Saying thank you", "Smiling", "Helping others", "Expressing appreciation"],
      synonyms: ["Thankful", "Appreciative", "Blessed", "Indebted", "Obliged"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt grateful when my friend shared their snack with me.",
        "I was grateful for my teacher's help with the difficult problem.",
        "Having a safe home makes me feel grateful."
      ],
      strategies: [
        "Keep a gratitude journal",
        "Express thanks to others",
        "Notice small positive things each day",
        "Practise gratitude before bed"
      ],
      imageUrl: "/emotions/grateful.png",
      color: "#DDA0DD", // Plum
      activities: ["gratitude-journal", "thank-you-notes", "appreciation-circle"],
      relatedEmotions: ["happy", "content", "appreciative"]
    },
    {
      id: "e15",
      name: "Bored",
      category: "neutral",
      intensity: "low",
      description: "A feeling of weariness or restlessness due to lack of interest or stimulation, often experienced during repetitive or unengaging activities.",
      bodyFeelings: "Restless body, sighing, slouching, low energy",
      triggers: ["Repetitive tasks", "Waiting", "Lack of challenge", "Uninteresting activities"],
      expressions: ["Yawning", "Fidgeting", "Daydreaming", "Seeking stimulation"],
      synonyms: ["Uninterested", "Disengaged", "Unstimulated", "Indifferent", "Apathetic"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt bored during the long car journey.",
        "I was bored when I had nothing to do at break time.",
        "Repeating the same worksheet made me bored."
      ],
      strategies: [
        "Find ways to make tasks more interesting",
        "Take short breaks to refresh your mind",
        "Have a list of activities you enjoy for free time",
        "Challenge yourself to learn something new"
      ],
      imageUrl: "/emotions/bored.png",
      color: "#A9A9A9", // Dark Grey
      activities: ["emotion-journal", "interest-exploration", "creativity-challenges"],
      relatedEmotions: ["uninterested", "restless", "disengaged"]
    },
    {
      id: "e16",
      name: "Hopeful",
      category: "joy",
      intensity: "medium",
      description: "A feeling of expectation and desire for something good to happen, often experienced when looking forward to positive changes or outcomes.",
      bodyFeelings: "Light chest, energetic body, relaxed muscles, forward-leaning posture",
      triggers: ["New opportunities", "Progress", "Support from others", "Seeing possibilities"],
      expressions: ["Smiling", "Planning", "Sharing ideas", "Optimistic talk"],
      synonyms: ["Optimistic", "Positive", "Expectant", "Encouraged", "Looking forward"],
      ageGroups: ["primary", "secondary"],
      examples: [
        "I felt hopeful when I started practicing for the team.",
        "I was hopeful about making new friends at my new school.",
        "Seeing my grades improve made me feel hopeful."
      ],
      strategies: [
        "Set realistic goals",
        "Focus on small steps of progress",
        "Surround yourself with positive influences",
        "Keep a 'hopes and dreams' journal"
      ],
      imageUrl: "/emotions/hopeful.png",
      color: "#FFDAB9", // Peach Puff
      activities: ["emotion-journal", "vision-board", "goal-setting"],
      relatedEmotions: ["optimistic", "encouraged", "motivated"]
    }
  ];
  
  // Mock data for activities
  const activities = [
    {
      id: "a1",
      name: "Emotion Journal",
      description: "Record and reflect on your emotions using guided prompts and creative expression.",
      ageGroups: ["primary", "secondary"],
      emotionCategories: ["all"],
      duration: "10-15 minutes",
      materials: ["Journal or paper", "Coloured pencils or markers", "Emotion vocabulary list"],
      instructions: [
        "Choose an emotion you experienced today",
        "Write or draw what triggered this emotion",
        "Describe how your body felt during this emotion",
        "Reflect on how you expressed this emotion",
        "Consider what helped or could have helped you manage this emotion"
      ],
      benefits: [
        "Increases emotional awareness",
        "Develops reflection skills",
        "Builds emotional vocabulary",
        "Creates a record of emotional growth"
      ],
      adaptations: {
        "early-years": "Use simple drawing and basic emotion faces",
        "primary": "Include sentence starters and emotion word banks",
        "secondary": "Add deeper reflection questions and nuanced emotion vocabulary"
      },
      imageUrl: "/activities/emotion-journal.png"
    },
    {
      id: "a2",
      name: "Emotion Charades",
      description: "Act out and guess different emotions through facial expressions, body language, and scenarios.",
      ageGroups: ["early-years", "primary"],
      emotionCategories: ["all"],
      duration: "15-20 minutes",
      materials: ["Emotion cards", "Timer (optional)", "Props (optional)"],
      instructions: [
        "Divide into small groups or pairs",
        "Take turns selecting an emotion card",
        "Act out the emotion without using words",
        "Others guess the emotion being portrayed",
        "Discuss how you knew which emotion was being shown",
        "Talk about different ways people might show the same emotion"
      ],
      benefits: [
        "Develops emotion recognition skills",
        "Practices nonverbal communication",
        "Builds empathy through perspective-taking",
        "Makes learning about emotions fun and interactive"
      ],
      adaptations: {
        "early-years": "Use basic emotions and simple scenarios",
        "primary": "Include more complex emotions and specific situations",
        "secondary": "Add nuanced emotions and challenging scenarios"
      },
      imageUrl: "/activities/emotion-charades.png"
    },
    {
      id: "a3",
      name: "Emotion Vocabulary Tree",
      description: "Create a visual display of emotion words organised by categories, intensity, and relationships.",
      ageGroups: ["primary", "secondary"],
      emotionCategories: ["all"],
      duration: "30-45 minutes",
      materials: ["Large paper or poster board", "Coloured markers or pencils", "Emotion word cards", "Reference materials"],
      instructions: [
        "Draw a large tree with branches representing different emotion categories",
        "Place basic emotions at the trunk and branch points",
        "Add related and more specific emotions along the branches",
        "Colour-code emotions by intensity or category",
        "Add definitions, synonyms, or examples for each emotion",
        "Continue adding new emotion words as you learn them"
      ],
      benefits: [
        "Expands emotion vocabulary",
        "Visualizes relationships between emotions",
        "Helps distinguish between similar emotions",
        "Creates a reference tool for emotional expression"
      ],
      adaptations: {
        "primary": "Focus on basic emotions with simple branches and definitions",
        "secondary": "Include nuanced emotions with detailed relationships and contextual examples"
      },
      imageUrl: "/activities/emotion-vocabulary-tree.png"
    },
    {
      id: "a4",
      name: "Emotion Detective",
      description: "Identify and analyse emotions in stories, videos, or real-life scenarios using clues and evidence.",
      ageGroups: ["primary", "secondary"],
      emotionCategories: ["all"],
      duration: "20-30 minutes",
      materials: ["Books or story excerpts", "Video clips", "Emotion clue worksheet", "Magnifying glass (optional)"],
      instructions: [
        "Read a story or watch a video clip",
        "Look for clues about characters' emotions (facial expressions, body language, words, actions)",
        "Record evidence for each emotion identified",
        "Discuss what triggered these emotions for the characters",
        "Predict how the characters might manage their emotions",
        "Compare different characters' emotional responses to similar situations"
      ],
      benefits: [
        "Develops emotion recognition in context",
        "Builds inference and analysis skills",
        "Enhances perspective-taking and empathy",
        "Connects emotions to their causes and effects"
      ],
      adaptations: {
        "primary": "Use picture books and obvious emotional cues",
        "secondary": "Use complex narratives with subtle emotional expressions"
      },
      imageUrl: "/activities/emotion-detective.png"
    },
    {
      id: "a5",
      name: "Emotion Word Wall",
      description: "Create a collaborative display of emotion words with definitions, examples, and visual representations.",
      ageGroups: ["early-years", "primary", "secondary"],
      emotionCategories: ["all"],
      duration: "Ongoing project",
      materials: ["Wall space or bulletin board", "Card stock or paper", "Art supplies", "Reference materials"],
      instructions: [
        "Designate a wall or board for emotion vocabulary",
        "Organise sections by emotion categories or intensity",
        "Add new emotion words regularly with definitions",
        "Include student-created illustrations or examples",
        "Reference the wall during discussions and activities",
        "Encourage students to use words from the wall in their communication"
      ],
      benefits: [
        "Creates a visual reference for emotion vocabulary",
        "Supports ongoing vocabulary development",
        "Normalizes discussion of diverse emotions",
        "Provides a collaborative learning tool"
      ],
      adaptations: {
        "early-years": "Focus on basic emotions with simple pictures",
        "primary": "Add definitions and simple examples",
        "secondary": "Include nuanced emotions, synonyms, and contextual usage"
      },
      imageUrl: "/activities/emotion-word-wall.png"
    },
    {
      id: "a6",
      name: "Emotion Scenarios",
      description: "Analyse and discuss how different emotions might arise in various situations and how they could be managed.",
      ageGroups: ["primary", "secondary"],
      emotionCategories: ["all"],
      duration: "15-25 minutes",
      materials: ["Scenario cards", "Emotion vocabulary list", "Discussion prompts"],
      instructions: [
        "Present a scenario relevant to students' experiences",
        "Discuss what emotions might arise in this situation",
        "Explore different perspectives and possible emotional responses",
        "Identify healthy ways to express and manage these emotions",
        "Role-play alternative responses to the scenario",
        "Reflect on personal experiences with similar situations"
      ],
      benefits: [
        "Applies emotion vocabulary to real-life situations",
        "Develops problem-solving skills for emotional challenges",
        "Builds empathy through considering multiple perspectives",
        "Prepares for managing emotions in future situations"
      ],
      adaptations: {
        "primary": "Use concrete scenarios with clear emotional triggers",
        "secondary": "Include complex social situations with mixed emotions"
      },
      imageUrl: "/activities/emotion-scenarios.png"
    },
    {
      id: "a7",
      name: "Emotion Intensity Scale",
      description: "Create and use a visual scale to identify and communicate the intensity of emotions.",
      ageGroups: ["early-years", "primary", "secondary"],
      emotionCategories: ["all"],
      duration: "20-30 minutes initially, then ongoing use",
      materials: ["Paper or cardstock", "Coloured markers", "Emotion vocabulary lists", "Thermometer template (optional)"],
      instructions: [
        "Create a visual scale (like a thermometer or number line)",
        "Identify emotions of different intensities within the same category",
        "Place these emotions along the scale from mild to intense",
        "Discuss body signals that indicate different intensity levels",
        "Practise identifying your current emotional intensity",
        "Use the scale to communicate feelings and track changes"
      ],
      benefits: [
        "Develops awareness of emotion intensity",
        "Expands vocabulary for similar emotions of different strengths",
        "Improves communication about emotional states",
        "Supports early intervention before emotions become overwhelming"
      ],
      adaptations: {
        "early-years": "Use colors and simple faces with 3-5 levels",
        "primary": "Use numbers (1-5) with corresponding emotion words",
        "secondary": "Create detailed scales for specific emotion categories"
      },
      imageUrl: "/activities/emotion-intensity-scale.png"
    },
    {
      id: "a8",
      name: "Emotion Vocabulary Games",
      description: "Play interactive games that reinforce emotion vocabulary, definitions, and usage.",
      ageGroups: ["early-years", "primary", "secondary"],
      emotionCategories: ["all"],
      duration: "15-20 minutes",
      materials: ["Emotion word cards", "Game boards (optional)", "Timer", "Emotion pictures"],
      instructions: [
        "Choose from games like Emotion Bingo, Emotion Categories, Emotion Taboo, or Emotion Memory",
        "Review the emotion vocabulary before starting",
        "Explain the specific game rules",
        "Play in small groups or pairs",
        "Discuss new words or insights after playing",
        "Rotate games to practise different aspects of emotion vocabulary"
      ],
      benefits: [
        "Makes vocabulary learning engaging and interactive",
        "Reinforces definitions and usage through repetition",
        "Develops quick recall of emotion words",
        "Builds confidence in using emotional language"
      ],
      adaptations: {
        "early-years": "Use picture matching and simple words",
        "primary": "Include definitions and categories",
        "secondary": "Add challenges like using words in sentences or explaining nuances"
      },
      imageUrl: "/activities/emotion-vocabulary-games.png"
    }
  ];
  
  // Mock data for quizzes
  const quizzes = [
    {
      id: "q1",
      title: "Basic Emotions Quiz",
      description: "Test your knowledge of the six basic emotions and how they're expressed.",
      ageGroups: ["early-years", "primary"],
      difficulty: "beginner",
      questions: [
        {
          question: "Which emotion is usually shown with a smile?",
          options: ["Happy", "Sad", "Angry", "Scared"],
          answer: "Happy"
        },
        {
          question: "How might your body feel when you're scared?",
          options: ["Relaxed and calm", "Heart beating fast", "Heavy and slow", "Hot and tight"],
          answer: "Heart beating fast"
        },
        {
          question: "What might make someone feel sad?",
          options: ["Getting a present", "Winning a game", "Losing a toy", "Playing with friends"],
          answer: "Losing a toy"
        },
        {
          question: "Which face shows someone feeling surprised?",
          options: ["Wide eyes and open mouth", "Frowning with narrowed eyes", "Smiling with closed eyes", "Looking down with a small frown"],
          answer: "Wide eyes and open mouth"
        },
        {
          question: "When you feel angry, what might happen to your body?",
          options: ["You might feel very sleepy", "Your muscles might get tense", "You might feel cold", "Your heart might beat very slowly"],
          answer: "Your muscles might get tense"
        }
      ],
      imageUrl: "/quizzes/basic-emotions-quiz.png"
    },
    {
      id: "q2",
      title: "Emotion Vocabulary Challenge",
      description: "Test your knowledge of different emotion words and their meanings.",
      ageGroups: ["primary", "secondary"],
      difficulty: "intermediate",
      questions: [
        {
          question: "Which of these is a synonym for 'joyful'?",
          options: ["Gloomy", "Elated", "Irritated", "Anxious"],
          answer: "Elated"
        },
        {
          question: "What does it mean to feel 'frustrated'?",
          options: ["Very happy and excited", "Calm and peaceful", "Annoyed because you can't achieve something", "Scared of something specific"],
          answer: "Annoyed because you can't achieve something"
        },
        {
          question: "Which emotion describes feeling happy about someone else's misfortune?",
          options: ["Empathy", "Sympathy", "Schadenfreude", "Compassion"],
          answer: "Schadenfreude"
        },
        {
          question: "What's the difference between 'anxious' and 'nervous'?",
          options: ["They mean exactly the same thing", "Anxious is more intense and can last longer", "Nervous is always more intense", "They are completely unrelated emotions"],
          answer: "Anxious is more intense and can last longer"
        },
        {
          question: "Which emotion word describes feeling unsure about what to do or understand?",
          options: ["Confident", "Confused", "Curious", "Cautious"],
          answer: "Confused"
        }
      ],
      imageUrl: "/quizzes/emotion-vocabulary-challenge.png"
    },
    {
      id: "q3",
      title: "Emotion in Context Quiz",
      description: "Identify appropriate emotions for different situations and contexts.",
      ageGroups: ["primary", "secondary"],
      difficulty: "intermediate",
      questions: [
        {
          question: "Your friend just won an award you were both hoping to get. You feel happy for them but also disappointed. What mixed emotions are you experiencing?",
          options: ["Jealousy and anger", "Pride and excitement", "Envy and admiration", "Fear and surprise"],
          answer: "Envy and admiration"
        },
        {
          question: "You're about to perform in the school play. Your heart is racing and you have butterflies in your stomach. What are you likely feeling?",
          options: ["Just fear", "Nervous excitement", "Pure joy", "Only anger"],
          answer: "Nervous excitement"
        },
        {
          question: "Your pet that you've had for many years has died. What complex emotions might you experience?",
          options: ["Only happiness from memories", "Just anger at the situation", "Grief, sadness, and perhaps some gratitude for the time together", "Exclusively surprise"],
          answer: "Grief, sadness, and perhaps some gratitude for the time together"
        },
        {
          question: "You studied hard for a test but still didn't do as well as you hoped. What emotions might you feel?",
          options: ["Only happiness", "Disappointment and possibly frustration", "Pure excitement", "Just surprise"],
          answer: "Disappointment and possibly frustration"
        },
        {
          question: "Your friend tells you a secret about something difficult they're going through. What would be an emotionally appropriate response?",
          options: ["Feel excited and tell others", "Feel annoyed they're bothering you", "Feel empathy and concern", "Feel amused by their situation"],
          answer: "Feel empathy and concern"
        }
      ],
      imageUrl: "/quizzes/emotion-in-context-quiz.png"
    },
    {
      id: "q4",
      title: "Emotion Regulation Strategies Quiz",
      description: "Test your knowledge of effective strategies for managing different emotions.",
      ageGroups: ["primary", "secondary"],
      difficulty: "advanced",
      questions: [
        {
          question: "What's a helpful strategy when you're feeling overwhelmed with anger?",
          options: ["Yell at someone immediately", "Take deep breaths and count to ten", "Keep all your feelings inside", "Make a quick decision right away"],
          answer: "Take deep breaths and count to ten"
        },
        {
          question: "When you're feeling anxious about a future event, what might help?",
          options: ["Avoid thinking about it completely", "Focus only on what could go wrong", "Prepare appropriately and practise positive self-talk", "Tell yourself you'll definitely fail"],
          answer: "Prepare appropriately and practise positive self-talk"
        },
        {
          question: "If you're feeling sad, which of these strategies might be helpful?",
          options: ["Isolate yourself from everyone", "Pretend to be happy all the time", "Talk to someone you trust about your feelings", "Ignore the feeling until it goes away"],
          answer: "Talk to someone you trust about your feelings"
        },
        {
          question: "When you feel jealous of someone else's success, what's a healthy response?",
          options: ["Try to make them fail next time", "Acknowledge the feeling and focus on your own goals", "Decide you'll never succeed like they did", "Pretend you don't care about that success"],
          answer: "Acknowledge the feeling and focus on your own goals"
        },
        {
          question: "If you're feeling nervous before giving a presentation, which strategy would be most helpful?",
          options: ["Call in sick to avoid it completely", "Practise your presentation and use calming techniques", "Tell yourself you'll definitely make mistakes", "Stay up all night worrying about it"],
          answer: "Practise your presentation and use calming techniques"
        }
      ],
      imageUrl: "/quizzes/emotion-regulation-strategies-quiz.png"
    }
  ];
  
  // Mock data for resources
  const resources = [
    {
      id: "r1",
      title: "Emotion Vocabulary Cards",
      description: "Printable cards featuring emotion words, definitions, and visual representations.",
      type: "printable",
      ageGroups: ["early-years", "primary", "secondary"],
      fileUrl: "/resources/emotion-vocabulary-cards.pdf",
      thumbnailUrl: "/resources/emotion-vocabulary-cards-thumb.png"
    },
    {
      id: "r2",
      title: "Emotions and Body Signals Poster",
      description: "Visual guide showing how different emotions might feel in the body.",
      type: "printable",
      ageGroups: ["early-years", "primary", "secondary"],
      fileUrl: "/resources/emotions-body-signals-poster.pdf",
      thumbnailUrl: "/resources/emotions-body-signals-poster-thumb.png"
    },
    {
      id: "r3",
      title: "Emotion Vocabulary Development Guide for Parents",
      description: "Strategies and activities for supporting emotional vocabulary at home.",
      type: "guide",
      ageGroups: ["early-years", "primary", "secondary"],
      fileUrl: "/resources/emotion-vocabulary-parent-guide.pdf",
      thumbnailUrl: "/resources/emotion-vocabulary-parent-guide-thumb.png"
    },
    {
      id: "r4",
      title: "Emotion Word of the Day Calendar",
      description: "Daily emotion words with definitions, examples, and reflection prompts.",
      type: "printable",
      ageGroups: ["primary", "secondary"],
      fileUrl: "/resources/emotion-word-calendar.pdf",
      thumbnailUrl: "/resources/emotion-word-calendar-thumb.png"
    },
    {
      id: "r5",
      title: "Emotion Vocabulary Books List",
      description: "Recommended books that support emotional vocabulary development.",
      type: "guide",
      ageGroups: ["early-years", "primary", "secondary"],
      fileUrl: "/resources/emotion-vocabulary-books.pdf",
      thumbnailUrl: "/resources/emotion-vocabulary-books-thumb.png"
    }
  ];
  
  // Load data on component mount
  useEffect(() => {
    if (session?.user) {
      fetchData();
    }
  }, [session]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch data from the API
      // For now, we'll simulate loading with a timeout
      setTimeout(() => {
        // Simulate user progress data
        setUserProgress({
          emotionsLearned: 8,
          activitiesCompleted: 5,
          quizzesCompleted: 2,
          masteryLevel: "intermediate"
        });
        
        // Simulate activity history
        setActivityHistory([
          { id: "h1", type: "emotion_explored", name: "Happy", date: "2025-05-15", notes: "Identified 3 new synonyms" },
          { id: "h2", type: "activity_completed", name: "Emotion Journal", date: "2025-05-14", notes: "Reflected on feeling proud" },
          { id: "h3", type: "quiz_completed", name: "Basic Emotions Quiz", date: "2025-05-12", score: "4/5" },
          { id: "h4", type: "emotion_explored", name: "Frustrated", date: "2025-05-10", notes: "Learned new coping strategies" },
          { id: "h5", type: "activity_completed", name: "Emotion Vocabulary Tree", date: "2025-05-08", notes: "Added 12 new emotion words" }
        ]);
        
        // Simulate favourite emotions
        setFavoriteEmotions(["e1", "e7", "e14", "e16"]);
        
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with an actual API call
      // const response = await fetch('/api/special-needs/emotional-vocabulary/preferences', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userPreferences),
      // });
      // const data = await response.json();
      
      // Simulating API response
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Success",
          description: "Your preferences have been saved.",
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleFavorite = (emotionId) => {
    if (favoriteEmotions.includes(emotionId)) {
      setFavoriteEmotions(favoriteEmotions.filter(id => id !== emotionId));
    } else {
      setFavoriteEmotions([...favoriteEmotions, emotionId]);
    }
    
    toast({
      title: favoriteEmotions.includes(emotionId) ? "Removed from favorites" : "Added to favorites",
      description: `This emotion has been ${favoriteEmotions.includes(emotionId) ? "removed from" : "added to"} your favorites.`,
    });
  };
  
  const handleStartActivity = (activityId) => {
    // In a real implementation, this would navigate to the activity page
    // or open a modal with the activity content
    toast({
      title: "Activity Started",
      description: "This activity has been started. Your progress will be saved automatically.",
    });
  };
  
  const handleStartQuiz = (quizId) => {
    // In a real implementation, this would navigate to the quiz page
    toast({
      title: "Quiz Started",
      description: "This quiz has been started. Your answers will be saved automatically.",
    });
  };
  
  const handleDownloadResource = (resourceId) => {
    // In a real implementation, this would download the resource file
    toast({
      title: "Resource Downloaded",
      description: "The resource is being downloaded to your device.",
    });
  };
  
  const getFilteredEmotions = () => {
    let filtered = [...emotions];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emotion => {
        return (
          emotion.name.toLowerCase().includes(query) ||
          emotion.category.toLowerCase().includes(query) ||
          emotion.description.toLowerCase().includes(query) ||
          emotion.synonyms.some(synonym => synonym.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply age group filter
    if (ageGroup !== "all") {
      filtered = filtered.filter(emotion => emotion.ageGroups.includes(ageGroup));
    }
    
    // Apply emotion category filter
    if (emotionCategory !== "all") {
      filtered = filtered.filter(emotion => emotion.category === emotionCategory);
    }
    
    // Apply intensity filter
    if (intensity !== "all") {
      filtered = filtered.filter(emotion => emotion.intensity === intensity);
    }
    
    return filtered;
  };
  
  const getFilteredActivities = () => {
    let filtered = [...activities];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(activity => {
        return (
          activity.name.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply age group filter
    if (ageGroup !== "all") {
      filtered = filtered.filter(activity => activity.ageGroups.includes(ageGroup));
    }
    
    // Apply emotion category filter
    if (emotionCategory !== "all") {
      filtered = filtered.filter(activity => 
        activity.emotionCategories.includes("all") || 
        activity.emotionCategories.includes(emotionCategory)
      );
    }
    
    return filtered;
  };
  
  const getFilteredQuizzes = () => {
    let filtered = [...quizzes];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(quiz => {
        return (
          quiz.title.toLowerCase().includes(query) ||
          quiz.description.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply age group filter
    if (ageGroup !== "all") {
      filtered = filtered.filter(quiz => quiz.ageGroups.includes(ageGroup));
    }
    
    return filtered;
  };
  
  const getFilteredResources = () => {
    let filtered = [...resources];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource => {
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.type.toLowerCase().includes(query)
        );
      });
    }
    
    // Apply age group filter
    if (ageGroup !== "all") {
      filtered = filtered.filter(resource => resource.ageGroups.includes(ageGroup));
    }
    
    return filtered;
  };
  
  const getEmotionById = (id) => {
    return emotions.find(emotion => emotion.id === id);
  };
  
  const getEmotionCategoryColor = (category) => {
    const categoryColors = {
      joy: "#FFD700", // Gold
      sadness: "#6495ED", // Cornflower Blue
      anger: "#FF4500", // OrangeRed
      fear: "#9370DB", // Medium Purple
      surprise: "#9932CC", // Dark Orchid
      disgust: "#32CD32", // Lime Green
      peace: "#87CEEB", // Sky Blue
      shame: "#FF6347", // Tomato
      neutral: "#A9A9A9" // Dark Grey
    };
    
    return categoryColors[category] || "#808080"; // Default to grey if category not found
  };
  
  const getIntensityLabel = (intensity) => {
    switch (intensity) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Low Intensity</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium Intensity</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-red-50 text-red-700">High Intensity</Badge>;
      default:
        return <Badge variant="outline">Unknown Intensity</Badge>;
    }
  };
  
  const getAgeGroupLabel = (ageGroup) => {
    switch (ageGroup) {
      case "early-years":
        return "Early Years (3-5)";
      case "primary":
        return "Primary (6-11)";
      case "secondary":
        return "Secondary (12-16)";
      default:
        return ageGroup;
    }
  };
  
  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-amber-500";
    return "bg-green-500";
  };
  
  const getMasteryLevelBadge = (level) => {
    switch (level) {
      case "beginner":
        return <Badge className="bg-blue-500">Beginner</Badge>;
      case "intermediate":
        return <Badge className="bg-amber-500">Intermediate</Badge>;
      case "advanced":
        return <Badge className="bg-green-500">Advanced</Badge>;
      case "expert":
        return <Badge className="bg-purple-500">Expert</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getActivityTypeIcon = (type) => {
    switch (type) {
      case "emotion_explored":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "activity_completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "quiz_completed":
        return <HelpCircle className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emotional Vocabulary Development</CardTitle>
          <CardDescription>
            Explore, learn, and practise using words to identify and express emotions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="explore">Explore Emotions</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">My Progress</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading content...</p>
              </div>
            ) : (
              <>
                {/* Explore Emotions Tab */}
                <TabsContent value="explore" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search emotions..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={ageGroup}
                        onValueChange={setAgeGroup}
                      >
                        <SelectTrigger className="w-[150px]">
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (6-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (12-16)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={emotionCategory}
                        onValueChange={setEmotionCategory}
                      >
                        <SelectTrigger className="w-[150px]">
                          <Layers className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="joy">Joy</SelectItem>
                          <SelectItem value="sadness">Sadness</SelectItem>
                          <SelectItem value="anger">Anger</SelectItem>
                          <SelectItem value="fear">Fear</SelectItem>
                          <SelectItem value="surprise">Surprise</SelectItem>
                          <SelectItem value="peace">Peace</SelectItem>
                          <SelectItem value="shame">Shame</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={intensity}
                        onValueChange={setIntensity}
                      >
                        <SelectTrigger className="w-[150px]">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Intensity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Intensities</SelectItem>
                          <SelectItem value="low">Low Intensity</SelectItem>
                          <SelectItem value="medium">Medium Intensity</SelectItem>
                          <SelectItem value="high">High Intensity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {selectedEmotion ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-2xl" style={{ color: selectedEmotion.color }}>
                              {selectedEmotion.name}
                            </CardTitle>
                            <CardDescription>
                              {selectedEmotion.category.charAt(0).toUpperCase() + selectedEmotion.category.slice(1)} • {getIntensityLabel(selectedEmotion.intensity)}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleToggleFavorite(selectedEmotion.id)}
                            >
                              {favoriteEmotions.includes(selectedEmotion.id) ? (
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                              ) : (
                                <Heart className="h-5 w-5" />
                              )}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedEmotion(null)}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Description</h3>
                              <p>{selectedEmotion.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-medium mb-2">How It Feels in Your Body</h3>
                                <p>{selectedEmotion.bodyFeelings}</p>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2">How It Might Look</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedEmotion.expressions.map((expression, index) => (
                                    <li key={index}>{expression}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h3 className="text-lg font-medium mb-2">What Might Trigger It</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedEmotion.triggers.map((trigger, index) => (
                                    <li key={index}>{trigger}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h3 className="text-lg font-medium mb-2">Helpful Strategies</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                  {selectedEmotion.strategies.map((strategy, index) => (
                                    <li key={index}>{strategy}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Examples</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {selectedEmotion.examples.map((example, index) => (
                                  <li key={index}>"{example}"</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="rounded-lg overflow-hidden border bg-card text-card-foreground shadow">
                              <div className="p-6 flex justify-centre items-centre" style={{ backgroundColor: `${selectedEmotion.color}20` }}>
                                <div className="w-32 h-32 rounded-full flex justify-centre items-centre" style={{ backgroundColor: selectedEmotion.color }}>
                                  {/* In a real implementation, this would be an actual image */}
                                  <span className="text-4xl">😊</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Similar Words</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEmotion.synonyms.map((synonym, index) => (
                                  <Badge key={index} variant="outline" style={{ borderColor: selectedEmotion.color }}>
                                    {synonym}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Related Emotions</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEmotion.relatedEmotions.map((relatedEmotion, index) => (
                                  <Badge key={index} variant="outline">
                                    {relatedEmotion.charAt(0).toUpperCase() + relatedEmotion.slice(1)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Suitable For</h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedEmotion.ageGroups.map((ag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {getAgeGroupLabel(ag)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Practise With</h3>
                              <div className="space-y-2">
                                {selectedEmotion.activities.map((activityId, index) => {
                                  const activityName = activityId.split('-').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ');
                                  
                                  return (
                                    <Button key={index} variant="outline" className="w-full justify-start">
                                      <Play className="mr-2 h-4 w-4" />
                                      {activityName}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {getFilteredEmotions().map(emotion => (
                        <Card 
                          key={emotion.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedEmotion(emotion)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle style={{ color: emotion.color }}>{emotion.name}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(emotion.id);
                                }}
                              >
                                {favoriteEmotions.includes(emotion.id) ? (
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                ) : (
                                  <Heart className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <CardDescription>
                              {emotion.category.charAt(0).toUpperCase() + emotion.category.slice(1)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-between items-centre mb-2">
                              <Badge variant="outline" className="text-xs">
                                {emotion.intensity.charAt(0).toUpperCase() + emotion.intensity.slice(1)} intensity
                              </Badge>
                              <div className="flex">
                                {emotion.ageGroups.includes("early-years") && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-1" title="Early Years"></span>
                                )}
                                {emotion.ageGroups.includes("primary") && (
                                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1" title="Primary"></span>
                                )}
                                {emotion.ageGroups.includes("secondary") && (
                                  <span className="w-2 h-2 rounded-full bg-purple-500" title="Secondary"></span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm line-clamp-3">{emotion.description}</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex flex-wrap gap-1">
                              {emotion.synonyms.slice(0, 3).map((synonym, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {synonym}
                                </Badge>
                              ))}
                              {emotion.synonyms.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{emotion.synonyms.length - 3}
                                </Badge>
                              )}
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {getFilteredEmotions().length === 0 && (
                        <div className="col-span-full text-centre py-12">
                          <p className="text-muted-foreground">
                            No emotions found matching your filters. Try adjusting your search criteria.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                {/* Activities Tab */}
                <TabsContent value="activities" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search activities..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={ageGroup}
                        onValueChange={setAgeGroup}
                      >
                        <SelectTrigger className="w-[150px]">
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (6-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (12-16)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={emotionCategory}
                        onValueChange={setEmotionCategory}
                      >
                        <SelectTrigger className="w-[150px]">
                          <Layers className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="joy">Joy</SelectItem>
                          <SelectItem value="sadness">Sadness</SelectItem>
                          <SelectItem value="anger">Anger</SelectItem>
                          <SelectItem value="fear">Fear</SelectItem>
                          <SelectItem value="surprise">Surprise</SelectItem>
                          <SelectItem value="peace">Peace</SelectItem>
                          <SelectItem value="shame">Shame</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getFilteredActivities().map(activity => (
                      <Card key={activity.id}>
                        <CardHeader>
                          <CardTitle>{activity.name}</CardTitle>
                          <CardDescription>{activity.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="flex items-centre">
                              <Clock className="mr-1 h-3 w-3" />
                              {activity.duration}
                            </Badge>
                            
                            {activity.ageGroups.map((ag, index) => (
                              <Badge key={index} variant="secondary">
                                {getAgeGroupLabel(ag)}
                              </Badge>
                            ))}
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Materials Needed:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {activity.materials.map((material, index) => (
                                <li key={index} className="text-sm">{material}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Benefits:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {activity.benefits.slice(0, 2).map((benefit, index) => (
                                <li key={index} className="text-sm">{benefit}</li>
                              ))}
                              {activity.benefits.length > 2 && (
                                <li className="text-sm text-muted-foreground">
                                  +{activity.benefits.length - 2} more benefits
                                </li>
                              )}
                            </ul>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartActivity(activity.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start Activity
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {getFilteredActivities().length === 0 && (
                      <div className="col-span-full text-centre py-12">
                        <p className="text-muted-foreground">
                          No activities found matching your filters. Try adjusting your search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search quizzes..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={ageGroup}
                        onValueChange={setAgeGroup}
                      >
                        <SelectTrigger className="w-[150px]">
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (6-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (12-16)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getFilteredQuizzes().map(quiz => (
                      <Card key={quiz.id}>
                        <CardHeader>
                          <CardTitle>{quiz.title}</CardTitle>
                          <CardDescription>{quiz.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="capitalize">
                              {quiz.difficulty}
                            </Badge>
                            
                            <Badge variant="outline" className="flex items-centre">
                              <HelpCircle className="mr-1 h-3 w-3" />
                              {quiz.questions.length} questions
                            </Badge>
                            
                            {quiz.ageGroups.map((ag, index) => (
                              <Badge key={index} variant="secondary">
                                {getAgeGroupLabel(ag)}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-centre space-x-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium mb-1">Sample Question:</div>
                              <div className="text-sm">{quiz.questions[0].question}</div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartQuiz(quiz.id)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start Quiz
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {getFilteredQuizzes().length === 0 && (
                      <div className="col-span-full text-centre py-12">
                        <p className="text-muted-foreground">
                          No quizzes found matching your filters. Try adjusting your search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search resources..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={ageGroup}
                        onValueChange={setAgeGroup}
                      >
                        <SelectTrigger className="w-[150px]">
                          <User className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="early-years">Early Years (3-5)</SelectItem>
                          <SelectItem value="primary">Primary (6-11)</SelectItem>
                          <SelectItem value="secondary">Secondary (12-16)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getFilteredResources().map(resource => (
                      <Card key={resource.id}>
                        <div className="aspect-video relative overflow-hidden rounded-t-lg">
                          {/* In a real implementation, this would be an actual image */}
                          <div className="absolute inset-0 bg-grey-200 flex items-centre justify-centre">
                            <Image className="h-12 w-12 text-grey-400" />
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="capitalize">
                              {resource.type}
                            </Badge>
                            
                            {resource.ageGroups.map((ag, index) => (
                              <Badge key={index} variant="secondary">
                                {getAgeGroupLabel(ag)}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className="w-full"
                            onClick={() => handleDownloadResource(resource.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Resource
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {getFilteredResources().length === 0 && (
                      <div className="col-span-full text-centre py-12">
                        <p className="text-muted-foreground">
                          No resources found matching your filters. Try adjusting your search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* My Progress Tab */}
                <TabsContent value="progress" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Emotions Learned</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userProgress.emotionsLearned}</div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((userProgress.emotionsLearned / emotions.length) * 100)}% of total
                        </p>
                        <Progress 
                          value={(userProgress.emotionsLearned / emotions.length) * 100} 
                          className={`h-2 mt-2 ${getProgressColor((userProgress.emotionsLearned / emotions.length) * 100)}`}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Activities Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userProgress.activitiesCompleted}</div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((userProgress.activitiesCompleted / activities.length) * 100)}% of total
                        </p>
                        <Progress 
                          value={(userProgress.activitiesCompleted / activities.length) * 100} 
                          className={`h-2 mt-2 ${getProgressColor((userProgress.activitiesCompleted / activities.length) * 100)}`}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Quizzes Completed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{userProgress.quizzesCompleted}</div>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((userProgress.quizzesCompleted / quizzes.length) * 100)}% of total
                        </p>
                        <Progress 
                          value={(userProgress.quizzesCompleted / quizzes.length) * 100} 
                          className={`h-2 mt-2 ${getProgressColor((userProgress.quizzesCompleted / quizzes.length) * 100)}`}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Mastery Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold capitalize">{userProgress.masteryLevel}</div>
                        <div className="mt-2">
                          {getMasteryLevelBadge(userProgress.masteryLevel)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                          Your recent learning activities and progress
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {activityHistory.map(activity => (
                              <div key={activity.id} className="flex items-start space-x-4 p-2 rounded-md hover:bg-grey-50">
                                <div className="mt-0.5">
                                  {getActivityTypeIcon(activity.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-centre justify-between">
                                    <p className="font-medium">{activity.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(activity.date).toLocaleDateString('en-GB', { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                      })}
                                    </p>
                                  </div>
                                  <p className="text-sm">
                                    {activity.type === 'quiz_completed' ? (
                                      <>Score: <span className="font-medium">{activity.score}</span></>
                                    ) : (
                                      activity.notes
                                    )}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Favourite Emotions</CardTitle>
                        <CardDescription>
                          Emotions you've saved for quick reference
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-4">
                            {favoriteEmotions.map(emotionId => {
                              const emotion = getEmotionById(emotionId);
                              if (!emotion) return null;
                              
                              return (
                                <div 
                                  key={emotion.id} 
                                  className="flex items-start space-x-4 p-2 rounded-md hover:bg-grey-50 cursor-pointer"
                                  onClick={() => {
                                    setSelectedEmotion(emotion);
                                    setActiveTab("explore");
                                  }}
                                >
                                  <div 
                                    className="w-10 h-10 rounded-full flex items-centre justify-centre"
                                    style={{ backgroundColor: `${emotion.color}20` }}
                                  >
                                    <span className="text-lg" style={{ color: emotion.color }}>
                                      {emotion.name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-centre justify-between">
                                      <p className="font-medium" style={{ color: emotion.color }}>{emotion.name}</p>
                                      <Badge variant="outline" className="capitalize text-xs">
                                        {emotion.category}
                                      </Badge>
                                    </div>
                                    <p className="text-sm line-clamp-2">{emotion.description}</p>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {favoriteEmotions.length === 0 && (
                              <div className="text-centre py-8">
                                <p className="text-muted-foreground">
                                  You haven't saved any favourite emotions yet. Click the heart icon on emotions you want to save.
                                </p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>
                        Customise your emotional vocabulary learning experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-centre justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="voice-enabled">Voice Narration</Label>
                                <p className="text-sm text-muted-foreground">
                                  Enable audio narration of emotion descriptions
                                </p>
                              </div>
                              <Switch 
                                id="voice-enabled" 
                                checked={userPreferences.voiceEnabled}
                                onCheckedChange={(checked) => {
                                  setUserPreferences({...userPreferences, voiceEnabled: checked});
                                }}
                              />
                            </div>
                            
                            <div className="flex items-centre justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="animations-enabled">Animations</Label>
                                <p className="text-sm text-muted-foreground">
                                  Show animations for emotions and activities
                                </p>
                              </div>
                              <Switch 
                                id="animations-enabled" 
                                checked={userPreferences.animationsEnabled}
                                onCheckedChange={(checked) => {
                                  setUserPreferences({...userPreferences, animationsEnabled: checked});
                                }}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-centre justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="simplified-view">Simplified View</Label>
                                <p className="text-sm text-muted-foreground">
                                  Show less information for easier focus
                                </p>
                              </div>
                              <Switch 
                                id="simplified-view" 
                                checked={userPreferences.simplifiedView}
                                onCheckedChange={(checked) => {
                                  setUserPreferences({...userPreferences, simplifiedView: checked});
                                }}
                              />
                            </div>
                            
                            <div className="flex items-centre justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="high-contrast">High Contrast</Label>
                                <p className="text-sm text-muted-foreground">
                                  Increase contrast for better visibility
                                </p>
                              </div>
                              <Switch 
                                id="high-contrast" 
                                checked={userPreferences.highContrast}
                                onCheckedChange={(checked) => {
                                  setUserPreferences({...userPreferences, highContrast: checked});
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="text-size">Text Size</Label>
                          <Select 
                            value={userPreferences.textSize}
                            onValueChange={(value) => setUserPreferences({...userPreferences, textSize: value})}
                          >
                            <SelectTrigger id="text-size" className="w-full md:w-[200px] mt-1">
                              <SelectValue placeholder="Select text size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="x-large">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/special-needs')}>
            Back to Special Needs Support
          </Button>
          <Button onClick={() => router.push('/special-needs/emotional-regulation')}>
            Emotional Regulation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmotionalVocabularyDevelopment;
