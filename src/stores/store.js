import { createStore } from 'vuex';

export default createStore({
  state: {
    teacherName: '',
    studentName: '',
    sessionData: []
  },
  mutations: {
    setUserData(state, { teacher, student }) {
      state.teacherName = teacher;
      state.studentName = student;
      // Guardar también en localStorage para persistencia
      localStorage.setItem('ar-educativo-users', JSON.stringify({ teacher, student }));
    },
    addSessionData(state, data) {
      const session = {
        ...data,
        timestamp: new Date().toISOString(),
        teacher: state.teacherName,
        student: state.studentName
      };
      state.sessionData.push(session);
      return session; // Retornamos la sesión para poder usarla
    }
  },
  actions: {
    /*async saveSessionData({ commit, state }, data) {
      const session = commit('addSessionData', data);
      await this.dispatch('exportToExcel');
      return session; // Retornamos la sesión guardada
    },*/
    async saveSessionData({ commit, state }, data) {
      // Solo commit sin exportar a Excel
      const session = commit('addSessionData', data);
      return session;
    },
    async exportToExcel({ state }) {
      const XLSX = await import('xlsx');
      const worksheet = XLSX.utils.json_to_sheet(state.sessionData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sesiones");

      // Nombre de archivo con formato: AR-Educativo_Docente_Estudiante_Fecha.xlsx
      const fileName = `AR-Educativo_${state.teacherName}_${state.studentName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    },
    async saveAudioRecording({ state }, blob) {
      // Nombre de archivo con formato: Audio_Docente_Estudiante_Timestamp.webm
      const fileName = `Audio_${state.teacherName}_${state.studentName}_${new Date().getTime()}.webm`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  },
  getters: {
    getFormattedNames: (state) => {
      return `${state.teacherName}_${state.studentName}`;
    }
  }
});