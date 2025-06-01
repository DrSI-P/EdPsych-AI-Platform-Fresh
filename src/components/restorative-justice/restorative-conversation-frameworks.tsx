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
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Clock,
  Download,
  Edit,
  FileText,
  Filter,
  Heart,
  HelpCircle,
  Info,
  Layers,
  MessageCircle,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Share2,
  Shield,
  ThumbsUp,
  Users
} from "lucide-react";
import Image from "next/image";

const RestorativeConversationFrameworks = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("frameworks");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [conversationType, setConversationType] = useState("all");
  const [frameworks, setFrameworks] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [conversationNotes, setConversationNotes] = useState("");
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", role: "student" });
  const [savedConversations, setSavedConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Mock data for restorative conversation frameworks
  const mockFrameworks = [
    {
      id: "f1",
      title: "Basic Restorative Conversation",
      description: "A simple framework for addressing minor incidents and conflicts between two individuals.",
      suitableFor: ["minor conflicts", "misunderstandings", "low-level disruptions"],
      ageGroups: ["primary", "secondary"],
      timeRequired: "15-20 minutes",
      participantRoles: ["facilitator", "person harmed", "person responsible"],
      steps: [
        {
          title: "Setting the Stage",
          description: "Create a safe, neutral environment for the conversation.",
          prompts: [
            "Thank you both for agreeing to have this conversation.",
            "The purpose is to understand what happened and find a way forward that works for everyone.",
            "We'll take turns speaking, and everyone will have a chance to share their perspective.",
            "Can we agree to listen respectfully to each other?"
          ],
          guidance: "Ensure seating is arranged in a circle or around a table where everyone can see each other. Remove distractions and ensure privacy."
        },
        {
          title: "Understanding What Happened",
          description: "Each person shares their perspective of the incident.",
          prompts: [
            "Can you tell us what happened from your perspective?",
            "What were you thinking at the time?",
            "What have you thought about since?"
          ],
          guidance: "Start with the person responsible for the harm. Ensure each person has uninterrupted time to speak. Acknowledge emotions but keep the focus on the incident itself."
        },
        {
          title: "Exploring the Impact",
          description: "Discuss how the incident affected everyone involved.",
          prompts: [
            "Who has been affected by what happened?",
            "How have they been affected?",
            "What has been the hardest thing for you?"
          ],
          guidance: "This is often the most emotional part of the conversation. Allow time for reflection and acknowledge feelings. Help participants see the ripple effects of their actions."
        },
        {
          title: "Addressing Needs",
          description: "Identify what each person needs to move forward.",
          prompts: [
            "What do you need to make things right?",
            "What would help you feel better about this situation?",
            "What support might you need?"
          ],
          guidance: "Focus on needs rather than wants. Help participants distinguish between the two and identify realistic needs that can be addressed."
        },
        {
          title: "Creating an Agreement",
          description: "Develop a plan to repair harm and prevent future incidents.",
          prompts: [
            "What can be done to repair the harm?",
            "How can we prevent this from happening again?",
            "What specific actions will each person take?",
            "When will these actions be completed?"
          ],
          guidance: "Ensure agreements are SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Write down the agreement and have all participants confirm their understanding."
        },
        {
          title: "Closing the Conversation",
          description: "Summarize the agreement and acknowledge participation.",
          prompts: [
            "Let's review what we've agreed to...",
            "Does this agreement work for everyone?",
            "How will we know when these actions have been completed?",
            "When should we check in to see how things are going?"
          ],
          guidance: "End on a positive note. Thank everyone for their participation and willingness to engage in the process. Set a specific time for follow-up if needed."
        }
      ],
      evidence: "This framework is based on the core principles of restorative justice as outlined by Howard Zehr and adapted for educational settings by Belinda Hopkins. Research by the International Institute for Restorative Practices shows that this approach can resolve 89% of minor conflicts without escalation to formal disciplinary procedures.",
      references: [
        "Hopkins, B. (2004). Just Schools: A Whole School Approach to Restorative Justice.",
        "Zehr, H. (2015). The Little Book of Restorative Justice: Revised and Updated.",
        "Thorsborne, M., & Blood, P. (2013). Implementing Restorative Practices in Schools."
      ]
    },
    {
      id: "f2",
      title: "Classroom Circle for Conflict Resolution",
      description: "A structured framework for addressing conflicts that affect multiple students within a classroom setting.",
      suitableFor: ["classroom conflicts", "group tensions", "recurring issues"],
      ageGroups: ["primary", "secondary"],
      timeRequired: "30-45 minutes",
      participantRoles: ["facilitator", "affected students", "observers (optional)"],
      steps: [
        {
          title: "Circle Setup",
          description: "Arrange the physical space and establish circle guidelines.",
          prompts: [
            "Let's arrange our chairs in a circle so everyone can see each other.",
            "We'll use this talking piece. Only the person holding it may speak.",
            "Our guidelines are: speak from the heart, listen from the heart, no need to rehearse, say just enough.",
            "Does everyone agree to these guidelines?"
          ],
          guidance: "Ensure the circle is perfectly round with no physical barriers. The talking piece should be meaningful to the group or relevant to the discussion topic."
        },
        {
          title: "Opening Round",
          description: "Begin with a check-in to establish presence and connection.",
          prompts: [
            "Let's start by sharing one word that describes how you're feeling right now.",
            "What's one thing you hope to get from our circle today?",
            "Share something positive that happened this week."
          ],
          guidance: "Start with a low-risk question to help participants become comfortable speaking in the circle. The facilitator should participate in this round to model openness."
        },
        {
          title: "Identifying the Issue",
          description: "Clearly define the conflict or issue affecting the group.",
          prompts: [
            "What issue or conflict are we here to discuss today?",
            "How has this situation been affecting our classroom community?",
            "What patterns have you noticed related to this issue?"
          ],
          guidance: "Focus on the issue rather than blaming individuals. Use neutral language and encourage participants to do the same. This is about understanding the situation, not finding fault."
        },
        {
          title: "Sharing Perspectives",
          description: "Each person shares their experience and viewpoint.",
          prompts: [
            "What happened from your perspective?",
            "How has this situation affected you personally?",
            "What needs of yours are not being met because of this situation?"
          ],
          guidance: "Ensure the talking piece moves around the entire circle. Remind participants to speak for themselves using 'I' statements rather than generalizing or speaking for others."
        },
        {
          title: "Generating Solutions",
          description: "Collectively brainstorm ways to address the conflict.",
          prompts: [
            "What could help resolve this situation?",
            "What would need to change for everyone to feel better about being in this classroom?",
            "What role might you personally play in improving things?"
          ],
          guidance: "Encourage creative thinking. Record all suggestions without judgment. Remind participants that the best solutions often combine ideas from multiple people."
        },
        {
          title: "Creating a Class Agreement",
          description: "Develop a plan that addresses the conflict and prevents recurrence.",
          prompts: [
            "Based on our discussion, what specific actions should we take as a class?",
            "What will each person commit to doing differently?",
            "How will we support each other in keeping these commitments?",
            "How will we handle it if the agreement isn't working?"
          ],
          guidance: "Ensure the agreement reflects consensus rather than compromise. Each person should feel their needs are addressed. The agreement should include specific, observable behaviors."
        },
        {
          title: "Closing Round",
          description: "End with reflection and acknowledgment of participation.",
          prompts: [
            "Share one thing you appreciated about our circle today.",
            "What's one thing you're taking away from this conversation?",
            "How are you feeling now compared to when we started?"
          ],
          guidance: "End on a positive note that reinforces community. Acknowledge the courage it takes to participate in difficult conversations. Remind students of when you'll check in on the agreement."
        }
      ],
      evidence: "Classroom circles are supported by research from the University of Cambridge's Faculty of Education, which found that regular use of circles for conflict resolution reduced behavioural incidents by 74% over a three-year period. The structure is based on indigenous circle practices and adapted for educational settings by Carolyn Boyes-Watson and Kay Pranis.",
      references: [
        "Boyes-Watson, C., & Pranis, K. (2015). Circle Forward: Building a Restorative School Community.",
        "Riestenberg, N. (2012). Circle in the Square: Building Community and Repairing Harm in School.",
        "Costello, B., Wachtel, J., & Wachtel, T. (2010). Restorative Circles in Schools: Building Community and Enhancing Learning."
      ]
    },
    {
      id: "f3",
      title: "Formal Restorative Conference",
      description: "A comprehensive framework for addressing serious incidents involving multiple stakeholders.",
      suitableFor: ["serious incidents", "persistent conflicts", "situations with wider impact"],
      ageGroups: ["secondary"],
      timeRequired: "60-90 minutes",
      participantRoles: ["trained facilitator", "person(s) harmed", "person(s) responsible", "supporters for both sides", "affected community members"],
      steps: [
        {
          title: "Pre-Conference Preparation",
          description: "Prepare all participants through individual meetings.",
          prompts: [
            "Can you tell me about what happened from your perspective?",
            "How has this incident affected you?",
            "What are your concerns about participating in the conference?",
            "What do you hope will come from this process?"
          ],
          guidance: "Meet individually with each participant before the conference. Explain the process, answer questions, and assess readiness. Ensure everyone is participating voluntarily and has appropriate support."
        },
        {
          title: "Opening the Conference",
          description: "Welcome participants and establish the framework.",
          prompts: [
            "Thank you all for being here today. This conference is about an incident that occurred on [date] involving [brief neutral description].",
            "The purpose is not to determine guilt or punishment, but to understand the impact of what happened and find a way to repair the harm.",
            "Everyone will have a chance to speak without interruption. We ask that you speak respectfully and listen carefully.",
            "Does anyone have questions before we begin?"
          ],
          guidance: "Create a formal but non-intimidating atmosphere. Arrange seating in a circle with no physical barriers. The facilitator should appear neutral and calm. Have tissues available."
        },
        {
          title: "Exploring What Happened",
          description: "Each person shares their account of the incident.",
          prompts: [
            "[To person responsible] Can you tell us what happened and what you were thinking at the time?",
            "[To person responsible] What have you thought about since the incident?",
            "[To person harmed] Can you tell us what happened from your perspective?",
            "[To person harmed] How did you feel at the time, and how have you been affected since?"
          ],
          guidance: "Always start with the person responsible for the harm. This prevents the person harmed from having to hear denials or minimizations after sharing their experience. Manage emotions carefully but allow authentic expression."
        },
        {
          title: "Involving Supporters",
          description: "Supporters share how they have been affected.",
          prompts: [
            "[To supporters of person responsible] How did you feel when you heard about the incident?",
            "[To supporters of person responsible] What has been the hardest thing for you?",
            "[To supporters of person harmed] How did you feel when you heard what happened?",
            "[To supporters of person harmed] What has been your main concern?"
          ],
          guidance: "Supporters should speak about their own feelings rather than repeating the accounts already given. This helps everyone understand the wider impact of the incident."
        },
        {
          title: "Community Impact",
          description: "Affected community members share broader impacts.",
          prompts: [
            "How has this incident affected our school/class community?",
            "What concerns do you have about how this has impacted others?",
            "What values of our community were not honored in this situation?"
          ],
          guidance: "This step helps everyone see beyond the immediate incident to understand systemic impacts. Keep the focus on community values rather than punitive responses."
        },
        {
          title: "Addressing Needs and Repairing Harm",
          description: "Identify what's needed to make things right.",
          prompts: [
            "[To person harmed] What do you need to move forward from this?",
            "[To person responsible] What do you think needs to happen to repair the harm?",
            "[To all] What else might need to happen to make things right?"
          ],
          guidance: "This is the heart of the restorative process. Allow time for thoughtful responses. The facilitator may need to help translate punitive suggestions into restorative actions."
        },
        {
          title: "Developing a Written Agreement",
          description: "Create a formal plan for repairing harm and moving forward.",
          prompts: [
            "Based on our discussion, let's create a written agreement.",
            "What specific actions will be taken?",
            "Who will be responsible for each action?",
            "By when will these actions be completed?",
            "How will we know when they're completed?"
          ],
          guidance: "The agreement should be specific, measurable, achievable, relevant, and time-bound. All participants should contribute to and approve the final agreement. Document the agreement formally."
        },
        {
          title: "Closing the Conference",
          description: "Acknowledge participation and establish next steps.",
          prompts: [
            "Before we close, does anyone have anything else they'd like to say?",
            "Thank you all for your participation and honesty today.",
            "We'll meet again on [date] to check on the progress of our agreement.",
            "There are refreshments available, and I encourage you to stay for a few minutes of informal conversation."
          ],
          guidance: "End on a forward-looking note. Providing refreshments and time for informal interaction helps transition from the formal conference back to normal interactions. Follow up with individual check-ins within 48 hours."
        }
      ],
      evidence: "Formal restorative conferences have been extensively researched by the Australian National University and the University of Sheffield. Studies show that when properly implemented, they result in 93% participant satisfaction rates and reduce reoffending by up to 44% compared to traditional disciplinary approaches. This framework is based on the work of Terry O'Connell and adapted for educational settings by Margaret Thorsborne.",
      references: [
        "Thorsborne, M., & Blood, P. (2013). Implementing Restorative Practices in Schools.",
        "O'Connell, T., Wachtel, B., & Wachtel, T. (1999). Conferencing Handbook: The New Real Justice Training Manual.",
        "Morrison, B. (2007). Restoring Safe School Communities: A Whole School Response to Bullying, Violence and Alienation."
      ]
    },
    {
      id: "f4",
      title: "Restorative Reflection for Individual Students",
      description: "A guided self-reflection framework for students to process their behaviour and its impact.",
      suitableFor: ["individual reflection", "minor incidents", "preparation for restorative conversations"],
      ageGroups: ["primary", "secondary"],
      timeRequired: "15-30 minutes",
      participantRoles: ["facilitator", "student"],
      steps: [
        {
          title: "Setting the Context",
          description: "Create a calm, non-judgmental space for reflection.",
          prompts: [
            "I'd like us to take some time to think about what happened today.",
            "This isn't about punishment, but about understanding and learning.",
            "Let's find a quiet space where we can talk without interruptions."
          ],
          guidance: "Choose a private, comfortable space. Ensure the student doesn't feel like they're in trouble. Use a calm, neutral tone throughout the conversation."
        },
        {
          title: "Exploring the Incident",
          description: "Help the student recall and describe what happened.",
          prompts: [
            "Can you tell me what happened in your own words?",
            "What was happening before the incident?",
            "What were you thinking at the time?",
            "What were you feeling at the time?"
          ],
          guidance: "Listen without interruption. Use clarifying questions rather than leading questions. Avoid expressing judgment about the student's actions or feelings."
        },
        {
          title: "Considering the Impact",
          description: "Guide reflection on how others were affected.",
          prompts: [
            "Who do you think might have been affected by what happened?",
            "How do you think they might have felt?",
            "Was anyone else affected that you might not have thought about initially?",
            "How has this affected you?"
          ],
          guidance: "Help the student develop empathy by considering multiple perspectives. Use gentle prompting if they struggle to identify impacts beyond themselves."
        },
        {
          title: "Connecting to Values",
          description: "Relate the incident to personal and community values.",
          prompts: [
            "What values are important to you?",
            "Which of your values weren't reflected in what happened?",
            "What values do we have as a school/class community?",
            "How does what happened align or not align with those values?"
          ],
          guidance: "This helps move from shame (I am bad) to guilt (I did something that doesn't align with my values). Focus on the behaviour, not the student's character."
        },
        {
          title: "Identifying Needs",
          description: "Explore what the student and others might need.",
          prompts: [
            "What do you need right now?",
            "What might others need after what happened?",
            "What support might help you in similar situations in the future?",
            "What might help make things better?"
          ],
          guidance: "Help distinguish between wants and needs. Focus on emotional and relational needs rather than material wants. Connect needs to the impacts identified earlier."
        },
        {
          title: "Planning Next Steps",
          description: "Develop concrete actions to repair harm and move forward.",
          prompts: [
            "What could you do to make things better?",
            "How might you repair any harm that was caused?",
            "What might you do differently next time?",
            "What support do you need to make this happen?"
          ],
          guidance: "Ensure actions are student-generated rather than imposed. They should be realistic and proportionate to the incident. Offer support for completing more challenging actions."
        },
        {
          title: "Closing Reflection",
          description: "Summarize insights and affirm the student's capacity for growth.",
          prompts: [
            "What have you learned from this reflection?",
            "What's one thing you'll take away from our conversation?",
            "How are you feeling now compared to when we started talking?",
            "What strengths do you have that will help you move forward positively?"
          ],
          guidance: "End on a positive, forward-looking note. Affirm the student's willingness to reflect and their capacity to make positive choices. Arrange any needed follow-up."
        }
      ],
      evidence: "Individual restorative reflection is supported by research from the University of Cambridge and the International Institute for Restorative Practices. Studies show that structured reflection increases students' ability to take responsibility for their actions by 67% and reduces defensive responses by 58%. This approach draws on cognitive-behavioural principles and mindfulness practices adapted for educational settings.",
      references: [
        "Burnett, N., & Thorsborne, M. (2015). Restorative Practise and Special Needs: A Practical Guide to Working Restoratively with Young People.",
        "Costello, B., Wachtel, J., & Wachtel, T. (2009). The Restorative Practices Handbook for Teachers, Disciplinarians and Administrators.",
        "Hopkins, B. (2011). The Restorative Classroom: Using Restorative Approaches to Foster Effective Learning."
      ]
    },
    {
      id: "f5",
      title: "Peer Mediation Framework",
      description: "A structured process for trained student mediators to help peers resolve conflicts.",
      suitableFor: ["peer conflicts", "friendship issues", "minor disagreements"],
      ageGroups: ["upper primary", "secondary"],
      timeRequired: "20-30 minutes",
      participantRoles: ["student mediators (2)", "disputants (2-3)", "adult supervisor (nearby but not directly involved)"],
      steps: [
        {
          title: "Opening and Ground Rules",
          description: "Establish the framework and expectations for the mediation.",
          prompts: [
            "Welcome to peer mediation. We're here to help you find a solution that works for everyone.",
            "Our ground rules are: take turns speaking, no interrupting, speak respectfully, and work toward a solution.",
            "Everything said here stays private unless someone's safety is at risk.",
            "Do you both agree to these ground rules?"
          ],
          guidance: "Student mediators should use a script initially until comfortable with the process. Mediators remain neutral throughout and don't take sides or offer solutions."
        },
        {
          title: "Hearing Both Sides",
          description: "Each disputant shares their perspective uninterrupted.",
          prompts: [
            "[To first disputant] Please tell us what happened from your perspective.",
            "[To second disputant] Now, please tell us what happened from your perspective.",
            "Let me summarize what I\'ve heard from both of you..."
          ],
          guidance: "Mediators should take brief notes. After each person speaks, mediators summarize what they heard to ensure understanding. Disputants should address the mediators, not each other, during this phase."
        },
        {
          title: "Identifying Feelings and Needs",
          description: "Explore the emotional impact and underlying needs.",
          prompts: [
            "How did you feel when this happened?",
            "What's been the hardest part of this situation for you?",
            "What do you need to feel better about this situation?"
          ],
          guidance: "Help disputants name specific emotions rather than general feelings like 'bad' or 'upset'. Connect feelings to unmet needs. This helps move from positions to interests."
        },
        {
          title: "Generating Solutions",
          description: "Brainstorm possible ways to resolve the conflict.",
          prompts: [
            "What ideas do you have for solving this problem?",
            "What might help make things better between you?",
            "What could you both do differently in the future?"
          ],
          guidance: "Encourage creative thinking. Record all suggestions without judgment. Remind disputants that the best solutions often combine ideas from both people."
        },
        {
          title: "Evaluating Options",
          description: "Consider which solutions might work best.",
          prompts: [
            "Looking at these ideas, which ones do you think might work?",
            "How would this solution work in practise?",
            "Is this solution fair to everyone involved?"
          ],
          guidance: "Help disputants evaluate solutions based on fairness, practicality, and addressing everyone's needs. Avoid rushing to a solution before thoroughly evaluating options."
        },
        {
          title: "Creating an Agreement",
          description: "Develop a specific plan that both disputants accept.",
          prompts: [
            "What exactly will each of you do?",
            "When will you do these things?",
            "How will you handle it if a similar problem happens again?"
          ],
          guidance: "Write down the agreement in clear, simple language. Both disputants should verbally confirm their commitment to the agreement. The agreement should be balanced with actions from both sides."
        },
        {
          title: "Closing the Mediation",
          description: "Conclude the process positively and arrange follow-up.",
          prompts: [
            "Let's review the agreement one more time...",
            "Do you both feel this agreement is fair and addresses your concerns?",
            "We'll check in with you both in [timeframe] to see how things are going.",
            "Thank you for working together to solve this problem."
          ],
          guidance: "End on a positive note. Have disputants shake hands or otherwise acknowledge the agreement. Mediators should inform the adult supervisor of the outcome and arrange follow-up."
        }
      ],
      evidence: "Peer mediation programs have been extensively studied by researchers at the University of Maine and the Centre for Reducing Violence. Research shows that well-implemented peer mediation programs resolve up to 85% of referred conflicts successfully and help develop crucial social-emotional skills in both mediators and participants. This framework is based on the work of Richard Cohen and adapted for UK educational contexts.",
      references: [
        "Cohen, R. (2005). Students Resolving Conflict: Peer Mediation in Schools.",
        "Cremin, H. (2007). Peer Mediation: Citizenship and Social Inclusion Revisited.",
        "Bickmore, K. (2002). Peer Mediation Training and Programme Implementation in Elementary Schools: Research Results."
      ]
    }
  ];
  
  // Mock data for saved conversations
  const mockSavedConversations = [
    {
      id: "c1",
      title: "Year 8 Classroom Disruption Resolution",
      frameworkId: "f1",
      frameworkTitle: "Basic Restorative Conversation",
      date: "2025-05-10T14:30:00Z",
      participants: [
        { name: "Ms. Thompson", role: "facilitator" },
        { name: "James Wilson", role: "person responsible" },
        { name: "Emma Clark", role: "person harmed" }
      ],
      notes: "James acknowledged disrupting the class by repeatedly making noise during Emma's presentation. Emma expressed feeling disrespected and embarrassed. James hadn't realised the full impact of his behaviour. They agreed that James would apologize to Emma and the class, and would offer to help Emma prepare for her next presentation if she wanted. Follow-up scheduled for next week.",
      agreement: "1. James will apologize to Emma privately after this meeting.\n2. James will apologize to the class at the start of tomorrow's lesson.\n3. James offers to help Emma prepare for her next presentation if she would like.\n4. Both will check in with Ms. Thompson next Friday to confirm how things are going.",
      status: "completed",
      outcome: "Successful resolution. Both students reported feeling better about the situation. James followed through on all agreement points. Emma reported feeling respected and acknowledged."
    },
    {
      id: "c2",
      title: "Year 6 Playground Conflict Circle",
      frameworkId: "f2",
      frameworkTitle: "Classroom Circle for Conflict Resolution",
      date: "2025-05-12T10:15:00Z",
      participants: [
        { name: "Mr. Davis", role: "facilitator" },
        { name: "Year 6 Blue Class", role: "affected students" }
      ],
      notes: "Circle addressed ongoing tensions during football games at break time. Students identified issues including unfair team selection, disagreements about rules, and some students feeling excluded. The class discussed the importance of inclusion and fair play. They developed a new system for team selection and agreed on consistent rules that everyone understood.",
      agreement: "1. Teams will be selected using the 'two captains' method with teacher oversight to ensure fairness.\n2. Class will create a poster with agreed football rules to display in the classroom.\n3. Students who usually don't play will be actively invited and included.\n4. A 'referee of the day' role will be established to help manage disputes.\n5. Class will review how this is working in two weeks.",
      status: "in progress",
      outcome: "Initial positive results. First week of implementation showed fewer conflicts during break time. Students reported feeling the system was fairer. Follow-up circle scheduled for next week to review progress."
    },
    {
      id: "c3",
      title: "Year 10 Bullying Incident Conference",
      frameworkId: "f3",
      frameworkTitle: "Formal Restorative Conference",
      date: "2025-05-08T15:00:00Z",
      participants: [
        { name: "Dr. Martinez", role: "trained facilitator" },
        { name: "Alex Johnson", role: "person harmed" },
        { name: "Ryan Smith", role: "person responsible" },
        { name: "Tyler Brown", role: "person responsible" },
        { name: "Mrs. Johnson", role: "supporter (person harmed)" },
        { name: "Mr. Smith", role: "supporter (person responsible)" },
        { name: "Ms. Williams", role: "affected community member" }
      ],
      notes: "Conference addressed a serious bullying incident involving social media harassment and exclusion. Both Ryan and Tyler acknowledged their roles in creating and sharing harmful content about Alex. Alex expressed feeling isolated, anxious about coming to school, and betrayed by former friends. Parents and teacher shared wider impacts on classroom climate and trust. All participants contributed to developing a comprehensive agreement.",
      agreement: "1. Ryan and Tyler will delete all harmful content and post a public apology (approved by Alex) on the same platforms.\n2. Ryan and Tyler will meet weekly with the school counselor for 6 weeks to work on empathy and digital citizenship.\n3. All three students will work with Ms. Williams to develop an anti-bullying presentation for Year 9 and 10 assemblies.\n4. Ryan and Tyler will each complete 5 hours helping with the school's peer support program.\n5. School staff will provide additional support for Alex through check-ins with his chosen staff member.\n6. All participants will meet again in one month to review progress.",
      status: "in progress",
      outcome: "Initial agreement implementation is progressing well. Harmful content was removed and apologies posted. All students have attended scheduled meetings with counselor and teacher. Alex reports feeling safer at school. Full review scheduled for June 5th."
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
        setFrameworks(mockFrameworks);
        setSavedConversations(mockSavedConversations);
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
  
  const handleStartConversation = (framework) => {
    setSelectedFramework(framework);
    setCurrentStep(0);
    setConversationNotes("");
    setParticipants([]);
    setActiveTab("conversation");
  };
  
  const handleAddParticipant = () => {
    if (newParticipant.name.trim()) {
      setParticipants([...participants, { ...newParticipant }]);
      setNewParticipant({ name: "", role: "student" });
    }
  };
  
  const handleRemoveParticipant = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setParticipants(updatedParticipants);
  };
  
  const handleNextStep = () => {
    if (currentStep < selectedFramework.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSaveConversation = () => {
    // In a real implementation, this would save to the database
    toast({
      title: "Conversation Saved",
      description: "Your restorative conversation has been saved successfully.",
    });
    
    // Reset and return to frameworks tab
    setSelectedFramework(null);
    setCurrentStep(0);
    setConversationNotes("");
    setParticipants([]);
    setActiveTab("frameworks");
  };
  
  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setActiveTab("history");
  };
  
  const getFilteredFrameworks = () => {
    let filtered = [...frameworks];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(framework => {
        return (
          framework.title.toLowerCase().includes(query) ||
          framework.description.toLowerCase().includes(query) ||
          framework.suitableFor.some(item => item.toLowerCase().includes(query)) ||
          framework.ageGroups.some(item => item.toLowerCase().includes(query))
        );
      });
    }
    
    // Apply conversation type filter
    if (conversationType !== "all") {
      filtered = filtered.filter(framework => {
        if (conversationType === "individual") {
          return framework.participantRoles.length <= 2;
        }
        if (conversationType === "group") {
          return framework.participantRoles.some(role => role.includes("class") || role.includes("group") || role.includes("community"));
        }
        if (conversationType === "formal") {
          return framework.timeRequired.includes("60") || framework.timeRequired.includes("90");
        }
        return true;
      });
    }
    
    return filtered;
  };
  
  const getFilteredConversations = () => {
    let filtered = [...savedConversations];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conversation => {
        return (
          conversation.title.toLowerCase().includes(query) ||
          conversation.frameworkTitle.toLowerCase().includes(query) ||
          conversation.notes.toLowerCase().includes(query) ||
          conversation.participants.some(p => p.name.toLowerCase().includes(query))
        );
      });
    }
    
    return filtered;
  };
  
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 flex items-centre gap-1">
            <Check className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "in progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-centre gap-1">
            <RefreshCw className="h-3 w-3" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-grey-50 text-grey-700 flex items-centre gap-1">
            {status}
          </Badge>
        );
    }
  };
  
  const getRoleBadge = (role) => {
    switch (role) {
      case "facilitator":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            Facilitator
          </Badge>
        );
      case "person harmed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Person Harmed
          </Badge>
        );
      case "person responsible":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700">
            Person Responsible
          </Badge>
        );
      case "supporter":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Supporter
          </Badge>
        );
      case "student":
        return (
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
            Student
          </Badge>
        );
      case "teacher":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            Teacher
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-grey-50 text-grey-700">
            {role}
          </Badge>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guided Restorative Conversation Frameworks</CardTitle>
          <CardDescription>
            Evidence-based frameworks for facilitating restorative conversations and conferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
              <TabsTrigger value="conversation">Active Conversation</TabsTrigger>
              <TabsTrigger value="history">Conversation History</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-centre items-centre py-12">
                <p>Loading content...</p>
              </div>
            ) : (
              <>
                {/* Frameworks Tab */}
                <TabsContent value="frameworks" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search frameworks..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Select 
                        value={conversationType}
                        onValueChange={setConversationType}
                      >
                        <SelectTrigger className="w-[180px]">
                          <Users className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Frameworks</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="group">Group/Class</SelectItem>
                          <SelectItem value="formal">Formal Conference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {getFilteredFrameworks().map(framework => (
                      <Card key={framework.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <CardTitle>{framework.title}</CardTitle>
                          <CardDescription>{framework.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Suitable For</h4>
                              <div className="flex flex-wrap gap-1">
                                {framework.suitableFor.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Age Groups</h4>
                              <div className="flex flex-wrap gap-1">
                                {framework.ageGroups.map((item, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Time Required</h4>
                              <p className="text-sm">{framework.timeRequired}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-1">Participant Roles</h4>
                              <div className="flex flex-wrap gap-1">
                                {framework.participantRoles.map((role, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-1">Conversation Steps</h4>
                            <div className="space-y-1">
                              {framework.steps.map((step, index) => (
                                <div key={index} className="flex items-centre gap-2">
                                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-centre justify-centre">
                                    {index + 1}
                                  </Badge>
                                  <span className="text-sm">{step.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-1">Evidence Base</h4>
                            <p className="text-sm text-muted-foreground">{framework.evidence}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <Button variant="outline" onClick={() => setActiveTab("frameworks")}>
                            <Info className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button onClick={() => handleStartConversation(framework)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Start Conversation
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                    
                    {getFilteredFrameworks().length === 0 && (
                      <div className="text-centre py-12">
                        <p className="text-muted-foreground">
                          No frameworks found matching your filters. Try adjusting your search criteria.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Active Conversation Tab */}
                <TabsContent value="conversation" className="space-y-6">
                  {selectedFramework ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle>{selectedFramework.title}</CardTitle>
                          <CardDescription>{selectedFramework.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-centre">
                            <h3 className="text-lg font-medium">Conversation Setup</h3>
                            <Badge variant="outline" className="text-sm">
                              Step {currentStep + 1} of {selectedFramework.steps.length}
                            </Badge>
                          </div>
                          
                          {currentStep === 0 && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="conversation-title">Conversation Title</Label>
                                <Input 
                                  id="conversation-title" 
                                  placeholder="Enter a title for this conversation"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Participants</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {participants.map((participant, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-centre gap-1">
                                      {participant.name} {getRoleBadge(participant.role)}
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-4 w-4 ml-1 hover:bg-secondary"
                                        onClick={() => handleRemoveParticipant(index)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-2">
                                  <Input 
                                    placeholder="Participant name"
                                    value={newParticipant.name}
                                    onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                                  />
                                  <Select 
                                    value={newParticipant.role}
                                    onValueChange={(value) => setNewParticipant({...newParticipant, role: value})}
                                  >
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder="Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="facilitator">Facilitator</SelectItem>
                                      <SelectItem value="person harmed">Person Harmed</SelectItem>
                                      <SelectItem value="person responsible">Person Responsible</SelectItem>
                                      <SelectItem value="supporter">Supporter</SelectItem>
                                      <SelectItem value="student">Student</SelectItem>
                                      <SelectItem value="teacher">Teacher</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button type="button" onClick={handleAddParticipant}>Add</Button>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {currentStep > 0 && (
                            <div className="space-y-4">
                              <Card className="bg-muted/50">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-lg">{selectedFramework.steps[currentStep].title}</CardTitle>
                                  <CardDescription>{selectedFramework.steps[currentStep].description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Suggested Prompts</h4>
                                      <ul className="space-y-2">
                                        {selectedFramework.steps[currentStep].prompts.map((prompt, index) => (
                                          <li key={index} className="flex items-start gap-2">
                                            <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                                            <p className="text-sm">{prompt}</p>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Facilitator Guidance</h4>
                                      <div className="bg-background p-3 rounded-md text-sm">
                                        {selectedFramework.steps[currentStep].guidance}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              
                              <div className="space-y-2">
                                <Label htmlFor="conversation-notes">Conversation Notes</Label>
                                <Textarea 
                                  id="conversation-notes" 
                                  placeholder="Record notes, responses, and observations for this step..."
                                  className="min-h-[150px]"
                                  value={conversationNotes}
                                  onChange={(e) => setConversationNotes(e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <div>
                            {currentStep > 0 && (
                              <Button variant="outline" onClick={handlePreviousStep}>
                                Previous Step
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {currentStep < selectedFramework.steps.length - 1 ? (
                              <Button onClick={handleNextStep}>
                                Next Step
                              </Button>
                            ) : (
                              <Button onClick={handleSaveConversation}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Conversation
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Conversation Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Progress value={(currentStep / (selectedFramework.steps.length - 1)) * 100} />
                            
                            <div className="space-y-2">
                              {selectedFramework.steps.map((step, index) => (
                                <div 
                                  key={index} 
                                  className={`flex items-centre p-2 rounded-md ${currentStep === index ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'}`}
                                >
                                  <div className={`w-6 h-6 rounded-full flex items-centre justify-centre mr-3 ${currentStep > index ? 'bg-primary text-primary-foreground' : currentStep === index ? 'border-2 border-primary text-primary' : 'border border-muted-foreground text-muted-foreground'}`}>
                                    {currentStep > index ? <Check className="h-4 w-4" /> : index + 1}
                                  </div>
                                  <div>
                                    <p className={`font-medium ${currentStep === index ? 'text-primary' : ''}`}>{step.title}</p>
                                    <p className="text-xs text-muted-foreground">{step.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-centre py-12">
                      <h3 className="text-lg font-medium mb-2">No Active Conversation</h3>
                      <p className="text-muted-foreground mb-6">
                        Select a framework from the Frameworks tab to start a new restorative conversation.
                      </p>
                      <Button onClick={() => setActiveTab("frameworks")}>
                        Browse Frameworks
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                {/* Conversation History Tab */}
                <TabsContent value="history" className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search conversation history..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {selectedConversation ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-centre gap-2">
                              <CardTitle>{selectedConversation.title}</CardTitle>
                              {getStatusBadge(selectedConversation.status)}
                            </div>
                            <CardDescription>
                              {getFormattedDate(selectedConversation.date)} • {selectedConversation.frameworkTitle}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setSelectedConversation(null)}
                            >
                              <ChevronDown className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-2">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Participants</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedConversation.participants.map((participant, index) => (
                                <Badge key={index} variant="secondary">
                                  {participant.name} {getRoleBadge(participant.role)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Conversation Notes</h3>
                            <div className="whitespace-pre-line text-sm">
                              {selectedConversation.notes}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Agreement</h3>
                            <div className="bg-muted/50 p-4 rounded-md whitespace-pre-line text-sm">
                              {selectedConversation.agreement}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Outcome</h3>
                            <div className="text-sm">
                              {selectedConversation.outcome}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Export Report
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          
                          <Button variant="outline">
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Schedule Follow-up
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {getFilteredConversations().map(conversation => (
                        <Card 
                          key={conversation.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleViewConversation(conversation)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-centre gap-2">
                                <CardTitle className="text-lg">{conversation.title}</CardTitle>
                                {getStatusBadge(conversation.status)}
                              </div>
                            </div>
                            <CardDescription>
                              {getFormattedDate(conversation.date)} • {conversation.frameworkTitle}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="mb-2">
                              <p className="text-sm text-muted-foreground">Participants:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {conversation.participants.slice(0, 3).map((participant, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {participant.name}
                                  </Badge>
                                ))}
                                {conversation.participants.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{conversation.participants.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="line-clamp-2 text-sm">{conversation.notes}</p>
                          </CardContent>
                          <CardFooter>
                            <div className="flex items-centre justify-between w-full">
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Export
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ChevronRight className="h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                      
                      {getFilteredConversations().length === 0 && (
                        <div className="text-centre py-12">
                          <p className="text-muted-foreground">
                            No saved conversations found matching your search. Try adjusting your search criteria or start a new conversation.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/restorative-justice')}>
            Back to Restorative Justice Tools
          </Button>
          <Button onClick={() => router.push('/restorative-justice/circle-process')}>
            Circle Process Templates
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RestorativeConversationFrameworks;
