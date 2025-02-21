import * as faceapi from "face-api.js";

// Caminho onde os modelos estão armazenados
const MODEL_URL = "http://localhost:5173/models";

// Função para carregar os modelos necessários
export async function loadModels() {
  console.log("Carregando modelos...");
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    console.log("tinyFaceDetector carregado com sucesso!");
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    console.log("faceExpressionNet carregado com sucesso!");
    console.log("Todos os modelos foram carregados com sucesso!");
  } catch (error) {
    console.error("Erro ao carregar modelos:", error);
  }
}


// Função para detectar emoção
export async function detectEmotion(videoElement: HTMLVideoElement) {
  console.log("Iniciando detecção de emoções...");
  if (!videoElement) return "neutral";

  const detections = await faceapi
    .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceExpressions();

  if (!detections) return "neutral";

  const emotions = detections.expressions;
  console.log("Emoções detectadas:", emotions);
  const sortedEmotions = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
  return sortedEmotions[0][0]; // Retorna a emoção com maior probabilidade
}
