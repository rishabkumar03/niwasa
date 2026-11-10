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
        <img src="${window.NIWASA_IMAGE_URL(service.image, 720)}" alt="${service.title}" width="800" height="600" loading="lazy" decoding="async" data-fallback-title="${service.title}">
        <div class="service-content">
          <h3>${service.title}</h3>
          <p class="service-card-description">${service.shortDesc || service.description}</p>
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
        <img src="${window.NIWASA_IMAGE_URL(project.image, 760)}" alt="${project.title}" width="960" height="720" loading="lazy" decoding="async" data-fallback-title="${project.title}">
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
