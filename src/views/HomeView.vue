<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEmotionStore } from "../stores/emotionStore";
import { detectEmotion, loadModels } from "../services/emotionService";

const videoRef = ref<HTMLVideoElement | null>(null);
const store = useEmotionStore();
const isCameraOn = ref(false);
const modelsLoaded = ref(false);
let detectionInterval: number | null = null; // Armazena o intervalo da detecção

// 🔹 Função para iniciar a câmera
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

// 🔹 Função para iniciar a detecção de emoções
const startDetection = () => {
  if (!modelsLoaded.value || !isCameraOn.value || !videoRef.value) return;

  // Interrompe qualquer detecção anterior antes de iniciar uma nova
  if (detectionInterval) {
    clearInterval(detectionInterval);
  }

  detectionInterval = setInterval(async () => {
    if (videoRef.value && isCameraOn.value) {
      const emotion = await detectEmotion(videoRef.value);
      store.setEmotion(emotion);
    }
  }, 3000); // Detectar emoções a cada 3 segundos
};

// 🔹 Ao montar o componente, carregamos os modelos
onMounted(async () => {
  await loadModels(); // Carregar modelos primeiro
  modelsLoaded.value = true; // Marcar que os modelos foram carregados
});

// 🔹 Iniciar câmera e detecção ao clicar no botão
const start = async () => {
  await startCamera(); // Primeiro inicia a câmera
  startDetection(); // Depois inicia a detecção
};
</script>

<template>
  <div class="container">
    <h1>🎭 AI Mood Playlist</h1>
    <p>Detecte seu humor e receba recomendações musicais</p>

    <button @click="start" v-if="!isCameraOn">Iniciar Câmera</button>

    <div v-if="true" class="camera-container">
      <video ref="videoRef" autoplay playsinline></video>
      <p v-if="store.emotion">Emoção detectada: <strong>{{ store.emotion || "Nenhuma detectada" }}</strong></p>
    </div>

    <div v-if="store.recommendedMusic" class="music-recommendation">
      <h2>🎶 Música Recomendada:</h2>
      <p>
        <strong>{{ store.recommendedMusic.name }}</strong>
        <img :src="store.recommendedMusic.image" alt="">
      </p>
      <a :href="store.recommendedMusic.url" target="_blank">Ouvir no Spotify 🎧</a>
    </div>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
}

.camera-container {
  margin-top: 20px;
}

video {
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  display: block;
}

.music-recommendation {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
}

.music-recommendation a {
  display: block;
  margin-top: 10px;
  text-decoration: none;
  color: #1db954;
  font-weight: bold;
}
</style>
