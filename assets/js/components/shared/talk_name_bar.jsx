import React from 'react'
import { PropTypes }          from 'prop-types'
import { connect } from 'react-redux'

class TalkNameBar extends React.Component {

  render () {
    let {talk} = this.props
    return (
        <div style={style.container}>
          <span className="prefix-icon" style={this.props.prefixStyle}>
            {this._renderPrefix(talk)}
          </span>
          <span style={this.props.nameStyle}>{this._talkName(talk)}</span>
        </div>
    )
  }

  _renderPrefix(talk) {
    if (talk.userId) {
      return this._renderPresenceIcon(talk)
    } else {
      return "#"
    }
  }
  _renderPresenceIcon(talk) {
    let {users} = this.props
    if (users.presences[talk.userId]) {
      return (
        <i className="presence-icon -online icon-circle"></i>
      )
    } else {
      return (
        <i className="presence-icon -offline icon-circle-empty"></i>
      )
    }
  }

  _talkName(talk) {
    if (talk.userId) {
      let {users} = this.props
      return users.items[talk.userId].username
    } else {
      return talk.name
    }
  }
}

const style = {
  container: {
    display: 'inline'
  }
}

TalkNameBar.propTypes = {
}

export default TalkNameBar
