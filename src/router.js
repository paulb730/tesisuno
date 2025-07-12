import { createRouter, createWebHistory } from 'vue-router'
import StoryViewer from '@/components/StoryViewer.vue'
import Quiz from '@/components/Quiz.vue'
import ModelRendererAR from './components/ModelRendererAR.vue'
import WelcomeForm from './components/WelcomeForm.vue'
import { useStoryStore } from '@/stores/story' // ✅ ESTA LÍNEA FALTABA

const routes = [
    {
        path: '/',
        name: 'Welcome',
        component: WelcomeForm
    },
    {
        path: '/story',
        name: 'Story',
        component: StoryViewer,
        meta: { transition: 'fade' }
    },
    {
        path: '/quiz',
        name: 'Quiz',
        component: Quiz,
        meta: { transition: 'fade' }
    },
    {
        path: '/interactive-story',
        name: 'InteractiveStory',
        component: () => import('@/components/InteractiveStory.vue')
    },
    {
        path: '/AR',
        name: 'StoryAR',
        component: ModelRendererAR,
        meta: { transition: 'fade' }
    },

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const userData = JSON.parse(localStorage.getItem('ar-educativo-users'));
        if (userData && userData.teacher && userData.student) {
            next();
        } else {
            next('/');
        }
    } else {
        next();
    }
    // const storyStore = useStoryStore()
    // if (to.name === 'Story' && storyStore.currentPage >= storyStore.totalPages) {
    //     next({ name: 'Quiz' })
    // } else {
    //     next()
    // }
})

export default router
