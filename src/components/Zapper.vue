<script>
import * as ZapparThree from "@zappar/zappar-threejs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { nextTick } from "vue";

export default {
  name: "ARViewer",
  props: {
    models: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await nextTick(); // Espera a que el DOM esté listo (Vue 3)
    this.initAR();
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeUnmount() {
    // Cambiado de beforeDestroy a beforeUnmount (Vue 3)
    this.cleanup();
    window.removeEventListener("resize", this.onWindowResize);
  },
  methods: {
    async initAR() {
      try {
        if (ZapparThree.browserIncompatible())
          throw new Error("Navegador no compatible");

        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.$refs.container.appendChild(this.renderer.domElement);

        const gl = this.renderer.getContext();

        this.pipeline = new ZapparThree.Pipeline();
        this.pipeline.glContextSet(gl);

        this.camera = new ZapparThree.Camera(this.pipeline);
        this.threeCamera = this.camera.threeCamera;

        // Solicitar permisos ANTES de arrancar cámara
        const granted = await ZapparThree.permissionRequestUI();
        if (!granted) throw new Error("Permisos denegados");

        await this.camera.start();

        // Crear escena y asignar textura de fondo
        this.scene = new THREE.Scene();
        if (this.camera.backgroundTexture) {
          this.scene.background = this.camera.backgroundTexture;
          this.camera.backgroundTexture.needsUpdate = true;
          console.log("Textura de fondo asignada correctamente");
        } else {
          console.warn("No se encontró backgroundTexture en la cámara");
        }

        await this.loadModels();

        this.animate();

        this.loading = false;
      } catch (err) {
        console.error("Error en AR:", err);
        this.error = err.message;
        this.loading = false;
      }
    },
    /*async loadModels() {
      try {
        console.log("Iniciando carga del marcador...");

        const loader = new ZapparThree.ImageTrackerLoader(this.pipeline);
        let tracker;
        try {
          tracker = await loader.load("public/markers/marker.patt");
          console.log("Tracker loaded:", {
            target: tracker.target,
            anchors: tracker.anchors,
          });
        } catch (error) {
          console.error("Error cargando marcador:", error);
          throw error;
        }

        const anchorGroup = new ZapparThree.ImageAnchorGroup(
          this.camera,
          tracker
        );
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 1, 0);
        this.scene.add(light);
        this.scene.add(anchorGroup);

        const gltfLoader = new GLTFLoader();
        this.models.forEach((model) => {
          gltfLoader.load(model.path, (gltf) => {
            const model3D = gltf.scene;
            model3D.position.set(...model.pos);
            model3D.scale.set(model.scale, model.scale, model.scale);
            anchorGroup.add(model3D);
            console.log(`Modelo ${model.path} cargado`);
          });
        });
      } catch (err) {
        console.error("Error en loadModels:", err);
        throw err;
      }
    },*/
    async loadModels() {
      try {
        console.log("Iniciando carga del marcador...");

        // Crea un LoadingManager de Zappar
        const manager = new ZapparThree.LoadingManager();
manager.onError = (url) => console.error("Error manager:", url);
        // Pasa el manager al loader
        const trackerLoader = new ZapparThree.ImageTrackerLoader(
          this.pipeline,
          manager
        );

        // Usa await para cargar el marcador
        const tracker = await trackerLoader.load("/markers/marker.patt");
        console.log("✅ Marcador cargado exitosamente");

        const anchorGroup = new ZapparThree.ImageAnchorGroup(
          this.camera,
          tracker
        );
        this.scene.add(anchorGroup);

        const gltfLoader = new GLTFLoader(manager);
        this.models.forEach((model) => {
          gltfLoader.load(
            model.path,
            (gltf) => {
              const model3D = gltf.scene;
              model3D.position.set(...model.pos);
              model3D.scale.set(model.scale, model.scale, model.scale);
              anchorGroup.add(model3D);
              console.log(`Modelo ${model.path} cargado`);
            },
            undefined,
            (err) => console.error(`Error cargando ${model.path}:`, err)
          );
        });
        
      } catch (err) {
        console.error("Error en loadModels:", err);
        throw err;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.pipeline.frameUpdate();
      this.camera.updateFrame(this.renderer);

      if (
        this.camera.backgroundTexture &&
        this.camera.backgroundTexture.image
      ) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    onWindowResize() {
      if (!this.renderer) return;

      const cameraToUpdate = this.camera.threeCamera || this.camera;

      if (cameraToUpdate && cameraToUpdate.updateProjectionMatrix) {
        cameraToUpdate.aspect = window.innerWidth / window.innerHeight;
        cameraToUpdate.updateProjectionMatrix();
      }

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    cleanup() {
      this.camera?.destroy();
      this.renderer?.dispose();
      ZapparThree.glContextLost();
    },
  },
};
</script>

<template>
  <div class="ar-viewer">
    <div ref="container" class="ar-container" @resize="onWindowResize"></div>
    <div v-if="loading" class="loading-overlay">
      Cargando realidad aumentada...
    </div>
    <div v-if="error" class="error-overlay">
      {{ error }}
      <button @click="initAR">Reintentar</button>
    </div>
  </div>
</template>

<style scoped>
.ar-viewer {
  position: relative;
  width: 100%;
  height: 100%;
}

.ar-container {
  width: 100%;
  height: 100%;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 100;
}

.error-overlay button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
