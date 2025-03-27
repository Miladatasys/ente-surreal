import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function loadBookModel(scene, camera, renderer) {
  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.load(
      'static/models/cameraBook.glb',
      (gltf) => {
        const model = gltf.scene;
        const animations = gltf.animations;
        let mixer = null;

        // Set up animation mixer if animations exist
        if (animations && animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const clip = animations[0]; // Use the first animation clip
          const action = mixer.clipAction(clip);
          action.setLoop(THREE.LoopOnce); // Play once
          action.clampWhenFinished = true; // Maintain final state
        }

        // Calculate bounding box and center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Scale model to fit within a standard size while maintaining aspect ratio
        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 2 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Recalculate bounding box after scaling
        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        const scaledSize = scaledBox.getSize(new THREE.Vector3());

        // Center the model precisely
        model.position.set(
          -scaledCenter.x, 
          -scaledCenter.y, 
          -scaledCenter.z
        );

        // Set correct orientation to face the viewer vertically
        model.rotation.set(
          -Math.PI / 2,  // Rotate 90 degrees around X-axis to stand vertically
          0,             // No rotation around Y-axis
          0              // No rotation around Z-axis
        );

        // Material and shadow configuration
        model.traverse((child) => {
          if (child.isMesh) {
            const material = child.material.clone();
            material.metalness = 0.1;
            material.roughness = 0.8;
            child.material = material;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(3, 5, 2);
        directionalLight.castShadow = true;

        scene.add(model, ambientLight, directionalLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.04;

        resolve({
          model,
          controls,
          mixer,
        });
      },
      (progress) => {
        console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(1)}%`);
      },
      (error) => reject(error)
    );
  });
}

// Animation control function remains the same
export function playBookAnimation(mixer, speed = 1) {
  if (!mixer) return;

  mixer.timeScale = speed;
  const actions = mixer._actions;
  if (actions.length > 0) {
    actions[0].reset().play();
  }
}