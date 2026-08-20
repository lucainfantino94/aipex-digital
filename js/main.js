(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;
    question.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      document.querySelectorAll(".faq-item").forEach(function (other) {
        other.setAttribute("data-open", "false");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute("data-open", "true");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Pricing panel: monthly / annual billing toggle
  var billingToggle = document.querySelector(".billing-toggle");
  if (billingToggle) {
    var billingButtons = billingToggle.querySelectorAll(".billing-option");
    billingButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        billingButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var billing = btn.getAttribute("data-billing");
        document.querySelectorAll(".price-value").forEach(function (el) {
          el.textContent = el.getAttribute("data-" + billing);
        });
      });
    });
  }

  // Contact form submission (works when contact.php is available, e.g. on OVH hosting)
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector("button[type=submit]");
      var originalLabel = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "Envoi en cours...";
      }
      status.classList.remove("show", "success", "error");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "X-Requested-With": "XMLHttpRequest" },
      })
        .then(function (res) {
          if (!res.ok && res.status !== 400) throw new Error("network");
          return res.json();
        })
        .then(function (data) {
          status.textContent = data.message;
          status.classList.add("show", data.success ? "success" : "error");
          if (data.success) form.reset();
        })
        .catch(function () {
          // Static hosting (e.g. GitHub Pages) has no PHP backend: fall back to a mailto draft.
          var name = encodeURIComponent(form.name.value);
          var subject = encodeURIComponent(form.subject.value || "Demande de contact");
          var body = encodeURIComponent(form.message.value + "\n\n— " + form.name.value + " (" + form.email.value + ")");
          window.location.href = "mailto:contact@aipex-digital.com?subject=" + subject + "&body=" + body;
          status.textContent = "Le formulaire n'est disponible que sur l'hébergement final. Votre client email va s'ouvrir pour envoyer votre message.";
          status.classList.add("show", "error");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
          }
        });
    });
  }

  // Header background reinforcement on scroll (transparent over the hero, solid once scrolled)
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
