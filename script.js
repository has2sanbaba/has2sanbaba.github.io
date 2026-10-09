const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const langButtons = document.querySelectorAll('.lang-btn');

let translations = {};
let currentLang = localStorage.getItem('lang') || 'en';

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function setLanguage(lang) {
    if (!translations[lang]) return;

    currentLang = lang;
    localStorage.setItem('lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.body.dir = lang === 'fa' ? 'rtl' : 'ltr';

    langButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });

    const items = document.querySelectorAll('[data-i18n]');
    items.forEach((element) => {
        const key = element.dataset.i18n;
        const value = getNestedValue(translations[lang], key);

        if (value !== undefined) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });

    const placeholderItems = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderItems.forEach((element) => {
        const key = element.dataset.i18nPlaceholder;
        const value = getNestedValue(translations[lang], key);
        if (value !== undefined) {
            element.placeholder = value;
        }
    });

    const footer = document.querySelector('[data-i18n-footer]');
    if (footer && translations[lang].footer) {
        footer.innerHTML = `${translations[lang].footer}`;
    }
}

hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
    });
});

langButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

window.addEventListener('scroll', () => {
    let current = '';

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = translations[currentLang]?.contact?.success || 'Thank you for your message! I will get back to you soon.';
        alert(message);
        contactForm.reset();
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .project-card, .info-box').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `center ${window.scrollY * 0.5}px`;
    }
});

const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.transition = 'width 1s ease';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach((bar) => skillObserver.observe(bar));

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

document.body.style.opacity = '0';

document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

(async function init() {
    await loadTranslations();
    setLanguage(currentLang);
})();
