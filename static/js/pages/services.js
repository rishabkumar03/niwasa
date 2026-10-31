(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data) return;

  function serviceUrl(slug) {
    return "service.html?slug=" + encodeURIComponent(slug);
  }

  function renderServices() {
    const target = document.querySelector("[data-services-grid]");
    if (!target) return;

    target.innerHTML = data.services.map((service) => `
      <a href="${serviceUrl(service.slug)}" class="service-card service-page-card" data-aos="fade-up">
        <img src="${service.image}" alt="${service.title}" data-fallback-title="${service.title}">
        <div class="service-card-content">
          <span>${service.features.length} design features</span>
          <h3>${service.title}</h3>
          <p>${service.shortDesc}</p>
          <strong>View service &rarr;</strong>
        </div>
      </a>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderServices();
    if (window.AOSLite) window.AOSLite.init();
  });
}());
