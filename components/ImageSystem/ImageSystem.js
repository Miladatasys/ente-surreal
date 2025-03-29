import * as THREE from 'three';

const IMAGE_BASE_PATH = '/images/';
const IMAGE_NAMES = ['01', '02', '03', '04', '05']; 
const IMAGE_EXTENSION = 'png, jpg' 

class ImageSystem {
  constructor(scene) {
    this.scene = scene;
    this.imageGroup = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();
    this.images = [];
    this.currentIndex = 0;
    this.cameraTarget = new THREE.Vector3(0, 0, 15);
    
    scene.add(this.imageGroup);
  }

  async initialize() {
    try {
      await this.loadImages();
      this.positionImages();
      this.showCurrentImage();
      return true;
    } catch (error) {
      console.error('Error initializing image system:', error);
      throw error;
    }
  }

  async loadImages() {
    const loadPromises = IMAGE_NAMES.map((name, index) => 
      this.loadImage(`${IMAGE_BASE_PATH}${name}.${IMAGE_EXTENSION}`, index)
    );
    
    await Promise.all(loadPromises);
    console.log('All images loaded successfully');
  }

  loadImage(path, index) {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        path,
        (texture) => {
          this.createImageMesh(texture, index);
          resolve();
        },
        undefined,
        (error) => {
          console.error(`Error loading image ${path}:`, error);
          reject(error);
        }
      );
    });
  }

  createImageMesh(texture, index) {
    const aspect = texture.image.width / texture.image.height;
    const geometry = new THREE.PlaneGeometry(5, 5 / aspect);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `image-${index}`;
    mesh.visible = false;
    mesh.userData.index = index;
    
    this.images.push(mesh);
    this.imageGroup.add(mesh);
  }

  positionImages(radius = 8) {
    const angleStep = (Math.PI * 2) / this.images.length;
    
    this.images.forEach((mesh, index) => {
      const angle = angleStep * index;
      mesh.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );
      mesh.rotation.y = -angle + Math.PI/2;
    });
  }

  showCurrentImage() {
    this.images.forEach((mesh, index) => {
      mesh.visible = index === this.currentIndex;
      mesh.material.opacity = index === this.currentIndex ? 1 : 0;
    });
  }

  navigate(direction) {
    const newIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
    this.transitionImages(this.currentIndex, newIndex);
    this.currentIndex = newIndex;
    
    // Update camera target
    this.cameraTarget.set(
      this.images[newIndex].position.x * 0.5,
      0,
      this.images[newIndex].position.z * 0.5
    );
    
    return newIndex;
  }

  transitionImages(oldIndex, newIndex) {
    this.animateOpacity(this.images[oldIndex].material, 1, 0, 500, () => {
      this.images[oldIndex].visible = false;
    });
    
    this.images[newIndex].visible = true;
    this.animateOpacity(this.images[newIndex].material, 0, 1, 500);
  }

  animateOpacity(material, from, to, duration, onComplete) {
    const startTime = Date.now();
    
    const update = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      material.opacity = from + (to - from) * progress;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    update();
  }

  handleResize() {
    this.images.forEach(mesh => {
      const texture = mesh.material.map;
      if (texture?.image) {
        const aspect = texture.image.width / texture.image.height;
        mesh.scale.set(1, 1 / aspect, 1);
      }
    });
  }

  cleanup() {
    this.images.forEach(mesh => {
      mesh.material.dispose();
      mesh.geometry.dispose();
      this.imageGroup.remove(mesh);
    });
    this.scene.remove(this.imageGroup);
  }

  get totalImages() {
    return this.images.length;
  }
}

export default ImageSystem;