'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Info, BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InterventionAnalyticsEngine } from '@/components/special-needs/intervention-analytics/intervention-analytics-engine';

export default function InterventionAnalyticsPage(): React.ReactNode {
  const [activeTab, setActiveTab] = useState('analytics');
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Intervention Effectiveness Analytics</h1>
        <p className="text-muted-foreground">
          Analyse and compare the effectiveness of different interventions across learning profiles
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="about">About &amp; Research</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          <InterventionAnalyticsEngine className="w-full" />
        </TabsContent>
        
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre gap-2">
                <Info className="h-5 w-5" />
                About Intervention Effectiveness Analytics
              </CardTitle>
              <CardDescription>
                Evidence-based approach to measuring and comparing intervention outcomes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">What is Intervention Effectiveness Analytics?</h3>
                <p>
                  Intervention Effectiveness Analytics is a comprehensive system for measuring, analysing, and comparing 
                  the impact of different educational interventions across various learning profiles. This evidence-based 
                  approach helps educators make data-informed decisions about which interventions are most effective for 
                  specific learning needs, allowing for personalized and optimised support strategies.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Comparative Analysis:</span> Compare effectiveness across different 
                    intervention types and learning profiles to identify optimal matches.
                  </li>
                  <li>
                    <span className="font-medium">Statistical Significance:</span> Determine which interventions show 
                    statistically significant results, filtering out random variations.
                  </li>
                  <li>
                    <span className="font-medium">Progress Visualisation:</span> Track individual and group progress 
                    over time with interactive charts and graphs.
                  </li>
                  <li>
                    <span className="font-medium">Evidence-Based Recommendations:</span> Receive data-driven suggestions 
                    for intervention adjustments and optimizations.
                  </li>
                  <li>
                    <span className="font-medium">Comprehensive Reporting:</span> Generate detailed reports for educational 
                    reviews, parent meetings, and professional development.
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Research Foundation</h3>
                <p>
                  Our approach to intervention effectiveness analysis is grounded in established research methodologies 
                  and evidence-based practices from the fields of educational psychology, special education, and data science.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-centre gap-2">
                        <BookOpen className="h-4 w-4" />
                        Education Endowment Foundation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Our effectiveness metrics are aligned with the EEF&apos;s Teaching and Learning Toolkit, which 
                        synthesizes international research to provide evidence-based guidance on educational interventions.
                      </p>
                      <Badge variant="outline" className="mt-2">Evidence Strength: High</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-centre gap-2">
                        <BookOpen className="h-4 w-4" />
                        What Works Clearinghouse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Our statistical methods follow the rigorous standards established by the WWC for evaluating 
                        the effectiveness of educational interventions.
                      </p>
                      <Badge variant="outline" className="mt-2">Evidence Strength: High</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-centre gap-2">
                        <BookOpen className="h-4 w-4" />
                        SEND Code of Practise
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Our analytics framework supports the graduated approach (Assess, Plan, Do, Review) outlined 
                        in the UK SEND Code of Practise, providing tools for each stage of the cycle.
                      </p>
                      <Badge variant="outline" className="mt-2">Regulatory Alignment: High</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-centre gap-2">
                        <BookOpen className="h-4 w-4" />
                        Hattie&apos;s Visible Learning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        Our effect size calculations are based on John Hattie&apos;s meta-analysis work, which synthesizes 
                        research on factors influencing student achievement.
                      </p>
                      <Badge variant="outline" className="mt-2">Evidence Strength: High</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">How to Use Intervention Analytics</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    <span className="font-medium">Configure Analytics Settings:</span> Select your data source, time range, 
                    and grouping preferences in the Settings tab.
                  </li>
                  <li>
                    <span className="font-medium">Apply Settings:</span> Click &quot;Apply Settings&quot; to generate analytics based 
                    on your configuration.
                  </li>
                  <li>
                    <span className="font-medium">Explore the Overview:</span> Review key metrics and visualizations to 
                    identify trends and patterns.
                  </li>
                  <li>
                    <span className="font-medium">Compare Interventions:</span> Use the Comparison tab to directly compare 
                    effectiveness across different interventions and learning profiles.
                  </li>
                  <li>
                    <span className="font-medium">Analyse Individual Progress:</span> Examine detailed progress data for 
                    individual students in the Individual tab.
                  </li>
                  <li>
                    <span className="font-medium">Generate Reports:</span> Create comprehensive reports for documentation, 
                    meetings, and decision-making.
                  </li>
                </ol>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">References</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>
                    Education Endowment Foundation. (2023). Teaching and Learning Toolkit. 
                    <a href="https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      https://educationendowmentfoundation.org.uk
                    </a>
                  </li>
                  <li>
                    Department for Education. (2015). Special educational needs and disability code of practise: 0 to 25 years. 
                    <a href="https://www.gov.uk/government/publications/send-code-of-practise-0-to-25" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      https://www.gov.uk/government/publications
                    </a>
                  </li>
                  <li>
                    Hattie, J. (2009). Visible Learning: A synthesis of over 800 meta-analyses relating to achievement. Routledge.
                  </li>
                  <li>
                    What Works Clearinghouse. (2020). Standards Handbook (Version 4.1). 
                    <a href="https://ies.ed.gov/ncee/wwc/Handbooks" className="text-blue-600 hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                      https://ies.ed.gov/ncee/wwc
                    </a>
                  </li>
                  <li>
                    Mitchell, D. (2014). What Really Works in Special and Inclusive Education: Using Evidence-Based Teaching Strategies. Routledge.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-centre gap-2">
                <FileText className="h-5 w-5" />
                Intervention Effectiveness Reports
              </CardTitle>
              <CardDescription>
                Generate and download comprehensive reports for documentation and decision-making
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Available Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Comprehensive Effectiveness Report</CardTitle>
                      <CardDescription>
                        Complete analysis of all interventions and their effectiveness
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Includes comparative analysis, statistical significance, and recommendations
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full flex items-centre gap-2">
                        <Download className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Individual Progress Report</CardTitle>
                      <CardDescription>
                        Detailed analysis of individual student progress
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Includes progress tracking, intervention impact, and personalized recommendations
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full flex items-centre gap-2">
                        <Download className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Learning Profile Analysis</CardTitle>
                      <CardDescription>
                        Analysis of intervention effectiveness by learning profile
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Identifies which interventions work best for specific learning profiles
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full flex items-centre gap-2">
                        <Download className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Termly Review Report</CardTitle>
                      <CardDescription>
                        Summary report for termly educational reviews
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        Includes progress summaries, intervention effectiveness, and next steps
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full flex items-centre gap-2">
                        <Download className="h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
