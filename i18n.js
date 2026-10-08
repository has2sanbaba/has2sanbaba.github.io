// Internationalization (i18n) System
class I18n {
  constructor() {
    this.translations = {};
    this.currentLanguage = localStorage.getItem('language') || 'en';
    this.supportedLanguages = ['en', 'fa', 'ru', 'zh'];
  }

  async loadTranslations() {
    try {
      const response = await fetch('translations.json');
      this.translations = await response.json();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      this.updatePageLanguage();
      this.updateDOM();
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value || key;
  }

  updatePageLanguage() {
    const htmlElement = document.documentElement;
    htmlElement.lang = this.currentLanguage;
    
    // Set text direction for RTL languages
    if (this.currentLanguage === 'fa' || this.currentLanguage === 'ar') {
      htmlElement.dir = 'rtl';
      document.body.dir = 'rtl';
    } else {
      htmlElement.dir = 'ltr';
      document.body.dir = 'ltr';
    }
  }

  updateDOM() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update elements with data-i18n-html attribute
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.t(key);
      element.innerHTML = translation;
    });

    // Trigger custom event for additional updates if needed
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: this.currentLanguage } 
    }));
  }

  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  getLanguageName(lang) {
    const names = {
      en: 'English',
      fa: 'فارسی',
      ru: 'Русский',
      zh: '中文'
    };
    return names[lang] || lang;
  }
}

// Initialize i18n
const i18n = new I18n();

// Load translations when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  await i18n.loadTranslations();
  i18n.updatePageLanguage();
  i18n.updateDOM();
});

// Optional: Add keyboard shortcut to cycle through languages
document.addEventListener('keydown', (e) => {
  // Alt + L to open language menu
  if (e.altKey && e.key === 'l') {
    const selector = document.querySelector('.language-selector');
    if (selector) {
      selector.classList.toggle('active');
    }
  }
});
