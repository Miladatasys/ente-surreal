import * as THREE from 'three';
import { createLoader } from './components/Loader';
import { createPoemPresentation } from './components/PoemPresentation';
import { createInterface } from '/components/Interface';

// Audio control functions (placeholder)
let audioPlaying = false;
const toggleAudio = () => {
  audioPlaying = !audioPlaying;
  console.log('Audio toggled:', audioPlaying ? 'ON' : 'OFF');
};

// Create interface first
const interfaceControls = createInterface(toggleAudio, audioPlaying);

// Create loader
const loader = createLoader();

// Create poem presentation
const poemPresentation = createPoemPresentation();

// Three.js setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// Add renderer after interface
document.body.appendChild(renderer.domElement);

// Show loader
loader.show();

// Simulate loading
setTimeout(() => {
  loader.hide();
  poemPresentation.show();
}, 3000);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();