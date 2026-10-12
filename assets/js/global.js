/**
 * PAWFECT ACADEMY — Global JavaScript Engine
 * Handles: Theme, RTL, Scroll, Nav, Counters, Sliders, Accordion, Toast, Forms
 */

// ============================================================
// THEME & RTL
// ============================================================
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('pawfect-theme') || 'light';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pawfect-theme', theme);
    const icon = document.querySelector('#themeToggle');
    if (icon) {
      if (theme === 'dark') {
        icon.innerHTML = `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
        icon.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.innerHTML = `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
        icon.setAttribute('aria-label', 'Switch to dark mode');
      }
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

const RTLManager = {
  init() {
    const saved = localStorage.getItem('pawfect-dir') || 'ltr';
    this.apply(saved);
  },
  apply(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('pawfect-dir', dir);
    const btn = document.querySelector('#rtlToggle');
    if (btn) {
      const label = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.textContent = label;
      btn.setAttribute('aria-label', `Switch to ${dir === 'rtl' ? 'Left-to-Right' : 'Right-to-Left'} direction`);
    }
  },
  toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    this.apply(current === 'rtl' ? 'ltr' : 'rtl');
  }
};

// ============================================================
// NAVBAR
// ============================================================
const NavbarManager = {
  init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('navbar-scrolled');
        navbar.classList.remove('navbar-transparent');
      } else {
        navbar.classList.remove('navbar-scrolled');
        if (navbar.dataset.transparent === 'true') {
          navbar.classList.add('navbar-transparent');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      if (href === currentPath || href === './' + currentPath) {
        link.classList.add('active');
      } else if (currentPath === 'blog-details.html' && (href === './blog.html' || href === 'blog.html')) {
        link.classList.add('active');
      } else if (currentPath === 'program-details.html' && (href === './programs.html' || href === 'programs.html')) {
        link.classList.add('active');
      }
    });
  }
};

const ProfileDropdownManager = {
  init() {
    const dropdown = document.querySelector('.profile-dropdown');
    const toggle = document.querySelector('#profileToggle');
    if (!dropdown || !toggle) return;

    let timer = null;

    const openMenu = () => {
      clearTimeout(timer);
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = (delay = 180) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        dropdown.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }, delay);
    };

    // Hover interactions (open and stay accessible while cursor moves to links)
    dropdown.addEventListener('mouseenter', openMenu);
    dropdown.addEventListener('mouseleave', () => closeMenu(200));

    // Focus interactions for keyboard accessibility
    dropdown.addEventListener('focusin', openMenu);
    dropdown.addEventListener('focusout', (e) => {
      if (!dropdown.contains(e.relatedTarget)) {
        closeMenu(50);
      }
    });

    // Click toggle (for mobile/touch devices)
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdown.classList.contains('open')) {
        closeMenu(0);
      } else {
        openMenu();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        closeMenu(0);
      }
    });
  }
};

const MobileMenuManager = {
  init() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav-link, .mobile-nav-cta a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
};

// ============================================================
// SCROLL REVEAL
// ============================================================
const ScrollReveal = {
  init() {
    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
  }
};

// ============================================================
// COUNTERS
// ============================================================
const CounterManager = {
  init() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }
};

// ============================================================
// PROGRESS BARS
// ============================================================
const ProgressManager = {
  init() {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  }
};

// ============================================================
// HERO SLIDER
// ============================================================
class Slider {
  constructor(wrapper, options = {}) {
    this.wrapper = typeof wrapper === 'string' ? document.querySelector(wrapper) : wrapper;
    if (!this.wrapper) return;
    this.track = this.wrapper.querySelector('.slider-track');
    this.slides = this.wrapper.querySelectorAll('.slide');
    this.dots = this.wrapper.querySelectorAll('.slider-dot');
    this.prevBtn = this.wrapper.querySelector('.slider-btn.prev');
    this.nextBtn = this.wrapper.querySelector('.slider-btn.next');
    this.current = 0;
    this.total = this.slides.length;
    this.autoplay = options.autoplay !== false;
    this.interval = options.interval || 5000;
    this.timer = null;
    this.isPlaying = false;

    if (this.total > 1) this.bindEvents();
    if (this.autoplay) this.startAutoplay();
  }

  goTo(index) {
    this.current = (index + this.total) % this.total;
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const factor = isRtl ? 1 : -1;
    if (this.track) this.track.style.transform = `translateX(${factor * this.current * 100}%)`;
    this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.current));
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAutoplay() {
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
  }

  bindEvents() {
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => { this.prev(); });
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => { this.next(); });
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.goTo(i)));

    // Touch support
    let startX = 0;
    this.wrapper.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    this.wrapper.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
    });

    this.wrapper.addEventListener('mouseenter', () => this.stopAutoplay());
    this.wrapper.addEventListener('mouseleave', () => { if (this.autoplay) this.startAutoplay(); });
  }
}

