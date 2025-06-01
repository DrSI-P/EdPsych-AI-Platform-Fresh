import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MessageCircle, Users, Check, AlertTriangle, Clock, Settings } from 'lucide-react';

/**
 * Restorative Justice Framework component for EdPsych Connect
 * Provides tools for implementing restorative practices in educational settings
 */
const RestorativeJusticeFramework = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('circles');
  const [circles, setCircles] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [resources, setResources] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const canManage = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch restorative justice data
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        
        // Mock circles data
        const mockCircles = [
          {
            id: '1',
            title: 'Year 7 Community Building Circle',
            type: 'community',
            status: 'scheduled',
            date: '2023-06-15T14:30:00Z',
            participants: 18,
            facilitator: 'Ms. Johnson',
            location: 'Room 104'
          },
          {
            id: '2',
            title: 'Conflict Resolution: Playground Incident',
            type: 'responsive',
            status: 'completed',
            date: '2023-05-28T13:15:00Z',
            participants: 6,
            facilitator: 'Mr. Thompson',
            location: 'Guidance Office'
          },
          {
            id: '3',
            title: 'Year 9 Bullying Prevention Circle',
            type: 'proactive',
            status: 'scheduled',
            date: '2023-06-20T10:00:00Z',
            participants: 22,
            facilitator: 'Ms. Williams',
            location: 'Assembly Hall'
          },
          {
            id: '4',
            title: 'Reintegration Circle: Returning Student',
            type: 'reintegration',
            status: 'in-progress',
            date: '2023-06-02T09:30:00Z',
            participants: 8,
            facilitator: 'Dr. Martinez',
            location: 'Conference Room'
          }
        ];
        
        // Mock agreements data
        const mockAgreements = [
          {
            id: '1',
            title: 'Year 8 Classroom Respect Agreement',
            status: 'active',
            createdAt: '2023-05-10T11:20:00Z',
            participants: 24,
            reviewDate: '2023-06-10T11:20:00Z',
            completionRate: 85
          },
          {
            id: '2',
            title: 'Conflict Resolution: Alex and Jamie',
            status: 'completed',
            createdAt: '2023-05-15T14:45:00Z',
            participants: 2,
            reviewDate: '2023-05-29T14:45:00Z',
            completionRate: 100
          },
          {
            id: '3',
            title: 'Playground Behaviour Agreement',
            status: 'active',
            createdAt: '2023-05-20T09:30:00Z',
            participants: 45,
            reviewDate: '2023-06-20T09:30:00Z',
            completionRate: 72
          },
          {
            id: '4',
            title: 'Digital Citizenship Agreement',
            status: 'needs-review',
            createdAt: '2023-04-12T13:15:00Z',
            participants: 120,
            reviewDate: '2023-05-12T13:15:00Z',
            completionRate: 65
          }
        ];
        
        // Mock resources data
        const mockResources = [
          {
            id: '1',
            title: 'Introduction to Restorative Practices',
            type: 'guide',
            audience: 'staff',
            format: 'pdf',
            createdAt: '2023-03-15T10:30:00Z',
            downloads: 45
          },
          {
            id: '2',
            title: 'Circle Process Facilitation Cards',
            type: 'tool',
            audience: 'facilitators',
            format: 'printable',
            createdAt: '2023-04-02T14:15:00Z',
            downloads: 32
          },
          {
            id: '3',
            title: 'Restorative Questions for Primary Students',
            type: 'handout',
            audience: 'students',
            format: 'pdf',
            createdAt: '2023-04-10T09:45:00Z',
            downloads: 78
          },
          {
            id: '4',
            title: 'Parent Guide to Restorative Approaches',
            type: 'guide',
            audience: 'parents',
            format: 'pdf',
            createdAt: '2023-05-05T11:20:00Z',
            downloads: 56
          },
          {
            id: '5',
            title: 'Restorative Justice in Schools: Video Series',
            type: 'video',
            audience: 'all',
            format: 'mp4',
            createdAt: '2023-05-12T15:30:00Z',
            downloads: 89
          }
        ];
        
        setCircles(mockCircles);
        setAgreements(mockAgreements);
        setResources(mockResources);
      } catch (error) {
        setErrorMessage('Failed to load restorative justice data');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</span>;
      case 'needs-review':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Needs Review</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{status}</span>;
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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Restorative Justice Framework</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tools and resources for implementing restorative practices in educational settings
            </p>
          </div>
          
          {canManage && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <MessageCircle className="h-4 w-4" />
                New Circle
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          <button 
            onClick={() => setActiveTab('circles')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'circles'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageCircle className="inline-block h-4 w-4 mr-2" />
            Circle Process
          </button>
          <button 
            onClick={() => setActiveTab('agreements')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'agreements'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Check className="inline-block h-4 w-4 mr-2" />
            Agreements
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'resources'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Users className="inline-block h-4 w-4 mr-2" />
            Resources
          </button>
        </nav>
      </div>
      
      {/* Circle Process Tab */}
      {activeTab === 'circles' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Circle Sessions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Community
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Responsive
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Proactive
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                Reintegration
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {circles.map(circle => (
              <div 
                key={circle.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {circle.title}
                    </h4>
                    {getStatusBadge(circle.status)}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{circle.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Participants</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{circle.participants}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Facilitator</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{circle.facilitator}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{circle.location}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(circle.date)}
                    </span>
                  </div>
                  <Link href={`/restorative-justice/circles/${circle.id}`}>
                    <span className="text-xs text-primary hover:text-primary/80">
                      View Details
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {circles.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No circles found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no circle sessions scheduled or completed yet.
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <MessageCircle className="h-4 w-4" />
                  Create First Circle
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Agreements Tab */}
      {activeTab === 'agreements' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Restorative Agreements
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Active
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Completed
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                Needs Review
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-neutral-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Agreement
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Participants
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Review Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Completion
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                {agreements.map(agreement => (
                  <tr key={agreement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {agreement.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(agreement.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {agreement.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(agreement.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(agreement.reviewDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              agreement.completionRate >= 80 ? 'bg-green-500' :
                              agreement.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${agreement.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {agreement.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/restorative-justice/agreements/${agreement.id}`}>
                        <span className="text-primary hover:text-primary/80">
                          View
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {agreements.length === 0 && (
            <div className="text-center py-8">
              <Check className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No agreements found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no restorative agreements created yet.
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Check className="h-4 w-4" />
                  Create First Agreement
                </button>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="p-6">
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 md:mb-0">
              Restorative Justice Resources
            </h3>
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Staff
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Students
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                Parents
              </button>
              <button className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <div 
                key={resource.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {resource.title}
                    </h4>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 uppercase">
                      {resource.format}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{resource.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Audience</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">{resource.audience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(resource.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Downloads</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{resource.downloads}</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.audience === 'all' ? 'For everyone' : `For ${resource.audience}`}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/restorative-justice/resources/${resource.id}`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        View
                      </span>
                    </Link>
                    <Link href={`/restorative-justice/resources/${resource.id}/download`}>
                      <span className="text-xs text-primary hover:text-primary/80">
                        Download
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {resources.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No resources found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                There are no restorative justice resources available yet.
              </p>
              {canManage && (
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm inline-flex items-center gap-2 hover:bg-primary/90">
                  <Users className="h-4 w-4" />
                  Add First Resource
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestorativeJusticeFramework;
