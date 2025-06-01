'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, Lock, UserCheck, Clock, AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-centre mb-12"
      >
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          Please read these terms carefully before using the EdPsych Connect platform.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Last Updated: 18 May 2025
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Contents</h2>
              <nav className="space-y-1">
                <a href="#introduction" className="block p-2 rounded-md hover:bg-muted transition-colors">Introduction</a>
                <a href="#definitions" className="block p-2 rounded-md hover:bg-muted transition-colors">Definitions</a>
                <a href="#account" className="block p-2 rounded-md hover:bg-muted transition-colors">Account Registration</a>
                <a href="#services" className="block p-2 rounded-md hover:bg-muted transition-colors">Services</a>
                <a href="#content" className="block p-2 rounded-md hover:bg-muted transition-colors">User Content</a>
                <a href="#privacy" className="block p-2 rounded-md hover:bg-muted transition-colors">Privacy & Data</a>
                <a href="#intellectual" className="block p-2 rounded-md hover:bg-muted transition-colors">Intellectual Property</a>
                <a href="#liability" className="block p-2 rounded-md hover:bg-muted transition-colors">Limitation of Liability</a>
                <a href="#termination" className="block p-2 rounded-md hover:bg-muted transition-colors">Termination</a>
                <a href="#changes" className="block p-2 rounded-md hover:bg-muted transition-colors">Changes to Terms</a>
                <a href="#contact" className="block p-2 rounded-md hover:bg-muted transition-colors">Contact Us</a>
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardContent className="p-6">
              <ScrollArea className="h-[800px] pr-4">
                <div className="space-y-8">
                  {/* Introduction */}
                  <section id="introduction">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Introduction</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Welcome to EdPsych Connect. These Terms of Service ("Terms") govern your access to and use of the EdPsych Connect platform, including any websites, mobile applications, and services offered by EdPsych Connect Limited ("we," "us," or "our").
                    </p>
                    <p className="text-muted-foreground mb-4">
                      By accessing or using our platform, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the platform.
                    </p>
                    <p className="text-muted-foreground">
                      EdPsych Connect is designed to provide educational services based on educational psychology principles. Our platform is intended for use by students, parents, educators, and educational professionals in accordance with UK educational standards and regulations.
                    </p>
                  </section>

                  {/* Definitions */}
                  <section id="definitions">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Definitions</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Throughout these Terms, we use certain terms with specific meanings:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li><strong>"Platform"</strong> refers to the EdPsych Connect websites, mobile applications, and services.</li>
                      <li><strong>"User"</strong> refers to any individual who accesses or uses the Platform, including students, parents, educators, and educational professionals.</li>
                      <li><strong>"Content"</strong> refers to any information, text, graphics, photos, videos, or other materials uploaded, downloaded, or appearing on the Platform.</li>
                      <li><strong>"User Content"</strong> refers to Content that users submit, upload, or otherwise make available on the Platform.</li>
                      <li><strong>"Services"</strong> refers to the educational tools, resources, and features provided through the Platform.</li>
                    </ul>
                  </section>

                  {/* Account Registration */}
                  <section id="account">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Account Registration</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      To access certain features of the Platform, you may need to register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      For users under the age of 16, parental or guardian consent is required for account registration. Parents or guardians are responsible for supervising and monitoring their child's use of the Platform.
                    </p>
                    <p className="text-muted-foreground">
                      We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be inaccurate, not current, or incomplete.
                    </p>
                  </section>

                  {/* Services */}
                  <section id="services">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Services</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      EdPsych Connect provides a range of educational services based on educational psychology principles, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>Personalized learning experiences</li>
                      <li>Assessment and progress tracking</li>
                      <li>Curriculum planning and resources</li>
                      <li>Immersive learning environments</li>
                      <li>Special educational needs support</li>
                      <li>Professional development for educators</li>
                    </ul>
                    <p className="text-muted-foreground mb-4">
                      We strive to provide high-quality, evidence-based services, but we do not guarantee that our services will meet your specific requirements or expectations.
                    </p>
                    <p className="text-muted-foreground">
                      We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                    </p>
                  </section>

                  {/* User Content */}
                  <section id="content">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">User Content</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Our Platform allows users to submit, upload, or otherwise make available Content. You retain ownership of your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with the Platform.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      You are solely responsible for your User Content and the consequences of posting or publishing it. By submitting User Content, you affirm, represent, and warrant that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>You own or have the necessary licenses, rights, consents, and permissions to use and authorize us to use your User Content.</li>
                      <li>Your User Content does not violate the privacy rights, publicity rights, copyright, contractual rights, or any other rights of any person or entity.</li>
                      <li>Your User Content does not contain material that is unlawful, obscene, defamatory, threatening, harassing, abusive, or hateful.</li>
                    </ul>
                    <p className="text-muted-foreground">
                      We reserve the right to remove any User Content that violates these Terms or that we determine is harmful, offensive, or otherwise inappropriate.
                    </p>
                  </section>

                  {/* Privacy & Data */}
                  <section id="privacy">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Privacy & Data</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      We take your privacy seriously. Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your personal information.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      We comply with the UK General Data Protection Regulation (GDPR) and other applicable data protection laws. We implement appropriate technical and organizational measures to protect your personal data.
                    </p>
                    <p className="text-muted-foreground">
                      For more information about our privacy practices, please review our Privacy Policy.
                    </p>
                  </section>

                  {/* Intellectual Property */}
                  <section id="intellectual">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Intellectual Property</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      The Platform and its original content, features, and functionality are owned by EdPsych Connect Limited and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Platform, except as follows:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials.</li>
                      <li>You may store files that are automatically cached by your web browser for display enhancement purposes.</li>
                      <li>You may print or download one copy of a reasonable number of pages of the Platform for your own personal, non-commercial use and not for further reproduction, publication, or distribution.</li>
                    </ul>
                    <p className="text-muted-foreground">
                      If you print, copy, modify, download, or otherwise use or provide any other person with access to any part of the Platform in breach of the Terms, your right to use the Platform will stop immediately and you must, at our option, return or destroy any copies of the materials you have made.
                    </p>
                  </section>

                  {/* Limitation of Liability */}
                  <section id="liability">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      To the fullest extent permitted by applicable law, EdPsych Connect Limited and its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>Your access to or use of or inability to access or use the Platform;</li>
                      <li>Any conduct or content of any third party on the Platform;</li>
                      <li>Any content obtained from the Platform; and</li>
                      <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
                    </ul>
                    <p className="text-muted-foreground">
                      This limitation of liability shall apply to all claims, whether based on warranty, contract, tort, or any other legal theory, and whether or not we have been informed of the possibility of such damage.
                    </p>
                  </section>

                  {/* Termination */}
                  <section id="termination">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Termination</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                    </p>
                    <p className="text-muted-foreground mb-4">
                      If you wish to terminate your account, you may simply discontinue using the Platform, or contact us to request account deletion.
                    </p>
                    <p className="text-muted-foreground">
                      All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                    </p>
                  </section>

                  {/* Changes to Terms */}
                  <section id="changes">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Changes to Terms</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>
                    <p className="text-muted-foreground">
                      By continuing to access or use our Platform after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Platform.
                    </p>
                  </section>

                  {/* Contact Us */}
                  <section id="contact">
                    <div className="flex items-centre gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-2xl font-semibold">Contact Us</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="text-muted-foreground">
                      EdPsych Connect Limited<br />
                      123 Education Lane<br />
                      London, UK EC1A 1BB<br />
                      Email: legal@edpsychconnect.com<br />
                      Phone: +44 20 1234 5678
                    </p>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Document Versions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold mb-6">Document Versions</h2>
        
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current Version</TabsTrigger>
            <TabsTrigger value="previous">Previous Versions</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="font-medium">Version 1.0 - 18 May 2025</p>
                <p className="text-muted-foreground mt-2">Initial Terms of Service document.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="previous" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">No previous versions available.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How often are these Terms updated?</AccordionTrigger>
            <AccordionContent>
              We review our Terms of Service periodically to ensure they remain current with our services and applicable laws. Any material changes will be communicated to users at least 30 days before they take effect.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What happens to my data if I delete my account?</AccordionTrigger>
            <AccordionContent>
              When you delete your account, we will remove your personal information from our active databases. However, some information may be retained for legal, administrative, or security purposes. Please refer to our Privacy Policy for more details on data retention.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I use EdPsych Connect for commercial purposes?</AccordionTrigger>
            <AccordionContent>
              EdPsych Connect is primarily designed for educational use. Commercial use requires specific licensing agreements. Please contact our team at business@edpsychconnect.com to discuss commercial licensing options.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>How do I report content that violates these Terms?</AccordionTrigger>
            <AccordionContent>
              If you encounter content that violates our Terms of Service, please report it immediately by using the "Report" feature within the platform or by contacting our support team at support@edpsychconnect.com.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </div>
  );
}
