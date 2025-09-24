// Language state management
let currentLanguage = localStorage.getItem('language') || 'hi';

// Language translations
const translations = {
  en: {
    toggleText: 'हिं',
    tooltip: 'Switch to Hindi'
  },
  hi: {
    toggleText: 'EN',
    tooltip: 'Switch to English'
  }
};

// Function to switch to Hindi
function switchToHindi() {
  currentLanguage = 'hi';
  document.documentElement.lang = 'hi';
  
  document.querySelectorAll('[data-hi]').forEach(element => {
    const hindiText = element.getAttribute('data-hi');
    if (hindiText) {
      element.textContent = hindiText;
      element.classList.add('hindi');
    }
  });
  
  localStorage.setItem('language', 'hi');
  updateToggleButton();
}

// Function to switch to English
function switchToEnglish() {
  currentLanguage = 'en';
  document.documentElement.lang = 'en';
  
  document.querySelectorAll('[data-en]').forEach(element => {
    const englishText = element.getAttribute('data-en');
    if (englishText) {
      element.textContent = englishText;
      element.classList.remove('hindi');
    }
  });
  
  localStorage.setItem('language', 'en');
  updateToggleButton();
}

// Toggle language function
function toggleLanguage() {
  if (currentLanguage === 'en') {
    switchToHindi();
  } else {
    switchToEnglish();
  }
}

// Update the language toggle button
function updateToggleButton() {
  const toggleBtn = document.getElementById('languageToggle');
  if (!toggleBtn) return;
  
  const translation = translations[currentLanguage];
  if (translation) {
    toggleBtn.textContent = translation.toggleText;
    toggleBtn.setAttribute('title', translation.tooltip);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const lang = localStorage.getItem('language') || 'hi';
  
  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'hi');
    currentLanguage = 'hi';
    if (typeof applyHindiTranslations === 'function') {
      applyHindiTranslations();
    }
  }
  
  const toggleBtn = document.getElementById('languageToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
    updateToggleButton();
  }
});

// Make toggleLanguage available globally
window.toggleLanguage = toggleLanguage;

// Keyboard shortcut for language toggle (Ctrl + L)
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    toggleLanguage();
  }
});
