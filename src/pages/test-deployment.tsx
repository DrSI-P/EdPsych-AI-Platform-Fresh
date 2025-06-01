import React from 'react';
import Head from 'next/head';

/**
 * Minimal test page for Vercel deployment verification
 * 
 * This page contains minimal dependencies and features to test
 * basic Vercel deployment functionality.
 */
export default function TestDeployment() {
  return (
    <div className="min-h-screen flex flex-col items-centre justify-centre p-4">
      <Head>
        <title>EdPsych Connect - Deployment Test</title>
        <meta name="description" content="Vercel deployment test page" />
      </Head>

      <main className="flex flex-col items-centre justify-centre w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-centre">
          EdPsych Connect Deployment Test
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <p className="mb-4">
            This is a minimal test page to verify that Vercel deployment is working correctly.
          </p>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            If you can see this page, basic deployment is successful!
          </div>
          
          <h2 className="text-xl font-semibold mb-2">Environment Information:</h2>
          <ul className="list-disc pl-5 mb-4">
            <li>Next.js version: 13.x</li>
            <li>Node environment: {process.env.NODE_ENV}</li>
            <li>Deployment timestamp: {new Date().toISOString()}</li>
          </ul>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-grey-600">
              This page intentionally uses minimal features and dependencies to isolate deployment issues.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
