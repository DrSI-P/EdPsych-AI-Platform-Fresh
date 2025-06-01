'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { ComplianceValidator, ValidationSummary, ComplianceValidationResult } from '@/lib/compliance/compliance-validator';

/**
 * ComplianceStatus Component
 * 
 * A component that displays the current compliance status of the platform,
 * including GDPR, blockchain validation, and copyright protection.
 */
export default function ComplianceStatus() {
  const [loading, setLoading] = useState(true);
  const [validationResults, setValidationResults] = useState<ValidationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Run validation on component mount
  useEffect(() => {
    const validateCompliance = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const results = await ComplianceValidator.validateAllCompliance();
        setValidationResults(results);
      } catch (err) {
        console.error('Error validating compliance:', err);
        setError('Failed to validate compliance. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    validateCompliance();
  }, []);

  // Run validation manually
  const handleRunValidation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await ComplianceValidator.validateAllCompliance();
      setValidationResults(results);
    } catch (err) {
      console.error('Error validating compliance:', err);
      setError('Failed to validate compliance. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render validation result item
  const renderValidationResult = (result: ComplianceValidationResult) => {
    const statusIcon = {
      passed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      failed: <XCircle className="h-5 w-5 text-red-500" />
    }[result.status];
    
    const severityBadge = result.severity ? (
      <Badge variant={
        result.severity === 'critical' ? 'destructive' :
        result.severity === 'high' ? 'destructive' :
        result.severity === 'medium' ? 'secondary' :
        'outline'
      }>
        {result.severity}
      </Badge>
    ) : null;

    return (
      <div key={`${result.component}-${result.message}`} className="flex items-start space-x-3 p-3 border rounded-md mb-2">
        <div className="mt-0.5">{statusIcon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{result.component}</h4>
            {severityBadge}
          </div>
          <p className="text-sm text-muted-foreground">{result.message}</p>
          {result.details && (
            <p className="text-xs text-muted-foreground mt-1">{result.details}</p>
          )}
        </div>
      </div>
    );
  };

  // Render overall status
  const renderOverallStatus = () => {
    if (!validationResults) return null;
    
    const allPassed = 
      validationResults.gdpr.passed && 
      validationResults.blockchain.passed && 
      validationResults.copyright.passed;
    
    return (
      <Alert variant={allPassed ? "default" : "destructive"} className="mb-6">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Compliance Status</AlertTitle>
        <AlertDescription>
          {allPassed 
            ? "All compliance checks have passed. The platform is compliant with GDPR, blockchain validation, and copyright protection requirements."
            : "Some compliance checks have failed. Please review the details below and take appropriate action."}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compliance Status</CardTitle>
        <CardDescription>
          Verify that the platform complies with GDPR, blockchain validation, and copyright protection requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Validating compliance...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {renderOverallStatus()}
            
            <Tabs defaultValue="gdpr" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="gdpr">GDPR</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="copyright">Copyright</TabsTrigger>
              </TabsList>
              
              <TabsContent value="gdpr" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">GDPR Compliance</h3>
                  <Badge variant={validationResults?.gdpr.passed ? "success" : "destructive"}>
                    {validationResults?.gdpr.passed ? "Passed" : "Issues Found"}
                  </Badge>
                </div>
                
                {validationResults?.gdpr.results.map(renderValidationResult)}
              </TabsContent>
              
              <TabsContent value="blockchain" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Blockchain Validation</h3>
                  <Badge variant={validationResults?.blockchain.passed ? "success" : "destructive"}>
                    {validationResults?.blockchain.passed ? "Passed" : "Issues Found"}
                  </Badge>
                </div>
                
                {validationResults?.blockchain.results.map(renderValidationResult)}
              </TabsContent>
              
              <TabsContent value="copyright" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Copyright Protection</h3>
                  <Badge variant={validationResults?.copyright.passed ? "success" : "destructive"}>
                    {validationResults?.copyright.passed ? "Passed" : "Issues Found"}
                  </Badge>
                </div>
                
                {validationResults?.copyright.results.map(renderValidationResult)}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRunValidation} 
          disabled={loading}
          className="ml-auto"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            'Run Validation Again'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
