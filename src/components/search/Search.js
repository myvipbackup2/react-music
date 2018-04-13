import React from "react"
import { Route } from "react-router-dom"
import { getTransitionEndName } from "@/util/event"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import LoadingMore from "@/common/loading/LoadingMore"
import Album from "@/containers/Album"
import Singer from "@/containers/Singer"
import { getHotKey, search } from "@/api/search"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS, SINGER_HOLDER_IMG, ALBUM_HOLDER_IMG } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"
import debounce from '@/util/debounce'

import "./search.styl"
import toHttps from "../../util/toHttps";

class Search extends React.Component {

  state = {
    hotKeys: [],
    singer: {},
    album: {},
    songs: [],
    w: '',
    p: 1,
    totalnum: 0,
    loading: false,
    loadingMore: false,
  };

  musicIcons = [];
  musicIco1 = null;
  musicIco2 = null;
  musicIco3 = null;
  scroll = null;

  componentDidMount() {
    window._c = this;
    this.updateHotKey();
    this.initMusicIco();
  }

  getScrollRef = ref => {
    this.scroll = ref
  };

  /**
   * 获取热门搜索词
   */
  updateHotKey = async () => {
    const res = await getHotKey();
    if (res) {
      if (res.code === CODE_SUCCESS) {
        this.setState({
          hotKeys: res.data.hotkey,
        });
      }
    }
  };

  handleInput = ({ target }) => {
    const w = target.value;
    this.setState({
      w,
      p: 1,
      totalnum: 0,
      singer: {},
      album: {},
      songs: [],
    });
    this.autoSearch(w);
  };

