<template>
  <div
    ref="container"
    id="ar-container"
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
    "
  ></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREEx from "@ar-js-org/ar.js/three.js/build/ar-threex";

export default {
  props: {
    models: {
      // Asegúrate de recibir los modelos como prop
      type: Array,
      default: () => [
        // Ejemplo de estructura por defecto
        { path: "/models/model1.glb", pos: [0, 0, 0], scale: 1 },
      ],
    },
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      arToolkitContext: null,
      arToolkitSource: null,
      markerRoot: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.initAR();
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    async initAR() {
      try {
        // 1. Verificar compatibilidad
        if (!this.checkARCompatibility()) {
          throw new Error("Navegador no compatible con AR");
        }

        // 2. Inicializar escena Three.js
        this.scene = new THREE.Scene();
        this.setupRenderer();

        // 3. Configurar AR Toolkit
        await this.setupARToolkit();

        // 4. Inicializar cámara (método mejorado)
        await this.initCameraStream();

        // 5. Configurar marcador
        this.setupMarker();

        // 6. Cargar modelos
        await this.loadModels();

        // 7. Iniciar animación
        this.startAR();

        this.loading = false;
      } catch (err) {
        console.error("Error en initAR:", err);
        this.handleInitError(err);
      }
    },
    async initCameraStream() {
      try {
        // 1. Obtener stream de video
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        // 2. Crear elemento video
        this.videoElement = document.createElement("video");
        this.videoElement.srcObject = this.videoStream;
        this.videoElement.playsInline = true;
        this.videoElement.autoplay = true;
        this.videoElement.style.position = "fixed";
        this.videoElement.style.top = "0";
        this.videoElement.style.left = "0";
        this.videoElement.style.width = "100%";
        this.videoElement.style.height = "100%";
        this.videoElement.style.objectFit = "cover";
        this.videoElement.style.zIndex = "-1";
        document.body.appendChild(this.videoElement);

        // 3. Esperar a que el video esté listo
        await new Promise((resolve) => {
          this.videoElement.onloadedmetadata = () => {
            this.videoElement.play();
            resolve();
          };
        });

        // 4. Configurar AR Toolkit Source
        this.arToolkitSource = new THREEx.ArToolkitSource({
          sourceType: "video",
          sourceElement: this.videoElement,
          displayWidth: this.videoElement.videoWidth,
          displayHeight: this.videoElement.videoHeight,
        });

        // 5. Configurar textura de fondo
        this.videoTexture = new THREE.VideoTexture(this.videoElement);
        this.scene.background = this.videoTexture;
      } catch (err) {
        console.error("Error al iniciar cámara:", err);
        throw err;
      }
    },
    checkARCompatibility() {
      return (
        navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia &&
        (window.WebGLRenderingContext || window.WebGL2RenderingContext)
      );
    },
    setupRenderer() {
      // Configuración optimizada del renderizador
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false, // Importante: debe ser false para ver el fondo
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      });

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = "0";
      this.renderer.domElement.style.left = "0";
      this.$refs.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.scene.add(this.camera);
    },

    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },

    setupMobileSpecifics(isMobile) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.body.style.overflow = "hidden";
        this.$refs.container.style.position = "fixed";
        this.$refs.container.style.zIndex = "1000";
      }
    },

    setupThreeJSRenderer(isMobile) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance",
        preserveDrawingBuffer: true, // Necesario para capturas
      });

      const pixelRatio = isMobile ? Math.min(1.5, window.devicePixelRatio) : 1;

      this.renderer.setPixelRatio(pixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.domElement.style.position = "absolute";
      this.renderer.domElement.style.top = "0";
      this.renderer.domElement.style.left = "0";
      this.$refs.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      this.scene.add(this.camera);
    },

    async setupARToolkit() {
      this.arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: "/data/camera_para.dat",
        detectionMode: "mono",
        maxDetectionRate: 60,
        canvasWidth: window.innerWidth,
        canvasHeight: window.innerHeight,
        debug: false,
      });

      await new Promise((resolve, reject) => {
        this.arToolkitContext.init((err) => {
          if (err) reject(err);
          this.camera.projectionMatrix.copy(
            this.arToolkitContext.getProjectionMatrix()
          );
          resolve();
        });
      });
    },

    async setupCameraSource() {
      try {
        // 1. Solicitar stream directamente
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        // 2. Crear elemento de video manualmente para Brave
        const video = document.createElement("video");
        video.srcObject = stream;
        video.playsInline = true;
        video.autoplay = true;
        video.style.display = "none";
        document.body.appendChild(video);

        // 3. Esperar a que el video esté listo
        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play();
            resolve();
          };
        });

        // 4. Configurar AR Toolkit con el video
        this.arToolkitSource = new THREEx.ArToolkitSource({
          sourceType: "video",
          sourceElement: video, // Usamos el elemento directamente
          displayWidth: video.videoWidth,
          displayHeight: video.videoHeight,
        });

        // 5. Inicialización manual
        this.arToolkitSource.ready = true;
        this.arToolkitSource.domElement = video;

        // 6. Ajustar tamaño
        this.onResize();
      } catch (err) {
        console.error("Error en setupCameraSource:", err);
        this.handleCameraError(err);
        throw err;
      }
    },

    setupMarker() {
      this.markerRoot = new THREE.Group();
      this.scene.add(this.markerRoot);

      this.markerControls = new THREEx.ArMarkerControls(
        this.arToolkitContext,
        this.markerRoot,
        {
          type: "pattern",
          patternUrl: "/data/pattern-marker.patt",
          changeMatrixMode: "cameraTransformMatrix", // Importante!
        }
      );

      // Añadir luz básica
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(0, 1, 0);
      this.scene.add(directionalLight);
    },

    startAnimation() {
      this.animationFrameId = requestAnimationFrame(this.animate);
      this.frameCount = 0;
    },

    handleInitError(err) {
      this.error = `Error al iniciar AR: ${err.message}`;
      this.loading = false;

      // Mostrar UI de error
      if (err.name === "NotAllowedError") {
        this.error += "<br>Por favor permite el acceso a la cámara";
      } else if (err.message.includes("pattern")) {
        this.error += "<br>Error al cargar el marcador AR";
      }
    },
    setupCameraFallback() {
      const video = document.createElement("video");
      video.autoplay = true;
      video.playsInline = true;

      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          document.body.appendChild(video);

          // Crear textura desde el video
          const videoTexture = new THREE.VideoTexture(video);
          this.scene.background = videoTexture;
        })
        .catch((err) => {
          console.error("Fallback failed:", err);
        });
    },
    async loadModels() {
      try {
        const loader = new GLTFLoader();

        // Configuración específica para móvil
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const baseScale = isMobile ? 0.05 : 0.1;

        // 1. Añade un cubo de prueba (para verificar visualización básica)
        const testCube = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.3, 0.3),
          new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        testCube.position.set(0, 0, -1); // Frente al marcador
        this.markerRoot.add(testCube);
        console.log("🟦 Cubo de prueba añadido");

        // 2. Cargar modelos GLB en paralelo
        await Promise.all(
          this.models.map(
            (model) =>
              new Promise((resolve, reject) => {
                loader.load(
                  model.path,
                  (gltf) => {
                    const model3D = gltf.scene;

                    // Ajustes para móvil
                    model3D.position.set(0, isMobile ? -0.2 : 0, -0.5);
                    model3D.scale.setScalar(baseScale * (model.scale || 1));

                    // Optimización para móviles
                    model3D.traverse((child) => {
                      if (child.isMesh) {
                        child.material.roughness = 1; // Reduce reflejos
                        if (isMobile) {
                          child.geometry.computeVertexNormals();
                        }
                      }
                    });

                    model3D.position.set(...(model.pos || [0, 0, 0]));
                    const scale = model.scale ?? 0.5;
                    model3D.scale.set(scale, scale, scale);

                    // Opcional: ajustar rotación si se necesita
                    if (model.rotateY) {
                      model3D.rotation.y = model.rotateY;
                    }

                    this.markerRoot.add(model3D);
                    console.log("✅ Modelo cargado:", model.path);
                    resolve();
                  },
                  undefined,
                  (error) => {
                    console.error(
                      "❌ Error cargando modelo:",
                      model.path,
                      error
                    );
                    reject(error);
                  }
                );
              })
          )
        );
      } catch (err) {
        console.error("Error en loadModels:", err);
        throw err;
      }
    },
    animate() {
      requestAnimationFrame(this.animate);

      if (this.arToolkitSource?.ready && this.videoElement?.readyState === 4) {
        try {
          // Actualizar textura de fondo
          this.videoTexture.needsUpdate = true;

          // Actualizar AR Toolkit
          this.arToolkitContext.update(this.videoElement);

          // Renderizar escena
          this.renderer.render(this.scene, this.camera);
        } catch (err) {
          console.warn("Error en renderizado:", err);
        }
      }
    },

    onResize() {
      this.arToolkitSource.onResizeElement();
      this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
      if (this.arToolkitContext && this.camera) {
        this.arToolkitContext.update(this.arToolkitSource.domElement);
        this.camera.updateProjectionMatrix(); // ✅ Ya no lanza error
      }
    },
    cleanup() {
      // Detener stream de video
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop());
      }

      // Remover elementos del DOM
      if (this.videoElement) {
        document.body.removeChild(this.videoElement);
      }

      // Limpiar Three.js
      if (this.renderer) {
        this.renderer.dispose();
      }

      cancelAnimationFrame(this.animationFrameId);
    },
  },
};
</script>
