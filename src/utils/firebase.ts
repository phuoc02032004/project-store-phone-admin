import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { MessagePayload } from "firebase/messaging";
import { firebaseConfig } from '@/constants';

if (!getApps().length) {
  initializeApp(firebaseConfig);
} else {
  getApp(); 
}

const messaging = typeof window !== "undefined" ? getMessaging() : null;

export const getMessagingToken = async () => {
  let currentToken = "";
  if (!messaging) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const vapidKey = import.meta.env.VITE_VAP_ID_KEY;
      if (!vapidKey) {
        console.error("VITE_VAPID_KEY is not defined in environment variables. FCM token retrieval aborted.");
        return ""; 
      }
      currentToken = await getToken(messaging, { vapidKey });
    } else {
      console.log("Notification permission not granted.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token: ", error);
  }
  return currentToken;
};

export const onMessageListener = (callback: (payload: MessagePayload) => void) => {
  if (!messaging) return;
  return onMessage(messaging, callback);
};
