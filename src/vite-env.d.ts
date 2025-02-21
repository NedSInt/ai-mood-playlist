/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_SPOTIFY_CLIENT_ID: string;
    VITE_SPOTIFY_CLIENT_SECRET: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  