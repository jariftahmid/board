import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, getDocs, orderBy, query }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyChrKBpyRSLhkmVMy3c1gdWBp4_grrrphA",
  authDomain: "boardques.firebaseapp.com",
  projectId: "boardques",
  storageBucket: "boardques.firebasestorage.app",
  messagingSenderId: "496679352856",
  appId: "1:496679352856:web:1d62a3a23b7fec669ce16d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articleGrid = document.getElementById("articleGrid");

function formatDate(timestamp) {
  const date = timestamp.toDate();
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

async function loadArticles() {
  const q = query(collection(db, "articles"), orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  articleGrid.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    articleGrid.innerHTML += `
      <a href="#">
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge ${data.board.toLowerCase()}-badge">
              ${data.board.toUpperCase()}
            </span>
          </div>

          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.category}</span>
              <span class="date">${formatDate(data.date)}</span>
            </div>

            <h3>${data.title}</h3>
            <p>${data.summary}</p>

            <div class="card-footer">
              <p class="read-more-btn">
                Read More <span>→</span>
              </p>
            </div>
          </div>
        </article>
      </a>
    `;
  });

  if (snapshot.empty) {
    articleGrid.innerHTML = "<p>No articles found.</p>";
  }
}

loadArticles();
