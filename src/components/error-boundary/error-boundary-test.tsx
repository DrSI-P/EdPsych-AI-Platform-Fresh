'use client';

import React from 'react';
import ErrorBoundary from './error-boundary';
import AgeAdaptiveErrorBoundary from './age-adaptive-error-boundary';

/**
 * Error Boundary Test Component
 * 
 * This component is used to test the error boundary functionality
 * by intentionally throwing errors under different conditions.
 */
const ErrorBoundaryTest: React.FC = () => {
  const [shouldThrowError, setShouldThrowError] = React.useState(false);
  const [ageGroup, setAgeGroup] = React.useState<'nursery' | 'early-primary' | 'late-primary' | 'secondary'>('late-primary');
  
  // Component that will throw an error when shouldThrowError is true
  const BuggyComponent: React.FC = () => {
    if (shouldThrowError) {
      throw new Error('This is a test error thrown intentionally');
    }
    
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <p className="text-green-800">This component is working correctly!</p>
        <p className="text-sm text-green-600 mt-2">
          Click the "Trigger Error" button to test the error boundary.
        </p>
      </div>
    );
  };
  
  return (
    <div className="space-y-8 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error Boundary Testing</h1>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h2 className="text-lg font-medium text-blue-800 mb-2">Test Controls</h2>
          <div className="flex flex-wrap gap-4 items-centre">
            <button
              onClick={() => setShouldThrowError(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Trigger Error
            </button>
            
            <button
              onClick={() => setShouldThrowError(false)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Reset Error
            </button>
            
            <div className="ml-4">
              <label className="block text-sm font-medium text-grey-700 mb-1">
                Age Group for Testing:
              </label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as 'nursery' | 'early-primary' | 'late-primary' | 'secondary')}
                className="block w-full px-3 py-2 bg-white border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="nursery">Nursery (3-5 years)</option>
                <option value="early-primary">Early Primary (5-8 years)</option>
                <option value="late-primary">Late Primary (8-11 years)</option>
                <option value="secondary">Secondary (11+ years)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Error Boundary Test */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Standard Error Boundary</h2>
            <ErrorBoundary
              resetKeys={[shouldThrowError]}
              onError={(error, errorInfo) => {
                console.log('Error caught by standard boundary:', error);
                console.log('Component stack:', errorInfo.componentStack);
              }}
            >
              <BuggyComponent />
            </ErrorBoundary>
          </div>
          
          {/* Age Adaptive Error Boundary Test */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-medium mb-4">Age Adaptive Error Boundary ({ageGroup})</h2>
            <AgeAdaptiveErrorBoundary
              ageGroup={ageGroup}
              resetKeys={[shouldThrowError]}
              onError={(error, errorInfo) => {
                console.log('Error caught by age-adaptive boundary:', error);
                console.log('Component stack:', errorInfo.componentStack);
              }}
            >
              <BuggyComponent />
            </AgeAdaptiveErrorBoundary>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-lg font-medium text-yellow-800 mb-2">Testing Instructions</h2>
          <ol className="list-decimal pl-5 space-y-2 text-yellow-700">
            <li>Click the "Trigger Error" button to simulate an error in the components</li>
            <li>Observe how both error boundaries handle the error differently</li>
            <li>Try different age groups to see how the age-adaptive error boundary changes</li>
            <li>Click the "Reset Error" button to restore the components to working state</li>
            <li>Test the "Try Again" and "Go Home" buttons in the error UI</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryTest;
