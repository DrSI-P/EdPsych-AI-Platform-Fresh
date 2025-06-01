'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import Link from 'next/link';
import Image from 'next/image';

export default function RequestVerificationPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Email verification request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-centre justify-centre bg-grey-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-centre mb-8">
          <div className="flex justify-centre mb-4">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10"></div>
              <div className="absolute inset-0 flex items-centre justify-centre">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-grey-900">Verify Your Email</h1>
          <p className="mt-2 text-grey-600">
            Enter your email address and we'll send you a verification link.
          </p>
        </div>
        
        <Card className="shadow-lg border-0">
          <CardContent className="pt-6">
            {success ? (
              <div className="text-centre py-4">
                <div className="flex justify-centre mb-4">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 bg-green-600 rounded-full opacity-10"></div>
                    <div className="absolute inset-0 flex items-centre justify-centre">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <Alert type="success" className="mb-4">
                  If your email is registered, you will receive a verification link shortly.
                </Alert>
                <p className="text-sm text-grey-600 mb-4">
                  Please check your email inbox and follow the instructions to verify your email address.
                </p>
                <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert type="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-grey-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Send Verification Link
                  </Button>
                </div>
                
                <div className="text-centre">
                  <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-800">
                    Return to sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-6 text-centre text-sm text-grey-500">
          <p>
            Need help? <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
