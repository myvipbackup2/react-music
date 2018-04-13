/**
 * URL
 */
const URL = {
  /* 推荐轮播 */
  carousel: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  /* 最新专辑 */
  newalbum: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
  /* 专辑信息 */
  albumInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',
  /* 排行榜 */
  rankingList: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
  /* 排行榜详情 */
  rankingInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
  /* 搜索 */
  search: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
  /* 热搜 */
  hotkey: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
  /* 歌手列表 */
  singerList: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
  /* 歌手详情 */
  singerInfo: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
  /* 歌曲vkey */
  songVkey: 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg',
};

/**
 * 默认参数
 */
const PARAM = {
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  _: Date.now(),
};

const OPTION = {
  param: 'jsonpCallback',
  prefix: 'callback',
};

const CODE_SUCCESS = 0;

const SINGER_HOLDER_IMG = 'https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=2592000';

const ALBUM_HOLDER_IMG = 'https://y.gtimg.cn/mediastyle/global/img/album_300.png?max_age=31536000';

export {
  URL,
  PARAM,
  OPTION,
  CODE_SUCCESS,
  SINGER_HOLDER_IMG,
  ALBUM_HOLDER_IMG,
};