import { defineStore } from "pinia";

export const useSpotifyStore = defineStore("spotify", {
  state: () => ({
    currentTrack: null,
    playlist: [],
  }),
  actions: {
    setPlaylist(newPlaylist: any[]) {
      this.playlist = newPlaylist;
    },
    setCurrentTrack(track: any) {
      this.currentTrack = track;
    },
  },
});
