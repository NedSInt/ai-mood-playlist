import { defineStore } from "pinia";
import { ref } from "vue";
import { getMusicRecommendation } from "../services/spotifyService";

export const useEmotionStore = defineStore("emotion", () => {
  const emotion = ref<string | null>(null);
  const recommendedMusic = ref<{ name: string; image: string; url: string } | null>(null);

  const setEmotion = async (newEmotion: string) => {
    console.log("Iniciando detecção...");
    emotion.value = newEmotion;

    // Busca recomendação musical com base na emoção
    const track = await getMusicRecommendation(newEmotion);
    if (track) {
      recommendedMusic.value = {
        name: track.name,
        image: track.image,
        url: track.url,
      };
    }
  };

  return { emotion, recommendedMusic, setEmotion };
});
