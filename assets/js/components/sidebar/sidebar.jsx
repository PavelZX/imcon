import React, { Component } from 'react'
import { PropTypes }          from 'prop-types'

import Talks from './talks'
import DirectTalk from './direct_talk'

class Sidebar extends Component {
  render() {
    const {dispatch, talks} = this.props
//    let items = talks.ids.map(id => talks.items[id])
    return (
      <div>
        <div className="sidebar-main">
          <Talks {...this.props}></Talks>
          <br/>
          <DirectTalk {...this.props}></DirectTalk>
        </div>
      </div>
    )
  }

}

Sidebar.propTypes = {
  talks: PropTypes.object,
  directTalk: PropTypes.object,
  users: PropTypes.object,
  dispatch: PropTypes.func
}

export default Sidebar
