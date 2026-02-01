/* ===========================
   🔥 FIREBASE IMPORTS
=========================== */
import { collection, getDocs, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { 
  getMessaging, 
  getToken, 
  onMessage 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging.js";


/* ===========================
   🔥 DOM ELEMENTS
=========================== */
const articleGrid = document.getElementById("articleGrid");
const enableNotificationBtn = document.getElementById("enableNotificationBtn");
const scrollBtn = document.getElementById("scroll-to-search");


/* ===========================
   🔥 DATE FORMAT
=========================== */
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};


/* ===========================
   🔥 LOAD ARTICLES (MAX 2)
=========================== */
async function loadArticles() {
  if (!articleGrid) return;

  articleGrid.innerHTML = "Loading...";

  try {
    const snapshot = await getDocs(collection(window.db, "articles"));
    articleGrid.innerHTML = "";

    if (snapshot.empty) {
      articleGrid.innerHTML = "<p>No articles found.</p>";
      return;
    }

    let count = 0;
    const MAX_ARTICLES = 2;

    snapshot.forEach(docSnap => {
      if (count >= MAX_ARTICLES) return;

      const data = docSnap.data();
      const badgeClass =
        data.category?.toLowerCase() === "ssc"
          ? "ssc-badge"
          : "hsc-badge";

      const a = document.createElement("a");
      a.href = `article/readarticle.html?slug=${data.slug}`;
      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge ${badgeClass}">
              ${data.category?.toUpperCase()}
            </span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.subject}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </div>
            <h3>${data.title}</h3>
            <p>${data.content.replace(/<[^>]+>/g, "").substring(0, 120)}...</p>
            <div class="card-footer">
              <span class="read-more-btn">Read More →</span>
            </div>
          </div>
        </article>
      `;

      articleGrid.appendChild(a);
      count++;
    });

  } catch (err) {
    articleGrid.innerHTML = `<p>Error loading articles: ${err.message}</p>`;
  }
}


/* ===========================
   🔔 FCM SETUP
=========================== */

// 🔴 VERY IMPORTANT: service worker register
const registration = await navigator.serviceWorker.register(
  "/firebase-messaging-sw.js"
);

// 🔴 messaging must use db app
const messaging = getMessaging(window.firebaseApp);


// Enable notification + save token
async function enableNotifications() {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      alert("Notification permission denied ❌");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BEX_bbKtIXnvoR80dpVXP7p2Lfskr4pJuG0WZx6vRwOGgJX0wORB2y5AoUFqiiUsnpAcNGN7nLC1IVSZek7qEk4",
      serviceWorkerRegistration: registration
    });

    if (token) {
      await addDoc(collection(window.db, "fcmTokens"), {
        token,
        createdAt: serverTimestamp()
      });

      new Notification("BoardQues 🔔", {
        body: "Notifications enabled successfully!",
        icon: "/favicon.ico"
      });
    }

  } catch (err) {
    console.error("FCM Error:", err);
  }
}


// 🔔 FOREGROUND notification (site open থাকলে)
onMessage(messaging, (payload) => {
  const { title, body, image, click_action } = payload.notification;

  new Notification(title, {
    body: body,
    icon: image || "/favicon.ico",
    image: image,
    data: { url: click_action }
  });
});


/* ===========================
   📱 MOBILE MENU
=========================== */
function initMobileMenu() {
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-links");

  if (!menu || !menuLinks) return;

  menu.addEventListener("click", () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-active");
      menuLinks.classList.remove("active");
    });
  });
}


/* ===========================
   🚀 EVENTS
=========================== */

if (scrollBtn) {
  scrollBtn.addEventListener("click", () => {
    window.location.href = "question.html";
  });
}

if (enableNotificationBtn) {
  enableNotificationBtn.addEventListener("click", enableNotifications);
}

window.addEventListener("DOMContentLoaded", () => {
  loadArticles();
  initMobileMenu();
});
