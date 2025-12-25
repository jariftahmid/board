<script type="module">
import { collection, getDocs, orderBy, query } 
from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const container = document.getElementById("articles");

const q = query(
  collection(db, "articles"),
  orderBy("date", "desc")
);

const snap = await getDocs(q);

snap.forEach(doc => {
  const d = doc.data();

  container.innerHTML += `
    <a href="#">
      <article class="card">
        <div class="card-img">
          <img src="${d.image}" alt="${d.title}">
          <span class="badge hsc-badge">${d.board || "HSC"}</span>
        </div>

        <div class="card-body">
          <div class="meta-info">
            <span class="category">${d.category}</span>
            <span class="date">
              ${new Date(d.date.seconds * 1000).toDateString()}
            </span>
          </div>

          <h3>${d.title}</h3>
          <p>${d.summary}</p>

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
</script>
