import React from 'react'
import { Modal } from 'react-bootstrap'

import { closeNewTalkModal } from '../../redux/actions/local'
import { createTalk } from '../../redux/actions/talks'
import ErrorMessage from '../shared/error_message'

class NewTalk extends React.Component {
  close() {
    const {dispatch} = this.props
    dispatch(closeNewTalkModal())
  }

  confirm() {
    const {dispatch} = this.props
    let name = this.refs.newTalkName.value
    dispatch(createTalk(name))
  }

  render() {
    const {local, error} = this.props
    return (
      <Modal show={local.openNewTalkModal} onHide={::this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Новый разговор</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ErrorMessage error={error}></ErrorMessage>
          <input type="text" className="form-control" placeholder="New Talk Name"
                 ref="newTalkName"></input>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn btn-success' onClick={::this.confirm}>Create</button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default NewTalk
