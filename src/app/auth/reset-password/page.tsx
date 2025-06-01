'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import Link from 'next/link';

export default function RequestResetPage() {
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
      const response = await fetch('/api/auth/reset-password', {
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
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-centre justify-centre bg-grey-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-centre mb-8">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-grey-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-centre py-4">
                <Alert type="success" className="mb-4">
                  If your email is registered, you will receive a password reset link shortly.
                </Alert>
                <p className="text-sm text-grey-600 mb-4">
                  Please check your email inbox and follow the instructions to reset your password.
                </p>
                <Button variant="outline" onClick={() => router.push('/auth/signin')}>
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert type="error" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                <div className="mb-4">
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
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Send Reset Link
                  </Button>
                </div>
                
                <div className="mt-4 text-centre">
                  <Link href="/auth/signin" className="text-sm text-blue-600 hover:text-blue-800">
                    Return to sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
