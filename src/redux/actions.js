/**
 * Action是把数据从应用传到store的有效载荷。它是store数据的唯一来源
 */

import * as ActionTypes from "./actionTypes"

export function setSkin(skin) {
  return { type: ActionTypes.SET_SKIN, skin };
}

export function showPlayer(showStatus) {
  return { type: ActionTypes.SHOW_PLAYER, showStatus };
}

export function changeSong(song) {
  return { type: ActionTypes.CHANGE_SONG, song };
}

export function removeSong(id) {
  return { type: ActionTypes.REMOVE_SONG_FROM_LIST, id };
}

export function setSongs(songs) {
  return { type: ActionTypes.SET_SONGS, songs };
}
