import React                  from 'react'
import { PropTypes }          from 'prop-types'
import { connect }          from 'react-redux'
import { DndProvider }    from 'react-dnd'
import HTML5Backend         from 'react-dnd-html5-backend'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import Actions              from '../../redux/actions/current_tree'
import Constants            from '../../redux/constants'
import { setDocumentTitle } from '../../utils'
import BranchForm             from '../../components/branch/form'
import BranchLeaflet             from '../../components/branch/leaflet'
import TreeMember           from '../../components/tree/member'

class TreeHowView extends React.Component {
  componentDidMount() {
    const { socket } = this.props

    if (!socket) {
      return false
    }

    this.props.dispatch(Actions.connectToChannel(socket, this.props.params.id))
  }

  componentWillUpdate(nextProps, nextState) {
    const { socket } = this.props
    const { currentTree } = nextProps

    if (currentTree.name !== undefined) setDocumentTitle(currentTree.name)

    if (socket) {
      return false
    }

    this.props.dispatch(Actions.connectToChannel(nextProps.socket, this.props.params.id))
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.leaveChannel(this.props.currentTree.channel))
  }

  _renderMember() {
    const { connectedUser, showUserForm, channel, error } = this.props.currentTree
    const { dispatch } = this.props
    const member = this.props.currentTree.member
    const currentUserIsOwner = this.props.currentTree.user.id === this.props.currentUser.id

    return (
      <TreeMember
        dispatch={dispatch}
        channel={channel}
        currentUserIsOwner={currentUserIsOwner}
        member={member}
        connectedUser={connectedUser}
        error={error}
        show={showUserForm} />
    )
  }

  _renderbranch() {
    const { branch, channel, editingBranchId, id, addingNewLeafletInBranchId } = this.props.currentTree

    return branch.map((branch) => {
      return (
        <BranchLeaflet
          key={branch.id}
          treeId={id}
          dispatch={this.props.dispatch}
          channel={channel}
          isEditing={editingBranchId === branch.id}
          onDropLeaflet={::this._handleDropLeaflet}
          onDropLeafletWhenEmpty={::this._handleDropLeafletWhenEmpty}
          onDrop={::this._handleDropBranch}
          isAddingNewLeaflet={addingNewLeafletInBranchId === branch.id}
          {...branch} />
      )
    })
  }

  _renderAddNewbranch() {
    const { dispatch, formErrors, currentTree } = this.props

    if (!currentTree.showForm) return this._renderAddButton()

    return (
      <BranchForm
        dispatch={dispatch}
        errors={formErrors}
        channel={currentTree.channel}
        onCancelClick={::this._handleCancelClick} />
    );
  }

  _renderAddButton() {
    return (
      <div className="lists add-new" onClick={::this._handleAddNewClick}>
        <div className="inner">
          Добавить ветку...
        </div>
      </div>
    )
  }

  _handleAddNewClick() {
    const { dispatch } = this.props

    dispatch(Actions.showForm(true))
  }

  _handleCancelClick() {
    this.props.dispatch(Actions.showForm(false))
  }

  _handleDropLeaflet({ source, target }) {
    const { branch, channel } = this.props.currentTree
    const { dispatch } = this.props

    const sourceBranchIndex = branch.findIndex((branch) => { return branch.id === source.branch_id; })
    const sourceBranch = branch[sourceBranchIndex]
    const sourceLeafletIndex = sourceBranch.leaflet.findIndex((leaflet) => { return leaflet.id === source.id; })
    const sourceLeaflet = sourceBranch.leaflet[sourceLeafletIndex]

    const targetBranchIndex = branch.findIndex((branch) => { return branch.id === target.branch_id; })
    let targetBranch = branch[targetBranchIndex]
    const targetLeafletIndex = targetBranch.leaflet.findIndex((leaflet) => { return leaflet.id === target.id; })
    const targetLeaflet = targetBranch.leaflet[targetLeafletIndex]
    const previoustargetLeaflet = sourceBranch.leaflet[sourceLeafletIndex + 1]

    if (previoustargetLeaflet === targetLeaflet) { return false; }

    sourceBranch.leaflet.splice(sourceLeafletIndex, 1)

    if (sourceBranch === targetBranch) {
      const insertIndex = sourceLeafletIndex < targetLeafletIndex ? targetLeafletIndex - 1 : targetLeafletIndex;
      // move at once to avoid complications
      targetBranch = sourceBranch;
      sourceBranch.leaflet.splice(insertIndex, 0, source)
    } else {
      // and move it to target
      targetBranch.leaflet.splice(targetLeafletIndex, 0, source)
    }

    const newIndex = targetBranch.leaflet.findIndex((leaflet) => { return leaflet.id === source.id; })

    const position = newIndex == 0 ? targetBranch.leaflet[newIndex + 1].position / 2 : newIndex == (targetBranch.leaflet.length - 1) ? targetBranch.leaflet[newIndex - 1].position + 1024 : (targetBranch.leaflet[newIndex - 1].position + targetBranch.leaflet[newIndex + 1].position) / 2

    const data = {
      id: sourceLeaflet.id,
      branch_id: targetBranch.id,
      position: position,
    }

    dispatch(Actions.updateLeaflet(channel, data))
  }

  _handleDropBranch({ source, target }) {
    const { branch, channel } = this.props.currentTree
    const { dispatch } = this.props

    const sourceBranchIndex = branch.findIndex((branch) => { return branch.id === source.id; })
    const sourceBranch = branch[sourceBranchIndex]
    branch.splice(sourceBranchIndex, 1);

    const targetBranchIndex = branch.findIndex((branch) => { return branch.id === target.id; })
    const targetBranch = branch[targetBranchIndex]
    branch.splice(targetBranchIndex, 0, sourceBranch)

    const newIndex = branch.findIndex((branch) => { return branch.id === source.id; })

    const position = newIndex == 0 ? branch[newIndex + 1].position / 2 : newIndex == (branch.length - 1) ? branch[newIndex - 1].position + 1024 : (branch[newIndex - 1].position + branch[newIndex + 1].position) / 2

    const data = {
      id: source.id,
      position: position,
    }

    dispatch(Actions.updateBranch(channel, data))
  }

  _handleDropLeafletWhenEmpty(leaflet) {
    const { channel } = this.props.currentTree
    const { dispatch } = this.props

    dispatch(Actions.updateLeaflet(channel, leaflet))
  }

  render() {
    const { fetching, name } = this.props.currentTree

    if (fetching) return (
      <div className="view-container boards show">
        <i className="fa fa-spinner fa-spin"/>
      </div>
    );

    return (
      <div className="view-container boards show">
        <header className="view-header">
          <h3>{name}</h3>
          {::this._renderMember()}
        </header>
        <div className="canvas-wrapper">
          <div className="canvas">
            <div className="lists-wrapper">
              {::this._renderBranch()}
              {::this._renderAddNewBranch()}
            </div>
          </div>
        </div>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentTree: state.currentTree,
  socket: state.session.socket,
  currentUser: state.session.currentUser,
})

export default connect(mapStateToProps)(TreeHowView)
