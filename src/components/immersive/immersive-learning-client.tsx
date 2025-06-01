'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ImmersiveLayout } from '@/components/immersive/immersive-layout';
import { ThreeDScene } from '@/components/immersive/3d-navigation';

interface ImmersiveExperience {
  id: string;
  title: string;
  description: string;
  type: 'vr' | 'ar' | '3d';
  thumbnailUrl?: string;
  scenarioUrl: string;
}

// Animation variants
const pageTransitionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

/**
 * Enhanced Immersive Learning Page with Animations
 * 
 * This page provides a comprehensive interface for accessing and interacting with
 * immersive learning experiences, including VR, AR, and 3D content.
 */
export default function ImmersiveLearningClient() {
  const [activeExperience, setActiveExperience] = React.useState<ImmersiveExperience | null>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isVRMode, setIsVRMode] = React.useState(false);
  
  // Mock data for immersive experiences
  const experiences: any[] = [
    {
      id: '1',
      title: 'Solar System Explorer',
      description: 'Explore the planets and moons of our solar system in an interactive 3D environment.',
      type: '3d',
      thumbnailUrl: '/images/solar-system.jpg',
      scenarioUrl: '/scenarios/solar-system'
    },
    {
      id: '2',
      title: 'Human Anatomy VR',
      description: 'Dive into the human body and explore anatomical structures in virtual reality.',
      type: 'vr',
      thumbnailUrl: '/images/anatomy.jpg',
      scenarioUrl: '/scenarios/anatomy'
    },
    {
      id: '3',
      title: 'Historical London',
      description: 'Walk through London streets across different time periods, from Roman times to the present day.',
      type: '3d',
      thumbnailUrl: '/images/london.jpg',
      scenarioUrl: '/scenarios/london'
    },
    {
      id: '4',
      title: 'Chemistry Lab AR',
      description: 'Conduct virtual chemistry experiments in augmented reality without the risks of real chemicals.',
      type: 'ar',
      thumbnailUrl: '/images/chemistry.jpg',
      scenarioUrl: '/scenarios/chemistry'
    },
    {
      id: '5',
      title: 'Ecosystem Explorer',
      description: 'Investigate different ecosystems and observe how plants and animals interact in their natural habitats.',
      type: '3d',
      thumbnailUrl: '/images/ecosystem.jpg',
      scenarioUrl: '/scenarios/ecosystem'
    },
    {
      id: '6',
      title: 'Mathematical Visualizations',
      description: 'Visualise complex mathematical concepts in 3D space to better understand abstract ideas.',
      type: '3d',
      thumbnailUrl: '/images/math.jpg',
      scenarioUrl: '/scenarios/math'
    }
  ];
  
  // Filter experiences by type
  const vrExperiences = experiences.filter(exp => exp.type === 'vr');
  const arExperiences = experiences.filter(exp => exp.type === 'ar');
  const threeDExperiences = experiences.filter(exp => exp.type === '3d');
  
  // Handle experience selection
  const handleSelectExperience = (experience: ImmersiveExperience) => {
    setActiveExperience(experience);
  };
  
  // Handle back button
  const handleBack = () => {
    setActiveExperience(null);
    setIsVRMode(false);
    setIsFullscreen(false);
  };
  
  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle VR mode toggle
  const handleToggleVR = () => {
    setIsVRMode(!isVRMode);
  };
  
  // Render experience card
  const renderExperienceCard = (experience: ImmersiveExperience, index: number) => (
    <motion.div 
      key={experience.id} 
      variants={staggerItemVariants}
      className="h-full"
    >
      <motion.div 
        className="h-full"
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.2 }
        }}
      >
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-40 overflow-hidden bg-grey-100">
            {experience.thumbnailUrl ? (
              <img
                src={experience.thumbnailUrl}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-centre justify-centre bg-grey-200">
                <span className="text-grey-500">No preview available</span>
              </div>
            )}
            <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
              {experience.type === 'vr' ? 'VR' : 
               experience.type === 'ar' ? 'AR' : '3D'}
            </div>
          </div>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">{experience.title}</h3>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-sm text-grey-600">{experience.description}</p>
          </CardContent>
          <div className="p-4 pt-0 mt-auto">
            <Button 
              onClick={() => handleSelectExperience(experience)}
              className="w-full"
            >
              Launch Experience
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageTransitionVariants}
      className="min-h-screen"
    >
      {activeExperience ? (
        // Active experience view
        <div className="h-[calc(100vh-8rem)]">
          <ImmersiveLayout
            title={activeExperience.title}
            description={activeExperience.description}
            isVR={activeExperience.type === 'vr'}
            isAR={activeExperience.type === 'ar'}
            is3D={activeExperience.type === '3d'}
            onBack={handleBack}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleVR={handleToggleVR}
            className="h-full"
          >
            <ThreeDScene
              showControls={true}
              controlsPosition="bottom-right"
              className="w-full h-full"
            >
              <div className="w-full h-full flex items-centre justify-centre">
                <div className="text-centre p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-4">{activeExperience.title}</h2>
                  <p className="mb-6">{activeExperience.description}</p>
                  <p className="text-sm text-grey-600">
                    This is a placeholder for the actual 3D/VR/AR content that would be loaded from {activeExperience.scenarioUrl}
                  </p>
                </div>
              </div>
            </ThreeDScene>
          </ImmersiveLayout>
        </div>
      ) : (
        // Experience selection view
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-grey-900 mb-2">
              Immersive Learning
            </h1>
            <p className="text-grey-600">
              Explore interactive 3D, VR, and AR learning experiences designed to make complex concepts more engaging and accessible.
            </p>
          </div>
          
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Experiences</TabsTrigger>
              <TabsTrigger value="vr">Virtual Reality</TabsTrigger>
              <TabsTrigger value="ar">Augmented Reality</TabsTrigger>
              <TabsTrigger value="3d">3D Interactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {experiences.map((exp, index) => renderExperienceCard(exp, index))}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="vr">
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {vrExperiences.length > 0 ? (
                  vrExperiences.map((exp, index) => renderExperienceCard(exp, index))
                ) : (
                  <div className="col-span-full text-centre py-12">
                    <p className="text-grey-500">No VR experiences available yet.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="ar">
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {arExperiences.length > 0 ? (
                  arExperiences.map((exp, index) => renderExperienceCard(exp, index))
                ) : (
                  <div className="col-span-full text-centre py-12">
                    <p className="text-grey-500">No AR experiences available yet.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="3d">
              <motion.div 
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {threeDExperiences.length > 0 ? (
                  threeDExperiences.map((exp, index) => renderExperienceCard(exp, index))
                ) : (
                  <div className="col-span-full text-centre py-12">
                    <p className="text-grey-500">No 3D experiences available yet.</p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={pageTransitionVariants}
            className="mt-12 bg-grey-50 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">About Immersive Learning</h2>
            <p className="mb-4">
              Immersive learning uses virtual reality (VR), augmented reality (AR), and interactive 3D environments to create engaging educational experiences that can help students better understand complex concepts.
            </p>
            <p className="mb-4">
              Research has shown that immersive learning can improve retention, increase engagement, and provide unique opportunities for experiential learning that wouldn't be possible in traditional classroom settings.
            </p>
            <motion.div 
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Virtual Reality (VR)</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Fully immersive experiences that transport learners to different environments, allowing them to interact with virtual objects and scenarios.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Augmented Reality (AR)</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Overlays digital content onto the real world, enhancing the learning environment with interactive elements and information.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={staggerItemVariants}>
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">3D Interactive</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Three-dimensional environments that can be explored and manipulated on standard devices, making complex spatial concepts more accessible.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}