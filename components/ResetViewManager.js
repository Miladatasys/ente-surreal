export function createResetViewManager() {
  // Full reset function
  function resetView() {
    // Dispatch event for components to clean up
    document.dispatchEvent(new CustomEvent('beforeresetview'));
    
    // Clear Three.js scene if it exists
    if (window.scene && window.renderer) {
      // Dispose of all scene children
      while(window.scene.children.length > 0) { 
        const child = window.scene.children[0];
        if (child.dispose) child.dispose();
        window.scene.remove(child); 
      }
      
      // Dispose renderer
      window.renderer.dispose();
    }
    
    // Remove all dynamically added elements
    const elementsToRemove = document.querySelectorAll(
      '.border-line, .interface, .page-counter, .poem-container, .loader-container, .modal'
    );
    elementsToRemove.forEach(el => el.remove());
    
    // Clear any existing animation frames
    if (window.animationFrameId) {
      cancelAnimationFrame(window.animationFrameId);
    }
    
    // Reload the page with preserved theme
    const theme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    window.location.href = `/?theme=${theme}`;
  }

  return {
    resetView
  };
}

// Initialize immediately
const resetViewManager = createResetViewManager();
export default resetViewManager;