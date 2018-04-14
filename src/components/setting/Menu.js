import React from "react"
import { CSSTransition } from "react-transition-group"
import Skin from "../../containers/Skin"

import "./menu.styl"

class Menu extends React.Component {

  state = {
    skinShow: false
  };

  button = null;

  showSetting = (status) => {
    this.handleClose();
    // menu关闭后打开设置
    setTimeout(() => {
      this.setState({
        skinShow: status
      });
    }, 300);
  };

  handleClose = () => {
    this.props.closeMenu();
  };

  getBottomRef = ref => {
    this.bottom = ref;
  };

  render() {
    return (
      <div>
        <CSSTransition
          in={this.props.show}
          timeout={300}
          classNames="fade"
          onEnter={() => {
            this.bottom.style.display = "block";
          }}
          onExited={() => {
            this.bottom.style.display = "none";
          }}
        >
          <div className="bottom-container" onClick={this.close} ref={this.getBottomRef}>
            <div className="bottom-wrapper">
              <div className="item" onClick={() => {this.showSetting(true)}}>
                皮肤中心
              </div>
              <div className="item-close" onClick={this.handleClose}>
                关闭
              </div>
            </div>
          </div>
        </CSSTransition>
        <Skin show={this.state.skinShow} close={() => {this.showSetting(false)}} />
      </div>
    );
  }
}

export default Menu