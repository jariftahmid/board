import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// DOM
const articleGrid = document.getElementById("articleGrid");

// Format date like "10 Nov 2025"
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

async function loadArticles() {
  articleGrid.innerHTML = "Loading...";

  try {
    const snapshot = await getDocs(collection(window.db, "articles"));
    articleGrid.innerHTML = "";

    if (snapshot.empty) {
      articleGrid.innerHTML = "<p>No articles found.</p>";
      return;
    }

    snapshot.forEach(docSnap => {
      const data = docSnap.data();

      // Badge class based on category
      let badgeClass = data.category.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

      const a = document.createElement("a");
      a.href = "#"; // future: link to full article
      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge ${badgeClass}">${data.category.toUpperCase()}</span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.subject}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </div>
            <h3>${data.title}</h3>
            <p>${data.content.replace(/<[^>]+>/g, '').substring(0, 120)}...</p>
            <div class="card-footer">
              <p class="read-more-btn">Read More <span>→</span></p>
            </div>
          </div>
        </article>
      `;
      articleGrid.appendChild(a);
    });

  } catch (err) {
    articleGrid.innerHTML = `<p>Error loading articles: ${err.message}</p>`;
    console.error(err);
  }
}

// Load on DOM ready
window.addEventListener("DOMContentLoaded", loadArticles);
