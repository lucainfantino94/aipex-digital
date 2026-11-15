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
    var behind = document.querySelectorAll("main, .site-footer, .skip-link");
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.body.style.overflow = open ? "hidden" : "";
      // Keep keyboard focus inside the open menu: the page behind becomes inert.
      behind.forEach(function (el) { el.inert = open; });
      if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
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

  // ---------- Hero: wireframe terrain scan ----------
  var canvas = document.getElementById("terrain");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var color = getComputedStyle(document.documentElement).getPropertyValue("--phosphor").trim() || "#ff6a1a";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var COLS = 30, ROWS = 24, W, H, dpr;

    var size = function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Rolling hills + one dominant peak, like a survey map.
    var height = function (c, r, t) {
      var x = c / COLS, y = r / ROWS;
      var peak = Math.exp(-((x - 0.62) * (x - 0.62) + (y - 0.42) * (y - 0.42)) * 18) * 1.0;
      var hills = Math.sin(x * 7 + t * 0.35) * 0.12 + Math.cos(y * 6 - t * 0.25) * 0.1 + Math.sin((x + y) * 11) * 0.05;
      return peak + hills;
    };

    var project = function (c, r, h) {
      var cell = W / (COLS + ROWS) * 0.94;
      return [W / 2 + (c - r) * cell, H * 0.24 + (c + r) * cell * 0.5 - h * H * 0.28];
    };

    var draw = function (t) {
      ctx.clearRect(0, 0, W, H);
      var scan = (t * 3.2) % (ROWS + 8) - 4;
      ctx.lineWidth = 1;
      var r, c, p, h, best = { h: -1 };
      for (r = 0; r <= ROWS; r++) {
        var near = Math.max(0, 1 - Math.abs(r - scan) / 3);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.22 + near * 0.7;
        ctx.beginPath();
        for (c = 0; c <= COLS; c++) {
          h = height(c, r, t);
          p = project(c, r, h);
          if (c === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
          if (h > best.h) best = { h: h, x: p[0], y: p[1] };
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 0.16;
      for (c = 0; c <= COLS; c += 2) {
        ctx.beginPath();
        for (r = 0; r <= ROWS; r++) {
          p = project(c, r, height(c, r, t));
          if (r === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
        }
        ctx.stroke();
      }
      // Target marker on the summit
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.strokeRect(best.x - 7, best.y - 7, 14, 14);
      ctx.beginPath();
      ctx.moveTo(best.x, best.y - 7); ctx.lineTo(best.x, best.y - 34); ctx.lineTo(best.x + 18, best.y - 34);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = "500 11px 'IBM Plex Mono', monospace";
      ctx.fillText("PAGE 1 // GOOGLE", best.x + 22, best.y - 30);
    };

    var running = false, last = 0, start = performance.now();
    var loop = function (now) {
      if (!running) return;
      if (now - last > 33) { last = now; draw((now - start) / 1000); }
      requestAnimationFrame(loop);
    };
    var play = function (on) {
      if (reduce) return;
      if (on && !running) { running = true; requestAnimationFrame(loop); }
      if (!on) running = false;
    };

    size();
    draw(reduce ? 2 : 0);
    window.addEventListener("resize", function () { size(); if (!running) draw(2); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { play(e[0].isIntersecting && !document.hidden); }).observe(canvas);
    } else { play(true); }
    document.addEventListener("visibilitychange", function () { play(!document.hidden); });
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

  // Status coming back from a non-JS submission (contact.php redirect)
  var sent = new URLSearchParams(location.search).get("envoi");
  if (sent === "ok") {
    showStatus("success", "<strong>Demande envoyée.</strong> Nous revenons vers vous sous 48&nbsp;h ouvrées.");
  } else if (sent === "erreur") {
    showStatus("error", "<strong>L'envoi n'a pas abouti.</strong> Vérifiez les champs puis réessayez, ou écrivez-nous à <a href=\"mailto:" + CONTACT_EMAIL + "\">" + CONTACT_EMAIL + "</a>.");
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
