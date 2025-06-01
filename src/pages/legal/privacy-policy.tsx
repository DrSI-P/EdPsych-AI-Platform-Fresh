import React from 'react';
import Head from 'next/head';
import { Container } from '@/components/ui/container';

export default function PrivacyPolicyPage() {
  const lastUpdated = "23 May 2025";
  const version = "1.0";
  
  return (
    <>
      <Head>
        <title>Privacy Policy | EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect Privacy Policy - Learn how we collect, use, and protect your personal information" />
      </Head>
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
          
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
              EdPsych Connect Limited ("we", "our", "us", "EdPsych Connect") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our educational platform and services.
            </p>
            <p>
              EdPsych Connect is a UK-based educational platform designed to support teachers, parents, and students with evidence-based educational psychology resources and tools. As an educational service provider, we take our data protection responsibilities seriously, particularly regarding children's data.
            </p>
            
            <h2>Who We Are</h2>
            <p>
              EdPsych Connect Limited is a company registered in England and Wales. We are registered as a data controller with the Information Commissioner's Office (ICO).
            </p>
            <p>
              For questions about this privacy policy or our data practices, please contact our Data Protection Officer at:
            </p>
            <ul>
              <li>Email: privacy@edpsychconnect.com</li>
              <li>Post: Data Protection Officer, EdPsych Connect Limited, [Address]</li>
            </ul>
            
            <h2>Information We Collect</h2>
            
            <h3>Information You Provide to Us</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> When you register, we collect your name, email address, password, role (teacher, parent, student, professional), and institution (if applicable).</li>
              <li><strong>Profile Information:</strong> Additional information you provide in your profile, such as profile pictures, educational interests, or professional qualifications.</li>
              <li><strong>Content:</strong> Information you submit, post, or create on our platform, including comments, responses, and educational materials.</li>
              <li><strong>Communications:</strong> Information you provide when contacting us or participating in surveys or feedback forms.</li>
              <li><strong>Payment Information:</strong> If you subscribe to premium services, we collect payment details, though we do not store complete payment card information.</li>
            </ul>
            
            <h3>Information We Collect Automatically</h3>
            <p>When you use our platform, we automatically collect certain information, including:</p>
            <ul>
              <li><strong>Usage Data:</strong> Information about how you use our platform, including pages visited, features used, and time spent.</li>
              <li><strong>Device Information:</strong> Information about the device you use to access our platform, including device type, operating system, and browser type.</li>
              <li><strong>Location Information:</strong> General location information derived from your IP address.</li>
              <li><strong>Cookies and Similar Technologies:</strong> Information collected through cookies and similar technologies. For more details, please see our Cookie Policy.</li>
            </ul>
            
            <h3>Information from Third Parties</h3>
            <p>We may receive information about you from third parties, including:</p>
            <ul>
              <li>Educational institutions that use our platform</li>
              <li>Integration partners when you connect third-party services to your account</li>
              <li>Other users who may provide information about you when using our services</li>
            </ul>
            
            <h2>Children's Data</h2>
            <p>
              As an educational platform, we may collect personal information from children under 13 years of age, but only with appropriate parental or school consent and in compliance with applicable laws, including the UK GDPR and the Age Appropriate Design Code.
            </p>
            <p>
              We take additional precautions with children's data, including:
            </p>
            <ul>
              <li>Collecting only the minimum data necessary</li>
              <li>Implementing age-appropriate design principles</li>
              <li>Providing clear privacy information in age-appropriate language</li>
              <li>Obtaining verifiable parental or school consent</li>
              <li>Not using children's data for marketing or advertising purposes</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            
            <h3>To Provide and Maintain Our Services</h3>
            <ul>
              <li>Create and manage your account</li>
              <li>Deliver the educational content and features you request</li>
              <li>Personalize your learning experience</li>
              <li>Process transactions and send related information</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
            
            <h3>To Improve and Develop Our Services</h3>
            <ul>
              <li>Analyze usage patterns and trends</li>
              <li>Test and develop new features</li>
              <li>Monitor and improve platform performance and effectiveness</li>
              <li>Conduct research and analytics to improve educational outcomes</li>
            </ul>
            
            <h3>To Communicate with You</h3>
            <ul>
              <li>Send administrative messages about your account or the platform</li>
              <li>Provide updates about new features or content</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send surveys or request feedback</li>
            </ul>
            
            <h3>To Ensure Safety and Security</h3>
            <ul>
              <li>Protect against unauthorized access or potential abuse</li>
              <li>Enforce our Terms of Service</li>
              <li>Protect the rights, property, or safety of our users and the public</li>
              <li>Detect and prevent fraud or other prohibited activities</li>
            </ul>
            
            <h2>Legal Basis for Processing</h2>
            <p>Under the UK GDPR, we process your personal data on the following legal bases:</p>
            <ul>
              <li><strong>Contract:</strong> Processing necessary for the performance of our contract with you to provide our services.</li>
              <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, such as improving our services, ensuring security, and communicating with users, provided these interests are not overridden by your rights and freedoms.</li>
              <li><strong>Consent:</strong> Processing based on your specific consent, such as for sending marketing communications or collecting certain types of data.</li>
              <li><strong>Legal Obligation:</strong> Processing necessary to comply with our legal obligations.</li>
              <li><strong>Public Interest:</strong> Processing necessary for tasks carried out in the public interest, particularly relevant for our educational mission.</li>
            </ul>
            
            <h2>How We Share Your Information</h2>
            <p>We may share your information with the following categories of recipients:</p>
            
            <h3>Service Providers</h3>
            <p>
              We share information with third-party service providers who perform services on our behalf, such as hosting, data analysis, payment processing, customer service, and marketing assistance. These providers are contractually obligated to use your information only as directed by us and in accordance with this Privacy Policy.
            </p>
            
            <h3>Educational Institutions</h3>
            <p>
              If you access our platform through an educational institution, we may share information with that institution, including usage data and performance information, to support educational objectives.
            </p>
            
            <h3>Legal Requirements</h3>
            <p>
              We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
            </p>
            
            <h3>Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you of any change in ownership or uses of your information.
            </p>
            
            <h3>With Your Consent</h3>
            <p>
              We may share your information with third parties when you have given us your consent to do so.
            </p>
            
            <h2>Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include:
            </p>
            <ul>
              <li>The length of time we have an ongoing relationship with you</li>
              <li>Whether there is a legal obligation to which we are subject</li>
              <li>Whether retention is advisable in light of our legal position (e.g., for statutes of limitations, disputes, or regulatory investigations)</li>
            </ul>
            <p>
              For student data, we typically retain information only for the period necessary to provide the educational services, unless otherwise instructed by the educational institution or required by law.
            </p>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
            </p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Staff training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p>
              While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
            
            <h2>International Data Transfers</h2>
            <p>
              EdPsych Connect is based in the UK, and your information may be processed in the UK and other countries where our service providers are located. These countries may have different data protection laws than your country of residence.
            </p>
            <p>
              When we transfer personal data outside the UK or European Economic Area (EEA), we ensure that appropriate safeguards are in place, such as:
            </p>
            <ul>
              <li>Standard Contractual Clauses approved by the UK Information Commissioner's Office</li>
              <li>Ensuring the recipient country has been deemed to provide adequate protection</li>
              <li>Obtaining your consent for the transfer</li>
            </ul>
            
            <h2>Your Rights</h2>
            <p>
              Under the UK GDPR and Data Protection Act 2018, you have the following rights regarding your personal information:
            </p>
            <ul>
              <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
              <li><strong>Rectification:</strong> You can ask us to correct inaccurate or incomplete information.</li>
              <li><strong>Erasure:</strong> You can ask us to delete your personal information in certain circumstances.</li>
              <li><strong>Restriction:</strong> You can ask us to restrict the processing of your information in certain circumstances.</li>
              <li><strong>Data Portability:</strong> You can request a copy of the information you provided to us in a structured, commonly used, machine-readable format.</li>
              <li><strong>Objection:</strong> You can object to our processing of your information in certain circumstances.</li>
              <li><strong>Withdraw Consent:</strong> Where we process your information based on consent, you can withdraw that consent at any time.</li>
            </ul>
            <p>
              To exercise these rights, please contact our Data Protection Officer using the contact details provided above. We will respond to your request within one month, though in some cases we may need to extend this period.
            </p>
            <p>
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) if you believe we have not handled your personal information in accordance with data protection law.
            </p>
            
            <h2>Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our platform. This helps us provide you with a good experience, improve our platform, and personalize content and advertisements.
            </p>
            <p>
              For detailed information about the cookies we use and how to manage them, please see our Cookie Policy.
            </p>
            
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at:
            </p>
            <ul>
              <li>Email: privacy@edpsychconnect.com</li>
              <li>Post: Data Protection Officer, EdPsych Connect Limited, [Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
