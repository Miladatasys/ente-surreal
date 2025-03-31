import * as THREE from "three";
import { createLoader } from "./components/Loader";
import { createPoemPresentation } from "./components/PoemPresentation";
import { createInterface } from "./components/Interface";
import ImageSystem from "./components/ImageSystem/ImageSystem";

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

// Initialize Image System
const imageSystem = new ImageSystem(scene);

// Set background color based on theme
function updateSceneBackground() {
  const isDarkTheme =
    document.documentElement.classList.contains("dark-theme") ||
    (!document.documentElement.classList.contains("light-theme") &&
    !document.documentElement.classList.contains("dark-theme"));
  scene.background = new THREE.Color(isDarkTheme ? 0x000000 : 0xffffff);
}
updateSceneBackground();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 15);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Theme management
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === "class") {
      updateSceneBackground();
    }
  });
});
observer.observe(document.documentElement, { attributes: true });
document.addEventListener("themechange", updateSceneBackground);

// Load sequence
loader.show();

setTimeout(async () => {
  try {
    loader.hide();
    poemPresentation.show();

    poemPresentation.onComplete = async () => {
      try {
        await imageSystem.initialize();
        interfaceControls.initImageCounter();
        interfaceControls.updateImageCounter(1, imageSystem.totalImages);
        
        // Initial camera position
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
        
      } catch (error) {
        console.error("Image system initialization failed:", error);
      }
    };
  } catch (error) {
    console.error("Loading sequence failed:", error);
  }
}, 3000);

// Navigation controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    const newIndex = imageSystem.navigate(1);
    interfaceControls.updateImageCounter(newIndex + 1, imageSystem.totalImages);
  } else if (event.key === "ArrowLeft") {
    const newIndex = imageSystem.navigate(-1);
    interfaceControls.updateImageCounter(newIndex + 1, imageSystem.totalImages);
  }
});

// Window resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  imageSystem.handleResize();
});

// Animation loop
let animationFrameId;
function animate() {
  animationFrameId = requestAnimationFrame(animate);
  
  // Smooth camera movements
  camera.position.lerpVectors(camera.position, imageSystem.cameraTarget, 0.1);
  camera.lookAt(scene.position);
  
  renderer.render(scene, camera);
}
animate();

// Cleanup
window.addEventListener('beforeunload', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  imageSystem.cleanup();
});