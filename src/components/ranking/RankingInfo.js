import React from "react"
import { CSSTransition } from "react-transition-group"
import { getTransitionEndName } from "@/util/event"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import { getRankingInfo } from "@/api/ranking"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS } from "@/api/config"
import * as RankingModel from "@/model/ranking"
import * as SongModel from "@/model/song"

import "./rankinginfo.styl"
import toHttps from "../../util/toHttps";

class RankingInfo extends React.Component {

  state = {
    show: false,
    loading: true,
    ranking: {},
    songs: [],
    refreshScroll: false,
  };

  musicIcons = [];

  // refs
  rankingBg = null;
  rankingContainer = null;
  rankingFixedBg = null;
  playButtonWrapper = null;
  musicIco1 = null;
  musicIco2 = null;
  musicIco3 = null;

  getRankingBgRef = ref => {
    this.rankingBg = ref
  };

  getRankingContainerRef = ref => {
    this.rankingContainer = ref
  };

  getRankingFixedBgRef = ref => {
    this.rankingFixedBg = ref
  };

  getPlayButtonWrapperRef = ref => {
    this.playButtonWrapper = ref
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
   * 计算容器高度
   */
  computeContainerTop = () => {
    const rankingBgDOM = this.rankingBg;
    const rankingContainerDOM = this.rankingContainer;
    rankingContainerDOM.style.top = rankingBgDOM.offsetHeight + "px";
  };

  componentDidMount() {
    const { match } = this.props;
    this.computeContainerTop();
    this.updateRankingInfo(match.params.id);
    this.initMusicIco();
  }

  updateRankingInfo = async (id) => {
    this.setState({
      show: true
    });
    const res = await getRankingInfo(id);
    if (res) {
      const { code, topinfo = {}, songlist = [] } = res;
      if (code === CODE_SUCCESS) {
        const ranking = RankingModel.createRankingByDetail(topinfo);
        ranking.info = topinfo.info;
        const songList = [];
        songlist.forEach(({ data }) => {
          if (data.pay.payplay === 1) {
            return
          }
          const song = SongModel.createSong(data);
          //获取歌曲vkey
          this.getSongUrl(song);
          songList.push(song);
        });
        this.setState({
          loading: false,
          ranking: ranking,
          songs: songList,
        }, () => {
          //刷新scroll
          this.setState({
            refreshScroll: true,
          });
        });
      }
    }
  };

  getSongUrl(song) {
    getSongVKey(song.mId).then((res) => {
      if (res) {
        const { code, data } = res;
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
    const rankingBgDOM = this.rankingBg;
    const rankingFixedBgDOM = this.rankingFixedBg;
    const playButtonWrapperDOM = this.playButtonWrapper;
    if (y < 0) {
      if (Math.abs(y) + 55 > rankingBgDOM.offsetHeight) {
        rankingFixedBgDOM.style.display = "block";
      } else {
        rankingFixedBgDOM.style.display = "none";
      }
    } else {
      const transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      rankingBgDOM.style["webkitTransform"] = transform;
      rankingBgDOM.style["transform"] = transform;
      playButtonWrapperDOM.style.marginTop = `${y}px`;
    }
  };

  render() {
    const ranking = this.state.ranking;
    const songs = this.state.songs.map((song, index) => {
      return (
        <div className="song" key={song.id} onClick={this.selectSong(song)}>
          <div className="song-index">{index + 1}</div>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    ranking.img = toHttps(ranking.img);
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate">
        <div className="ranking-info">
          <Header title={ranking.title} />
          <div style={{ position: "relative" }}>
            <div ref={this.getRankingBgRef} className="ranking-img" style={{ backgroundImage: `url(${ranking.img})` }}>
              <div className="filter" />
            </div>
            <div ref={this.getRankingFixedBgRef} className="ranking-img fixed" style={{ backgroundImage: `url(${ranking.img})` }}>
              <div className="filter" />
            </div>
            <div className="play-wrapper skin-play-wrapper" ref={this.getPlayButtonWrapperRef}>
              <div className="play-button skin-play-wrapper" onClick={this.playAll}>
                <i className="icon-play" />
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={this.getRankingContainerRef} className="ranking-container">
            <div className="ranking-scroll" style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="ranking-wrapper skin-detail-wrapper">
                  <div className="ranking-count">排行榜 共{songs.length}首</div>
                  <div className="song-list">
                    {songs}
                  </div>
                  {
                    ranking.info && (
                      <div className="info">
                        <h1 className="ranking-title">简介</h1>
                        <div
                          className="ranking-desc"
                          dangerouslySetInnerHTML={{
                            __html: ranking.info
                          }}
                        />
                      </div>
                    )
                  }
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
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
        </div>
      </CSSTransition>
    );
  }
}

export default RankingInfo