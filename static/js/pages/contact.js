(function () {
  "use strict";

  const config = window.NIWASA_CONFIG || {};
  const phonePattern = /^[6-9][0-9]{9}$/;

  function value(form, name) {
    const field = form.elements[name];
    return field ? String(field.value || "").trim() : "";
  }

  function leadFromForm(form) {
    return {
      name: value(form, "name"),
      phone: value(form, "phone"),
      email: value(form, "email"),
      project_type: value(form, "project_type"),
      message: value(form, "message"),
      source: form.classList.contains("lead-modal-form") ? "NIWASA Website Popup" : "NIWASA Website",
      submitted_at: new Date().toISOString()
    };
  }

  function saveToGoogleSheet(lead) {
    const endpoint = normalizeGoogleScriptUrl(config.GOOGLE_SCRIPT_URL || "");
    if (!endpoint) return Promise.reject(new Error("Google Sheet URL is missing."));

    return new Promise(function (resolve, reject) {
      const callbackName = "niwasaLeadCallback_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      const timeout = window.setTimeout(function () {
        cleanup();
        reject(new Error("Google Sheet request timed out."));
      }, 15000);

      function cleanup() {
        window.clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = function (response) {
        cleanup();
        if (response && response.ok && response.saved) resolve(response);
        else reject(new Error((response && response.error) || "Google Sheet save failed."));
      };

      script.onerror = function () {
        cleanup();
        reject(new Error("Could not reach Google Sheet endpoint."));
      };

      const separator = endpoint.indexOf("?") === -1 ? "?" : "&";
      script.src = endpoint + separator +
        "callback=" + encodeURIComponent(callbackName) +
        "&payload=" + encodeURIComponent(JSON.stringify(lead)) +
        "&_=" + Date.now();
      script.async = true;
      document.body.appendChild(script);
    });
  }

  function normalizeGoogleScriptUrl(url) {
    return String(url || "").trim().replace(/\/macros\/u\/\d+\/s\//, "/macros/s/");
  }

  function setSubmitting(button, isSubmitting, originalText) {
    if (!button) return;
    button.disabled = isSubmitting;
    button.innerHTML = isSubmitting ? '<span class="btn-loading"></span>' : originalText;
  }

  function setFormStatus(form, message, type) {
    const status = form.querySelector(".lead-form-status");
    if (!status) return;
    status.textContent = message;
    status.className = "lead-form-status is-" + type;
    status.hidden = false;
  }
  function initLeadForms() {
    document.querySelectorAll('form[data-custom-submit="contact-lead"]').forEach(function (form) {
      const phone = form.elements.phone;
      if (phone) {
        phone.addEventListener("input", function () {
          phone.value = phone.value.replace(/\D/g, "").slice(0, 10);
          phone.setCustomValidity(phone.value && !phonePattern.test(phone.value)
            ? "Enter a 10-digit mobile number starting with 6, 7, 8, or 9."
            : "");
        });
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (phone) {
          phone.setCustomValidity(phonePattern.test(phone.value)
            ? ""
            : "Enter a 10-digit mobile number starting with 6, 7, 8, or 9.");
        }
        if (!form.reportValidity()) return;

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : "";
        setSubmitting(submitButton, true, originalText);
        setFormStatus(form, "Sending your request…", "pending");
        saveToGoogleSheet(leadFromForm(form))
          .then(function (response) {
            form.reset();
            if (phone) phone.setCustomValidity("");
            if (form.classList.contains("lead-modal-form")) {
              const fields = form.querySelector(".contact-form-fields");
              if (fields) fields.hidden = true;
              const message = response.emailSent === false
                ? "Your request was saved. The email notification could not be sent, but our team has your details."
                : "Thank you! Your consultation request has been received. Our team will contact you shortly.";
              setFormStatus(form, message, response.emailSent === false ? "warning" : "success");
              const closeButton = document.createElement("button");
              closeButton.type = "button";
              closeButton.className = "btn btn-primary lead-status-close";
              closeButton.textContent = "Close";
              closeButton.addEventListener("click", closeLeadModal);
              form.querySelector(".lead-form-status").appendChild(closeButton);
            } else {
              setFormStatus(form, "Thank you! Your consultation request has been received. Our team will contact you shortly.", "success");
            }
          })
          .catch(function (error) {
            console.error("NIWASA contact form failed:", error);
            setFormStatus(form, "We could not submit your request. Please check your connection and try again.", "error");
          })
          .finally(function () {
            setSubmitting(submitButton, false, originalText);
          });
      });
    });
  }

  let modalReturnFocus = null;
  let leadPopupTimer = null;
  let leadPopupHandled = false;

  function hasLeadPopupBeenHandled() {
    if (leadPopupHandled) return true;
    try {
      leadPopupHandled = window.sessionStorage.getItem("niwasaLeadPopupShown") === "true";
    } catch (error) { /* Keep the in-memory guard when storage is disabled. */ }
    return leadPopupHandled;
  }

  function markLeadPopupHandled() {
    leadPopupHandled = true;
    try { window.sessionStorage.setItem("niwasaLeadPopupShown", "true"); } catch (error) { /* Storage may be disabled. */ }
  }

  function openLeadModal(options) {
    const modal = document.getElementById("leadModal");
    if (!modal || modal.classList.contains("is-open")) return;
    window.clearTimeout(leadPopupTimer);
    const manualOpen = Boolean(options && options.manual);
    if (!manualOpen && hasLeadPopupBeenHandled()) return;
    modalReturnFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("lead-modal-open");
    const name = modal.querySelector('[name="name"]');
    const dialog = modal.querySelector(".lead-modal-dialog");
    if (window.matchMedia("(min-width: 768px)").matches && name) name.focus();
    else if (dialog) dialog.focus();
    markLeadPopupHandled();
  }

  function closeLeadModal() {
    const modal = document.getElementById("leadModal");
    if (!modal || !modal.classList.contains("is-open")) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lead-modal-open");
    if (modalReturnFocus && typeof modalReturnFocus.focus === "function") modalReturnFocus.focus();
  }

  function updateLeadModalViewport() {
    const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty("--lead-viewport-height", Math.round(viewportHeight) + "px");
    const keyboardLikelyOpen = window.visualViewport && viewportHeight < window.innerHeight * 0.72;
    document.body.classList.toggle("lead-modal-keyboard-open", Boolean(keyboardLikelyOpen));
  }
  function initLeadModal() {
    const modal = document.getElementById("leadModal");
    if (!modal) return;
    updateLeadModalViewport();
    window.addEventListener("resize", updateLeadModalViewport);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", updateLeadModalViewport);
    document.querySelectorAll("[data-open-lead-modal]").forEach(function (trigger) {
      trigger.addEventListener("click", function () { openLeadModal({ manual: true }); });
    });
    modal.querySelectorAll("[data-lead-modal-close]").forEach(function (control) {
      control.addEventListener("click", closeLeadModal);
    });
    document.addEventListener("keydown", function (event) {
      if (!modal.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        closeLeadModal();
        return;
      }
      if (event.key === "Tab") {
        const focusable = Array.from(modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    const currentPage = window.location.pathname.split("/").pop();
    const isHomePage = !currentPage || currentPage === "index.html" || window.location.pathname.endsWith("/");
    if (!isHomePage || hasLeadPopupBeenHandled()) return;

    let engagementCount = 0;
    let lastCountedScroll = window.scrollY;
    let scrollPauseTimer = null;
    const registerEngagement = function () {
      if (hasLeadPopupBeenHandled() || document.querySelector(".mobile-menu.active") || document.querySelector(".lead-modal.is-open")) return;
      engagementCount += 1;
      if (engagementCount >= 3) openLeadModal({ automatic: true });
    };

    leadPopupTimer = window.setTimeout(function () { openLeadModal({ automatic: true }); }, 12000);

    document.addEventListener("click", function (event) {
      if (event.target.closest("#leadModal, a[href], input, textarea, select, [data-lead-modal-close]")) return;
      registerEngagement();
    });

    window.addEventListener("scroll", function () {
      window.clearTimeout(scrollPauseTimer);
      scrollPauseTimer = window.setTimeout(function () {
        const currentScroll = window.scrollY;
        if (Math.abs(currentScroll - lastCountedScroll) < 24) return;
        lastCountedScroll = currentScroll;
        registerEngagement();
      }, 350);
    }, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLeadForms();
    initLeadModal();
  });
}());
