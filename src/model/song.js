/**
 *  歌曲类模型
 */
export class Song {
  constructor(props = {}) {
    const { id = 0, mId = '', name = '', img = '', duration = 0, url = '', singer = '' } = props;
    this.id = id;
    this.mId = mId;
    this.name = name;
    this.img = img;
    this.duration = duration;
    this.url = url;
    this.singer = singer;
  }
}

/**
 *  创建歌曲对象函数
 */
export function createSong(data) {
  return new Song({
    id: data.songid,
    mId: data.songmid,
    name: data.songname,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    duration: data.interval,
    url: '',
    singer: filterSinger(data.singer),
  });
}

function filterSinger(singers) {
  const singerArray = singers.map(singer => {
    return singer.name;
  });
  return singerArray.join("/");
}