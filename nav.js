// nav.js - improved robustness, ARIA handling, and keyboard accessibility
document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-menu-toggle') || document.querySelector('.mobile-toggle');
  const mobilePanel = document.getElementById('mobile-menu-panel') || document.querySelector('.mobile-menu-panel');
  const desktopLinks = document.querySelector('.desktop-links');

  // If neither mobile toggle nor desktop links exist, nothing to do
  if (!mobileToggle && !desktopLinks) return;

  // Prepare ARIA attributes if button exists
  if (mobileToggle) {
    // Ensure the toggle is a button for accessibility
    if (mobileToggle.tagName.toLowerCase() !== 'button') {
      mobileToggle.setAttribute('role', 'button');
      mobileToggle.tabIndex = 0;
    }

    // Attach aria-controls to the button if panel is present and has an id
    if (mobilePanel) {
      if (!mobilePanel.id) mobilePanel.id = 'mobile-menu-panel';
      mobileToggle.setAttribute('aria-controls', mobilePanel.id);
    }

    // Set initial aria-expanded state
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  // Toggle function that safely toggles the panel and updates ARIA and classes
  const toggleMobileMenu = (open) => {
    const willOpen = typeof open === 'boolean' ? open : !(mobilePanel && mobilePanel.classList.contains('is-open'));
    if (mobilePanel) {
      if (willOpen) {
        mobilePanel.classList.add('is-open');
        mobileToggle && mobileToggle.setAttribute('aria-expanded', 'true');
        // Optionally move focus into the menu
        const firstFocusable = mobilePanel.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
      } else {
        mobilePanel.classList.remove('is-open');
        mobileToggle && mobileToggle.setAttribute('aria-expanded', 'false');
        // Return focus to the toggle for accessibility
        if (mobileToggle) mobileToggle.focus();
      }
    } else {
      // If no panel, toggle a 'is-open' class on the body or desktopLinks as fallback
      document.body.classList.toggle('nav-fallback-open', willOpen);
      mobileToggle && mobileToggle.setAttribute('aria-expanded', String(willOpen));
    }
  };

  // Click handler
  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });

    // Keyboard support for the toggle (Space or Enter)
    mobileToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
      // Escape can close the menu (if open)
      if (e.key === 'Escape') {
        toggleMobileMenu(false);
      }
    });
  }

  // Close the mobile menu when clicking outside (for safety)
  document.addEventListener('click', (e) => {
    if (!mobilePanel || !mobilePanel.classList.contains('is-open')) return;
    const target = e.target;
    if (mobilePanel.contains(target)) return;
    if (mobileToggle && (mobileToggle.contains(target) || mobileToggle === target)) return;
    // otherwise close
    toggleMobileMenu(false);
  });

  // Close with Escape key globally
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (mobilePanel && mobilePanel.classList.contains('is-open'))) {
      toggleMobileMenu(false);
    }
  });

  // Ensure desktop links are visible on wider screens (no-op if CSS handles it)
  // This is a defensive fallback in case CSS or other scripts hide them unexpectedly.
  const restoreDesktopLinks = () => {
    if (!desktopLinks) return;
    desktopLinks.style.display = '';
    // allow CSS to control final display via media queries
  };

  // Run restore once, then on resize (debounced)
  restoreDesktopLinks();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(restoreDesktopLinks, 150);
  });

  // If nav links are generated via includes, re-run when includes finish (if includes exposes an event)
  // (No assumption made here; this is a harmless guard.)
});