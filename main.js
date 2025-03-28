import * as THREE from "three";
import { createLoader } from "./components/Loader";
import { createPoemPresentation } from "./components/PoemPresentation";
import { createInterface } from "/components/Interface";
import resetViewManager from "./components/ResetViewManager";

// Initialize with theme from URL if present
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');
if (themeParam) {
  localStorage.setItem("theme", themeParam);
}

// Create interface
const interfaceControls = createInterface();

// Create loader
const loader = createLoader();

// Create poem presentation
const poemPresentation = createPoemPresentation();

// Three.js setup
const scene = new THREE.Scene();
window.scene = scene;

// Set background color based on theme
function updateSceneBackground() {
  const isDarkTheme =
    document.documentElement.classList.contains("dark-theme") ||
    (!document.documentElement.classList.contains("light-theme") &&
    !document.documentElement.classList.contains("dark-theme"));
  scene.background = new THREE.Color(isDarkTheme ? 0x000000 : 0xffffff);
}
updateSceneBackground();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
window.renderer = renderer;

// Add renderer after interface
document.body.appendChild(renderer.domElement);

// Observe document class changes for theme changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      updateSceneBackground();
    }
  });
});

observer.observe(document.documentElement, { attributes: true });

// Listen for theme change event
document.addEventListener("themechange", updateSceneBackground);

// Show loader
loader.show();

// Simulate loading
setTimeout(() => {
  loader.hide();

  // Show poem
  poemPresentation.show();

  // When poem completes, initialize image counter
  poemPresentation.onComplete = () => {
    interfaceControls.initImageCounter();
    loadImages();
  };
}, 3000);

// Image handling
let currentImageIndex = 0;
const totalImages = 5; // Example with 5 images

function loadImages() {
  // First image load
  setTimeout(() => {
    currentImageIndex = 1;
    interfaceControls.updateImageCounter(currentImageIndex, totalImages);
    console.log(`Showing image ${currentImageIndex} of ${totalImages}`);
  }, 1000);

  // Keyboard navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" && currentImageIndex < totalImages) {
      currentImageIndex++;
      interfaceControls.updateImageCounter(currentImageIndex, totalImages);
      console.log(`Showing image ${currentImageIndex} of ${totalImages}`);
    } else if (event.key === "ArrowLeft" && currentImageIndex > 1) {
      currentImageIndex--;
      interfaceControls.updateImageCounter(currentImageIndex, totalImages);
      console.log(`Showing image ${currentImageIndex} of ${totalImages}`);
    }
  });
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
let animationFrameId;
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Cleanup on reset
window.addEventListener('beforeunload', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});