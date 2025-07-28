import { defineStore } from 'pinia'

export const MODEL_BASE_PATH = '/public/models/'
export const AUDIO_BASE_PATH = '/public/audios/'

export const useStoryStore = defineStore('story', {
    state: () => ({
        currentPage: 0,
        storyCompleted: false,
        quizAnswers: [],
        storyPages: [
            {
                text: "Había una vez tres cerditos que vivían en el bosque.",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_mayor_walk.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page1_narrador.mp3"
            },
            {
                text: "Los tres eran hermanos y muy diferentes entre sí.",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_mayor_walk.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page2_narrador.mp3"
            },
            {
                text: "Los dos cerditos más pequeños pasaban todo el día jugando y tocando sus instrumentos",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 }
                ],
                audio: AUDIO_BASE_PATH + "page3_narrador.mp3"
            },
            {
                text: "En cambio, el hermano mayor era muy trabajador.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_mayor.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page4_narrador.mp3"
            },
            {
                text: "Un día, el hermano mayor, preocupado porque sus dos hermanitos todo el día jugaban y cantaban, los llamó y les dijo:",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_mayor_walk.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page5_narrador.mp3"
            },
            {
                text: "Pronto llegará el invierno y habrá mucha nieve ¿Qué harán entonces? Les aconsejo que construyan una casa donde puedan vivir.",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_mayor_walk.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page6_cerdito_mayor.mp3"
            },
            {
                text: "“Es verdad”, respondieron los dos cerditos.",
                models: [{ path: MODEL_BASE_PATH + 'cerdito_menor_walk.glb', pos: [-1, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_medio_walk.glb', pos: [0, 0, 0], scale: 0.5 },
                { path: MODEL_BASE_PATH + 'cerdito_mayor_walk.glb', pos: [1, 0, 0], scale: 0.55 }
                ],
                audio: AUDIO_BASE_PATH + "page7_narrador.mp3"
            },
            {
                text: "El cerdito más pequeño era el más juguetón y el que menos ganas tenía de trabajar. Entonces, decidió construir su casa de paja.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [-2, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'casa_paja.glb', pos: [0, 0.8, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page8_narrador.mp3"
            },
            {
                text: "El cerdito mediano, al que también le gustaba jugar, trabajaba un poquito. Éste decidió construir una casa de madera.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_medio.glb', pos: [-0.5, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'casa_madera.glb', pos: [1.5, 0.8, 0], scale: 1.5 },
                ],
                audio: AUDIO_BASE_PATH + "page9_narrador.mp3"
            },
            {
                text: "mientras que el hermano mayor decidió construir una de ladrillo.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_mayor.glb', pos: [0, 0, 0], scale: 0.55 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [2.5, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page10_narrador.mp3"
            },
            {
                text: "Un día, paseaba por el bosque el lobo y de repente vio al cerdito más pequeño e intentó atraparlo.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor_run.glb', pos: [1, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 }
                ],
                audio: AUDIO_BASE_PATH + "page11_narrador.mp3"
            },
            {
                text: "El cerdito huyó despavorido al ver al lobo y se metió en su casa de paja. Estaba muerto de miedo y le temblaban las piernas.",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_paja.glb', pos: [0, 0.8, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page12_narrador.mp3"
            },
            {
                text: "El lobo, al ver que la casa era de paja, dijo riéndose:",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_paja.glb', pos: [0, 0.8, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page13_narrador.mp3"
            },
            {
                text: "¡Pero si es de paja! ¡Pues, soplaré y soplaré y la casa derribaré!",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_paja.glb', pos: [0, 0.8, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page14_lobo.mp3"
            },
            {
                text: "¡Vaya que sí la derribó!",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [1, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_paja.glb', pos: [0, 0.8, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page15_narrador.mp3"
            },
            {
                text: "El cerdito pequeño salió corriendo a casa del cerdito mediano donde los dos se sentían seguros porque la casa era de madera.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [1, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'cerdito_medio.glb', pos: [1.5, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_madera.glb', pos: [0, 0.8, 0], scale: 1.5 }
                ],
                audio: AUDIO_BASE_PATH + "page16_narrador.mp3"
            },
            {
                text: "El lobo, al ver que la casa era de madera, dijo riéndose:",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_madera.glb', pos: [0, 0.8, 0], scale: 1.5 },
                ],
                audio: AUDIO_BASE_PATH + "page17_narrador.mp3"
            },
            {
                text: "¡Pero si es de madera! ¡Pues, soplaré, soplaré y la casa derribaré!",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_madera.glb', pos: [0, 0.8, 0], scale: 1.5 }
                ],
                audio: AUDIO_BASE_PATH + "page18_lobo.mp3"
            },
            {
                text: "Al primer intento, el lobo no consiguió derribar la casa, pero al segundo, la tumbó.",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_madera.glb', pos: [0, 0.8, 0], scale: 1.5 },
                ],
                audio: AUDIO_BASE_PATH + "page19_narrador.mp3"
            },
            {
                text: "Los dos cerditos huyeron corriendo a casa de su hermano mayor, que era de ladrillo y donde los tres se sentirían mucho más seguros.",
                models: [
                    // { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [1, 0, 0], scale: 0.5 },
                    // { path: MODEL_BASE_PATH + 'cerdito_medio.glb', pos: [1.5, 0, 0], scale: 0.5 },
                    // { path: MODEL_BASE_PATH + 'cerdito_mayor.glb', pos: [-1, 0, 0], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page20_narrador.mp3"
            },
            {
                text: "El lobo, al ver la casa, sonrío de nuevo y dijo:",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page21_narrador.mp3"
            },
            {
                text: "¡Soplaré y soplaré y la casa derribaré!",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page22_lobo.mp3"
            },
            {
                text: "Al primer intento, el lobo no consiguió derribar la casa, al segundo intento tampoco lo consiguió, y al tercer intento, se cansó.",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page23_narrador.mp3"
            },
            {
                text: "Dentro de la casa, los tres cerditos sonreían despreocupados. El lobo, enfadado, viendo la casa dijo:",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page24_narrador.mp3"
            },
            {
                text: "¡Ya está! ¡Lo tengo! Entraré por la chimenea.",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page25_lobo.mp3"
            },
            {
                text: "El lobo trepó por la chimenea y los dos cerditos más pequeños sintieron mucho miedo al escuchar el ruido, pero el hermano mayor les dijo:",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page26_narrador.mp3"
            },
            {
                text: "Tranquilos, no se preocupen que enseguida haré una hoguera para que el lobo se queme cuando baje por la chimenea.",
                models: [
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page27_cerdito_mayor.mp3"
            },
            {
                text: "Y vaya que sí se quemó el lobo que huyó despavorido. Los tres cerditos hicieron una gran fiesta donde tocaron todos sus instrumentos.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [1, 0, 2], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'cerdito_medio.glb', pos: [1.5, 0, 2], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'cerdito_mayor.glb', pos: [-1, 0, 2], scale: 0.55 },
                    { path: MODEL_BASE_PATH + 'lobo_feroz_angry.glb', pos: [2.5, 0.5, 0], scale: 1 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page28_narrador.mp3"
            },
            {
                text: "Y colorín colorado, este cuento se ha terminado.",
                models: [
                    { path: MODEL_BASE_PATH + 'cerdito_menor.glb', pos: [1, 0, 2], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'cerdito_medio.glb', pos: [1.5, 0, 2], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'cerdito_mayor.glb', pos: [-1, 0, 2], scale: 0.5 },
                    { path: MODEL_BASE_PATH + 'casa_cemento.glb', pos: [0, 1, 0], scale: 1.8 }
                ],
                audio: AUDIO_BASE_PATH + "page29_narrador.mp3"
            }
        ]
    }),
    actions: {
        nextPage() {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++
                return true
            } else {
                this.storyCompleted = true
                return false
            }
        },
        prevPage() {
            if (this.currentPage > 0) {
                this.currentPage--
                return true
            }
            return false
        },
        setPage(index) {
            if (index >= 0 && index < this.totalPages) {
                this.currentPage = index
            }
        },
        togglePlay() {
            this.isPlaying = !this.isPlaying
        },
        resetScene() {
            this.currentPage = 0
            // Fuerza recreación de modelos
            this.storyPages = [...this.storyPages]
        },
        completeStory() {
            this.storyCompleted = true
        },
        addQuizAnswer(answer) {
            this.quizAnswers.push(answer)
        },
        resetStoryData() {
            this.currentPage = 0
            this.storyCompleted = false
            this.quizAnswers = []
        }
    },
    getters: {
        currentPageData: (state) => state.storyPages[state.currentPage] || {},
        totalPages: (state) => state.storyPages.length,
        isLastPage: (state) => state.currentPage === state.totalPages - 1
    }
})