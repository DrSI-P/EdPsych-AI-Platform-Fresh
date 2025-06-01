import React from 'react';
import Head from 'next/head';

/**
 * Minimal index page for Vercel deployment verification
 * 
 * This page replaces the main index page with a minimal version
 * to help isolate and resolve deployment issues.
 */
export default function MinimalIndex() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Head>
        <title>EdPsych Connect - Minimal</title>
        <meta name="description" content="EdPsych Connect Platform - Minimal Version" />
      </Head>

      <h1 style={{ color: '#0369a1' }}>EdPsych Connect</h1>
      <h2 style={{ color: '#666', fontWeight: 'normal' }}>Minimal Deployment Version</h2>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>This is a minimal version of the EdPsych Connect platform homepage designed to verify Vercel deployment functionality.</p>
        <p>If you can see this page, the basic deployment pipeline is working correctly.</p>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>Test Pages</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><a href="/test-deployment" style={{ color: '#0ea5e9' }}>Test Deployment Page</a></li>
          <li><a href="/minimal-test" style={{ color: '#0ea5e9' }}>Minimal Test Page</a></li>
          <li><a href="/bare-minimum" style={{ color: '#0ea5e9' }}>Bare Minimum Page</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
