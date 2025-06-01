import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

/**
 * Notification toast component for EdPsych Connect
 * Displays real-time notifications to users
 */
const NotificationToast = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-dismiss notification after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete before removing
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
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
  
  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {notification.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {notification.message}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Notification provider component for EdPsych Connect
 * Manages and displays real-time notifications
 */
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Add a new notification
  const addNotification = (notification) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };
  
  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  // Example of how to use this in other components:
  // const { addNotification } = useContext(NotificationContext);
  // addNotification({
  //   type: 'achievement',
  //   title: 'Achievement Unlocked',
  //   message: 'You completed your first lesson!'
  // });
  
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

// Create context for notifications
export const NotificationContext = React.createContext({
  addNotification: () => {}
});

// Custom hook for using notifications
export const useNotification = () => {
  return React.useContext(NotificationContext);
};

export default NotificationProvider;
