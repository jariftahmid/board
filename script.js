/* ===========================
    🔥 FIREBASE IMPORTS
=========================== */
import { 
  collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { 
  getMessaging, getToken, onMessage 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging.js";

/* ===========================
    🔥 GLOBAL VARIABLES
=========================== */
const articleGrid = document.getElementById("articleGrid");
let messaging;
let swRegistration;

/* ===========================
    🔥 DATE FORMAT
=========================== */
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

/* ===========================
    🔥 LOAD ARTICLES
=========================== */
async function loadArticles() {
  if (!articleGrid) return;
  if (!window.db) { setTimeout(loadArticles, 500); return; }

  articleGrid.innerHTML = "<p>Loading articles...</p>";

  try {
    const q = query(collection(window.db, "articles"), orderBy("views", "desc"), limit(2));
    const snapshot = await getDocs(q);
    articleGrid.innerHTML = "";

    if (snapshot.empty) { articleGrid.innerHTML = "<p>No articles found.</p>"; return; }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const badgeClass = data.category?.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";
      const a = document.createElement("a");
      a.href = `article/readarticle.html?slug=${data.slug}`;
      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge ${badgeClass}">${data.category?.toUpperCase()}</span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.subject}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </div>
            <h3>${data.title}</h3>
            <p>${data.content.replace(/<[^>]+>/g, "").substring(0, 120)}...</p>
            <div class="card-footer"><span class="read-more-btn">Read More →</span></div>
          </div>
        </article>`;
      articleGrid.appendChild(a);
    });
  } catch (err) {
    console.error("Load Articles Error:", err);
    articleGrid.innerHTML = "<p>Error loading articles.</p>";
  }
}

/* ===========================
    🔔 FCM SETUP
=========================== */
async function initFCM() {
  if (!window.firebaseApp) { setTimeout(initFCM, 500); return; }

  try {
    swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    messaging = getMessaging(window.firebaseApp);

    onMessage(messaging, (payload) => {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.png"
      });
    });
  } catch (error) { console.error("FCM Init Failed:", error); }
}

async function enableNotifications() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") { alert("Permission denied!"); return; }

    const token = await getToken(messaging, {
      vapidKey: "BEX_bbKtIXnvoR80dpVXP7p2Lfskr4pJuG0WZx6vRwOGgJX0wORB2y5AoUFqiiUsnpAcNGN7nLC1IVSZek7qEk4",
      serviceWorkerRegistration: swRegistration
    });

    if (token) {
      await addDoc(collection(window.db, "fcmTokens"), { token, createdAt: serverTimestamp() });
      alert("Notifications enabled! 🔔");
    }
  } catch (err) {
    console.error("Notification Error:", err);
    alert("Could not enable notifications.");
  }
}

/* ===========================
    📱 MOBILE MENU & INIT
=========================== */
function initMobileMenu() {
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".overlay"); // আপনার নতুন ওভারলে

  if (!menu || !menuLinks) return;

  menu.onclick = () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
    if(overlay) overlay.classList.toggle("active");
  };
}

window.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadArticles();
  initFCM();

  const scrollBtn = document.getElementById("scroll-to-search");
  if (scrollBtn) scrollBtn.onclick = () => window.location.href = "question.html";

  const enableNotificationBtn = document.getElementById("enableNotificationBtn");
  if (enableNotificationBtn) enableNotificationBtn.onclick = enableNotifications;
});