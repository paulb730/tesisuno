<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as TWEEN from '@tweenjs/tween.js'

const props = defineProps({
  models: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Escena Three.js
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const loader = new GLTFLoader()
const modelInstances = ref([])
const animationId = ref(null)

// Configuración inicial
const initScene = () => {
  camera.position.set(0, 1, 5)
  scene.background = null
  
  // Luces
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(0, 10, 5)
  scene.add(directionalLight)
}

// Cargar modelos
const loadModels = async () => {
  // Limpiar modelos anteriores
  modelInstances.value.forEach(model => {
    scene.remove(model)
    model.traverse(child => {
      if (child.isMesh) {
        child.geometry?.dispose()
        child.material?.dispose()
      }
    })
  })
  modelInstances.value = []
  
  // Cargar nuevos modelos
  if (props.models?.length) {
    console.log('Cargando modelos:', props.models) // Debug
    
    const loadingPromises = props.models.map(modelData => 
      new Promise(resolve => {
        loader.load(
          modelData.path,
          gltf => {
            console.log('Modelo cargado:', modelData.path) // Debug
            const model = gltf.scene
            model.position.set(...modelData.pos)
            model.scale.set(modelData.scale, modelData.scale, modelData.scale)
            scene.add(model)
            modelInstances.value.push(model)
            resolve(model)
          },
          undefined,
          error => {
            console.error('Error cargando modelo:', modelData.path, error)
            resolve(null)
          }
        )
      })
    )
    
    await Promise.all(loadingPromises)
  }
}

// Bucle de animación
const animate = () => {
  animationId.value = requestAnimationFrame(animate)
  TWEEN.update()
  renderer.render(scene, camera)
}

// Lifecycle hooks
onMounted(() => {
  const canvas = document.getElementById('model-container')
  if (canvas) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    canvas.appendChild(renderer.domElement)
    initScene()
    animate()
    loadModels()
  }
})

onBeforeUnmount(() => {
  if (animationId.value) cancelAnimationFrame(animationId.value)
  
  // Limpieza de modelos
  modelInstances.value.forEach(model => {
    scene.remove(model)
    model.traverse(child => {
      if (child.isMesh) {
        child.geometry?.dispose()
        child.material?.dispose()
      }
    })
  })
  
  if (renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
  renderer.dispose()
})

// Observador de cambios en los modelos
watch(() => props.models, loadModels, { deep: true })

// Manejo de redimensionamiento
const handleResize = () => {
  const canvas = document.getElementById('model-container')
  if (canvas) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  }
}

window.addEventListener('resize', handleResize)
</script>

<template>
  <div id="model-container" class="model-view"></div>
</template>

<style scoped>
.model-view {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>