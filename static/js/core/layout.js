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

  function splashMarkup() {
    try {
      if (window.sessionStorage.getItem("niwasaSplashPlayed") === "true") return "";
      window.sessionStorage.setItem("niwasaSplashPlayed", "true");
    } catch (error) {
      // Keep the intro on the first page when storage is unavailable.
    }

    return `
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
          <div class="preloader-logo"><img src="${company.logo}" alt="" width="256" height="256"></div>
          <div class="preloader-bar"><div class="preloader-bar-inner"></div></div>
        </div>
      </div>`;
  }

  function renderHeader() {
    document.body.insertAdjacentHTML(
      "afterbegin",
      `
        ${splashMarkup()}

        <header class="navbar" id="navbar">
          <div class="navbar-container">
            <a href="index.html" class="navbar-logo">
              <img src="${company.logo}" alt="${company.name}" width="256" height="256" class="logo-img">
            </a>
            <nav class="navbar-menu" id="navbarMenu" aria-label="Main navigation">
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
            <button class="navbar-toggle" id="navbarToggle" aria-label="Open navigation menu" aria-controls="mobileMenu" aria-expanded="false">
              <span class="toggle-line"></span><span class="toggle-line"></span><span class="toggle-line"></span>
            </button>
          </div>
        </header>

        <div class="mobile-menu" id="mobileMenu" aria-hidden="true" inert>
          <div class="mobile-menu-overlay" id="mobileOverlay"></div>
          <div class="mobile-menu-panel">
            <div class="mobile-menu-header">
              <a href="index.html" class="mobile-logo"><img src="${company.logo}" alt="${company.name}" width="256" height="256"></a>
              <button class="mobile-close" id="mobileClose" aria-label="Close navigation menu">&times;</button>
            </div>
            <nav class="mobile-menu-nav" aria-label="Mobile navigation">
              <a href="index.html" class="mobile-nav-link">Home</a>
              <a href="about.html" class="mobile-nav-link">About</a>
              <div class="mobile-nav-dropdown">
                <button class="mobile-nav-link mobile-dropdown-toggle" type="button" aria-expanded="false" aria-controls="mobileServicesMenu">Services</button>
                <div class="mobile-dropdown-content" id="mobileServicesMenu" aria-hidden="true">${serviceLinks("")}</div>
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
                  <a href="index.html" class="footer-logo"><img src="${company.logo}" alt="${company.name}" width="256" height="256"></a>
                  <p class="footer-brand-desc">${company.description}</p>
                  <nav class="footer-social" aria-label="NIWASA social media">
                    <a class="social-link social-instagram" href="https://www.instagram.com/niwasainteriors/" target="_blank" rel="noopener noreferrer" aria-label="NIWASA on Instagram" title="Instagram">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>
                    </a>
                    <a class="social-link social-facebook" href="https://www.facebook.com/profile.php?id=61591849131222" target="_blank" rel="noopener noreferrer" aria-label="NIWASA on Facebook" title="Facebook">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z"/></svg>
                    </a>
                    <a class="social-link social-youtube" href="https://www.youtube.com/@niwasainteriors" target="_blank" rel="noopener noreferrer" aria-label="NIWASA on YouTube" title="YouTube">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M23.2 7a3 3 0 0 0-2.1-2.1C19.2 4.4 12 4.4 12 4.4s-7.2 0-9.1.5A3 3 0 0 0 .8 7 31 31 0 0 0 .3 12a31 31 0 0 0 .5 5 3 3 0 0 0 2.1 2.1c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-5 31 31 0 0 0-.5-5ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z"/></svg>
                    </a>
                  </nav>
                </div>
                <div class="footer-col">
                  <h2 class="footer-heading">Quick Links</h2>
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
                  <h2 class="footer-heading">Services</h2>
                  <ul class="footer-links">
                    ${services.slice(0, 6).map((service) => `<li><a href="${serviceUrl(service.slug)}">${service.title}</a></li>`).join("")}
                  </ul>
                </div>
                <div class="footer-col">
                  <h2 class="footer-heading">Get In Touch</h2>
                  <div class="footer-contact-info">
                    <div class="footer-contact-item"><span>${company.address}</span></div>
                    <div class="footer-contact-item"><a href="tel:${company.phone}">${company.phoneDisplay}</a></div>
                    <div class="footer-contact-item"><a href="mailto:${company.email}">${company.email}</a></div>
                  </div>
                  <div class="footer-newsletter">
                    <a href="contact.html#consultation" class="newsletter-link">Book a design consultation &rarr;</a>
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

        <div class="lead-modal" id="leadModal" aria-hidden="true">
          <div class="lead-modal-backdrop" data-lead-modal-close></div>
          <section class="lead-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="popupFormTitle" tabindex="-1">
            <button class="lead-modal-close" type="button" data-lead-modal-close aria-label="Close consultation form">&times;</button>
            <form class="card card-body contact-form lead-modal-form" data-custom-submit="contact-lead">
              <h2 id="popupFormTitle" class="contact-form-title">Book a design consultation</h2>
              <div class="contact-form-fields">
                <div class="form-group"><label class="form-label" for="popupName">Name</label><input id="popupName" class="form-input" name="name" autocomplete="name" required></div>
                <div class="form-group"><label class="form-label" for="popupPhone">Phone</label><input id="popupPhone" class="form-input" type="tel" name="phone" autocomplete="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" minlength="10" maxlength="10" title="Enter a 10-digit mobile number starting with 6, 7, 8, or 9." required></div>
                <div class="form-group lead-modal-optional"><label class="form-label" for="popupEmail">Email</label><input id="popupEmail" class="form-input" type="email" name="email" autocomplete="email"></div>
                <div class="form-group lead-modal-optional"><label class="form-label" for="popupProjectType">Project Type</label><select id="popupProjectType" class="form-select" name="project_type"><option>Full Home Interior</option><option>Modular Kitchen</option><option>Bedroom / Wardrobe</option><option>Living Room</option><option>Other</option></select></div>
                <div class="form-group contact-message-field lead-modal-optional"><label class="form-label" for="popupMessage">Message</label><textarea id="popupMessage" class="form-textarea" name="message" rows="2" placeholder="Tell us about your rooms, timeline, and design style."></textarea></div>
                <button class="btn btn-primary contact-submit" type="submit">Submit Request</button>
              </div>
              <div class="lead-form-status" role="status" aria-live="polite" hidden></div>
            </form>
          </section>
        </div>
        <button class="scroll-top-btn" id="scrollTopBtn" aria-label="Scroll to top">&uarr;</button>
        <div class="toast-container" id="toastContainer"></div>
      `
    );
  }

  renderHeader();
  document.addEventListener("DOMContentLoaded", renderFooter);
}());
