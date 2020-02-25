import React                    from 'react'
import { PropTypes }            from 'prop-types'
import {DragSource, DropTarget} from 'react-dnd'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import ItemTypes                from '../../redux/constants/item_types'
import Actions                  from '../../redux/actions/current_tree'
import BranchForm                 from './form'
import LeafletForm                 from '../../components/leaflet/form'
import Leaflet                     from '../../components/leaflet/leaflet'

const branchSource = {
  beginDrag(props) {
    return {
      id: props.id,
      name: props.name,
      position: props.position,
    };
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
};

const branchTarget = {
  drop(targetProps, monitor) {
    const source = monitor.getItem();

    if (source.id !== targetProps.id) {
      const target = {
        id: targetProps.id,
        name: targetProps.name,
        position: targetProps.position,
      };

      targetProps.onDrop({ source, target });
    }
  },
};

const leafletTarget = {
  drop(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    const source = {
      id: sourceProps.id,
      branch_id: targetProps.id,
      position: 1024,
    };

    if (!targetProps.leaflet.length) {
      targetProps.onDropLeafletWhenEmpty(source);
    }
  },
};

@DragSource(ItemTypes.BRANCH, branchSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.BRANCH, branchTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))

@DropTarget(ItemTypes.LEAFLET, leafletTarget, (connect) => ({
  connectLeafletDropTarget: connect.dropTarget()
}))

export default class BranchLeaflet extends React.Component {
  _renderLeaflet = () => {
    const { leaflet, dispatch, treeId } = this.props;

    return leaflet.map((leaflet) => {
      return (
        <Leaflet
          key={leaflet.id}
          dispatch={dispatch}
          treeId={treeId}
          {...leaflet}
          onDrop={this._handleDropLeaflet} />
      );
    });
  }

  _renderForm = () => {
    const { isAddingNewLeaflet } = this.props;
    if (!isAddingNewLeaflet) return false;

    let { id, dispatch, formErrors, channel } = this.props;

    return (
      <LeafletForm
        branchId={id}
        dispatch={dispatch}
        errors={formErrors}
        channel={channel}
        onCancelClick={this._hideLeafletForm}
        onSubmit={this._hideLeafletForm}/>
    );
  }

  _renderAddNewLeaflet = () => {
    const { isAddingNewLeaflet } = this.props;
    if (isAddingNewLeaflet) return false;

    return (
      <a className="add-new" href="#" onClick={this._handleAddClick}>Добавить листик...</a>
    );
  }

  _handleAddClick = (e) => {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(Actions.showLeafletForm(id));
  }

  _hideLeafletForm = () => {
    const { dispatch } = this.props;

    dispatch(Actions.showLeafletForm(null));
  }

  _handleDropLeaflet = ({ source, target }) => {
    this.props.onDropLeaflet({ source, target });
  }

  _renderHeader = () => {
    if (this.props.isEditing) {
      const { id, name, dispatch, channel } = this.props;

      const data = {
        id: id,
        name: name,
      };

      return (
        <BranchForm
          branch={data}
          dispatch={dispatch}
          channel={channel}
          onCancelClick={this._handleCancelEditFormClick}/>
      );
    } else {
      return (
        <header onClick={this._handleHeaderClick}>
          <h4>{this.props.name}</h4>
        </header>
      );
    }
  }

  _handleHeaderClick = (e) => {
    e.preventDefault();

    const { dispatch, id } = this.props;

    dispatch(Actions.editBranch(id));
  }

  _handleCancelEditFormClick = () => {
    const { dispatch } = this.props;

    dispatch(Actions.editBranch(null));
  }

  render () {
    const { id, connectDragSource, connectDropTarget, connectLeafletDropTarget, isDragging } = this.props;

    const styles = {
      display: isDragging ? 'none' : 'block',
    };

    return connectDragSource(
      connectDropTarget(
        connectLeafletDropTarget(
          <div id={`branch_${id}`} className="list" style={styles}>
            <div className="inner">
              {this._renderHeader()}
              <div className="cards-wrapper">
                {this._renderLeaflet()}
              </div>
              <footer>
                {this._renderForm()}
                {this._renderAddNewLeaflet()}
              </footer>
            </div>
          </div>
        )
      )
    );
  }
}

BranchLeaflet.propTypes = {
};
