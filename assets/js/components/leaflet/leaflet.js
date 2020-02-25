import React              from 'react'
import { PropTypes }      from 'prop-types'
import {DragSource, DropTarget} from 'react-dnd'
import { push }                 from 'react-router-redux'
import ReactGravatar            from 'react-gravatar'
import classnames               from 'classnames'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import ItemTypes                from '../../redux/constants/item_types'
import Actions                  from '../../redux/actions/current_tree'
import LeafletActions              from '../../redux/actions/current_leaflet'

const leafletSource = {
  beginDrag(props) {
    return {
      id: props.id,
      list_id: props.list_id,
      name: props.name,
      position: props.position,
    };
  },

  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
};

const leafletTarget = {
  drop(targetProps, monitor) {
    const source = monitor.getItem();

    if (source.id !== targetProps.id) {
      const target = {
        id: targetProps.id,
        list_id: targetProps.list_id,
        name: targetProps.name,
        position: targetProps.position,
      };

      targetProps.onDrop({ source, target });
    }
  },
};

@DragSource(ItemTypes.LEAFLET, leafletSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

@DropTarget(ItemTypes.LEAFLET, leafletTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))

export default class Leaflet extends React.Component {
  
  _handleClick = (e) => {
    const { dispatch, id, treeId } = this.props;

    dispatch(push(`/tree/${treeId}/leaflet/${id}`));
  }

  _renderFooter = () => {
    let commentIcon = null;
    const { comment, member } = this.props;

    if (comment.length > 0) {
      commentIcon = <small>
        <Icon name="comment outline"/> {comment.length}
      </small>;
    }

    const memberNode = member.map((member) => {
      return <ReactGravatar className="react-gravatar" key={member.id} email={member.email} https />;
    });

    return (
      <footer>
        {commentIcon}
        {memberNode}
      </footer>
    );
  }

  _renderTag = () => {
    const { tag } = this.props;

    const tagNode = tag.map((tag) => {
      return (
        <span key={tag} className={`tag ${tag}`}></span>
      );
    });

    return (
      <div className="tags-wrapper">
        {tagNode}
      </div>
    );
  }

  render() {
    const { id, connectDragSource, connectDropTarget, isDragging, isOver, name } = this.props;

    const styles = {
      display: isDragging ? 'none' : 'block',
    };

    const classes = classnames({
      'leaflet': true,
      'is-over': isOver
    });

    return connectDragSource(
      connectDropTarget(
        <div id={`leaflet_${id}`} className={classes} style={styles} onClick={this._handleClick}>
          <div className="card-content">
            {this._renderTag()}
            {name}
            {this._renderFooter()}
          </div>
        </div>
      )
    );
  }
}

Leaflet.propTypes = {
};
