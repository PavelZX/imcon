import React from 'react'

import NewTalk from './new_talk'
import JoinTalk from './join_talk'
import JoinDirectTalk from './join_direct_talk'

class Overlay extends React.Component {
  render() {
    return (
      <div>
        <NewTalk {...this.props}></NewTalk>
        <JoinTalk {...this.props}></JoinTalk>
        <JoinDirectTalk {...this.props}></JoinDirectTalk>
      </div>
    )
  }
}

export default Overlay
