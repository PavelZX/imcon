import React, { Component } from 'react'
import { PropTypes }          from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import List from '../shared/list'
import Message from '../message/message'
import PostMessage from './post_message'
import UnreadDivider from './unread_divider'
import { postMessage } from '../../redux/actions/messages'
import { fetchMessages, changeTalk, changeNewMessage, markMessageRead } from '../../redux/actions/talks'

class Talk extends Component {
  constructor(props) {
    super(props)
    this.betterHandleScroll = _.debounce(::this.handleScroll, 200)
  }

  componentDidMount () => {
    this.talkNameChange(this.props)
    this.refs.messageList.addEventListener('scroll', this.betterHandleScroll)
    // handle the situation when messages is few
    window.setTimeout(()=> this.betterHandleScroll({target: this.refs.messageList}), 200)
  }

  componentWillUnmount () => {
    this.refs.messageList.removeEventListener('scroll', this.betterHandleScroll)
  }

  componentWillReceiveProps(props) {
    if (this._talkIdShouldChange(this.props, props)) {
      this.talkNameChange(props)
    }
    window.setTimeout(()=> this.betterHandleScroll({target: this.refs.messageList}), 200)
  }

  // http://blog.vjeux.com/2013/javascript/scroll-position-with-react.html
  componentWillUpdate () => {
    let node = this.refs.messageList
    this.shouldScrollBottom = (node.scrollTop + node.clientHeight) === node.scrollHeight
    this.cachedScrollHeight = node.scrollHeight
  }

  componentDidUpdate () => {
    let node = this.refs.messageList
    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight
    } else {
      // After new messages are fetched and rendering is over, new scrollHeight
      // will be larger than old one. So scrollTop should be increased with the diff.
      // Otherwise, they're same
      node.scrollTop = node.scrollTop + (node.scrollHeight - this.cachedScrollHeight)
    }
  }

  handleScroll(event) {
    const {messages, dispatch, talkId, hasMore} = this.props
    if (event.target.scrollTop === 0 && hasMore) {
      dispatch(fetchMessages(talkId, messages[0].ts))
    }
    let unreadDivider = document.querySelector('.unread-divider')
    let judgeMark = ()=> unreadDivider && unreadDivider.getBoundingClientRect().top >= 0
    if (judgeMark()) {
      window.setTimeout(()=> {
        if (judgeMark()) {
          dispatch(markMessageRead(talkId, messages[messages.length - 1]))
        }
      }, 2000)
    }
  }

  _talkIdShouldChange(prevProps, nextProps) {
    return nextProps.params.id !== prevProps.params.id ||
           nextProps.initTalkDone !== prevProps.initTalkDone ||
           nextProps.initDirectTalkDone !== prevProps.initDirectTalkDone
  }

  talkNameChange(props) {
    let {dispatch} = props
    dispatch(changeTalk(props.params.id))
  }

  renderItem(message, index, messages) {
    const {unreadCount} = this.props
    if (messages.length - index === unreadCount) {
      return (
        <div key={message.ts}>
          <UnreadDivider></UnreadDivider>
          {this.renderMessage(message)}
        </div>
      )
    } else {
      return this.renderMessage(message)
    }
  }

  renderMessage(message, index, messages) {
    return (
      <Message message={message} key={message.ts}/>
    )
  }

  render () => {
    const {dispatch, messages, talkId, newMessage} = this.props

    return (
      <div className="chat-container">
        <div className="message-list" ref="messageList">
          <List items={messages}
          renderItem={this.renderItem} />
        </div>
        <PostMessage
          message={newMessage}
          users={this.props.users}
          onChange={text => dispatch(changeNewMessage(talkId, text))}
          onPost={text => dispatch(postMessage(talkId, text))} />
      </div>
    )
  }
}

Talk.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    ts: PropTypes.number.isRequired
  })),
  talkId: PropTypes.number,
  hasMore: PropTypes.bool
}

function mapStateToProps(state) {
  let {msgIdsById, initTalkDone, currentTalkId, newMessage, hasMore, unreadMsgsCounts} = state.talks

  let msgIds = msgIdsById[currentTalkId] || []
  let messages = _.compact(msgIds.map(id => state.messages.items[`${currentTalkId}:${id}`]))
  hasMore = hasMore[currentTalkId]
  let unreadCount = unreadMsgsCounts[currentTalkId]
  return {
    hasMore,
    messages,
    initTalkDone,
    unreadCount,
    talkId: currentTalkId,
    newMessage: newMessage[currentTalkId] || "",
    initDirectTalkDone: state.directTalk.initDirectTalkDone,
    users: state.users
  }
}

export default connect(
  mapStateToProps
)(Talk)
