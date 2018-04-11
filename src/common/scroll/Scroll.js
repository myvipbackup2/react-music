import React from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import "./scroll.styl"

class Scroll extends React.Component {

  scrollView = null;

  componentDidUpdate() {
    // 组件更新后，如果实例化了better-scroll并且需要刷新就调用refresh()函数
    if (this.bScroll && this.props.refresh) {
      this.bScroll.refresh();
    }
  }

  componentDidMount() {

    if (!this.bScroll) {
      this.bScroll = new BScroll(this.scrollView, {
        scrollX: this.props.direction === "horizontal",
        scrollY: this.props.direction === "vertical",
        // 实时派发scroll事件
        probeType: 3,
        click: this.props.click,
      });

      if (this.props.onScroll) {
        this.bScroll.on("scroll", scroll => {
          this.props.onScroll(scroll);
        });
      }

      if (this.props.scrollEnd) {
        this.bScroll.on('scrollEnd', scroll => {
          // 滚动到底部
          if (this.bScroll.y <= (this.bScroll.maxScrollY + 50)) {
            this.props.scrollEnd(scroll);
          }
        })
      }

    }
  }

  componentWillUnmount() {
    this.bScroll.off("scroll");
    this.bScroll = null;
  }

  refresh() {
    if (this.bScroll) {
      this.bScroll.refresh();
    }
  }

  getRef = ref => {
    this.scrollView = ref
  };

  render() {
    return (
      <div className="scroll-view" ref={this.getRef}>
        {/*获取子组件*/}
        {this.props.children}
      </div>
    );
  }
}

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: false,
  onScroll: null
};

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  //是否启用点击
  click: PropTypes.bool,
  //是否刷新
  refresh: PropTypes.bool,
  onScroll: PropTypes.func
};

export default Scroll