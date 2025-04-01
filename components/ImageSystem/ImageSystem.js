import * as THREE from 'three';

class ImageSystem {
  constructor(scene) {
    this.scene = scene;
    this.images = [];
    this.textures = [];
    this.meshes = [];
    this.currentIndex = 0;
    this.totalImages = 0;
    
    // Configuración de visualización
    this.horizontalScale = 0.015; // Escala para imágenes horizontales
    this.verticalScale = 0.014;   // Escala diferente para verticales
    this.spacing = 1.2;
    
    // Contenedor para el scroll
    this.container = new THREE.Group();
    this.scene.add(this.container);
    this.targetX = 0;
    this.scrollSpeed = 0.1;
  }

  async initialize(imagePaths = ['images/01.png', 'images/02.png', 'images/03.png']) {
    try {
      this.images = imagePaths;
      this.totalImages = this.images.length;
      
      // Cargar todas las texturas
      const textureLoader = new THREE.TextureLoader();
      this.textures = await Promise.all(
        this.images.map(img => textureLoader.loadAsync(img))
      );
      
      // Configurar texturas
      this.textures.forEach(texture => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
      });
      
      // Crear mallas de imágenes con tamaños específicos
      this.createImageMeshesWithOriginalSizes();
      
      // Mostrar solo las 2 primeras inicialmente
      this.updateVisibility();
      
    } catch (error) {
      console.error('Error inicializando ImageSystem:', error);
      throw error;
    }
  }

  isVerticalImage(texture) {
    return texture.image.height > texture.image.width;
  }

  createImageMeshesWithOriginalSizes() {
    if (!this.textures.length) return;
    
    // Crear todas las imágenes con sus tamaños específicos
    this.textures.forEach((texture, index) => {
      let width, height;
      
      if (this.isVerticalImage(texture)) {
        // Imagen vertical - mantener tamaño original
        width = texture.image.width * this.verticalScale;
        height = texture.image.height * this.verticalScale;
      } else {
        // Imagen horizontal - tamaño uniforme
        width = this.textures[0].image.width * this.horizontalScale;
        height = this.textures[0].image.height * this.horizontalScale;
      }
      
      const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: false,
        side: THREE.DoubleSide
      });
      
      const geometry = new THREE.PlaneGeometry(width, height);
      const mesh = new THREE.Mesh(geometry, material);
      
      // Posicionar horizontalmente
      const prevMesh = this.meshes[index - 1];
      const prevWidth = prevMesh ? prevMesh.geometry.parameters.width : 0;
      const prevPosition = prevMesh ? prevMesh.position.x + prevWidth/2 : 0;
      
      mesh.position.x = prevPosition + width/2 + (index > 0 ? this.spacing : 0);
      mesh.visible = index < 2; // Solo visibles las 2 primeras
      
      this.container.add(mesh);
      this.meshes.push(mesh);
    });
    
    // Centrar el contenedor para mostrar las 2 primeras
    this.centerContainer();
  }

  updateVisibility() {
    this.meshes.forEach((mesh, index) => {
      // Mostrar actual + siguiente (máximo 2 visibles)
      mesh.visible = (index === this.currentIndex) || 
                    (index === this.currentIndex + 1);
    });
  }

  centerContainer() {
    if (this.meshes.length < 2) return;
    
    // Calcular centro entre las dos primeras imágenes
    const centerX = (this.meshes[0].position.x + this.meshes[1].position.x) / 2;
    this.container.position.x = -centerX;
    this.targetX = this.container.position.x;
  }

  scrollTo(index) {
    if (index < 0 || index >= this.totalImages) return;
    
    this.currentIndex = index;
    
    // Calcular posición objetivo para centrar la imagen actual
    const currentImg = this.meshes[index];
    const nextImg = this.meshes[index + 1];
    
    if (currentImg && nextImg) {
      // Centrar entre la actual y la siguiente
      this.targetX = -(currentImg.position.x + nextImg.position.x) / 2;
    } else if (currentImg) {
      // Última imagen - centrarla
      this.targetX = -currentImg.position.x;
    }
    
    // Actualizar visibilidad
    this.updateVisibility();
  }

  scrollBy(direction) {
    const newIndex = (this.currentIndex + direction + this.totalImages) % this.totalImages;
    this.scrollTo(newIndex);
    return newIndex;
  }

  update() {
    // Movimiento suave del scroll
    this.container.position.x += (this.targetX - this.container.position.x) * this.scrollSpeed;
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