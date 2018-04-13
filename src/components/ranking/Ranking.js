import React from "react"
import { Route } from "react-router-dom"
import LazyLoad, { forceCheck } from "react-lazyload";
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import { getRankingList } from "@/api/ranking"
import { CODE_SUCCESS, ALBUM_HOLDER_IMG } from "@/api/config"
import * as RankingModel from "@/model/ranking"
import RankingInfo from "@/containers/Ranking"
import toHttps from '@/util/toHttps'

import "./ranking.styl"

class Ranking extends React.Component {

  state = {
    loading: true,
    rankingList: [],
    refreshScroll: false,
  };

  componentDidMount() {
    this.updateRankingList();
  }

  updateRankingList = async () => {
    const res = await getRankingList();
    if (res) {
      const { code, data } = res;
      if (code === CODE_SUCCESS) {
        const topList = [];
        data.topList.forEach(({ topTitle = '' }) => {
          if (/MV/i.test(topTitle)) {
            return;
          }
          topList.push(RankingModel.createRankingByList(item));
        });
        this.setState({
          loading: false,
          rankingList: topList,
        }, () => {
          //刷新scroll
          this.setState({ refreshScroll: true });
        });
      }
    }
  };

  toDetail = (url) => {
    this.props.history.push({
      pathname: url,
    });
  };

  render() {
    let { match } = this.props;
    return (
      <div className="music-ranking">
        <Scroll
          refresh={this.state.refreshScroll}
          onScroll={() => {forceCheck();}}
        >
          <div className="ranking-list">
            {
              this.state.rankingList.map(ranking => {
                return (
                  <div
                    className="ranking-wrapper skin-ranking-wrapper"
                    key={ranking.id}
                    onClick={() => this.toDetail(`${match.url}/${ranking.id}`)}
                  >
                    <div className="left">
                      <LazyLoad height={100}>
                        <img
                          src={toHttps(ranking.img)}
                          alt={ranking.title}
                          style={{ background: `url(${ALBUM_HOLDER_IMG}) no-repeat center center` }}
                          onError={({ currentTarget }) => {
                            currentTarget.src = ALBUM_HOLDER_IMG;
                          }}
                        />
                      </LazyLoad>
                    </div>
                    <div className="right">
                      <h1 className="ranking-title">
                        {ranking.title}
                      </h1>
                      {
                        ranking.songs.map((song, index) => {
                          return (
                            <div className="top-song" key={index}>
                              <span className="index">{index + 1}</span>
                              <span>{song.name}</span>
                              &nbsp;-&nbsp;
                              <span className="singer">{song.singer}</span>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                );
              })
            }
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.loading} />
        <Route path={`${match.url}/:id`} component={RankingInfo} />
      </div>
    );
  }
}

export default Ranking