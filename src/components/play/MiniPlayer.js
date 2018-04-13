import React from "react"
import Progress from "./Progress"
import { skin } from '@/util/skin'
import { connect } from 'react-redux'

import "./miniplayer.styl"
import toHttps from "../../util/toHttps";

const mapStateToProps = ({ skin }) => ({
  currentSkin: skin,
});

class MiniPlayer extends React.Component {

  handlePlayOrPause = (e) => {
    e.stopPropagation();
    if (this.props.song.url) {
      //调用父组件的播放或暂停方法
      this.props.playOrPause();
    }
  };

  handleNext = (e) => {
    e.stopPropagation();
    if (this.props.song.url) {
      //调用父组件播放下一首方法
      this.props.next();
    }
  };

  handleShow = () => {
    if (this.props.song.url) {
      this.props.showMiniPlayer();
    }
  };

  render() {
    const song = this.props.song;
    song.img = toHttps(song.img);

    let playerStyle = {};
    if (this.props.showStatus) {
      playerStyle = { display: "none" };
    }

    if (!song.img || song.img.startsWith('data:image')) {
      song.img = skin[this.props.currentSkin].defaultPlayerImg;
    }

    let imgStyle = {};
    if (song.playStatus) {
      imgStyle["WebkitAnimationPlayState"] = "running";
      imgStyle["animationPlayState"] = "running";
    } else {
      imgStyle["WebkitAnimationPlayState"] = "paused";
      imgStyle["animationPlayState"] = "paused";
    }

    let playButtonClass = song.playStatus ? "icon-pause" : "icon-play";
    return (
      <div className="mini-player skin-mini-player" style={playerStyle} onClick={this.handleShow}>
        <div className="player-img rotate" style={imgStyle}>
          <img src={song.img} alt={song.name} />
        </div>
        <div className="player-center">
          <div className="progress-wrapper">
            <Progress disableButton={true} progress={this.props.progress} />
          </div>
          <span className="song">
						{song.name}
					</span>
          <span className="singer">
						{song.singer}
					</span>
        </div>
        <div className="player-right">
          <i className={playButtonClass} onClick={this.handlePlayOrPause} />
          <i className="icon-next ml-10" onClick={this.handleNext} />
        </div>
        <div className="filter" />
      </div>
    );
  }
}

export default connect(mapStateToProps)(MiniPlayer);
