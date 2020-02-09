import React from 'react'
import { Link } from 'react-router-dom'

import List from '../shared/list'
import { openJoinDirectTalkModal } from '../../redux/actions/local'
import TalkNameBar from '../shared/talk_name_bar'

class DirectTalk extends React.Component {
  render() {
    const {dispatch, talks} = this.props
    let items = talks.directIds.map(id => talks.items[id])
    return (
      <div>
        {this._renderDirectTalkHeader()}
        <List items={items}
              renderItem={::this._renderDirectTalk}
              />
      </div>
    )
  }

  _unreadCount(count) {
    if (count && count >= 0) {
      return `(${count})`
    }
  }
  _talkClass(talk) {
    let classes = ["talk-nav"]
    if (talk.id === this.props.talks.currentTalkId) {
      classes.push("-active")
    }
    return classes.join(' ')
  }
  _talkName(talk) {
    let {users} = this.props
    return users.items[talk.userId].username
  }
  _renderDirectTalk(talk) {
    const {talks} = this.props
    let unread = talks.unreadMsgsCounts[talk.id]
    return (
      <li className={this._talkClass(talk)} key={talk.id}>
        <Link to={`/talks/@${this._talkName(talk)}`}>
          <TalkNameBar talk={talk} users={this.props.users}>
          </TalkNameBar> {this._unreadCount(unread)}
        </Link>
      </li>
    )
  }

  _renderDirectTalkHeader() {
    const {dispatch} = this.props
    return (
      <div className='list-unstyled sidebar-item header-item'>
        <span>Прямые сообщения</span>
        <span className="glyphicon glyphicon-plus pull-right new-button"
          aria-hidden="true" onClick={()=> dispatch(openJoinDirectTalkModal())}></span>
      </div>
    )
  }
}

DirectTalk.propTypes = {
}

export default DirectTalk
