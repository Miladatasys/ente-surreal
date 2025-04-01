import * as THREE from 'three';

class ImageSystem {
  constructor(scene) {
    this.scene = scene;
    this.images = [];
    this.textures = [];
    this.meshes = [];
    this.currentPage = 0;
    this.totalImages = 0;

    this.horizontalScale = 0.015;
    this.verticalScale = 0.014;
    this.spacing = 1.2;

    this.container = new THREE.Group();
    this.scene.add(this.container);
    this.targetX = 0;
    this.scrollSpeed = 0.1;
    this.transitionProgress = 0;
    this.isTransitioning = false;
  }

  async initialize(imagePaths = ['images/01.png', 'images/02.png', 'images/03.png']) {
    try {
      this.images = imagePaths;
      this.totalImages = this.images.length;

      const textureLoader = new THREE.TextureLoader();
      this.textures = await Promise.all(
        this.images.map(img => textureLoader.loadAsync(img))
      );

      this.textures.forEach(texture => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
      });

      this.createImageMeshesWithOriginalSizes();
      this.updateVisibility();

    } catch (error) {
      console.error('Error initializing ImageSystem:', error);
      throw error;
    }
  }

  isVerticalImage(texture) {
    return texture.image.height > texture.image.width;
  }

  createImageMeshesWithOriginalSizes() {
    if (!this.textures.length) return;

    this.textures.forEach((texture, index) => {
      let width, height;

      if (this.isVerticalImage(texture)) {
        width = texture.image.width * this.verticalScale;
        height = texture.image.height * this.verticalScale;
      } else {
        width = this.textures[0].image.width * this.horizontalScale;
        height = this.textures[0].image.height * this.horizontalScale;
      }

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
      });

      const geometry = new THREE.PlaneGeometry(width, height);
      const mesh = new THREE.Mesh(geometry, material);

      const prevMesh = this.meshes[index - 1];
      const prevWidth = prevMesh ? prevMesh.geometry.parameters.width : 0;
      const prevPosition = prevMesh ? prevMesh.position.x + prevWidth / 2 : 0;

      mesh.position.x = prevPosition + width / 2 + (index > 0 ? this.spacing : 0);

      // Position the third image to the left by moving it back by twice its width
      if (index === 2) {
        mesh.position.x -= width * 2;
      }

      this.container.add(mesh);
      this.meshes.push(mesh);
    });

    this.centerContainer();
  }

  updateVisibility() {
    this.meshes.forEach((mesh, index) => {
      if (this.currentPage === 0) {
        mesh.visible = (index === 0) || (index === 1);
      } else {
        mesh.visible = (index === 2);
      }
    });
  }

  centerContainer() {
    if (this.meshes.length < 2) return;

    if (this.currentPage === 0) {
      const centerX = (this.meshes[0].position.x + this.meshes[1].position.x) / 2;
      this.targetX = -centerX;
    } else {
      this.targetX = -this.meshes[2].position.x;
    }
  }

  scrollToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex > 1) return;

    if (this.isTransitioning) return;

    this.isTransitioning = true;
    this.transitionProgress = 0;
    this.targetPage = pageIndex;
  }

  scrollBy(direction) {
    const newPage = (this.currentPage + direction + 2) % 2;
    this.scrollToPage(newPage);
    return newPage;
  }

  update() {
    if (this.isTransitioning) {
      this.transitionProgress += 0.005;
      if (this.transitionProgress >= 1) {
        this.isTransitioning = false;
        this.currentPage = this.targetPage;
        this.updateVisibility();
        this.centerContainer();
        this.meshes.forEach(mesh => mesh.material.opacity = 1);
      } else {
        this.meshes.forEach(mesh => {
          if (this.currentPage === 0) {
            mesh.material.opacity = 1 - this.transitionProgress;
          } else {
            mesh.material.opacity = this.transitionProgress;
          }
        });
      }
    } else {
      this.container.position.x += (this.targetX - this.container.position.x) * this.scrollSpeed;
    }
  }

  cleanup() {
    this.meshes.forEach(mesh => {
      mesh.geometry.dispose();
      mesh.material.dispose();
      this.container.remove(mesh);
    });
    this.textures.forEach(texture => texture.dispose());
    this.scene.remove(this.container);
  }
}

export default ImageSystem;