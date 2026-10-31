(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data) return;

  function selectedService() {
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug") || "modular-kitchen";
    return data.services.find((service) => service.slug === slug) || data.services[0];
  }

  function shuffledImages(service) {
    const images = Array.isArray(service.featureImages) && service.featureImages.length
      ? service.featureImages.slice()
      : [service.image];

    return images
      .map((image) => ({ image, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((item) => item.image);
  }

  function renderServiceDetail() {
    const target = document.getElementById("serviceDetail");
    if (!target) return null;

    const service = selectedService();
    const featureImages = shuffledImages(service);
    document.title = service.title + " | " + data.company.name;

    target.innerHTML = `
      <section class="service-hero">
        <div class="hero-overlay"></div>
        <div class="hero-bg"><img src="${service.heroImage || service.image}" alt="${service.title}" loading="eager"></div>
        <div class="container">
          <div class="hero-content">
            <span class="hero-tag">INTERIOR DESIGN SERVICE</span>
            <h1>${service.title}</h1>
            <p>${service.shortDesc}</p>
            <div class="hero-buttons">
              <a href="contact.html#consultation" class="btn btn-primary">Book Consultation</a>
              <a href="#features" class="btn btn-outline">View Details</a>
            </div>
          </div>
        </div>
      </section>

      <section class="service-features" id="features" data-aos="fade-up">
        <div class="container">
          <div class="section-heading">
            <span>WHAT IS INCLUDED</span>
            <h2>Designed for beauty, storage, and everyday use</h2>
          </div>
          <div class="features-grid">
            ${service.features.map((feature, index) => {
              const image = featureImages[index] || service.image;
              return `
                <div class="feature-card">
                  <img src="${image}" alt="${feature}" data-fallback-title="${feature}" loading="lazy">
                  <div class="feature-card-body">
                    <h3>${feature}</h3>
                    <p>${service.description}</p>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </section>

      <section class="service-detail-process" data-aos="fade-up">
        <div class="container service-detail-process-grid">
          <div><span>01</span><h3>Measure & Brief</h3><p>We map your room, routines, storage needs, and preferred design language.</p></div>
          <div><span>02</span><h3>Plan & Material</h3><p>Layouts, finishes, lighting, and hardware are aligned before execution.</p></div>
          <div><span>03</span><h3>Execute & Handover</h3><p>Work proceeds with clear checkpoints so the finished space feels polished.</p></div>
        </div>
      </section>

      <section class="service-faq" data-aos="fade-up">
        <div class="container">
          <div class="faq-grid">
            <div class="faq-left">
              <span>QUESTIONS</span>
              <h2>Everything you need to know</h2>
              <p>Quick answers about ${service.title.toLowerCase()} planning, customization, and timelines.</p>
            </div>
            <div class="faq-right">
              ${service.faqs.map((faq) => `<div class="faq-item"><button class="faq-question" type="button"><span>${faq[0]}</span><strong>+</strong></button><div class="faq-answer"><p>${faq[1]}</p></div></div>`).join("")}
            </div>
          </div>
        </div>
      </section>

      <section class="service-cta" data-aos="fade-up">
        <div class="container">
          <div class="cta-wrapper">
            <div class="cta-content">
              <span>LET'S DESIGN YOUR DREAM SPACE</span>
              <h2>Ready to start your ${service.title}?</h2>
              <p>Talk to our team and get a space planned around your home, lifestyle, and budget.</p>
            </div>
            <div class="cta-buttons">
              <a href="contact.html#consultation" class="btn btn-primary">Book Consultation</a>
              <a href="tel:${data.company.phone}" class="btn btn-outline">Call Now</a>
            </div>
          </div>
        </div>
      </section>
    `;

    return target;
  }

  function initFaqs(scope) {
    scope.querySelectorAll(".faq-item").forEach((item) => {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!question || !answer) return;

      question.addEventListener("click", function () {
        scope.querySelectorAll(".faq-item.active").forEach((openItem) => {
          if (openItem === item) return;
          openItem.classList.remove("active");
          const openAnswer = openItem.querySelector(".faq-answer");
          if (openAnswer) openAnswer.style.maxHeight = null;
        });

        item.classList.toggle("active");
        answer.style.maxHeight = item.classList.contains("active") ? answer.scrollHeight + "px" : null;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const target = renderServiceDetail();
    if (target) initFaqs(target);
    if (window.AOSLite) window.AOSLite.init();
  });
}());
