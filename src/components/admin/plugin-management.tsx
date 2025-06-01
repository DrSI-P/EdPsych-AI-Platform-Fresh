'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Download, 
  Settings, 
  Shield, 
  Upload, 
  RefreshCw,
  Info,
  Search,
  Filter,
  Plus,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { PluginStatus } from '@/lib/plugins/types';

// Plugin type definition for the admin interface
interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  website?: string;
  icon?: string;
  tags?: string[];
  supportedFeatures: any[];
  requiredPermissions: any[];
  status: PluginStatus;
  installedAt: Date;
  updatedAt: Date;
  errorMessage?: string;
  configuredSettings?: Record<string, any>;
}

// Mock data for demonstration purposes
const mockPlugins: any[] = [
  {
    id: 'google-drive-integration',
    name: 'Google Drive Integration',
    description: 'Integrates with Google Drive for document storage, bi-directional sync, and collaborative editing.',
    version: '1.0.0',
    author: 'EdPsych-AI-Education-Platform',
    website: 'https://edpsychconnect.com',
    icon: '/icons/google-drive.svg',
    tags: ['integration', 'storage', 'collaboration'],
    supportedFeatures: ['document-sync', 'collaborative-editing', 'file-storage'],
    requiredPermissions: ['read_content', 'write_content', 'external_api'],
    status: PluginStatus.ACTIVE,
    installedAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-15'),
  },
  {
    id: 'cognifit-assessment',
    name: 'CogniFit Assessment Tools',
    description: 'Integrates CogniFit cognitive assessment and training tools.',
    version: '0.9.0',
    author: 'EdPsych-AI-Education-Platform',
    website: 'https://www.cognifit.com',
    icon: '/icons/cognifit.svg',
    tags: ['assessment', 'cognitive', 'special-needs'],
    supportedFeatures: ['cognitive-assessment', 'progress-tracking', 'reporting'],
    requiredPermissions: ['read_assessment', 'write_assessment', 'external_api'],
    status: PluginStatus.PENDING_APPROVAL,
    installedAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-10'),
  },
  {
    id: 'twinkl-resources',
    name: 'Twinkl SEN Resources',
    description: 'Access to Twinkl\'s comprehensive SEN teaching resources.',
    version: '1.1.0',
    author: 'EdPsych-AI-Education-Platform',
    website: 'https://www.twinkl.co.uk',
    icon: '/icons/twinkl.svg',
    tags: ['resources', 'sen', 'teaching'],
    supportedFeatures: ['content-access', 'resource-search', 'downloads'],
    requiredPermissions: ['read_content', 'external_api'],
    status: PluginStatus.ERROR,
    installedAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-05-12'),
    errorMessage: 'API authentication failed. Please check credentials.',
  },
  {
    id: 'texthelp-readwrite',
    name: 'TextHelp Read&Write',
    description: 'Literacy support tools for reading and writing assistance.',
    version: '1.2.0',
    author: 'EdPsych-AI-Education-Platform',
    website: 'https://www.texthelp.com',
    icon: '/icons/texthelp.svg',
    tags: ['accessibility', 'literacy', 'assistive'],
    supportedFeatures: ['text-to-speech', 'writing-support', 'vocabulary'],
    requiredPermissions: ['read_content', 'write_content', 'external_api'],
    status: PluginStatus.DISABLED,
    installedAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-05-05'),
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: PluginStatus }) => {
  switch (status) {
    case PluginStatus.ACTIVE:
      return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</Badge>;
    case PluginStatus.DISABLED:
      return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Disabled</Badge>;
    case PluginStatus.ERROR:
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Error</Badge>;
    case PluginStatus.PENDING_APPROVAL:
      return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" /> Pending Approval</Badge>;
    case PluginStatus.INCOMPATIBLE:
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Incompatible</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function PluginManagement() {
  const [plugins, setPlugins] = useState<Plugin[]>(mockPlugins);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>(mockPlugins);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = [...plugins];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(plugin => 
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plugin => plugin.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(plugin => 
        plugin.tags?.includes(categoryFilter) || 
        plugin.supportedFeatures.includes(categoryFilter)
      );
    }
    
    setFilteredPlugins(filtered);
  }, [plugins, searchTerm, statusFilter, categoryFilter]);

  // Fetch plugins from API
  const fetchPlugins = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/plugins');
      // const data = await response.json();
      // setPlugins(data);
      
      // Using mock data for now
      setTimeout(() => {
        setPlugins(mockPlugins);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch plugins:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plugins. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Enable/disable plugin
  const togglePluginStatus = async (plugin: Plugin) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/plugins/${plugin.id}/toggle`, {
      //   method: 'POST',
      // });
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        const updatedPlugins = plugins.map(p => {
          if (p.id === plugin.id) {
            return {
              ...p,
              status: p.status === PluginStatus.ACTIVE ? PluginStatus.DISABLED : PluginStatus.ACTIVE,
              updatedAt: new Date(),
            };
          }
          return p;
        });
        setPlugins(updatedPlugins);
        setIsLoading(false);
        
        toast({
          title: "Success",
          description: `Plugin ${plugin.status === PluginStatus.ACTIVE ? 'disabled' : 'enabled'} successfully.`,
        });
      }, 500);
    } catch (error) {
      console.error('Failed to toggle plugin status:', error);
      toast({
        title: "Error",
        description: "Failed to update plugin status. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Install new plugin
  const installPlugin = async (pluginUrl: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/plugins/install', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ url: pluginUrl }),
      // });
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        const newPlugin: Plugin = {
          id: `plugin-${Date.now()}`,
          name: 'New Plugin',
          description: 'This is a newly installed plugin.',
          version: '1.0.0',
          author: 'Plugin Author',
          tags: ['new'],
          supportedFeatures: ['feature-1', 'feature-2'],
          requiredPermissions: ['read_content'],
          status: PluginStatus.PENDING_APPROVAL,
          installedAt: new Date(),
          updatedAt: new Date(),
        };
        
        setPlugins([...plugins, newPlugin]);
        setIsLoading(false);
        
        toast({
          title: "Success",
          description: "Plugin installed successfully and pending approval.",
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to install plugin:', error);
      toast({
        title: "Error",
        description: "Failed to install plugin. Please check the URL and try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Update plugin settings
  const updatePluginSettings = async (plugin: Plugin, settings: Record<string, any>) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/plugins/${plugin.id}/settings`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ settings }),
      // });
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        const updatedPlugins = plugins.map(p => {
          if (p.id === plugin.id) {
            return {
              ...p,
              configuredSettings: settings,
              updatedAt: new Date(),
            };
          }
          return p;
        });
        setPlugins(updatedPlugins);
        setIsLoading(false);
        setIsSettingsOpen(false);
        
        toast({
          title: "Success",
          description: "Plugin settings updated successfully.",
        });
      }, 500);
    } catch (error) {
      console.error('Failed to update plugin settings:', error);
      toast({
        title: "Error",
        description: "Failed to update plugin settings. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Uninstall plugin
  const uninstallPlugin = async (plugin: Plugin) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch(`/api/plugins/${plugin.id}`, {
      //   method: 'DELETE',
      // });
      
      // Using mock data for now
      setTimeout(() => {
        const updatedPlugins = plugins.filter(p => p.id !== plugin.id);
        setPlugins(updatedPlugins);
        setIsLoading(false);
        
        toast({
          title: "Success",
          description: "Plugin uninstalled successfully.",
        });
      }, 500);
    } catch (error) {
      console.error('Failed to uninstall plugin:', error);
      toast({
        title: "Error",
        description: "Failed to uninstall plugin. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Get unique categories from plugins
  const getCategories = () => {
    const categories = new Set<string>();
    plugins.forEach(plugin => {
      plugin.tags?.forEach(tag => categories.add(tag));
      plugin.supportedFeatures.forEach(feature => categories.add(feature));
    });
    return Array.from(categories);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-centre mb-6">
        <h1 className="text-3xl font-bold">Plugin Management</h1>
        <div className="flex items-centre space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPlugins}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Install Plugin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Install New Plugin</DialogTitle>
                <DialogDescription>
                  Enter the URL or upload a plugin package to install a new plugin.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="plugin-url">Plugin URL</Label>
                  <Input id="plugin-url" placeholder="https://example.com/plugin.zip" />
                </div>
                <div className="space-y-2">
                  <Label>Or upload plugin package</Label>
                  <div className="border-2 border-dashed rounded-md p-6 text-centre">
                    <Download className="h-8 w-8 mx-auto mb-2 text-grey-400" />
                    <p className="text-sm text-grey-500">
                      Drag and drop your plugin package here, or click to browse
                    </p>
                    <input type="file" className="hidden" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button 
                  onClick={() => {
                    const input = document.getElementById('plugin-url') as HTMLInputElement;
                    installPlugin(input.value);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Installing...' : 'Install'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Tabs defaultValue="installed" className="w-full">
        <TabsList className="grid grid-cols-3 w-[400px] mb-6">
          <TabsTrigger value="installed">Installed Plugins</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="installed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installed Plugins</CardTitle>
              <CardDescription>
                Manage your installed plugins, configure settings, and monitor status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="search-plugins" className="sr-only">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-grey-500" />
                    <Input
                      id="search-plugins"
                      placeholder="Search plugins..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-40">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value={PluginStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={PluginStatus.DISABLED}>Disabled</SelectItem>
                        <SelectItem value={PluginStatus.ERROR}>Error</SelectItem>
                        <SelectItem value={PluginStatus.PENDING_APPROVAL}>Pending Approval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {getCategories().map(category => (
                          <SelectItem key={category} value={category}>
                            {category.replace(/-/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plugin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-centre py-8">
                          <div className="flex flex-col items-centre justify-centre">
                            <RefreshCw className="h-8 w-8 animate-spin text-grey-400 mb-2" />
                            <p className="text-sm text-grey-500">Loading plugins...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredPlugins.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-centre py-8">
                          <div className="flex flex-col items-centre justify-centre">
                            <Info className="h-8 w-8 text-grey-400 mb-2" />
                            <p className="text-sm text-grey-500">No plugins found matching your filters.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlugins.map(plugin => (
                        <TableRow key={plugin.id}>
                          <TableCell>
                            <div className="flex items-centre space-x-3">
                              {plugin.icon ? (
                                <div className="h-10 w-10 rounded bg-grey-100 flex items-centre justify-centre">
                                  <img 
                                    src={plugin.icon} 
                                    alt={plugin.name} 
                                    className="h-8 w-8 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/icons/plugin-default.svg';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded bg-grey-100 flex items-centre justify-centre">
                                  <Settings className="h-5 w-5 text-grey-500" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{plugin.name}</p>
                                <p className="text-sm text-grey-500 truncate max-w-xs">
                                  {plugin.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={plugin.status} />
                            {plugin.errorMessage && (
                              <p className="text-xs text-red-500 mt-1">
                                {plugin.errorMessage}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{plugin.version}</TableCell>
                          <TableCell>
                            {new Date(plugin.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPlugin(plugin);
                                  setIsSettingsOpen(true);
                                }}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={plugin.status === PluginStatus.ACTIVE ? "destructive" : "default"}
                                size="sm"
                                onClick={() => togglePluginStatus(plugin)}
                                disabled={plugin.status === PluginStatus.ERROR || plugin.status === PluginStatus.PENDING_APPROVAL}
                              >
                                {plugin.status === PluginStatus.ACTIVE ? 'Disable' : 'Enable'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marketplace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plugin Marketplace</CardTitle>
              <CardDescription>
                Discover and install new plugins to enhance your platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-centre justify-centre py-12 text-centre">
                <div className="rounded-full bg-grey-100 p-4 mb-4">
                  <Download className="h-8 w-8 text-grey-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Plugin Marketplace Coming Soon</h3>
                <p className="text-grey-500 max-w-md mb-6">
                  The plugin marketplace is currently under development. Soon you'll be able to discover and install plugins from our curated collection.
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Plugin Settings</CardTitle>
              <CardDescription>
                Configure global settings for all plugins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="auto-updates">Automatic Updates</Label>
                    <Switch id="auto-updates" defaultChecked />
                  </div>
                  <p className="text-sm text-grey-500">
                    Automatically update plugins when new versions are available.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="plugin-isolation">Plugin Isolation</Label>
                    <Switch id="plugin-isolation" defaultChecked />
                  </div>
                  <p className="text-sm text-grey-500">
                    Run plugins in isolated environments for enhanced security.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="auto-approval">Automatic Approval</Label>
                    <Switch id="auto-approval" />
                  </div>
                  <p className="text-sm text-grey-500">
                    Automatically approve new plugins without admin review (not recommended).
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-centre justify-between">
                    <Label htmlFor="telemetry">Plugin Telemetry</Label>
                    <Switch id="telemetry" defaultChecked />
                  </div>
                  <p className="text-sm text-grey-500">
                    Allow plugins to send anonymous usage data for improvement.
                  </p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Plugin Storage Limit</Label>
                  <Select defaultValue="500mb">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100mb">100 MB</SelectItem>
                      <SelectItem value="250mb">250 MB</SelectItem>
                      <SelectItem value="500mb">500 MB</SelectItem>
                      <SelectItem value="1gb">1 GB</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-grey-500">
                    Maximum storage space allocated to each plugin.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Plugin Settings Dialog */}
      {selectedPlugin && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Plugin Settings: {selectedPlugin.name}</DialogTitle>
              <DialogDescription>
                Configure settings for this plugin.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Tabs defaultValue="settings">
                <TabsList className="mb-4">
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="info">Information</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Credentials</Label>
                      <Input 
                        type="password" 
                        placeholder="API Key" 
                        defaultValue={selectedPlugin.configuredSettings?.apiKey || ''} 
                      />
                      <p className="text-xs text-grey-500">
                        Enter the API key for this plugin. This will be securely stored.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Sync Interval (minutes)</Label>
                      <Input 
                        type="number" 
                        min="5" 
                        max="1440" 
                        defaultValue={selectedPlugin.configuredSettings?.syncInterval || 15} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="plugin-enabled">Enable Plugin</Label>
                        <Switch 
                          id="plugin-enabled" 
                          checked={selectedPlugin.status === PluginStatus.ACTIVE}
                          onCheckedChange={() => togglePluginStatus(selectedPlugin)}
                          disabled={selectedPlugin.status === PluginStatus.ERROR || selectedPlugin.status === PluginStatus.PENDING_APPROVAL}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-centre justify-between">
                        <Label htmlFor="plugin-notifications">Notifications</Label>
                        <Switch 
                          id="plugin-notifications" 
                          defaultChecked={selectedPlugin.configuredSettings?.notifications !== false}
                        />
                      </div>
                      <p className="text-xs text-grey-500">
                        Receive notifications about plugin activities and updates.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4">
                  <div className="space-y-4">
                    <p className="text-sm text-grey-500">
                      This plugin requires the following permissions:
                    </p>
                    
                    <div className="space-y-2">
                      {selectedPlugin.requiredPermissions.map(permission => (
                        <div key={permission} className="flex items-start space-x-2">
                          <div className="mt-1">
                            <Shield className="h-4 w-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="font-medium">{permission.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-grey-500">
                              {getPermissionDescription(permission)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                      <div className="flex space-x-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            Permission Notice
                          </p>
                          <p className="text-xs text-amber-700">
                            Granting these permissions allows the plugin to access and modify data within your platform. Only install plugins from trusted sources.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Version</p>
                      <p className="text-sm text-grey-500">{selectedPlugin.version}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Author</p>
                      <p className="text-sm text-grey-500">{selectedPlugin.author}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Installed On</p>
                      <p className="text-sm text-grey-500">
                        {new Date(selectedPlugin.installedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-grey-500">
                        {new Date(selectedPlugin.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-blue-500 hover:underline">
                        <a href={selectedPlugin.website} target="_blank" rel="noopener noreferrer">
                          {selectedPlugin.website}
                        </a>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Description</p>
                      <p className="text-sm text-grey-500">{selectedPlugin.description}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Features</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPlugin.supportedFeatures.map(feature => (
                          <Badge key={feature} variant="secondary">
                            {feature.replace(/-/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPlugin.tags?.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag.replace(/-/g, ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (confirm('Are you sure you want to uninstall this plugin? This action cannot be undone.')) {
                    uninstallPlugin(selectedPlugin);
                    setIsSettingsOpen(false);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Uninstall
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  // In a real implementation, we would gather all the settings from the form
                  const settings = {
                    apiKey: 'updated-api-key',
                    syncInterval: 30,
                    notifications: true,
                  };
                  updatePluginSettings(selectedPlugin, settings);
                }}>
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Helper function to get permission description
function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'read_content': 'Access and read content from the platform.',
    'write_content': 'Create and modify content on the platform.',
    'read_user_data': 'Access user profile information and preferences.',
    'write_user_data': 'Modify user profile information and preferences.',
    'read_assessment': 'Access assessment data and results.',
    'write_assessment': 'Create and modify assessments and results.',
    'system_integration': 'Integrate with core platform systems.',
    'external_api': 'Connect to external services and APIs.',
  };
  
  return descriptions[permission] || 'No description available.';
}
