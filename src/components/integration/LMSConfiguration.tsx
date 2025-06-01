"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/components/i18n/i18n-provider';
import { TranslationNamespace } from '@/lib/i18n/types';
import { useAccessibility } from '@/components/accessibility/accessibility-provider';
import { LTIService } from '@/lib/integration/lms/lti-service';
import { LMSPlatformType } from '@/lib/integration/lms/types';

/**
 * LMS Configuration Component
 * 
 * This component provides a UI for configuring LMS integrations,
 * with specific support for UK educational platforms.
 */
export function LMSConfiguration() {
  const { t, currentLanguage } = useI18n();
  const { highContrast, fontSize } = useAccessibility();
  
  const [activeTab, setActiveTab] = useState('general');
  const [platformType, setPlatformType] = useState<LMSPlatformType>(LMSPlatformType.MOODLE);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configStatus, setConfigStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    platformName: '',
    clientId: '',
    authenticationEndpoint: '',
    tokenEndpoint: '',
    keysetUrl: '',
    deploymentId: '',
    redirectUrl: window.location.origin + '/api/lti/launch',
    
    // Moodle specific
    moodleUrl: '',
    
    // Canvas specific
    canvasDomain: '',
    
    // Blackboard specific
    blackboardDomain: '',
    
    // Microsoft Teams specific
    teamsAppId: '',
    
    // Google Classroom specific
    googleClientId: ''
  });
  
  // Update form data
  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  
  // Get platform-specific default endpoints
  useEffect(() => {
    if (platformType === LMSPlatformType.MOODLE && formData.moodleUrl) {
      updateFormData('authenticationEndpoint', `${formData.moodleUrl}/mod/lti/auth.php`);
      updateFormData('tokenEndpoint', `${formData.moodleUrl}/mod/lti/token.php`);
      updateFormData('keysetUrl', `${formData.moodleUrl}/mod/lti/certs.php`);
    } else if (platformType === LMSPlatformType.CANVAS && formData.canvasDomain) {
      updateFormData('authenticationEndpoint', `https://${formData.canvasDomain}/api/lti/authorize_redirect`);
      updateFormData('tokenEndpoint', `https://${formData.canvasDomain}/login/oauth2/token`);
      updateFormData('keysetUrl', `https://${formData.canvasDomain}/api/lti/security/jwks`);
    } else if (platformType === LMSPlatformType.BLACKBOARD && formData.blackboardDomain) {
      updateFormData('authenticationEndpoint', `https://${formData.blackboardDomain}/learn/api/v1/lti/oauth2/auth`);
      updateFormData('tokenEndpoint', `https://${formData.blackboardDomain}/learn/api/v1/lti/oauth2/token`);
      updateFormData('keysetUrl', `https://${formData.blackboardDomain}/learn/api/v1/lti/keypair`);
    }
  }, [platformType, formData.moodleUrl, formData.canvasDomain, formData.blackboardDomain]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfiguring(true);
    setConfigStatus('idle');
    setErrorMessage(null);
    
    try {
      // Validate form data
      if (!formData.platformName || !formData.clientId || 
          !formData.authenticationEndpoint || !formData.tokenEndpoint || 
          !formData.keysetUrl || !formData.deploymentId) {
        throw new Error(t('required_fields_missing', TranslationNamespace.INTEGRATION, { default: 'Please fill in all required fields' }));
      }
      
      // Register the platform
      const ltiService = LTIService.getInstance();
      await ltiService.registerPlatform(
        'default', // tenantId - would be dynamic in multi-tenant setup
        formData.platformName,
        formData.clientId,
        formData.authenticationEndpoint,
        formData.tokenEndpoint,
        formData.keysetUrl
      );
      
      setConfigStatus('success');
    } catch (error) {
      console.error('LMS configuration error:', error);
      setConfigStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConfiguring(false);
    }
  };
  
  return (
    <div className="space-y-6" style={{ fontSize: `${fontSize}%` }}>
      <Card className={highContrast ? 'border-white bg-black text-white' : ''}>
        <CardHeader>
          <CardTitle>{t('lms_configuration', TranslationNamespace.INTEGRATION, { default: 'LMS Configuration' })}</CardTitle>
          <CardDescription>
            {t('lms_configuration_description', TranslationNamespace.INTEGRATION, { default: 'Configure integration with your Learning Management System' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">{t('general', TranslationNamespace.INTEGRATION, { default: 'General' })}</TabsTrigger>
              <TabsTrigger value="advanced">{t('advanced', TranslationNamespace.INTEGRATION, { default: 'Advanced' })}</TabsTrigger>
              <TabsTrigger value="features">{t('features', TranslationNamespace.INTEGRATION, { default: 'Features' })}</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <TabsContent value="general" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="platformType">{t('platform_type', TranslationNamespace.INTEGRATION, { default: 'Platform Type' })}</Label>
                    <Select 
                      value={platformType} 
                      onValueChange={(value) => setPlatformType(value as LMSPlatformType)}
                    >
                      <SelectTrigger id="platformType">
                        <SelectValue placeholder={t('select_platform', TranslationNamespace.INTEGRATION, { default: 'Select platform' })} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LMSPlatformType.MOODLE}>Moodle</SelectItem>
                        <SelectItem value={LMSPlatformType.CANVAS}>Canvas</SelectItem>
                        <SelectItem value={LMSPlatformType.BLACKBOARD}>Blackboard</SelectItem>
                        <SelectItem value={LMSPlatformType.MICROSOFT_TEAMS}>Microsoft Teams</SelectItem>
                        <SelectItem value={LMSPlatformType.GOOGLE_CLASSROOM}>Google Classroom</SelectItem>
                        <SelectItem value={LMSPlatformType.OTHER}>{t('other', TranslationNamespace.INTEGRATION, { default: 'Other' })}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="platformName">{t('platform_name', TranslationNamespace.INTEGRATION, { default: 'Platform Name' })}</Label>
                    <Input 
                      id="platformName" 
                      value={formData.platformName} 
                      onChange={(e) => updateFormData('platformName', e.target.value)} 
                      placeholder={t('platform_name_placeholder', TranslationNamespace.INTEGRATION, { default: 'e.g., School Moodle' })}
                    />
                  </div>
                  
                  {platformType === LMSPlatformType.MOODLE && (
                    <div>
                      <Label htmlFor="moodleUrl">{t('moodle_url', TranslationNamespace.INTEGRATION, { default: 'Moodle URL' })}</Label>
                      <Input 
                        id="moodleUrl" 
                        value={formData.moodleUrl} 
                        onChange={(e) => updateFormData('moodleUrl', e.target.value)} 
                        placeholder="https://moodle.school.edu"
                      />
                    </div>
                  )}
                  
                  {platformType === LMSPlatformType.CANVAS && (
                    <div>
                      <Label htmlFor="canvasDomain">{t('canvas_domain', TranslationNamespace.INTEGRATION, { default: 'Canvas Domain' })}</Label>
                      <Input 
                        id="canvasDomain" 
                        value={formData.canvasDomain} 
                        onChange={(e) => updateFormData('canvasDomain', e.target.value)} 
                        placeholder="school.instructure.com"
                      />
                    </div>
                  )}
                  
                  {platformType === LMSPlatformType.BLACKBOARD && (
                    <div>
                      <Label htmlFor="blackboardDomain">{t('blackboard_domain', TranslationNamespace.INTEGRATION, { default: 'Blackboard Domain' })}</Label>
                      <Input 
                        id="blackboardDomain" 
                        value={formData.blackboardDomain} 
                        onChange={(e) => updateFormData('blackboardDomain', e.target.value)} 
                        placeholder="school.blackboard.com"
                      />
                    </div>
                  )}
                  
                  {platformType === LMSPlatformType.MICROSOFT_TEAMS && (
                    <div>
                      <Label htmlFor="teamsAppId">{t('teams_app_id', TranslationNamespace.INTEGRATION, { default: 'Teams App ID' })}</Label>
                      <Input 
                        id="teamsAppId" 
                        value={formData.teamsAppId} 
                        onChange={(e) => updateFormData('teamsAppId', e.target.value)} 
                        placeholder="00000000-0000-0000-0000-000000000000"
                      />
                    </div>
                  )}
                  
                  {platformType === LMSPlatformType.GOOGLE_CLASSROOM && (
                    <div>
                      <Label htmlFor="googleClientId">{t('google_client_id', TranslationNamespace.INTEGRATION, { default: 'Google Client ID' })}</Label>
                      <Input 
                        id="googleClientId" 
                        value={formData.googleClientId} 
                        onChange={(e) => updateFormData('googleClientId', e.target.value)} 
                        placeholder="000000000000-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="clientId">{t('client_id', TranslationNamespace.INTEGRATION, { default: 'Client ID' })}</Label>
                    <Input 
                      id="clientId" 
                      value={formData.clientId} 
                      onChange={(e) => updateFormData('clientId', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="deploymentId">{t('deployment_id', TranslationNamespace.INTEGRATION, { default: 'Deployment ID' })}</Label>
                    <Input 
                      id="deploymentId" 
                      value={formData.deploymentId} 
                      onChange={(e) => updateFormData('deploymentId', e.target.value)} 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="authenticationEndpoint">{t('authentication_endpoint', TranslationNamespace.INTEGRATION, { default: 'Authentication Endpoint' })}</Label>
                    <Input 
                      id="authenticationEndpoint" 
                      value={formData.authenticationEndpoint} 
                      onChange={(e) => updateFormData('authenticationEndpoint', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tokenEndpoint">{t('token_endpoint', TranslationNamespace.INTEGRATION, { default: 'Token Endpoint' })}</Label>
                    <Input 
                      id="tokenEndpoint" 
                      value={formData.tokenEndpoint} 
                      onChange={(e) => updateFormData('tokenEndpoint', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="keysetUrl">{t('keyset_url', TranslationNamespace.INTEGRATION, { default: 'Keyset URL' })}</Label>
                    <Input 
                      id="keysetUrl" 
                      value={formData.keysetUrl} 
                      onChange={(e) => updateFormData('keysetUrl', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="redirectUrl">{t('redirect_url', TranslationNamespace.INTEGRATION, { default: 'Redirect URL (for LMS configuration)' })}</Label>
                    <div className="flex">
                      <Input 
                        id="redirectUrl" 
                        value={formData.redirectUrl} 
                        readOnly 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="ml-2"
                        onClick={() => {
                          navigator.clipboard.writeText(formData.redirectUrl);
                        }}
                      >
                        {t('copy', TranslationNamespace.INTEGRATION, { default: 'Copy' })}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('redirect_url_help', TranslationNamespace.INTEGRATION, { default: 'Use this URL in your LMS configuration' })}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div className="space-y-4">
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">{t('analytics_integration', TranslationNamespace.INTEGRATION, { default: 'Analytics Integration' })}</h3>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="enableAnalytics" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      <Label htmlFor="enableAnalytics">
                        {t('enable_analytics_integration', TranslationNamespace.INTEGRATION, { default: 'Enable Analytics Integration' })}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('analytics_integration_help', TranslationNamespace.INTEGRATION, { default: 'Share learning analytics data with the LMS' })}
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">{t('parent_portal_integration', TranslationNamespace.INTEGRATION, { default: 'Parent Portal Integration' })}</h3>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="enableParentPortal" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      <Label htmlFor="enableParentPortal">
                        {t('enable_parent_portal_integration', TranslationNamespace.INTEGRATION, { default: 'Enable Parent Portal Integration' })}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('parent_portal_integration_help', TranslationNamespace.INTEGRATION, { default: 'Connect parent portal accounts with LMS parent/guardian accounts' })}
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">{t('accessibility_integration', TranslationNamespace.INTEGRATION, { default: 'Accessibility Integration' })}</h3>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="enableAccessibility" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      <Label htmlFor="enableAccessibility">
                        {t('enable_accessibility_integration', TranslationNamespace.INTEGRATION, { default: 'Enable Accessibility Integration' })}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('accessibility_integration_help', TranslationNamespace.INTEGRATION, { default: 'Synchronize accessibility settings between systems' })}
                    </p>
                  </div>
                  
                  <div className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">{t('language_integration', TranslationNamespace.INTEGRATION, { default: 'Language Integration' })}</h3>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="enableLanguage" 
                        className="mr-2" 
                        defaultChecked 
                      />
                      <Label htmlFor="enableLanguage">
                        {t('enable_language_integration', TranslationNamespace.INTEGRATION, { default: 'Enable Language Integration' })}
                      </Label>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {t('language_integration_help', TranslationNamespace.INTEGRATION, { default: 'Synchronize language preferences between systems' })}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isConfiguring}>
                  {isConfiguring ? 
                    t('configuring', TranslationNamespace.INTEGRATION, { default: 'Configuring...' }) : 
                    t('save_configuration', TranslationNamespace.INTEGRATION, { default: 'Save Configuration' })}
                </Button>
              </div>
            </form>
          </Tabs>
          
          {configStatus === 'success' && (
            <Alert className="mt-6 bg-green-50 border-green-500 text-green-800">
              <AlertTitle>{t('configuration_successful', TranslationNamespace.INTEGRATION, { default: 'Configuration Successful' })}</AlertTitle>
              <AlertDescription>
                {t('configuration_successful_description', TranslationNamespace.INTEGRATION, { default: 'LMS integration has been successfully configured.' })}
              </AlertDescription>
            </Alert>
          )}
          
          {configStatus === 'error' && (
            <Alert variant="destructive" className="mt-6">
              <AlertTitle>{t('configuration_error', TranslationNamespace.INTEGRATION, { default: 'Configuration Error' })}</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
