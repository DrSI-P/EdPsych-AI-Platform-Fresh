import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

/**
 * User role management component for EdPsych Connect
 * Provides interface for administrators to manage user roles and permissions
 */
const UserRoleManagement = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if current user has admin privileges
  const isAdmin = session?.user?.role === 'admin';
  
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) {
        setIsLoading(false);
        return;
      }
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockUsers = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'student',
            status: 'active',
            createdAt: '2023-01-15T12:00:00Z',
            lastLogin: '2023-05-28T09:15:00Z'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            role: 'educator',
            status: 'active',
            createdAt: '2023-02-10T14:30:00Z',
            lastLogin: '2023-05-29T11:45:00Z'
          },
          {
            id: '3',
            name: 'Michael Brown',
            email: 'michael.brown@example.com',
            role: 'parent',
            status: 'pending',
            createdAt: '2023-03-05T09:20:00Z',
            lastLogin: null
          },
          {
            id: '4',
            name: 'Emma Wilson',
            email: 'emma.wilson@example.com',
            role: 'professional',
            status: 'active',
            createdAt: '2023-01-20T16:15:00Z',
            lastLogin: '2023-05-27T14:30:00Z'
          },
          {
            id: '5',
            name: 'David Lee',
            email: 'david.lee@example.com',
            role: 'student',
            status: 'suspended',
            createdAt: '2023-02-25T10:45:00Z',
            lastLogin: '2023-04-15T08:20:00Z'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        setErrorMessage('Failed to load users data');
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin]);
  
  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      // In a real implementation, this would send to an API
      // For now, we'll update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      setSuccessMessage(`User role updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update user role');
      console.error('Error updating role:', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Handle status change
  const handleStatusChange = async (userId, newStatus) => {
    try {
      // In a real implementation, this would send to an API
      // For now, we'll update the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      
      setSuccessMessage(`User status updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update user status');
      console.error('Error updating status:', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // If user is not an admin, show unauthorized message
  if (!isLoading && !isAdmin) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <Shield className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Unauthorized Access
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          You do not have permission to access the user management area.
        </p>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <span className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90">
              Return to Dashboard
            </span>
          </Link>
        </div>
      </div>
    );
  }
  
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage user roles and permissions
        </p>
      </div>
      
      {/* Filters and search */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search Users
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="educator">Educator</option>
              <option value="parent">Parent/Guardian</option>
              <option value="professional">Educational Professional</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Users table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-neutral-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Last Login
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
                    >
                      <option value="student">Student</option>
                      <option value="educator">Educator</option>
                      <option value="parent">Parent/Guardian</option>
                      <option value="professional">Professional</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className={`px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white ${
                        user.status === 'active' 
                          ? 'border-green-300 text-green-800 dark:border-green-700 dark:text-green-400' 
                          : user.status === 'pending'
                          ? 'border-yellow-300 text-yellow-800 dark:border-yellow-700 dark:text-yellow-400'
                          : 'border-red-300 text-red-800 dark:border-red-700 dark:text-red-400'
                      }`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(user.lastLogin)}
                      </div>
                    ) : (
                      <span className="italic">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/users/${user.id}`}>
                      <span className="text-primary hover:text-primary/80 mr-3">
                        View
                      </span>
                    </Link>
                    <button 
                      onClick={() => {/* Would handle user deletion */}}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleManagement;
