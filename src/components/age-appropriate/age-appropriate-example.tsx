'use client';

import React from 'react';
import { AgeAppropriateWrapper } from '@/components/age-appropriate/age-appropriate-wrapper';
import { 
  AgeSpecificUI, 
  UKCurriculumResource, 
  UKCurriculumMapper,
  UKKeyStage,
  UKSubject
} from '@/components/age-appropriate';

interface AgeAppropriateExampleProps {
  className?: string;
}

export const AgeAppropriateExample: React.FC<AgeAppropriateExampleProps> = ({
  className = '',
}) => {
  return (
    <AgeAppropriateWrapper className={className}>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-6">Age-Appropriate Content Examples</h1>
        
        {/* Nursery Example */}
        <UKCurriculumMapper keyStage="early-years">
          <AgeSpecificUI 
            variant="card"
            title="Nursery Learning Activity"
            description="A fun activity for early years learners"
            icon="🧸"
          >
            <div className="space-y-4">
              <p className="text-lg">Let's learn about colours and shapes!</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-red-500 h-24 rounded-full flex items-center justify-center text-white font-bold">Circle</div>
                <div className="bg-blue-500 h-24 rounded-lg flex items-center justify-center text-white font-bold">Square</div>
                <div className="bg-green-500 h-24 rounded-md flex items-center justify-center text-white font-bold">Rectangle</div>
                <div className="bg-yellow-500 h-24 rounded-none flex items-center justify-center text-white font-bold">Triangle</div>
              </div>
              <p className="text-lg">Can you find these shapes around you?</p>
            </div>
          </AgeSpecificUI>
        </UKCurriculumMapper>
        
        {/* Primary Example */}
        <UKCurriculumMapper keyStage={["ks1", "ks2"]} subject="maths">
          <UKCurriculumResource
            title="Addition and Subtraction"
            keyStage="ks2"
            subject="maths"
            resourceType="lesson"
            description="Learn how to add and subtract two-digit numbers"
            footer={
              <div className="flex justify-between w-full">
                <span>Year 3</span>
                <span>National Curriculum: Mathematics</span>
              </div>
            }
          >
            <div className="space-y-4">
              <p>In this lesson, we will learn how to add and subtract two-digit numbers using different methods.</p>
              
              <div className="bg-blue-50 p-4 rounded-md dark:bg-blue-950">
                <h3 className="font-bold mb-2">Example:</h3>
                <p className="mb-2">Let's add 45 + 27</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold">Step 1:</p>
                    <p>Add the tens: 40 + 20 = 60</p>
                  </div>
                  <div>
                    <p className="font-bold">Step 2:</p>
                    <p>Add the ones: 5 + 7 = 12</p>
                  </div>
                  <div>
                    <p className="font-bold">Step 3:</p>
                    <p>Add the results: 60 + 12 = 72</p>
                  </div>
                  <div>
                    <p className="font-bold">Answer:</p>
                    <p>45 + 27 = 72</p>
                  </div>
                </div>
              </div>
              
              <p>Now try these problems yourself:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>23 + 45 = ?</li>
                <li>67 - 32 = ?</li>
                <li>54 + 38 = ?</li>
              </ol>
            </div>
          </UKCurriculumResource>
        </UKCurriculumMapper>
        
        {/* Secondary Example */}
        <UKCurriculumMapper keyStage={["ks3", "ks4"]} subject="science">
          <AgeSpecificUI
            variant="interactive"
            title="Physics Experiment: Forces and Motion"
            description="Interactive experiment to understand Newton's laws of motion"
          >
            <div className="space-y-4">
              <p>This interactive experiment demonstrates Newton's laws of motion through practical examples.</p>
              
              <div className="bg-indigo-50 p-4 rounded-md dark:bg-indigo-950">
                <h3 className="font-bold mb-2">Newton's First Law:</h3>
                <p>An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.</p>
                <div className="mt-2 p-2 border border-indigo-200 rounded dark:border-indigo-800">
                  <p className="font-medium">Experiment: Inertia Demonstration</p>
                  <p className="text-sm mt-1">Click the button below to see what happens when you quickly pull the tablecloth from under the dishes.</p>
                  <button className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    Run Simulation
                  </button>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-md dark:bg-indigo-950">
                <h3 className="font-bold mb-2">Newton's Second Law:</h3>
                <p>Force equals mass times acceleration (F = ma).</p>
                <div className="mt-2 p-2 border border-indigo-200 rounded dark:border-indigo-800">
                  <p className="font-medium">Experiment: Force Calculator</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-sm">Mass (kg)</label>
                      <input type="number" className="mt-1 w-full p-2 border rounded" placeholder="Enter mass" />
                    </div>
                    <div>
                      <label className="block text-sm">Acceleration (m/s²)</label>
                      <input type="number" className="mt-1 w-full p-2 border rounded" placeholder="Enter acceleration" />
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                    Calculate Force
                  </button>
                </div>
              </div>
              
              <p>Complete the following questions based on the experiments:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Explain how Newton's First Law applies to car safety features.</li>
                <li>Calculate the force needed to accelerate a 1500kg car at 2m/s².</li>
                <li>Describe an everyday example of Newton's Third Law.</li>
              </ol>
            </div>
          </AgeSpecificUI>
        </UKCurriculumMapper>
      </div>
    </AgeAppropriateWrapper>
  );
};

export default AgeAppropriateExample;
