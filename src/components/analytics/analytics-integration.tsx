'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  FileText, 
  Filter, 
  Search,
  RefreshCw,
  Link,
  ExternalLink,
  Share2,
  Mail,
  Printer,
  Settings,
  Sliders
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demonstration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const mockModuleIntegrations = [
  { 
    id: 'student', 
    name: 'Student Module', 
    status: 'Connected', 
    dataPoints: 24, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Progress Tracking', status: 'Active' },
      { name: 'Assessment Results', status: 'Active' },
      { name: 'Attendance Records', status: 'Active' },
      { name: 'Behaviour Incidents', status: 'Active' },
      { name: 'Learning Preferences', status: 'Active' },
      { name: 'Goal Achievement', status: 'Active' },
    ]
  },
  { 
    id: 'educator', 
    name: 'Educator Module', 
    status: 'Connected', 
    dataPoints: 18, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Teaching Effectiveness', status: 'Active' },
      { name: 'Resource Creation', status: 'Active' },
      { name: 'Feedback Quality', status: 'Active' },
      { name: 'Professional Development', status: 'Active' },
      { name: 'Time Allocation', status: 'Active' },
      { name: 'Intervention Impact', status: 'Active' },
    ]
  },
  { 
    id: 'curriculum', 
    name: 'Curriculum Module', 
    status: 'Connected', 
    dataPoints: 15, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Coverage Analysis', status: 'Active' },
      { name: 'Learning Objectives', status: 'Active' },
      { name: 'Unit Completion', status: 'Active' },
      { name: 'Subject Performance', status: 'Active' },
      { name: 'Curriculum Gaps', status: 'Active' },
    ]
  },
  { 
    id: 'resource', 
    name: 'Resource Module', 
    status: 'Connected', 
    dataPoints: 12, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Usage Statistics', status: 'Active' },
      { name: 'Effectiveness Ratings', status: 'Active' },
      { name: 'Creation Metrics', status: 'Active' },
      { name: 'Sharing Analytics', status: 'Active' },
    ]
  },
  { 
    id: 'send', 
    name: 'SEND Module', 
    status: 'Connected', 
    dataPoints: 20, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Support Plan Tracking', status: 'Active' },
      { name: 'Intervention Effectiveness', status: 'Active' },
      { name: 'Accommodation Usage', status: 'Active' },
      { name: 'Progress Monitoring', status: 'Active' },
      { name: 'Goal Achievement', status: 'Active' },
    ]
  },
  { 
    id: 'parent', 
    name: 'Parent-School Module', 
    status: 'Connected', 
    dataPoints: 10, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Communication Frequency', status: 'Active' },
      { name: 'Engagement Metrics', status: 'Active' },
      { name: 'Goal Collaboration', status: 'Active' },
      { name: 'Resource Access', status: 'Active' },
    ]
  },
  { 
    id: 'professional', 
    name: 'Professional Development', 
    status: 'Connected', 
    dataPoints: 14, 
    lastSync: '2025-05-17 14:30',
    metrics: [
      { name: 'Course Completion', status: 'Active' },
      { name: 'CPD Hours Tracking', status: 'Active' },
      { name: 'Certification Status', status: 'Active' },
      { name: 'Mentorship Analytics', status: 'Active' },
      { name: 'Research Participation', status: 'Active' },
    ]
  },
];

const mockDataFlowMetrics = [
  { name: 'Jan', student: 65, educator: 55, curriculum: 40, resource: 30 },
  { name: 'Feb', student: 68, educator: 59, curriculum: 45, resource: 35 },
  { name: 'Mar', student: 72, educator: 65, curriculum: 50, resource: 40 },
  { name: 'Apr', student: 75, educator: 70, curriculum: 55, resource: 45 },
  { name: 'May', student: 80, educator: 75, curriculum: 60, resource: 50 },
];

const mockPrivacySettings = [
  { id: 'anonymization', name: 'Data Anonymization', enabled: true, description: 'Automatically anonymize sensitive student data in reports' },
  { id: 'aggregation', name: 'Data Aggregation', enabled: true, description: 'Present data in aggregate form to protect individual privacy' },
  { id: 'access_control', name: 'Role-Based Access Control', enabled: true, description: 'Restrict access to reports based on user roles' },
  { id: 'consent', name: 'Parental Consent Verification', enabled: true, description: 'Verify parental consent before including student data' },
  { id: 'retention', name: 'Data Retention Limits', enabled: true, description: 'Automatically archive or delete old report data' },
  { id: 'audit', name: 'Access Audit Logging', enabled: true, description: 'Log all access to reports for compliance purposes' },
];

