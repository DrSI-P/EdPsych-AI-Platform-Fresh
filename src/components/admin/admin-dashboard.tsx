'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select, Checkbox } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';
import { AIPrompt } from '@/components/ai/ai-prompt';

interface AdminDashboardProps {
  className?: string;
}

export function AdminDashboard({
  className = ''
}: AdminDashboardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mock data for demonstration
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    role: 'System Administrator',
    organisation: 'EdPsych Connect',
    users: [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Educational Psychologist',
        status: 'active',
        lastLogin: '2025-05-15 14:32',
        dateCreated: '2025-01-10'
      },
      {
        id: '2',
        name: 'James Wilson',
        email: 'james.wilson@example.com',
        role: 'Teacher',
        status: 'active',
        lastLogin: '2025-05-14 09:15',
        dateCreated: '2025-02-05'
      },
      {
        id: '3',
        name: 'Emma Thompson',
        email: 'emma.thompson@example.com',
        role: 'Student',
        status: 'active',
        lastLogin: '2025-05-15 16:45',
        dateCreated: '2025-02-10'
      },
      {
        id: '4',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'Parent',
        status: 'inactive',
        lastLogin: '2025-04-28 11:20',
        dateCreated: '2025-02-15'
      },
      {
        id: '5',
        name: 'Olivia Davis',
        email: 'olivia.davis@example.com',
        role: 'School Administrator',
        status: 'pending',
        lastLogin: 'Never',
        dateCreated: '2025-05-14'
      }
    ],
    schools: [
      {
        id: '1',
        name: 'Oakwood Secondary School',
        type: 'Secondary',
        location: 'London',
        usersCount: 245,
        status: 'active',
        dateAdded: '2025-01-05'
      },
      {
        id: '2',
        name: 'Oakwood Primary School',
        type: 'Primary',
        location: 'London',
        usersCount: 180,
        status: 'active',
        dateAdded: '2025-01-05'
      },
      {
        id: '3',
        name: 'Riverside Academy',
        type: 'Secondary',
        location: 'Manchester',
        usersCount: 320,
        status: 'active',
        dateAdded: '2025-02-12'
      },
      {
        id: '4',
        name: 'Meadow Lane Primary',
        type: 'Primary',
        location: 'Birmingham',
        usersCount: 150,
        status: 'active',
        dateAdded: '2025-03-08'
      },
      {
        id: '5',
        name: 'Hillside School',
        type: 'Special Education',
        location: 'Leeds',
        usersCount: 85,
        status: 'pending',
        dateAdded: '2025-05-10'
      }
    ],
    systemStats: {
      totalUsers: 980,
      activeUsers: 845,
      totalSchools: 12,
      totalResources: 1250,
      totalAssessments: 3450,
      storageUsed: '1.2 TB',
      apiCalls: {
        daily: 12500,
        monthly: 320000
      },
      aiUsage: {
        completions: 8500,
        embeddings: 15000,
        images: 2200
      }
    },
    recentActivity: [
      {
        id: '1',
        type: 'user',
        action: 'created',
        details: 'New user account created: Olivia Davis (School Administrator)',
        timestamp: '2025-05-14 15:30',
        actor: 'System'
      },
      {
        id: '2',
        type: 'school',
        action: 'added',
        details: 'New school added: Hillside School (Special Education)',
        timestamp: '2025-05-10 11:15',
        actor: 'Admin User'
      },
      {
        id: '3',
        type: 'system',
        action: 'updated',
        details: 'System update deployed: v2.5.0 (AI Service Enhancements)',
        timestamp: '2025-05-08 03:00',
        actor: 'System'
      },
      {
        id: '4',
        type: 'resource',
        action: 'added',
        details: 'New resource library added: Special Educational Needs Resources',
        timestamp: '2025-05-05 14:20',
        actor: 'Admin User'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'Storage usage approaching 80% of allocated capacity',
        timestamp: '2025-05-15 08:30'
      },
      {
        id: '2',
        type: 'info',
        message: 'Scheduled maintenance planned for 2025-05-20 02:00-04:00 UTC',
        timestamp: '2025-05-14 10:00'
      },
      {
        id: '3',
        type: 'error',
        message: 'API rate limit exceeded for OpenAI service on 2025-05-13',
        timestamp: '2025-05-13 16:45'
      }
    ]
  });
  
  // Fetch data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Handle user status change
  const handleUserStatusChange = (userId: string, newStatus: string) => {
    setAdminData(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      )
    }));
    
    showToast({
      title: `User status updated to ${newStatus}`,
      type: 'success'
    });
  };
  
  // Handle school status change
  const handleSchoolStatusChange = (schoolId: string, newStatus: string) => {
    setAdminData(prev => ({
      ...prev,
      schools: prev.schools.map(school => 
        school.id === schoolId 
          ? { ...school, status: newStatus } 
          : school
      )
    }));
    
    showToast({
      title: `School status updated to ${newStatus}`,
      type: 'success'
    });
  };
  
  // Handle alert dismissal
  const handleDismissAlert = (alertId: string) => {
    setAdminData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };
  
  // Define the tabs
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <div>
                  <h2 className="text-xl font-semibold">Admin Dashboard</h2>
                  <p className="text-sm text-grey-600">{adminData.role} • {adminData.organisation}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">System Status</p>
                  <p className="text-sm text-green-600">Operational</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {adminData.alerts.length > 0 && (
                  <div className="space-y-2">
                    {adminData.alerts.map(alert => (
                      <Alert 
                        key={alert.id} 
                        variant={alert.type as 'info' | 'warning' | 'error'}
                        dismissible
                        onDismiss={() => handleDismissAlert(alert.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-grey-600">{alert.timestamp}</p>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {adminData.systemStats.totalUsers}
                      </div>
                      <p className="text-sm text-grey-600">Total Users</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {adminData.systemStats.activeUsers}
                      </div>
                      <p className="text-sm text-grey-600">Active Users</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {adminData.systemStats.totalSchools}
                      </div>
                      <p className="text-sm text-grey-600">Schools</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-centre">
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {adminData.systemStats.totalResources}
                      </div>
                      <p className="text-sm text-grey-600">Resources</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">System Usage</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Storage Used</span>
                          <span>{adminData.systemStats.storageUsed}</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: '80%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>API Calls (Daily)</span>
                          <span>{adminData.systemStats.apiCalls.daily.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="text-sm font-medium mb-2">AI Usage Breakdown</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Completions</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.completions.toLocaleString()}</p>
                          </div>
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Embeddings</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.embeddings.toLocaleString()}</p>
                          </div>
                          <div className="p-2 bg-grey-50 rounded-md">
                            <p className="text-xs text-grey-500">Images</p>
                            <p className="text-sm font-medium">{adminData.systemStats.aiUsage.images.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.recentActivity.map(activity => (
                      <div key={activity.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{activity.details}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.type === 'user' ? 'bg-blue-100 text-blue-800' :
                            activity.type === 'school' ? 'bg-green-100 text-green-800' :
                            activity.type === 'system' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {activity.type}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>By: {activity.actor}</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      className="w-full"
                    >
                      View All Activity
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-centre">
                      <h3 className="text-lg font-semibold">Recent Users</h3>
                      <Button size="sm">Manage Users</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.users.slice(0, 3).map(user => (
                      <div key={user.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-grey-600">{user.email}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>Role: {user.role}</span>
                          <span>Last Login: {user.lastLogin}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-centre">
                      <h3 className="text-lg font-semibold">Recent Schools</h3>
                      <Button size="sm">Manage Schools</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {adminData.schools.slice(0, 3).map(school => (
                      <div key={school.id} className="p-3 rounded-md border hover:bg-grey-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{school.name}</h4>
                            <p className="text-sm text-grey-600">{school.type} • {school.location}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            school.status === 'active' ? 'bg-green-100 text-green-800' :
                            school.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {school.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-grey-600 mt-1">
                          <span>Users: {school.usersCount}</span>
                          <span>Added: {school.dateAdded}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )
    },
    {
      id: 'users',
      label: 'User Management',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">User Management</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search users..."
                    className="w-64"
                  />
                  <Select
                    options={[
                      { value: 'all', label: 'All Roles' },
                      { value: 'educational_psychologist', label: 'Educational Psychologist' },
                      { value: 'teacher', label: 'Teacher' },
                      { value: 'student', label: 'Student' },
                      { value: 'parent', label: 'Parent' },
                      { value: 'school_admin', label: 'School Administrator' }
                    ]}
                    className="w-48"
                  />
                  <Button>
                    Add User
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-grey-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Last Login</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Date Created</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-grey-200">
                        {adminData.users.map(user => (
                          <tr key={user.id} className="hover:bg-grey-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium">{user.name}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-grey-600">{user.email}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">{user.role}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' :
                                user.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-grey-600">{user.lastLogin}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-grey-600">{user.dateCreated}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                {user.status === 'active' ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUserStatusChange(user.id, 'inactive')}
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUserStatusChange(user.id, 'active')}
                                  >
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-centre">
                <div>
                  <p className="text-sm text-grey-600">Showing {adminData.users.length} of {adminData.systemStats.totalUsers} users</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Bulk User Actions</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Import Users</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Import multiple users from a CSV file.
                        </p>
                        <Button variant="outline" className="w-full">
                          Import CSV
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Export Users</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Export user data to CSV or Excel format.
                        </p>
                        <Button variant="outline" className="w-full">
                          Export Data
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Bulk Update</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Update multiple user accounts at once.
                        </p>
                        <Button variant="outline" className="w-full">
                          Bulk Update
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'schools',
      label: 'School Management',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">School Management</h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search schools..."
                    className="w-64"
                  />
                  <Select
                    options={[
                      { value: 'all', label: 'All Types' },
                      { value: 'primary', label: 'Primary' },
                      { value: 'secondary', label: 'Secondary' },
                      { value: 'special', label: 'Special Education' }
                    ]}
                    className="w-40"
                  />
                  <Button>
                    Add School
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-grey-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Users</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-grey-500 uppercase tracking-wider">Date Added</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-grey-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-grey-200">
                        {adminData.schools.map(school => (
                          <tr key={school.id} className="hover:bg-grey-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium">{school.name}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">{school.type}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-grey-600">{school.location}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm">{school.usersCount}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                school.status === 'active' ? 'bg-green-100 text-green-800' :
                                school.status === 'inactive' ? 'bg-grey-100 text-grey-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {school.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-grey-600">{school.dateAdded}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">Edit</Button>
                                <Button size="sm" variant="outline">View Users</Button>
                                {school.status === 'active' ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleSchoolStatusChange(school.id, 'inactive')}
                                  >
                                    Deactivate
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleSchoolStatusChange(school.id, 'active')}
                                  >
                                    Activate
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between items-centre">
                <div>
                  <p className="text-sm text-grey-600">Showing {adminData.schools.length} of {adminData.systemStats.totalSchools} schools</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">School Onboarding</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Onboarding Steps</h4>
                      <ol className="space-y-2 text-sm">
                        <li className="flex items-centre gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-centre justify-centre font-medium">1</div>
                          <span>Add school details and administrator</span>
                        </li>
                        <li className="flex items-centre gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-centre justify-centre font-medium">2</div>
                          <span>Configure school settings and permissions</span>
                        </li>
                        <li className="flex items-centre gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-centre justify-centre font-medium">3</div>
                          <span>Import users (staff and students)</span>
                        </li>
                        <li className="flex items-centre gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-centre justify-centre font-medium">4</div>
                          <span>Set up curriculum and resources</span>
                        </li>
                        <li className="flex items-centre gap-2">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-centre justify-centre font-medium">5</div>
                          <span>Provide training and support</span>
                        </li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Start New School Onboarding
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Generate Onboarding Templates
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Schedule Onboarding Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    },
    {
      id: 'system',
      label: 'System Settings',
      content: (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-centre py-8">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="error">
              {error}
            </Alert>
          ) : (
            <>
              <div className="flex justify-between items-centre">
                <h2 className="text-xl font-semibold">System Settings</h2>
                <Button>
                  Save Changes
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">General Settings</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Platform Name</label>
                      <Input 
                        value="EdPsych Connect"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Support Email</label>
                      <Input 
                        value="support@edpsychconnect.com"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Language</label>
                      <Select
                        options={[
                          { value: 'en-GB', label: 'English (UK)' },
                          { value: 'en-US', label: 'English (US)' },
                          { value: 'fr', label: 'French' },
                          { value: 'es', label: 'Spanish' }
                        ]}
                        value="en-GB"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Time Zone</label>
                      <Select
                        options={[
                          { value: 'Europe/London', label: 'London (GMT/BST)' },
                          { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
                          { value: 'America/New_York', label: 'New York (EST/EDT)' }
                        ]}
                        value="Europe/London"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Checkbox 
                        label="Enable maintenance mode"
                        checked={false}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">AI Service Settings</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Default AI Provider</label>
                      <Select
                        options={[
                          { value: 'openai', label: 'OpenAI' },
                          { value: 'anthropic', label: 'Anthropic' },
                          { value: 'gemini', label: 'Google Gemini' },
                          { value: 'grok', label: 'GROK' },
                          { value: 'openrouter', label: 'OpenRouter' }
                        ]}
                        value="openai"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Default Model</label>
                      <Select
                        options={[
                          { value: 'gpt-4o', label: 'GPT-4o' },
                          { value: 'claude-3-opus', label: 'Claude 3 Opus' },
                          { value: 'gemini-pro', label: 'Gemini Pro' }
                        ]}
                        value="gpt-4o"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">API Rate Limit (calls/minute)</label>
                      <Input 
                        type="number"
                        value="100"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Checkbox 
                        label="Enable content filtering"
                        checked={true}
                      />
                    </div>
                    
                    <div>
                      <Checkbox 
                        label="Log all AI interactions"
                        checked={true}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Security Settings</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
                      <Input 
                        type="number"
                        value="60"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Password Policy</label>
                      <Select
                        options={[
                          { value: 'standard', label: 'Standard (8+ chars, mixed case)' },
                          { value: 'strong', label: 'Strong (10+ chars, mixed case, symbols)' },
                          { value: 'very_strong', label: 'Very Strong (12+ chars, mixed case, symbols, numbers)' }
                        ]}
                        value="strong"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Checkbox 
                        label="Enable two-factor authentication"
                        checked={true}
                      />
                    </div>
                    
                    <div>
                      <Checkbox 
                        label="Enforce password rotation (90 days)"
                        checked={true}
                      />
                    </div>
                    
                    <div>
                      <Checkbox 
                        label="Log all authentication attempts"
                        checked={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">API Configuration</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Anthropic API Key</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Google Gemini API Key</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">GROK API Key</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">OpenRouter API Key</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        Test API Connections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Database & Storage</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">PostgreSQL Connection</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">MongoDB Connection</label>
                      <Input 
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Firebase Configuration</label>
                      <Textarea
                        value={'{\n  "apiKey": "•••••••••••••••••••••••",\n  "authDomain": "edpsych-connect.firebaseapp.com",\n  "projectId": "edpsych-connect"\n  /* Additional fields hidden */\n}'}
                        className="w-full h-24 font-mono text-xs"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Storage Provider</label>
                      <Select
                        options={[
                          { value: 'local', label: 'Local Storage' },
                          { value: 's3', label: 'Amazon S3' },
                          { value: 'firebase', label: 'Firebase Storage' }
                        ]}
                        value="s3"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        Test Database Connections
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">System Maintenance</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Backup Database</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Create a full backup of all system databases.
                        </p>
                        <Button variant="outline" className="w-full">
                          Create Backup
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Clear Cache</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Clear system cache to improve performance.
                        </p>
                        <Button variant="outline" className="w-full">
                          Clear Cache
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">System Logs</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          View and download system logs for troubleshooting.
                        </p>
                        <Button variant="outline" className="w-full">
                          View Logs
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-2">Update System</h4>
                        <p className="text-sm text-grey-600 mb-4">
                          Check for and apply system updates.
                        </p>
                        <Button variant="outline" className="w-full">
                          Check Updates
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className={className}>
      <Tabs tabs={tabs} />
    </div>
  );
}
