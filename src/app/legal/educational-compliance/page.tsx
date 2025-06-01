'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { Container, Typography, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import Link from 'next/link';

export default function EducationalCompliancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography variant="h1" className="mb-6">
              Educational Compliance
            </Typography>
            
            <Typography variant="body" className="mb-8">
              Last Updated: 1 June 2025
            </Typography>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                1. UK Curriculum Alignment
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is designed to align with the UK educational system and curriculum standards. Our platform content and educational resources are developed in accordance with:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The National Curriculum for England</li>
                <li>UK Department for Education (DfE) guidelines</li>
                <li>Early Years Foundation Stage (EYFS) framework</li>
                <li>Key Stage 1-4 curriculum requirements</li>
                <li>A-Level and further education standards</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our educational content is regularly reviewed and updated to ensure continued alignment with curriculum changes and educational standards.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                2. Special Educational Needs and Disabilities (SEND)
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is committed to supporting inclusive education and meeting the requirements of the SEND Code of Practice 2015. Our platform:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provides accessible content for diverse learning needs</li>
                <li>Offers adaptable learning materials for different abilities</li>
                <li>Supports personalized learning approaches</li>
                <li>Includes tools for creating and implementing Education, Health and Care (EHC) plans</li>
                <li>Facilitates progress tracking for SEND students</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our platform is designed to help educational institutions meet their statutory duties under the Equality Act 2010 and Children and Families Act 2014 regarding SEND provision.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                3. Safeguarding and Child Protection
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect prioritizes the safety and wellbeing of children and young people. Our platform complies with:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Keeping Children Safe in Education (KCSIE) statutory guidance</li>
                <li>Working Together to Safeguard Children guidance</li>
                <li>The Children Act 1989 and 2004</li>
                <li>Online safety requirements for educational platforms</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                We implement robust safeguarding measures including:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Content moderation and filtering</li>
                <li>Secure communication channels</li>
                <li>Age-appropriate content restrictions</li>
                <li>Reporting mechanisms for concerns</li>
                <li>Regular safeguarding audits and updates</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                4. Data Protection in Education
              </Typography>
              
              <Typography variant="body" className="mb-4">
                In addition to our general data protection practices, EdPsych Connect implements specific measures for educational data:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Compliance with the UK GDPR and Data Protection Act 2018 for educational settings</li>
                <li>Adherence to the Department for Education's Data Protection Toolkit for Schools</li>
                <li>Implementation of appropriate data sharing agreements with educational institutions</li>
                <li>Special protections for children's data in line with ICO guidance</li>
                <li>Secure handling of sensitive educational records and assessment data</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                We provide educational institutions with tools and documentation to help them meet their own data protection obligations when using our platform.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                5. Accessibility Standards
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is designed to be accessible to all users, including those with disabilities. Our platform complies with:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
                <li>Accessibility requirements under the Equality Act 2010</li>
                <li>Public Sector Bodies (Websites and Mobile Applications) Accessibility Regulations 2018</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our accessibility features include:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Screen reader compatibility</li>
                <li>Keyboard navigation support</li>
                <li>Customizable text spacing and sizing</li>
                <li>Color contrast options</li>
                <li>Alternative text for images</li>
                <li>Voice input capabilities</li>
                <li>Captions for video content</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                We regularly audit and improve our accessibility features to ensure our platform remains inclusive for all users.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                6. Educational Assessment Standards
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect's assessment tools and methodologies align with UK educational assessment standards:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Standards and Testing Agency (STA) frameworks</li>
                <li>Office of Qualifications and Examinations Regulation (Ofqual) requirements</li>
                <li>Assessment principles from the UK education inspection framework</li>
                <li>Formative and summative assessment best practices</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our assessment features support educational institutions in:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Tracking pupil progress against national standards</li>
                <li>Implementing assessment for learning approaches</li>
                <li>Generating reports for statutory assessment requirements</li>
                <li>Supporting evidence-based interventions</li>
                <li>Preparing for inspections and reviews</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                7. Professional Standards for Educators
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect supports educators in meeting their professional standards and continuing professional development (CPD) requirements:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Teachers' Standards (Department for Education)</li>
                <li>Education Endowment Foundation (EEF) evidence-based practice guidelines</li>
                <li>Health and Care Professions Council (HCPC) standards for educational psychologists</li>
                <li>British Psychological Society (BPS) professional practice guidelines</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our professional development resources and tools are designed to help educators:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Maintain and develop their professional knowledge and skills</li>
                <li>Implement evidence-based teaching practices</li>
                <li>Track and document their professional development</li>
                <li>Access research-informed educational resources</li>
                <li>Collaborate with other education professionals</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                8. Compliance Documentation and Support
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect provides educational institutions with documentation and support to help them demonstrate compliance with relevant regulations:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Data processing agreements for educational settings</li>
                <li>Compliance certificates and documentation</li>
                <li>Implementation guides for meeting statutory requirements</li>
                <li>Regular compliance updates and notifications</li>
                <li>Dedicated compliance support for educational institutions</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Our team includes educational compliance specialists who stay updated on regulatory changes and ensure our platform evolves to meet new requirements.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                9. Continuous Improvement and Updates
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is committed to maintaining the highest standards of educational compliance through:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Regular reviews of educational regulations and standards</li>
                <li>Proactive updates to align with curriculum changes</li>
                <li>Consultation with educational experts and authorities</li>
                <li>Feedback collection from educational institutions</li>
                <li>Participation in educational compliance forums and networks</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                We communicate significant compliance updates to our users and provide guidance on implementing any necessary changes to their use of our platform.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                10. Contact for Compliance Inquiries
              </Typography>
              
              <Typography variant="body" className="mb-4">
                If you have any questions about our educational compliance or need support with compliance matters related to your use of EdPsych Connect, please contact our Educational Compliance Team:
              </Typography>
              
              <Typography variant="body" className="mb-4">
                <strong>Educational Compliance Officer</strong><br />
                EdPsych Connect Limited<br />
                Email: compliance@edpsychconnect.co.uk<br />
                Address: 123 Education Lane, London, UK
              </Typography>
              
              <Button variant="primary" size="lg" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </Card>
          </div>
        </Container>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}
