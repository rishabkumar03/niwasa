(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data) return;

  function renderPosts(searchTerm) {
    const target = document.querySelector("[data-journal-grid]");
    if (!target) return;

    const normalized = (searchTerm || "").trim().toLowerCase();
    const posts = data.journal.filter((post) => {
      return !normalized || [post.category, post.title, post.excerpt].join(" ").toLowerCase().includes(normalized);
    });

    target.innerHTML = posts.map((post) => `
      <article class="journal-card card" data-aos="fade-up">
        <div class="card-body">
          <p class="card-label">${post.category}</p>
          <h2 class="card-title">${post.title}</h2>
          <p class="card-text">${post.excerpt}</p>
          <a href="contact.html#consultation" class="journal-link">Discuss this idea &rarr;</a>
        </div>
      </article>
    `).join("");

    if (!posts.length) {
      target.innerHTML = '<p class="journal-empty">No design notes match your search.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const search = document.querySelector("[data-journal-search]");
    renderPosts("");
    if (window.AOSLite) window.AOSLite.init();

    if (search) {
      search.addEventListener("input", function () {
        renderPosts(search.value);
        if (window.AOSLite) window.AOSLite.init();
      });
    }
  });
}());
