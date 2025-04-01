import * as THREE from "three";
import { createLoader } from "./components/Loader";
import { createPoemPresentation } from "./components/PoemPresentation";
import { createInterface } from "./components/Interface";
import ImageSystem from "./components/ImageSystem/ImageSystem";

// 1. Configuración inicial
const urlParams = new URLSearchParams(window.location.search);
const themeParam = urlParams.get('theme');
if (themeParam) localStorage.setItem("theme", themeParam);

// 2. Crear componentes
const interfaceControls = createInterface();
const loader = createLoader();
const poemPresentation = createPoemPresentation();

// 3. Configuración de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(0, 0, 15); // Posición original de la cámara

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 4. Inicializar ImageSystem
const imageSystem = new ImageSystem(scene);

// 5. Manejo del tema
function updateSceneBackground() {
  const isDarkTheme = document.documentElement.classList.contains("dark-theme") ||
    (!document.documentElement.classList.contains("light-theme") &&
     !document.documentElement.classList.contains("dark-theme"));
  scene.background = new THREE.Color(isDarkTheme ? 0x000000 : 0xffffff);
}
updateSceneBackground();

const observer = new MutationObserver(() => updateSceneBackground());
observer.observe(document.documentElement, { attributes: true });

// 6. Secuencia de carga
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
        
        // Posición y enfoque de cámara original
        camera.position.set(0, 0, 15);
        camera.lookAt(0, 0, 0);
        
        // Forzar primer render
        renderer.render(scene, camera);
        
      } catch (error) {
        console.error("Error al inicializar imágenes:", error);
      }
    };
  } catch (error) {
    console.error("Error en secuencia de carga:", error);
  }
}, 3000); // Tiempo original de carga

// 7. Controles de navegación
function handleNavigation(direction) {
  const newIndex = imageSystem.scrollBy(direction);
  interfaceControls.updateImageCounter(newIndex + 1, imageSystem.totalImages);
}

// Teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") handleNavigation(1);
  if (e.key === "ArrowLeft") handleNavigation(-1);
});

// Rueda del mouse
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  handleNavigation(Math.sign(e.deltaY));
}, { passive: false });

// Touch (móviles)
let touchStartX = 0;
window.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const diff = touchStartX - e.touches[0].clientX;
  if (Math.abs(diff) > 50) {
    handleNavigation(Math.sign(diff));
    touchStartX = e.touches[0].clientX;
  }
}, { passive: false });

// 8. Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 9. Bucle de animación
function animate() {
  requestAnimationFrame(animate);
  
  // Actualizar scroll
  imageSystem.update();
  
  // Renderizar
  renderer.render(scene, camera);
}
animate();

// 10. Limpieza
window.addEventListener('beforeunload', () => {
  imageSystem.cleanup();
  renderer.dispose();
});