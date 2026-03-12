/* ===========================
    🔥 FIREBASE IMPORTS
=========================== */
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  query,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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

let messaging;
let swRegistration;


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
    🔥 LOAD ARTICLES (MOST VIEWED FIRST)
=========================== */
async function loadArticles() {

  if (!articleGrid) return;

  if (!window.db) {
    setTimeout(loadArticles, 500);
    return;
  }

  articleGrid.innerHTML = "<p>Loading...</p>";

  try {

    const q = query(
      collection(window.db, "articles"),
      orderBy("views", "desc"),   // ✅ Most viewed first
      limit(2)                    // ✅ Only 2 articles
    );

    const snapshot = await getDocs(q);
    articleGrid.innerHTML = "";

    if (snapshot.empty) {
      articleGrid.innerHTML = "<p>No articles found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {

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
            <p>${data.content.replace(/<[^>]+>/g, "").substring(0,120)}...</p>

            <div class="card-footer">
              <span class="read-more-btn">Read More →</span>
            </div>
          </div>
        </article>
      `;

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

  if (!window.firebaseApp) {
    setTimeout(initFCM, 500);
    return;
  }

  try {

    swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    messaging = getMessaging(window.firebaseApp);

    onMessage(messaging, (payload) => {
      const { title, body, image } = payload.notification;

      new Notification(title, {
        body: body,
        icon: image || "/favicon.ico"
      });
    });

  } catch (error) {
    console.error("FCM Init Failed:", error);
  }
}


async function enableNotifications() {

  if (!messaging || !swRegistration) {
    alert("Firebase still loading. Try again.");
    return;
  }

  try {

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Permission denied ❌");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY",
      serviceWorkerRegistration: swRegistration
    });

    if (token) {

      await addDoc(collection(window.db, "fcmTokens"), {
        token,
        createdAt: serverTimestamp()
      });

      alert("Notifications enabled 🔔");
    }

  } catch (err) {
    console.error("Notification Error:", err);
    alert("Could not enable notifications.");
  }
}


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

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-active");
      menuLinks.classList.remove("active");
    });
  });
}


/* ===========================
    🚀 INIT
=========================== */
window.addEventListener("DOMContentLoaded", () => {

  initMobileMenu();
  loadArticles();
  initFCM();

  if (scrollBtn) {
    scrollBtn.onclick = () => window.location.href = "question.html";
  }

  if (enableNotificationBtn) {
    enableNotificationBtn.onclick = enableNotifications;
  }
});/* ===========================
    🔥 LOAD ARTICLES (MAX 2)
=========================== */
async function loadArticles() {
  if (!articleGrid) return;

  // window.db লোড হওয়া পর্যন্ত অপেক্ষা করার লজিক
  if (!window.db) {
    setTimeout(loadArticles, 500);
    return;
  }

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
        </article>
      `;
      articleGrid.appendChild(a);
      count++;
    });
  } catch (err) {
    console.error("Load Articles Error:", err);
    articleGrid.innerHTML = `<p>Error loading articles.</p>`;
  }
}

/* ===========================
    🔔 FCM SETUP (Fixed Timing)
=========================== */
async function initFCM() {
  // ১. Firebase App লোড হওয়া পর্যন্ত অপেক্ষা করুন
  if (!window.firebaseApp) {
    console.log("Waiting for Firebase App...");
    setTimeout(initFCM, 500); 
    return;
  }

  try {
    // ২. Service Worker Register
    swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    console.log("Service Worker registered! ✅");

    // ৩. Messaging Initialize
    messaging = getMessaging(window.firebaseApp);
    
    // ৪. Foreground Notifications
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      const { title, body, image } = payload.notification;
      new Notification(title, {
        body: body,
        icon: image || "/favicon.ico"
      });
    });
  } catch (error) {
    console.error("FCM Initialization Failed:", error);
  }
}

async function enableNotifications() {
  // যদি এখনো লোড না হয়, তবে ইউজারকে এরর না দেখিয়ে পুনরায় চেষ্টা করুন
  if (!messaging || !swRegistration) {
    if (window.firebaseApp) {
        messaging = getMessaging(window.firebaseApp);
        swRegistration = await navigator.serviceWorker.getRegistration();
    } else {
        alert("Firebase is still loading... Please wait a moment.");
        return;
    }
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission denied ❌");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BEX_bbKtIXnvoR80dpVXP7p2Lfskr4pJuG0WZx6vRwOGgJX0wORB2y5AoUFqiiUsnpAcNGN7nLC1IVSZek7qEk4",
      serviceWorkerRegistration: swRegistration
    });

    if (token) {
      await addDoc(collection(window.db, "fcmTokens"), {
        token,
        createdAt: serverTimestamp()
      });
      alert("Notifications enabled successfully! 🔔");
    }
  } catch (err) {
    console.error("Enable Notification Error:", err);
    alert("Could not enable notifications. Please try again.");
  }
}

/* ===========================
    📱 MOBILE MENU
=========================== */
function initMobileMenu() {
  const menu = document.querySelector("#mobile-menu");
  const menuLinks = document.querySelector(".nav-links");
  if (!menu || !menuLinks) return;

  menu.onclick = () => {
    menu.classList.toggle("is-active");
    menuLinks.classList.toggle("active");
  };
}

/* ===========================
    🚀 INITIALIZE EVERYTHING
=========================== */
window.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadArticles();
  initFCM(); 
  
  if (scrollBtn) {
    scrollBtn.onclick = () => window.location.href = "question.html";
  }

  if (enableNotificationBtn) {
    enableNotificationBtn.onclick = enableNotifications;
  }

});
