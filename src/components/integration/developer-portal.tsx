/**
 * Developer Portal Component
 * 
 * This component provides a user interface for the developer portal.
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiPermission } from '@/lib/integration/developer-api/types';
import { ApiVersion } from '@/lib/integration/developer-api/api-version-service';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface DeveloperPortalProps {
  tenantId: string;
  apiKey?: string;
}

export function DeveloperPortal({ tenantId, apiKey }: DeveloperPortalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiVersion, setApiVersion] = useState<ApiVersion>(ApiVersion.V1);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [oauthClients, setOauthClients] = useState<any[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch API keys, OAuth clients, and webhooks on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch API keys
        const keysResponse = await fetch(`/api/developer/keys/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        });

        if (!keysResponse.ok) {
          throw new Error('Failed to fetch API keys');
        }

        const keysData = await keysResponse.json();
        setApiKeys(keysData.keys || []);

        // Fetch OAuth clients
        const clientsResponse = await fetch(`/api/developer/oauth/${tenantId}/clients`, {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        });

        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();
          setOauthClients(clientsData.clients || []);
        }

        // Fetch webhooks for the first API key if available
        if (keysData.keys && keysData.keys.length > 0) {
          const webhooksResponse = await fetch(`/api/developer/webhooks/${tenantId}/${keysData.keys[0].id}`, {
            headers: {
              Authorization: `Bearer ${apiKey}`
            }
          });

          if (webhooksResponse.ok) {
            const webhooksData = await webhooksResponse.json();
            setWebhooks(webhooksData.webhooks || []);
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    if (apiKey) {
      fetchData();
    }
  }, [tenantId, apiKey]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">EdPsych Connect Developer Portal</h1>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="oauth">OAuth</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to the Developer Portal</CardTitle>
              <CardDescription>
                Build integrations with the EdPsych Connect platform using our comprehensive API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  The EdPsych Connect API allows you to integrate our educational psychology platform
                  with your own applications and services. You can access student data, learning paths,
                  curriculum content, and more.
                </p>
                <h3 className="text-lg font-semibold">Getting Started</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Create an API key or OAuth client to authenticate your requests</li>
                  <li>Review the API documentation to understand available endpoints</li>
                  <li>Set up webhooks to receive real-time updates</li>
                  <li>Test your integration in the sandbox environment</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setActiveTab('api-keys')}>Create API Key</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for server-to-server authentication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading API keys...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your API Keys</h3>
                    {apiKeys.length === 0 ? (
                      <p>You don't have any API keys yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {apiKeys.map((key) => (
                          <div key={key.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{key.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {key.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2">
                              <p className="text-sm"><span className="font-medium">Key:</span> {key.key}</p>
                              {key.secret && (
                                <p className="text-sm mt-1"><span className="font-medium">Secret:</span> {key.secret}</p>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Permissions:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {key.permissions.map((permission: string) => (
                                  <span key={permission} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    {permission}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input id="key-name" placeholder="My API Key" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(ApiPermission).map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <input type="checkbox" id={`permission-${permission}`} value={permission} />
                              <Label htmlFor={`permission-${permission}`}>{permission}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button type="submit">Create API Key</Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="oauth">
          <Card>
            <CardHeader>
              <CardTitle>OAuth 2.0</CardTitle>
              <CardDescription>
                Manage OAuth clients for user-authorized integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading OAuth clients...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your OAuth Clients</h3>
                    {oauthClients.length === 0 ? (
                      <p>You don't have any OAuth clients yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {oauthClients.map((client) => (
                          <div key={client.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">{client.name}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                client.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {client.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{client.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2">
                              <p className="text-sm"><span className="font-medium">Client ID:</span> {client.clientId}</p>
                              {client.clientSecret && (
                                <p className="text-sm mt-1"><span className="font-medium">Client Secret:</span> {client.clientSecret}</p>
                              )}
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Redirect URIs:</p>
                              <ul className="list-disc pl-5 mt-1">
                                {client.redirectUris.map((uri: string, index: number) => (
                                  <li key={index} className="text-sm">{uri}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Allowed Scopes:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {client.allowedScopes.map((scope: string) => (
                                  <span key={scope} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    {scope}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Register New OAuth Client</h3>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="client-name">Client Name</Label>
                        <Input id="client-name" placeholder="My Application" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="client-description">Description</Label>
                        <Input id="client-description" placeholder="A description of your application" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="redirect-uris">Redirect URIs (one per line)</Label>
                        <textarea
                          id="redirect-uris"
                          className="w-full min-h-[100px] p-2 border rounded-md"
                          placeholder="https://example.com/callback"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Allowed Scopes</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.values(ApiPermission).map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <input type="checkbox" id={`scope-${permission}`} value={permission} />
                              <Label htmlFor={`scope-${permission}`}>{permission}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button type="submit">Register Client</Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>
                Receive real-time notifications when events occur in the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading webhooks...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your Webhooks</h3>
                    {webhooks.length === 0 ? (
                      <p>You don't have any webhooks yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {webhooks.map((webhook) => (
                          <div key={webhook.id} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium">Webhook</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                webhook.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {webhook.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm mt-1"><span className="font-medium">URL:</span> {webhook.url}</p>
                            <p className="text-sm text-gray-500 mt-1">Created: {new Date(webhook.createdAt).toLocaleDateString()}</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium">Events:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {webhook.events.map((event: string) => (
                                  <span key={event} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                    {event}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Register New Webhook</h3>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input id="webhook-url" placeholder="https://example.com/webhook" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="api-key-id">API Key</Label>
                        <select id="api-key-id" className="w-full p-2 border rounded-md">
                          {apiKeys.map((key) => (
                            <option key={key.id} value={key.id}>{key.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Events</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['content.created', 'content.updated', 'content.deleted', 'assessment.completed', 'user.created', 'user.updated'].map((event) => (
                            <div key={event} className="flex items-center space-x-2">
                              <input type="checkbox" id={`event-${event}`} value={event} />
                              <Label htmlFor={`event-${event}`}>{event}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button type="submit">Register Webhook</Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>
                Explore the EdPsych Connect API and learn how to integrate with our platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="space-x-2">
                    <Label htmlFor="api-version">API Version:</Label>
                    <select
                      id="api-version"
                      value={apiVersion}
                      onChange={(e) => setApiVersion(e.target.value as ApiVersion)}
                      className="p-1 border rounded-md"
                    >
                      {Object.values(ApiVersion).map((version) => (
                        <option key={version} value={version}>{version}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <SwaggerUI url={`/api/developer/docs?version=${apiVersion}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
