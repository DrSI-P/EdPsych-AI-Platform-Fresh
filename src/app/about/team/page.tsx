'use client';

import dynamic from "next/dynamic";

import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { TeamMember } from '@/components/about/TeamMember';
// This prevents Next.js from trying to statically generate this page
export const dynamic = 'force-dynamic';



// Original component
function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Scott I-Patrick",
      title: "Founder & Educational Psychologist",
      qualifications: "DEdPsych, CPsychol, MSc, BSc (Hons)",
      bio: "Dr. Scott I-Patrick is the founder of EdPsych Connect and a Chartered Educational Psychologist with over 15 years of experience in the field. With a Doctorate in Educational Psychology, Dr. Scott has dedicated his career to understanding how children and young people learn and develop. His approach combines evidence-based practise with innovative technology to create personalized learning experiences. Dr. Scott's particular expertise lies in supporting disadvantaged children and those with special educational needs, specialising in child and adolescent educational psychology with evidence-based practise.",
      imageSrc: "/images/team/Scott.jpg",
      imagePosition: "centre 25%",
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
      ],
      avatarVideo: {
        src: "/videos/avatars/teacher/introduction/teacher_dr_scott_introduction_welcome.mp4",
        context: "homepage",
        script: "Hello, I'm Dr. Scott I-Patrick, founder of EdPsych Connect. I'm a Chartered Educational Psychologist with over 15 years of experience in the field. I'm passionate about combining evidence-based practise with innovative technology to create personalized learning experiences for all children and young people."
      }
    },
    {
      name: "George Randall",
      title: "Chief Technology Officer (CTO)",
      qualifications: "Technical Leadership & Database Management",
      bio: "George Randall serves as Chief Technology Officer for EdPsych Connect, bringing extensive expertise in technical leadership and database management. He oversees all technical aspects and database management, leads technical architecture, and ensures robust scalable infrastructure. George's technical vision drives the platform's innovation, ensuring seamless integration of educational psychology principles with cutting-edge technology solutions.",
      imageSrc: "/images/team/GeorgeRandall.jpg",
      imagePosition: "centre 15%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Technical Leadership",
        "Database Management",
        "Software Architecture",
        "System Integration",
        "Technology Strategy",
        "Infrastructure Management"
      ],
      avatarVideo: {
        src: "/videos/avatars/specialist/instructional/specialist_collaboration_instructional_professional.mp4",
        context: "feature",
        script: "As Chief Technology Officer at EdPsych Connect, I oversee all technical aspects of our platform. My focus is on creating robust, scalable infrastructure that supports the innovative educational tools our team develops."
      }
    },
    {
      name: "Hannah Patrick",
      title: "Marketing Executive",
      qualifications: "BA in Marketing, Psychology Expertise",
      bio: "Hannah Patrick brings her expertise in marketing and deep understanding of psychology to her role as Marketing Executive at EdPsych Connect. With a BA in Marketing and extensive psychology knowledge, Hannah combines commercial acumen with psychological insight to ensure the platform effectively reaches and engages its diverse user groups. Her approach to marketing is grounded in understanding user needs and communicating the platform's educational value with clarity and impact.",
      imageSrc: "/images/team/Hannah.jpg",
      imagePosition: "centre 30%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Educational Marketing",
        "Brand Development",
        "User Engagement",
        "Psychology-Informed Communication",
        "Digital Marketing Strategy"
      ],
      avatarVideo: {
        src: "/videos/avatars/student/instructional/student_guide_instructional_navigation.mp4",
        context: "help",
        script: "Hi there! I'm Hannah, the Marketing Executive at EdPsych Connect. I combine my expertise in marketing with a deep understanding of psychology to ensure our platform effectively reaches and engages all our users."
      }
    },
    {
      name: "Osasogie Patrick",
      title: "Customer Accounts Manager",
      qualifications: "Customer Relations & Account Management",
      bio: "Osasogie Patrick serves as Customer Accounts Manager for EdPsych Connect, specialising in building and maintaining strong relationships with our educational clients. With expertise in customer relations and account management, Osasogie ensures that schools, educators, and families receive exceptional support and service. His approach focuses on understanding client needs and providing tailored solutions that maximize the educational impact of our platform.",
      imageSrc: "/images/team/Osasogie.jpg",
      imagePosition: "centre 35%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Customer Relations",
        "Account Management",
        "Client Support",
        "Educational Partnerships",
        "Customer Success"
      ],
      avatarVideo: {
        src: "/videos/avatars/teacher/instructional/teacher_dr_scott_instructional_feedback.mp4",
        context: "dashboard",
        script: "Hello, I'm Osasogie Patrick, Customer Accounts Manager for EdPsych Connect. I'm dedicated to building strong relationships with our educational clients and ensuring they receive exceptional support and service."
      }
    },
    {
      name: "Samantha",
      title: "Business Support Manager",
      qualifications: "Business Operations & Support Management",
      bio: "Samantha serves as Business Support Manager for EdPsych Connect, overseeing business operations and support management across the organisation. With expertise in business operations and support systems, Samantha ensures smooth day-to-day operations and provides comprehensive support to all team members and departments. Her role is crucial in maintaining operational efficiency and supporting the platform's growth and development.",
      imageSrc: "/images/team/Samantha.jpeg",
      imagePosition: "centre 40%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Business Operations",
        "Support Management",
        "Operational Efficiency",
        "Team Coordination",
        "Process Optimization"
      ],
      avatarVideo: {
        src: "/videos/avatars/special_needs/emotional_support/special_needs_support_emotional_support_crisis.mp4",
        context: "help",
        script: "Hi, I'm Samantha, the Business Support Manager at EdPsych Connect. I ensure smooth day-to-day operations and provide comprehensive support to all team members and departments."
      }
    },
    {
      name: "Louis Young",
      title: "Sales Director",
      qualifications: "Sales Leadership & Business Development",
      bio: "Louis Young serves as Sales Director for EdPsych Connect, leading sales strategy and business development initiatives. With expertise in sales leadership and business development, Louis drives growth by building relationships with educational institutions, identifying new market opportunities, and ensuring that our platform reaches the educators and students who can benefit most from our evidence-based educational psychology solutions.",
      imageSrc: "/images/team/LouisYoung.jpg",
      imagePosition: "centre 25%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Sales Leadership",
        "Business Development",
        "Educational Sales",
        "Market Strategy",
        "Client Acquisition"
      ],
      avatarVideo: {
        src: "/videos/avatars/specialist/instructional/specialist_global_instructional_citizenship.mp4",
        context: "feature",
        script: "Hello, I'm Louis Young, Sales Director at EdPsych Connect. I'm passionate about building relationships with educational institutions and ensuring our platform reaches the educators and students who can benefit most from our solutions."
      }
    },
    {
      name: "Professor Piers Worth",
      title: "Academic Advisor",
      qualifications: "Academic Research & Educational Psychology",
      bio: "Professor Piers Worth serves as Academic Advisor for EdPsych Connect, bringing extensive academic research expertise and deep knowledge of educational psychology. He provides strategic guidance on research-based practices, ensures academic rigor in platform development, and helps maintain the highest standards of evidence-based educational support. His involvement ensures that the platform remains grounded in current educational psychology research.",
      imageSrc: "/images/team/ProfessorPiers.jpeg",
      imagePosition: "centre 40%",
      socialLinks: {
        linkedin: "#"
      },
      specialties: [
        "Academic Research",
        "Educational Psychology",
        "Research Methodology",
        "Evidence-Based Practise",
        "Academic Standards"
      ],
      avatarVideo: {
        src: "/videos/avatars/teacher/instructional/teacher_dr_scott_instructional_assessment.mp4",
        context: "feature",
        script: "Greetings, I'm Professor Piers Worth, Academic Advisor for EdPsych Connect. I provide strategic guidance on research-based practices and ensure academic rigor in all aspects of the platform's development."
      }
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
            specialties={member.specialties}
            imagePosition={member.imagePosition}
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


// Export with dynamic import to prevent router mounting issues during static generation
export default dynamic(() => Promise.resolve(TeamPage), {
  ssr: false
});