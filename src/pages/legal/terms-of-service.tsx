import React from 'react';
import Head from 'next/head';
import { Container } from '@/components/ui/container';

export default function TermsOfServicePage() {
  const lastUpdated = "23 May 2025";
  const version = "1.0";
  
  return (
    <>
      <Head>
        <title>Terms of Service | EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect Terms of Service - The agreement between you and EdPsych Connect governing your use of our platform" />
      </Head>
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
          
          <div className="bg-muted p-4 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-sm font-medium">Version {version}</p>
              <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
            </div>
            <button 
              onClick={() => window.print()} 
              className="mt-2 sm:mt-0 text-sm text-primary hover:underline flex items-center"
            >
              Print this page
            </button>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <h2>Introduction</h2>
            <p>
              Welcome to EdPsych Connect. These Terms of Service ("Terms") govern your access to and use of the EdPsych Connect platform, including our website, mobile applications, and all related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p>
              Please read these Terms carefully before using our Service. If you do not agree to these Terms, you may not access or use the Service.
            </p>
            <p>
              EdPsych Connect Limited ("we", "our", "us", "EdPsych Connect") is a UK-based educational platform designed to support teachers, parents, and students with evidence-based educational psychology resources and tools.
            </p>
            
            <h2>Definitions</h2>
            <p>In these Terms:</p>
            <ul>
              <li><strong>"User"</strong> refers to any individual who accesses or uses the Service, including teachers, parents, students, and educational professionals.</li>
              <li><strong>"Educational Institution"</strong> refers to any school, college, university, or other educational organisation that has entered into an agreement with us to provide the Service to its staff and/or students.</li>
              <li><strong>"Content"</strong> refers to all text, images, videos, audio, and other materials available on or through the Service, whether created by us or our users.</li>
              <li><strong>"User Content"</strong> refers to any Content that users submit, upload, or otherwise make available through the Service.</li>
            </ul>
            
            <h2>Account Registration and Eligibility</h2>
            
            <h3>Account Creation</h3>
            <p>
              To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself and to update this information to keep it accurate, current, and complete.
            </p>
            
            <h3>Account Types</h3>
            <p>We offer different types of accounts:</p>
            <ul>
              <li><strong>Teacher/Professional Accounts:</strong> For educational professionals aged 18 or older.</li>
              <li><strong>Parent Accounts:</strong> For parents or legal guardians aged 18 or older.</li>
              <li><strong>Student Accounts:</strong> For students of any age, subject to the following conditions:
                <ul>
                  <li>Students under 13 years of age must have parental or school consent.</li>
                  <li>Student accounts may have limited features based on age.</li>
                </ul>
              </li>
              <li><strong>Institutional Accounts:</strong> For educational institutions, managed by an authorised administrator.</li>
            </ul>
            
            <h3>Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account or any other breach of security.
            </p>
            
            <h2>User Conduct</h2>
            <p>
              By using the Service, you agree not to:
            </p>
            <ul>
              <li>Use the Service in any way that violates any applicable law or regulation.</li>
              <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
              <li>Attempt to gain unauthorised access to any part of the Service, other accounts, or other systems or networks connected to the Service.</li>
              <li>Use the Service to send unsolicited communications, promotions, or advertisements, or to spam, phish, or harm others.</li>
              <li>Upload or transmit viruses, malware, or other types of malicious software, or anything designed to interfere with the proper functioning of the Service.</li>
              <li>Collect or harvest any information from the Service, including user accounts or data.</li>
              <li>Use the Service in a manner that could disable, overburden, damage, or impair the Service or interfere with any other party's use of the Service.</li>
              <li>Use any robot, spider, or other automatic device, process, or means to access the Service for any purpose.</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
            </ul>
            
            <h3>Special Provisions for Educational Institutions</h3>
            <p>
              Educational Institutions using our Service agree to:
            </p>
            <ul>
              <li>Obtain appropriate consent from parents or guardians for students under 13 years of age.</li>
              <li>Use the Service in compliance with all applicable education laws and regulations, including GDPR and the Data Protection Act 2018.</li>
              <li>Inform students and parents about the Service and how their data will be used.</li>
              <li>Take reasonable measures to ensure that students use the Service appropriately and in accordance with these Terms.</li>
            </ul>
            
            <h2>Content and Intellectual Property</h2>
            
            <h3>Our Content</h3>
            <p>
              Unless otherwise indicated, the Service and all Content provided by us are protected by copyright, trademark, and other intellectual property laws. You may not use, reproduce, distribute, modify, create derivative works of, publicly display, or publicly perform any of our Content without our explicit written permission.
            </p>
            
            <h3>Educational Use License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use our Content solely for educational purposes in accordance with these Terms. This license does not include the right to:
            </p>
            <ul>
              <li>Sell, resell, or commercially use our Content.</li>
              <li>Distribute, publicly perform, or publicly display any Content.</li>
              <li>Modify or make derivative works based upon our Content.</li>
              <li>Use data mining, robots, or similar data gathering methods.</li>
            </ul>
            
            <h3>User Content</h3>
            <p>
              By submitting User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such User Content in connection with providing and promoting the Service.
            </p>
            <p>
              You represent and warrant that:
            </p>
            <ul>
              <li>You own or have the necessary rights to the User Content you submit.</li>
              <li>Your User Content does not violate the privacy rights, publicity rights, copyright rights, or other rights of any person or entity.</li>
              <li>Your User Content does not contain any material that could be considered harmful, threatening, unlawful, defamatory, obscene, or otherwise objectionable.</li>
            </ul>
            <p>
              We reserve the right to review, remove, or modify User Content at our sole discretion.
            </p>
            
            <h2>Subscriptions and Payments</h2>
            
            <h3>Subscription Plans</h3>
            <p>
              We offer various subscription plans, including free and paid options. The features available to you depend on the type of subscription you or your Educational Institution has selected.
            </p>
            
            <h3>Payment Terms</h3>
            <p>
              For paid subscriptions:
            </p>
            <ul>
              <li>Payments are due in advance according to the billing cycle you select.</li>
              <li>You authorise us to charge your chosen payment method for all fees incurred.</li>
              <li>All fees are exclusive of taxes unless stated otherwise.</li>
              <li>Subscription fees are non-refundable except as required by law or as explicitly stated in these Terms.</li>
            </ul>
            
            <h3>Subscription Changes and Cancellations</h3>
            <p>
              You may change or cancel your subscription at any time through your account settings or by contacting us. Changes or cancellations will take effect at the end of your current billing cycle.
            </p>
            <p>
              We reserve the right to change our subscription fees upon reasonable notice. Any fee changes will take effect at the start of the next billing cycle following the date of the fee change.
            </p>
            
            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will immediately cease. If your account is terminated, we may delete any Content or data associated with your account.
            </p>
            <p>
              All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
            
            <h2>Disclaimers</h2>
            <p>
              The Service is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the operation of the Service or the information, content, or materials included on the Service.
            </p>
            <p>
              We do not warrant that:
            </p>
            <ul>
              <li>The Service will be uninterrupted or error-free.</li>
              <li>Defects will be corrected.</li>
              <li>The Service or the server that makes it available are free of viruses or other harmful components.</li>
              <li>The Service will meet your specific requirements or expectations.</li>
            </ul>
            <p>
              While our Content is developed by educational psychology professionals, it is provided for general educational purposes only and is not a substitute for professional advice, diagnosis, or treatment. We do not guarantee specific educational outcomes or results from using our Service.
            </p>
            
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, in no event shall EdPsych Connect, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul>
              <li>Your access to or use of or inability to access or use the Service.</li>
              <li>Any conduct or content of any third party on the Service.</li>
              <li>Any content obtained from the Service.</li>
              <li>Unauthorised access, use, or alteration of your transmissions or content.</li>
            </ul>
            <p>
              Our liability is limited whether or not we have been informed of the possibility of such damages, and even if a remedy set forth in these Terms is found to have failed of its essential purpose.
            </p>
            <p>
              Nothing in these Terms excludes or limits our liability for death or personal injury arising from our negligence, or fraud or fraudulent misrepresentation, or any other liability that cannot be excluded or limited by English law.
            </p>
            
            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless EdPsych Connect, its directors, employees, partners, agents, suppliers, and affiliates from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
            
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.
            </p>
            <p>
              Any legal action or proceeding arising out of or relating to these Terms or the Service shall be brought exclusively in the courts of England and Wales, and you consent to the personal jurisdiction of such courts.
            </p>
            
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last Updated" date.
            </p>
            <p>
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the new Terms, you must stop using the Service.
            </p>
            
            <h2>Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.
            </p>
            
            <h2>Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy and any other legal notices published by us on the Service, constitute the entire agreement between you and us regarding the Service.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@edpsychconnect.com</li>
              <li>Post: EdPsych Connect Limited, [Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
