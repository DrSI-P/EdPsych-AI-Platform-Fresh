'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Bell,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  User,
  BookOpen
} from 'lucide-react';
import { EnhancedAccessibilityWrapper } from '@/components/accessibility/enhanced-accessibility-components';

/**
 * Mobile App Notifications Component
 * 
 * Provides a comprehensive interface for managing notifications,
 * reminders, and alerts in the mobile application.
 */
const MobileNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'assignment', 
      title: 'Mathematics Assignment Due', 
      message: 'Your fractions assignment is due tomorrow at 3:00 PM.', 
      timestamp: '2025-05-31T10:00:00Z',
      read: false
    },
    { 
      id: 2, 
      type: 'message', 
      title: 'New Message from Ms. Johnson', 
      message: 'Great progress on your reading comprehension!', 
      timestamp: '2025-05-30T15:30:00Z',
      read: true
    },
    { 
      id: 3, 
      type: 'progress', 
      title: 'Learning Milestone Achieved', 
      message: 'You\'ve completed 75% of your Mathematics module!', 
      timestamp: '2025-05-30T12:15:00Z',
      read: false
    },
    { 
      id: 4, 
      type: 'reminder', 
      title: 'Study Session Reminder', 
      message: 'Your scheduled study session for Science begins in 30 minutes.', 
      timestamp: '2025-05-29T09:00:00Z',
      read: true
    }
  ]);
  
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Mathematics Study Session',
      date: '2025-06-01',
      time: '16:00',
      recurring: false,
      active: true
    },
    {
      id: 2,
      title: 'English Reading Practice',
      date: '2025-06-02',
      time: '15:30',
      recurring: true,
      recurrencePattern: 'weekly',
      active: true
    },
    {
      id: 3,
      title: 'Science Project Work',
      date: '2025-06-03',
      time: '17:00',
      recurring: false,
      active: false
    }
  ]);
  
  const [activeTab, setActiveTab] = useState('all');
  const [notificationFilter, setNotificationFilter] = useState('all');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'progress':
        return <CheckCircle className="h-4 w-4" />;
      case 'reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Toggle reminder active state
  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
  };
  
  // Delete reminder
  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };
  
  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (notificationFilter === 'all') return true;
    if (notificationFilter === 'unread') return !notification.read;
    return notification.type === notificationFilter;
  });
  
  return (
    <EnhancedAccessibilityWrapper>
      <main id="main-content" className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Notifications & Reminders</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <div className="flex items-center space-x-2">
                <Label htmlFor="notification-filter" className="text-sm">Filter:</Label>
                <select 
                  id="notification-filter" 
                  className="text-sm p-1 border rounded"
                  value={notificationFilter}
                  onChange={(e) => setNotificationFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="assignment">Assignments</option>
                  <option value="message">Messages</option>
                  <option value="progress">Progress</option>
                  <option value="reminder">Reminders</option>
                </select>
              </div>
            </div>
            
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map(notification => (
                  <Card key={notification.id} className={notification.read ? 'opacity-75' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          notification.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'message' ? 'bg-green-100 text-green-600' :
                          notification.type === 'progress' ? 'bg-purple-100 text-purple-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                              )}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm mt-1">{notification.message}</p>
                          
                          <div className="flex justify-end space-x-2 mt-3">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any notifications at the moment.
                </p>
              </div>
            )}
            
            {filteredNotifications.length > 0 && (
              <div className="flex justify-between mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                >
                  Mark All as Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNotifications([])}
                >
                  Clear All
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="reminders" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reminders</h2>
              <Button size="sm">Add Reminder</Button>
            </div>
            
            {reminders.length > 0 ? (
              <div className="space-y-4">
                {reminders.map(reminder => (
                  <Card key={reminder.id} className={!reminder.active ? 'opacity-60' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            reminder.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{reminder.title}</h3>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span>{reminder.date} at {reminder.time}</span>
                              {reminder.recurring && (
                                <span>Recurring: {reminder.recurrencePattern}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleReminder(reminder.id)}
                          >
                            {reminder.active ? 'Disable' : 'Enable'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteReminder(reminder.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reminders</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You don't have any reminders set up.
                </p>
                <Button>Create Reminder</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Notification Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="assignment-notifications" className="text-sm">Assignments</Label>
                      </div>
                      <input 
                        type="checkbox" 
                        id="assignment-notifications" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="message-notifications" className="text-sm">Messages</Label>
                      </div>
                      <input 
                        type="checkbox" 
                        id="message-notifications" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="progress-notifications" className="text-sm">Progress Updates</Label>
                      </div>
                      <input 
                        type="checkbox" 
                        id="progress-notifications" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="reminder-notifications" className="text-sm">Reminders</Label>
                      </div>
                      <input 
                        type="checkbox" 
                        id="reminder-notifications" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Notification Timing</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-timing" className="text-sm">Notification Time</Label>
                      <select 
                        id="notification-timing" 
                        className="text-sm p-1 border rounded"
                        defaultValue="30"
                      >
                        <option value="15">15 minutes before</option>
                        <option value="30">30 minutes before</option>
                        <option value="60">1 hour before</option>
                        <option value="120">2 hours before</option>
                        <option value="1440">1 day before</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quiet-hours-start" className="text-sm">Quiet Hours Start</Label>
                      <input 
                        type="time" 
                        id="quiet-hours-start" 
                        defaultValue="22:00" 
                        className="text-sm p-1 border rounded"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="quiet-hours-end" className="text-sm">Quiet Hours End</Label>
                      <input 
                        type="time" 
                        id="quiet-hours-end" 
                        defaultValue="07:00" 
                        className="text-sm p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium mb-2">Notification Display</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-sound" className="text-sm">Play Sound</Label>
                      <input 
                        type="checkbox" 
                        id="notification-sound" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-vibration" className="text-sm">Vibration</Label>
                      <input 
                        type="checkbox" 
                        id="notification-vibration" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notification-led" className="text-sm">LED Indicator</Label>
                      <input 
                        type="checkbox" 
                        id="notification-led" 
                        defaultChecked 
                        className="h-4 w-4"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </EnhancedAccessibilityWrapper>
  );
};

// Export the component
export default MobileNotifications;