const mockExtensibilityOptions = [
  { id: 'custom_metrics', name: 'Custom Metrics', enabled: true, description: 'Create and track custom analytics metrics' },
  { id: 'api_access', name: 'API Access', enabled: true, description: 'Access analytics data through secure API endpoints' },
  { id: 'export_formats', name: 'Multiple Export Formats', enabled: true, description: 'Export data in various formats (CSV, Excel, PDF)' },
  { id: 'third_party', name: 'Third-Party Integrations', enabled: true, description: 'Connect with external analytics tools' },
  { id: 'scheduled_reports', name: 'Scheduled Reports', enabled: true, description: 'Automatically generate and distribute reports' },
];

const AnalyticsIntegration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState({ from: new Date(2025, 0, 1), to: new Date() });

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "Analytics integration data has been updated to the latest available information.",
      });
    }, 1200);
  };

  const handleModuleSelect = (moduleId) => {
    setSelectedModule(moduleId);
  };

  const handleExport = (format) => {
    toast({
      title: `Exporting Integration Data as ${format.toUpperCase()}`,
      description: "Your export is being prepared and will download shortly.",
    });
  };

  const handleToggleSetting = (settingId, currentValue) => {
    // In a real implementation, this would update the setting
    toast({
      title: "Setting Updated",
      description: `${settingId} has been ${currentValue ? 'disabled' : 'enabled'}.`,
    });
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-[300px]" />
      <Skeleton className="h-4 w-[250px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full md:col-span-2" />
      </div>
    </div>
  );

  const renderModuleList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-centre justify-between">
          <CardTitle>Module Integrations</CardTitle>
          <div className="flex items-centre space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>
          Analytics integration status with platform modules
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-centre space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search modules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {mockModuleIntegrations
                .filter(module => 
                  searchQuery === '' || 
                  module.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(module => (
                  <div 
                    key={module.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${
                      selectedModule === module.id ? 'border-primary bg-muted/50' : 'hover:border-primary hover:bg-muted/20'
                    }`}
                    onClick={() => handleModuleSelect(module.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{module.name}</h4>
                        <div className="flex items-centre space-x-2 mt-1">
                          <Badge variant={module.status === 'Connected' ? 'default' : 'destructive'}>
                            {module.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {module.dataPoints} data points
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {module.lastSync}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                ))
              }
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );

  const renderModuleDetail = () => {
    if (!selectedModule) {
      return (
        <div className="h-full flex items-centre justify-centre border border-dashed rounded-md p-8">
          <div className="text-centre">
            <h3 className="text-lg font-medium">No Module Selected</h3>
            <p className="text-muted-foreground">Select a module from the list to view integration details</p>
          </div>
        </div>
      );
    }

    const module = mockModuleIntegrations.find(m => m.id === selectedModule);

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-centre">
            <div>
              <CardTitle>{module.name} Integration</CardTitle>
              <CardDescription>
                Analytics integration details and metrics
              </CardDescription>
            </div>
            <Badge variant={module.status === 'Connected' ? 'default' : 'destructive'}>
              {module.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Data Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{module.dataPoints}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="flex items-centre">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                    +3 from last month
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{module.lastSync.split(' ')[0]}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="flex items-centre">
                    {module.lastSync.split(' ')[1]}
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{module.metrics.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="flex items-centre">
                    All metrics active
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Available Metrics</h3>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {module.metrics.map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{metric.name}</TableCell>
                      <TableCell>
                        <Badge variant={metric.status === 'Active' ? 'default' : 'outline'}>
                          {metric.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Link className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Data Flow</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={mockDataFlowMetrics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedModule} 
                    name={`${module.name} Data Points`} 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Sliders className="mr-2 h-4 w-4" />
            Configure Integration
          </Button>
          <div className="space-x-2">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              View in Module
            </Button>
            <Button>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const renderDataFlowTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-centre">
            <div>
              <CardTitle>Cross-Module Data Flow</CardTitle>
              <CardDescription>
                Analytics data flow between platform modules
              </CardDescription>
            </div>
            <DateRangePicker
              value={selectedDateRange}
              onChange={setSelectedDateRange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockDataFlowMetrics}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="student" 
                  name="Student Module" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="educator" 
                  name="Educator Module" 
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="curriculum" 
                  name="Curriculum Module" 
                  stroke="#ffc658" 
                />
                <Line 
                  type="monotone" 
                  dataKey="resource" 
                  name="Resource Module" 
                  stroke="#ff8042" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Integration Health</CardTitle>
            <CardDescription>
              Overall health status of module integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Healthy', value: 6 },
                      { name: 'Warning', value: 1 },
                      { name: 'Error', value: 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#4ade80', '#fbbf24', '#f87171'][index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-centre">
                  <div className="flex items-centre">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80] mr-2"></div>
                    <span className="text-sm">Healthy</span>
                  </div>
                  <span className="text-sm font-medium">6 modules</span>
                </div>
                <div className="flex justify-between items-centre">
                  <div className="flex items-centre">
                    <div className="w-3 h-3 rounded-full bg-[#fbbf24] mr-2"></div>
                    <span className="text-sm">Warning</span>
                  </div>
                  <span className="text-sm font-medium">1 module</span>
                </div>
                <div className="flex justify-between items-centre">
                  <div className="flex items-centre">
                    <div className="w-3 h-3 rounded-full bg-[#f87171] mr-2"></div>
                    <span className="text-sm">Error</span>
                  </div>
                  <span className="text-sm font-medium">0 modules</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Volume by Module</CardTitle>
            <CardDescription>
              Analytics data volume across platform modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mockModuleIntegrations.map(module => ({
                    name: module.name.replace(' Module', ''),
                    value: module.dataPoints
                  }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Data Points" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Compliance Settings</CardTitle>
          <CardDescription>
            Configure privacy settings for analytics and reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockPrivacySettings.map(setting => (
              <div key={setting.id} className="flex items-start justify-between space-x-4">
                <div>
                  <h4 className="font-medium">{setting.name}</h4>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <div className="flex items-centre h-5">
                  <Label htmlFor={`privacy-${setting.id}`} className="sr-only">
                    {setting.name}
                  </Label>
                  <input
                    type="checkbox"
                    id={`privacy-${setting.id}`}
                    checked={setting.enabled}
                    onChange={() => handleToggleSetting(setting.id, setting.enabled)}
                    className="h-4 w-4 rounded border-grey-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>GDPR Compliance</CardTitle>
          <CardDescription>
            Data protection compliance status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-centre justify-between">
              <div className="flex items-centre space-x-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="font-medium">Compliant</span>
              </div>
              <span className="text-sm text-muted-foreground">Last verified: 2025-05-15</span>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Data Minimization</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Purpose Limitation</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Storage Limitation</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Data Subject Rights</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium">Consent Management</p>
                  <p className="text-sm font-medium">100%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExtensibilityTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Extensibility Options</CardTitle>
          <CardDescription>
            Configure extensibility features for analytics and reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockExtensibilityOptions.map(option => (
              <div key={option.id} className="flex items-start justify-between space-x-4">
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <div className="flex items-centre h-5">
                  <Label htmlFor={`extensibility-${option.id}`} className="sr-only">
                    {option.name}
                  </Label>
                  <input
                    type="checkbox"
                    id={`extensibility-${option.id}`}
                    checked={option.enabled}
                    onChange={() => handleToggleSetting(option.id, option.enabled)}
                    className="h-4 w-4 rounded border-grey-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API access for external integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-centre justify-between">
              <div>
                <h4 className="font-medium">API Status</h4>
                <p className="text-sm text-muted-foreground">Analytics API is active and available</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Active Integrations</h4>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Access</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">School MIS</TableCell>
                      <TableCell>Bi-directional</TableCell>
                      <TableCell>2025-05-17 12:30</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Assessment Platform</TableCell>
                      <TableCell>Data Import</TableCell>
                      <TableCell>2025-05-16 15:45</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Attendance System</TableCell>
                      <TableCell>Data Import</TableCell>
                      <TableCell>2025-05-17 08:15</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-centre gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Integration</h2>
          <p className="text-muted-foreground">
            Manage analytics integration with platform modules
          </p>
        </div>
        <div className="flex items-centre gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7/7</div>
            <p className="text-xs text-muted-foreground">
              All modules connected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">113</div>
            <p className="text-xs text-muted-foreground">
              +12 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Integration Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last check
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-centre justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Privacy Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              GDPR compliant
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
          <TabsTrigger value="modules">Module Integrations</TabsTrigger>
          <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Compliance</TabsTrigger>
          <TabsTrigger value="extensibility">Extensibility</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modules" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                {renderModuleList()}
              </div>
              <div className="md:col-span-2">
                {renderModuleDetail()}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="dataflow" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            renderDataFlowTab()
          )}
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            renderPrivacyTab()
          )}
        </TabsContent>
        
        <TabsContent value="extensibility" className="space-y-6">
          {isLoading ? (
            renderSkeleton()
          ) : (
            renderExtensibilityTab()
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsIntegration;
