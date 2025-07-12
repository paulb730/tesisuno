<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Howl } from 'howler'

const props = defineProps({
  audioSrc: String,
  autoplay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['ended'])

const sound = ref(null)

const playAudio = () => {
  if (props.audioSrc && !sound.value) {
    sound.value = new Howl({
      src: [props.audioSrc],
      html5: true, // Importante para autoplay en móviles
      autoplay: props.autoplay,
      onend: () => {
        emit('ended')
        sound.value = null
      },
      onplayerror: () => {
        // Fallback para políticas de autoplay
        sound.value.once('unlock', () => {
          sound.value.play()
        })
      }
    })
  }
}

const stopAudio = () => {
  if (sound.value) {
    sound.value.stop()
    sound.value = null
  }
}

// Reproducir automáticamente cuando el componente se monta
onMounted(() => {
  if (props.audioSrc && props.autoplay) {
    playAudio()
  }
})

watch(() => props.audioSrc, (newSrc, oldSrc) => {
  if (newSrc && newSrc !== oldSrc) {
    playAudio()
  }
})

onBeforeUnmount(() => {
  stopAudio()
})

defineExpose({
  playAudio,
  stopAudio
})
</script>

<template>
  <!-- Componente sin template visual -->
</template>