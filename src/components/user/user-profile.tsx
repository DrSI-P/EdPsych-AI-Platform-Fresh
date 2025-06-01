import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { User, Settings, Bell, Calendar, Book, Users, Award } from 'lucide-react';

/**
 * User profile management component for EdPsych Connect
 * Provides interface for users to manage their profile information
 */
const UserProfile = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    learningStyle: '',
    preferences: {
      notifications: true,
      emailUpdates: true,
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      }
    }
  });
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate with session data and defaults
        setProfile({
          name: session.user.name || '',
          email: session.user.email || '',
          role: session.user.role || 'student',
          bio: '',
          learningStyle: '',
          preferences: {
            notifications: true,
            emailUpdates: true,
            accessibility: {
              highContrast: false,
              largeText: false,
              reducedMotion: false,
              screenReader: false
            }
          }
        });
      } catch (error) {
        setErrorMessage('Failed to load profile data');
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [session]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes for preferences
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (name.startsWith('accessibility.')) {
      const accessibilityOption = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          accessibility: {
            ...prev.preferences.accessibility,
            [accessibilityOption]: checked
          }
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // In a real implementation, this would send to an API
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      setErrorMessage('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Profile</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage your personal information and preferences
        </p>
      </div>
      
      {/* Profile navigation tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
            <User className="inline-block h-4 w-4 mr-2" />
            Personal Info
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Settings className="inline-block h-4 w-4 mr-2" />
            Preferences
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Bell className="inline-block h-4 w-4 mr-2" />
            Notifications
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Calendar className="inline-block h-4 w-4 mr-2" />
            Schedule
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Award className="inline-block h-4 w-4 mr-2" />
            Achievements
          </button>
        </nav>
      </div>
      
      {/* Profile form */}
      <form onSubmit={handleSubmit} className="p-6">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Email address cannot be changed
              </p>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={profile.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
                disabled
              >
                <option value="student">Student</option>
                <option value="educator">Educator</option>
                <option value="parent">Parent/Guardian</option>
                <option value="professional">Educational Professional</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Role cannot be changed
              </p>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
                placeholder="Tell us a bit about yourself..."
              ></textarea>
            </div>
          </div>
          
          {/* Learning Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Preferences</h3>
            
            <div>
              <label htmlFor="learningStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Primary Learning Style
              </label>
              <select
                id="learningStyle"
                name="learningStyle"
                value={profile.learningStyle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
              >
                <option value="">Select a learning style</option>
                <option value="visual">Visual</option>
                <option value="auditory">Auditory</option>
                <option value="kinesthetic">Kinesthetic</option>
                <option value="reading-writing">Reading/Writing</option>
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Link href="/learning-styles-assessment">
                  <span className="text-primary hover:underline">
                    Not sure? Take our learning style assessment
                  </span>
                </Link>
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Preferences</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={profile.preferences.notifications}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  In-app notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailUpdates"
                  name="emailUpdates"
                  checked={profile.preferences.emailUpdates}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="emailUpdates" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Email updates
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Accessibility Settings</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highContrast"
                  name="accessibility.highContrast"
                  checked={profile.preferences.accessibility.highContrast}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="highContrast" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  High contrast mode
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="largeText"
                  name="accessibility.largeText"
                  checked={profile.preferences.accessibility.largeText}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="largeText" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Large text
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reducedMotion"
                  name="accessibility.reducedMotion"
                  checked={profile.preferences.accessibility.reducedMotion}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="reducedMotion" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Reduced motion
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="screenReader"
                  name="accessibility.screenReader"
                  checked={profile.preferences.accessibility.screenReader}
                  onChange={handlePreferenceChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="screenReader" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Screen reader optimization
                </label>
              </div>
              
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Link href="/accessibility">
                  <span className="text-primary hover:underline">
                    Learn more about our accessibility features
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
