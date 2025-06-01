'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessionalPortfolio from '@/components/professional-development/professional-portfolio';
import PortfolioExport from '@/components/professional-development/portfolio-export';

export default function PortfolioPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Professional Portfolio</h1>
        <p className="text-muted-foreground">
          Build, manage, and showcase your professional journey and achievements
        </p>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portfolio">Portfolio Builder</TabsTrigger>
          <TabsTrigger value="export">Showcase & Export</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <ProfessionalPortfolio />
        </TabsContent>
        <TabsContent value="export">
          <PortfolioExport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
