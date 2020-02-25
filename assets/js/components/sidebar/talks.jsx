import React from 'react'
import { Link } from 'react-router-dom'

import List from '../shared/list'
import { openNewTalkModal, openJoinTalkModal } from '../../redux/actions/local'
import TalkNameBar from '../shared/talk_name_bar'

class Talks extends React.Component {

  render() {
    const {dispatch, talks} = this.props
    let items = talks.ids.map(id => talks.items[id])
    return (
      <div>
        {this._renderTalkHeader()}
        <List items={items}
              renderItem={this._renderTalk}
              isLoading={talks.isFetching}/>
        {this._renderNewTalkButton()}
      </div>
    )
  }

  _unreadCount = (count) => {
    if (count && count >= 0) {
      return `(${count})`
    }
  }
  _talkClass = (talk) => {
    let classes = ["talk-nav"]
    if (talk.id === this.props.talks.currentTalkId) {
      classes.push("-active")
    }
    return classes.join(' ')
  }
  _renderTalk = (talk) => {
    const {talks} = this.props
    let unread = talks.unreadMsgsCounts[talk.id]
    return (
      <li className={this._talkClass(talk)} key={talk.id}>
        <Link to={`/talks/${talk.name}`}>
          <TalkNameBar talk={talk}>
          </TalkNameBar> {this._unreadCount(unread)}
        </Link>
      </li>
    )
  }

  _renderTalkHeader = () => {
    const {dispatch} = this.props
    return (
      <div>
        <span>Разговор</span>
        <span className="glyphicon glyphicon-plus pull-right new-button"
          aria-hidden="true" onClick={()=> dispatch(openJoinTalkModal())}></span>
      </div>
    )
  }

  _renderNewTalkButton = () => {
    const {dispatch} = this.props
    return (
      <div>
        <a onClick={()=> dispatch(openNewTalkModal())}>+ Новый разговор</a>
      </div>
    )
  }
}

Talks.propTypes = {
}

export default Talks
