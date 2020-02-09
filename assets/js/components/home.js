import React                from 'react'
import { connect }          from 'react-redux'
//import classnames           from 'classnames'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import { setDocumentTitle } from '../utils'
import Actions              from '../redux/actions/tree'
import TreeLeaflet            from '../components/tree/leaflet'
import TreeForm            from '../components/tree/form'

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
        <div className="boards-wrapper">
          {this._renderTree(this.props.ownedTree)}
          {this._renderAddNewTree()}
        </div>
      )
    }

    return (
      <Container>
        <header className="view-header">
          <h3><Icon name="spinner" /> Мои деревья</h3>
        </header>
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
    let { showForm, dispatch, formErrors } = this.props

    if (!showForm) return this._renderAddButton()

    return (
      <TreeForm
        dispatch={dispatch}
        errors={formErrors}
        onCancelClick={this._handleCancelClick}/>
    )
  }

  _renderOtherTree = () => {
    const { invitedTree } = this.props

    if (invitedTree && invitedTree.length === 0) return false

    return (
      <Container>
        <header className="view-header">
          <h3><Icon name="users" /> Другие деревья</h3>
        </header>
        <div className="boards-wrapper">
          {this._renderTree(invitedTree)}
        </div>
      </Container>
    )
  }

  _renderAddButton = () => {
    return (
      <div className="board add-new" onClick={this._handleAddNewClick}>
        <div className="inner">
          <a id="add_new_tree">Добавить дерево...</a>
        </div>
      </div>
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
      <div className="view-container boards index">
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
