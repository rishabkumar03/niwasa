(function () {
  "use strict";

  const data = window.NIWASA_DATA;
  if (!data || !data.company || !Array.isArray(data.services)) return;

  const { company, services } = data;

  function currentPage() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function active(paths) {
    const page = currentPage();
    const matches = Array.isArray(paths) ? paths : [paths];
    return matches.includes(page) ? "active" : "";
  }

  function serviceUrl(slug) {
    return "service.html?slug=" + encodeURIComponent(slug);
  }

  function serviceLinks(className) {
    return services
      .map((service) => `<a href="${serviceUrl(service.slug)}" class="${className}">${service.title}</a>`)
      .join("");
  }

  function renderHeader() {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
        <div class="splash-screen" id="splashScreen">
          <div class="splash-inner">
            <div class="splash-video-frame">
              <video class="splash-video" id="splashVideo" autoplay muted playsinline preload="auto" aria-label="${company.name} intro">
                <source src="niwasa-website-logo.mp4" type="video/mp4">
              </video>
            </div>
            <div class="splash-brand">${company.name}</div>
            <div class="splash-line"><span></span></div>
          </div>
        </div>

        <div class="preloader" id="preloader">
          <div class="preloader-inner">
            <div class="preloader-logo"><img src="${company.logo}" alt="${company.name}"></div>
            <div class="preloader-bar"><div class="preloader-bar-inner"></div></div>
          </div>
        </div>

        <header class="navbar" id="navbar">
          <div class="navbar-container">
            <a href="index.html" class="navbar-logo">
              <img src="${company.logo}" alt="${company.name}" class="logo-img">
            </a>
            <nav class="navbar-menu" id="navbarMenu">
              <a href="index.html" class="nav-link ${active("index.html")}">HOME</a>
              <a href="about.html" class="nav-link ${active("about.html")}">ABOUT</a>
              <div class="nav-dropdown">
                <a href="services.html" class="nav-link ${active(["services.html", "service.html"])}">SERVICES
                  <svg class="dropdown-arrow" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </a>
                <div class="dropdown-menu">${serviceLinks("dropdown-item")}</div>
              </div>
              <a href="our-work.html" class="nav-link ${active("our-work.html")}">OUR WORK</a>
              <a href="journal.html" class="nav-link ${active("journal.html")}">JOURNAL</a>
              <a href="contact.html" class="nav-link ${active("contact.html")}">CONTACT</a>
            </nav>
            <a href="contact.html#consultation" class="navbar-cta"><span>BOOK CONSULTATION</span></a>
            <button class="navbar-toggle" id="navbarToggle" aria-label="Toggle navigation">
              <span class="toggle-line"></span><span class="toggle-line"></span><span class="toggle-line"></span>
            </button>
          </div>
        </header>

        <div class="mobile-menu" id="mobileMenu">
          <div class="mobile-menu-overlay" id="mobileOverlay"></div>
          <div class="mobile-menu-panel">
            <div class="mobile-menu-header">
              <a href="index.html" class="mobile-logo"><img src="${company.logo}" alt="${company.name}"></a>
              <button class="mobile-close" id="mobileClose" aria-label="Close menu">x</button>
            </div>
            <nav class="mobile-menu-nav">
              <a href="index.html" class="mobile-nav-link">Home</a>
              <a href="about.html" class="mobile-nav-link">About</a>
              <div class="mobile-nav-dropdown">
                <button class="mobile-nav-link mobile-dropdown-toggle" type="button">Services</button>
                <div class="mobile-dropdown-content">${serviceLinks("")}</div>
              </div>
              <a href="our-work.html" class="mobile-nav-link">Our Work</a>
              <a href="journal.html" class="mobile-nav-link">Journal</a>
              <a href="contact.html" class="mobile-nav-link">Contact</a>
            </nav>
            <div class="mobile-menu-footer">
              <a href="contact.html#consultation" class="mobile-cta-btn">Book Free Consultation</a>
              <div class="mobile-contact-info">
                <a href="tel:${company.phone}">${company.phoneDisplay}</a>
                <a href="mailto:${company.email}">${company.email}</a>
              </div>
            </div>
          </div>
        </div>
      `
    );
  }

  function renderFooter() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <footer class="footer">
          <div class="footer-top">
            <div class="container">
              <div class="footer-grid">
                <div class="footer-col footer-brand-col">
                  <a href="index.html" class="footer-logo"><img src="${company.logo}" alt="${company.name}"></a>
                  <p class="footer-brand-desc">${company.description}</p>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Quick Links</h4>
                  <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="our-work.html">Our Work</a></li>
                    <li><a href="journal.html">Journal</a></li>
                    <li><a href="contact.html">Contact</a></li>
                  </ul>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Services</h4>
                  <ul class="footer-links">
                    ${services.slice(0, 6).map((service) => `<li><a href="${serviceUrl(service.slug)}">${service.title}</a></li>`).join("")}
                  </ul>
                </div>
                <div class="footer-col">
                  <h4 class="footer-heading">Get In Touch</h4>
                  <div class="footer-contact-info">
                    <div class="footer-contact-item"><span>${company.address}</span></div>
                    <div class="footer-contact-item"><a href="tel:${company.phone}">${company.phoneDisplay}</a></div>
                    <div class="footer-contact-item"><a href="mailto:${company.email}">${company.email}</a></div>
                  </div>
                  <div class="footer-newsletter">
                    <h5 class="newsletter-title">Design notes, by email</h5>
                    <a href="mailto:${company.email}?subject=Design%20notes" class="newsletter-link">Ask us to share updates &rarr;</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <div class="container">
              <div class="footer-bottom-inner">
                <p class="copyright">&copy; ${new Date().getFullYear()} ${company.name}. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        <button class="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top">&uarr;</button>
        <div class="toast-container" id="toastContainer"></div>
      `
    );
  }

  renderHeader();
  document.addEventListener("DOMContentLoaded", renderFooter);
}());
