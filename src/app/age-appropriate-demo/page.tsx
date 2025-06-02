import React from 'react';
import AgeAppropriateDemoWrapper from './wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Age-Appropriate Content & UI Demo | EdPsych Connect',
  description: 'Interactive demonstration of the EdPsych Connect platform\'s age-appropriate content and UI system.',
};

export default function AgeAppropriateDemoPage() {
  return <AgeAppropriateDemoWrapper />;
}