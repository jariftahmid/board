import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyChrKBpyRSLhkmVMy3c1gdWBp4_grrrphA",
  authDomain: "boardques.firebaseapp.com",
  projectId: "boardques",
  storageBucket: "boardques.appspot.com",
  messagingSenderId: "496679352856",
  appId: "1:496679352856:web:1d62a3a23b7fec669ce16d"
};

// 🔥 Init Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Firestore
export const db = getFirestore(app);
window.db = db;

// 🔔 Messaging (FCM)
export const messaging = getMessaging(app);
window.messaging = messaging;

// 🔥 App global (FCM এর জন্য দরকার)
window.app = app;
