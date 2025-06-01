'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Redirect if no token is provided
  useEffect(() => {
    if (!token) {
      router.push('/auth/reset-password');
    }
  }, [token, router]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      errors.password = 'Password must contain at least one number';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-centre justify-centre bg-grey-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Alert type="error" className="mb-4">
            Invalid or missing reset token. Please request a new password reset link.
          </Alert>
          <div className="text-centre mt-4">
            <Button onClick={() => router.push('/auth/reset-password')}>
              Request New Reset Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-centre justify-centre bg-grey-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-centre mb-8">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="mt-2 text-grey-600">
            Please enter your new password below.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-centre py-4">
                <Alert type="success" className="mb-4">
                  Your password has been reset successfully!
                </Alert>
                <p className="text-sm text-grey-600 mb-4">
                  You can now sign in with your new password.
                </p>
                <Button onClick={() => router.push('/auth/signin')}>
                  Sign In
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
                  <label htmlFor="password" className="block text-sm font-medium text-grey-700 mb-1">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                    className="w-full"
                  />
                  {validationErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                  )}
                  <p className="text-xs text-grey-500 mt-1">
                    Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-grey-700 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    required
                    className="w-full"
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? <Spinner size="sm" className="mr-2" /> : null}
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
