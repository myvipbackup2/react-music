import React from "react"
import PropTypes from "prop-types"

import "./progress.styl"

class Progress extends React.Component {

  progressBarWidth = 0;
  progressBar = null;
  progress = null;
  progressBtn = null;

  componentDidUpdate() {
    // 组件更新后重新获取进度条总宽度
    if (!this.progressBarWidth) {
      this.progressBarWidth = this.progressBar.offsetWidth;
    }
  }

  componentDidMount() {
    const progressBarDOM = this.progressBar;
    const progressDOM = this.progress;
    const progressBtnDOM = this.progressBtn;
    this.progressBarWidth = progressBarDOM.offsetWidth;

    let { disableButton, disableDrag, onDragStart, onDrag, onDragEnd } = this.props;
    if (!disableButton && !disableDrag) {
      // 触摸开始位置
      let downX = 0;
      // 按钮left值
      let buttonLeft = 0;

      progressBtnDOM.addEventListener("touchstart", ({ touches }) => {
        const [touch] = touches;
        downX = touch.clientX;
        buttonLeft = parseInt(this.progressBtn.style.left || 0, 10);
        if (typeof onDragStart === 'function') {
          onDragStart();
        }
      });

      progressBtnDOM.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const [touch] = e.touches;
        let diffX = touch.clientX - downX;
        let btnLeft = buttonLeft + diffX;
        if (btnLeft > progressBarDOM.offsetWidth) {
          btnLeft = progressBarDOM.offsetWidth;
        } else if (btnLeft < 0) {
          btnLeft = 0;
        }
        // 设置按钮left值
        this.progressBtn.style.left = btnLeft + "px";
        // 设置进度width值
        progressDOM.style.width = btnLeft / this.progressBarWidth * 100 + "%";
        if (onDrag) {
          onDrag(btnLeft / this.progressBarWidth);
        }
      });
      progressBtnDOM.addEventListener("touchend", (e) => {
        if (typeof onDragEnd === 'function') {
          onDragEnd();
        }
      });
    }
  }

  getProgressBarRef = ref => {
    this.progressBar = ref
  };

  getProgressRef = ref => {
    this.progress = ref
  };

  getProgressBtnRef = ref => {
    this.progressBtn = ref
  };

  render() {
    // 进度值：范围 0-1
    let { progress, disableButton } = this.props;
    if (!progress) {
      progress = 0;
    }
    //按钮left值
    let progressButtonOffsetLeft = 0;
    if (this.progressBarWidth) {
      progressButtonOffsetLeft = progress * this.progressBarWidth;
    }

    return (
      <div className="progress-bar" ref={this.getProgressBarRef}>
        <div className="progress-load" />
        <div className="progress" style={{ width: `${progress * 100}%` }} ref={this.getProgressRef} />
        {
          !disableButton && (
            <div className="progress-button-warp" ref={this.getProgressBtnRef} style={{ left: progressButtonOffsetLeft }}>
              <div className="progress-button" />
            </div>
          )
        }
      </div>
    );
  }
}

Progress.propTypes = {
  // 进度
  progress: PropTypes.number.isRequired,
  // 是否禁用按钮
  disableButton: PropTypes.bool,
  // 是否禁用拖拽
  disableDrag: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func
};

export default Progress