import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { File, Folder, Plus, Search, Filter, Grid, List, Upload, Download, MoreHorizontal, Trash2, Edit, Share } from 'lucide-react';

/**
 * Content management system component for EdPsych Connect
 * Provides interface for creating, organizing, and managing educational content
 */
const ContentManagementSystem = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [contents, setContents] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('root');
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: 'root', name: 'My Content' }]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Check if user has appropriate permissions
  const canEdit = session?.user?.role === 'educator' || session?.user?.role === 'admin' || session?.user?.role === 'professional';
  
  // Fetch content data
  useEffect(() => {
    const fetchContents = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockContents = [
          {
            id: '1',
            type: 'folder',
            name: 'Lesson Plans',
            createdAt: '2023-04-15T10:30:00Z',
            updatedAt: '2023-05-20T14:45:00Z',
            size: null,
            owner: session.user.email,
            shared: false,
            parentFolder: 'root'
          },
          {
            id: '2',
            type: 'folder',
            name: 'Assessments',
            createdAt: '2023-04-18T09:15:00Z',
            updatedAt: '2023-05-25T11:20:00Z',
            size: null,
            owner: session.user.email,
            shared: true,
            parentFolder: 'root'
          },
          {
            id: '3',
            type: 'document',
            name: 'Learning Styles Guide.pdf',
            createdAt: '2023-05-10T13:45:00Z',
            updatedAt: '2023-05-10T13:45:00Z',
            size: 2.4, // MB
            owner: session.user.email,
            shared: false,
            parentFolder: 'root'
          },
          {
            id: '4',
            type: 'document',
            name: 'Classroom Management Strategies.docx',
            createdAt: '2023-05-12T15:30:00Z',
            updatedAt: '2023-05-12T15:30:00Z',
            size: 1.8, // MB
            owner: session.user.email,
            shared: false,
            parentFolder: 'root'
          },
          {
            id: '5',
            type: 'presentation',
            name: 'Introduction to Educational Psychology.pptx',
            createdAt: '2023-05-15T11:20:00Z',
            updatedAt: '2023-05-15T11:20:00Z',
            size: 5.2, // MB
            owner: session.user.email,
            shared: true,
            parentFolder: 'root'
          },
          {
            id: '6',
            type: 'video',
            name: 'Restorative Justice in Practice.mp4',
            createdAt: '2023-05-18T09:45:00Z',
            updatedAt: '2023-05-18T09:45:00Z',
            size: 45.7, // MB
            owner: session.user.email,
            shared: false,
            parentFolder: 'root'
          },
          {
            id: '7',
            type: 'document',
            name: 'Special Needs Accommodation Guide.pdf',
            createdAt: '2023-05-20T14:15:00Z',
            updatedAt: '2023-05-20T14:15:00Z',
            size: 3.1, // MB
            owner: session.user.email,
            shared: true,
            parentFolder: 'root'
          }
        ];
        
        // Filter contents based on current folder
        const filteredContents = mockContents.filter(item => item.parentFolder === currentFolder);
        setContents(filteredContents);
      } catch (error) {
        setErrorMessage('Failed to load content');
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContents();
  }, [session, currentFolder]);
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Handle folder navigation
  const navigateToFolder = (folderId, folderName) => {
    setCurrentFolder(folderId);
    
    // Update breadcrumbs
    if (folderId === 'root') {
      setBreadcrumbs([{ id: 'root', name: 'My Content' }]);
    } else {
      const newBreadcrumb = { id: folderId, name: folderName };
      setBreadcrumbs(prev => {
        // Check if we're navigating back to a previous folder
        const existingIndex = prev.findIndex(crumb => crumb.id === folderId);
        if (existingIndex !== -1) {
          return prev.slice(0, existingIndex + 1);
        }
        // Otherwise add to breadcrumbs
        return [...prev, newBreadcrumb];
      });
    }
    
    // Clear selection when changing folders
    setSelectedItems([]);
  };
  
  // Format file size
  const formatFileSize = (size) => {
    if (size === null) return '';
    if (size < 1) return `${(size * 1024).toFixed(0)} KB`;
    return `${size.toFixed(1)} MB`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Get icon based on content type
  const getContentIcon = (type) => {
    switch (type) {
      case 'folder':
        return <Folder className="h-6 w-6 text-yellow-500" />;
      case 'document':
        return <File className="h-6 w-6 text-blue-500" />;
      case 'presentation':
        return <File className="h-6 w-6 text-red-500" />;
      case 'video':
        return <File className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Filter and sort contents
  const filteredContents = contents
    .filter(item => {
      // Apply search filter
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply type filter
      const matchesType = filterType === 'all' || item.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt) - new Date(b.updatedAt);
          break;
        case 'size':
          // Folders come first when sorting by size
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create, organize, and manage your educational content
            </p>
          </div>
          
          {canEdit && (
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                New Content
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className="inline-flex items-center">
                {index > 0 && (
                  <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                )}
                <button
                  onClick={() => navigateToFolder(crumb.id, crumb.name)}
                  className={`inline-flex items-center text-sm font-medium ${
                    index === breadcrumbs.length - 1
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  {index === 0 && <Folder className="w-3 h-3 mr-1" />}
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
        {/* Search */}
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white appearance-none"
            >
              <option value="all">All Types</option>
              <option value="folder">Folders</option>
              <option value="document">Documents</option>
              <option value="presentation">Presentations</option>
              <option value="video">Videos</option>
            </select>
            <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-neutral-700 dark:text-white appearance-none"
            >
              <option value="date">Date Modified</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            <button 
              onClick={toggleSortDirection}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        {/* View mode */}
        <div className="flex items-center space-x-2 ml-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Selected items actions */}
      {selectedItems.length > 0 && (
        <div className="p-4 bg-primary/5 dark:bg-primary/10 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-1">
              <Share className="h-4 w-4" />
              Share
            </button>
            <button className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}
      
      {/* Content display */}
      {filteredContents.length === 0 ? (
        <div className="p-8 text-center">
          <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No content found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try a different search term' : 'This folder is empty'}
          </p>
          {canEdit && (
            <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2 hover:bg-primary/90 mx-auto">
              <Plus className="h-4 w-4" />
              Add Content
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredContents.map(item => (
                <div 
                  key={item.id}
                  className={`border rounded-lg overflow-hidden ${
                    selectedItems.includes(item.id)
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary'
                  }`}
                >
                  <div className="p-4 flex flex-col items-center">
                    <div className="mb-3">
                      {getContentIcon(item.type)}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center mb-1 truncate w-full">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.size)}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(item.updatedAt)}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleItemSelection(item.id)}
                        className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          readOnly
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </button>
                      {item.type === 'folder' ? (
                        <button
                          onClick={() => navigateToFolder(item.id, item.name)}
                          className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      ) : (
                        <button className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                          <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* List view */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-750">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        onChange={() => {
                          if (selectedItems.length === filteredContents.length) {
                            setSelectedItems([]);
                          } else {
                            setSelectedItems(filteredContents.map(item => item.id));
                          }
                        }}
                        checked={selectedItems.length === filteredContents.length && filteredContents.length > 0}
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Modified
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContents.map(item => (
                    <tr 
                      key={item.id}
                      className={selectedItems.includes(item.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {getContentIcon(item.type)}
                          </div>
                          <div>
                            {item.type === 'folder' ? (
                              <button
                                onClick={() => navigateToFolder(item.id, item.name)}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </span>
                            )}
                            {item.shared && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Shared
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(item.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {canEdit && (
                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <Share className="h-4 w-4" />
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            <Download className="h-4 w-4" />
                          </button>
                          {canEdit && (
                            <button className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredContents.length} item{filteredContents.length !== 1 ? 's' : ''}
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

export default ContentManagementSystem;
