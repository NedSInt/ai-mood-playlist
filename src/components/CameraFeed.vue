<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEmotionStore } from "../stores/emotionStore";
import { detectEmotion, loadModels } from "../services/emotionService";

const videoRef = ref<HTMLVideoElement | null>(null);
const store = useEmotionStore();
const isCameraOn = ref(false);
const modelsLoaded = ref(false); // Variável para saber se os modelos foram carregados

const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.value) {
      videoRef.value.srcObject = stream;
      await videoRef.value.play();
      isCameraOn.value = true;
    }
  } catch (error) {
    console.error("Erro ao acessar a câmera:", error);
    alert("Erro ao acessar a câmera. Verifique as permissões.");
  }
};

// Iniciar a detecção de emoções somente após carregar os modelos
onMounted(async () => {
  await loadModels();
  modelsLoaded.value = true; // Marcar que os modelos foram carregados

  startCamera().then(() => {
    if (!modelsLoaded.value) return;

    setInterval(async () => {
      if (videoRef.value && isCameraOn.value) {
        const emotion = await detectEmotion(videoRef.value);
        store.setEmotion(emotion);
      }
    }, 3000);
  });
});


</script>

<template>
  <video ref="videoRef" autoplay></video>
</template>
