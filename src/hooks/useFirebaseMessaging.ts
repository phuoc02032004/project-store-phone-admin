import { useEffect, useState } from 'react';
import { getMessagingToken, onMessageListener } from '@/utils/firebase';
import type { MessagePayload } from 'firebase/messaging';
import { updateFCMToken } from '@/api/user';
import { useNotifications } from '@/context/NotificationContext';

export const useFirebaseMessaging = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const { showInfo, fetchNotifications } = useNotifications();

  useEffect(() => {
    const requestToken = async () => {
      const token = await getMessagingToken();
      if (token) {
        setFcmToken(token);
        try {
          await updateFCMToken(token);
        } catch (error) {
          console.error("Failed to update FCM token: ", error);
        }
      }
    };

    requestToken();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (typeof window !== 'undefined') {
      unsubscribe = onMessageListener((payload: MessagePayload) => {
        if (payload.notification && payload.data) {
          showInfo(payload.notification.title || "New Notification");
          
          fetchNotifications();
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [showInfo, fetchNotifications]);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.serviceWorker) {
      const handleServiceWorkerMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'NEW_NOTIFICATION') {
          if (event.data.payload.notification) {
            showInfo(event.data.payload.notification.title || "New Notification");
          }
          
          fetchNotifications();
        }
      };

      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      };
    }
  }, [fetchNotifications, showInfo]);

  return { fcmToken };
};

