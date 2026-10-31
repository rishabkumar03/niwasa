(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data) return;

  let activeIndex = 0;
  const testimonialsPerView = 2;

  function renderProjects() {
    const target = document.querySelector("[data-work-grid]");
    if (!target) return;

    target.innerHTML = data.projects.map((project) => `
      <article class="work-card" data-aos="fade-up">
        <img src="${project.image}" alt="${project.title}" data-fallback-title="${project.title}">
        <div class="work-card-body">
          <span>${project.type}</span>
          <h2>${project.title}</h2>
          <p>${project.details}</p>
          <a href="contact.html#consultation">Plan similar work &rarr;</a>
        </div>
      </article>
    `).join("");
  }

  function renderTestimonials() {
    const target = document.querySelector("[data-testimonial-carousel]");
    const dots = document.querySelector("[data-testimonial-dots]");
    if (!target || !Array.isArray(data.testimonials) || data.testimonials.length === 0) return;

    const visibleTestimonials = Array.from({ length: testimonialsPerView }, (_, offset) => {
      return data.testimonials[(activeIndex + offset) % data.testimonials.length];
    });

    target.innerHTML = `
      <button class="testimonial-nav" type="button" data-testimonial-prev aria-label="Previous testimonial">&larr;</button>
      <div class="testimonial-pair">
        ${visibleTestimonials.map((testimonial) => {
          const initials = testimonial[0].split(" ").map((part) => part[0]).join("").slice(0, 2);
          return `
            <article class="testimonial-card">
              <div class="testimonial-quote">&ldquo;</div>
              <div class="testimonial-avatar">${initials}</div>
              <p>${testimonial[1]}</p>
              <h3>${testimonial[0]}</h3>
              <span>${testimonial[2] || "NIWASA Client"}</span>
            </article>
          `;
        }).join("")}
      </div>
      <button class="testimonial-nav" type="button" data-testimonial-next aria-label="Next testimonial">&rarr;</button>
    `;

    target.querySelector("[data-testimonial-prev]").addEventListener("click", function () {
      activeIndex = (activeIndex - testimonialsPerView + data.testimonials.length) % data.testimonials.length;
      renderTestimonials();
    });

    target.querySelector("[data-testimonial-next]").addEventListener("click", function () {
      activeIndex = (activeIndex + testimonialsPerView) % data.testimonials.length;
      renderTestimonials();
    });

    if (dots) {
      const pageCount = Math.ceil(data.testimonials.length / testimonialsPerView);
      const currentPage = Math.floor(activeIndex / testimonialsPerView);

      dots.innerHTML = Array.from({ length: pageCount }, (_, index) => `
        <button class="${index === currentPage ? "active" : ""}" type="button" data-testimonial-dot="${index}" aria-label="Show testimonial group ${index + 1}"></button>
      `).join("");

      dots.querySelectorAll("[data-testimonial-dot]").forEach((button) => {
        button.addEventListener("click", function () {
          activeIndex = Number(button.dataset.testimonialDot) * testimonialsPerView;
          renderTestimonials();
        });
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    renderTestimonials();
    if (window.AOSLite) window.AOSLite.init();
  });
}());
