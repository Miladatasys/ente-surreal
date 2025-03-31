import * as THREE from 'three';

class ImageSystem {
    constructor(scene) {
        this.scene = scene;
        this.images = [];
        this.textures = [];
        this.mesh = null;
        this.currentIndex = 0;
        this.cameraTarget = new THREE.Vector3();
        this.totalImages = 0;
        this.imagePlane = null;
    }

    async initialize() {
        try {
            this.images = [
                'images/01.png',
            ];

            this.totalImages = this.images.length;

            const textureLoader = new THREE.TextureLoader();
            const texturePromises = this.images.map(image => textureLoader.loadAsync(image));
            this.textures = await Promise.all(texturePromises);

            this.textures.forEach(texture => {
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.anisotropy = 16;
            });

            const material = new THREE.MeshBasicMaterial({
                map: this.textures[0],
                transparent: false,
                color: 0xffffff,
            });
            const geometry = new THREE.PlaneGeometry(1, 1);
            this.mesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.mesh);
            this.imagePlane = this.mesh;

            this.adjustPlaneSize(0);
            this.updateCameraTarget(0);
            this.fadeInImage();
        } catch (error) {
            console.error('Error inicializando imágenes:', error);
        }
    }

    adjustPlaneSize(index) {
        if (this.textures[index] && this.textures[index].image) {
            const image = this.textures[index].image;
            const originalWidth = image.width;
            const originalHeight = image.height;

            const scaleFactor = 0.015; 

            const planeWidth = originalWidth * scaleFactor;
            const planeHeight = originalHeight * scaleFactor;

            this.mesh.geometry.dispose();
            this.mesh.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        }
    }

    navigate(direction) {
        if (this.textures.length === 0) return this.currentIndex;

        this.currentIndex = (this.currentIndex + direction + this.textures.length) % this.textures.length;
        this.mesh.material.map = this.textures[this.currentIndex];
        this.mesh.material.needsUpdate = true;
        this.adjustPlaneSize(this.currentIndex);
        this.updateCameraTarget(this.currentIndex);
        return this.currentIndex;
    }

    updateCameraTarget(index) {
        if (this.mesh) {
            this.cameraTarget.copy(this.mesh.position);
            this.cameraTarget.z = 10; 
        }
    }

    handleResize() {}

    cleanup() {
        this.textures.forEach(texture => texture.dispose());
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
            this.scene.remove(this.mesh);
        }
        this.textures = [];
        this.mesh = null;
        this.imagePlane = null;
    }

    fadeInImage() {
        if (!this.imagePlane) return;

        let opacity = 0;
        const interval = setInterval(() => {
            opacity += 0.02;
            this.imagePlane.material.opacity = opacity;
            if (opacity >= 1) {
                clearInterval(interval);
            }
        }, 20);
    }
}

export default ImageSystem;