/**
 * Baracca - Scripts Globaux
 * Gère les animations, le compteur de levée de fonds, et l'espace investisseurs protégé.
 */

// ============================================
// 1. Compteur de levée de fonds (animé)
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 16ms ≈ 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current).toLocaleString('fr-FR');
  }, 16);
}

// Initialiser les compteurs au scroll
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// 2. Espace Investisseurs (Protection par mot de passe)
// ============================================
const INVESTOR_PASSWORD = 'Baracca2024'; // À CHANGER PAR VOTRE MOT DE PASSE

function initInvestorSpace() {
  const passwordPrompt = document.getElementById('password-prompt');
  const investorContent = document.getElementById('investor-content');

  // Vérifier si l'accès a déjà été accordé pendant la session
  if (sessionStorage.getItem('investorAccess') === 'granted') {
    if (passwordPrompt) passwordPrompt.classList.add('hidden');
    if (investorContent) investorContent.classList.remove('hidden');
  } else if (passwordPrompt && investorContent) {
    // Afficher le prompt
    passwordPrompt.classList.remove('hidden');
    investorContent.classList.add('hidden');

    // Écouter le clic sur le bouton de soumission
    const submitBtn = document.getElementById('password-submit');
    const passwordInput = document.getElementById('password-input');

    if (submitBtn && passwordInput) {
      submitBtn.addEventListener('click', () => {
        if (passwordInput.value === INVESTOR_PASSWORD) {
          passwordPrompt.classList.add('hidden');
          investorContent.classList.remove('hidden');
          sessionStorage.setItem('investorAccess', 'granted');
        } else {
          alert('Mot de passe incorrect. Veuillez réessayer.');
          passwordInput.value = '';
        }
      });

      // Écouter la touche Entrée
      passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          submitBtn.click();
        }
      });
    }
  }
}

// ============================================
// 3. FAQ (Accordéon)
// ============================================
function initFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isActive = faqItem.classList.contains('active');

      // Fermer toutes les FAQ
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Ouvrir celle cliquée si elle était fermée
      if (!isActive) {
        faqItem.classList.add('active');
      }
    });
  });
}

// ============================================
// 4. Animations au scroll (Fade In)
// ============================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));
}

// ============================================
// 5. Menu Mobile (si besoin)
// ============================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// ============================================
// 6. Formulaire de contact (Netlify Forms compatible)
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      // Pour Netlify Forms, le formulaire doit avoir l'attribut `netlify`
      console.log('Formulaire soumis');
      setTimeout(() => {
        form.reset();
        alert('Merci pour votre message ! Nous vous répondrons rapidement.');
      }, 1000);
    });
  }
}

// ============================================
// 7. Initialisation au chargement de la page
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initInvestorSpace();
  initFAQ();
  initScrollAnimations();
  initMobileMenu();
  initContactForm();
  document.body.classList.add('loaded');
});

// ============================================
// 8. Gestion du menu actif (pour le scroll)
// ============================================
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ============================================
// 9. Fonction utilitaire pour le compteur manuel
// ============================================
function updateCounter(elementId, newValue) {
  const counter = document.getElementById(elementId);
  if (counter) {
    counter.textContent = newValue.toLocaleString('fr-FR');
    counter.dataset.target = newValue;
  }
}