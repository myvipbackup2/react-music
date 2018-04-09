import React from "react"
import "./header.styl"

class MusicHeader extends React.Component {

  handleBack = () => {
    window.history.back();
  };

  render() {
    return (
      <div className="music-header">
				<span className="header-back" onClick={this.handleBack}>
					<i className="icon-back" />
				</span>
        <div className="header-title">
          {this.props.title}
        </div>
      </div>
    );
  }
}

export default MusicHeader