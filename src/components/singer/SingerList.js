import React from "react"
import { Route } from "react-router-dom"
import LazyLoad, { forceCheck } from "react-lazyload"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import Singer from "@/containers/Singer"
import { getSingerList } from "@/api/singer"
import { CODE_SUCCESS, SINGER_HOLDER_IMG } from "@/api/config"
import * as SingerModel from "@/model/singer"

import "core-js/es6/array"
import "./singerlist.styl"

class SingerList extends React.Component {

  types = [
    { key: "all_all", name: "全部" },
    { key: "cn_man", name: "华语男" },
    { key: "cn_woman", name: "华语女" },
    { key: "cn_team", name: "华语组合" },
    { key: "k_man", name: "韩国男" },
    { key: "k_woman", name: "韩国女" },
    { key: "k_team", name: "韩国组合" },
    { key: "j_man", name: "日本男" },
    { key: "j_woman", name: "日本女" },
    { key: "j_team", name: "日本组合" },
    { key: "eu_man", name: "欧美男" },
    { key: "eu_woman", name: "欧美女" },
    { key: "eu_team", name: "欧美组合" },
    { key: "other_other", name: "其它" }
  ];
  indexs = [
    { key: "all", name: "热门" },
    { key: "A", name: "A" },
    { key: "B", name: "B" },
    { key: "C", name: "C" },
    { key: "D", name: "D" },
    { key: "E", name: "E" },
    { key: "F", name: "F" },
    { key: "G", name: "G" },
    { key: "H", name: "H" },
    { key: "I", name: "I" },
    { key: "J", name: "J" },
    { key: "K", name: "K" },
    { key: "L", name: "L" },
    { key: "M", name: "M" },
    { key: "N", name: "N" },
    { key: "O", name: "O" },
    { key: "P", name: "P" },
    { key: "Q", name: "Q" },
    { key: "R", name: "R" },
    { key: "S", name: "S" },
    { key: "T", name: "T" },
    { key: "U", name: "U" },
    { key: "V", name: "V" },
    { key: "W", name: "W" },
    { key: "X", name: "X" },
    { key: "Y", name: "Y" },
    { key: "Z", name: "Z" }
  ];
  state = {
    loading: true,
    typeKey: "all_all",
    indexKey: "all",
    singers: [],
    refreshScroll: false,
  };

  componentDidMount() {
    //初始化导航元素总宽度
    this.initNavScrollWidth();
    this.getSingers();
  }

  getTagRef = ref => {
    this.tagRef = ref;
  };

  getIndexRef = ref => {
    this.indexRef = ref;
  };

  initNavScrollWidth() {
    const tagDOM = this.tagRef;
    const tagElems = tagDOM.querySelectorAll("a");
    let tagTotalWidth = 0;
    Array.from(tagElems).forEach(a => {
      tagTotalWidth += a.offsetWidth;
    });
    tagDOM.style.width = `${tagTotalWidth}px`;

    const indexDOM = this.indexRef;
    const indexElems = indexDOM.querySelectorAll("a");
    let indexTotalWidth = 0;
    Array.from(indexElems).forEach(a => {
      indexTotalWidth += a.offsetWidth;
    });
    indexDOM.style.width = `${indexTotalWidth}px`;
  }

  getSingers() {
    getSingerList(1, `${this.state.typeKey + '_' + this.state.indexKey}`).then((res) => {
      //console.log("获取歌手列表：");
      if (res) {
        //console.log(res);
        if (res.code === CODE_SUCCESS) {
          let singers = [];
          res.data.list.forEach(data => {
            let singer = new SingerModel.Singer(data.Fsinger_id, data.Fsinger_mid, data.Fsinger_name,
              `https://y.gtimg.cn/music/photo_new/T001R150x150M000${data.Fsinger_mid}.jpg?max_age=2592000`);
            singers.push(singer);
          });
          this.setState({
            loading: false,
            singers
          }, () => {
            //刷新scroll
            this.setState({ refreshScroll: true });
          });
        }
      }
    });
  }

  handleTypeClick = (key) => {
    this.setState({
      loading: true,
      typeKey: key,
      indexKey: "all",
      singers: []
    }, () => {
      this.getSingers();
    });
  };

  handleIndexClick = (key) => {
    this.setState({
      loading: true,
      indexKey: key,
      singers: []
    }, () => {
      this.getSingers();
    });
  };

  toDetail = (url) => {
    this.props.history.push({
      pathname: url
    });
  };

  render() {
    const { match } = this.props;
    const tags = this.types.map(({ key, name }) => (
      <a
        key={key}
        className={key === this.state.typeKey ? "choose" : ""}
        onClick={() => {this.handleTypeClick(key)}}
      >
        {name}
      </a>
    ));
    const indexs = this.indexs.map(({ key, name }) => (
      <a
        key={key}
        className={key === this.state.indexKey ? "choose" : ""}
        onClick={() => {this.handleIndexClick(key)}}
      >
        {name}
      </a>
    ));
    const singers = this.state.singers.map(singer => {
      return (
        <div
          className="singer-wraper"
          key={singer.id}
          onClick={() => {this.toDetail(`${match.url}/${singer.mId}`)}}
        >
          <div className="singer-img">
            <LazyLoad height={50}>
              <img
                src={singer.img}
                width="100%"
                height="100%"
                alt={singer.name}
                style={{ background: `url(${SINGER_HOLDER_IMG}) no-repeat center center` }}
                onError={({ currentTarget }) => {
                  currentTarget.src = SINGER_HOLDER_IMG;
                }}
              />
            </LazyLoad>
          </div>
          <div className="singer-name">
            {singer.name}
          </div>
        </div>
      );
    });
    return (
      <div className="music-singers skin-music-singers">
        <div className="nav">
          <Scroll direction="horizontal">
            <div className="tag" ref={this.getTagRef}>
              {tags}
            </div>
          </Scroll>
          <Scroll direction="horizontal">
            <div className="index" ref={this.getIndexRef}>
              {indexs}
            </div>
          </Scroll>
        </div>
        <div className="singer-list">
          <Scroll
            refresh={this.state.refreshScroll}
            onScroll={() => {forceCheck()}}
          >
            <div className="singer-container">
              {singers}
            </div>
          </Scroll>
        </div>
        <Loading title="正在加载..." show={this.state.loading} />
        <Route path={`${match.url + '/:id'}`} component={Singer} />
      </div>
    )
  }
}

export default SingerList