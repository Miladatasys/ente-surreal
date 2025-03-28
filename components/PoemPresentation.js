import "../styles/poem-presentation.scss"
import { getPoemByTitle } from "../lib/poetry-data"
import * as THREE from "three"

export function createPoemPresentation(poemTitle = "Laberintos Personales") {  
  const selectedPoem = getPoemByTitle(poemTitle)
  if (!selectedPoem) {
    console.error(`Poem with title "${poemTitle}" not found`)
    return null
  }

  const poemContainer = document.createElement("div")
  poemContainer.classList.add("poem-container")

  poemContainer.innerHTML = `
    <div class="poem">
        <h2>${selectedPoem.title}</h2>
        <p>${selectedPoem.content.split("\n").join("<br>")}</p>
        <p class="author">${selectedPoem.author}</p>
        <p class="exit-hint">~ Click to drift away ~</p>
    </div>
    `
  document.body.appendChild(poemContainer)
  // Variable para almacenar la función de callback cuando se completa
  let onCompleteCallback = null
  // Soft, poetic exit effect
  function softPoemExit() {
    // Determinar el color de las partículas según el tema
    const isDarkTheme =
      document.documentElement.classList.contains("dark-theme") ||
      !document.documentElement.classList.contains("light-theme")
    const particleColor = isDarkTheme ? 0xffffff : 0x000000
    // Create a dissolving effect with Three.js particles
    const particleCount = 100
    const particles = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 10
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10
      particleSizes[i] = Math.random() * 0.5
    }
    particles.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
    particles.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1))
    const particleMaterial = new THREE.PointsMaterial({
      color: particleColor,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
    })
    const particleSystem = new THREE.Points(particles, particleMaterial)
    // Animate particle dispersion
    function animateDissolve() {
      const positions = particleSystem.geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.2
        positions[i + 1] += (Math.random() - 0.5) * 0.2
        positions[i + 2] += (Math.random() - 0.5) * 0.2
      }
      particleSystem.geometry.attributes.position.needsUpdate = true
      particleMaterial.opacity -= 0.02
      if (particleMaterial.opacity > 0) {
        requestAnimationFrame(animateDissolve)
      } else {
        poemContainer.remove()
        // Llamar al callback si existe
        if (typeof onCompleteCallback === "function") {
          onCompleteCallback()
        }
      }
    }
    // Add particle system to scene if available
    const existingScene = document.querySelector("canvas") ? window.scene : null
    if (existingScene) {
      existingScene.add(particleSystem)
      animateDissolve()
    } else {
      // Fallback to simple fade if no Three.js scene
      poemContainer.classList.add("fade-out")
      setTimeout(() => {
        poemContainer.remove()
        // Llamar al callback si existe
        if (typeof onCompleteCallback === "function") {
          onCompleteCallback()
        }
      }, 500)
    }
  }
  // Add click event to remove poem
  poemContainer.addEventListener("click", softPoemExit)
  return {
    show() {
      poemContainer.classList.add("visible")
    },
    // Propiedad para establecer el callback
    set onComplete(callback) {
      onCompleteCallback = callback
    },
  }
}