'use client';

import React from 'react';
import { EnhancedHeader, EnhancedFooter } from '@/components/layout/enhanced-header-footer';
import { Container, Typography, Card } from '@/components/ui/enhanced-layout-components';
import { Button } from '@/components/ui/enhanced-form-components';
import Link from 'next/link';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Typography variant="h1" className="mb-6">
              Cookie Policy
            </Typography>
            
            <Typography variant="body" className="mb-8">
              Last Updated: 1 June 2025
            </Typography>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                1. Introduction
              </Typography>
              
              <Typography variant="body" className="mb-4">
                This Cookie Policy explains how EdPsych Connect Limited ("we," "our," or "us") uses cookies and similar technologies on our website and platform (collectively, the "Services"). This policy provides you with information about how we use cookies, what types of cookies we use, and how you can control them.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                By using our Services, you agree to our use of cookies in accordance with this Cookie Policy. If you do not accept the use of cookies, please disable them as explained below or refrain from using our Services.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                2. What Are Cookies?
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how their site is being used.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                In addition to cookies, we may use other similar technologies such as web beacons, pixels, and local storage to collect information about how you use our Services.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                3. Types of Cookies We Use
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We use the following types of cookies on our Services:
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.1 Essential Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These cookies are necessary for the operation of our Services. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies as the Services would not function properly without them.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.2 Performance and Analytics Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These cookies collect information about how visitors use our Services, such as which pages they visit most often and if they receive error messages. The information collected is aggregated and anonymous. We use this data to improve our Services and understand how users interact with our platform.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.3 Functionality Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These cookies allow our Services to remember choices you make and provide enhanced, personalized features. They may be set by us or by third-party providers whose services we have added to our pages. If you disable these cookies, some or all of these services may not function properly.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.4 Targeting and Advertising Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These cookies are used to deliver content that is more relevant to you and your interests. They may be used to deliver targeted advertising or to limit the number of times you see an advertisement. They also help us measure the effectiveness of advertising campaigns. We may share this information with third parties for these purposes.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                3.5 Educational and Learning Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                These cookies are specific to our educational platform and help us track learning progress, preferences, and patterns to provide personalized educational experiences. They store information about completed lessons, assessment results, learning preferences, and other educational data to enhance the learning experience.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                4. Specific Cookies We Use
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Below is a detailed list of the cookies we use on our Services:
              </Typography>
              
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Cookie Name</th>
                    <th className="border p-2 text-left">Type</th>
                    <th className="border p-2 text-left">Purpose</th>
                    <th className="border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">edpsych_session</td>
                    <td className="border p-2">Essential</td>
                    <td className="border p-2">Maintains user session and authentication</td>
                    <td className="border p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border p-2">edpsych_preferences</td>
                    <td className="border p-2">Functionality</td>
                    <td className="border p-2">Stores user preferences and settings</td>
                    <td className="border p-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border p-2">edpsych_analytics</td>
                    <td className="border p-2">Performance</td>
                    <td className="border p-2">Collects anonymous usage data</td>
                    <td className="border p-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border p-2">edpsych_learning</td>
                    <td className="border p-2">Educational</td>
                    <td className="border p-2">Tracks learning progress and preferences</td>
                    <td className="border p-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border p-2">edpsych_accessibility</td>
                    <td className="border p-2">Functionality</td>
                    <td className="border p-2">Stores accessibility settings</td>
                    <td className="border p-2">1 year</td>
                  </tr>
                </tbody>
              </table>
              
              <Typography variant="body" className="mb-4">
                We may update this list as we improve our Services or change our cookie usage. Please check this Cookie Policy regularly for the most up-to-date information.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                5. Third-Party Cookies
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Some cookies are placed by third parties on our behalf. These third parties may include:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Analytics providers</strong> (such as Google Analytics) to help us understand how users interact with our Services</li>
                <li><strong>Payment processors</strong> (such as Stripe) to enable secure payment transactions</li>
                <li><strong>Content delivery networks</strong> to optimize content delivery and performance</li>
                <li><strong>Educational technology partners</strong> to enhance our learning features</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our Services and other websites. This information may be used to, among other things, analyze and track data, determine the popularity of certain content, and better understand your online activity.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We do not control these third parties' tracking technologies or how they may be used. If you have questions about an advertisement or other targeted content, you should contact the responsible provider directly.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                6. Cookie Management
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                6.1 Cookie Preferences
              </Typography>
              
              <Typography variant="body" className="mb-4">
                When you first visit our Services, you will be presented with a cookie banner that allows you to accept or decline non-essential cookies. You can change your preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
              </Typography>
              
              <Typography variant="h3" className="mb-4">
                6.2 Browser Settings
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may impact your overall user experience. Below are links to instructions on how to manage cookies in common web browsers:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
              </ul>
              
              <Typography variant="h3" className="mb-4">
                6.3 Do Not Track
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your online activity tracked. These features are not yet uniform, so we do not currently respond to such signals.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                7. Cookies and Children
              </Typography>
              
              <Typography variant="body" className="mb-4">
                Our Services are designed for use by children and young people within the UK educational system. We take special precautions with cookies and similar technologies when they are used by children:
              </Typography>
              
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>We only use essential cookies and educational cookies by default for users identified as children under 13</li>
                <li>We obtain verifiable parental consent before enabling non-essential cookies for children under 13</li>
                <li>We provide age-appropriate explanations about cookies for younger users</li>
                <li>We do not use targeting or advertising cookies for content directed at children under 16</li>
              </ul>
              
              <Typography variant="body" className="mb-4">
                Parents can review and manage their children's cookie settings through the parental controls in their account settings.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                8. Changes to This Cookie Policy
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last Updated" date.
              </Typography>
              
              <Typography variant="body" className="mb-4">
                We encourage you to review this Cookie Policy periodically for any changes. Your continued use of our Services after any changes to this Cookie Policy constitutes your acceptance of the changes.
              </Typography>
            </Card>
            
            <Card className="p-8 mb-8">
              <Typography variant="h2" className="mb-6">
                9. Contact Us
              </Typography>
              
              <Typography variant="body" className="mb-4">
                If you have any questions about this Cookie Policy or our data practices, please contact us at:
              </Typography>
              
              <Typography variant="body" className="mb-4">
                <strong>Data Protection Officer</strong><br />
                EdPsych Connect Limited<br />
                Email: privacy@edpsychconnect.co.uk<br />
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
