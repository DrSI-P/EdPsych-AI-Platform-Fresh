import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Bell, Settings, Check, X } from 'lucide-react';

/**
 * Notification management component for EdPsych Connect
 * Provides interface for users to view and manage their notifications
 */
const NotificationCenter = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch notifications data
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.email) return;
      
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockNotifications = [
          {
            id: '1',
            type: 'assignment',
            title: 'New Assignment Available',
            message: 'Your teacher has assigned a new task: "Understanding Learning Styles"',
            isRead: false,
            createdAt: '2023-05-29T14:30:00Z'
          },
          {
            id: '2',
            type: 'feedback',
            title: 'Feedback Received',
            message: 'You have received feedback on your recent assessment',
            isRead: true,
            createdAt: '2023-05-28T09:15:00Z'
          },
          {
            id: '3',
            type: 'system',
            title: 'Platform Update',
            message: 'EdPsych Connect has been updated with new features',
            isRead: false,
            createdAt: '2023-05-27T16:45:00Z'
          },
          {
            id: '4',
            type: 'achievement',
            title: 'Achievement Unlocked',
            message: 'Congratulations! You have earned the "Consistent Learner" badge',
            isRead: false,
            createdAt: '2023-05-26T11:20:00Z'
          },
          {
            id: '5',
            type: 'message',
            title: 'New Message',
            message: 'You have received a message from your teacher',
            isRead: true,
            createdAt: '2023-05-25T13:10:00Z'
          }
        ];
        
        setNotifications(mockNotifications);
      } catch (error) {
        setErrorMessage('Failed to load notifications');
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [session]);
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // In a real implementation, this would send to an API
      // For now, we'll update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      setErrorMessage('Failed to update notification');
      console.error('Error updating notification:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would send to an API
      // For now, we'll update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      
      setSuccessMessage('All notifications marked as read');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to update notifications');
      console.error('Error updating notifications:', error);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };
  
  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      // In a real implementation, this would send to an API
      // For now, we'll update the local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      setErrorMessage('Failed to delete notification');
      console.error('Error deleting notification:', error);
    }
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'assignment':
        return <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300">📝</div>;
      case 'feedback':
        return <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-500 dark:text-green-300">📊</div>;
      case 'system':
        return <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-300">⚙️</div>;
      case 'achievement':
        return <div className="h-8 w-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-yellow-500 dark:text-yellow-300">🏆</div>;
      case 'message':
        return <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-500 dark:text-purple-300">💬</div>;
      default:
        return <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Bell className="h-4 w-4" /></div>;
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
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stay updated with your latest activities
          </p>
        </div>
        <Link href="/settings/notifications">
          <span className="text-sm text-primary hover:text-primary/80 flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </span>
        </Link>
      </div>
      
      {/* Notification filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
            <Check className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <X className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'unread'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('assignment')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'assignment'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setFilter('feedback')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'feedback'
                ? 'bg-green-500 text-white'
                : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            }`}
          >
            Feedback
          </button>
          <button
            onClick={() => setFilter('achievement')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'achievement'
                ? 'bg-yellow-500 text-white'
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setFilter('message')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'message'
                ? 'bg-purple-500 text-white'
                : 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
            }`}
          >
            Messages
          </button>
        </div>
      </div>
      
      {/* Notifications list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <p>No notifications found</p>
          </div>
        ) : (
          <>
            <div className="p-4 bg-gray-50 dark:bg-neutral-750 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-primary/80"
              >
                Mark all as read
              </button>
            </div>
            
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 flex ${notification.isRead ? 'bg-white dark:bg-neutral-800' : 'bg-blue-50 dark:bg-blue-900/10'}`}
              >
                <div className="flex-shrink-0 mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className={`text-sm font-medium ${notification.isRead ? 'text-gray-900 dark:text-white' : 'text-primary'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex space-x-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Pagination */}
      {filteredNotifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page 1 of 1
          </span>
          <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
