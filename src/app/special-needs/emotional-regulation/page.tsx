'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmotionalRegulationEngine from '@/components/special-needs/emotional-regulation/emotional-regulation-engine';

export default function EmotionalRegulationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Emotional Regulation Support</h1>
      
      <Tabs defaultValue="tool" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tool">Emotional Regulation Tool</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="research">Research & Evidence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tool" className="py-4">
          <EmotionalRegulationEngine />
        </TabsContent>
        
        <TabsContent value="about" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>About Emotional Regulation Support</CardTitle>
              <CardDescription>
                Understanding and supporting emotional regulation in educational settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">What is Emotional Regulation?</h3>
              <p>
                Emotional regulation refers to the ability to effectively manage and respond to emotional experiences. 
                It involves recognising emotions, understanding their intensity and impact, and developing strategies 
                to manage them appropriately. This skill is crucial for academic success, social relationships, and 
                overall wellbeing.
              </p>
              
              <h3 className="text-xl font-semibold mt-6">Why is Emotional Regulation Important?</h3>
              <p>
                Students with strong emotional regulation skills are better able to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Focus and engage in learning activities</li>
                <li>Manage stress and anxiety during challenging tasks</li>
                <li>Navigate social interactions successfully</li>
                <li>Respond appropriately to feedback and setbacks</li>
                <li>Develop resilience and positive mental health</li>
                <li>Transition between activities and settings</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Who Benefits from Emotional Regulation Support?</h3>
              <p>
                While all students benefit from developing emotional regulation skills, this tool is particularly 
                helpful for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Students with autism spectrum conditions who may experience emotional dysregulation</li>
                <li>Children with ADHD who may have difficulty managing emotional impulses</li>
                <li>Students with anxiety or mood disorders</li>
                <li>Young people experiencing stress or trauma</li>
                <li>Any student navigating challenging situations or transitions</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Features of Our Emotional Regulation Support</h3>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Emotion Identification:</strong> Tools to help students recognise and name their emotions</li>
                <li><strong>Intensity Tracking:</strong> Visual scales to gauge emotion intensity</li>
                <li><strong>Body Awareness:</strong> Activities to connect emotions with physical sensations</li>
                <li><strong>Strategy Library:</strong> Evidence-based techniques for managing different emotions</li>
                <li><strong>Emotion Journal:</strong> Space for reflection and pattern recognition</li>
                <li><strong>Progress Monitoring:</strong> Track emotional regulation development over time</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">How to Use This Tool</h3>
              <p>
                This tool can be used in various ways depending on student needs:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Proactive Support:</strong> Regular check-ins to build emotional vocabulary and awareness</li>
                <li><strong>In-the-Moment Intervention:</strong> When a student is experiencing emotional challenges</li>
                <li><strong>Reflective Practise:</strong> After emotional events to build understanding</li>
                <li><strong>Skill Building:</strong> As part of a structured social-emotional learning curriculum</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="research" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Research & Evidence Base</CardTitle>
              <CardDescription>
                The science behind our emotional regulation support tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">Evidence-Based Approach</h3>
              <p>
                Our emotional regulation support tools are grounded in research from educational psychology, 
                neuroscience, and therapeutic approaches. We've integrated evidence-based practices from:
              </p>
              
              <div className="mt-4 space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold">Cognitive-Behavioural Therapy (CBT)</h4>
                  <p>
                    CBT approaches to emotional regulation focus on the connection between thoughts, feelings, 
                    and behaviours. Our tools incorporate cognitive restructuring and behavioural strategies 
                    recommended by the National Institute for Health and Care Excellence (NICE) guidelines.
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold">Dialectical Behaviour Therapy (DBT)</h4>
                  <p>
                    We've adapted key emotional regulation skills from DBT, which has strong evidence for 
                    supporting emotional regulation. These include mindfulness practices, distress tolerance, 
                    and emotional awareness techniques.
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold">Zones of Regulation®</h4>
                  <p>
                    Our approach is influenced by the Zones of Regulation framework, a systematic, cognitive-behavioural 
                    approach used to teach self-regulation by categorizing emotions into four coloured zones.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold">Polyvagal Theory</h4>
                  <p>
                    Our body awareness components are informed by Polyvagal Theory, which explains the connection 
                    between the autonomic nervous system and emotional states, helping students understand 
                    physiological responses to emotions.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-semibold">UK Educational Psychology Research</h4>
                  <p>
                    Our approach aligns with recommendations from the British Psychological Society and 
                    educational psychology research specific to UK educational contexts.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-6">Key Research Findings</h3>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  Research by the Education Endowment Foundation shows that social and emotional learning 
                  interventions have an identifiable and valuable impact on attitudes to learning and social 
                  relationships in school.
                </li>
                <li>
                  Studies published in the British Journal of Educational Psychology demonstrate that 
                  emotional regulation skills are strongly correlated with academic achievement and classroom behaviour.
                </li>
                <li>
                  Research from University College London indicates that explicit teaching of emotional 
                  vocabulary and regulation strategies can significantly improve students' ability to manage 
                  challenging emotions.
                </li>
                <li>
                  A meta-analysis in the Journal of Child Psychology and Psychiatry found that emotional 
                  regulation interventions show moderate to large effects for children with neurodevelopmental 
                  conditions.
                </li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6">Alignment with UK Educational Standards</h3>
              <p>
                Our emotional regulation support tools align with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <strong>PSHE Association Guidelines</strong> for teaching about mental wellbeing and emotional health
                </li>
                <li>
                  <strong>Department for Education's</strong> guidance on mental health and behaviour in schools
                </li>
                <li>
                  <strong>SEND Code of Practise</strong> recommendations for supporting social, emotional and mental health needs
                </li>
                <li>
                  <strong>Ofsted's</strong> personal development framework, which emphasizes resilience and emotional wellbeing
                </li>
              </ul>
              
              <div className="bg-grey-100 p-4 rounded-md mt-6">
                <h3 className="text-lg font-semibold">References</h3>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-sm">
                  <li>Department for Education (2018). Mental health and behaviour in schools. London: DfE.</li>
                  <li>Education Endowment Foundation (2019). Social and Emotional Learning: Evidence Review. London: EEF.</li>
                  <li>British Psychological Society (2021). Psychological perspectives on supporting emotional regulation in educational settings. Leicester: BPS.</li>
                  <li>Durlak, J.A., Weissberg, R.P., Dymnicki, A.B., Taylor, R.D. & Schellinger, K.B. (2011). The impact of enhancing students' social and emotional learning: A meta-analysis of school-based universal interventions. Child Development, 82(1), 405-432.</li>
                  <li>NHS England (2021). Mental Health of Children and Young People in England, 2021: Wave 2 follow up to the 2017 survey. NHS Digital.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
