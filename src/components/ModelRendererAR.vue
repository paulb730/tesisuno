<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'

const props = defineProps({
  models: {
    type: Array,
    required: true,
    default: () => []
  }
})

const errorMessage = ref('')
const isSupported = ref(false)
const scene = new THREE.Scene()
let renderer, camera, controller

const checkARSupport = () => {
  if (!navigator.xr) {
    errorMessage.value = 'WebXR no está soportado en tu navegador. Usa Chrome o Edge en Android/iOS.'
    return false
  }
  return true
}

const initAR = async () => {
  try {
    if (!checkARSupport()) return
    
    // Configurar renderizador
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    document.body.appendChild(renderer.domElement)

    // Crear botón AR con manejo de errores
    try {
      const arButton = ARButton.createButton(renderer, { 
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body }
      })
      document.body.appendChild(arButton)
    } catch (err) {
      errorMessage.value = 'No se pudo iniciar la experiencia AR: ' + err.message
      return
    }

    // Configurar cámara
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)
    
    // Iluminación
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    scene.add(light)

    // Cargar modelos
    const loader = new GLTFLoader()
    props.models.forEach(modelData => {
      loader.load(modelData.path, (gltf) => {
        const model = gltf.scene
        model.position.set(...modelData.pos)
        model.scale.set(modelData.scale, modelData.scale, modelData.scale)
        scene.add(model)
      }, undefined, (err) => {
        console.error('Error loading model:', err)
        errorMessage.value = 'Error cargando modelos 3D'
      })
    })

    // Iniciar sesión AR
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    isSupported.value = true
  } catch (err) {
    console.error('AR initialization error:', err)
    errorMessage.value = 'Error inicializando realidad aumentada: ' + err.message
  }
}

onMounted(() => {
  initAR()
  window.addEventListener('resize', () => {
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  })
})

onBeforeUnmount(() => {
  if (renderer) {
    renderer.setAnimationLoop(null)
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
  window.removeEventListener('resize')
})
</script>

<template>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
    <p>Requisitos:
      <br>- Chrome, Edge o Safari (iOS 15+)
      <br>- Dispositivo móvil o navegador con soporte WebXR
      <br>- Conexión HTTPS en producción
    </p>
  </div>
  
  <div v-else-if="!isSupported" class="loading-message">
    Cargando experiencia de realidad aumentada...
  </div>
</template>

<style scoped>
.error-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 80%;
  text-align: center;
  z-index: 1000;
}

.loading-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
}
</style>