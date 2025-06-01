import React from 'react';
import Head from 'next/head';
import { Container } from '@/components/ui/container';

export default function GDPRCompliancePage() {
  const lastUpdated = "23 May 2025";
  const version = "1.0";
  
  return (
    <>
      <Head>
        <title>GDPR Compliance | EdPsych Connect</title>
        <meta name="description" content="EdPsych Connect GDPR Compliance Statement - How we comply with data protection regulations" />
      </Head>
      
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">GDPR Compliance Statement</h1>
          
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
              EdPsych Connect Limited ("we", "our", "us", "EdPsych Connect") is committed to protecting the privacy and security of your personal data. This GDPR Compliance Statement explains how we comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p>
              As an educational platform that processes personal data of children, parents, teachers, and educational professionals, we take our data protection responsibilities very seriously. This statement should be read alongside our Privacy Policy, which provides detailed information about how we collect, use, and protect your personal data.
            </p>
            
            <h2>Our Data Protection Principles</h2>
            <p>
              We adhere to the following principles when processing personal data:
            </p>
            <ul>
              <li><strong>Lawfulness, fairness, and transparency:</strong> We process personal data lawfully, fairly, and in a transparent manner.</li>
              <li><strong>Purpose limitation:</strong> We collect personal data for specified, explicit, and legitimate purposes and do not process it in a manner incompatible with those purposes.</li>
              <li><strong>Data minimisation:</strong> We ensure that personal data is adequate, relevant, and limited to what is necessary for the purposes for which it is processed.</li>
              <li><strong>Accuracy:</strong> We take reasonable steps to ensure personal data is accurate and, where necessary, kept up to date.</li>
              <li><strong>Storage limitation:</strong> We keep personal data in a form that permits identification of data subjects for no longer than necessary for the purposes for which it is processed.</li>
              <li><strong>Integrity and confidentiality:</strong> We process personal data in a manner that ensures appropriate security, including protection against unauthorised or unlawful processing and against accidental loss, destruction, or damage.</li>
              <li><strong>Accountability:</strong> We are responsible for and can demonstrate compliance with the data protection principles.</li>
            </ul>
            
            <h2>Lawful Basis for Processing</h2>
            <p>
              Under the UK GDPR, we must have a valid lawful basis for processing personal data. Depending on the specific processing activity, we rely on one or more of the following lawful bases:
            </p>
            
            <h3>Consent</h3>
            <p>
              We obtain clear and affirmative consent for certain processing activities, particularly those involving children under 13 years of age. Our consent mechanisms are:
            </p>
            <ul>
              <li>Clear and in plain language appropriate to the age of the data subject</li>
              <li>Freely given, specific, informed, and unambiguous</li>
              <li>Provided through an affirmative action (opt-in)</li>
              <li>Recorded and documented</li>
              <li>Easy to withdraw at any time</li>
            </ul>
            
            <h3>Contract</h3>
            <p>
              We process personal data where necessary for the performance of a contract to which the data subject is a party, or to take steps at the request of the data subject prior to entering into a contract.
            </p>
            
            <h3>Legal Obligation</h3>
            <p>
              We process personal data where necessary for compliance with a legal obligation to which we are subject under UK law.
            </p>
            
            <h3>Vital Interests</h3>
            <p>
              In rare circumstances, we may process personal data to protect the vital interests of the data subject or another person.
            </p>
            
            <h3>Public Task</h3>
            <p>
              Where we work with public educational institutions, we may process personal data where necessary for the performance of a task carried out in the public interest.
            </p>
            
            <h3>Legitimate Interests</h3>
            <p>
              We process personal data where necessary for the purposes of our legitimate interests or those of a third party, except where such interests are overridden by the interests or fundamental rights and freedoms of the data subject which require protection of personal data, particularly where the data subject is a child.
            </p>
            <p>
              When relying on legitimate interests, we conduct and document a legitimate interests assessment (LIA) to ensure that the processing is necessary and that there is a balance between our interests and the individual's privacy rights.
            </p>
            
            <h2>Special Category Data</h2>
            <p>
              As an educational platform, we may process special category data, such as information about health conditions or learning disabilities that affect educational needs. When processing such data, we ensure that we have an additional lawful basis under Article 9 of the UK GDPR, such as:
            </p>
            <ul>
              <li>Explicit consent</li>
              <li>Necessary for carrying out obligations in the field of employment, social security, or social protection law</li>
              <li>Necessary to protect vital interests where the data subject is physically or legally incapable of giving consent</li>
              <li>Necessary for the establishment, exercise, or defence of legal claims</li>
              <li>Necessary for reasons of substantial public interest</li>
            </ul>
            
            <h2>Children's Data</h2>
            <p>
              We take additional measures to protect children's personal data, in compliance with the UK GDPR and the Age Appropriate Design Code:
            </p>
            <ul>
              <li>We provide privacy information in clear, age-appropriate language</li>
              <li>We obtain verifiable parental consent for children under 13 years of age</li>
              <li>We only collect the minimum data necessary for providing our educational services</li>
              <li>We do not use children's data for marketing or advertising purposes without explicit consent</li>
              <li>We implement age-appropriate design principles throughout our platform</li>
              <li>We conduct Data Protection Impact Assessments for processing activities involving children's data</li>
              <li>We provide enhanced data subject rights for children and their parents/guardians</li>
            </ul>
            
            <h2>Data Subject Rights</h2>
            <p>
              We respect and uphold the rights of individuals under the UK GDPR. These rights include:
            </p>
            <ul>
              <li><strong>Right to be informed:</strong> We provide clear and transparent information about how we process personal data through our Privacy Policy and other notices.</li>
              <li><strong>Right of access:</strong> Individuals can request a copy of their personal data and information about how it is processed.</li>
              <li><strong>Right to rectification:</strong> Individuals can request correction of inaccurate personal data or completion of incomplete data.</li>
              <li><strong>Right to erasure:</strong> Individuals can request deletion of their personal data in certain circumstances.</li>
              <li><strong>Right to restrict processing:</strong> Individuals can request restriction of processing of their personal data in certain circumstances.</li>
              <li><strong>Right to data portability:</strong> Individuals can request their personal data in a structured, commonly used, and machine-readable format and have it transferred to another controller.</li>
              <li><strong>Right to object:</strong> Individuals can object to processing based on legitimate interests, direct marketing, and processing for research or statistical purposes.</li>
              <li><strong>Rights related to automated decision making and profiling:</strong> Individuals have rights regarding automated decision making, including profiling.</li>
            </ul>
            <p>
              We have implemented procedures to respond to data subject requests within the one-month timeframe required by the UK GDPR, with the possibility of extension by up to two months for complex or numerous requests.
            </p>
            
            <h2>Data Protection Impact Assessments</h2>
            <p>
              We conduct Data Protection Impact Assessments (DPIAs) for processing activities that are likely to result in a high risk to individuals' rights and freedoms, particularly when:
            </p>
            <ul>
              <li>Implementing new technologies</li>
              <li>Processing special category data on a large scale</li>
              <li>Processing children's data</li>
              <li>Conducting systematic monitoring</li>
              <li>Making automated decisions with significant effects</li>
            </ul>
            <p>
              Our DPIA process includes:
            </p>
            <ul>
              <li>Describing the processing operations and purposes</li>
              <li>Assessing necessity and proportionality</li>
              <li>Identifying and assessing risks to individuals</li>
              <li>Identifying measures to mitigate those risks</li>
              <li>Consulting with relevant stakeholders where appropriate</li>
            </ul>
            
            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including:
            </p>
            <ul>
              <li>Encryption of personal data</li>
              <li>Ability to ensure ongoing confidentiality, integrity, availability, and resilience of processing systems</li>
              <li>Ability to restore access to personal data in a timely manner in the event of a physical or technical incident</li>
              <li>Regular testing, assessing, and evaluating of the effectiveness of security measures</li>
              <li>Staff training on data protection and security</li>
              <li>Access controls and authentication procedures</li>
              <li>Regular security assessments and penetration testing</li>
            </ul>
            
            <h2>Data Breach Notification</h2>
            <p>
              We have implemented procedures for detecting, reporting, and investigating personal data breaches. In the event of a breach that is likely to result in a risk to the rights and freedoms of individuals, we will:
            </p>
            <ul>
              <li>Notify the Information Commissioner's Office (ICO) without undue delay and, where feasible, within 72 hours of becoming aware of the breach</li>
              <li>Notify affected individuals without undue delay when the breach is likely to result in a high risk to their rights and freedoms</li>
              <li>Document all breaches, including facts, effects, and remedial action taken</li>
            </ul>
            
            <h2>International Data Transfers</h2>
            <p>
              When transferring personal data outside the UK or European Economic Area (EEA), we ensure that appropriate safeguards are in place, such as:
            </p>
            <ul>
              <li>Standard Contractual Clauses approved by the UK Information Commissioner's Office</li>
              <li>Adequacy decisions by the UK government</li>
              <li>Binding corporate rules</li>
              <li>Explicit consent for the transfer (in limited circumstances)</li>
            </ul>
            <p>
              We maintain a record of all international data transfers and regularly review our transfer mechanisms to ensure ongoing compliance.
            </p>
            
            <h2>Records of Processing Activities</h2>
            <p>
              We maintain records of our processing activities, including:
            </p>
            <ul>
              <li>Name and contact details of the controller and, where applicable, the data protection officer</li>
              <li>Purposes of the processing</li>
              <li>Description of categories of data subjects and personal data</li>
              <li>Categories of recipients to whom personal data has been or will be disclosed</li>
              <li>International transfers and the safeguards in place</li>
              <li>Envisaged time limits for erasure of different categories of data</li>
              <li>General description of technical and organisational security measures</li>
            </ul>
            
            <h2>Data Protection Officer</h2>
            <p>
              We have appointed a Data Protection Officer (DPO) who is responsible for:
            </p>
            <ul>
              <li>Informing and advising us and our employees about our obligations under data protection laws</li>
              <li>Monitoring compliance with data protection laws and our policies</li>
              <li>Providing advice on Data Protection Impact Assessments</li>
              <li>Cooperating with the Information Commissioner's Office</li>
              <li>Acting as a contact point for data subjects and the supervisory authority</li>
            </ul>
            <p>
              Our DPO can be contacted at:
            </p>
            <ul>
              <li>Email: dpo@edpsychconnect.com</li>
              <li>Post: Data Protection Officer, EdPsych Connect Limited, [Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
            
            <h2>Training and Awareness</h2>
            <p>
              We ensure that all staff who handle personal data receive appropriate training on data protection. Our training programme includes:
            </p>
            <ul>
              <li>Key principles of data protection</li>
              <li>Individual rights under the UK GDPR</li>
              <li>Recognising and handling data subject requests</li>
              <li>Identifying and reporting data breaches</li>
              <li>Security measures and best practices</li>
              <li>Special considerations for educational data and children's data</li>
            </ul>
            <p>
              We maintain records of all training completed and conduct regular refresher training.
            </p>
            
            <h2>Compliance Monitoring and Review</h2>
            <p>
              We regularly monitor and review our data protection compliance through:
            </p>
            <ul>
              <li>Internal audits</li>
              <li>Policy reviews</li>
              <li>Staff awareness checks</li>
              <li>Security testing</li>
              <li>Data mapping exercises</li>
              <li>Reviewing and updating our Record of Processing Activities</li>
            </ul>
            <p>
              This GDPR Compliance Statement is reviewed annually or whenever there are significant changes to our processing activities or relevant legislation.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our GDPR compliance or wish to exercise your data protection rights, please contact our Data Protection Officer at:
            </p>
            <ul>
              <li>Email: dpo@edpsychconnect.com</li>
              <li>Post: Data Protection Officer, EdPsych Connect Limited, [Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
            <p>
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
