import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleContent = document.getElementById("articleContent");
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

async function loadArticle() {
  if (!slug) {
    articleContent.innerHTML = "<p>No article specified</p>";
    return;
  }

  try {
    const q = query(collection(window.db, "articles"), where("slug","==",slug));
    const snap = await getDocs(q);

    if (snap.empty) {
      articleContent.innerHTML = "<p>Article not found</p>";
      return;
    }

    snap.forEach(docSnap => {
      const data = docSnap.data();

      // Set page title dynamically
      document.title = data.title + " | Professor Jarif";

      articleContent.innerHTML = `
        <h1>${data.title}</h1>
        <p><strong>${data.subject} | ${data.category}</strong></p>
        <img src="${data.image}" alt="${data.title}" style="max-width:100%; margin:10px 0;">
        <div>${data.content}</div>
      `;
    });

  } catch(err) {
    articleContent.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}
snap.forEach(docSnap => {
  const data = docSnap.data();

  document.title = data.title + " | Professor Jarif";

  let badgeClass = data.category.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

  articleContent.innerHTML = `
    <h1>${data.title}</h1>
    <p class="meta">
      <span class="badge ${badgeClass}">${data.category.toUpperCase()}</span>
      <span class="subject">${data.subject}</span>
    </p>
    <img src="${data.image}" alt="${data.title}">
    <div>${data.content}</div>
  `;
});


window.addEventListener("DOMContentLoaded", loadArticle);
