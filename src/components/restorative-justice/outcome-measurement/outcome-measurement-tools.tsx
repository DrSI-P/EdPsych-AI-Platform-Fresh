'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { 
  FiBarChart2, 
  FiCalendar, 
  FiCheckCircle, 
  FiClipboard, 
  FiDownload, 
  FiFileText, 
  FiUsers, 
  FiSettings,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiInfo
} from 'react-icons/fi';
import { z } from 'zod';

// Define types for assessment data
type AssessmentType = 'baseline' | 'process' | 'short-term' | 'long-term';
type SettingType = 'early-years' | 'primary' | 'secondary' | 'sen';
type DimensionType = 'connectedness' | 'psychological' | 'implementation' | 'academic' | 'climate' | 'long-term';

interface Assessment {
  id: string;
  title: string;
  type: AssessmentType;
  setting: SettingType;
  dimensions: any[];
  createdAt: string;
  completedAt?: string;
  status: 'draft' | 'in-progress' | 'completed';
  targetGroup: string;
  respondents: number;
}

interface Dimension {
  id: DimensionType;
  name: string;
  description: string;
  icon: React.ReactNode;
  tools: any[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'survey' | 'observation' | 'data-analysis' | 'qualitative';
  targetAudience: any[];
  timeRequired: string;
}

// Mock data for dimensions
const dimensions: any[] = [
  {
    id: 'connectedness',
    name: 'School Connectedness & Community',
    description: 'Measures student sense of belonging, relationship quality, and community perception',
    icon: <FiUsers />,
    tools: [
      {
        id: 'scs',
        name: 'School Connectedness Scale (SCS)',
        description: 'Validated measure of students\' sense of connection to their school environment',
        type: 'survey',
        targetAudience: ['students'],
        timeRequired: '10-15 minutes'
      },
      {
        id: 'sscs',
        name: 'Sense of School Community Scale (SSCS)',
        description: 'Assesses students\' perception of community within the school',
        type: 'survey',
        targetAudience: ['students'],
        timeRequired: '15-20 minutes'
      },
      {
        id: 'relationship-mapping',
        name: 'Relationship Mapping Exercise',
        description: 'Visual tool to map student connections within the school community',
        type: 'qualitative',
        targetAudience: ['students', 'staff'],
        timeRequired: '30-45 minutes'
      }
    ]
  },
  {
    id: 'psychological',
    name: 'Psychological & Behavioural Adjustment',
    description: 'Assesses emotional regulation, behaviour patterns, and conflict resolution skills',
    icon: <FiBarChart2 />,
    tools: [
      {
        id: 'sdq',
        name: 'Strengths and Difficulties Questionnaire (SDQ)',
        description: 'Widely used tool for assessing psychological and behavioural adjustment',
        type: 'survey',
        targetAudience: ['students', 'teachers', 'parents'],
        timeRequired: '5-10 minutes'
      },
      {
        id: 'emotional-regulation',
        name: 'Emotional Regulation Assessment',
        description: 'Measures students\' ability to recognise and manage emotions',
        type: 'survey',
        targetAudience: ['students', 'teachers'],
        timeRequired: '10-15 minutes'
      },
      {
        id: 'behaviour-tracking',
        name: 'Restorative Behaviour Tracking',
        description: 'System for recording incidents and restorative outcomes',
        type: 'data-analysis',
        targetAudience: ['staff'],
        timeRequired: 'Ongoing'
      }
    ]
  },
  {
    id: 'implementation',
    name: 'Restorative Practise Implementation',
    description: 'Evaluates the quality and consistency of restorative approaches',
    icon: <FiCheckCircle />,
    tools: [
      {
        id: 'implementation-checklist',
        name: 'Implementation Fidelity Checklist',
        description: 'Structured assessment of restorative practise implementation',
        type: 'observation',
        targetAudience: ['staff'],
        timeRequired: '20-30 minutes'
      },
      {
        id: 'staff-assessment',
        name: 'Staff Self-Assessment Survey',
        description: 'Measures staff confidence and competence in restorative approaches',
        type: 'survey',
        targetAudience: ['staff'],
        timeRequired: '15-20 minutes'
      },
      {
        id: 'policy-review',
        name: 'Policy Review Framework',
        description: 'Evaluates integration of restorative principles in school policies',
        type: 'qualitative',
        targetAudience: ['leadership'],
        timeRequired: '1-2 hours'
      }
    ]
  },
  {
    id: 'academic',
    name: 'Academic Engagement & Achievement',
    description: 'Tracks classroom engagement, performance, and learning motivation',
    icon: <FiFileText />,
    tools: [
      {
        id: 'engagement-scale',
        name: 'Academic Engagement Scale',
        description: 'Measures student engagement in learning activities',
        type: 'survey',
        targetAudience: ['students', 'teachers'],
        timeRequired: '10-15 minutes'
      },
      {
        id: 'performance-tracking',
        name: 'Performance Correlation Analysis',
        description: 'Analyzes academic performance in relation to restorative interventions',
        type: 'data-analysis',
        targetAudience: ['staff'],
        timeRequired: 'Varies'
      },
      {
        id: 'motivation-measure',
        name: 'Motivation and Self-Efficacy Measure',
        description: 'Assesses student motivation and belief in their ability to succeed',
        type: 'survey',
        targetAudience: ['students'],
        timeRequired: '10-15 minutes'
      }
    ]
  },
  {
    id: 'climate',
    name: 'School Climate & Culture',
    description: 'Evaluates school atmosphere, safety, respect, and inclusion',
    icon: <FiClipboard />,
    tools: [
      {
        id: 'climate-survey',
        name: 'School Climate Survey',
        description: 'Comprehensive assessment of school atmosphere and safety',
        type: 'survey',
        targetAudience: ['students', 'staff', 'parents'],
        timeRequired: '15-20 minutes'
      },
      {
        id: 'inclusion-metrics',
        name: 'Inclusion and Diversity Metrics',
        description: 'Measures indicators of inclusive practices and diversity',
        type: 'data-analysis',
        targetAudience: ['leadership'],
        timeRequired: 'Varies'
      },
      {
        id: 'exclusion-tracking',
        name: 'Exclusion Reduction Tracking',
        description: 'Monitors changes in exclusionary practices over time',
        type: 'data-analysis',
        targetAudience: ['leadership'],
        timeRequired: 'Ongoing'
      }
    ]
  },
  {
    id: 'long-term',
    name: 'Long-term Outcomes & Impact',
    description: 'Assesses sustained changes and broader impacts over time',
    icon: <FiCalendar />,
    tools: [
      {
        id: 'longitudinal-tracking',
        name: 'Longitudinal Tracking System',
        description: 'Framework for monitoring long-term outcomes',
        type: 'data-analysis',
        targetAudience: ['leadership'],
        timeRequired: 'Ongoing'
      },
      {
        id: 'follow-up-assessment',
        name: 'Follow-up Assessment Package',
        description: 'Comprehensive assessment at 6, 12, and 24 months',
        type: 'survey',
        targetAudience: ['students', 'staff', 'parents'],
        timeRequired: 'Varies'
      },
      {
        id: 'skills-transfer',
        name: 'Cross-Context Skills Application Survey',
        description: 'Evaluates transfer of skills to other contexts',
        type: 'survey',
        targetAudience: ['students', 'parents'],
        timeRequired: '15-20 minutes'
      }
    ]
  }
];

// Mock data for assessments
const mockAssessments: any[] = [
  {
    id: '1',
    title: 'Baseline Assessment - Oakwood Secondary',
    type: 'baseline',
    setting: 'secondary',
    dimensions: ['connectedness', 'psychological', 'climate'],
    createdAt: '2025-04-15T10:30:00Z',
    status: 'completed',
    targetGroup: 'Year 8 Students',
    respondents: 87
  },
  {
    id: '2',
    title: 'Short-term Outcome Assessment - Oakwood Secondary',
    type: 'short-term',
    setting: 'secondary',
    dimensions: ['connectedness', 'psychological', 'climate'],
    createdAt: '2025-05-10T14:45:00Z',
    status: 'in-progress',
    targetGroup: 'Year 8 Students',
    respondents: 52
  },
  {
    id: '3',
    title: 'Implementation Fidelity Check - Meadow Primary',
    type: 'process',
    setting: 'primary',
    dimensions: ['implementation'],
    createdAt: '2025-05-12T09:15:00Z',
    status: 'draft',
    targetGroup: 'Staff',
    respondents: 0
  }
];

// Validation schemas
const newAssessmentSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.enum(['baseline', 'process', 'short-term', 'long-term']),
  setting: z.enum(['early-years', 'primary', 'secondary', 'sen']),
  dimensions: z.array(z.string()).min(1, "Select at least one dimension"),
  targetGroup: z.string().min(3, "Target group must be specified")
});