  handleClick = (data, type) => {
    return (e) => {
      switch (type) {
        case "album":
          // 跳转到专辑详情
          this.props.history.push({
            pathname: `${this.props.match.url}/album/${data}`
          });
          break;
        case "singer":
          // 跳转到歌手详情
          this.props.history.push({
            pathname: `${this.props.match.url}/singer/${data}`
          });
          break;
        case "song":
          this.startMusicIcoAnimation(e.nativeEvent);
          getSongVKey(data.mId).then((res) => {
            if (res) {
              if (res.code === CODE_SUCCESS) {
                if (res.data.items) {
                  let item = res.data.items[0];
                  data.url = `https://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;

                  this.props.setSongs([data]);
                  this.props.changeCurrentSong(data);
                }
              }
            }
          });
          break;
        default:
          break;
      }
    }
  };

  autoSearch = debounce(w => {
    this.search(w)
  }, 300);

  search = async (w, p = 1) => {
    if (p <= 1) {
      this.setState({
        w,
        loading: true,
      });
    } else {
      this.setState({
        p,
        loadingMore: true,
      })
    }
    const res = await search({ w, p });
    if (res) {
      const { code, data = {} } = res;
      if (code === CODE_SUCCESS) {
        const { zhida, song } = data;
        const { type } = zhida;
        let singer = {};
        let album = {};
        switch (type) {
          // 0：表示歌曲
          case 0:
            break;
          // 2：表示歌手
          case 2:
            singer = SingerModel.createSingerBySearch(zhida);
            singer.songnum = zhida.songnum;
            singer.albumnum = zhida.albumnum;
            break;
          // 3: 表示专辑
          case 3:
            album = AlbumModel.createAlbumBySearch(zhida);
            break;
          default:
            break;
        }
        let songs = [];
        song.list.forEach((data) => {
          if (data.pay.payplay === 1) {
            return
          }
          songs.push(SongModel.createSong(data));
        });
        if (p > 1) {
          const { songs: oldSongs } = this.state;
          this.setState({
            songs: oldSongs.concat(songs),
            totalnum: song.totalnum,
            p: song.curpage,
            loadingMore: false,
          }, () => {
            this.scroll.refresh();
          });
        } else {
          this.setState({
            album: album,
            singer: singer,
            songs: songs,
            totalnum: song.totalnum,
            p: song.curpage,
            loading: false,
          }, () => {
            this.scroll.refresh();
          });
        }
      }
    }
  };

  handleResetSearch = () => {
    this.setState({
      w: '',
      p: 1,
      totalnum: 0,
      singer: {},
      album: {},
      songs: [],
    })
  };

  loadingMore = () => {
    const { p = 1, totalnum = 0, w } = this.state;
    if (totalnum / 20 > p) {
      this.search(w, p + 1)
    }
  };

  getMusicIco1 = ref => {
    this.musicIco1 = ref
  };

  getMusicIco2 = ref => {
    this.musicIco2 = ref
  };

  getMusicIco3 = ref => {
    this.musicIco3 = ref
  };

  /**
   * 初始化音符图标
   */
  initMusicIco() {
    this.musicIcons = [];
    this.musicIcons.push(this.musicIco1);
    this.musicIcons.push(this.musicIco2);
    this.musicIcons.push(this.musicIco3);

    this.musicIcons.forEach((item) => {
      //初始化状态
      item.run = false;
      let transitionEndName = getTransitionEndName(item);
      item.addEventListener(transitionEndName, function () {
        this.style.display = "none";
        this.style["webkitTransform"] = "translate3d(0, 0, 0)";
        this.style["transform"] = "translate3d(0, 0, 0)";
        this.run = false;

        let icon = this.querySelector("div");
        icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
        icon.style["transform"] = "translate3d(0, 0, 0)";
      }, false);
    });
  }

  /**
   * 开始音符下落动画
   */
  startMusicIcoAnimation({ clientX, clientY }) {
    if (this.musicIcons.length > 0) {
      for (let i = 0; i < this.musicIcons.length; i++) {
        let item = this.musicIcons[i];
        //选择一个未在动画中的元素开始动画
        if (item.run === false) {
          item.style.top = clientY + "px";
          item.style.left = clientX + "px";
          item.style.display = "inline-block";
          setTimeout(() => {
            item.run = true;
            item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
            item.style["transform"] = "translate3d(0, 1000px, 0)";

            let icon = item.querySelector("div");
            icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
            icon.style["transform"] = "translate3d(-30px, 0, 0)";
          }, 10);
          break;
        }
      }
    }
  }

  render() {
    const album = this.state.album;
    const singer = this.state.singer;
    album.img = toHttps(album.img);
    singer.img = toHttps(singer.img);
    return (
      <div className="music-search skin-search">
        <div className="search-box-wrapper skin-search-box-wrapper">
          <div className="search-box skin-search-box">
            <i className="icon-search" />
            <input
              type="text"
              className="search-input"
              placeholder="搜索歌曲、歌手、专辑"
              value={this.state.w}
              onChange={this.handleInput}
              onKeyDown={
                ({ keyCode, currentTarget }) => {
                  if (keyCode === 13) {
                    this.search(currentTarget.value);
                  }
                }
              }
            />
          </div>
          {
            this.state.w && this.state.w.length && (
              <div className="cancel-button" onClick={this.handleResetSearch}>
                取消
              </div>
            )
          }
        </div>
        <div className="search-hot" style={{ display: this.state.w ? "none" : "block" }}>
          <h1 className="title">热门搜索</h1>
          <div className="hot-list">
            {
              this.state.hotKeys.map(({ n, k }, index) => {
                if (index > 14) {
                  return null;
                }
                return (
                  <div
                    className="hot-item"
                    key={n + k}
                    onClick={() => this.search(k)}
                  >
                    {k}
                  </div>
                );
              })
            }
          </div>
        </div>
        <div className="search-result skin-search-result" style={{ display: this.state.w ? "block" : "none" }}>
          <Scroll ref={this.getScrollRef} scrollEnd={this.loadingMore}>
            <div>
              {/* 专辑 */}
              {
                album.id && (
                  <div
                    className="album-wrapper"
                    onClick={this.handleClick(album.mId, "album")}
                  >
                    <div className="left">
                      <img
                        src={album.img}
                        alt={album.name}
                        style={{ background: `url(${SINGER_HOLDER_IMG}) no-repeat center center` }}
                        onError={({ currentTarget }) => {
                          currentTarget.src = ALBUM_HOLDER_IMG;
                        }}
                      />
                    </div>
                    <div className="right">
                      <div className="song">{album.name}</div>
                      <div className="singer">{album.singer}</div>
                    </div>
                  </div>
                )
              }
              {/* 歌手 */}
              {
                singer.id && (
                  <div
                    className="singer-wrapper"
                    onClick={this.handleClick(singer.mId, "singer")}
                  >
                    <div className="left">
                      <img
                        src={singer.img}
                        alt={singer.name}
                        onError={({ currentTarget }) => {
                          currentTarget.src = SINGER_HOLDER_IMG;
                        }}
                      />
                    </div>
                    <div className="right">
                      <div className="singer">{singer.name}</div>
                      <div className="info">单曲{singer.songnum} 专辑{singer.albumnum}</div>
                    </div>
                  </div>
                )
              }
              {/* 歌曲列表 */}
              {
                this.state.songs.map((song) => {
                  return (
                    <div className="song-wrapper" key={song.id} onClick={this.handleClick(song, "song")}>
                      <div className="left">
                        <i className="icon-fe-music" />
                      </div>
                      <div className="right">
                        <div className="song">{song.name}</div>
                        <div className="singer">{song.singer}</div>
                      </div>
                    </div>
                  );
                })
              }
              <LoadingMore show={this.state.loadingMore} />
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </Scroll>
        </div>
        <div className="music-ico" ref={this.getMusicIco1}>
          <div className="icon-fe-music" />
        </div>
        <div className="music-ico" ref={this.getMusicIco2}>
          <div className="icon-fe-music" />
        </div>
        <div className="music-ico" ref={this.getMusicIco3}>
          <div className="icon-fe-music" />
        </div>
        <Route path={`${this.props.match.url}/album/:id`} component={Album} />
        <Route path={`${this.props.match.url}/singer/:id`} component={Singer} />
      </div>
    );
  }
}

export default Search