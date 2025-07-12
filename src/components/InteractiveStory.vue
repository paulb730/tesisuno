<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from 'vuex';
import { useStoryStore } from "@/stores/story";

const router = useRouter();
const storyStore = useStoryStore();
const currentScene = ref(0);
const selectedOptions = ref({});
const isRecording = ref(false);
const audioUrl = ref(null);
const store = useStore();

// Escenas del cuento interactivo
const scenes = [
  {
    id: 0,
    type: "fixed",
    text: "Había una vez tres cerditos que vivían en el bosque. Eran hermanos, pero cada uno tenía su forma de ser. El cerdito mayor era trabajador y responsable. Los otros dos solo querían jugar y tocar instrumentos. Un día, el hermano mayor les dijo: ¡Pronto llegará el invierno! Necesitamos construir nuestras casas para estar seguros y calentitos. Los tres cerditos aceptaron y fueron a construir sus casas.",
    audio: "/audios ai/intro_interactive.mp3",
  },
  {
    id: 1,
    type: "interactive",
    question: "¿Con qué material el cerdito menor debería construir su casa?",
    options: [
      {
        text: "De paja",
        result: "El lobo la sopla y la derriba fácilmente",
        nextScene: 2,
      },
      {
        text: "De cajas de cartón",
        result:
          "La construye rápido, pero cuando llueve el cartón se debilita. El lobo sopla y la destruye",
        nextScene: 2,
      },
      {
        text: "De caramelos",
        result:
          "El lobo se la come y queda con dolor de barriga. El cerdito aprovecha para escapar corriendo.",
        nextScene: 2,
      },
    ],
  },
  {
    id: 2,
    type: "fixed",
    text: "El cerdito pequeño llega a casa del mediano. El lobo los persigue.",
    audio: "/audios ai/intermediate_scene.mp3",
  },
  {
    id: 3,
    type: "interactive",
    question: "¿Con qué material el cerdito mediano debería construir su casa?",
    options: [
      {
        text: "De madera",
        result:
          "Resiste un poco, pero el lobo sopla y la derriba al segundo intento. Ambos cerditos huyen",
        nextScene: 4,
      },
      {
        text: "De globos",
        result:
          "La casa flota, los cerditos suben al cielo y ven al lobo desde las nubes. ¡Pero luego se pinchan y caen, comienzan a correr!",
        nextScene: 4,
      },
      {
        text: "De barro seco moldeado con sus patas",
        result:
          "La casa se endurece, pero se agrieta con los golpes del lobo. Luego sopla y la destruye. Ambos cerditos huyen.",
        nextScene: 4,
      },
    ],
  },
  {
    id: 4,
    type: "interactive",
    question: "¿Cómo te gustaría que acabe la historia?",
    options: [
      {
        text: "Los cerditos huyen a la casa del hermano mayor (casa de ladrillos)",
        result:
          "El lobo sopla, sopla y sopla, no puede derribarla y decide subir por la chimenea. La historia termina según el cuento original",
        nextScene: 5,
      },
      {
        text: "Escapan a una cueva en la montaña",
        result:
          "Los cerditos bloquean la entrada con muchas piedras. El lobo sopla y sopla, golpea, pero no puede entrar y se va",
        nextScene: 5,
      },
      {
        text: "A una casa de nubes flotantes",
        result:
          "Los cerditos se elevan en el cielo. El lobo salta y salta y no puede alcanzarlos, se enoja y se va. Los cerditos celebran tocando música en las nubes",
        nextScene: 5,
      },
    ],
  },
  {
    id: 5,
    type: "fixed",
    text: "¡Colorín colorado, este cuento ha terminado!",
    audio: "/audios ai/final_interactive.mp3",
  },
];

// Manejar selección de opciones
const selectOption = (sceneId, optionIndex) => {
  selectedOptions.value[sceneId] = optionIndex;
  currentScene.value =
    scenes[currentScene.value].options[optionIndex].nextScene;
};

let mediaRecorder;
let audioStream;
let audioBlob = null;

// Grabación de audio para el resumen
const startRecording = async () => {
  try {
    audioBlob = null; // Resetear el blob anterior
    audioUrl.value = null;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStream = stream;
    mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      audioUrl.value = URL.createObjectURL(audioBlob);
      // Guardar automáticamente al terminar la grabación
      saveResults();
    };

    mediaRecorder.start();
    isRecording.value = true;

    // Detener después de 2 minutos como máximo
    setTimeout(() => {
      if (isRecording.value) {
        stopRecording();
      }
    }, 120000);
  } catch (error) {
    console.error("Error al grabar:", error);
    alert("No se pudo acceder al micrófono. Por favor permite el acceso.");
  }
};

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }
    isRecording.value = false;
  }
};

