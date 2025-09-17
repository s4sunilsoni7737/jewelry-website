// Product detail modal functionality
document.addEventListener("DOMContentLoaded", () => {
  const detailButtons = document.querySelectorAll('.view-details-btn');

  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name;
      const description = button.dataset.description;
      const price = button.dataset.price;
      const image = button.dataset.image;

      document.getElementById('productModalTitle').textContent = name;
      document.getElementById('productModalDescription').textContent = description;
      document.getElementById('productModalPrice').textContent = price;
      document.getElementById('productModalImage').src = image;

      const modal = new bootstrap.Modal(document.getElementById('productModal'));
      modal.show();
    });
  });
});

// Slider functionality for featured products
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById('featuredSlider');
  const btnLeft = document.getElementById('slide-left');
  const btnRight = document.getElementById('slide-right');

  if (slider && btnLeft && btnRight) {
    const scrollAmount = 265;

    btnLeft.addEventListener('click', () => {
      if (slider.scrollLeft === 0) {
        // Jump to end
        slider.scrollLeft = slider.scrollWidth;
      } else {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    });

    btnRight.addEventListener('click', () => {
      if (Math.ceil(slider.scrollLeft + slider.offsetWidth) >= slider.scrollWidth) {
        // Jump to start
        slider.scrollLeft = 0;
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    // Optional: Circular auto-scroll
    setInterval(() => {
      if (Math.ceil(slider.scrollLeft + slider.offsetWidth) >= slider.scrollWidth) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 5000);
  }
});

// Navbar functionality
document.addEventListener("DOMContentLoaded", () => {
  // Auto-collapse navbar on link click (for small screens)
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function(navLink) {
    navLink.addEventListener('click', function () {
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click(); // Trigger collapse
      }
    });
  });
});

// Language Converter - Enhanced Version
document.addEventListener("DOMContentLoaded", () => {
  let currentLanguage = localStorage.getItem("language") 
    || (navigator.language.startsWith("hi") ? "hi" : "en");

  let isToggling = false; // Prevent multiple rapid clicks

  function applyLanguage(lang) {
    // Re-query elements each time to catch dynamically added content
    const translatableElements = document.querySelectorAll("[data-en], [data-hi]");
    const toggleButton = document.getElementById("languageToggle");
    
    translatableElements.forEach(el => {
      const text = el.dataset[lang];
      if (text) {
        if (el.tagName === 'INPUT' && (el.type === 'text' || el.type === 'search')) {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
    
    localStorage.setItem("language", lang);
    currentLanguage = lang;
    
    if (toggleButton) {
      toggleButton.textContent = lang === "en" ? "हिं" : "EN";
      toggleButton.setAttribute("aria-label", lang === "en" ? "Switch to Hindi" : "Switch to English");
    }

    // Trigger custom event for other scripts to listen
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  }

  // Make applyLanguage globally accessible
  window.applyCurrentLanguage = () => applyLanguage(currentLanguage);
  
  // Improved toggle function with debouncing
  window.toggleLanguage = () => {
    if (isToggling) return; // Prevent rapid clicks
    
    isToggling = true;
    const newLang = currentLanguage === "en" ? "hi" : "en";
    applyLanguage(newLang);
    
    // Reset toggle flag after a short delay
    setTimeout(() => {
      isToggling = false;
    }, 300);
  };

  // Initialize language on load
  applyLanguage(currentLanguage);

  // Button click handler - use event delegation to handle dynamic content
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "languageToggle") {
      e.preventDefault();
      window.toggleLanguage();
    }
  });

  // Keyboard shortcut Ctrl+L
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      window.toggleLanguage();
    }
  });

  // Listen for storage changes (for multi-tab sync)
  window.addEventListener('storage', (e) => {
    if (e.key === 'language' && e.newValue !== currentLanguage) {
      currentLanguage = e.newValue;
      applyLanguage(currentLanguage);
    }
  });

  // Re-apply language when new content is loaded (for dynamic pages)
  const observer = new MutationObserver(() => {
    // Debounce the language application
    clearTimeout(window.languageTimeout);
    window.languageTimeout = setTimeout(() => {
      applyLanguage(currentLanguage);
    }, 100);
  });

  // Observe changes to the document body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-en', 'data-hi']
  });
});

// Enhanced search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('form[role="search"]');
  const searchInput = searchForm?.querySelector('input[name="search"]');
  
  if (searchInput) {
    searchInput.addEventListener('focus', function() {
      this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
      this.parentElement.style.transform = 'scale(1)';
    });
  }

  // Add loading state to search
  if (searchForm) {
    searchForm.addEventListener('submit', function() {
      const submitBtn = this.querySelector('.search-btn');
      if (submitBtn) {
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
        }, 1000);
      }
    });
  }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Global utility functions
window.showDeleteModal = function() {
  if (typeof bootstrap !== 'undefined') {
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
  }
};

window.submitDelete = function() {
  const form = document.getElementById('deleteProductForm');
  if (form) {
    form.submit();
  }
};