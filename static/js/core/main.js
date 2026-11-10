/**
 * =================================================================
 * NIWASA Interior - Main JavaScript
 * =================================================================
 * Handles shared interactions and animations.
 * =================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', function() {
    Preloader.init();
    Navbar.init();
    MobileMenu.init();
    ScrollReveal.init();
    ScrollToTop.init();
    SmoothScroll.init();
    HeroSlider.init();
    AOSLite.init();
    ImageFallbacks.init();
});

const Preloader = {
    init: function() {
        const preloader = document.getElementById('preloader');
        const splash = document.getElementById('splashScreen');
        const video = document.getElementById('splashVideo');
        if (!preloader && !splash) return;
        const shouldShowSplash = Boolean(splash);
        let preloaderHidden = false;
        let splashHidden = !shouldShowSplash;

        document.body.style.overflow = 'hidden';

        function hidePreloader() {
            if (!preloader || preloaderHidden) return;
            preloaderHidden = true;
            preloader.classList.add('hidden');
            if (!shouldShowSplash || splashHidden) document.body.style.overflow = '';
        }

        function hideSplash() {
            if (!splash || splashHidden) return;
            splashHidden = true;
            splash.classList.add('hidden');
            hidePreloader();
            document.body.style.overflow = '';
        }

        if (shouldShowSplash && video) {
            video.play().catch(function() {
                setTimeout(hideSplash, 1400);
            });
            video.addEventListener('ended', function() {
                setTimeout(hideSplash, 250);
            }, { once: true });
            video.addEventListener('error', function() {
                setTimeout(hideSplash, 1200);
            }, { once: true });
        }

        window.addEventListener('load', function() {
            if (shouldShowSplash) {
                setTimeout(hideSplash, 3200);
            } else {
                setTimeout(hidePreloader, 800);
            }
        }, { once: true });

        setTimeout(shouldShowSplash ? hideSplash : hidePreloader, shouldShowSplash ? 4200 : 3000);
    }
};
const Navbar = {
    init: function() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        const scrollThreshold = 80;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > scrollThreshold) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            if (currentScroll > lastScroll && currentScroll > 300) {
                navbar.style.transform = 'translateY(-4px)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }
};

const MobileMenu = {
    init: function() {
        const toggle = document.getElementById('navbarToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const closeBtn = document.getElementById('mobileClose');
        const overlay = document.getElementById('mobileOverlay');

        if (!toggle || !mobileMenu) return;

        const focusableItems = () => Array.from(mobileMenu.querySelectorAll('a[href], button:not([disabled])'))
            .filter((item) => !item.closest('[aria-hidden="true"]') && item.getClientRects().length > 0);

        const openMenu = function() {
            mobileMenu.classList.add('active');
            mobileMenu.removeAttribute('inert');
            mobileMenu.setAttribute('aria-hidden', 'false');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close navigation menu');
            document.body.style.overflow = 'hidden';
            const firstItem = mobileMenu.querySelector('.mobile-menu-nav a[href], .mobile-menu-nav button');
            if (firstItem) firstItem.focus();
        };

        const closeMenu = function(restoreFocus) {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('inert', '');
            mobileMenu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open navigation menu');
            document.body.style.overflow = '';
            if (restoreFocus !== false) toggle.focus();
        };

        toggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('active')) closeMenu();
            else openMenu();
        });

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-dropdown-toggle').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.mobile-nav-dropdown');
                if (dropdown) {
                    const isOpen = dropdown.classList.toggle('open');
                    this.setAttribute('aria-expanded', String(isOpen));
                    const submenu = document.getElementById(this.getAttribute('aria-controls'));
                    if (submenu) submenu.setAttribute('aria-hidden', String(!isOpen));
                }
            });
        });

        document.querySelectorAll('.mobile-menu-nav a:not(.mobile-dropdown-toggle)').forEach(function(link) {
            link.addEventListener('click', function() { closeMenu(false); });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
                return;
            }
            if (e.key === 'Tab' && mobileMenu.classList.contains('active')) {
                const items = focusableItems();
                if (!items.length) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });
    }
};

const ScrollReveal = {
    init: function() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        if (reveals.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(function() {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(function(el) {
            observer.observe(el);
        });
    }
};

const ScrollToTop = {
    init: function() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const nav = document.getElementById('navbar');
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                    window.scrollTo({
                        top: targetPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

const HeroSlider = {
    current: 0,
    timer: null,
    transitionRequest: 0,

    init: function () {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');

        if (!this.slides.length) return;

        const firstImage = this.slides[0].querySelector('img');
        const firstSlide = this.slides[0];
        const beginSlideshow = () => {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => firstSlide.classList.remove('is-initial-zoom-pending'));
            });
            this.start();
        };
        if (firstImage && !firstImage.complete) {
            firstImage.addEventListener('load', beginSlideshow, { once: true });
            firstImage.addEventListener('error', beginSlideshow, { once: true });
        } else {
            beginSlideshow();
        }
        this.bindDots();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearTimeout(this.timer);
            } else {
                this.start();
            }
        });
    },

    start: function () {
        clearTimeout(this.timer);
        if (document.hidden) return;
        this.timer = setTimeout(() => {
            this.timer = null;
            this.next();
        }, 5000);
    },

    next: function () {
        let next = this.current + 1;

        if (next >= this.slides.length) {
            next = 0;
        }

        this.show(next);
    },

    show: function (index) {
        clearTimeout(this.timer);
        const request = ++this.transitionRequest;
        const nextImage = this.slides[index] && this.slides[index].querySelector('img[data-src]');
        const activateAndSchedule = () => {
            if (request !== this.transitionRequest) return;
            this.activate(index);
            this.start();
        };

        if (nextImage) {
            const source = nextImage.dataset.src;
            nextImage.removeAttribute('data-src');
            nextImage.onload = activateAndSchedule;
            nextImage.onerror = activateAndSchedule;
            nextImage.src = source;
            return;
        }
        activateAndSchedule();
    },

    activate: function (index) {
        if (this.slides[this.current]) this.slides[this.current].classList.remove('active');
        if (this.dots[this.current]) this.dots[this.current].classList.remove('active');

        this.current = index;

        this.slides[this.current].classList.add('active');
        if (this.dots[this.current]) this.dots[this.current].classList.add('active');
    },

    bindDots: function () {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.show(index);
            });
        });
    }
};

const AOSLite = {
    init: function() {
        document.querySelectorAll('.page-hero-content, .section[data-aos], .section-header, .card, .work-card, .service-card, .process-timeline > div, .contact-grid > *, .value-grid > *').forEach(function(element) {
            if (!element.hasAttribute('data-aos')) element.setAttribute('data-aos', 'fade-up');
        });

        const elements = document.querySelectorAll('[data-aos]');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function(element) {
                element.classList.add('aos-animate');
            });
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        elements.forEach(function(element) {
            observer.observe(element);
        });
    }
};

window.AOSLite = AOSLite;

const ImageFallbacks = {
    init: function() {
        document.addEventListener('error', function(event) {
            const img = event.target;
            if (!img || img.tagName !== 'IMG' || img.dataset.fallbackApplied) return;

            img.dataset.fallbackApplied = 'true';
            const title = img.dataset.fallbackTitle || img.alt || 'Image unavailable';
            const fallback = document.createElement('div');
            fallback.className = 'image-fallback';
            fallback.innerHTML =
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                    '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.1l1.1-1.5h4.6L15.4 5h2.1A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
                    '<circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
                '</svg>' +
                '<span>' + title + '</span>';

            img.replaceWith(fallback);
        }, true);
    }
};
