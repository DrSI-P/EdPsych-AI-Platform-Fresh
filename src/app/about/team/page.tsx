'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TeamMember } from '@/components/about/TeamMember';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Scott Ighavongbe-Patrick",
      title: "Founder & Educational Psychologist",
      qualifications: "DCEdPsych, CPsychol, MSc, BSc (Hons)",
      bio: "Dr. Scott Ighavongbe-Patrick is the founder of EdPsych Connect and a Chartered Educational Psychologist with over 12 years of experience in the field. With a Doctorate in Educational Psychology, Dr. Scott has dedicated his career to understanding how children and young people learn and develop. His approach combines evidence-based practice with innovative technology to create personalized learning experiences. Dr. Scott's particular expertise lies in supporting disadvantaged children and those with special educational needs, using his background in sales management and negotiation to effectively engage individuals.",
      imageSrc: "/images/team/dr-scott.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/dr-scott-ighavongbe-patrick-dedpsych-cpsychol-9143941b6/",
        email: "scott@edpsychconnect.com",
        publications: "/publications/dr-scott"
      },
      specialties: [
        "Educational Psychology",
        "Inclusive Education",
        "Restorative Justice",
        "Child Development",
        "Educational Technology",
        "Special Educational Needs"
      ]
    },
    {
      name: "Hannah Ighavongbe-Patrick",
      title: "Marketing Executive",
      qualifications: "BA in Marketing, Postgraduate Psychology Student",
      bio: "Hannah Ighavongbe-Patrick brings her expertise in marketing and deep understanding of psychology to her role as Marketing Executive at EdPsych Connect. With a BA in Marketing and ongoing postgraduate studies in Psychology, Hannah combines commercial acumen with psychological insight to ensure the platform effectively reaches and engages its diverse user groups. Her approach to marketing is grounded in understanding user needs and communicating the platform's educational value with clarity and impact. Hannah plays a crucial role in shaping the platform's brand identity and ensuring its message resonates with students, parents, educators, and professionals alike.",
      imageSrc: "/images/team/hannah.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "#",
        email: "hannah@edpsychconnect.com"
      },
      specialties: [
        "Educational Marketing",
        "Brand Development",
        "User Engagement",
        "Psychology-Informed Communication",
        "Digital Marketing Strategy"
      ]
    },
    {
      name: "Dr. Manus Roocode",
      title: "Technical Manager",
      qualifications: "PhD in Computer Science",
      bio: "Dr. Manus Roocode serves as the Technical Manager for EdPsych Connect, bringing extensive expertise in artificial intelligence, educational technology, and software development. Working closely with Dr. Scott, Manus has been instrumental in translating educational psychology principles into innovative technical solutions. His approach combines cutting-edge AI capabilities with evidence-based educational practices to create a platform that truly adapts to individual learning needs. Dr. Manus oversees all technical aspects of the platform, ensuring robust architecture, seamless user experience, and continuous innovation in features like adaptive complexity adjustment, voice input functionality, and immersive learning environments.",
      imageSrc: "/images/team/dr-manus.jpg", // Placeholder - will need actual image
      socialLinks: {
        linkedin: "#",
        email: "manus@edpsychconnect.com"
      },
      specialties: [
        "Artificial Intelligence in Education",
        "Educational Software Architecture",
        "Adaptive Learning Systems",
        "Voice Recognition Technology",
        "Immersive Learning Environments",
        "Accessibility Engineering"
      ]
    }
  ];
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Meet Our Team</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          The passionate minds behind EdPsych Connect, dedicated to transforming education through the perfect blend of educational psychology and cutting-edge technology.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <TeamMember
            key={index}
            name={member.name}
            title={member.title}
            qualifications={member.qualifications}
            bio={member.bio}
            imageSrc={member.imageSrc}
            socialLinks={member.socialLinks}
            specialties={member.specialties}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-16 text-centre"
      >
        <h2 className="text-2xl font-semibold mb-4">Join Our Mission</h2>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          EdPsych Connect is dedicated to revolutionizing education through the perfect blend of educational psychology principles and cutting-edge technology. We're always looking for passionate individuals to join our journey.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <a href="/about/careers">Explore Opportunities</a>
        </Button>
      </motion.div>
    </div>
  );
}