const restartStory = () => {
  // 1. Reiniciar el estado del cuento
  storyStore.resetStory();
  
  // 2. Reiniciar variables locales del componente
  currentScene.value = 0;
  selectedOptions.value = {};
  audioUrl.value = null;
  
  // 3. Conservar solo el docente (opcional)
  const teacherName = store.state.teacherName;
  store.commit('resetStoryData'); // Método que definimos antes
  
  // 4. Redirigir a la pantalla de inicio
  router.push('/');
};

const saveResults = async () => {
  try {
    const XLSX = await import("xlsx");

    // Preparar datos para Excel
    const excelData = [
      ["Docente", store.state.teacherName, "Estudiante", store.state.studentName],
      ["Fecha", new Date().toLocaleDateString()],
      [],
      ["Escena", "Pregunta", "Opción seleccionada"]
    ];

    // Agregar cada escena con su opción seleccionada
    Object.keys(selectedOptions.value).forEach((sceneId) => {
      const scene = scenes.find(s => s.id === parseInt(sceneId));
      if (scene) {
        excelData.push([
          `Escena ${scene.id}`,
          scene.question,
          scene.options[selectedOptions.value[sceneId]].text
        ]);
      }
    });

    // Generar Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Opciones del cuento");

    // Nombre del archivo: Cuento_Docente_Estudiante_Fecha.xlsx
    const fileName = `Cuento_${store.state.teacherName}_${
      store.state.studentName
    }_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    // Guardar audio si existe
    if (audioBlob) {
      await store.dispatch("saveAudioRecording", audioBlob);
    }

    // Guardar en el historial de sesiones
    await store.dispatch("saveSessionData", {
      activity: "Cuento interactivo",
      scenes: Object.keys(selectedOptions.value).map(sceneId => {
        const scene = scenes.find(s => s.id === parseInt(sceneId));
        return {
          sceneId: sceneId,
          question: scene.question,
          selectedOption: scene.options[selectedOptions.value[sceneId]].text
        };
      }),
      hasAudio: audioBlob !== null
    });

    alert("¡Tu cuento y grabación se han guardado correctamente!");
  } catch (error) {
    console.error("Error al guardar resultados:", error);
    alert("Hubo un problema al guardar los resultados.");
  }
};
</script>

<template>
  <div class="interactive-story">
    <!-- Encabezado común -->
    <header class="story-header">
      <h1>Cuento Interactivo</h1>
      <div class="progress-indicator" v-if="currentScene < scenes.length">
        Escena {{ currentScene + 1 }} de {{ scenes.length }}
      </div>
    </header>

    <!-- Escena actual -->
    <div v-if="currentScene < scenes.length" class="scene-container">
      <!-- Escenas fijas -->
      <div v-if="scenes[currentScene].type === 'fixed'" class="fixed-scene">
        <div class="story-text">{{ scenes[currentScene].text }}</div>
        
        <audio
          v-if="scenes[currentScene].audio"
          :src="scenes[currentScene].audio"
          autoplay
          controls
          class="story-audio"
        ></audio>
        
        <div class="action-buttons">
          <button @click="currentScene++" class="next-button">
            Continuar →
          </button>
        </div>
      </div>

      <!-- Escenas interactivas -->
      <div v-else class="interactive-scene">
        <h3 class="scene-question">{{ scenes[currentScene].question }}</h3>
        
        <div class="options">
          <button
            v-for="(option, index) in scenes[currentScene].options"
            :key="index"
            @click="selectOption(scenes[currentScene].id, index)"
            class="option-button"
            :class="{ selected: selectedOptions[scenes[currentScene].id] === index }"
          >
            {{ option.text }}
          </button>
        </div>
        
        <div
          v-if="selectedOptions[scenes[currentScene].id] !== undefined"
          class="option-result"
        >
          {{
            scenes[currentScene].options[
              selectedOptions[scenes[currentScene].id]
            ].result
          }}
        </div>
      </div>
    </div>

    <!-- Pantalla final para grabar resumen -->
    <div v-else class="recap-screen">
      <div class="recap-content">
        <h2>¡Buen trabajo, {{ store.state.studentName }}!</h2>
        <p class="recap-instructions">Ahora cuenta tu versión del cuento</p>
        
        <div class="selected-scenes">
          <h3>Tus decisiones en el cuento:</h3>
          <div
            v-for="(sceneId, index) in Object.keys(selectedOptions)"
            :key="index"
            class="scene-card"
          >
            <h4>Decisión {{ parseInt(index) + 1 }}</h4>
            <p class="scene-question">{{ scenes[sceneId].question }}</p>
            <p class="selected-option">
              {{ scenes[sceneId].options[selectedOptions[sceneId]].text }}
            </p>
          </div>
        </div>

        <div class="recording-section">
          <div class="recording-controls">
            <button
              @click="isRecording ? stopRecording() : startRecording()"
              :class="{ recording: isRecording }"
              class="record-button"
            >
              {{ isRecording ? "🛑 Detener grabación" : "🎤 Grabar mi cuento" }}
            </button>
            <div class="recording-status">
              <span v-if="isRecording" class="recording-indicator">● Grabando...</span>
              <span v-else-if="audioUrl" class="recording-success">✔ Audio listo</span>
            </div>
            <audio v-if="audioUrl" controls :src="audioUrl" class="audio-player"></audio>
          </div>
          
          <p class="recording-hint" v-if="!isRecording && !audioUrl">
            Presiona el botón para grabar tu versión del cuento (máximo 2 minutos)
          </p>
        </div>

        <div class="final-actions">
          <!--<button @click="saveResults" class="save-button" :disabled="!audioUrl">
            Guardar mi cuento
          </button>-->
          <button @click="restartStory" class="restart-button">
            Volver a jugar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interactive-story {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: "Arial", sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Encabezado */
.story-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.story-header h1 {
  font-size: clamp(1.5rem, 5vw, 2rem);
  margin-bottom: 0.5rem;
}

.progress-indicator {
  font-size: 0.9rem;
  color: #666;
}

/* Contenedor de escenas */
.scene-container {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

/* Escenas fijas */
.story-text {
  font-size: clamp(1rem, 4vw, 1.1rem);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  text-align: left;
}

.story-audio {
  width: 100%;
  margin: 1rem 0;
}

.next-button {
  padding: 0.8rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  width: 100%;
  max-width: 200px;
}

/* Escenas interactivas */
.interactive-scene {
  text-align: center;
}

.scene-question {
  font-size: clamp(1.1rem, 4.5vw, 1.3rem);
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.option-button {
  padding: 0.9rem;
  background: white;
  border: 2px solid #42b983;
  color: #42b983;
  border-radius: 5px;
  font-size: clamp(0.9rem, 4vw, 1rem);
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.option-button:hover, .option-button.selected {
  background: #42b983;
  color: white;
}

.option-result {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #e8f5e9;
  border-left: 4px solid #42b983;
  font-style: italic;
  font-size: clamp(0.9rem, 4vw, 1rem);
}

/* Pantalla final */
.recap-screen {
  text-align: center;
  padding: 1rem;
}

.recap-content {
  max-width: 800px;
  margin: 0 auto;
}

.recap-instructions {
  font-size: clamp(1rem, 4vw, 1.2rem);
  margin-bottom: 1.5rem;
}

.selected-scenes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.scene-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.selected-option {
  font-weight: bold;
  color: #42b983;
  font-size: clamp(0.9rem, 4vw, 1rem);
}

/* Grabación de audio */
.recording-section {
  margin: 2rem 0;
}

.record-button {
  padding: 1rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: clamp(0.9rem, 4vw, 1rem);
  cursor: pointer;
  margin: 1rem auto;
  width: 100%;
  max-width: 300px;
  display: block;
  transition: all 0.2s;
}

.record-button.recording {
  background: #ff6b6b;
}

.recording-status {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.recording-indicator {
  color: #ff4444;
  font-weight: bold;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.recording-success {
  color: #42b983;
}

.recording-hint {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.audio-player {
  width: 100%;
  max-width: 400px;
  margin: 1rem auto;
  display: block;
}

/* Botones finales */
.final-actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.restart-button {
  padding: 0.8rem 1.5rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  max-width: 200px;
}

/* Media Queries para ajustes específicos */
@media (max-width: 600px) {
  .scene-container {
    padding: 1rem;
  }
  
  .options {
    gap: 0.6rem;
  }
  
  .option-button {
    padding: 0.8rem;
  }
  
  .selected-scenes {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 400px) {
  .interactive-story {
    padding: 0.5rem;
  }
  
  .next-button, .restart-button {
    padding: 0.7rem;
    font-size: 0.9rem;
  }
}
</style>
