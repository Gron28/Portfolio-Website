document.addEventListener("DOMContentLoaded", () => {
  const App = {
    elements: {
      loader: document.querySelector(".loader-container"),
      hamburger: document.querySelector(".hamburger"),
      langToggle: document.getElementById("langToggle"),
      translatableElements: document.querySelectorAll("[data-es]"),
      bilingualLinks: document.querySelectorAll("[data-link-es]"),
      bilingualImages: document.querySelectorAll("[data-img-es]"),
      canvas: document.getElementById("galaxy-canvas"),
    },
    state: {
      currentLanguage: localStorage.getItem("siteLanguage") || "en",
    },

    init() {
      this.determineInitialLanguage();
      this.setupABTesting(); // Run A/B testing before language application
      this.applyLanguage();
      this.setupLoader();
      this.setupMobileNav();
      this.setupLanguageToggle();
      this.setupVideoObserver();
      this.setupGalaxyAnimation();
      this.setupFAQAccordion();
      this.setupWhatsAppFloat();
      console.log("App Initialized Successfully.");
    },

    determineInitialLanguage() {
      const params = new URLSearchParams(window.location.search);
      const langFromURL = params.get('lang');
  
      if (langFromURL === 'es' || langFromURL === 'en') {
          this.state.currentLanguage = langFromURL;
          localStorage.setItem('siteLanguage', langFromURL);
      } else {
          this.state.currentLanguage = localStorage.getItem('siteLanguage') || 'en';
      }
  },

    updateSEOTags(lang) {
      const descriptionTag = document.querySelector('meta[name="description"]');
      if (!descriptionTag) return;

      const newTitle = descriptionTag.getAttribute(`data-${lang}-title`);
      const newDesc = descriptionTag.getAttribute(`data-${lang}-desc`);

      if (newTitle) {
        document.title = newTitle;
      }
      if (newDesc) {
        descriptionTag.setAttribute("content", newDesc);
      }
    },

    setupWhatsAppFloat() {
      const floatContainer = document.querySelector(
        ".whatsapp-float-container"
      );
      const closeBtn = document.querySelector(".whatsapp-close-btn");
      if (!floatContainer || !closeBtn) return;
      let isDismissed = false;
      window.addEventListener(
        "scroll",
        () => {
          if (window.scrollY > 400 && !isDismissed) {
            floatContainer.classList.add("visible");
          } else {
            floatContainer.classList.remove("visible");
          }
        },
        { passive: true }
      );
      closeBtn.addEventListener("click", () => {
        isDismissed = true;
        floatContainer.classList.remove("visible");
      });
    },

    setupABTesting() {
      // Simple A/B testing implementation
      // Can be replaced with Google Optimize later
      const abTestElements = document.querySelectorAll("[data-en-variant-a]");

      abTestElements.forEach((element) => {
        // Use a hash that includes language for consistent assignment per language
        const testId = element.className + window.location.pathname + this.state.currentLanguage;
        const hash = this.simpleHash(testId);
        const variant = hash % 2 === 0 ? 'a' : 'b';

        // Set data attributes for the language system to use with proper language-specific variants
        const enVariant = element.getAttribute(`data-en-variant-${variant}`);
        const esVariant = element.getAttribute(`data-es-variant-${variant}`);

        if (enVariant) element.setAttribute(`data-en-ab-${variant}`, enVariant);
        if (esVariant) element.setAttribute(`data-es-ab-${variant}`, esVariant);

        // Mark this element as using A/B testing
        element.dataset.abVariant = variant;

        // Track click events for A/B testing
        element.addEventListener('click', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'ab_test_click', {
              'custom_parameter_1': element.className,
              'custom_parameter_2': variant,
              'custom_parameter_3': this.state.currentLanguage,
              'page_location': window.location.href
            });
          }
        });
      });
    },

    simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash);
    },

    setupLoader() {
      if (!this.elements.loader) return;
      window.addEventListener("load", () => {
        this.elements.loader.style.opacity = "0";
        this.elements.loader.addEventListener("transitionend", () => {
          this.elements.loader.style.display = "none";
        });
      });
    },

    setupMobileNav() {
      const hamburger = this.elements.hamburger;
      const mobileMenu = document.querySelector(".mobile-menu-overlay");
      if (!hamburger || !mobileMenu) return;

      const mobileMenuLinks = mobileMenu.querySelectorAll("a");

      hamburger.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
        hamburger.classList.toggle("active");

        const isMenuOpen = document.body.classList.contains("menu-open");
        hamburger.setAttribute("aria-expanded", isMenuOpen);
        document.body.style.overflow = isMenuOpen ? "hidden" : "";
      });

      mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (document.body.classList.contains("menu-open")) {
            document.body.classList.remove("menu-open");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
          }
        });
      });
    },

    setupLanguageToggle() {
      if (!this.elements.langToggle) return;

      this.elements.langToggle.addEventListener("click", () => {
        this.state.currentLanguage =
          this.state.currentLanguage === "en" ? "es" : "en";
        // Re-run A/B testing with new language context
        this.setupABTesting();
        this.applyLanguage();
      });

      this.applyLanguage();
    },

    applyLanguage() {
      const lang = this.state.currentLanguage;

      this.elements.translatableElements.forEach((element) => {
        // Check for A/B test variants first
        const abVariant = element.dataset.abVariant;
        let text = null;

        if (abVariant) {
          // Use A/B test variant if available
          text = element.getAttribute(`data-${lang}-ab-${abVariant}`);
        }

        // Fall back to regular translation if no A/B variant
        if (!text) {
          text = element.getAttribute(`data-${lang}`);
        }

        if (text !== null) {
          element.innerHTML = text;
        }
      });

      this.elements.bilingualLinks.forEach((link) => {
        const path = link.getAttribute(`data-link-${lang}`);
        if (path) {
          link.setAttribute("href", path);
        }
      });

      this.elements.bilingualImages.forEach((image) => {
        const src = image.getAttribute(`data-img-${lang}`);
        if (src) {
          image.setAttribute("src", src);
        }
      });

      const translatablePlaceholders = document.querySelectorAll(
        "[data-en-placeholder]"
      );
      translatablePlaceholders.forEach((element) => {
        const placeholderText = element.getAttribute(
          `data-${lang}-placeholder`
        );
        if (placeholderText) {
          element.setAttribute("placeholder", placeholderText);
        }
      });

      // Handle mobile-specific text for small screens
      const isMobile = window.innerWidth <= 768;
      const mobileElements = document.querySelectorAll("[data-en-mobile]");
      mobileElements.forEach((element) => {
        if (isMobile) {
          const mobileText = element.getAttribute(`data-${lang}-mobile`);
          if (mobileText) {
            element.innerHTML = mobileText;
          }
        } else {
          const desktopText = element.getAttribute(`data-${lang}`);
          if (desktopText) {
            element.innerHTML = desktopText;
          }
        }
      });

      document.documentElement.lang = lang;
      localStorage.setItem("siteLanguage", lang);
      this.updateSEOTags(lang);
    },

    setupFAQAccordion() {
      const faqItems = document.querySelectorAll(".faq-item");
      if (faqItems.length === 0) return; 

      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
          const answer = item.querySelector(".faq-answer");
          const currentlyActive = document.querySelector(".faq-item.active");

          if (currentlyActive && currentlyActive !== item) {
            currentlyActive.classList.remove("active");
            currentlyActive.querySelector(".faq-answer").style.maxHeight = 0;
          }

          item.classList.toggle("active");

          if (item.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          } else {
            answer.style.maxHeight = 0;
          }
        });
      });
    },

    setupVideoObserver() {
      const videos = document.querySelectorAll("video");
      if (videos.length === 0) return;

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const callback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play().catch((error) => {});
          } else {
            entry.target.pause();
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);

      videos.forEach((video) => {
        observer.observe(video);
      });
    },

    setupGalaxyAnimation() {
      const mobileBreakpoint = 768;
      if (window.innerWidth <= mobileBreakpoint) {
        const canvas = this.elements.canvas;
        if (canvas) {
          canvas.style.display = "none";
        }
        return;
      }

      const canvas = this.elements.canvas;
      if (!canvas) return;

      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();

      const ctx = canvas.getContext("2d");
      const config = {
        particleCount: 300,
        branches: 12,
        colors: [primaryColor, "#fafde6"],
        rotationSpeed: 0.0000015,
        pixelSize: 8,
        minRange: 50,
      };
      let particles = [];
      let animationFrameId;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      const createGalaxy = () => {
        particles = [];
        const maxRange = Math.max(canvas.width, canvas.height) * 0.7;
        for (let i = 0; i < config.particleCount; i++) {
          const radius =
            Math.random() * (maxRange - config.minRange) + config.minRange;
          const branchAngle =
            ((i % config.branches) / config.branches) * Math.PI * 2;
          const spinAngle = radius * 0.01;
          particles.push({
            x: Math.cos(branchAngle + spinAngle) * radius,
            y: Math.sin(branchAngle + spinAngle) * radius,
            color:
              config.colors[Math.floor(Math.random() * config.colors.length)],
            angle: branchAngle,
            radius: radius,
          });
        }
      };

      const drawPixel = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(x / config.pixelSize) * config.pixelSize,
          Math.floor(y / config.pixelSize) * config.pixelSize,
          config.pixelSize,
          config.pixelSize
        );
      };

      const animate = () => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const bgColor = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-background")
          .trim();
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
          p.angle += config.rotationSpeed * p.radius;
          const x = centerX + p.x * Math.cos(p.angle) - p.y * Math.sin(p.angle);
          const y = centerY + p.x * Math.sin(p.angle) + p.y * Math.cos(p.angle);
          drawPixel(x, y, p.color);
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      const restartAnimation = () => {
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
        }
        resizeCanvas();
        createGalaxy();
        animate();
      };

      window.addEventListener("resize", restartAnimation);

      restartAnimation();
    },
  };

  App.init();
});
