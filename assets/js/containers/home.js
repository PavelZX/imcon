import React                from 'react'
import { connect }          from 'react-redux'
//import classnames           from 'classnames'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import { setDocumentTitle } from '../utils'
import Actions              from '../redux/actions/tree'
import TreeLeaflet          from '../components/tree/leaflet'
import TreeForm             from '../components/tree/form'

class HomeView extends React.Component {
  componentDidMount() {
    setDocumentTitle('Язык Образов')
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.reset())
  }

  _renderOwnedTree = () =>  {
    const { fetching } = this.props

    let content = false

    if (!fetching) {
      content = (
        <Container>
          {this._renderTree(this.props.ownedTree)}
          {this._renderAddNewTree()}
        </Container>
      )
    }

    return (
      <Container>
        <Header>
          <h3><Icon name="spinner" /> Мои деревья</h3>
        </Header>
        {content}
      </Container>
    )
  }

  _renderTree = (tree) => {
    return tree && tree.map((tree) => {
      return <TreeLeaflet
                key={tree.id}
                dispatch={this.props.dispatch}
                {...tree} />
    })
  }

  _renderAddNewTree = () => {
    let { showForm, dispatch, formError } = this.props

    if (!showForm) return this._renderAddButton()

    return (
      <TreeForm
        dispatch={dispatch}
        error={formError}
        onCancelClick={this._handleCancelClick}/>
    )
  }

  _renderOtherTree = () => {
    const { invitedTree } = this.props

    if (invitedTree && invitedTree.length === 0) return false

    return (
      <Container>
        <Header>
          <h3><Icon name="users" /> Другие деревья</h3>
        </Header>
        <div>
          {this._renderTree(invitedTree)}
        </div>
      </Container>
    )
  }

  _renderAddButton = () => {
    return (
      <Button onClick={this._handleAddNewClick}>
          <a id="add_new_tree">Добавить дерево...</a>
      </Button>
    )
  }

  _handleAddNewClick = () =>  {
    let { dispatch } = this.props

    dispatch(Actions.showForm(true))
  }

  _handleCancelClick = () =>  {
    this.props.dispatch(Actions.showForm(false))
  }

  render() {
    return (
      <div>
        {this._renderOwnedTree()}
        {this._renderOtherTree()}
      </div>
    )
  }
}

const mapStateToProps = (state) => (
  state.tree
);

export default connect(mapStateToProps)(HomeView)
