import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Globe, Shield, FileText, AlertTriangle, Check, Settings, HelpCircle } from 'lucide-react';

/**
 * Compliance & Internationalization Component for EdPsych Connect
 * Provides an overview and management interface for data protection compliance,
 * accessibility standards, internationalization, and localization features.
 */
const ComplianceInternationalization = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('dataProtection');
  const [isLoading, setIsLoading] = useState(false);

  // Sample compliance data
  const [complianceData, setComplianceData] = useState({
    dataProtection: {
      gdpr: {
        status: 'Compliant',
        lastAudit: '2 weeks ago',
        dataProcessingAgreements: 'In place',
        dataRetentionPolicies: 'Implemented',
        dataSubjectRights: 'Supported',
        breachNotificationProcess: 'Established'
      },
      ukDpa: {
        status: 'Compliant',
        lastAudit: '2 weeks ago',
        registrationStatus: 'Registered with ICO',
        dataProtectionOfficer: 'Appointed',
        impactAssessments: 'Completed'
      },
      coppa: {
        status: 'Compliant',
        lastAudit: '1 month ago',
        parentalConsent: 'Implemented',
        dataCollection: 'Minimal necessary',
        privacyPolicy: 'Child-friendly version available'
      },
      ferpa: {
        status: 'Compliant',
        lastAudit: '1 month ago',
        educationalRecords: 'Protected',
        parentalAccess: 'Supported',
        consentMechanisms: 'Implemented'
      }
    },
    accessibility: {
      wcag: {
        status: 'AA Compliant',
        lastAudit: '3 weeks ago',
        perceivable: 'Implemented',
        operable: 'Implemented',
        understandable: 'Implemented',
        robust: 'Implemented'
      },
      aria: {
        status: 'Implemented',
        lastAudit: '3 weeks ago',
        landmarks: 'Used appropriately',
        roles: 'Defined correctly',
        states: 'Managed properly'
      },
      ukAccessibility: {
        status: 'Compliant',
        lastAudit: '3 weeks ago',
        publicSectorRegulations: 'Met',
        accessibilityStatement: 'Published'
      }
    }
  });

  // Sample internationalization data
  const [i18nData, setI18nData] = useState({
    languages: [
      { code: 'en-GB', name: 'English (UK)', status: 'Complete', translationProgress: '100%', default: true },
      { code: 'en-US', name: 'English (US)', status: 'Complete', translationProgress: '100%', default: false },
      { code: 'cy', name: 'Welsh', status: 'In Progress', translationProgress: '85%', default: false },
      { code: 'gd', name: 'Scottish Gaelic', status: 'In Progress', translationProgress: '70%', default: false },
      { code: 'fr', name: 'French', status: 'In Progress', translationProgress: '90%', default: false },
      { code: 'de', name: 'German', status: 'In Progress', translationProgress: '85%', default: false },
      { code: 'es', name: 'Spanish', status: 'In Progress', translationProgress: '80%', default: false },
      { code: 'pl', name: 'Polish', status: 'In Progress', translationProgress: '75%', default: false },
      { code: 'ur', name: 'Urdu', status: 'In Progress', translationProgress: '60%', default: false },
      { code: 'ar', name: 'Arabic', status: 'In Progress', translationProgress: '65%', default: false }
    ],
    localization: {
      dateFormats: 'Supported',
      timeFormats: 'Supported',
      currencies: 'Supported',
      numberFormats: 'Supported',
      rightToLeft: 'Supported',
      culturalAdaptation: 'In Progress'
    },
    contentAdaptation: {
      curriculumAlignment: 'UK-focused with international adaptations',
      culturalReferences: 'Localized where appropriate',
      examples: 'Culturally relevant',
      imagery: 'Culturally diverse and appropriate'
    }
  });

  // Function to run compliance audit
  const runComplianceAudit = (complianceType) => {
    console.log(`Running ${complianceType} compliance audit...`);
    // In a real implementation, this would trigger an audit process
    alert(`${complianceType} compliance audit initiated.`);
  };

  // Function to view compliance details
  const viewComplianceDetails = (complianceType) => {
    console.log(`Viewing ${complianceType} compliance details...`);
    // In a real implementation, this would navigate to detailed compliance information
    alert(`Navigating to ${complianceType} compliance details.`);
  };

  // Function to manage language settings
  const manageLanguage = (languageCode) => {
    console.log(`Managing language settings for ${languageCode}...`);
    // In a real implementation, this would open language management interface
    alert(`Opening language management for ${languageCode}.`);
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Compliance & Internationalization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage compliance standards, accessibility, and language support
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('dataProtection')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'dataProtection'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span>Data Protection</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'accessibility'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span>Accessibility</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('languages')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'languages'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              <span>Languages</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('localization')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === 'localization'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              <span>Localization</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Data Protection Tab */}
        {activeTab === 'dataProtection' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Data Protection Compliance
              </h3>
              <button 
                onClick={() => runComplianceAudit('Data Protection')}
                className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Run Compliance Audit
              </button>
            </div>

            <div className="space-y-6">
              {/* GDPR Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      GDPR Compliance
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.dataProtection.gdpr.status === 'Compliant'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.dataProtection.gdpr.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.dataProtection.gdpr).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('GDPR')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>

              {/* UK DPA Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      UK Data Protection Act
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.dataProtection.ukDpa.status === 'Compliant'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.dataProtection.ukDpa.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.dataProtection.ukDpa).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('UK DPA')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>

              {/* COPPA Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      COPPA Compliance
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.dataProtection.coppa.status === 'Compliant'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.dataProtection.coppa.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.dataProtection.coppa).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('COPPA')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>

              {/* FERPA Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      FERPA Compliance
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.dataProtection.ferpa.status === 'Compliant'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.dataProtection.ferpa.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.dataProtection.ferpa).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('FERPA')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === 'accessibility' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Accessibility Compliance
              </h3>
              <button 
                onClick={() => runComplianceAudit('Accessibility')}
                className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Run Accessibility Audit
              </button>
            </div>

            <div className="space-y-6">
              {/* WCAG Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      WCAG 2.1 Compliance
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.accessibility.wcag.status.includes('Compliant')
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.accessibility.wcag.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.accessibility.wcag).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('WCAG')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>

              {/* ARIA Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      ARIA Implementation
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.accessibility.aria.status === 'Implemented'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.accessibility.aria.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.accessibility.aria).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('ARIA')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>

              {/* UK Accessibility Section */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      UK Accessibility Regulations
                    </h4>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complianceData.accessibility.ukAccessibility.status === 'Compliant'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                  }`}>
                    {complianceData.accessibility.ukAccessibility.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {Object.entries(complianceData.accessibility.ukAccessibility).filter(([key]) => key !== 'status').map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => viewComplianceDetails('UK Accessibility')}
                  className="text-sm text-primary hover:text-primary/90"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Languages Tab */}
        {activeTab === 'languages' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Supported Languages
              </h3>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary/90">
                Add Language
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {i18nData.languages.map(language => (
                <div 
                  key={language.code}
                  className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                        {language.name}
                        {language.default && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
                            Default
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {language.code}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      language.status === 'Complete'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    }`}>
                      {language.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Translation Progress</span>
                      <span>{language.translationProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: language.translationProgress }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => manageLanguage(language.code)}
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Localization Tab */}
        {activeTab === 'localization' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Localization Settings
            </h3>

            <div className="space-y-6">
              {/* Format Support */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Format Support
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(i18nData.localization).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className={`${
                        value === 'Supported' 
                          ? 'text-green-600 dark:text-green-400' 
                          : value === 'In Progress'
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Adaptation */}
              <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Content Adaptation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(i18nData.contentAdaptation).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-900 dark:text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceInternationalization;
