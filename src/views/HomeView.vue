
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useEmotionStore } from "../stores/emotionStore";
import { detectEmotion, loadModels } from "../services/emotionService";

const videoRef = ref<HTMLVideoElement | null>(null);
const store = useEmotionStore();
const isCameraOn = ref(false);
const modelsLoaded = ref(false);
let detectionInterval: number | null = null;

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

const startDetection = () => {
  if (!modelsLoaded.value || !isCameraOn.value || !videoRef.value) return;

  if (detectionInterval) {
    clearInterval(detectionInterval);
  }

  detectionInterval = setInterval(async () => {
    if (videoRef.value && isCameraOn.value) {
      const emotion = await detectEmotion(videoRef.value);
      store.setEmotion(emotion);
    }
  }, 3000);
};

onMounted(async () => {
  await loadModels();
  modelsLoaded.value = true;
});

const start = async () => {
  await startCamera();
  startDetection();
};
</script>

<template>
  <div class="container">
    <h1>🎭 AI Mood Playlist</h1>
    <p class="intro">Detecte seu humor e receba recomendações musicais</p>

    <button @click="start">Iniciar Câmera</button>

    <div class="camera-container">
      <video ref="videoRef" autoplay playsinline></video>
      <p v-if="store.emotion" class="emotion-text">Emoção detectada: <strong>{{ store.emotion || "Nenhuma detectada" }}</strong></p>
    </div>

    <div v-if="store.recommendedMusic" class="music-recommendation">
      <h2>🎶 Música Recomendada:</h2>
      <p class="music-info">
        <strong>{{ store.recommendedMusic.name }}</strong>
        <img class="music-image" :src="store.recommendedMusic.image" alt="Imagem da Playlist">
      </p>
      <a class="spotify-link" :href="store.recommendedMusic.url" target="_blank">Ouvir no Spotify 🎧</a>
    </div>
  </div>
</template>

<style scoped>
/* Centralização do layout */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
  background: #f4f4f4;
  font-family: Arial, sans-serif;
}

.intro {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #555;
}

button {
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}

.camera-container {
  margin-top: 20px;
}

video {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: black;
}

.emotion-text {
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

.music-recommendation {
  margin-top: 30px;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.music-recommendation h2 {
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #333;
}

.music-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.music-image {
  margin-top: 10px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 10px;
}

.spotify-link {
  margin-top: 15px;
  text-decoration: none;
  color: #1db954;
  font-weight: bold;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

.spotify-link:hover {
  color: #1ed760;
}
</style>
