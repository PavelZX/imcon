import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

import { closeNewTalkModal } from '../../redux/actions/local'
import { createTalk } from '../../redux/actions/talks'
import ErrorMessage from '../shared/error_message'

export default class NewTalk extends React.Component {

  close = () => {
    const {dispatch} = this.props
    dispatch(closeNewTalkModal())
  }

  confirm = () => {
    const {dispatch} = this.props
    let name = this.refs.newTalkName.value
    dispatch(createTalk(name))
  }

  render() {
    const {local, error} = this.props
    return (
      <Modal show={local.openNewTalkModal}>
        <Modal.Header closeButton onClick={this.close}>
          <Modal.Title>Новый разговор</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorMessage error={error}></ErrorMessage>
          <input type="text" className="form-control" placeholder="New Talk Name"
                 ref="newTalkName"></input>
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-success' onClick={this.confirm}>Create</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
