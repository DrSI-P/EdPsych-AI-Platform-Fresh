'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  PlusCircle, MinusCircle, Save, Play, Settings, HelpCircle, 
  ChevronRight, ChevronDown, Edit, Trash2, Copy, Check, X
} from 'lucide-react';

import { 
  DiagnosticAssessment, 
  DiagnosticQuestion,
  DiagnosticAssessmentTemplate,
  KnowledgeArea,
  Skill,
  ProficiencyLevel
} from '@/lib/assessment/diagnosticAssessmentTypes';
import { UKKeyStage, UKSubject, DifficultyLevel, CognitiveDomain, QuestionType } from '@/lib/assessment/types';

interface DiagnosticAssessmentCreatorProps {
  initialAssessment?: DiagnosticAssessment;
  knowledgeAreas: KnowledgeArea[];
  skills: Skill[];
  onSave?: (assessment: DiagnosticAssessment) => void;
  onPreview?: (assessment: DiagnosticAssessment) => void;
  className?: string;
}

export function DiagnosticAssessmentCreator({
  initialAssessment,
  knowledgeAreas,
  skills,
  onSave,
  onPreview,
  className = ''
}: DiagnosticAssessmentCreatorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('details');
  const [assessment, setAssessment] = useState<Partial<DiagnosticAssessment>>(
    initialAssessment || {
      title: '',
      description: '',
      subject: UKSubject.ENGLISH,
      keyStage: UKKeyStage.KS2,
      targetAgeRange: [7, 11],
      knowledgeAreas: [],
      skills: [],
      questions: [],
      estimatedDuration: 30,
      status: 'draft',
      metadata: {
        author: '',
        tags: [],
        curriculumReferences: []
      }
    }
  );

  // Update target age range when key stage changes
  useEffect(() => {
    if (assessment.keyStage) {
      setAssessment(prev => ({
        ...prev,
        targetAgeRange: getAgeRangeForKeyStage(assessment.keyStage!)
      }));
    }
  }, [assessment.keyStage]);

  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setAssessment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle knowledge area selection
  const handleKnowledgeAreaChange = (selectedIds: string[]) => {
    setAssessment(prev => ({
      ...prev,
      knowledgeAreas: selectedIds
    }));
  };

  // Handle skill selection
  const handleSkillChange = (selectedIds: string[]) => {
    setAssessment(prev => ({
      ...prev,
      skills: selectedIds
    }));
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    const newQuestion: DiagnosticQuestion = {
      id: `q-${Date.now()}`,
      text: '',
      type: QuestionType.MULTIPLE_CHOICE,
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      difficultyLevel: DifficultyLevel.INTERMEDIATE,
      cognitiveDomain: CognitiveDomain.KNOWLEDGE,
      knowledgeAreaIds: assessment.knowledgeAreas?.slice(0, 1) || [],
      skillIds: assessment.skills?.slice(0, 1) || [],
      timeEstimate: 60,
      metadata: {}
    };

    setAssessment(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  // Handle updating a question
  const handleUpdateQuestion = (index: number, updatedQuestion: DiagnosticQuestion) => {
    setAssessment(prev => {
      const updatedQuestions = [...(prev.questions || [])];
      updatedQuestions[index] = updatedQuestion;
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Handle removing a question
  const handleRemoveQuestion = (index: number) => {
    setAssessment(prev => {
      const updatedQuestions = [...(prev.questions || [])];
      updatedQuestions.splice(index, 1);
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Handle adaptive settings change
  const handleAdaptiveSettingsChange = (settings: DiagnosticAssessment['adaptiveSettings']) => {
    setAssessment(prev => ({
      ...prev,
      adaptiveSettings: settings
    }));
  };

  // Handle metadata changes
  const handleMetadataChange = (metadata: DiagnosticAssessment['metadata']) => {
    setAssessment(prev => ({
      ...prev,
      metadata
    }));
  };

  // Handle save
  const handleSave = () => {
    // Validate assessment
    if (!assessment.title) {
      toast({
        title: 'Validation Error',
        description: 'Assessment title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!assessment.questions || assessment.questions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Assessment must have at least one question',
        variant: 'destructive'
      });
      return;
    }

    // Call onSave callback with the assessment
    onSave?.(assessment as DiagnosticAssessment);
    
    toast({
      title: 'Assessment Saved',
      description: 'The diagnostic assessment has been saved successfully',
      variant: 'default'
    });
  };

  // Handle preview
  const handlePreview = () => {
    // Validate assessment
    if (!assessment.title) {
      toast({
        title: 'Validation Error',
        description: 'Assessment title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!assessment.questions || assessment.questions.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Assessment must have at least one question',
        variant: 'destructive'
      });
      return;
    }

    // Call onPreview callback with the assessment
    onPreview?.(assessment as DiagnosticAssessment);
  };

  // Helper function to get age range for key stage
  const getAgeRangeForKeyStage = (keyStage: UKKeyStage): [number, number] => {
    switch (keyStage) {
      case UKKeyStage.EYFS:
        return [3, 5];
      case UKKeyStage.KS1:
        return [5, 7];
      case UKKeyStage.KS2:
        return [7, 11];
      case UKKeyStage.KS3:
        return [11, 14];
      case UKKeyStage.KS4:
        return [14, 16];
      case UKKeyStage.KS5:
        return [16, 18];
      default:
        return [5, 18];
    }
  };

  // Render the details tab
  const renderDetailsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Assessment Title</Label>
          <Input
            id="title"
            name="title"
            value={assessment.title || ''}
            onChange={handleChange}
            placeholder="Enter assessment title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={assessment.description || ''}
            onChange={handleChange}
            placeholder="Enter assessment description"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={assessment.subject}
              onValueChange={(value) => handleSelectChange('subject', value)}
            >
              <SelectTrigger id="subject" className="mt-1">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UKSubject).map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="keyStage">Key Stage</Label>
            <Select
              value={assessment.keyStage}
              onValueChange={(value) => handleSelectChange('keyStage', value)}
            >
              <SelectTrigger id="keyStage" className="mt-1">
                <SelectValue placeholder="Select key stage" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UKKeyStage).map((keyStage) => (
                  <SelectItem key={keyStage} value={keyStage}>
                    {keyStage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
          <div className="flex items-center space-x-4 mt-1">
            <Slider
              id="estimatedDuration"
              min={5}
              max={120}
              step={5}
              value={[assessment.estimatedDuration || 30]}
              onValueChange={(value) => handleSelectChange('estimatedDuration', value[0].toString())}
              className="flex-1"
            />
            <span className="w-12 text-center">{assessment.estimatedDuration || 30}</span>
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={assessment.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status" className="mt-1">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  // Render the knowledge areas tab
  const renderKnowledgeAreasTab = () => {
    // Filter knowledge areas by selected subject and key stage
    const filteredKnowledgeAreas = knowledgeAreas.filter(
      ka => ka.subject === assessment.subject && ka.keyStage === assessment.keyStage
    );

    return (
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Selected Knowledge Areas</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {assessment.knowledgeAreas?.length ? (
              assessment.knowledgeAreas.map(kaId => {
                const ka = knowledgeAreas.find(k => k.id === kaId);
                return (
                  <Badge key={kaId} variant="secondary" className="flex items-center gap-1">
                    {ka?.name || kaId}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleKnowledgeAreaChange(
                        (assessment.knowledgeAreas || []).filter(id => id !== kaId)
                      )}
                    />
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No knowledge areas selected</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Available Knowledge Areas</h3>
          {filteredKnowledgeAreas.length > 0 ? (
            filteredKnowledgeAreas.map(ka => (
              <Card key={ka.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <h4 className="font-medium">{ka.name}</h4>
                    <p className="text-sm text-muted-foreground">{ka.description}</p>
                  </div>
                  <Button
                    variant={assessment.knowledgeAreas?.includes(ka.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      const isSelected = assessment.knowledgeAreas?.includes(ka.id);
                      if (isSelected) {
                        handleKnowledgeAreaChange(
                          (assessment.knowledgeAreas || []).filter(id => id !== ka.id)
                        );
                      } else {
                        handleKnowledgeAreaChange([...(assessment.knowledgeAreas || []), ka.id]);
                      }
                    }}
                  >
                    {assessment.knowledgeAreas?.includes(ka.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Select
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No knowledge areas available for the selected subject and key stage</p>
          )}
        </div>
      </div>
    );
  };

  // Render the skills tab
  const renderSkillsTab = () => {
    // Filter skills by selected key stage
    const filteredSkills = skills.filter(skill => 
      skill.developmentalStages.some(stage => stage.keyStage === assessment.keyStage)
    );

    return (
      <div className="space-y-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Selected Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {assessment.skills?.length ? (
              assessment.skills.map(skillId => {
                const skill = skills.find(s => s.id === skillId);
                return (
                  <Badge key={skillId} variant="secondary" className="flex items-center gap-1">
                    {skill?.name || skillId}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleSkillChange(
                        (assessment.skills || []).filter(id => id !== skillId)
                      )}
                    />
                  </Badge>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">No skills selected</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Available Skills</h3>
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <Card key={skill.id} className="overflow-hidden">
                <div className="flex items-center p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{skill.name}</h4>
                      <Badge>{skill.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{skill.description}</p>
                  </div>
                  <Button
                    variant={assessment.skills?.includes(skill.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      const isSelected = assessment.skills?.includes(skill.id);
                      if (isSelected) {
                        handleSkillChange(
                          (assessment.skills || []).filter(id => id !== skill.id)
                        );
                      } else {
                        handleSkillChange([...(assessment.skills || []), skill.id]);
                      }
                    }}
                  >
                    {assessment.skills?.includes(skill.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Select
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No skills available for the selected key stage</p>
          )}
        </div>
      </div>
    );
  };

  // Render the questions tab
  const renderQuestionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Questions ({assessment.questions?.length || 0})</h3>
        <Button onClick={handleAddQuestion}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {assessment.questions?.length ? (
        <div className="space-y-6">
          {assessment.questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              index={index}
              knowledgeAreas={knowledgeAreas.filter(ka => assessment.knowledgeAreas?.includes(ka.id))}
              skills={skills.filter(skill => assessment.skills?.includes(skill.id))}
              onUpdate={(updatedQuestion) => handleUpdateQuestion(index, updatedQuestion)}
              onRemove={() => handleRemoveQuestion(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No questions added yet</p>
          <Button variant="outline" className="mt-4" onClick={handleAddQuestion}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Question
          </Button>
        </div>
      )}
    </div>
  );

  // Render the settings tab
  const renderSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Adaptive Assessment Settings</CardTitle>
          <CardDescription>
            Configure how the assessment adapts to student responses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="adaptiveEnabled">Enable Adaptive Assessment</Label>
                <p className="text-sm text-muted-foreground">
                  Adjusts question difficulty based on student performance
                </p>
              </div>
              <Switch
                id="adaptiveEnabled"
                checked={assessment.adaptiveSettings?.enabled || false}
                onCheckedChange={(checked) => handleAdaptiveSettingsChange({
                  ...(assessment.adaptiveSettings || {}),
                  enabled: checked,
                  initialDifficulty: assessment.adaptiveSettings?.initialDifficulty || DifficultyLevel.INTERMEDIATE,
                  adjustmentThreshold: assessment.adaptiveSettings?.adjustmentThreshold || 70,
                  maxQuestions: assessment.adaptiveSettings?.maxQuestions || 20,
                  terminationCriteria: assessment.adaptiveSettings?.terminationCriteria || 'fixedLength',
                  terminationValue: assessment.adaptiveSettings?.terminationValue || 20
                })}
              />
            </div>

            {assessment.adaptiveSettings?.enabled && (
              <>
                <div>
                  <Label htmlFor="initialDifficulty">Initial Difficulty</Label>
                  <Select
                    value={assessment.adaptiveSettings.initialDifficulty || DifficultyLevel.INTERMEDIATE}
                    onValueChange={(value) => handleAdaptiveSettingsChange({
                      ...assessment.adaptiveSettings,
                      initialDifficulty: value as DifficultyLevel
                    })}
                  >
                    <SelectTrigger id="initialDifficulty" className="mt-1">
                      <SelectValue placeholder="Select initial difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DifficultyLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adjustmentThreshold">
                    Adjustment Threshold (%)
                  </Label>
                  <div className="flex items-center space-x-4 mt-1">
                    <Slider
                      id="adjustmentThreshold"
                      min={50}
                      max={90}
                      step={5}
                      value={[assessment.adaptiveSettings.adjustmentThreshold || 70]}
                      onValueChange={(value) => handleAdaptiveSettingsChange({
                        ...assessment.adaptiveSettings,
                        adjustmentThreshold: value[0]
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">
                      {assessment.adaptiveSettings.adjustmentThreshold || 70}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Difficulty increases when score exceeds this threshold
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxQuestions">Maximum Questions</Label>
                  <div className="flex items-center space-x-4 mt-1">
                    <Slider
                      id="maxQuestions"
                      min={5}
                      max={50}
                      step={5}
                      value={[assessment.adaptiveSettings.maxQuestions || 20]}
                      onValueChange={(value) => handleAdaptiveSettingsChange({
                        ...assessment.adaptiveSettings,
                        maxQuestions: value[0]
                      })}
                      className="flex-1"
                    />
                    <span className="w-12 text-center">
                      {assessment.adaptiveSettings.maxQuestions || 20}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="terminationCriteria">Termination Criteria</Label>
                  <Select
                    value={assessment.adaptiveSettings.terminationCriteria || 'fixedLength'}
                    onValueChange={(value) => handleAdaptiveSettingsChange({
                      ...assessment.adaptiveSettings,
                      terminationCriteria: value as 'fixedLength' | 'precisionThreshold' | 'confidenceLevel'
                    })}
                  >
                    <SelectTrigger id="terminationCriteria" className="mt-1">
                      <SelectValue placeholder="Select termination criteria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixedLength">Fixed Length</SelectItem>
                      <SelectItem value="precisionThreshold">Precision Threshold</SelectItem>
                      <SelectItem value="confidenceLevel">Confidence Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>
            Additional information about the assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={assessment.metadata?.author || ''}
                onChange={(e) => handleMetadataChange({
                  ...(assessment.metadata || {}),
                  author: e.target.value
                })}
                placeholder="Enter author name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={(assessment.metadata?.tags || []).join(', ')}
                onChange={(e) => handleMetadataChange({
                  ...(assessment.metadata || {}),
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="Enter tags"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="curriculumReferences">Curriculum References (comma separated)</Label>
              <Input
                id="curriculumReferences"
                value={(assessment.metadata?.curriculumReferences || []).join(', ')}
                onChange={(e) => handleMetadataChange({
                  ...(assessment.metadata || {}),
                  curriculumReferences: e.target.value.split(',').map(ref => ref.trim()).filter(Boolean)
                })}
                placeholder="Enter curriculum references"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Assessment Creator</CardTitle>
          <CardDescription>
            Create comprehensive diagnostic assessments aligned with UK curriculum standards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="knowledgeAreas">Knowledge Areas</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="details">{renderDetailsTab()}</TabsContent>
            <TabsContent value="knowledgeAreas">{renderKnowledgeAreasTab()}</TabsContent>
            <TabsContent value="skills">{renderSkillsTab()}</TabsContent>
            <TabsContent value="questions">{renderQuestionsTab()}</TabsContent>
            <TabsContent value="settings">{renderSettingsTab()}</TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePreview}>
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Assessment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Question Editor Component
interface QuestionEditorProps {
  question: DiagnosticQuestion;
  index: number;
  knowledgeAreas: KnowledgeArea[];
  skills: Skill[];
  onUpdate: (question: DiagnosticQuestion) => void;
  onRemove: () => void;
}

function QuestionEditor({
  question,
  index,
  knowledgeAreas,
  skills,
  onUpdate,
  onRemove
}: QuestionEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle question text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...question,
      text: e.target.value
    });
  };

  // Handle question type change
  const handleTypeChange = (value: string) => {
    const newType = value as QuestionType;
    let options: string[] | undefined;
    let correctAnswer: string | string[] | undefined;

    // Reset options and correct answer based on question type
    switch (newType) {
      case QuestionType.MULTIPLE_CHOICE:
        options = ['', '', '', ''];
        correctAnswer = '';
        break;
      case QuestionType.TRUE_FALSE:
        options = ['True', 'False'];
        correctAnswer = '';
        break;
      case QuestionType.MATCHING:
        options = ['', ''];
        correctAnswer = ['', ''];
        break;
      default:
        options = undefined;
        correctAnswer = '';
    }

    onUpdate({
      ...question,
      type: newType,
      options,
      correctAnswer
    });
  };

  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;

    const newOptions = [...question.options];
    newOptions[index] = value;

    onUpdate({
      ...question,
      options: newOptions
    });
  };

  // Handle adding an option
  const handleAddOption = () => {
    if (!question.options) return;

    onUpdate({
      ...question,
      options: [...question.options, '']
    });
  };

  // Handle removing an option
  const handleRemoveOption = (index: number) => {
    if (!question.options || question.options.length <= 2) return;

    const newOptions = [...question.options];
    newOptions.splice(index, 1);

    onUpdate({
      ...question,
      options: newOptions
    });
  };

  // Handle correct answer change
  const handleCorrectAnswerChange = (value: string) => {
    onUpdate({
      ...question,
      correctAnswer: value
    });
  };

  // Handle points change
  const handlePointsChange = (value: number) => {
    onUpdate({
      ...question,
      points: value
    });
  };

  // Handle difficulty level change
  const handleDifficultyChange = (value: string) => {
    onUpdate({
      ...question,
      difficultyLevel: value as DifficultyLevel
    });
  };

  // Handle cognitive domain change
  const handleCognitiveDomainChange = (value: string) => {
    onUpdate({
      ...question,
      cognitiveDomain: value as CognitiveDomain
    });
  };

  // Handle knowledge area selection
  const handleKnowledgeAreaChange = (selectedIds: string[]) => {
    onUpdate({
      ...question,
      knowledgeAreaIds: selectedIds
    });
  };

  // Handle skill selection
  const handleSkillChange = (selectedIds: string[]) => {
    onUpdate({
      ...question,
      skillIds: selectedIds
    });
  };

  // Handle time estimate change
  const handleTimeEstimateChange = (value: number) => {
    onUpdate({
      ...question,
      timeEstimate: value
    });
  };

  // Render question options based on type
  const renderQuestionOptions = () => {
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.TRUE_FALSE:
        return (
          <div className="space-y-3 mt-4">
            <Label>Options</Label>
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1"
                />
                {question.type === QuestionType.MULTIPLE_CHOICE && question.options && question.options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(i)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {question.type === QuestionType.MULTIPLE_CHOICE && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-2"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
            <div className="mt-4">
              <Label htmlFor={`correctAnswer-${index}`}>Correct Answer</Label>
              <Select
                value={question.correctAnswer as string}
                onValueChange={handleCorrectAnswerChange}
              >
                <SelectTrigger id={`correctAnswer-${index}`} className="mt-1">
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {question.options?.map((option, i) => (
                    <SelectItem key={i} value={option}>
                      {option || `Option ${i + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case QuestionType.SHORT_ANSWER:
      case QuestionType.ESSAY:
        return (
          <div className="mt-4">
            <Label htmlFor={`correctAnswer-${index}`}>Sample Answer / Marking Guide</Label>
            <Textarea
              id={`correctAnswer-${index}`}
              value={question.correctAnswer as string || ''}
              onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              placeholder="Enter sample answer or marking guide"
              className="mt-1"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Question {index + 1}</span>
            <Badge variant="outline">{question.type}</Badge>
            <Badge>{question.difficultyLevel}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`questionText-${index}`}>Question Text</Label>
            <Textarea
              id={`questionText-${index}`}
              value={question.text}
              onChange={handleTextChange}
              placeholder="Enter question text"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`questionType-${index}`}>Question Type</Label>
              <Select
                value={question.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id={`questionType-${index}`} className="mt-1">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(QuestionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor={`points-${index}`}>Points</Label>
              <div className="flex items-center space-x-4 mt-1">
                <Slider
                  id={`points-${index}`}
                  min={1}
                  max={10}
                  step={1}
                  value={[question.points]}
                  onValueChange={(value) => handlePointsChange(value[0])}
                  className="flex-1"
                />
                <span className="w-8 text-center">{question.points}</span>
              </div>
            </div>
          </div>

          {renderQuestionOptions()}

          {isExpanded && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`difficulty-${index}`}>Difficulty Level</Label>
                  <Select
                    value={question.difficultyLevel}
                    onValueChange={handleDifficultyChange}
                  >
                    <SelectTrigger id={`difficulty-${index}`} className="mt-1">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DifficultyLevel).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`cognitiveDomain-${index}`}>Cognitive Domain</Label>
                  <Select
                    value={question.cognitiveDomain}
                    onValueChange={handleCognitiveDomainChange}
                  >
                    <SelectTrigger id={`cognitiveDomain-${index}`} className="mt-1">
                      <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(CognitiveDomain).map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor={`timeEstimate-${index}`}>Time Estimate (seconds)</Label>
                <div className="flex items-center space-x-4 mt-1">
                  <Slider
                    id={`timeEstimate-${index}`}
                    min={10}
                    max={300}
                    step={10}
                    value={[question.timeEstimate]}
                    onValueChange={(value) => handleTimeEstimateChange(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{question.timeEstimate}</span>
                </div>
              </div>

              <div>
                <Label>Knowledge Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {knowledgeAreas.map((ka) => (
                    <Badge
                      key={ka.id}
                      variant={question.knowledgeAreaIds.includes(ka.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const isSelected = question.knowledgeAreaIds.includes(ka.id);
                        if (isSelected) {
                          handleKnowledgeAreaChange(
                            question.knowledgeAreaIds.filter(id => id !== ka.id)
                          );
                        } else {
                          handleKnowledgeAreaChange([...question.knowledgeAreaIds, ka.id]);
                        }
                      }}
                    >
                      {ka.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={question.skillIds.includes(skill.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const isSelected = question.skillIds.includes(skill.id);
                        if (isSelected) {
                          handleSkillChange(
                            question.skillIds.filter(id => id !== skill.id)
                          );
                        } else {
                          handleSkillChange([...question.skillIds, skill.id]);
                        }
                      }}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
