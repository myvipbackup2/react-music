import React from "react"
import { Route } from "react-router-dom"
import LazyLoad, { forceCheck } from "react-lazyload"
import Swiper from "swiper"
import { getCarousel, getNewAlbum } from "@/api/recommend"
import { CODE_SUCCESS } from "@/api/config"
import Album from "@/containers/Album"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import * as AlbumModel from "@/model/album"
import toHttps from '@/util/toHttps'

import "./recommend.styl"
import "swiper/dist/css/swiper.css"


class Recommend extends React.Component {

  state = {
    loading: true,
    sliderList: [],
    newAlbums: [],
    refreshScroll: false,
  };

  async componentDidMount() {

    // 如果当前路由没有被激活隐藏加载组件
    if (!this.props.match.isExact) {
      this.setState({
        loading: false,
      });
    }

    // 并发的网路请求
    await Promise.all([
      this.updateCarousel(),
      this.updateAlbum(),
    ])

  }

  /**
   * 更新轮播图
   */
  updateCarousel = async () => {
    const res = await getCarousel();
    if (res) {
      //console.log(res);
      if (res.code === CODE_SUCCESS) {
        this.setState({
          sliderList: res.data.slider
        }, () => {
          if (!this.sliderSwiper) {
            //初始化轮播图
            this.sliderSwiper = new Swiper(".slider-container", {
              loop: true,
              autoplay: 3000,
              autoplayDisableOnInteraction: false,
              pagination: '.swiper-pagination',
            });
          }
        });
      }
    }
  };

  /**
   * 更新专辑
   */
  updateAlbum = async () => {
    const res = await getNewAlbum();
    if (res) {
      if (res.code === CODE_SUCCESS) {
        const { albumlib = {} } = res;
        const { list = [] } = albumlib.data;
        this.setState({
          loading: false,
          newAlbums: list,
        }, () => {
          // 刷新scroll
          this.setState({
            refreshScroll: true,
          });
        });
      }
    }
  };

  toLink(linkUrl) {
    /* 使用闭包把参数变为局部变量使用 */
    return () => {
      window.location.href = linkUrl;
    };
  }

  /**
   * 专辑详情页
   */
  toAlbumDetail = (url) => {
    /* scroll组件会派发一个点击事件，不能使用链接跳转 */
    this.props.history.push({
      pathname: url,
    });
  };

  /**
   * 由于使用了Better-scroll
   * better-scroll是基于css3的transform实现的
   * react-lazylaod库监听的是浏览器原生的scroll和resize事件
   * react-lazyload不能监听scroll事件要强制触发
   */
  handleForceCheck = () => {
    forceCheck();
  };

  render() {
    const { match } = this.props;
    const albums = this.state.newAlbums.map(item => {
      // 通过函数创建专辑对象
      const album = AlbumModel.createAlbumByList(item);
      return (
        <div
          className="album-wrapper skin-album-wrapper"
          key={album.mId}
          onClick={() => this.toAlbumDetail(`${match.url + '/' + album.mId}`)}
        >
          <div className="left">
            <LazyLoad height={60}>
              <img src={album.img} width="100%" height="100%" alt={album.name} />
            </LazyLoad>
          </div>
          <div className="right">
            <div className="album-name">
              {album.name}
            </div>
            <div className="singer-name">
              {album.singer}
            </div>
            <div className="public—time">
              {album.publicTime}
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="music-recommend">
        <Scroll
          refresh={this.state.refreshScroll}
          onScroll={this.handleForceCheck}
        >
          <div>
            <div className="slider-container">
              <div className="swiper-wrapper">
                {
                  this.state.sliderList.map(slider => {
                    return (
                      <div className="swiper-slide" key={slider.id}>
                        <a className="slider-nav" onClick={this.toLink(toHttps(slider.linkUrl))}>
                          <img src={toHttps(slider.picUrl)} width="100%" height="100%" alt="推荐" />
                        </a>
                      </div>
                    );
                  })
                }
              </div>
              <div className="swiper-pagination" />
            </div>
            {
              !this.state.loading && (
                <div className="album-container">
                  <h1 className="title skin-recommend-title">最新专辑</h1>
                  <div className="album-list">
                    {albums}
                  </div>
                </div>
              )
            }
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.loading} />
        <Route path={`${match.url}/:id`} component={Album} />
      </div>
    );
  }
}

export default Recommend