export default function OutcomeMeasurementTools() {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [activeTab, setActiveTab] = useState(0);
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [newAssessment, setNewAssessment] = useState({
    title: '',
    type: 'baseline' as AssessmentType,
    setting: 'secondary' as SettingType,
    dimensions: [] as string[],
    targetGroup: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAssessment(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // Handle dimension selection
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setNewAssessment(prev => ({
      ...prev,
      dimensions: checked 
        ? [...prev.dimensions, value]
        : prev.dimensions.filter(dim => dim !== value)
    }));
    
    // Clear validation error for dimensions if it exists
    if (validationErrors.dimensions && checked) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated.dimensions;
        return updated;
      });
    }
  };

  // Create new assessment
  const handleCreateAssessment = () => {
    try {
      // Validate form data
      newAssessmentSchema.parse(newAssessment);
      
      // Create new assessment
      const newId = (assessments.length + 1).toString();
      const createdAssessment: Assessment = {
        id: newId,
        ...newAssessment,
        createdAt: new Date().toISOString(),
        status: 'draft',
        respondents: 0
      };
      
      setAssessments(prev => [...prev, createdAssessment]);
      
      // Reset form and close modal
      setNewAssessment({
        title: '',
        type: 'baseline',
        setting: 'secondary',
        dimensions: [],
        targetGroup: ''
      });
      
      onClose();
      
      toast({
        title: "Assessment created",
        description: "Your new assessment has been created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const errors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
    }
  };

  // View assessment details
  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setActiveTab(1); // Switch to Assessment tab
  };

  // Get status colour
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'grey';
      case 'in-progress': return 'blue';
      case 'completed': return 'green';
      default: return 'grey';
    }
  };

  // Get assessment type label
  const getAssessmentTypeLabel = (type: AssessmentType) => {
    switch (type) {
      case 'baseline': return 'Baseline Assessment';
      case 'process': return 'Process Monitoring';
      case 'short-term': return 'Short-term Outcome';
      case 'long-term': return 'Long-term Impact';
      default: return type;
    }
  };

  // Get setting type label
  const getSettingTypeLabel = (setting: SettingType) => {
    switch (setting) {
      case 'early-years': return 'Early Years';
      case 'primary': return 'Primary';
      case 'secondary': return 'Secondary';
      case 'sen': return 'Special Educational Needs';
      default: return setting;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={6}>Outcome Measurement Tools for Restorative Justice</Heading>
      <Text fontSize="lg" mb={8}>
        Evidence-based tools to assess the effectiveness and impact of restorative approaches in educational settings.
        These comprehensive measurement tools help track outcomes across multiple dimensions, gathering perspectives
        from all stakeholders to provide a holistic view of restorative justice implementation.
      </Text>

      <Tabs variant="enclosed" colorScheme="blue" index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab><HStack><FiBarChart2 /><Text ml={2}>Dashboard</Text></HStack></Tab>
          <Tab><HStack><FiClipboard /><Text ml={2}>Assessments</Text></HStack></Tab>
          <Tab><HStack><FiUsers /><Text ml={2}>Dimensions</Text></HStack></Tab>
          <Tab><HStack><FiFileText /><Text ml={2}>Resources</Text></HStack></Tab>
          <Tab><HStack><FiSettings /><Text ml={2}>Settings</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* Dashboard Tab */}
          <TabPanel>
            <Box mb={8}>
              <Flex justifyContent="space-between" alignItems="centre" mb={6}>
                <Heading as="h2" size="lg">Assessment Dashboard</Heading>
                <Button leftIcon={<FiPlusCircle />} colorScheme="blue" onClick={onOpen}>
                  New Assessment
                </Button>
              </Flex>

              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {assessments.map(assessment => (
                  <Card key={assessment.id} variant="outline" cursor="pointer" onClick={() => handleViewAssessment(assessment)}>
                    <CardHeader pb={2}>
                      <Flex justifyContent="space-between" alignItems="centre">
                        <Heading size="md" noOfLines={1}>{assessment.title}</Heading>
                        <Badge colorScheme={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text colour="grey.600" fontSize="sm" mb={2}>
                        {getAssessmentTypeLabel(assessment.type)} • {getSettingTypeLabel(assessment.setting)}
                      </Text>
                      <Text mb={2}>Target: {assessment.targetGroup}</Text>
                      <Text mb={2}>Dimensions: {assessment.dimensions.length}</Text>
                      <Text fontSize="sm" colour="grey.600">
                        Created: {new Date(assessment.createdAt).toLocaleDateString()}
                      </Text>
                    </CardBody>
                    <CardFooter pt={0}>
                      <Flex width="100%" justifyContent="space-between" alignItems="centre">
                        <Text>{assessment.respondents} respondents</Text>
                        <Button size="sm" rightIcon={<FiEdit />} variant="ghost">
                          View
                        </Button>
                      </Flex>
                    </CardFooter>
                  </Card>
                ))}
              </Grid>

              {assessments.length === 0 && (
                <Box textAlign="centre" py={10} px={6}>
                  <Text fontSize="lg" mb={3}>No assessments created yet</Text>
                  <Button colorScheme="blue" onClick={onOpen}>Create your first assessment</Button>
                </Box>
              )}
            </Box>

            <Divider my={8} />

            <Box mb={8}>
              <Heading as="h2" size="lg" mb={6}>Recent Activity</Heading>
              <Text colour="grey.600">No recent activity to display.</Text>
            </Box>
          </TabPanel>

          {/* Assessments Tab */}
          <TabPanel>
            {selectedAssessment ? (
              <Box>
                <Button leftIcon={<FiBarChart2 />} variant="outline" mb={6} onClick={() => setSelectedAssessment(null)}>
                  Back to All Assessments
                </Button>
                
                <Flex justifyContent="space-between" alignItems="centre" mb={6}>
                  <Heading as="h2" size="lg">{selectedAssessment.title}</Heading>
                  <Badge colorScheme={getStatusColor(selectedAssessment.status)} fontSize="md" px={3} py={1}>
                    {selectedAssessment.status}
                  </Badge>
                </Flex>
                
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={8}>
                  <Card>
                    <CardHeader pb={2}>
                      <Heading size="md">Assessment Details</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex>
                          <Text fontWeight="bold" width="40%">Type:</Text>
                          <Text>{getAssessmentTypeLabel(selectedAssessment.type)}</Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" width="40%">Setting:</Text>
                          <Text>{getSettingTypeLabel(selectedAssessment.setting)}</Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" width="40%">Target Group:</Text>
                          <Text>{selectedAssessment.targetGroup}</Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" width="40%">Created:</Text>
                          <Text>{new Date(selectedAssessment.createdAt).toLocaleDateString()}</Text>
                        </Flex>
                        <Flex>
                          <Text fontWeight="bold" width="40%">Respondents:</Text>
                          <Text>{selectedAssessment.respondents}</Text>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardHeader pb={2}>
                      <Heading size="md">Dimensions</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        {selectedAssessment.dimensions.map(dimId => {
                          const dimension = dimensions.find(d => d.id === dimId);
                          return dimension ? (
                            <Flex key={dimension.id} align="centre">
                              <Box mr={3}>{dimension.icon}</Box>
                              <Text>{dimension.name}</Text>
                            </Flex>
                          ) : null;
                        })}
                      </VStack>
                    </CardBody>
                  </Card>
                </Grid>
                
                <Box mb={8}>
                  <Heading as="h3" size="md" mb={4}>Assessment Tools</Heading>
                  <Accordion allowMultiple>
                    {selectedAssessment.dimensions.map(dimId => {
                      const dimension = dimensions.find(d => d.id === dimId);
                      return dimension ? (
                        <AccordionItem key={dimension.id}>
                          <h2>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <HStack>
                                  <Box>{dimension.icon}</Box>
                                  <Text fontWeight="bold">{dimension.name}</Text>
                                </HStack>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel pb={4}>
                            <VStack align="stretch" spacing={4}>
                              {dimension.tools.map(tool => (
                                <Card key={tool.id} variant="outline">
                                  <CardBody>
                                    <Flex justifyContent="space-between" alignItems="flex-start">
                                      <Box>
                                        <Heading size="sm" mb={2}>{tool.name}</Heading>
                                        <Text mb={2}>{tool.description}</Text>
                                        <HStack spacing={4} mt={2}>
                                          <Badge>{tool.type}</Badge>
                                          <Text fontSize="sm">Time: {tool.timeRequired}</Text>
                                          <Text fontSize="sm">For: {tool.targetAudience.join(', ')}</Text>
                                        </HStack>
                                      </Box>
                                      <Button size="sm" colorScheme="blue">Use Tool</Button>
                                    </Flex>
                                  </CardBody>
                                </Card>
                              ))}
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ) : null;
                    })}
                  </Accordion>
                </Box>
                
                <Box mb={8}>
                  <Heading as="h3" size="md" mb={4}>Progress Tracking</Heading>
                  {selectedAssessment.status === 'draft' ? (
                    <Text colour="grey.600">This assessment has not been started yet.</Text>
                  ) : (
                    <Box>
                      <Text mb={2}>Overall Progress</Text>
                      <Progress 
                        value={selectedAssessment.status === 'completed' ? 100 : 60} 
                        colorScheme={selectedAssessment.status === 'completed' ? 'green' : 'blue'} 
                        mb={4}
                      />
                      
                      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                        <Stat>
                          <StatLabel>Respondents</StatLabel>
                          <StatNumber>{selectedAssessment.respondents}</StatNumber>
                          <StatHelpText>of target group</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Completion Rate</StatLabel>
                          <StatNumber>
                            {selectedAssessment.status === 'completed' ? '100%' : '60%'}
                          </StatNumber>
                          <StatHelpText>of all tools</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Data Quality</StatLabel>
                          <StatNumber>High</StatNumber>
                          <StatHelpText>minimal missing data</StatHelpText>
                        </Stat>
                      </Grid>
                    </Box>
                  )}
                </Box>
                
                <Flex justifyContent="space-between" mt={8}>
                  <Button leftIcon={<FiDownload />} variant="outline">
                    Export Data
                  </Button>
                  <HStack>
                    {selectedAssessment.status === 'draft' && (
                      <Button colorScheme="blue">Start Assessment</Button>
                    )}
                    {selectedAssessment.status === 'in-progress' && (
                      <Button colorScheme="green">Complete Assessment</Button>
                    )}
                    {selectedAssessment.status === 'completed' && (
                      <Button colorScheme="purple">View Report</Button>
                    )}
                  </HStack>
                </Flex>
              </Box>
            ) : (
              <Box>
                <Flex justifyContent="space-between" alignItems="centre" mb={6}>
                  <Heading as="h2" size="lg">All Assessments</Heading>
                  <Button leftIcon={<FiPlusCircle />} colorScheme="blue" onClick={onOpen}>
                    New Assessment
                  </Button>
                </Flex>
                
                <VStack spacing={4} align="stretch">
                  {assessments.map(assessment => (
                    <Card key={assessment.id} variant="outline">
                      <CardBody>
                        <Flex justifyContent="space-between" alignItems="centre">
                          <Box>
                            <Heading size="md" mb={1}>{assessment.title}</Heading>
                            <HStack spacing={4} mb={2}>
                              <Badge colorScheme={getStatusColor(assessment.status)}>{assessment.status}</Badge>
                              <Text fontSize="sm">{getAssessmentTypeLabel(assessment.type)}</Text>
                              <Text fontSize="sm">{getSettingTypeLabel(assessment.setting)}</Text>
                            </HStack>
                            <Text fontSize="sm" colour="grey.600">
                              Created: {new Date(assessment.createdAt).toLocaleDateString()} • 
                              Target: {assessment.targetGroup} • 
                              Respondents: {assessment.respondents}
                            </Text>
                          </Box>
                          <Button 
                            rightIcon={<FiEdit />} 
                            colorScheme="blue" 
                            variant="ghost"
                            onClick={() => handleViewAssessment(assessment)}
                          >
                            View
                          </Button>
                        </Flex>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
                
                {assessments.length === 0 && (
                  <Box textAlign="centre" py={10} px={6}>
                    <Text fontSize="lg" mb={3}>No assessments created yet</Text>
                    <Button colorScheme="blue" onClick={onOpen}>Create your first assessment</Button>
                  </Box>
                )}
              </Box>
            )}
          </TabPanel>

          {/* Dimensions Tab */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={6}>Measurement Dimensions</Heading>
            <Text mb={8}>
              Outcome measurement for restorative justice is organised into six key dimensions, 
              each with specific tools and metrics to provide a comprehensive assessment framework.
            </Text>
            
            <Accordion allowMultiple>
              {dimensions.map(dimension => (
                <AccordionItem key={dimension.id}>
                  <h2>
                    <AccordionButton py={4}>
                      <Box flex="1" textAlign="left">
                        <HStack>
                          <Box fontSize="xl">{dimension.icon}</Box>
                          <Heading size="md">{dimension.name}</Heading>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text mb={4}>{dimension.description}</Text>
                    
                    <Heading size="sm" mb={3}>Available Tools</Heading>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                      {dimension.tools.map(tool => (
                        <Card key={tool.id} variant="outline" height="100%">
                          <CardHeader pb={2}>
                            <Heading size="sm">{tool.name}</Heading>
                          </CardHeader>
                          <CardBody pt={0}>
                            <Text fontSize="sm" mb={3}>{tool.description}</Text>
                            <HStack spacing={2} wrap="wrap">
                              <Badge colorScheme="blue">{tool.type}</Badge>
                              <Text fontSize="xs">Time: {tool.timeRequired}</Text>
                            </HStack>
                          </CardBody>
                          <CardFooter pt={0}>
                            <Text fontSize="xs">For: {tool.targetAudience.join(', ')}</Text>
                          </CardFooter>
                        </Card>
                      ))}
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </TabPanel>

          {/* Resources Tab */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={6}>Resources & Documentation</Heading>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
              <Box>
                <Heading as="h3" size="md" mb={4}>Implementation Guides</Heading>
                <VStack spacing={4} align="stretch">
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Guide for School Leaders</Heading>
                      <Text mb={3}>
                        Comprehensive guide for implementing outcome measurement tools at the school leadership level.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">Download PDF</Button>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Guide for Teachers</Heading>
                      <Text mb={3}>
                        Practical guidance for teachers on using outcome measurement tools in the classroom.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">Download PDF</Button>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Guide for Educational Psychologists</Heading>
                      <Text mb={3}>
                        Specialised guidance for educational psychologists on interpreting and applying measurement data.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">Download PDF</Button>
                    </CardBody>
                  </Card>
                </VStack>
              </Box>
              
              <Box>
                <Heading as="h3" size="md" mb={4}>Evidence Base & Research</Heading>
                <VStack spacing={4} align="stretch">
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Research Foundation</Heading>
                      <Text mb={3}>
                        Overview of the research and evidence base supporting the outcome measurement tools.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">View Document</Button>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Validated Assessment Tools</Heading>
                      <Text mb={3}>
                        Information on the validated assessment instruments used in the measurement framework.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">View Document</Button>
                    </CardBody>
                  </Card>
                  
                  <Card variant="outline">
                    <CardBody>
                      <Heading size="sm" mb={2}>Case Studies</Heading>
                      <Text mb={3}>
                        Real-world examples of schools using outcome measurement tools for restorative justice.
                      </Text>
                      <Button rightIcon={<FiDownload />} size="sm">View Document</Button>
                    </CardBody>
                  </Card>
                </VStack>
              </Box>
            </Grid>
            
            <Box mt={8}>
              <Heading as="h3" size="md" mb={4}>Additional Resources</Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                <Card variant="outline">
                  <CardBody>
                    <Heading size="sm" mb={2}>Data Analysis Templates</Heading>
                    <Text>Spreadsheet templates for analysing assessment data.</Text>
                  </CardBody>
                </Card>
                
                <Card variant="outline">
                  <CardBody>
                    <Heading size="sm" mb={2}>Presentation Materials</Heading>
                    <Text>Slides and handouts for presenting measurement outcomes.</Text>
                  </CardBody>
                </Card>
                
                <Card variant="outline">
                  <CardBody>
                    <Heading size="sm" mb={2}>Training Videos</Heading>
                    <Text>Video tutorials on using the outcome measurement tools.</Text>
                  </CardBody>
                </Card>
              </Grid>
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <Heading as="h2" size="lg" mb={6}>Settings & Preferences</Heading>
            
            <Card variant="outline" mb={6}>
              <CardHeader>
                <Heading size="md">Assessment Settings</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Default Assessment Type</FormLabel>
                    <Select defaultValue="baseline">
                      <option value="baseline">Baseline Assessment</option>
                      <option value="process">Process Monitoring</option>
                      <option value="short-term">Short-term Outcome</option>
                      <option value="long-term">Long-term Impact</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Default Educational Setting</FormLabel>
                    <Select defaultValue="secondary">
                      <option value="early-years">Early Years</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="sen">Special Educational Needs</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Data Retention Period</FormLabel>
                    <Select defaultValue="5years">
                      <option value="1year">1 Year</option>
                      <option value="3years">3 Years</option>
                      <option value="5years">5 Years</option>
                      <option value="indefinite">Indefinite</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="outline" mb={6}>
              <CardHeader>
                <Heading size="md">Notification Preferences</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="centre">
                    <FormLabel mb="0">
                      Email notifications for assessment completion
                    </FormLabel>
                    <Switch colorScheme="blue" defaultChecked />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="centre">
                    <FormLabel mb="0">
                      Reminder notifications for in-progress assessments
                    </FormLabel>
                    <Switch colorScheme="blue" defaultChecked />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="centre">
                    <FormLabel mb="0">
                      Notifications for new assessment tools
                    </FormLabel>
                    <Switch colorScheme="blue" />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
            
            <Card variant="outline">
              <CardHeader>
                <Heading size="md">Data Sharing & Privacy</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="centre">
                    <FormLabel mb="0">
                      Allow anonymized data for research purposes
                    </FormLabel>
                    <Switch colorScheme="blue" />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="centre">
                    <FormLabel mb="0">
                      Share assessment templates with other schools
                    </FormLabel>
                    <Switch colorScheme="blue" />
                  </FormControl>
                  
                  <Text fontSize="sm" colour="grey.600" mt={2}>
                    All data is processed in accordance with UK GDPR requirements and the Department for Education guidelines.
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* New Assessment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Assessment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired isInvalid={!!validationErrors.title}>
                <FormLabel>Assessment Title</FormLabel>
                <Input 
                  name="title"
                  value={newAssessment.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Baseline Assessment - Oakwood Secondary"
                />
                {validationErrors.title && (
                  <Text colour="red.500" fontSize="sm">{validationErrors.title}</Text>
                )}
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Assessment Type</FormLabel>
                <Select 
                  name="type"
                  value={newAssessment.type}
                  onChange={handleInputChange}
                >
                  <option value="baseline">Baseline Assessment</option>
                  <option value="process">Process Monitoring</option>
                  <option value="short-term">Short-term Outcome</option>
                  <option value="long-term">Long-term Impact</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Educational Setting</FormLabel>
                <Select 
                  name="setting"
                  value={newAssessment.setting}
                  onChange={handleInputChange}
                >
                  <option value="early-years">Early Years</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="sen">Special Educational Needs</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired isInvalid={!!validationErrors.dimensions}>
                <FormLabel>Measurement Dimensions</FormLabel>
                <Text fontSize="sm" colour="grey.600" mb={2}>
                  Select the dimensions you want to include in this assessment
                </Text>
                <VStack align="start" spacing={2}>
                  {dimensions.map(dimension => (
                    <Checkbox 
                      key={dimension.id}
                      value={dimension.id}
                      isChecked={newAssessment.dimensions.includes(dimension.id)}
                      onChange={handleDimensionChange}
                    >
                      <HStack>
                        <Box>{dimension.icon}</Box>
                        <Text>{dimension.name}</Text>
                      </HStack>
                    </Checkbox>
                  ))}
                </VStack>
                {validationErrors.dimensions && (
                  <Text colour="red.500" fontSize="sm">{validationErrors.dimensions}</Text>
                )}
              </FormControl>
              
              <FormControl isRequired isInvalid={!!validationErrors.targetGroup}>
                <FormLabel>Target Group</FormLabel>
                <Input 
                  name="targetGroup"
                  value={newAssessment.targetGroup}
                  onChange={handleInputChange}
                  placeholder="e.g., Year 8 Students, All Staff, etc."
                />
                {validationErrors.targetGroup && (
                  <Text colour="red.500" fontSize="sm">{validationErrors.targetGroup}</Text>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleCreateAssessment}>
              Create Assessment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
