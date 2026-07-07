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

  // Tilt cards (Caratteristiche costruttive): subtle 3D tilt that
  // follows the cursor, reset smoothly on mouse leave. Only wired up
  // on real hover-capable, fine pointers (skips touch) and only if the
  // user doesn't prefer reduced motion — otherwise the cards keep the
  // ordinary .feature-card lift/shadow hover, untouched.
  var tiltCards = document.querySelectorAll(".tilt-card");
  if (
    tiltCards.length &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var tiltMax = 8;
    tiltCards.forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var ry = (px - 0.5) * tiltMax * 2;
        var rx = -(py - 0.5) * tiltMax * 2;
        card.style.setProperty("--rx", rx.toFixed(2) + "deg");
        card.style.setProperty("--ry", ry.toFixed(2) + "deg");
      });

      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

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

  // Legal pages (Privacy/Cookie Policy): TOC scrollspy + FAQ accordion
  var legalToc = document.querySelector(".legal-toc");
  var legalSections = Array.prototype.slice.call(document.querySelectorAll("[data-legal-section]"));
  if (legalToc && legalSections.length && "IntersectionObserver" in window) {
    var tocLinks = Array.prototype.slice.call(legalToc.querySelectorAll("a"));
    var setActiveTocLink = function (id) {
      tocLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };
    var legalSpy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveTocLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    legalSections.forEach(function (section) {
      legalSpy.observe(section);
    });
    if (legalSections[0]) {
      setActiveTocLink(legalSections[0].id);
    }
  }

  var faqItems = document.querySelectorAll(".legal-faq__item");
  faqItems.forEach(function (item) {
    var question = item.querySelector(".legal-faq__question");
    if (!question) return;
    question.addEventListener("click", function () {
      var isOpen = item.classList.toggle("is-open");
      question.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

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

      // The fanned cards rotate, which widens their horizontal footprint
      // beyond their own width. On narrow stages (mobile, or the mid-width
      // gap where .split__media is still capped by its own max-width) the
      // outermost cards can swing past the stage's edges and get clipped
      // by its overflow:hidden. Shrink the spread to whatever actually
      // fits the real measured stage width, so lateral cards are never
      // cut off at any container size; on wide stages this fit factor is
      // 1 and nothing changes from the original spacing/scale.
      var cardW = cards[0].offsetWidth;
      var cardH = cards[0].offsetHeight;
      var rad = (spreadDeg * Math.PI) / 180;
      var edgeScale = maxOffset > 0 ? 1 - maxOffset * 0.06 : 1;
      var footprintHalf = edgeScale * ((cardW / 2) * Math.cos(rad) + (cardH / 2) * Math.sin(rad));
      var requiredHalf = maxOffset * spacing + footprintHalf;
      var availableHalf = stage.clientWidth / 2 - 4;
      var fit = requiredHalf > 0 ? Math.min(1, availableHalf / requiredHalf) : 1;
      var fitSpacing = spacing * fit;

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
        var x = offset * fitSpacing;
        var y = isActive ? -18 : abs * 6;
        var scale = isActive ? 1 : (1 - abs * 0.06) * fit;

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
