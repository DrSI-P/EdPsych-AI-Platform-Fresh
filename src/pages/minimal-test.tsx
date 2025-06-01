import React from 'react';
import Head from 'next/head';

/**
 * Ultra-minimal test page for Vercel deployment verification
 * 
 * This page contains absolutely minimal dependencies and features
 * to test the most basic Vercel deployment functionality.
 */
export default function MinimalTest() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Head>
        <title>Minimal Deployment Test</title>
        <meta name="description" content="Minimal Vercel deployment test" />
      </Head>

      <h1 style={{ color: '#333' }}>Minimal Deployment Test</h1>
      
      <p>
        This is an ultra-minimal test page with no external dependencies or complex features.
      </p>
      
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        border: '1px solid #ddd',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        If you can see this page, basic deployment is working correctly.
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
