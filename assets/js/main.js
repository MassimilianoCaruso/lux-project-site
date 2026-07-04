(function () {
  "use strict";

  // Header scroll state
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Lightbox gallery
  var lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    var lightboxImg = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__prev");
    var nextBtn = lightbox.querySelector(".lightbox__next");
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-src]"));
    var currentIndex = 0;

    function openAt(index) {
      currentIndex = (index + triggers.length) % triggers.length;
      var trigger = triggers[currentIndex];
      lightboxImg.src = trigger.getAttribute("data-lightbox-src");
      lightboxImg.alt = trigger.getAttribute("data-lightbox-alt") || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    function close() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    triggers.forEach(function (trigger, index) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openAt(index);
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { openAt(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { openAt(currentIndex + 1); });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") openAt(currentIndex + 1);
      if (e.key === "ArrowLeft") openAt(currentIndex - 1);
    });
  }

  // Contact form submission (Formspree)
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    var statusEl = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var action = form.getAttribute("action");
      var isPlaceholder = !action || action.indexOf("YOUR_FORM_ID") !== -1;

      if (isPlaceholder) {
        statusEl.textContent =
          "Modulo non ancora collegato: crea un account su formspree.io e sostituisci YOUR_FORM_ID nell'attributo action del form per attivare l'invio.";
        statusEl.classList.remove("is-success");
        statusEl.classList.add("is-visible", "is-error");
        return;
      }

      var submitBtn = form.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Invio in corso...";

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            statusEl.textContent = "Grazie! Ti ricontatteremo al più presto.";
            statusEl.classList.remove("is-error");
            statusEl.classList.add("is-visible", "is-success");
            form.reset();
          } else {
            throw new Error("Errore invio");
          }
        })
        .catch(function () {
          statusEl.textContent = "Si è verificato un errore. Riprova oppure scrivici direttamente via email.";
          statusEl.classList.remove("is-success");
          statusEl.classList.add("is-visible", "is-error");
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Invia richiesta";
        });
    });
  }
})();
