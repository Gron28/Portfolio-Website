// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Store the original text for translation
function storeOriginalText() {
    const elementsToTranslate = document.querySelectorAll('[data-es]');
    elementsToTranslate.forEach(element => {
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
    });
}

// Apply the chosen language to the current page
function applyLanguage(language) {
    const elementsToTranslate = document.querySelectorAll('[data-es]');
    elementsToTranslate.forEach(element => {
        if (language === 'es') {
            element.textContent = element.getAttribute('data-es'); // Translate to Spanish
        } else {
            element.textContent = element.dataset.originalText; // Revert to original text
        }
    });

    document.documentElement.lang = language; // Update the <html> lang attribute
}

// Initialize the language on page load
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('siteLanguage') || 'en'; // Default to 'en' if not set
    applyLanguage(savedLanguage); // Apply the saved language to the page
}

// Set up the language toggle functionality
function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const currentLanguage = localStorage.getItem('siteLanguage') || 'en';
            const newLanguage = (currentLanguage === 'en') ? 'es' : 'en';

            // Save the new language to localStorage
            localStorage.setItem('siteLanguage', newLanguage);

            // Apply the new language to the current page
            applyLanguage(newLanguage);

            // Update the button text
            langToggle.textContent = (newLanguage === 'es') ? 'SP/EN' : 'EN/SP';
        });

        // Set initial button text based on the saved language
        const savedLanguage = localStorage.getItem('siteLanguage') || 'en';
        langToggle.textContent = (savedLanguage === 'es') ? 'SP/EN' : 'EN/SP';
    }
}

// On DOMContentLoaded, set up translations and toggle
document.addEventListener('DOMContentLoaded', () => {
    storeOriginalText(); // Store the original text for translation
    initializeLanguage(); // Initialize the language for the page
    setupLanguageToggle(); // Set up the language toggle functionality
});


// Vertical Navigation Active Section Highlighting
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".vertical-nav a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 50;
        if (scrollY >= sectionTop) current = section.getAttribute("id");
    });
    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current)) link.classList.add("active");
    });
});

// Vertical Navigation Visibility on Scroll
const verticalNav = document.querySelector('.vertical-nav');
if (verticalNav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            verticalNav.classList.add('visible');
        } else {
            verticalNav.classList.remove('visible');
        }
    });
}

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Scroll to Top Button
const scrollToTopButton = document.querySelector('.scroll-to-top');
if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopButton.classList.add('visible');
        } else {
            scrollToTopButton.classList.remove('visible');
        }
    });

    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Video Playback Based on Visibility
function handleVideoVisibility() {
    const videos = document.querySelectorAll('video[autoplay]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;

            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, {
        threshold: 0.5
    });

    videos.forEach((video) => {
        observer.observe(video);
    });
}

// Animate Elements on Scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.ux-project, .personal-project, .art-item, .skill-tag');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check on load

// Add animation styles
const animationStyles = `
    .ux-project, .personal-project, .art-item, .skill-tag {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
`;
const styleElement = document.createElement('style');
styleElement.textContent = animationStyles;
document.head.appendChild(styleElement);

// Simple Lightbox for Art Items
const artItems = document.querySelectorAll('.art-item');
artItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const lightbox = document.createElement('div');
        lightbox.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 1000;">
                <img src="${img.src}" style="max-width: 90%; max-height: 90%; object-fit: contain;">
            </div>
        `;
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
    });
});

// Call video visibility function on load
window.addEventListener('load', () => {
    handleVideoVisibility();
});
