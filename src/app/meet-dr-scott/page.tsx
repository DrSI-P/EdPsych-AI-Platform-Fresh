'use client';

import React from 'react';
import { VoiceReadableHeading, VoiceReadableText } from '@/components/accessibility';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GraduationCap, 
  Brain, 
  Heart, 
  BookOpen,
  Award,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

// Simple video player component without hooks for now
const SimpleVideoPlayer = ({ className }: { className?: string }) => {
  return (
    <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
      <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Scott I-Patrick</h3>
      <p className="text-gray-600 mb-4">Founder & Educational Psychologist</p>
      <Badge className="bg-blue-100 text-blue-800">Video Coming Soon</Badge>
    </div>
  );
};

export default function MeetDrScottPage() {
  const achievements = [
    {
      icon: Award,
      title: "Chartered Educational Psychologist",
      description: "Qualified and registered professional with the British Psychological Society"
    },
    {
      icon: GraduationCap,
      title: "DEdPsych BSc CPsychol MBPSs",
      description: "Advanced qualifications in Educational Psychology and related fields"
    },
    {
      icon: Users,
      title: "HCPC Registered: PYL042340",
      description: "Health and Care Professions Council registration for professional practice"
    },
    {
      icon: Brain,
      title: "20+ Years Education Experience",
      description: "Extensive experience in educational settings and psychological practice"
    },
    {
      icon: Heart,
      title: "12+ Years Educational Psychology",
      description: "Specialized practice in child and adolescent educational psychology"
    }
  ];

  const expertise = [
    "Child and Adolescent Educational Psychology",
    "Evidence-based Educational Interventions", 
    "Restorative Justice in Educational Settings",
    "Learning Difficulties and Disabilities Assessment",
    "Behavioral Support and Intervention",
    "Family and School Collaboration",
    "Professional Development and Training",
    "Educational Research and Evaluation"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <VoiceReadableHeading level={1} className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Dr. Scott I-Patrick
          </VoiceReadableHeading>
          <VoiceReadableText className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Founder of EdPsych Connect and Chartered Educational Psychologist dedicated to 
            transforming education through evidence-based practice and innovative technology.
          </VoiceReadableText>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Dr. Scott's Avatar Video */}
          <div className="space-y-6">
            <SimpleVideoPlayer className="shadow-2xl" />
            
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Professional Credentials</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-300" />
                    <span>Chartered Educational Psychologist</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-green-300" />
                    <span>DEdPsych BSc CPsychol MBPSs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-300" />
                    <span>HCPC Registered: PYL042340</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <span>20+ Years Education Experience</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-600" />
                  About Dr. Scott
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  Dr. Scott I-Patrick is the founder of EdPsych Connect and a Chartered Educational 
                  Psychologist with over 15 years of experience in the field. With a Doctorate in 
                  Educational Psychology, Dr. Scott has dedicated his career to understanding how 
                  children and young people learn and develop.
                </VoiceReadableText>
                <VoiceReadableText>
                  His approach combines evidence-based practice with innovative technology to create 
                  personalized learning experiences. Dr. Scott's particular expertise lies in supporting 
                  disadvantaged children and those with special educational needs, specializing in child 
                  and adolescent educational psychology with evidence-based practice.
                </VoiceReadableText>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Areas of Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {expertise.map((area, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-green-600" />
                  Vision & Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceReadableText className="mb-4">
                  "My vision is to bring sunshine and ease to schools through evidence-based educational 
                  psychology, comprehensive platform tools, and restorative justice practices."
                </VoiceReadableText>
                <VoiceReadableText>
                  Through EdPsych Connect, Dr. Scott aims to bridge the gap between educational psychology 
                  research and practical application, making evidence-based interventions accessible to 
                  educators, students, parents, and professionals worldwide.
                </VoiceReadableText>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Achievements */}
        <div className="mt-16">
          <VoiceReadableHeading level={2} className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Professional Achievements
          </VoiceReadableHeading>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <VoiceReadableText className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </VoiceReadableText>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardContent className="p-8">
              <VoiceReadableHeading level={3} className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Education?
              </VoiceReadableHeading>
              <VoiceReadableText className="mb-6">
                Discover how Dr. Scott's evidence-based approach and innovative platform can 
                support your educational journey and improve outcomes for all learners.
              </VoiceReadableText>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/platform-overview">
                  <Button size="lg">
                    Explore Platform
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

