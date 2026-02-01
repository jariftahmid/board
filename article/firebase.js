import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyChrKBpyRSLhkmVMy3c1gdWBp4_grrrphA",
  authDomain: "boardques.firebaseapp.com",
  projectId: "boardques",
  storageBucket: "boardques.appspot.com",
  messagingSenderId: "496679352856",
  appId: "1:496679352856:web:1d62a3a23b7fec669ce16d"
};

// এই লাইনগুলো নিশ্চিত করুন
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.firebaseApp = app; // এটি গ্লোবাল করে দিচ্ছে
window.db = db;           // এটি গ্লোবাল করে দিচ্ছে