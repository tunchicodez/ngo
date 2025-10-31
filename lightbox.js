(function(){
  // Minimal Lightbox Implementation
  function createLightbox() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none;
      align-items: center; justify-content: center; z-index: 1000; padding: 24px;
    `;

    const container = document.createElement('div');
    container.style.cssText = 'max-width: 90vw; max-height: 90vh; text-align: center;';

    const img = document.createElement('img');
    img.alt = '';
    img.style.cssText = 'max-width: 100%; max-height: 80vh; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5)';

    const caption = document.createElement('div');
    caption.className = 'lightbox-caption';
    caption.style.cssText = 'color: #fff; margin-top: 12px; font-size: 14px; opacity: 0.9;';

    const closeBtn = document.createElement('button');
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute; top: 12px; right: 16px; font-size: 32px; color: #fff;
      background: transparent; border: 0; cursor: pointer; line-height: 1;
    `;

    container.appendChild(img);
    container.appendChild(caption);
    overlay.appendChild(container);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);

    function open(src, text) {
      img.src = src;
      caption.textContent = text || '';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      img.src = '';
      caption.textContent = '';
    }

    overlay.addEventListener('click', (e) => {
      // Close if clicking outside the image/container
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    return { open, close };
  }

  function setupGallery(lightbox) {
    const images = document.querySelectorAll('.gallery-item img');
    images.forEach((img) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightbox.open(img.src, img.alt || '');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const lb = createLightbox();
    setupGallery(lb);
  });
})();
