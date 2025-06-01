'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination } from '@/components/ui/pagination';
import { Dropdown } from '@/components/ui/dropdown';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface RoleOption {
  value: string;
  label: string;
}

export default function AdminUserManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  
  const pageSize = 10;
  
  useEffect(() => {
    fetchUsers();
  }, [currentPage, activeTab, searchQuery]);
  
  const roleOptions: any[] = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'EDUCATOR', label: 'Educator' },
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'PARENT', label: 'Parent/Guardian' },
  ];
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=${pageSize}&role=${activeTab !== 'all' ? activeTab : ''}&search=${searchQuery}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError('Error loading users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email,
      role: user.role,
    });
    setFormErrors({
      name: '',
      email: '',
      role: '',
    });
    setIsEditModalOpen(true);
  };
  
  const handleAddNewUser = () => {
    setSelectedUser(null);
    setEditForm({
      name: '',
      email: '',
      role: '',
    });
    setFormErrors({
      name: '',
      email: '',
      role: '',
    });
    setIsEditModalOpen(true);
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  const validateForm = () => {
    let valid = true;
    const errors = {
      name: '',
      email: '',
      role: '',
    };
    
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      errors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!editForm.role) {
      errors.role = 'Role is required';
      valid = false;
    }
    
    setFormErrors(errors);
    return valid;
  };
  
  const handleSaveUser = async () => {
    if (!validateForm()) return;
    
    try {
      setActionLoading(true);
      
      const url = selectedUser
        ? `/api/admin/users/${selectedUser.id}`
        : '/api/admin/users';
      
      const method = selectedUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      if (!response.ok) {
        throw new Error(selectedUser ? 'Failed to update user' : 'Failed to create user');
      }
      
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(selectedUser ? 'Error updating user' : 'Error creating user');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError('Error deleting user');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-muted-foreground">Manage platform users and their roles</p>
            </div>
            
            <Button onClick={handleAddNewUser}>
              Add New User
            </Button>
          </div>
          
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="STUDENT">Students</TabsTrigger>
                <TabsTrigger value="EDUCATOR">Educators</TabsTrigger>
                <TabsTrigger value="ADMIN">Admins</TabsTrigger>
                <TabsTrigger value="PARENT">Parents</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSearch} className="flex-1 md:max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full px-3 py-2 border border-grey-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-0 top-0 bottom-0">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                {error}
              </Alert>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name || '—'}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'EDUCATOR' ? 'bg-blue-100 text-blue-800' :
                            user.role === 'STUDENT' ? 'bg-green-100 text-green-800' :
                            'bg-grey-100 text-grey-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditUser(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-500"
                              onClick={() => handleDeleteUser(user)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={selectedUser ? 'Edit User' : 'Add New User'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-grey-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-grey-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-grey-700 mb-1">
              Role
            </label>
            <select
              id="role"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.role ? 'border-red-500' : 'border-grey-300'
              }`}
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            >
              <option value="">Select a role</option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.role && (
              <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveUser}
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
              {selectedUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div>
          <p className="text-grey-700 mb-6">
            Are you sure you want to delete the user <span className="font-semibold">{selectedUser?.name || selectedUser?.email}</span>? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={actionLoading}
            >
              {actionLoading ? <Spinner size="sm" className="mr-2" /> : null}
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}