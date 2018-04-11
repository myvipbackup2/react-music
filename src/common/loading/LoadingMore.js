import React from "react"
import loadingImg from "./loading.gif"
import "./loading.styl"

class Loading extends React.PureComponent {
  render() {
    const { show = false } = this.props;
    if (!show) {
      return null
    }
    return (
      <div className="loading-wrapper load-more">
        <img src={loadingImg} width="18px" height="18px" alt="loading" />
      </div>
    );
  }
}

export default Loading