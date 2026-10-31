(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data) return;

  function serviceUrl(slug) {
    return "service.html?slug=" + encodeURIComponent(slug);
  }

  function renderHomeServices() {
    const target = document.querySelector("[data-home-services]");
    if (!target) return;

    target.innerHTML = data.services.slice(0, 6).map((service) => `
      <a href="${serviceUrl(service.slug)}" class="service-card" data-aos="fade-up">
        <img src="${service.image}" alt="${service.title}" data-fallback-title="${service.title}">
        <div class="service-content">
          <h3>${service.title}</h3>
          <div class="arrow-circle">&rarr;</div>
        </div>
      </a>
    `).join("");
  }

  function renderWorkPreview() {
    const target = document.querySelector("[data-work-preview]");
    if (!target) return;

    target.innerHTML = data.projects.slice(0, 3).map((project) => `
      <a class="work-preview-card" href="our-work.html" data-aos="fade-up">
        <img src="${project.image}" alt="${project.title}" data-fallback-title="${project.title}">
        <div>
          <span>${project.type}</span>
          <h3>${project.title}</h3>
        </div>
      </a>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderHomeServices();
    renderWorkPreview();
    if (window.AOSLite) window.AOSLite.init();
  });
}());
