import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// DOM
const articleGrid = document.getElementById("articleGrid");

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

      // Format date like "10 Nov 2025"
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = data.date ? new Date(data.date.seconds * 1000).toLocaleDateString('en-US', options) : '';

      // Create article element
      const a = document.createElement("a");
      a.href = "#"; // future: link to full article
      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge">${data.category}</span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.category}</span>
              <span class="date">${formattedDate}</span>
            </div>
            <h3>${data.title}</h3>
            <p>${data.content.substring(0, 120)}...</p>
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

// Load articles on page load
window.addEventListener("DOMContentLoaded", loadArticles);
