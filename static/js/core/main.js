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
    Forms.init();
    Counters.init();
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

        toggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = function() {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-dropdown-toggle').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.mobile-nav-dropdown');
                if (dropdown) dropdown.classList.toggle('open');
            });
        });

        document.querySelectorAll('.mobile-menu-nav a:not(.mobile-dropdown-toggle)').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
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

const Forms = {
    init: function() {
        this.setupForm('consultationForm', 'Thank you! Your consultation request has been noted. Our design expert will contact you shortly.');
        this.setupForm('contactForm', 'Thank you for reaching out! We will get back to you soon.');
        this.setupForm('newsletterForm', 'Thank you for subscribing to our newsletter!');
    },

    setupForm: function(formId, successMessage) {
        const form = document.getElementById(formId);
        if (!form || form.dataset.initialized) return;
        if (form.dataset.customSubmit) return;

        form.dataset.initialized = 'true';

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : '';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-loading"></span>';
            }

            setTimeout(function() {
                Toast.show(successMessage, 'success');
                form.reset();

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }, 500);

            setTimeout(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }, 1000);
        });
    }
};

const Toast = {
    show: function(message, type) {
        type = type || 'info';
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;

        var iconSvg = '';
        if (type === 'success') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
        } else if (type === 'error') {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        } else {
            iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="#c8a45e" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        }

        toast.innerHTML =
            iconSvg +
            '<span class="toast-message">' + message + '</span>' +
            '<button class="toast-close" onclick="this.parentElement.remove()">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>';

        container.appendChild(toast);

        requestAnimationFrame(function() {
            toast.classList.add('show');
        });

        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                if (toast.parentElement) toast.remove();
            }, 500);
        }, 5000);
    }
};

window.Toast = Toast;

const Counters = {
    init: function() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    Counters.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(counter) {
            observer.observe(counter);
        });
    },

    animate: function(el) {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
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

const LazyImages = {
    init: function() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(function(img) {
            observer.observe(img);
        });
    }
};

function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

const HeroSlider = {
    current: 0,
    timer: null,

    init: function () {
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');

        if (!this.slides.length) return;

        this.start();
        this.bindDots();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.timer);
            } else {
                this.start();
            }
        });
    },

    start: function () {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
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
        const nextImage = this.slides[index] && this.slides[index].querySelector('img[data-src]');
        if (nextImage) {
            const source = nextImage.dataset.src;
            nextImage.removeAttribute('data-src');
            nextImage.onload = () => this.activate(index);
            nextImage.onerror = () => this.activate(index);
            nextImage.src = source;
            return;
        }
        this.activate(index);
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
                this.start();
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
