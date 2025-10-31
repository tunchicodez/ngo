/**
 * HTML Include System
 * Dynamically loads and includes HTML fragments into elements with data-include attribute
 * Supports nested includes and caching for performance
 */
class HTMLIncludeSystem {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Loads HTML content from a file with caching
   * @param {string} file - The file path to load
   * @returns {Promise<string>} Promise resolving to the HTML content
   */
  async loadHTML(file) {
    // Return cached content if available
    if (this.cache.has(file)) {
      return this.cache.get(file);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(file)) {
      return this.loadingPromises.get(file);
    }

    // Create new loading promise
    const loadPromise = fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        // Cache the loaded content
        this.cache.set(file, data);
        return data;
      })
      .catch(error => {
        console.error(`Error loading include file "${file}":`, error);
        throw error;
      })
      .finally(() => {
        // Remove from loading promises after completion
        this.loadingPromises.delete(file);
      });

    this.loadingPromises.set(file, loadPromise);
    return loadPromise;
  }

  /**
   * Processes all elements with data-include attribute
   * @param {Document|Element} root - Root element to search for includes (defaults to document)
   */
  async processIncludes(root = document) {
    const elements = root.querySelectorAll('[data-include]');

    if (elements.length === 0) {
      return;
    }

    const includePromises = Array.from(elements).map(async (el) => {
      const file = el.getAttribute('data-include');

      if (!file) {
        console.warn('data-include attribute is empty on element:', el);
        return;
      }

      try {
        const data = await this.loadHTML(file);
        el.innerHTML = data;
        el.removeAttribute('data-include');

        // Process nested includes recursively
        await this.processIncludes(el);
      } catch (error) {
        // Handle error gracefully - keep the element but add error indication
        el.innerHTML = `<div class="include-error" style="color: red; padding: 10px; border: 1px solid red;">Error loading ${file}: ${error.message}</div>`;
        el.removeAttribute('data-include');
      }
    });

    // Wait for all includes to complete
    await Promise.all(includePromises);
  }

  /**
   * Clears the cache (useful for development or dynamic content updates)
   */
  clearCache() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * Gets cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      cachedFiles: this.cache.size,
      activeLoads: this.loadingPromises.size
    };
  }
}

// Create global instance
const htmlIncludeSystem = new HTMLIncludeSystem();

// Legacy function for backward compatibility
function includeHTML() {
  htmlIncludeSystem.processIncludes();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  htmlIncludeSystem.processIncludes();
});