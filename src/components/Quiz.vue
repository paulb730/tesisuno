<script setup>
import { ref, onMounted } from "vue";
import { useStoryStore } from "@/stores/story";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import { useStore } from 'vuex';

const storyStore = useStoryStore();
const store = useStore();
const router = useRouter();

// Estado reactivo para las preguntas
const questions = ref([
  {
    id: 1,
    text: "¿El cerdito pequeño tuvo que pedir ayuda porque su casa no resistió al lobo?",
    type: "yesno",
    answer: null,
    correctAnswer: "Sí",
  },
  {
    id: 2,
    text: "¿El lobo intentó entrar por la ventana porque no pudo derribar la casa de ladrillos?",
    type: "yesno",
    answer: null,
    correctAnswer: "No",
  },
  {
    id: 3,
    text: "¿Cuál casa era la más fuerte y por qué?",
    type: "audio",
    answer: null,
  },
]);

const currentQuestion = ref(0);
const isRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const audioUrl = ref(null);

// Función para seleccionar respuesta Sí/No
const selectAnswer = (answer) => {
  questions.value[currentQuestion.value].answer = answer;
};

// Grabación de audio
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.value.push(e.data);
      }
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });
      audioUrl.value = URL.createObjectURL(audioBlob);
      questions.value[currentQuestion.value].answer = audioBlob;
    };

    mediaRecorder.value.start(100); // Grabar en chunks de 100ms
    isRecording.value = true;
  } catch (error) {
    console.error("Error al acceder al micrófono:", error);
    alert("Por favor permite el acceso al micrófono para grabar tu respuesta.");
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    // Detener todas las pistas del stream
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  }
};

// Navegación entre preguntas
const nextQuestion = () => {
  if (currentQuestion.value < questions.value.length - 1) {
    currentQuestion.value++;
    audioUrl.value = null; // Resetear audio para la nueva pregunta
  } else {
    saveResults();
    router.push("/interactive-story");
  }
};

const prevQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--;
    audioUrl.value = null;
  }
};

// Guardar resultados
const saveResults = async () => {
  try {
    const XLSX = await import("xlsx");

    // 1. Preparar datos para el Excel principal
    const excelData = [
      ["Docente", store.state.teacherName, "Estudiante", store.state.studentName],
      ["Fecha", new Date().toLocaleDateString()],
      [],
      ["Pregunta", "Respuesta", "Tipo", "Correcta"],
      ...questions.value.map((q) => [
        q.text,
        q.type === "audio" ? "Audio grabado" : q.answer || "Sin responder",
        q.type,
        q.type === "yesno"
          ? q.answer === q.correctAnswer
            ? "✅"
            : q.answer
            ? "❌"
            : "Sin responder"
          : "N/A",
      ]),
    ];

    // 2. Generar y guardar el Excel principal
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Respuestas");

    const fileName = `Resultados_${store.state.teacherName}_${
      store.state.studentName
    }_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    // 3. Guardar audio si existe (solo si es tipo Blob)
    const audioQuestion = questions.value.find(
      (q) => q.type === "audio" && q.answer instanceof Blob
    );
    if (audioQuestion?.answer) {
      await store.dispatch("saveAudioRecording", audioQuestion.answer);
    }

    // 4. Actualizar el store sin generar otro Excel
    // Modificamos para que no llame a exportToExcel automáticamente
    const session = {
      activity: "Quiz",
      questions: questions.value.map((q) => ({
        text: q.text,
        type: q.type,
        answered: q.answer ? true : false,
        correct: q.type === "yesno" ? q.answer === q.correctAnswer : null,
      })),
      excelGenerated: true // Añadimos flag para indicar que ya se generó el Excel
    };
    
    // Guardamos en el state sin disparar la exportación
    store.commit('addSessionData', session);

    alert("¡Tus respuestas se han guardado correctamente!");
  } catch (error) {
    console.error("Error al guardar resultados:", error);
    alert("Hubo un problema al guardar los resultados.");
  }
};

const siguienteActidad = () => {
  router.push("/interactive-story");
};
</script>

<template>
  <div class="quiz-container">
    <h1>Quiz de Comprensión Lectora</h1>

    <div class="question-container">
      <div class="progress-indicator">
        Pregunta {{ currentQuestion + 1 }} de {{ questions.length }}
      </div>

      <h2>{{ questions[currentQuestion].text }}</h2>

      <div
        v-if="questions[currentQuestion].type === 'yesno'"
        class="yesno-options"
      >
        <button
          @click="selectAnswer('Sí')"
          :class="{ selected: questions[currentQuestion].answer === 'Sí' }"
        >
          Sí
        </button>
        <button
          @click="selectAnswer('No')"
          :class="{ selected: questions[currentQuestion].answer === 'No' }"
        >
          No
        </button>
      </div>

      <div v-else class="audio-option">
        <button
          @click="isRecording ? stopRecording() : startRecording()"
          :class="{ recording: isRecording }"
        >
          {{ isRecording ? "🛑 Detener grabación" : "🎤 Grabar respuesta" }}
        </button>
        <audio v-if="audioUrl" controls :src="audioUrl"></audio>
        <p
          v-if="questions[currentQuestion].answer && !isRecording"
          class="audio-saved"
        >
          ✔ Audio guardado
        </p>
      </div>
    </div>

    <div class="navigation-buttons">
      <button @click="prevQuestion" :disabled="currentQuestion === 0">
        ← Anterior
      </button>
      <button
        @click="nextQuestion"
        :class="{
          disabled:
            questions[currentQuestion].type === 'yesno' &&
            !questions[currentQuestion].answer,
        }"
      >
        {{
          currentQuestion === questions.length - 1 ? "Finalizar" : "Siguiente →"
        }}
      </button>
    </div>

    <button @click="siguienteActidad" class="restart-button">
      Siguiente Actividad
    </button>
  </div>
</template>

<style scoped>
/* Estilos mejorados */
.quiz-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Arial", sans-serif;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.question-container {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.progress-indicator {
  text-align: right;
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

h2 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 1.3rem;
  line-height: 1.5;
}

.yesno-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.yesno-options button {
  padding: 0.8rem 2rem;
  font-size: 1rem;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.yesno-options button.selected {
  background: #42b983;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.yesno-options button:hover:not(.selected) {
  background: #f0f0f0;
}

.audio-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
}

.audio-option button {
  padding: 0.8rem 2rem;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.audio-option button.recording {
  background: #44ff44;
  animation: pulse 1.5s infinite;
}

.audio-saved {
  color: #42b983;
  font-weight: bold;
  margin-top: 0.5rem;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.navigation-buttons button {
  padding: 0.8rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.navigation-buttons button:hover:not(:disabled) {
  background: #369f6b;
}

.navigation-buttons button:disabled,
.navigation-buttons button.disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.restart-button {
  display: block;
  margin: 2rem auto 0;
  padding: 0.8rem 1.5rem;
  background: #666;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.restart-button:hover {
  background: #555;
}

audio {
  width: 100%;
  max-width: 400px;
  margin-top: 1rem;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
