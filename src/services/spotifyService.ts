import axios from "axios";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
let accessToken = "";

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = response.data.access_token;
  return accessToken;
};

const emotionToQuery = {
  happy: "happy hits",
  sad: "sad songs",
  angry: "rock anthems",
  surprised: "electronic dance",
  neutral: "chill vibes",
};

export const getMusicRecommendation = async (emotion: string) => {
  const query = emotionToQuery[emotion as keyof typeof emotionToQuery] || "chill vibes";
  
  try {
    const token = await getAccessToken();
    
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: query,
        type: "playlist",
        limit: 5,
      },
    });

    console.log('PLAYLISTS', response.data.playlists.items);
    
    const playlists = response.data.playlists.items
      .filter(Boolean)
      .map((playlist: any) => ({
        name: playlist.name,
        url: playlist.external_urls.spotify,
        image: playlist.images[0]?.url,
      }));

    console.log('PLAYLISTS', playlists);
    
    if (playlists.length === 0) {
      return null;
    }

    // Retorna uma playlist aleatória
    return playlists[Math.floor(Math.random() * playlists.length)];

  } catch (error) {
    console.error("Erro ao buscar playlists:", error);
    return null; // Retorna null em caso de erro
  }
};
