// ১. Firebase SDK এর Compat ভার্সনগুলো ইমপোর্ট করুন
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// ২. Firebase ইনিশিয়ালাইজ করুন
firebase.initializeApp({
  apiKey: "AIzaSyChrKBpyRSLhkmVMy3c1gdWBp4_grrrphA",
  authDomain: "boardques.firebaseapp.com",
  projectId: "boardques",
  storageBucket: "boardques.appspot.com",
  messagingSenderId: "496679352856",
  appId: "1:496679352856:web:1d62a3a23b7fec669ce16d"
});

// ৩. মেসেজিং অবজেক্ট তৈরি করুন
const messaging = firebase.messaging();

// ৪. ব্যাকগ্রাউন্ড মেসেজ হ্যান্ডেল করা (অ্যাপ বন্ধ থাকলে)
messaging.onBackgroundMessage((payload) => {
  console.log("🔔 Background Message Received:", payload);

  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "",
    icon: payload.notification.icon || "/favicon.ico", // ছোট আইকন
    image: payload.notification.image || "",          // বড় ইমেজ
    data: {
      url: payload.notification.click_action || payload.data?.url || "/"
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ৫. নোটিফিকেশনে ক্লিক করলে পেজ ওপেন করার লজিক
self.addEventListener("notificationclick", function(event) {
  event.notification.close(); // নোটিফিকেশন বন্ধ করা

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // যদি সাইট অলরেডি ট্যাব হিসেবে খোলা থাকে, তবে সেখানে নিয়ে যাবে
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      // নাহলে নতুন ট্যাব খুলবে
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});