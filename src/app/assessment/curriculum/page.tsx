'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { SimpleTabs  } from '@/components/ui/tabs';
import { Form } from '@/components/ui/form';

interface CurriculumStandard {
  id: string;
  code: string;
  description: string;
  subject: string;
  keyStage: string;
  year: string;
  category: string;
}

export default function CurriculumAlignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [standards, setStandards] = useState<CurriculumStandard[]>([]);
  const [filteredStandards, setFilteredStandards] = useState<CurriculumStandard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedKeyStage, setSelectedKeyStage] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const subjects = [
    { value: '', label: 'All Subjects' },
    { value: 'english', label: 'English' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'geography', label: 'Geography' },
    { value: 'art', label: 'Art and Design' },
    { value: 'music', label: 'Music' },
    { value: 'pe', label: 'Physical Education' },
    { value: 'computing', label: 'Computing' },
    { value: 'languages', label: 'Modern Foreign Languages' },
  ];

  const keyStages = [
    { value: '', label: 'All Key Stages' },
    { value: 'eyfs', label: 'Early Years Foundation Stage' },
    { value: 'ks1', label: 'Key Stage 1' },
    { value: 'ks2', label: 'Key Stage 2' },
    { value: 'ks3', label: 'Key Stage 3' },
    { value: 'ks4', label: 'Key Stage 4' },
    { value: 'ks5', label: 'Key Stage 5' },
  ];

  const years = [
    { value: '', label: 'All Years' },
    { value: 'reception', label: 'Reception' },
    { value: 'year1', label: 'Year 1' },
    { value: 'year2', label: 'Year 2' },
    { value: 'year3', label: 'Year 3' },
    { value: 'year4', label: 'Year 4' },
    { value: 'year5', label: 'Year 5' },
    { value: 'year6', label: 'Year 6' },
    { value: 'year7', label: 'Year 7' },
    { value: 'year8', label: 'Year 8' },
    { value: 'year9', label: 'Year 9' },
    { value: 'year10', label: 'Year 10' },
    { value: 'year11', label: 'Year 11' },
    { value: 'year12', label: 'Year 12' },
    { value: 'year13', label: 'Year 13' },
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'knowledge', label: 'Knowledge and Understanding' },
    { value: 'skills', label: 'Skills' },
    { value: 'concepts', label: 'Concepts' },
    { value: 'attitudes', label: 'Attitudes and Values' },
  ];

  useEffect(() => {
    const fetchCurriculumStandards = async () => {
      try {
        const response = await fetch('/api/curriculum/standards');
        
        if (!response.ok) {
          throw new Error('Failed to fetch curriculum standards');
        }
        
        const data = await response.json();
        setStandards(data);
        setFilteredStandards(data);
      } catch (err) {
        console.error('Error fetching curriculum standards:', err);
        setError('An error occurred while fetching the curriculum standards');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurriculumStandards();
  }, []);

  useEffect(() => {
    // Filter standards based on search query, subject, key stage, year, and category
    let filtered = [...standards];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(standard => 
        standard.code.toLowerCase().includes(query) || 
        standard.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(standard => standard.subject === selectedSubject);
    }
    
    // Filter by key stage
    if (selectedKeyStage) {
      filtered = filtered.filter(standard => standard.keyStage === selectedKeyStage);
    }
    
    // Filter by year
    if (selectedYear) {
      filtered = filtered.filter(standard => standard.year === selectedYear);
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(standard => standard.category === selectedCategory);
    }
    
    setFilteredStandards(filtered);
  }, [standards, searchQuery, selectedSubject, selectedKeyStage, selectedYear, selectedCategory]);

  const handleAlignAssessment = (standardId: string) => {
    router.push(`/assessment/curriculum/align?standard=${standardId}`);
  };

  const renderBrowseTab = () => {
    if (loading) {
      return (
        <div className="flex justify-centre items-centre py-12">
          <Spinner size="large" />
        </div>
      );
    }

    if (filteredStandards.length === 0) {
      return (
        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">No curriculum standards found matching your criteria.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredStandards.map((standard) => (
          <Card key={standard.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <div className="flex items-centre mb-2">
                    <span className="font-mono text-sm bg-grey-100 px-2 py-1 rounded mr-2">
                      {standard.code}
                    </span>
                    <span className="text-sm text-grey-500">
                      {subjects.find(s => s.value === standard.subject)?.label || standard.subject} | 
                      {keyStages.find(k => k.value === standard.keyStage)?.label || standard.keyStage} | 
                      {years.find(y => y.value === standard.year)?.label || standard.year}
                    </span>
                  </div>
                  <p className="text-base">{standard.description}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-grey-100 text-grey-800">
                      {categories.find(c => c.value === standard.category)?.label || standard.category}
                    </span>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleAlignAssessment(standard.id)}
                  className="ml-4"
                >
                  Align Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAlignedTab = () => {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Aligned Assessments</h2>
          <p className="text-grey-600">
            View assessments that have been aligned to UK curriculum standards.
          </p>
        </div>

        <div className="text-centre py-12">
          <p className="text-grey-500 mb-4">This feature is coming soon.</p>
          <Button onClick={() => setActiveTab('browse')}>
            Browse Curriculum Standards
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-centre justify-between">
          <h1 className="text-2xl font-bold text-grey-900">UK Curriculum Alignment</h1>
          <Button
            variant="outline"
            onClick={() => router.push('/assessment')}
          >
            Back to Assessments
          </Button>
        </div>
        <p className="mt-2 text-grey-600">
          Align your assessments with UK curriculum standards to ensure educational relevance and compliance.
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6">
        <SimpleTabs
          tabs={[
            { id: 'browse', label: 'Browse Standards' },
            { id: 'aligned', label: 'Aligned Assessments' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-1">
                <input
                  type="text"
                  placeholder="Search standards..."
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedKeyStage}
                  onChange={(e) => setSelectedKeyStage(e.target.value)}
                >
                  {keyStages.map((keyStage) => (
                    <option key={keyStage.value} value={keyStage.value}>
                      {keyStage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  className="w-full px-4 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {renderBrowseTab()}
          </div>
        )}

        {activeTab === 'aligned' && renderAlignedTab()}
      </div>
    </div>
  );
}
