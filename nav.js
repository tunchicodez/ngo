document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    mobileMenuButton.setAttribute('aria-expanded', String(!isExpanded));
    mobileMenu.setAttribute('aria-hidden', String(isExpanded));
    mobileMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (event) => {
    const isClickInside = mobileMenu.contains(event.target) || mobileMenuButton.contains(event.target);
    const isVisible = !mobileMenu.classList.contains('hidden');
    if (!isClickInside && isVisible) {
      mobileMenu.classList.add('hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  });

  mobileMenu.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    });
  });
});
