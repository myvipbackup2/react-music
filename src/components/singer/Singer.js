import React from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import { getTransitionEndName } from "@/util/event"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import { getSingerInfo } from "@/api/singer"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as SongModel from "@/model/song"
import toHttps from '@/util/toHttps'

import "./singer.styl"

class Singer extends React.Component {

  state = {
    show: false,
    loading: true,
    singer: {},
    songs: [],
    refreshScroll: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.computeContainerTop();
    this.updateSingerInfo(id);
    this.initMusicIco();
  }

  getSongUrl(song, mId) {
    getSongVKey(mId).then((res) => {
      if (res) {
        const { code, data = {} } = res;
        if (code === CODE_SUCCESS) {
          const { items = [] } = data;
          if (items.length) {
            const [item] = items;
            song.url = `https://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
          }
        }
      }
    });
  }

  computeContainerTop = () => {
    const albumBgDOM = this.albumBg;
    const albumContainerDOM = this.albumContainer;
    albumContainerDOM.style.top = albumBgDOM.offsetHeight + "px";
  };

  updateSingerInfo = async (singerId) => {
    this.setState({
      show: true,
    });
    const res = await getSingerInfo(singerId);
    if (res) {
      const { code, data = {} } = res;
      if (code === CODE_SUCCESS) {
        const singer = SingerModel.createSingerByDetail(data);
        singer.desc = data.desc;
        const { list: songList = [] } = data;
        const songs = [];
        songList.forEach(({ musicData }) => {
          if (musicData.pay.payplay === 1) {
            return
          }
          const song = SongModel.createSong(musicData);
          // 获取歌曲vkey
          this.getSongUrl(song, song.mId);
          songs.push(song);
        });
        this.setState({
          loading: false,
          singer: singer,
          songs: songs,
        }, () => {
          //刷新scroll
          this.setState({ refreshScroll: true });
        });
      }
    }
  };

  /**
   * 初始化音符图标
   */
  initMusicIco() {

    this.musicIcos = [];
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
    this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));

    this.musicIcos.forEach((item) => {
      //初始化状态
      item.run = false;
      let transitionEndName = getTransitionEndName(item);
      item.addEventListener(transitionEndName, function () {
        this.style.display = "none";
        this.style["webkitTransform"] = "translate3d(0, 0, 0)";
        this.style["transform"] = "translate3d(0, 0, 0)";
        this.run = false;
        const icon = this.querySelector("div");
        icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
        icon.style["transform"] = "translate3d(0, 0, 0)";
      }, false);
    });
  }

  /**
   * 开始音符下落动画
   */
  startMusicIcoAnimation({ clientX, clientY }) {
    if (this.musicIcos.length > 0) {
      for (let i = 0; i < this.musicIcos.length; i++) {
        let item = this.musicIcos[i];
        //选择一个未在动画中的元素开始动画
        if (item.run === false) {
          item.style.top = clientY + "px";
          item.style.left = clientX + "px";
          item.style.display = "inline-block";
          setTimeout(() => {
            item.run = true;
            item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
            item.style["transform"] = "translate3d(0, 1000px, 0)";
            const icon = item.querySelector("div");
            icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
            icon.style["transform"] = "translate3d(-30px, 0, 0)";
          }, 10);
          break;
        }
      }
    }
  }

  /**
   * 选择歌曲
   */
  selectSong(song) {
    return (e) => {
      this.props.setSongs([song]);
      this.props.changeCurrentSong(song);
      this.startMusicIcoAnimation(e.nativeEvent);
    };
  }

  /**
   * 播放全部
   */
  playAll = () => {
    if (this.state.songs.length > 0) {
      //添加播放歌曲列表
      this.props.setSongs(this.state.songs);
      this.props.changeCurrentSong(this.state.songs[0]);
      this.props.showMusicPlayer(true);
    }
  };

  /**
   * 监听scroll
   */
  scroll = ({ y }) => {
    const albumBgDOM = this.albumBg;
    let albumFixedBgDOM = this.albumFixedBg;
    let playButtonWrapperDOM = this.playButtonWrapper;
    if (y < 0) {
      if (Math.abs(y) + 55 > albumBgDOM.offsetHeight) {
        albumFixedBgDOM.style.display = "block";
      } else {
        albumFixedBgDOM.style.display = "none";
      }
    } else {
      let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      albumBgDOM.style["webkitTransform"] = transform;
      albumBgDOM.style["transform"] = transform;
      playButtonWrapperDOM.style.marginTop = `${y}px`;
    }
  };

  getAlbumBgRef = ref => {
    this.albumBg = ref
  };

  getAlbumFixedBgRef = ref => {
    this.albumFixedBg = ref
  };

  getPlayButtonWrapperRef = ref => {
    this.playButtonWrapper = ref
  };

  getAlbumContainerRef = ref => {
    this.albumContainer = ref
  };

  render() {
    let singer = this.state.singer;
    let songs = this.state.songs.map((song) => {
      return (
        <div className="song" key={song.id} onClick={this.selectSong(song)}>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    const bgStyle = { backgroundImage: `url(${toHttps(singer.img)})` };
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate">
        <div className="music-singer">
          <Header title={singer.name} ref="header" />
          <div style={{ position: "relative" }}>
            <div ref={this.getAlbumBgRef} className="singer-img" style={bgStyle}>
              <div className="filter" />
            </div>
            <div ref={this.getAlbumFixedBgRef} className="singer-img fixed" style={bgStyle}>
              <div className="filter" />
            </div>
            <div className="play-wrapper" ref={this.getPlayButtonWrapperRef}>
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play" />
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={this.getAlbumContainerRef} className="singer-container">
            <div className="singer-scroll" style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="singer-wrapper skin-detail-wrapper">
                  <div className="song-count">歌曲 共{songs.length}首</div>
                  <div className="song-list">
                    {songs}
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </div>
          <div className="music-ico" ref="musicIco1">
            <div className="icon-fe-music" />
          </div>
          <div className="music-ico" ref="musicIco2">
            <div className="icon-fe-music" />
          </div>
          <div className="music-ico" ref="musicIco3">
            <div className="icon-fe-music" />
          </div>
        </div>
      </CSSTransition>
    );
  }
}

export default Singer