// ============================================================
// ACCORDION
// ============================================================
const AccordionManager = {
  init() {
    document.querySelectorAll('.accordion-item').forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close siblings
        item.closest('.accordion, .faq-list, .accordion-list')
          ?.querySelectorAll('.accordion-item.open')
          .forEach(sibling => {
            if (sibling !== item) sibling.classList.remove('open');
          });
        item.classList.toggle('open', !isOpen);
      });
    });
  }
};

// ============================================================
// TABS
// ============================================================
const TabManager = {
  init() {
    document.querySelectorAll('.tabs').forEach(tabsEl => {
      const btns = tabsEl.querySelectorAll('.tab-btn');
      const container = tabsEl.closest('.tabs-wrapper') || tabsEl.parentElement;
      const panels = container.querySelectorAll('.tab-panel');

      btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          if (panels[i]) panels[i].classList.add('active');
        });
      });
    });
  }
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'default', duration = 4000) {
    const iconSvgs = {
      default: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="7" cy="8.5" r="2"/><circle cx="17" cy="8.5" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><path d="M12 11c-2.8 0-5 2-5 4.5 0 2 1.6 3.5 3.5 3.5.8 0 1.2-.4 1.5-.7.3.3.7.7 1.5.7 1.9 0 3.5-1.5 3.5-3.5 0-2.5-2.2-4.5-5-4.5z"/></svg>`,
      success: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      info: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      warning: `<svg class="icon icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${iconSvgs[type] || iconSvgs.default}</div>
      <div class="toast-body">
        <p style="margin:0;font-size:0.875rem;line-height:1.5;">${message}</p>
      </div>
      <button class="toast-close" aria-label="Close notification" style="background:none;border:none;cursor:pointer;color:inherit;padding:4px;display:flex;align-items:center;">
        <svg class="icon icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    this.container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => this.remove(toast));

    setTimeout(() => this.remove(toast), duration);
    return toast;
  },

  remove(toast) {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }
};

// ============================================================
// FORM VALIDATION
// ============================================================
const FormValidator = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validate(form)) {
          this.onSuccess(form);
        }
      });

      // Real-time validation
      form.querySelectorAll('[required]').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearError(field));
      });
    });
  },

  validate(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },

  validateField(field) {
    const value = field.value.trim();
    let error = '';

    if (!value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && !/^\+?[\d\s\-()]{7,}$/.test(value)) {
      error = 'Please enter a valid phone number.';
    }

    if (error) {
      this.showError(field, error);
      return false;
    } else {
      this.clearError(field);
      return true;
    }
  },

  showError(field, message) {
    field.classList.add('error');
    let errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  },

  clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('visible');
  },

  onSuccess(form) {
    const successMsg = form.dataset.successMsg || 'Your message has been sent successfully!';
    Toast.show(successMsg, 'success');
    form.reset();
  }
};

// ============================================================
// FOOTER YEAR (keeps standardized footer copyright current)
// ============================================================
const FooterYear = {
  init() {
    const year = String(new Date().getFullYear());
    document.querySelectorAll('.js-footer-year').forEach(el => {
      el.textContent = year;
    });
  }
};

// ============================================================
// BACK TO TOP
// ============================================================
const BackToTop = {
  init() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ============================================================
// FILTER CHIPS
// ============================================================
const FilterManager = {
  init() {
    document.querySelectorAll('.filter-group').forEach(group => {
      const chips = group.querySelectorAll('.chip');
      const target = document.querySelector(group.dataset.target);
      if (!target) return;

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          const filter = chip.dataset.filter;
          const items = target.querySelectorAll('[data-category]');
          items.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
              item.style.display = '';
              item.style.animation = 'fadeIn 0.4s ease';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    });
  }
};

// ============================================================
// PARALLAX
// ============================================================
const ParallaxManager = {
  init() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }
};

// ============================================================
// INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  NavbarManager.init();
  MobileMenuManager.init();
  ProfileDropdownManager.init();
  ScrollReveal.init();
  CounterManager.init();
  ProgressManager.init();
  AccordionManager.init();
  TabManager.init();
  Toast.init();
  FormValidator.init();
  BackToTop.init();
  FooterYear.init();
  FilterManager.init();
  ParallaxManager.init();

  // Theme toggle btn
  document.getElementById('themeToggle')?.addEventListener('click', () => ThemeManager.toggle());
  document.getElementById('rtlToggle')?.addEventListener('click', () => RTLManager.toggle());
});

// Export for use in page-specific scripts
window.Pawfect = { ThemeManager, RTLManager, Toast, Slider, ScrollReveal };
