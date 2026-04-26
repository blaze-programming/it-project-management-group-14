/* public/javascripts/app.js — Client-side enhancements */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ── Auto-dismiss alerts after 5 seconds ─────────────────────────────────────
  document.querySelectorAll('.alert:not(.alert-danger)').forEach((el) => {
    setTimeout(() => {
      el.classList.add('fade');
      setTimeout(() => el.remove(), 500);
    }, 5000);
  });

  // ── Confirm delete forms ─────────────────────────────────────────────────────
  document.querySelectorAll('form[action*="/delete"]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      if (!window.confirm('Are you sure you want to delete this record? This cannot be undone.')) {
        e.preventDefault();
      }
    });
  });

  // ── Highlight active nav link ─────────────────────────────────────────────────
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href !== '/' && currentPath.startsWith(href)) {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });

  // ── Invoice print shortcut ────────────────────────────────────────────────────
  if (document.querySelector('.invoice-card')) {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    });
  }

  // ── Form validation feedback ──────────────────────────────────────────────────
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', () => {
      form.querySelectorAll('[required]').forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
        } else {
          input.classList.remove('is-invalid');
        }
      });
    });

    form.querySelectorAll('[required]').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      });
    });
  });
});
