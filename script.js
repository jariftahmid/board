import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const articleGrid = document.getElementById("articleGrid");

// --- ১. ডেট ফরম্যাট ফাংশন ---
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US", { day:'2-digit', month:'short', year:'numeric' });
};

// --- ২. আর্টিকেল লোড করার ফাংশন ---
async function loadArticles() {
  if(!articleGrid) return; // Grid না থাকলে যেন এরর না দেয়
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
      let badgeClass = data.category.toLowerCase() === "ssc" ? "ssc-badge" : "hsc-badge";

      const a = document.createElement("a");
      a.href = `article/readarticle.html?slug=${data.slug}`;
      a.innerHTML = `
        <article class="card">
          <div class="card-img">
            <img src="${data.image}" alt="${data.title}">
            <span class="badge ${badgeClass}">
              ${data.category.toUpperCase()}
            </span>
          </div>
          <div class="card-body">
            <div class="meta-info">
              <span class="category">${data.subject}</span>
              <span class="date">${formatDate(data.createdAt)}</span>
            </div>
            <h3>${data.title}</h3>
            <p>
              ${data.content.replace(/<[^>]+>/g,'').substring(0,120)}...
            </p>
            <div class="card-footer">
              <span class="read-more-btn">Read More →</span>
            </div>
          </div>
        </article>
      `;

      articleGrid.appendChild(a);
      count++; 
    });

  } catch(err) {
    articleGrid.innerHTML = `<p>Error loading articles: ${err.message}</p>`;
  }
}

// --- ৩. মোবাইল মেনু ফাংশনালিটি (নতুন যোগ করা হয়েছে) ---
function initMobileMenu() {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-links');

    if (menu && menuLinks) {
        menu.addEventListener('click', function() {
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        });

        // মেনু লিঙ্কে ক্লিক করলে মেনু ক্লোজ হবে
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('is-active');
                menuLinks.classList.remove('active');
            });
        });
    }
}

// --- ৪. ইভেন্ট লিসেনারস ---

// ব্রাউজ বাটন ক্লিক
const scrollBtn = document.getElementById('scroll-to-search');
if(scrollBtn) {
    scrollBtn.addEventListener('click', function() {
        window.open('question.html', '_self');
    });
}

// পেজ লোড হলে সব শুরু হবে
window.addEventListener("DOMContentLoaded", () => {
    loadArticles();
    initMobileMenu();
});