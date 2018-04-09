/**
 * 本地持久化对象
 */

const localStorage = {
  setSkin(key) {
    window.localStorage.setItem("skin", key);
  },
  getSkin() {
    const skin = window.localStorage.getItem("skin");
    return !skin ? "coolBlack" : skin;
  },
  setCurrentSong(song) {
    window.localStorage.setItem("song", JSON.stringify(song));
  },
  getCurrentSong() {
    const song = window.localStorage.getItem("song");
    return song ? JSON.parse(song) : {};
  },
  setSongs(songs) {
    window.localStorage.setItem("songs", JSON.stringify(songs));
  },
  getSongs() {
    const songs = window.localStorage.getItem("songs");
    return songs ? JSON.parse(songs) : [];
  }
};

export default localStorage