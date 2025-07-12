<script setup>
import { computed, watch, ref } from "vue";
import { useStoryStore } from "@/stores/story";
import { useRouter } from "vue-router";
import ModelRenderer from "./ModelRenderer.vue";
import AudioController from "./AudioController.vue";
import ARViewer from "./ARViewer.vue";

const storyStore = useStoryStore();
const router = useRouter();
const isLastPage = ref(false);
const showAR = ref(false); // Control para mostrar/ocultar AR
const arReady = ref(false); // Estado de preparación del AR

const currentPageData = computed(() => storyStore.currentPageData);
const progress = computed(
  () => ((storyStore.currentPage + 1) / storyStore.totalPages) * 100
);

// Verificar cuando llegamos al final del cuento
watch(
  () => storyStore.currentPage,
  (newPage) => {
    isLastPage.value = newPage === storyStore.totalPages - 1;
    if (isLastPage.value) {
      storyStore.completeStory();
    }
    // Reiniciar el modo AR al cambiar de página
    showAR.value = false;
  }
);

// Manejar el final del audio
const handleAudioEnded = () => {
  if (isLastPage.value) {
    redirectToQuiz();
  } else {
    storyStore.nextPage();
  }
};

// Redirección explícita al quiz
const redirectToQuiz = () => {
  router.push({ name: "Quiz" }).catch((err) => {
    console.log("Redirección redundante:", err);
  });
};

const handlePageChange = (direction) => {
  if (isLastPage.value) {
    redirectToQuiz();
    return;
  }

  const success =
    direction === "next" ? storyStore.nextPage() : storyStore.prevPage();

  if (!success && direction === "next") {
    redirectToQuiz();
  }
};

// Alternar entre vista normal y AR
const toggleAR = () => {
  showAR.value = !showAR.value;
};

// Manejar cuando el AR está listo
const onARReady = () => {
  arReady.value = true;
};

// Manejar errores del AR
const onARError = (message) => {
  console.error("AR Error:", message);
  showAR.value = false;
  // Puedes mostrar un mensaje al usuario si lo deseas
};
</script>

<template>
  <div class="story-viewer">
    <!-- Selector de vista AR/Normal 
    <div class="view-toggle">
      <button
        @click="toggleAR"
        :class="{ active: showAR }"
        :disabled="!arReady && showAR"
      >
        {{ showAR ? "Ver en Pantalla" : "Ver en Realidad Aumentada" }}
      </button>
    </div>-->

    <!-- Contenedor principal -->
    <div class="content-container">
      <!-- Vista AR -->
      <div v-show="showAR" class="ar-view">
        <ARViewer
          :models="currentPageData.models"
          @ready="onARReady"
          @error="onARError"
        />
      </div>

      <!-- Vista normal -->
      <div class="standard-view">
        <div class="model-view">
          <ModelRenderer
            :key="storyStore.currentPage"
            :models="currentPageData.models"
          />
        </div>

        <div class="text-container">
          <p>{{ currentPageData.text }}</p>
        </div>
      </div>
    </div>

    <!-- Controles de navegación -->
    <div class="controls">
      <button
        @click="handlePageChange('prev')"
        :disabled="storyStore.currentPage === 0"
      >
        Anterior
      </button>
      <button
        @click="handlePageChange('next')"
        :disabled="
          !isLastPage && storyStore.currentPage === storyStore.totalPages - 1
        "
      >
        {{ isLastPage ? "Ir al Quiz" : "Siguiente" }}
      </button>
    </div>

    <!-- Barra de progreso -->
    <div class="progress-bar">
      <div class="progress" :style="{ width: `${progress}%` }"></div>
    </div>

    <!-- Controlador de audio -->
    <AudioController
      :audioSrc="currentPageData.audio"
      @ended="handleAudioEnded"
    />
  </div>
</template>

<style scoped>
.story-viewer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
}

.view-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.view-toggle button {
  padding: 8px 16px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.view-toggle button:hover {
  background: #369f6b;
}

.view-toggle button.active {
  background: #ff7043;
}

.view-toggle button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.content-container {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.ar-view {
  position: absolute;
  top: 20%; /* Ajuste para dejar espacio superior */
  left: 5%;
  width: 90%; /* Ancho reducido */
  height: 60%; /* Altura reducida */
  z-index: 50; /* Z-index menor para no cubrir controles */
  background: transparent;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
}

.standard-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.model-view {
  flex: 1;
  position: relative;
  min-height: 40vh; /* Altura mínima para móviles */
}

.text-container {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  text-align: center;
  font-size: clamp(1rem, 4vw, 1.2rem); /* Tamaño de fuente responsivo */
  overflow-y: auto;
  max-height: 30vh;
}

.controls {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(240, 240, 240, 0.9);
  position: fixed; /* Cambiado a fixed para garantizar visibilidad */
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 -2px 15px rgba(0,0,0,0.2);
}

.progress-bar {
  height: 5px;
  background: #ddd;
  width: 100%;
}

.progress {
  height: 100%;
  background: #42b983;
  transition: width 0.3s ease;
}

button {
  padding: 12px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 120px;
  margin: 0 5px;
  transition: all 0.2s;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Media queries para móviles */
@media (max-width: 768px) {
  .controls {
    padding: 0.8rem;
    flex-wrap: wrap;
  }
  
  button {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    min-width: 80px;
    margin: 3px;
    flex: 1;
  }
  
  .text-container {
    padding: 0.8rem;
    font-size: 1rem;
    max-height: 25vh;
  }
  
  .model-view {
    min-height: 35vh;
  }

  .ar-view {
    top: 15%;
    height: 50%;
  }
}

@media (max-width: 480px) {
  .view-toggle button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  
  button {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    min-width: 70px;
  }
  
  .text-container {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .ar-view {
    top: 10%;
    height: 45%;
    width: 85%;
    left: 7.5%;
  }
}
</style>
