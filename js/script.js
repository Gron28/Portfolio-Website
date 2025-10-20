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
      this.applyLanguage();
      this.setupLoader();
      this.setupMobileNav();
      this.setupLanguageToggle();
      this.setupVideoObserver();
      this.setupGalaxyAnimation();
      this.setupFAQAccordion();
      this.fetchAndUpdateARSPrice();
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

    async fetchAndUpdateARSPrice() {
      const priceContainer = document.getElementById("ars-price-container");
      const usdPrice = 250; 
      if (!priceContainer) return;

      try {
        const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
        if (!response.ok) throw new Error("API request failed");

        const data = await response.json();
        const blueRate = data.blue.value_sell;

        let arsPrice = usdPrice * blueRate;
        arsPrice = Math.round(arsPrice / 1000) * 1000;
        const formattedPrice = new Intl.NumberFormat("es-AR").format(arsPrice);

        priceContainer.innerHTML = `/ ARS ${formattedPrice} (aprox)`;
      } catch (error) {
        console.error("Could not fetch ARS price:", error);
        priceContainer.style.display = "none";
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
        this.applyLanguage();
      });

      this.applyLanguage();
    },

    applyLanguage() {
      const lang = this.state.currentLanguage;

      this.elements.translatableElements.forEach((element) => {
        const text = element.getAttribute(`data-${lang}`);
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

      document.documentElement.lang = lang;
      localStorage.setItem("siteLanguage", lang);
      this.updateSEOTags(lang);
      this.fetchAndUpdateARSPrice();
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
