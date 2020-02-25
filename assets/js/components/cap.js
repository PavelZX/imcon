import React            from 'react'
import { connect }      from 'react-redux'
import { Link }         from 'react-router-dom'
import ReactGravatar    from 'react-gravatar'
import { push }         from 'react-router-redux'
import { Image, Menu, Container, Grid, Segment, Dropdown, Icon, Label } from 'semantic-ui-react'

import Actions          from '../redux/actions/session'
import CapActions       from '../redux/actions/cap'

class Cap extends React.Component {
  _handleTreeClick = (e) => {
    e.preventDefault()

    const { dispatch } = this.props
    const { ownedTree, invitedTree } = this.props.tree

    if (ownedTree && ownedTree.length != 0 || invitedTree && invitedTree.length != 0) {
      dispatch(CapActions.showTree(true))
    } else {
      dispatch(push('/ic'))
    }
  }

  _renderTree = () => {
    const { dispatch, currentTree, socket, cap } = this.props

    if (!cap.showTree) return false

    const { ownedTree, invitedTree } = this.props.tree

    const ownedTreeItems = ownedTree.map((tree) => {
      return this._createTreeItem(dispatch, currentTree, socket, tree)
    })

    const ownedTreeItemsCap = ownedTreeItems.length > 0 ? <header className="title"><Icon name="user"/> Собственные деревья</header> : null

    const invitedTreeItems = invitedTree.map((tree) => {
      return this._createTreeItem(dispatch, currentTree, socket, tree)
    })

    const invitedTreeItemsCap = invitedTreeItems.length > 0 ? <header className="title"><Icon name="users"/> Другие деревья</header> : null

    return (
      <Dropdown>
        <Dropdown.Menu>
          <Dropdown.Item> {ownedTreeItemsCap} </Dropdown.Item>
          <Dropdown.Item> {ownedTreeItems} </Dropdown.Item>
          <Dropdown.Item> {invitedTreeItemsCap} </Dropdown.Item>
          <Dropdown.Item> {invitedTreeItems} </Dropdown.Item>
          <Dropdown.Item as={Link} to="/ic"  onChange={this._hideTree}> Показать все деревья </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  _hideTree = () => {
    const { dispatch } = this.props;
    dispatch(CapActions.showTree(false))
  }

  _createTreeItem (dispatch, currentTree, socket, tree) {
    const onClick = (e) => {
      e.preventDefault()

      if (currentTree.id != undefined && currentTree.id == tree.id) {
        dispatch(CapActions.showTree(false))
        return false
      }

      dispatch(CapActions.visitTree(socket, currentTree.channel, tree.id));
    }

    return (
      <li key={tree.id}>
        <Label as='a' href="#" onClick={onClick}>{tree.name}</Label>
      </li>
    )
  }

  _renderCurrentUser = () => {
    const { currentUser } = this.props

    if (!currentUser) {
      return false
    }

    const fullName = [currentUser.first_name, currentUser.last_name].join(' ')

    return (
      <Label as='a'>
        <ReactGravatar email={currentUser.email} true="true" /> {fullName}
      </Label>
    );
  }

  _renderSignOutLink = () => {
    if (!this.props.currentUser) {
      return false
    }

    return (
      <Label as='a' href="#" onClick={this._handleSignOutClick}><Icon name="sign out"/> Выйти</Label>
    )
  }

  _handleSignOutClick = (e) => {
    e.preventDefault()

    this.props.dispatch(Actions.signOut())
  }

  render() {
    return (
      <Grid columns={5} relaxed>
        <Grid.Column>
          <Segment basic>
            <Label as='a' href="#" onClick={this._handleTreeClick}><Icon name="heartbeat"/> Деревья</Label>
            {this._renderTree()}
          </Segment>
        </Grid.Column> 
                  
          <Grid.Column>
            <Link to='/ic'>
              <Image src='/images/logo.png' size='small' />
            </Link>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              {this._renderCurrentUser()}
            </Segment>
          </Grid.Column>
          <Grid.Column>
          <Segment basic>
            {this._renderSignOutLink()}
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.session.currentUser,
  socket: state.session.socket,
  tree: state.tree,
  currentTree: state.currentTree,
  cap: state.cap,
})

export default connect(mapStateToProps)(Cap)
