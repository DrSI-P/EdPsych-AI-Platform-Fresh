import React from 'react';
import Head from 'next/head';
import { Container } from '@/components/ui/container';

export default function AccessibilityStatementPage() {
  const lastUpdated = "23 May 2025";
  const version = "1.0";
  
  return (
    <>
      <Head>
        <title>Accessibility Statement | EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect Accessibility Statement - Our commitment to making our platform accessible to all users" />
      </Head>
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Accessibility Statement</h1>
          
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
            <h2>Our Commitment to Accessibility</h2>
            <p>
              EdPsych Connect is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            
            <h2>Conformance Status</h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p>
              EdPsych Connect is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
            </p>
            
            <h2>Accessibility Features</h2>
            <p>
              EdPsych Connect includes the following accessibility features:
            </p>
            <ul>
              <li>Keyboard navigation support throughout the platform</li>
              <li>Text alternatives for non-text content</li>
              <li>Ability to resize text without loss of content or functionality</li>
              <li>High contrast mode option</li>
              <li>Clear headings and labels</li>
              <li>Consistent navigation</li>
              <li>Error identification and suggestions</li>
              <li>Compatible with screen readers</li>
              <li>Voice input capabilities for users who struggle with typing</li>
              <li>Customizable reading settings for users with dyslexia</li>
            </ul>
            
            <h2>Known Accessibility Issues</h2>
            <p>
              Despite our efforts to ensure accessibility of EdPsych Connect, there may be some limitations. Below is a list of known accessibility issues:
            </p>
            <ul>
              <li>Some older PDF documents may not be fully accessible to screen reader users</li>
              <li>Some interactive educational games may not be fully navigable by keyboard</li>
              <li>Some video content may not have complete captions or audio descriptions</li>
              <li>Some complex data visualizations may not have adequate text alternatives</li>
            </ul>
            <p>
              We are working to address these issues and are committed to resolving them in future updates.
            </p>
            
            <h2>Compatibility with Browsers and Assistive Technology</h2>
            <p>
              EdPsych Connect is designed to be compatible with the following assistive technologies:
            </p>
            <ul>
              <li>Screen readers (including JAWS, NVDA, VoiceOver, and TalkBack)</li>
              <li>Speech recognition software</li>
              <li>Screen magnifiers</li>
              <li>Alternative input devices</li>
            </ul>
            <p>
              The platform is compatible with recent versions of major browsers, including:
            </p>
            <ul>
              <li>Google Chrome</li>
              <li>Mozilla Firefox</li>
              <li>Apple Safari</li>
              <li>Microsoft Edge</li>
            </ul>
            
            <h2>Technical Specifications</h2>
            <p>
              Accessibility of EdPsych Connect relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
            </p>
            <ul>
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p>
              These technologies are relied upon for conformance with the accessibility standards used.
            </p>
            
            <h2>Assessment Approach</h2>
            <p>
              EdPsych Connect assessed the accessibility of this platform by the following approaches:
            </p>
            <ul>
              <li>Self-evaluation</li>
              <li>External evaluation by accessibility specialists</li>
              <li>User testing with individuals with disabilities</li>
              <li>Automated testing tools</li>
            </ul>
            
            <h2>Feedback and Contact Information</h2>
            <p>
              We welcome your feedback on the accessibility of EdPsych Connect. Please let us know if you encounter accessibility barriers:
            </p>
            <ul>
              <li>Email: accessibility@edpsychconnect.com</li>
              <li>Phone: [Phone Number]</li>
              <li>Postal address: EdPsych Connect Limited, [Address]</li>
            </ul>
            <p>
              We try to respond to feedback within 3 business days.
            </p>
            
            <h2>Additional Accessibility Resources and Options</h2>
            <p>
              EdPsych Connect provides the following resources to help users with specific accessibility needs:
            </p>
            <ul>
              <li>Accessibility settings panel available from any page</li>
              <li>Detailed accessibility guides for different user groups</li>
              <li>Alternative formats of educational materials upon request</li>
              <li>One-to-one support for users with accessibility needs</li>
            </ul>
            
            <h2>Formal Approval</h2>
            <p>
              This accessibility statement was created on 23 May 2025 using the <a href="https://www.w3.org/WAI/planning/statements/" target="_blank" rel="noopener noreferrer">W3C Accessibility Statement Generator Tool</a>.
            </p>
            <p>
              The statement was last reviewed and updated on 23 May 2025.
            </p>
            
            <h2>Enforcement Procedure</h2>
            <p>
              EdPsych Connect is committed to resolving accessibility issues within a reasonable timeframe based on the severity and impact of the issue. If you are not satisfied with our response to your feedback, you may contact us to escalate your issue.
            </p>
            <p>
              In the UK, the Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the 'accessibility regulations'). If you're not happy with how we respond to your complaint, contact the <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer">Equality Advisory and Support Service (EASS)</a>.
            </p>
            
            <h2>Continuous Improvement</h2>
            <p>
              EdPsych Connect is committed to a program of continuous improvement in accessibility. We regularly review our platform, policies, and procedures to ensure we are meeting or exceeding accessibility standards.
            </p>
            <p>
              Our accessibility roadmap includes:
            </p>
            <ul>
              <li>Regular accessibility audits</li>
              <li>User testing with individuals with diverse abilities</li>
              <li>Staff training on accessibility best practices</li>
              <li>Implementation of new accessibility features</li>
              <li>Remediation of identified accessibility issues</li>
            </ul>
            
            <h2>Educational Resources</h2>
            <p>
              As an educational platform, we are committed to providing resources that help educators create accessible learning experiences. We offer:
            </p>
            <ul>
              <li>Guidance on creating accessible educational materials</li>
              <li>Templates for accessible documents and presentations</li>
              <li>Training on inclusive teaching practices</li>
              <li>Resources on supporting students with diverse learning needs</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
