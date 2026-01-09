import { collection, getDocs, query, where } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleContent = document.getElementById("articleContent");

// Get slug from URL query
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Format date like "10 Nov 2025"
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", { day:'2-digit', month:'short', year:'numeric' });
};

async function loadArticle() {
  if (!slug) {
    articleContent.innerHTML = "<p>No article specified</p>";
    return;
  }

  try {
    const q = query(collection(window.db, "articles"), where("slug", "==", slug));
    const snap = await getDocs(q);

    if (snap.empty) {
      articleContent.innerHTML = "<p>Article not found</p>";
      return;
    }

    snap.forEach(docSnap => {
      const data = docSnap.data();

      // Dynamic page title
      document.title = data.title + " | Professor Jarif";

      // Badge color
      let badgeClass = data.category.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

      // Inject content
      articleContent.innerHTML = `
        <h1>${data.title}</h1>
        <p class="meta">
          <span class="badge ${badgeClass}">${data.category.toUpperCase()}</span>
          <span class="subject">${data.subject}</span>
          <span class="date">${formatDate(data.createdAt)}</span>
        </p>
        <img src="${data.image}" alt="${data.title}">
        <div id="article-body">${data.content}</div>
      `;

      // Render LaTeX / Math formulas
      if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById("article-body")]);
      }
    });

  } catch (err) {
    articleContent.innerHTML = `<p>Error loading article: ${err.message}</p>`;
    console.error(err);
  }
}

// DOM ready
window.addEventListener("DOMContentLoaded", loadArticle);
