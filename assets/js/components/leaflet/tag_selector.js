import React              from 'react'
import { PropTypes }      from 'prop-types'
import PageClick          from 'react-page-click'
import ReactGravatar      from 'react-gravatar'
import classnames         from 'classnames'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import Actions            from '../../redux/actions/current_leaflet'

export default class TagSelector extends React.Component {
  _close (e) => {
    e.preventDefault();

    this.props.close();
  }

  // _removeTag(tag) {
  //  const { dispatch, channel, leafletId } = this.props;

  // dispatch(Actions.removeTag(channel, leafletId, tag));
  // }

  _addTag(tag) {
    const { dispatch, channel, leafletId, selectedTag } = this.props;

    selectedTag.push(tag);

    dispatch(Actions.updateTag(channel, leafletId, selectedTag));
  }

  _removeTag(tag) {
    const { dispatch, channel, leafletId, selectedTag } = this.props;

    selectedTag.splice(selectedTag.indexOf(tag), 1);

    dispatch(Actions.updateTag(channel, leafletId, selectedTag));
  }

  _renderTagList () => {
    const { selectedTag } = this.props;

    const tag = ['green', 'yellow', 'orange', 'red', 'purple', 'blue'];

    const tagNode = tag.map((tag) => {
      const isSelected = -1 != selectedTag.indexOf(tag);

      const handleOnClick =  (e) => => {
        e.preventDefault();

        return isSelected ? this._removeTag(tag) : this._addTag(tag);
      };

      const linkClasses = classnames({
        selected: isSelected,
      });

      const iconClasses = classnames({
        fa: true,
        'fa-check': isSelected,
      });

      const icon = (<i className={iconClasses}/>);

      return (
        <li key={tag}>
          <a className={`tag ${tag} ${linkClasses}`} onClick={handleOnClick} href="#">
            {icon}
          </a>
        </li>
      );
    });

    return (
      <ul>
        {tagNode}
      </ul>
    );
  }

  render () => {
    return (
      <PageClick onClick={this._close}>
        <div className="tags-selector">
          <header>Метки <a className="close" onClick={this._close} href="#"><Icon name="close" /></a></header>
          {this._renderTagList()}
        </div>
      </PageClick>
    );
  }
}

TagSelector.propTypes = {
};
