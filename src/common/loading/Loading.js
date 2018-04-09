import React from "react"
import loadingImg from "./loading.gif"
import "./loading.styl"

class Loading extends React.PureComponent {
  render() {
    const { show = false, title = '正在载入...' } = this.props;
    if (!show) {
      return null
    }
    return (
      <div className="loading-container">
        <div className="loading-wrapper">
          <img src={loadingImg} width="18px" height="18px" alt="loading" />
          <div className="loading-title">{title}</div>
        </div>
      </div>
    );
  }
}

export default Loading