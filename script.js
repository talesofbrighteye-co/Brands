/* TOBC — shared interactions */

/* NAV */
const nav = document.getElementById("nav");
if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });
}

/* MOBILE MENU */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuBtn.textContent = open ? "×" : "☰";
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuBtn.textContent = "☰";
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* HERO SLIDER — only exists on index.html */
const heroSlides = [...document.querySelectorAll(".hero-bg div")];
const heroButtons = [...document.querySelectorAll(".hero-meta button")];
const pauseBtn = document.getElementById("pauseBtn");

if (heroSlides.length && heroButtons.length && pauseBtn) {
  let heroIndex = 0;
  let paused = false;
  let heroTimer;

  function showHero(i) {
    heroIndex = i;
    heroSlides.forEach((slide, n) => slide.classList.toggle("active", n === i));
    heroButtons.forEach((button, n) => button.classList.toggle("active", n === i));
  }

  function nextHero() {
    if (!paused) showHero((heroIndex + 1) % heroSlides.length);
  }

  function restartHeroTimer() {
    clearInterval(heroTimer);
    heroTimer = setInterval(nextHero, 6000);
  }

  heroButtons.forEach(button => {
    button.addEventListener("click", () => {
      showHero(Number(button.dataset.slide));
      restartHeroTimer();
    });
  });

  pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "▶" : "Ⅱ";
    pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
  });

  showHero(0);
  restartHeroTimer();
}

/* TESTIMONIALS — only exists on index.html */
const testimonialSlides = [...document.querySelectorAll(".testimonial-slide")];
const testimonialDots = [...document.querySelectorAll(".testimonial-controls button")];

if (testimonialSlides.length && testimonialDots.length) {
  let testimonialIndex = 0;

  function showTestimonial(i) {
    testimonialIndex = i;
    testimonialSlides.forEach((slide, n) => slide.classList.toggle("active", n === i));
    testimonialDots.forEach((dot, n) => dot.classList.toggle("active", n === i));
  }

  testimonialDots.forEach(dot => {
    dot.addEventListener("click", () => showTestimonial(Number(dot.dataset.testimonial)));
  });

  setInterval(() => {
    showTestimonial((testimonialIndex + 1) % testimonialSlides.length);
  }, 7000);
}

/* SCROLL REVEAL — disabled for Work page; Work content is visible immediately */
if (!document.body.classList.contains("work-page")) {
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
}

/* =========================================================
   WORK PAGE — six-image lightbox gallery
   ========================================================= */
if (document.body.classList.contains("work-page")) {
  const lightbox = document.getElementById("workLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const closeButton = document.querySelector(".lightbox-close");
  const prevButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");

  const galleryState = {
    items: [],
    index: 0,
    category: ""
  };

  function openGallery(item, gallery) {
    galleryState.items = [...gallery.querySelectorAll("[data-lightbox]")];
    galleryState.index = galleryState.items.indexOf(item);
    galleryState.category = gallery.dataset.gallery || "";
    renderLightbox();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function renderLightbox() {
    const item = galleryState.items[galleryState.index];
    if (!item) return;

    const img = item.querySelector("img");
    const src = item.getAttribute("href");
    const alt = img ? img.alt : "";

    lightboxImage.src = src;
    lightboxImage.alt = alt;
    lightboxCounter.textContent =
      String(galleryState.index + 1).padStart(2, "0") + " / " +
      String(galleryState.items.length).padStart(2, "0");
    lightboxCategory.textContent =
      galleryState.category.charAt(0).toUpperCase() + galleryState.category.slice(1);
  }

  function closeGallery() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    lightboxImage.src = "";
  }

  function moveGallery(step) {
    if (!galleryState.items.length) return;
    galleryState.index =
      (galleryState.index + step + galleryState.items.length) %
      galleryState.items.length;
    renderLightbox();
  }

  document.querySelectorAll("[data-gallery]").forEach(gallery => {
    gallery.querySelectorAll("[data-lightbox]").forEach(item => {
      item.addEventListener("click", event => {
        const img = item.querySelector("img");

        // Placeholder images are intentionally not opened.
        if (img && img.src.includes("YOUR_")) {
          event.preventDefault();
          return;
        }

        event.preventDefault();
        openGallery(item, gallery);
      });
    });
  });

  if (closeButton) closeButton.addEventListener("click", closeGallery);
  if (prevButton) prevButton.addEventListener("click", () => moveGallery(-1));
  if (nextButton) nextButton.addEventListener("click", () => moveGallery(1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeGallery();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("open")) return;

    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  });

  // Touch swipe support for mobile.
  let touchStartX = 0;

  lightbox.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].clientX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 50) {
      moveGallery(distance < 0 ? 1 : -1);
    }
  }, { passive: true });
}
