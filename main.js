import * as THREE from 'three';
import { createLoader } from './components/Loader';
import { createPoemPresentation } from './components/PoemPresentation';

// Create loader
const loader = createLoader();

// Create poem presentation
const poemPresentation = createPoemPresentation();

// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Set background to black

// Set up camera
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Show Loader
loader.show();

// Simulates loading (removes this in real app)
setTimeout(() => {
    loader.hide();
    poemPresentation.show();
},  3000);

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Render loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();