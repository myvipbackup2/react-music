import * as SongModel from "./song"

/**
 * 排行榜类模型
 */
export class Ranking {
  constructor(id, title, img, songs) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.songs = songs;
  }
}

/**
 * 通过排行榜列表创建排行榜对象函数
 */
export function createRankingByList(data) {
  const songList = [];
  data.songList.forEach(item => {
    songList.push(new SongModel.Song({
      id: 0,
      mId: "",
      name: item.songname,
      img: "",
      duration: 0,
      url: "",
      singer: item.singername
    }));
  });
  return new Ranking(
    data.id,
    data.topTitle,
    data.picUrl,
    songList
  );
}

/**
 * 通过排行榜详情创建排行榜对象函数
 */
export function createRankingByDetail(data) {
  return new Ranking(
    data.topID,
    data.ListName,
    data.pic_album,
    []
  );
}