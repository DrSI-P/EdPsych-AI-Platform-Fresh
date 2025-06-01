'use client';

// This file re-exports icons from lucide-react to avoid barrel optimization issues
import {
  Linkedin,
  Twitter,
  Mail,
  BookOpen,
  ChevronRight,
} from 'lucide-react';

// Import custom icon components
import { Certificate } from './icons/certificate';
import { VolumeUp } from './icons/volume-up';
import { VrHeadset } from './icons/vr-headset';

// Export with consistent naming
export const LinkedInIcon = Linkedin;
export const TwitterIcon = Twitter;
export const MailIcon = Mail;
export const BookOpenIcon = BookOpen;
export const CaretRight = ChevronRight; // Alias for CaretRight

// Re-export custom icons
export { Certificate, VolumeUp, VrHeadset };