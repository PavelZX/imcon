import React from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import _ from "lodash"

import { closeJoinDirectTalkModal } from '../../redux/actions/local'
import { joinDirectTalk } from '../../redux/actions/direct_talk'
import TalkNameBar from '../shared/talk_name_bar'

class JoinDirectTalk extends React.Component {
  constructor(props) {
    super(props)
    this.state = {newUserId: null}
  }

  close() {
    this.props.dispatch(closeJoinDirectTalkModal())
  }

  confirm() {
    if (!this.state.newUserId) { return }
    this.props.dispatch(joinDirectTalk(this.state.newUserId, this.props.user.items))
  }

  userChange(data) {
    this.setState({newUserId: data && data.value})
  }

  render() {
    const {local} = this.props
    return (
      <Modal show={local.openJoinDirectTalkModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Новое прямое сообщение</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._renderUserSelect()}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Начать разговор</button>
        </Modal.Footer>
      </Modal>
    )
  }

  _renderUserSelect() {
    let {talks, user} = this.props
    let directTalk = talks.directIds.map((id) => talks.items[id])
    let otherUserIds = _.difference(user.ids, directTalk.map((ch) => ch.userId))
    let otherUser = otherUserIds.map((id)=> user.items[id])
    let options = otherUser.map((u)=> { return {value: u.id, label: u.username} })
    return (
      <Select
        name="form-field-name"
        value={this.state.newUserId}
        options={options}
        optionRenderer={this.renderOption.bind(this)}
        onChange={::this.userChange}
        />
    )
  }

  renderOption(value) {
    let {user} = this.props
    let talk = {name: value.label, userId: value.value}
    return (
      <div>
        <TalkNameBar talk={talk} user={user} prefixStyle={{opacity: 0.6}} nameStyle={{fontWeight: 'bolder'}}></TalkNameBar>
      </div>
    )
  }

}

export default JoinDirectTalk
