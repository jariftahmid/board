import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleGrid = document.getElementById("articleGrid");

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

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

async function increaseView(docId) {
  try {
    await updateDoc(doc(window.db, "articles", docId), {
      views: increment(1)
    });
  } catch (err) {
    console.error("View update failed:", err);
  }
}

async function loadArticles() {
  if (!articleGrid) return;

  articleGrid.innerHTML = "<p>Loading articles...</p>";

  try {
    const q = query(collection(window.db, "articles"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    articleGrid.innerHTML = "";

    if (snapshot.empty) {
      articleGrid.innerHTML = "<p>No articles found.</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docId = docSnap.id;

      const badgeClass = data.category?.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

      const a = document.createElement("a");
      a.href = `readarticle.html?slug=${data.slug}`;

      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image || ""}" alt="${data.title || "Article image"}">
            <span class="badge ${badgeClass}">${data.category?.toUpperCase() || ""}</span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.subject || ""}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </div>
            <h3>${data.title || "Untitled"}</h3>
            <p>${(data.content || "").replace(/<[^>]+>/g, "").substring(0, 120)}...</p>
            <div class="card-footer">
              <span class="read-more-btn">Read More →</span>
            </div>
          </div>
        </article>
      `;

      a.addEventListener("click", async (e) => {
        e.preventDefault();
        await increaseView(docId);
        window.location.href = a.href;
      });

      articleGrid.appendChild(a);
    });
  } catch (err) {
    console.error("Firestore Error:", err);
    articleGrid.innerHTML = "<p>Error loading articles.</p>";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadArticles();
});
