import React from 'react'
import { Modal } from 'react-bootstrap'
import Select from 'react-select'
import _ from "lodash"

import { closeJoinTalkModal } from '../../redux/actions/local'
import { joinTalk } from '../../redux/actions/talks'

class JoinTalk extends React.Component {
  constructor(props) {
    super(props)
    this.state = {joinTalkId: null}
  }

  close() {
    this.props.dispatch(closeJoinTalkModal())
  }

  confirm() {
    if (!this.state.joinTalkId) { return }
    let { talks } = this.props
    this.props.dispatch(joinTalk(talks.items[this.state.joinTalkId]))
  }

  talkChange(data) {
    this.setState({joinTalkId: data && data.value})
  }

  render() {
    const {local} = this.props
    return (
      <Modal show={local.openJoinTalkModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Присоединяйтесь к разговору</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this._renderTalkSelect()}
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Присоединяйтесь к разговору</button>
        </Modal.Footer>
      </Modal>
    )
  }

  _renderTalkSelect() {
    let {talks} = this.props
    let notJoinedIds = _.difference(talks.allIds, talks.ids)
    let otherTalks = notJoinedIds.map((id)=> talks.items[id])
    let options = otherTalks.map((ch)=> { return {value: ch.id, label: ch.name} })
    return (
      <Select
        name="form-field-name"
        value={this.state.joinTalkId}
        options={options}
        onChange={::this.talkChange}
        />
    )
  }

}

export default JoinTalk
