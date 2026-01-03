import { collection, query, where, getDocs }
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const params = new URLSearchParams(location.search);
const slug = params.get("slug");

async function loadArticle() {
  const q = query(
    collection(window.db, "articles"),
    where("slug", "==", slug),
    where("published", "==", true)
  );

  const snap = await getDocs(q);
  if (snap.empty) return;

  const data = snap.docs[0].data();

  document.title = data.title;
  document.getElementById("seo-title").innerText = data.title;
  document.getElementById("seo-desc").content =
    data.content.replace(/<[^>]+>/g, '').substring(0, 150);

  document.getElementById("articleTitle").innerText = data.title;
  document.getElementById("articleImage").src = data.image;
  document.getElementById("articleContent").innerHTML = data.content;
}

loadArticle();
