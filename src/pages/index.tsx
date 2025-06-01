'use client';

import React from 'react';
import Head from 'next/head';

/**
 * Simplified index page for EdPsych Connect platform
 * 
 * This page serves as the entry point for the application.
 * It is intentionally simplified to avoid any components that might
 * use the useVoiceInput hook during server-side rendering.
 */
export default function Index() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <Head>
        <title>EdPsych Connect Platform</title>
        <meta name="description" content="A comprehensive AI-powered education platform for educational psychologists, teachers, students, and parents." />
      </Head>

      <h1 style={{ color: '#0369a1' }}>EdPsych Connect</h1>
      <h2 style={{ color: '#666', fontWeight: 'normal' }}>AI-Powered Education Platform</h2>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f0f9ff', 
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p>Welcome to the EdPsych Connect platform, designed to support educational psychologists, teachers, students, and parents.</p>
        <p>This platform integrates AI-powered tools with educational psychology principles to enhance learning experiences.</p>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h3>Platform Features</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li><a href="/adaptive-learning" style={{ color: '#0ea5e9' }}>Adaptive Learning</a></li>
          <li><a href="/assessment" style={{ color: '#0ea5e9' }}>Assessment Tools</a></li>
          <li><a href="/special-needs" style={{ color: '#0ea5e9' }}>Special Needs Support</a></li>
          <li><a href="/professional-development" style={{ color: '#0ea5e9' }}>Professional Development</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <p>Environment: {process.env.NODE_ENV}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
