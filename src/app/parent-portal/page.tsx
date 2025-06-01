"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParentPortalMultiLanguage } from '@/components/parent-portal/ParentPortalMultiLanguage';
import { AccessibleParentPortal } from '@/components/parent-portal/AccessibleParentPortal';
import { ParentPortalAnalytics } from '@/components/parent-portal/ParentPortalAnalytics';
import { useI18n } from '@/components/i18n/i18n-provider';
import { TranslationNamespace } from '@/lib/i18n/types';

/**
 * Parent Portal Page
 * 
 * Main entry point for the Parent Portal feature, providing access to
 * all enhanced parent portal components with multi-language support,
 * accessibility features, and comprehensive analytics.
 */
export default function ParentPortalPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('parent_portal', TranslationNamespace.PARENT_TEACHER, { default: 'Parent Portal' })}
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-2xl">
          <TabsTrigger value="dashboard">
            {t('dashboard', TranslationNamespace.PARENT_TEACHER, { default: 'Dashboard' })}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {t('analytics', TranslationNamespace.PARENT_TEACHER, { default: 'Analytics' })}
          </TabsTrigger>
          <TabsTrigger value="accessibility">
            {t('accessibility', TranslationNamespace.PARENT_TEACHER, { default: 'Accessibility' })}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-6">
          <ParentPortalMultiLanguage />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <ParentPortalAnalytics />
        </TabsContent>
        
        <TabsContent value="accessibility" className="space-y-6">
          <AccessibleParentPortal />
        </TabsContent>
      </Tabs>
    </div>
  );
}
