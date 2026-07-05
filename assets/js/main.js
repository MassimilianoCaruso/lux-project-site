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

  // Hero scroll sequence: the house grows from the bottom while the
  // section stays pinned, then scrolls away normally with the rest of
  // the hero as the "Chi Siamo" section rises up to take its place.
  var hero = document.getElementById("hero");
  var heroPin = hero && hero.querySelector(".hero3__pin");
  var heroHouse = hero && hero.querySelector(".hero3__house");
  var heroContent = hero && hero.querySelector(".hero3__content");
  var heroReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hero && heroPin && heroHouse && heroContent && !heroReduceMotion) {
    var heroTicking = false;

    var heroClamp01 = function (v) {
      return Math.min(Math.max(v, 0), 1);
    };

    var updateHeroScroll = function () {
      var scrollable = hero.offsetHeight - heroPin.offsetHeight;
      var rectTop = -hero.getBoundingClientRect().top;

      var growProgress = scrollable > 0 ? heroClamp01(rectTop / scrollable) : 0;
      var houseScale = 1.3 + growProgress * 0.7;
      heroHouse.style.transform = "translateX(-50%) scale(" + houseScale + ")";

      heroTicking = false;
    };
    document.addEventListener(
      "scroll",
      function () {
        if (!heroTicking) {
          window.requestAnimationFrame(updateHeroScroll);
          heroTicking = true;
        }
      },
      { passive: true }
    );
    updateHeroScroll();
  }

  // Mobile-only hero (separate from desktop .hero3): no scroll-pin/grow,
  // just a light parallax drift on the house image while scrolling. The
  // text entrance is handled by the generic .reveal observer below.
  var heroMobile = document.getElementById("hero-mobile");
  var heroMobileHouse = heroMobile && heroMobile.querySelector(".hero-mobile__house");
  var heroMobileReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroMobile && heroMobileHouse && !heroMobileReduceMotion) {
    var heroMobileTicking = false;

    var heroMobileClamp = function (v, min, max) {
      return Math.min(Math.max(v, min), max);
    };

    var updateHeroMobileParallax = function () {
      if (window.innerWidth < 768) {
        var rect = heroMobile.getBoundingClientRect();
        var offset = heroMobileClamp(rect.top * 0.12, -50, 50);
        heroMobileHouse.style.transform = "translateY(" + offset + "px)";
      }
      heroMobileTicking = false;
    };
    document.addEventListener(
      "scroll",
      function () {
        if (!heroMobileTicking) {
          window.requestAnimationFrame(updateHeroMobileParallax);
          heroMobileTicking = true;
        }
      },
      { passive: true }
    );
    updateHeroMobileParallax();
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

  // Story stack (Caratteristiche costruttive): fanned card navigation
  var storyStacks = document.querySelectorAll("[data-story-stack]");
  storyStacks.forEach(function (stack) {
    var stage = stack.querySelector(".story-stack__stage");
    var cards = Array.prototype.slice.call(stack.querySelectorAll(".story-stack__card"));
    var dots = Array.prototype.slice.call(stack.querySelectorAll("[data-story-dots] button"));
    var prevBtn = stack.querySelector("[data-story-prev]");
    var nextBtn = stack.querySelector("[data-story-next]");
    var len = cards.length;
    var active = 0;
    var storyReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (storyReduceMotion) {
      cards.forEach(function (card) {
        card.style.transitionDuration = "0ms";
      });
    }

    function isSmallScreen() {
      return window.matchMedia("(max-width: 640px)").matches;
    }

    function render() {
      var maxOffset = isSmallScreen() ? 2 : 3;
      var spreadDeg = storyReduceMotion ? 0 : isSmallScreen() ? 24 : 40;
      var stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;
      var spacing = isSmallScreen() ? 46 : 78;

      cards.forEach(function (card, i) {
        var offset = i - active;
        var abs = Math.abs(offset);
        var isActive = offset === 0;

        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-current", isActive ? "true" : "false");

        if (abs > maxOffset) {
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
          return;
        }

        var rotate = offset * stepDeg;
        var x = offset * spacing;
        var y = isActive ? -18 : abs * 6;
        var scale = isActive ? 1 : 1 - abs * 0.06;

        card.style.pointerEvents = "";
        card.style.zIndex = String(100 - abs);
        card.style.opacity = isActive ? "1" : String(Math.max(0.55, 1 - abs * 0.18));
        card.style.transform =
          "translateX(-50%) translateX(" + x + "px) translateY(" + y + "px) rotate(" + rotate + "deg) scale(" + scale + ")";
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    function goTo(index) {
      active = ((index % len) + len) % len;
      render();
    }

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        goTo(i);
      });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(active - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(active + 1);
      });
    }

    stack.setAttribute("tabindex", "0");
    stack.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") goTo(active - 1);
      if (e.key === "ArrowRight") goTo(active + 1);
    });

    var dragStartX = null;
    stage.addEventListener("pointerdown", function (e) {
      dragStartX = e.clientX;
    });
    stage.addEventListener("pointerup", function (e) {
      if (dragStartX === null) return;
      var delta = e.clientX - dragStartX;
      if (Math.abs(delta) > 40) {
        goTo(active + (delta < 0 ? 1 : -1));
      }
      dragStartX = null;
    });

    window.addEventListener("resize", render);

    render();
  });

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
