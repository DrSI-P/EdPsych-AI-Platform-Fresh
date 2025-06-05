'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainNavigation from '@/components/navigation/main-navigation';
import { 
  Brain,
  GraduationCap,
  Award,
  Shield,
  Heart,
  Users,
  BookOpen,
  Target,
  Sparkles,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle
} from 'lucide-react';

export default function AboutPage() {
  const achievements = [
    { icon: Award, title: "Chartered Educational Psychologist", description: "Qualified and registered professional" },
    { icon: Shield, title: "HCPC Registered: PYL042340", description: "Health and Care Professions Council" },
    { icon: GraduationCap, title: "DEdPsych BSc CPsychol MBPSs", description: "Advanced qualifications in psychology" },
    { icon: Calendar, title: "20+ Years Education Experience", description: "Extensive field experience" },
    { icon: Brain, title: "12+ Years Educational Psychology", description: "Specialized practice expertise" }
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

  const platformValues = [
    {
      icon: Heart,
      title: "Empowerment Through Understanding",
      description: "Every child deserves to have their unique learning needs understood and supported."
    },
    {
      icon: Users,
      title: "Inclusive Education",
      description: "Creating educational environments where all students can thrive regardless of their starting point."
    },
    {
      icon: Target,
      title: "Evidence-Based Practice",
      description: "All interventions and recommendations are grounded in robust psychological research."
    },
    {
      icon: Globe,
      title: "Accessible Support",
      description: "Making professional educational psychology support available to all who need it."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About EdPsych Connect</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Bringing sunshine and ease to schools through evidence-based educational psychology, 
              comprehensive platform tools, and restorative justice practices.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Avatar className="w-24 h-24 mr-6 border-4 border-blue-200">
                  <AvatarImage src="/images/dr-scott-professional.jpg" alt="Dr. Scott I-Patrick" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl font-bold">
                    DS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Dr. Scott I-Patrick DEdPsych BSc CPsychol MBPSs
                  </h2>
                  <p className="text-lg text-gray-600">
                    Founder & Lead Educational Psychologist
                  </p>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    HCPC Registered: PYL042340
                  </Badge>
                </div>
              </div>
              
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Dr. Scott I-Patrick is a qualified Chartered Child and Adolescent Educational Psychologist 
                  with over 20 years of experience in education and 12+ years specializing in Educational Psychology. 
                  Registered with the Health and Care Professions Council (HCPC: PYL042340), Dr. Scott brings 
                  extensive expertise in evidence-based practice and innovative educational solutions.
                </p>
                <p className="mb-4">
                  His doctoral research focuses on Restorative Justice in educational settings, exploring how 
                  relationship-building and understanding underlying causes of behavior can transform school 
                  environments. This research forms the foundation of the platform's approach to supporting 
                  both students and educators.
                </p>
                <p>
                  With a background that includes sales management, Dr. Scott brings unique negotiation and 
                  facilitation skills that help reach hard-to-reach individuals and families, ensuring that 
                  support is accessible to those who need it most.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Professional Achievements</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our dedicated team of educational psychology professionals committed to transforming 
              educational experiences for students, families, and educators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dr. Scott I-Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-blue-200">
                <AvatarImage src="/images/team/Scott.jpg" alt="Dr. Scott I-Patrick" />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold">
                  DS
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Scott I-Patrick</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">DEdPsych BSc CPsychol MBPSs</p>
              <p className="text-sm text-gray-600 mb-3">Founder & Lead Educational Psychologist</p>
              <Badge className="bg-blue-100 text-blue-800 text-xs">HCPC: PYL042340</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Chartered Educational Psychologist with 20+ years experience specializing in 
                evidence-based practice and restorative justice.
              </p>
            </div>

            {/* George Randal - CTO */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-indigo-200">
                <AvatarImage src="/images/team/GeorgeRandall.jpg" alt="George Randal" />
                <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold">
                  GR
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">George Randal</h3>
              <p className="text-sm text-indigo-600 font-medium mb-2">Chief Technology Officer (CTO)</p>
              <p className="text-sm text-gray-600 mb-3">Technical Leadership & Database Management</p>
              <Badge className="bg-indigo-100 text-indigo-800 text-xs">CTO</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Chief Technology Officer overseeing all technical aspects and database management. 
                Leads the technical architecture and ensures robust, scalable platform infrastructure 
                supporting all 200+ educational features.
              </p>
            </div>

            {/* Professor Piers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-purple-200">
                <AvatarImage src="/images/team/ProfessorPiers.jpeg" alt="Professor Piers Worth" />
                <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-bold">
                  PW
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professor Piers Worth</h3>
              <p className="text-sm text-purple-600 font-medium mb-2">Senior Consultant Advisor & Professor Emeritus</p>
              <p className="text-sm text-gray-600 mb-3">Former Head of School, Buckinghamshire New University</p>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Professor Emeritus</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Distinguished retired Psychology Professor and former Head of School at Buckinghamshire 
                New University, providing senior strategic guidance and academic excellence to platform development.
              </p>
            </div>

            {/* Mrs Hayley Baverstock */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-green-200">
                <AvatarImage src="/images/hayley-baverstock.jpg" alt="Mrs Hayley Baverstock" />
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xl font-bold">
                  HB
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mrs Hayley Baverstock</h3>
              <p className="text-sm text-green-600 font-medium mb-2">Senior Specialist Advisor & Specialist Teacher</p>
              <p className="text-sm text-gray-600 mb-3">Strategic Educational Specialist</p>
              <Badge className="bg-green-100 text-green-800 text-xs">Senior Advisor</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Senior specialist advisor providing strategic guidance and expert teaching 
                methodologies. Combines high-level advisory expertise with hands-on specialist 
                teaching to support diverse educational needs and strategic development.
              </p>
            </div>

            {/* Mrs Sue Podolska */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-200">
                <AvatarImage src="/images/sue-podolska.jpg" alt="Mrs Sue Podolska" />
                <AvatarFallback className="bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xl font-bold">
                  SP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mrs Sue Podolska</h3>
              <p className="text-sm text-pink-600 font-medium mb-2">Senior Specialist Advisor & Specialist Teacher</p>
              <p className="text-sm text-gray-600 mb-3">SEN Inclusion Expert</p>
              <Badge className="bg-pink-100 text-pink-800 text-xs">Senior Advisor</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Senior specialist advisor providing strategic guidance for special educational needs. 
                Combines high-level advisory expertise with specialist teaching to ensure 
                comprehensive support and inclusive education for all students.
              </p>
            </div>

            {/* Samantha */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200">
                <AvatarImage src="/images/team/Samantha.jpeg" alt="Samantha" />
                <AvatarFallback className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xl font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Samantha</h3>
              <p className="text-sm text-orange-600 font-medium mb-2">Business Admin Manager</p>
              <p className="text-sm text-gray-600 mb-3">Operations & Administration</p>
              <Badge className="bg-orange-100 text-orange-800 text-xs">Manager</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Business administration manager ensuring smooth operational excellence 
                and efficient administrative processes across all platform activities.
              </p>
            </div>

            {/* Hannah Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-cyan-200">
                <AvatarImage src="/images/team/Hannah.jpg" alt="Hannah Patrick" />
                <AvatarFallback className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xl font-bold">
                  HP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hannah Patrick</h3>
              <p className="text-sm text-cyan-600 font-medium mb-2">Marketing Executive</p>
              <p className="text-sm text-gray-600 mb-3">Brand & Communications</p>
              <Badge className="bg-cyan-100 text-cyan-800 text-xs">Executive</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Marketing executive driving brand development and strategic communications 
                to effectively reach and engage our diverse educational community.
              </p>
            </div>

            {/* Osasogie Patrick */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-200">
                <AvatarImage src="/images/team/Osasogie.jpg" alt="Osasogie Patrick" />
                <AvatarFallback className="bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xl font-bold">
                  OP
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Osasogie Patrick</h3>
              <p className="text-sm text-emerald-600 font-medium mb-2">Business Accounts Specialist</p>
              <p className="text-sm text-gray-600 mb-3">Financial Operations</p>
              <Badge className="bg-emerald-100 text-emerald-800 text-xs">Specialist</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Business accounts specialist managing financial operations and business 
                account relationships with professional expertise and operational excellence.
              </p>
            </div>

            {/* Louis Young */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-red-200">
                <AvatarImage src="/images/team/LouisYoung.jpg" alt="Louis Young" />
                <AvatarFallback className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl font-bold">
                  LY
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Louis Young</h3>
              <p className="text-sm text-red-600 font-medium mb-2">Sales Director</p>
              <p className="text-sm text-gray-600 mb-3">Strategic Sales Leadership</p>
              <Badge className="bg-red-100 text-red-800 text-xs">Director</Badge>
              <p className="text-xs text-gray-500 mt-3">
                Sales director leading strategic sales initiatives and business development 
                to expand platform reach and educational impact across diverse markets.
              </p>
            </div>
          </div>

          {/* Team Values */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Team Commitment</h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Together, we bring decades of combined experience in educational psychology, 
              special educational needs, and innovative teaching practices. Our collaborative 
              approach ensures comprehensive support for every member of the educational community.
            </p>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive educational psychology services grounded in evidence-based practice 
              and over two decades of field experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {expertise.map((area, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">{area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide our approach to educational psychology and platform development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platformValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
            To revolutionize educational support by making professional educational psychology 
            accessible, evidence-based, and transformative for every child, family, and educator 
            in the learning community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/contact'}
            >
              <Mail className="w-5 h-5 mr-2" />
              Get in Touch
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/platform-overview'}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Platform
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

