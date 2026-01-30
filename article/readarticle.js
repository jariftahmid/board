import { collection, getDocs, query, where } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleContent = document.getElementById("articleContent");

// URL থেকে স্লাগ (slug) নেওয়া
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// ডেট ফরম্যাট করার ফাংশন
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", { day:'2-digit', month:'short', year:'numeric' });
};

// মোবাইল মেনু ফাংশনালিটি
function initMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    // চেক করা হচ্ছে এলিমেন্টগুলো পেজে আছে কি না
    if (menu && menuLinks) {
        menu.addEventListener('click', function() {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
            menu.classList.remove('is-active');
            menuLinks.classList.remove('active');
        }));
    }
}

// আর্টিকেল লোড করার ফাংশন
async function loadArticle() {
  if (!slug) {
    if(articleContent) articleContent.innerHTML = "<p>No article specified</p>";
    return;
  }

  try {
    const q = query(collection(window.db, "articles"), where("slug", "==", slug));
    const snap = await getDocs(q);

    if (snap.empty) {
      if(articleContent) articleContent.innerHTML = "<p>Article not found</p>";
      return;
    }

    snap.forEach(docSnap => {
      const data = docSnap.data();

      // ডাইনামিক পেজ টাইটেল
      document.title = data.title + " | BoardQues";

      // ব্যাজ ক্লাস নির্ধারণ
      let badgeClass = data.category.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

      // কন্টেন্ট ইনজেক্ট করা
      if(articleContent) {
          articleContent.innerHTML = `
            <h1>${data.title}</h1>
            <p class="meta">
              <span class="badge ${badgeClass}">${data.category.toUpperCase()}</span>
              <span class="subject">${data.subject}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </p>
            <img src="${data.image}" alt="${data.title}" style="max-width:100%; border-radius:20px; margin: 20px 0;">
            <div id="article-body">${data.content}</div>
          `;
      }

      // MathJax রেন্ডারিং (যদি ম্যাথ ইকুয়েশন থাকে)
      if (window.MathJax) {
        MathJax.typesetPromise([document.getElementById("article-body")]);
      }
    });

  } catch (err) {
    if(articleContent) articleContent.innerHTML = `<p>Error loading article: ${err.message}</p>`;
    console.error(err);
  }
}

// পেজ লোড হলে ফাংশনগুলো রান করবে
window.addEventListener("DOMContentLoaded", () => {
    loadArticle();
    initMobileMenu();
});