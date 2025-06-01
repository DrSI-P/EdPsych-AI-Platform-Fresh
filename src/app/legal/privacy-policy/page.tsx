'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { Container, Typography, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography variant="h1" className="mb-6">
              Privacy Policy
            </Typography>
            
            <Typography variant="body" className="mb-8">
              Last Updated: 1 June 2025
            </Typography>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                1. Introduction
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, website, and services (collectively, the "Services").
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We adhere to the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. This policy applies to all users of our Services, including students, teachers, parents, and educational professionals.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                2. Information We Collect
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                2.1 Personal Information
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We may collect the following types of personal information:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password, user role (student, teacher, parent, professional), and profile picture</li>
                <li><strong>Educational Information:</strong> School affiliation, year group/key stage, subject preferences, learning style, and academic progress</li>
                <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely through Stripe)</li>
                <li><strong>Communication Data:</strong> Messages, feedback, and support inquiries you send to us</li>
                <li><strong>Special Category Data:</strong> With explicit consent, we may collect information about learning needs or disabilities to provide appropriate educational support</li>
              </ul>
              
              <Typography variant="h3" className="mb-4">
                2.2 Usage Information
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We automatically collect certain information when you use our Services:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device type</li>
                <li><strong>Log Data:</strong> Access times, pages viewed, time spent on pages, navigation paths</li>
                <li><strong>Learning Analytics:</strong> Interaction with educational content, completion rates, assessment results</li>
                <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies and similar tracking technologies</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                3. How We Use Your Information
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We use your information for the following purposes:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Provide and Improve Services:</strong> To deliver our educational platform, personalize learning experiences, and enhance our Services</li>
                <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and provide customer support</li>
                <li><strong>Educational Personalization:</strong> To adapt content to learning styles, track progress, and provide appropriate educational resources</li>
                <li><strong>Communication:</strong> To respond to inquiries, send service updates, and provide important notifications</li>
                <li><strong>Processing Payments:</strong> To process subscription payments and manage billing</li>
                <li><strong>Analytics and Research:</strong> To analyze usage patterns, conduct research, and improve educational outcomes</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
              </ul>
              
              <Typography variant="h3" className="mb-4">
                3.1 Legal Basis for Processing
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We process your personal information based on the following legal grounds:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Contract:</strong> Processing necessary for the performance of our contract with you</li>
                <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, provided these interests do not override your fundamental rights and freedoms</li>
                <li><strong>Consent:</strong> Processing based on your specific consent, particularly for special category data</li>
                <li><strong>Legal Obligation:</strong> Processing necessary to comply with legal requirements</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                4. Children's Privacy
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Our Services are designed for use by children and young people within the UK educational system. We take special precautions to protect the privacy of children under 13:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>We obtain verifiable parental consent before collecting personal information from children under 13</li>
                <li>We collect only the information necessary to provide our educational Services</li>
                <li>We do not make children's personal information publicly available</li>
                <li>Parents can review, delete, or refuse further collection of their child's information</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                For users aged 13-18, we obtain their consent and, where appropriate, parental consent for data processing activities.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                5. Data Sharing and Disclosure
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We may share your information with the following third parties:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who help us operate our Services (e.g., hosting, payment processing, analytics)</li>
                <li><strong>Educational Institutions:</strong> Schools and educational organizations with which you are affiliated, for educational purposes</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                We require all third parties to respect the security of your personal information and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                6. Data Security
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Encryption of sensitive data at rest and in transit</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Staff training on data protection and security</li>
                <li>Incident response procedures</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                7. Data Retention
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Providing our Services to you</li>
                <li>Complying with legal, accounting, or reporting requirements</li>
                <li>Resolving disputes and enforcing our agreements</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                For educational data, we typically retain information for the duration of a student's educational journey plus a reasonable period afterward to allow for continuity and reference. Specific retention periods vary by data type and are detailed in our internal data retention policy.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                8. Your Data Protection Rights
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Under UK data protection laws, you have the following rights:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information in certain circumstances</li>
                <li><strong>Right to Restrict Processing:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your information to another organization</li>
                <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing</li>
                <li><strong>Rights Related to Automated Decision-Making:</strong> Request human intervention for decisions based solely on automated processing</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                To exercise these rights, please contact us using the details provided in Section 12. We will respond to your request within one month. There is no fee for exercising your rights, but we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                9. Cookies and Tracking Technologies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We use cookies and similar tracking technologies to collect information about your browsing activities and to distinguish you from other users of our Services. This helps us provide you with a good experience when you use our Services and allows us to improve our platform.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We use the following types of cookies:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the operation of our Services</li>
                <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count visitors and analyze how users navigate our Services</li>
                <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our Services</li>
                <li><strong>Targeting Cookies:</strong> Record your visit to our Services, the pages you visit, and the links you follow</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of our Services may become inaccessible or not function properly.
              </Typography>
              
              <Button variant="secondary" size="md" asChild className="mb-4">
                <Link href="/legal/cookie-policy">
                  View Cookie Policy
                </Link>
              </Button>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                10. International Data Transfers
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We primarily store and process your personal information within the United Kingdom and the European Economic Area (EEA). However, some of our service providers may be based outside these regions, which may involve transferring your data to other countries.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                When we transfer your personal information outside the UK or EEA, we ensure a similar degree of protection by implementing at least one of the following safeguards:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Transferring to countries that have been deemed to provide an adequate level of protection by the UK or European Commission</li>
                <li>Using specific contracts approved by the UK or European Commission that give personal data the same protection it has in the UK and Europe</li>
                <li>Implementing appropriate technical and organizational measures to ensure the security of your data</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                11. Changes to This Privacy Policy
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We encourage you to review this Privacy Policy periodically for any changes. Your continued use of our Services after any changes to this Privacy Policy constitutes your acceptance of the changes.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                12. Contact Us
              </Typography>
              
              <Typography variant="body" className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </Typography>
              
              <Typography variant="body" className="mb-4">
                <strong>Data Protection Officer</strong><br />
                EdPsych Connect Limited<br />
                Email: privacy@edpsychconnect.co.uk<br />
                Address: 123 Education Lane, London, UK
              </Typography>
              
              <Typography variant="body" className="mb-4">
                You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues (www.ico.org.uk). However, we would appreciate the chance to address your concerns before you approach the ICO, so please contact us in the first instance.
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
