<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1>Bienvenido al Sistema AR Educativo</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="teacher">Nombre del Docente:</label>
          <input
            id="teacher"
            v-model="teacherName"
            type="text"
            required
            placeholder="Ingrese su nombre completo"
          />
        </div>

        <div class="form-group">
          <label for="student">Nombre del Estudiante:</label>
          <input
            id="student"
            v-model="studentName"
            type="text"
            required
            placeholder="Ingrese nombre del estudiante"
          />
        </div>

        <button type="submit" class="start-button">
          Comenzar Experiencia AR
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    // Recuperar datos de localStorage si existen
    const savedData = JSON.parse(
      localStorage.getItem("ar-educativo-users") || "{}"
    );
    return {
      teacherName: savedData.teacher || "",
      studentName: savedData.student || "",
    };
  },
  methods: {
    ...mapMutations(["setUserData"]),

    handleSubmit() {
      if (!this.teacherName.trim() || !this.studentName.trim()) {
        alert("Por favor complete ambos campos");
        return;
      }

      // Guardar datos en Vuex y localStorage (a través de la mutación)
      this.setUserData({
        teacher: this.teacherName.trim(),
        student: this.studentName.trim(),
      });

      this.$router.push("/story");
    },
  },
};
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
}

.welcome-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s;
}

input:focus {
  border-color: #6e8efb;
  outline: none;
}

.start-button {
  width: 100%;
  padding: 12px;
  background: #4a6cf7;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.start-button:hover {
  background: #3a5bd9;
}
</style>
