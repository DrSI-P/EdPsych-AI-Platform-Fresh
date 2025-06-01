'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { Container, Typography, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography variant="h1" className="mb-6">
              Terms of Service
            </Typography>
            
            <Typography variant="body" className="mb-8">
              Last Updated: 1 June 2025
            </Typography>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                1. Introduction
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Welcome to EdPsych Connect ("we," "our," or "us"). By accessing or using our platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using our Services.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is an educational platform designed to provide personalized learning experiences based on educational psychology principles. Our platform serves students, teachers, parents, and educational professionals across the UK educational system.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                By accessing or using our Services, you confirm that you accept these Terms and agree to comply with them. If you do not agree to these Terms, you must not use our Services.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                2. User Accounts
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                2.1 Account Creation
              </Typography>
              
              <Typography variant="body" className="mb-4">
                To access certain features of our Services, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to update this information to keep it accurate, current, and complete.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                2.2 Account Security
              </Typography>
              
              <Typography variant="body" className="mb-4">
                You are responsible for safeguarding your account credentials and for any activities or actions under your account. We encourage you to use strong passwords and to keep your login information secure. You must notify us immediately of any unauthorized use of your account or any other breach of security.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                2.3 User Types
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Our platform supports different user types, including students, teachers, parents, and educational professionals. Each user type has specific features and access levels appropriate to their role. Users must only register for accounts that accurately reflect their actual role in the educational system.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                3. Subscription and Payment
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.1 Subscription Plans
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect offers various subscription plans for individuals, families, schools, and multi-academy trusts. Details of these plans, including pricing and features, are available on our Pricing page. We reserve the right to modify our subscription plans and pricing at any time, with notice to existing subscribers.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.2 Payment Processing
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Payments are processed securely through Stripe. By subscribing to our Services, you authorize us to charge the applicable fees to your chosen payment method. All payments are processed in British Pounds (GBP).
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.3 Refunds
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Our refund policy is detailed in our Refund Policy document. Generally, we offer a 14-day money-back guarantee for new subscriptions. After this period, refunds are considered on a case-by-case basis.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                4. User Content
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                4.1 Content Ownership
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Users retain ownership of any content they create, upload, or share on our platform ("User Content"). By submitting User Content, you grant EdPsych Connect a non-exclusive, worldwide, royalty-free license to use, store, display, reproduce, and distribute your User Content solely for the purpose of providing and improving our Services.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                4.2 Content Restrictions
              </Typography>
              
              <Typography variant="body" className="mb-4">
                You agree not to submit any User Content that:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                <li>Infringes on any patent, trademark, trade secret, copyright, or other intellectual property rights</li>
                <li>Contains software viruses or any other code designed to interrupt, destroy, or limit the functionality of any computer software or hardware</li>
                <li>Is false, misleading, or deceptive</li>
                <li>Violates the privacy or publicity rights of any third party</li>
              </ul>
              
              <Typography variant="h3" className="mb-4">
                4.3 Content Moderation
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We reserve the right to review, monitor, and remove any User Content that violates these Terms or is otherwise objectionable, at our sole discretion and without prior notice.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                5. Intellectual Property
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                5.1 Our Intellectual Property
              </Typography>
              
              <Typography variant="body" className="mb-4">
                The Services and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by EdPsych Connect, its licensors, or other providers and are protected by UK and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                5.2 Limited License
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use our Services for your personal, non-commercial use. This license does not include the right to:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Modify, reproduce, distribute, or create derivative works based on our Services</li>
                <li>Use any data mining, robots, or similar data gathering and extraction methods</li>
                <li>Download or copy any account information for the benefit of another party</li>
                <li>Use any meta tags or any other "hidden text" utilizing our name or trademarks</li>
              </ul>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                6. Data Protection and Privacy
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We take data protection and privacy seriously. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you consent to our data practices as described in our Privacy Policy.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. For more information about your data protection rights, please refer to our Privacy Policy.
              </Typography>
              
              <Button variant="secondary" size="md" asChild className="mb-4">
                <Link href="/legal/privacy-policy">
                  View Privacy Policy
                </Link>
              </Button>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                7. Educational Compliance
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect is designed to align with UK educational standards and requirements. Our platform content is congruent with the UK Department for Education (DFE) curriculum and guidelines.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                For educational institutions using our platform, we provide features that support compliance with relevant educational regulations and reporting requirements.
              </Typography>
              
              <Button variant="secondary" size="md" asChild className="mb-4">
                <Link href="/legal/educational-compliance">
                  View Educational Compliance Details
                </Link>
              </Button>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                8. Limitation of Liability
              </Typography>
              
              <Typography variant="body" className="mb-4">
                To the fullest extent permitted by applicable law, EdPsych Connect and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your access to or use of or inability to access or use the Services</li>
                <li>Any conduct or content of any third party on the Services</li>
                <li>Any content obtained from the Services</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                In no event shall our total liability to you for all claims exceed the amount paid by you, if any, for accessing our Services during the 12 months preceding your claim.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                9. Termination
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services or contact us to request account deletion.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                10. Changes to Terms
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                11. Governing Law
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                12. Contact Us
              </Typography>
              
              <Typography variant="body" className="mb-4">
                If you have any questions about these Terms, please contact us at:
              </Typography>
              
              <Typography variant="body" className="mb-4">
                EdPsych Connect Limited<br />
                Email: legal@edpsychconnect.co.uk<br />
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
