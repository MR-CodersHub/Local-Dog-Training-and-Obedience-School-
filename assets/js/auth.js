/**
 * PAWFECT ACADEMY — Authentication interactions (login + signup only)
 * Frontend-only: field validation, password visibility, demo toasts,
 * success redirects. Reuses global Toast + .error/.form-error styles.
 */
(function () {
  'use strict';

  var EYE_OPEN = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_CLOSED = '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

  function toast(msg, type) {
    if (window.Pawfect && window.Pawfect.Toast) {
      window.Pawfect.Toast.show(msg, type || 'default');
    }
  }

  // ---------- Password visibility toggles ----------
  document.querySelectorAll('[data-password-toggle]').forEach(function (btn) {
    var input = document.getElementById(btn.getAttribute('data-password-toggle'));
    if (!input) return;
    btn.addEventListener('click', function () {
      var visible = input.type === 'text';
      input.type = visible ? 'password' : 'text';
      btn.innerHTML = visible ? EYE_OPEN : EYE_CLOSED;
      btn.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
      btn.setAttribute('aria-pressed', String(!visible));
      input.focus({ preventScroll: true });
    });
  });

  // ---------- Inline field validation (same visuals as global forms) ----------
  function showError(field, message) {
    field.classList.add('error');
    var errorEl = field.parentElement.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      field.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }

  function clearError(field) {
    field.classList.remove('error');
    var errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('visible');
  }

  function validateField(field) {
    var value = field.value.trim();
    var error = '';
    if (!value) {
      error = 'This field is required.';
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (field.type === 'tel' && !/^\+?[\d\s\-()]{7,}$/.test(value)) {
      error = 'Please enter a valid phone number.';
    } else if (field.dataset.minlength && value.length < parseInt(field.dataset.minlength, 10)) {
      error = 'Password must be at least ' + field.dataset.minlength + ' characters.';
    }
    if (error) {
      showError(field, error);
      return false;
    }
    clearError(field);
    return true;
  }

  document.querySelectorAll('form[data-auth-form] [required]').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () { clearError(field); });
  });

  function validateForm(form) {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      // Checkboxes (e.g. Terms) are handled explicitly by each form's
      // submit handler so the message stays specific.
      if (field.type === 'checkbox') return;
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  // ---------- Login ----------
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(loginForm)) {
        toast('Please review the highlighted fields.', 'error');
        return;
      }
      toast('Login successful! Redirecting to your dashboard...', 'success');
      setTimeout(function () { window.location.href = './dashboard.html'; }, 2200);
    });
  }

  // ---------- Signup ----------
  var signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(signupForm)) {
        toast('Please review the highlighted fields.', 'error');
        return;
      }
      var pwd = document.getElementById('signupPassword');
      var confirm = document.getElementById('signupConfirm');
      if (pwd && confirm && pwd.value !== confirm.value) {
        showError(confirm, 'Passwords do not match.');
        confirm.focus();
        toast('Passwords do not match.', 'error');
        return;
      }
      var terms = document.getElementById('termsCheck');
      if (terms && !terms.checked) {
        toast('Please accept the Terms & Conditions and Privacy Policy.', 'error');
        terms.focus();
        return;
      }
      toast('Welcome to Pawfect Academy! Setting up your dashboard...', 'success');
      setTimeout(function () { window.location.href = './dashboard.html'; }, 2200);
    });
  }

  // ---------- Forgot password (frontend-only, no recovery flow exists) ----------
  document.getElementById('forgotPassword')?.addEventListener('click', function () {
    toast('Password resets are handled by our team — email hello@pawfectacademy.com and we will help you within 24 hours.', 'info');
  });
})();
