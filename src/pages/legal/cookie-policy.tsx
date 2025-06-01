import React from 'react';
import Head from 'next/head';
import { Container } from '@/components/ui/container';

export default function CookiePolicyPage() {
  const lastUpdated = "23 May 2025";
  const version = "1.0";
  
  return (
    <>
      <Head>
        <title>Cookie Policy | EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect Cookie Policy - Learn how we use cookies and similar technologies on our platform" />
      </Head>
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Cookie Policy</h1>
          
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
              This Cookie Policy explains how EdPsych Connect Limited ("we", "our", "us", "EdPsych Connect") uses cookies and similar technologies to recognise you when you visit our website and use our platform. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            <p>
              This Cookie Policy should be read together with our Privacy Policy and Terms of Service.
            </p>
            
            <h2>What Are Cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>
            <p>
              Cookies set by the website owner (in this case, EdPsych Connect) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognise your computer both when it visits the website in question and also when it visits certain other websites.
            </p>
            
            <h2>Why Do We Use Cookies?</h2>
            <p>
              We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website and platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our platform. Third parties serve cookies through our website for analytics, personalisation, and advertising purposes.
            </p>
            
            <h2>Types of Cookies We Use</h2>
            <p>
              The specific types of first and third-party cookies served through our website and platform and the purposes they perform are described below:
            </p>
            
            <h3>Essential Cookies</h3>
            <p>
              These cookies are strictly necessary to provide you with services available through our website and platform and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website and platform, you cannot refuse them without impacting how our website functions.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Purpose</th>
                  <th className="border p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">session</td>
                  <td className="border p-2">Used to maintain your authenticated session</td>
                  <td className="border p-2">Session</td>
                </tr>
                <tr>
                  <td className="border p-2">csrf_token</td>
                  <td className="border p-2">Helps protect against Cross-Site Request Forgery attacks</td>
                  <td className="border p-2">Session</td>
                </tr>
                <tr>
                  <td className="border p-2">cookie_consent</td>
                  <td className="border p-2">Stores your cookie consent preferences</td>
                  <td className="border p-2">1 year</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Performance and Functionality Cookies</h3>
            <p>
              These cookies are used to enhance the performance and functionality of our website and platform but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Purpose</th>
                  <th className="border p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">language</td>
                  <td className="border p-2">Remembers your language preference</td>
                  <td className="border p-2">1 year</td>
                </tr>
                <tr>
                  <td className="border p-2">ui_settings</td>
                  <td className="border p-2">Stores your interface preferences (e.g., high contrast mode)</td>
                  <td className="border p-2">1 year</td>
                </tr>
                <tr>
                  <td className="border p-2">recent_activity</td>
                  <td className="border p-2">Remembers your recent activities to improve navigation</td>
                  <td className="border p-2">30 days</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Analytics and Customisation Cookies</h3>
            <p>
              These cookies collect information that is used either in aggregate form to help us understand how our website and platform are being used or how effective our marketing campaigns are, or to help us customise our website and platform for you.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Purpose</th>
                  <th className="border p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">_ga</td>
                  <td className="border p-2">Google Analytics - Used to distinguish users</td>
                  <td className="border p-2">2 years</td>
                </tr>
                <tr>
                  <td className="border p-2">_gid</td>
                  <td className="border p-2">Google Analytics - Used to distinguish users</td>
                  <td className="border p-2">24 hours</td>
                </tr>
                <tr>
                  <td className="border p-2">_gat</td>
                  <td className="border p-2">Google Analytics - Used to throttle request rate</td>
                  <td className="border p-2">1 minute</td>
                </tr>
                <tr>
                  <td className="border p-2">hotjar_*</td>
                  <td className="border p-2">Hotjar - Used to understand user behaviour and feedback</td>
                  <td className="border p-2">Varies</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Educational Progress Cookies</h3>
            <p>
              These cookies are specific to our educational platform and help us track your progress and personalise your learning experience.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Purpose</th>
                  <th className="border p-2 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">learning_progress</td>
                  <td className="border p-2">Tracks your progress through educational modules</td>
                  <td className="border p-2">1 year</td>
                </tr>
                <tr>
                  <td className="border p-2">quiz_results</td>
                  <td className="border p-2">Stores recent quiz and assessment results</td>
                  <td className="border p-2">90 days</td>
                </tr>
                <tr>
                  <td className="border p-2">learning_preferences</td>
                  <td className="border p-2">Remembers your learning style preferences</td>
                  <td className="border p-2">1 year</td>
                </tr>
              </tbody>
            </table>
            
            <h2>How Can You Control Cookies?</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences through our cookie consent banner that appears when you first visit our website.
            </p>
            <p>
              You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website and platform though your access to some functionality and areas may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information.
            </p>
            <p>
              In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">http://www.aboutads.info/choices/</a> or <a href="http://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer">http://www.youronlinechoices.com</a>.
            </p>
            
            <h3>Browser Controls</h3>
            <p>
              Most browsers allow you to control cookies through their settings, which may be adapted to reflect your consent to the use of cookies. Further, most browsers also enable you to review and erase cookies, including EdPsych Connect cookies. To learn more about cookie controls in your browser, please see the links below:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-gb/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari (Desktop)</a></li>
              <li><a href="https://support.apple.com/en-gb/HT201265" target="_blank" rel="noopener noreferrer">Safari (Mobile)</a></li>
              <li><a href="https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DAndroid" target="_blank" rel="noopener noreferrer">Android Browser</a></li>
            </ul>
            
            <h2>Special Considerations for Children</h2>
            <p>
              As an educational platform that may be used by children, we take special care with cookies that may be used by children under 13 years of age. We:
            </p>
            <ul>
              <li>Only use essential cookies for users identified as children without parental consent</li>
              <li>Use age-appropriate language in our cookie consent mechanisms for younger users</li>
              <li>Do not use cookies for targeted advertising to children</li>
              <li>Obtain verifiable parental consent before using non-essential cookies for children under 13</li>
              <li>Provide simplified cookie controls for educational institution administrators</li>
            </ul>
            
            <h2>Do Not Track</h2>
            <p>
              Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your online activity tracked. Given that there is not yet a common understanding of how to interpret the DNT signal, our website and platform do not currently respond to DNT signals.
            </p>
            
            <h2>Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised Cookie Policy on our website. We encourage you to periodically review this page for the latest information on our cookie practices.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@edpsychconnect.com</li>
              <li>Post: EdPsych Connect Limited, [Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
          </div>
        </div>
      </Container>
    </>
  );
}
