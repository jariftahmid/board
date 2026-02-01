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

messaging.onBackgroundMessage((payload) => {
  console.log("🔔 BG Notification:", payload);

  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,   // small icon
    image: payload.notification.image,  // BIG image (URL)
    data: {
      url: payload.notification.click_action
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// click করলে article খুলবে
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const url = event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
