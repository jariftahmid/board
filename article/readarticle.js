import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  increment
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleContent = document.getElementById("articleContent") || document.getElementById("articleContainer");
const relatedArticles = document.getElementById("relatedArticles");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

const formatDate = (timestamp) => {
  if (!timestamp?.seconds) return "";

  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const stripHtml = (text = "") => text.replace(/<[^>]*>/g, "").trim();

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

function renderArticle(data) {
  if (!articleContent) return;

  const badgeClass = data.category?.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

  articleContent.innerHTML = `
    <h1>${data.title || "Untitled"}</h1>
    <p class="meta">
      <span class="badge ${badgeClass}">${data.category?.toUpperCase() || ""}</span>
      <span class="subject">${data.subject || ""}</span>
      <span class="date">${formatDate(data.createdAt)}</span>
    </p>
    <img src="${data.image || ""}" alt="${data.title || "Article image"}" style="max-width:100%; border-radius:20px; margin:20px 0;">
    <div id="article-body">${data.content || ""}</div>
  `;

  if (window.MathJax) {
    window.MathJax.typesetPromise([document.getElementById("article-body")]);
  }
}

function renderRelatedArticles(allArticles, currentArticleId, category) {
  if (!relatedArticles) return;

  const categoryValue = (category || "").toLowerCase();

  const sameCategory = allArticles
    .filter((item) => item.id !== currentArticleId)
    .filter((item) => (item.data.category || "").toLowerCase() === categoryValue)
    .sort((a, b) => (b.data.createdAt?.seconds || 0) - (a.data.createdAt?.seconds || 0))
    .slice(0, 4);

  if (!sameCategory.length) {
    relatedArticles.innerHTML = "<p>No same category article found.</p>";
    return;
  }

  relatedArticles.innerHTML = "";

  sameCategory.forEach(({ data }) => {
    const badgeClass = data.category?.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

    const card = document.createElement("a");
    card.href = `readarticle.html?slug=${data.slug}`;
    card.innerHTML = `
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
          <p>${stripHtml(data.content).substring(0, 120)}...</p>
        </div>
      </article>
    `;

    relatedArticles.appendChild(card);
  });
}

async function loadArticle() {
  if (!slug) {
    if (articleContent) articleContent.innerHTML = "<p>No article specified</p>";
    return;
  }

  try {
    const articleQuery = query(collection(window.db, "articles"), where("slug", "==", slug));
    const articleSnap = await getDocs(articleQuery);

    if (articleSnap.empty) {
      if (articleContent) articleContent.innerHTML = "<p>Article not found</p>";
      return;
    }

    const currentDoc = articleSnap.docs[0];
    const currentData = currentDoc.data();

    document.title = `${currentData.title || "Article"} | BoardQues`;
    renderArticle(currentData);

    try {
      await updateDoc(doc(window.db, "articles", currentDoc.id), {
        views: increment(1)
      });
    } catch (error) {
      console.error("Failed to increment views:", error);
    }

    const allSnap = await getDocs(collection(window.db, "articles"));
    const allArticles = allSnap.docs.map((docSnap) => ({
      id: docSnap.id,
      data: docSnap.data()
    }));

    renderRelatedArticles(allArticles, currentDoc.id, currentData.category);
  } catch (error) {
    if (articleContent) {
      articleContent.innerHTML = `<p>Error loading article: ${error.message}</p>`;
    }
    console.error(error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  loadArticle();
});
