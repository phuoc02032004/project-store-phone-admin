import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { getmyNotifications, markNotificationAsRead as apiMarkNotificationAsRead } from '@/api/notify';
import type { Notify } from '@/types/Notify';


interface NotificationContextType {
  notifications: Notify[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notify[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getmyNotifications();
      setNotifications(data);
      const unreadNotifications = data.filter(n => !n.read).length;
      setUnreadCount(unreadNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications.");
    }
  }, []);

  const markNotificationAsRead = useCallback(async (id: string) => {
    try {
      await apiMarkNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      toast.error("Failed to mark notification as read.");
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(async (notification) => {
          if (notification._id) {
            await apiMarkNotificationAsRead(notification._id);
          }
        })
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  }, [notifications]);
  useEffect(() => {
    if(!localStorage.getItem('tokenAdmin')) {
      console.log("You need to be logged in to view notifications.");
      return;
    } else {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
  }, [unreadCount]);

  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message: string) => {
    toast.info(message);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      showSuccess,
      showError,
      showInfo
    }}>
      {children}
    </NotificationContext.Provider>
  );
};