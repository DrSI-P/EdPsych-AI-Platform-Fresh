'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TeamMember } from '@/components/about/TeamMember';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Scott I-Patrick",
      title: "Founder & Educational Psychologist",
      qualifications: "DEdPsych, CPsychol, MSc, BSc (Hons)",
      bio: "Dr. Scott I-Patrick is the founder of EdPsych Connect and a Chartered Educational Psychologist with over 15 years of experience in the field. With a Doctorate in Educational Psychology, Dr. Scott has dedicated his career to understanding how children and young people learn and develop. His approach combines evidence-based practice with innovative technology to create personalized learning experiences. Dr. Scott's particular expertise lies in supporting disadvantaged children and those with special educational needs, specializing in child and adolescent educational psychology with evidence-based practice.",
      imageSrc: "/images/team/Scott.jpg",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/dr-scott-i-patrick/",
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
      name: "George Randal",
      title: "Chief Technology Officer (CTO)",
      qualifications: "Technical Leadership & Database Management",
      bio: "George Randal serves as Chief Technology Officer for EdPsych Connect, bringing extensive expertise in technical leadership and database management. He oversees all technical aspects and database management, leads technical architecture, and ensures robust scalable platform infrastructure supporting all 200+ educational features. George's approach combines cutting-edge technology with educational psychology principles to create innovative solutions that truly serve the educational community.",
      imageSrc: "/images/team/GeorgeRandall.jpg",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Technical Leadership",
        "Database Management",
        "Platform Architecture",
        "Educational Technology",
        "System Scalability",
        "Infrastructure Management"
      ]
    },
    {
      name: "Hannah Patrick",
      title: "Marketing Executive",
      qualifications: "BA in Marketing, Psychology Expertise",
      bio: "Hannah Patrick brings her expertise in marketing and deep understanding of psychology to her role as Marketing Executive at EdPsych Connect. With a BA in Marketing and extensive psychology knowledge, Hannah combines commercial acumen with psychological insight to ensure the platform effectively reaches and engages its diverse user groups. Her approach to marketing is grounded in understanding user needs and communicating the platform's educational value with clarity and impact.",
      imageSrc: "/images/team/Hannah.jpg",
      socialLinks: {
        linkedin: "#"
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
      name: "Osasogie Patrick",
      title: "Educational Specialist",
      qualifications: "Educational Support & Development",
      bio: "Osasogie Patrick contributes specialized expertise in educational support and development to the EdPsych Connect team. With a focus on inclusive education and student support systems, Osasogie helps ensure that the platform meets the diverse needs of all learners. His work involves developing educational content, supporting implementation strategies, and ensuring that evidence-based practices are effectively integrated into the platform's features.",
      imageSrc: "/images/team/Osasogie.jpg",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Educational Support",
        "Inclusive Education",
        "Student Development",
        "Content Development",
        "Implementation Strategy"
      ]
    },
    {
      name: "Samantha",
      title: "User Experience Specialist",
      qualifications: "UX Design & Educational Interface",
      bio: "Samantha specializes in user experience design and educational interface development for EdPsych Connect. She focuses on creating intuitive, accessible, and engaging user interfaces that support effective learning experiences. Her work ensures that the platform's complex educational psychology features are presented in ways that are easy to understand and use for students, educators, parents, and professionals alike.",
      imageSrc: "/images/team/Samantha.jpeg",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "User Experience Design",
        "Educational Interface",
        "Accessibility Design",
        "User Research",
        "Interface Optimization"
      ]
    },
    {
      name: "Louis Young",
      title: "Educational Content Developer",
      qualifications: "Content Strategy & Educational Resources",
      bio: "Louis Young leads educational content development for EdPsych Connect, creating comprehensive educational resources and content strategies. His work involves developing curriculum-aligned materials, assessment tools, and educational content that supports the platform's evidence-based approach. Louis ensures that all content meets high educational standards and effectively supports diverse learning needs.",
      imageSrc: "/images/team/LouisYoung.jpg",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Educational Content Development",
        "Curriculum Design",
        "Assessment Tools",
        "Content Strategy",
        "Educational Resources"
      ]
    },
    {
      name: "Professor Piers Worth",
      title: "Academic Advisor",
      qualifications: "Academic Research & Educational Psychology",
      bio: "Professor Piers Worth serves as Academic Advisor for EdPsych Connect, bringing extensive academic research expertise and deep knowledge of educational psychology. He provides strategic guidance on research-based practices, ensures academic rigor in platform development, and helps maintain the highest standards of evidence-based educational support. His involvement ensures that the platform remains grounded in current educational psychology research.",
      imageSrc: "/images/team/OrofessorPiers.jpeg",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Academic Research",
        "Educational Psychology",
        "Research Methodology",
        "Evidence-Based Practice",
        "Academic Standards"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
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
        className="mt-16 text-center"
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

