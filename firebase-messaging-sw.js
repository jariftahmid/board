importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyChrKBpyRSLhkmVMy3c1gdWBp4_grrrphA",
  authDomain: "boardques.firebaseapp.com",
  projectId: "boardques",
  storageBucket: "boardques.appspot.com",
  messagingSenderId: "496679352856",
  appId: "1:496679352856:web:1d62a3a23b7fec669ce16d"
});

const messaging = firebase.messaging();

// 🔔 Background Notification Handler
messaging.onBackgroundMessage(function(payload) {
  console.log("[firebase-messaging-sw.js] Background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/icon.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
