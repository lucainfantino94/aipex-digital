(function () {
  "use strict";

  var CONTACT_EMAIL = "contact@aipex-digital.com";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Mobile nav ----------
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 981px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // ---------- Scroll reveal ----------
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ---------- FAQ accordion ----------
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var q = item.querySelector(".faq-question");
    if (!q) return;
    q.addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---------- Pricing: monthly / annual ----------
  var billingToggle = document.querySelector(".billing-toggle");
  if (billingToggle) {
    var options = billingToggle.querySelectorAll(".billing-option");
    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("aria-pressed") === "true") return;
        options.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        var billing = btn.getAttribute("data-billing");
        document.querySelectorAll(".price-value").forEach(function (el) {
          el.textContent = el.getAttribute("data-" + billing);
          el.classList.remove("is-changing");
          void el.offsetWidth; // restart the animation
          el.classList.add("is-changing");
        });
      });
    });
  }

  // ---------- Contact form ----------
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  var ts = document.getElementById("form-ts");
  if (ts) ts.value = String(Date.now());

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var rules = {
    name: function (v) {
      return v.trim() ? "" : "Indiquez votre nom pour que nous sachions à qui répondre.";
    },
    email: function (v) {
      if (!v.trim()) return "Indiquez votre email : c'est là que nous vous répondrons.";
      return EMAIL_RE.test(v.trim()) ? "" : "Cet email semble incomplet. Vérifiez le format, par exemple nom@entreprise.fr.";
    },
    subject: function (v) {
      return v ? "" : "Choisissez le type de demande pour que nous préparions l'échange.";
    },
    message: function (v) {
      var len = v.trim().length;
      if (!len) return "Décrivez votre besoin en quelques mots.";
      return len < 10 ? "Encore quelques mots : 10 caractères minimum (" + len + " pour l'instant)." : "";
    }
  };

  function validateField(name) {
    var input = form.elements[name];
    var msg = rules[name](input.value);
    var field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    var errText = field.querySelector(".field-error span");
    if (errText) errText.textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var input = form.elements[name];
    // Validate on blur, then live once the field has been flagged.
    input.addEventListener("blur", function () { if (input.value) validateField(name); });
    input.addEventListener("input", function () {
      if (input.closest(".field").classList.contains("has-error")) validateField(name);
    });
    input.addEventListener("change", function () {
      if (input.tagName === "SELECT") validateField(name);
    });
  });

  var icon = function (id) {
    return '<svg class="icon" aria-hidden="true"><use href="#i-' + id + '"/></svg>';
  };
  var successIcon = '<svg class="icon success-check" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/></svg>';

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function showStatus(type, html) {
    status.className = "form-status";
    void status.offsetWidth;
    status.classList.add("show", type);
    status.innerHTML = (type === "success" ? successIcon : icon("alert")) + "<div>" + html + "</div>";
  }

  function mailtoLink() {
    var subject = encodeURIComponent("[Site] " + (form.subject.value || "Demande de contact"));
    var body = encodeURIComponent(
      form.message.value + "\n\n— " + form.name.value + " (" + form.email.value + ")" +
      (form.phone.value ? "\nTél. : " + form.phone.value : "") +
      (form.company.value ? "\nEntreprise : " + form.company.value : "")
    );
    return "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var submitBtn = form.querySelector("button[type=submit]");
    submitBtn.classList.add("is-loading");
    submitBtn.setAttribute("aria-busy", "true");
    submitBtn.disabled = true;

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "X-Requested-With": "XMLHttpRequest" }
    })
      .then(function (res) {
        var type = res.headers.get("content-type") || "";
        if (type.indexOf("application/json") === -1) throw new Error("no-backend");
        return res.json();
      })
      .then(function (data) {
        var safe = escapeHtml(data.message || "");
        if (data.success) {
          showStatus("success", "<strong>Demande envoyée.</strong> " + safe);
          form.reset();
          if (ts) ts.value = String(Date.now());
        } else {
          showStatus("error", safe);
        }
      })
      .catch(function () {
        // Static hosting (GitHub Pages, local preview): no PHP backend to send the email.
        showStatus("error",
          "<strong>L'envoi n'a pas abouti</strong> : le formulaire n'est pas joignable pour le moment. " +
          'Votre message n\'est pas perdu : <a href="' + mailtoLink() + '">l\'envoyer depuis votre messagerie</a>, il sera pré-rempli.');
      })
      .finally(function () {
        submitBtn.classList.remove("is-loading");
        submitBtn.removeAttribute("aria-busy");
        submitBtn.disabled = false;
      });
  });
})();
