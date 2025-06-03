// public/firebase-messaging-sw.js

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");
// Lưu ý: Kiểm tra phiên bản Firebase SDK mới nhất và cập nhật nếu cần.
// Đảm bảo phiên bản này tương thích với phiên bản bạn dùng trong app.

// TODO: Thay thế bằng cấu hình Firebase của dự án bạn (giống như trong src/firebase.js)
// KHÔNG bao gồm measurementId ở đây.
const firebaseConfig = {
   apiKey: "AIzaSyAiHbDxQ4yFGds_O618Cx37eXO_kHJbyp4",
  authDomain: "mystore-f5981.firebaseapp.com",
  projectId: "mystore-f5981",
  storageBucket: "mystore-f5981.firebasestorage.app",
  messagingSenderId: "1073676082139",
  appId: "1:1073676082139:web:86c25f2bdc328127f665fe",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Xử lý tin nhắn nền
messaging.onBackgroundMessage((payload) => {
  // console.log(
  //   "[firebase-messaging-sw.js] Received background message ",
  //   payload
  // );

  // Tùy chỉnh thông báo ở đây
  const notificationTitle = payload.notification?.title || "Thông báo mới";
  const notificationOptions = {
    body: payload.notification?.body || "Bạn có tin nhắn mới.",
    icon: payload.notification?.icon || "/logo192.png", // Đảm bảo có file này trong public hoặc cung cấp URL đầy đủ
    data: payload.data // Dữ liệu tùy chỉnh bạn gửi kèm, ví dụ: URL để mở khi click
  };

  // self.registration là một thuộc tính của ServiceWorkerGlobalScope
  const notificationPromise = self.registration.showNotification(notificationTitle, notificationOptions);

  // Gửi tin nhắn đến client để cập nhật UI (ví dụ: unreadCount)
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
    for (const client of clientList) {
      client.postMessage({
        type: 'NEW_NOTIFICATION',
        payload: payload // Gửi toàn bộ payload để client có thể xử lý
      });
    }
  });

  return notificationPromise;
});

// (Tùy chọn) Xử lý khi người dùng click vào thông báo nền
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Đóng thông báo

  // Lấy dữ liệu từ thông báo (nếu có)
  const targetUrl = event.notification.data?.url || '/'; // Mặc định mở trang chủ

  // Mở một cửa sổ/tab mới hoặc focus vào cửa sổ/tab đã có
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        // Nếu đã có cửa sổ/tab với URL đó, focus vào nó
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Nếu không, mở tab mới
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});