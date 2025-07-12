import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores/store'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(store)
app.mount('#app')
