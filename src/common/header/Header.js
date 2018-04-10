import React from 'react'
import './header.styl'

class MusicHeader extends React.Component {

  handleBack = () => {
    const { history, location } = window;
    if (history.length > 2) {
      window.history.back();
    } else {
      const { pathname } = location;
      const arr = pathname.split('/');
      arr.pop();
      window.location.href = `${arr.join('/')}`
    }
  };

  render() {
    return (
      <div className='music-header'>
				<span className='header-back' onClick={this.handleBack}>
					<i className='icon-back' />
				</span>
        <div className='header-title'>
          {this.props.title}
        </div>
      </div>
    );
  }
}

export default MusicHeader