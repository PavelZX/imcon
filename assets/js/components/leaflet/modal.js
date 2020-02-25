import React              from 'react'
import { PropTypes }      from 'prop-types'
import ReactGravatar      from 'react-gravatar'
import PageClick          from 'react-page-click'
import moment             from 'moment'
import { push }           from 'react-router-redux'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import Actions            from '../../redux/actions/current_leaflet'
import TreeActions       from '../../redux/actions/current_tree'
import MemberSelector    from './member_selector'
import TagSelector       from './tag_selector'

export default class LeafletModal extends React.Component {
  componentDidUpdate () {
    const { edit } = this.props;

    if (edit) this.refs.name.focus();
  }

  _closeModal = (e) => {
    e.preventDefault();

    const { dispatch, treeId } = this.props;

    dispatch(push(`/tree/${treeId}`));
  }

  _renderCommentForm = () => {
    const { currentUser } = this.props;

    return (
      <div className="form-wrapper">
        <form onSubmit={this._handleCommentFormSubmit}>
          <header>
            <h4>Добавить заметку</h4>
          </header>
          <div className="gravatar-wrapper">
            <ReactGravatar className="react-gravatar" email={currentUser.email} https />
          </div>
          <div className="form-controls">
            <textarea
              ref="commentText"
              rows="5"
              placeholder="Написать заметку..."
              required="true"/>
            <Button type="submit">Сохранить заметку</Button>
          </div>
        </form>
      </div>
    );
  }

  _handleCommentFormSubmit = (e) => {
    e.preventDefault();

    const { id } = this.props.leaflet;
    const { channel, dispatch } = this.props;
    const { commentText } = this.refs;

    const comment = {
      leaflet_id: id,
      text: commentText.value.trim(),
    };

    dispatch(Actions.createLeafletComment(channel, comment));

    commentText.value = '';
  }

  _renderComment(leaflet) {
    if (leaflet.comment.length == 0) return false;

    const comment = leaflet.comment.map((comment) => {
      const { user } = comment;

      return (
        <div key={comment.id} className="comment">
          <div className="gravatar-wrapper">
            <ReactGravatar className="react-gravatar" email={user.email} https />
          </div>
          <div className="info-wrapper">
            <h5>{user.first_name}</h5>
            <div className="text">
              {comment.text}
            </div>
            <small>{moment(comment.inserted_at).fromNow()}</small>
          </div>
        </div>
      );
    });

    return (
      <div className="comments-wrapper">
        <h4>Заметки</h4>
        {comment}
      </div>
    );
  }

  _handleHeaderClick = (e) => {
    e.preventDefault();

    const { dispatch } = this.props;
    dispatch(Actions.editLeaflet(true));
  }

  _handleCancelClick = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(Actions.editLeaflet(false));
  }

  _handleFormSubmit = (e) => {
    e.preventDefault();

    const { name, description } = this.refs;

    const { leaflet } = this.props;

    leaflet.name = name.value.trim();
    leaflet.description = description.value.trim();

    const { channel, dispatch } = this.props;

    dispatch(TreeActions.updateLeaflet(channel, leaflet));
  }

  _renderHeader = () => {
    const { leaflet, edit } = this.props;

    if (edit) {
      return (
        <header className="editing">
          <form onSubmit={this._handleFormSubmit}>
            <input
              ref="name"
              type="text"
              placeholder="Title"
              required="true"
              defaultValue={leaflet.name} />
            <textarea
              ref="description"
              type="text"
              placeholder="Описание карточки"
              rows="5"
              defaultValue={leaflet.description} />
            <Button type="submit">Записать листок</Button> или <a href="#" onClick={this._handleCancelClick}>отмена</a>
          </form>
        </header>
      );
    } else {
      return (
        <header>
          <h3>{leaflet.name}</h3>
          <div className="items-wrapper">
            {this._renderMember()}
            {this._renderTags()}
          </div>
          <h5>Описание</h5>
          <p>{leaflet.description}</p>
          <a href="#" onClick={this._handleHeaderClick}>изменить</a>
        </header>
      );
    }
  }

  _renderMember = () => {
    const { member } = this.props.leaflet;

    if (member.length == 0) return false;

    const memberNode = member.map((member) => {
      return <ReactGravatar className="react-gravatar" key={member.id} email={member.email} https />;
    });

    return (
      <div className="card-members">
      <h5>Участники</h5>
        {memberNode}
      </div>
    );
  }

  _renderTags = () => {
    const { tag } = this.props.leaflet;

    if (tag.length == 0) return false;

    const tagNode = tag.map((tag) => {
      return <div key={tag} className={`tag ${tag}`}></div>;
    });

    return (
      <div className="card-tags">
      <h5>Метки</h5>
        {tagNode}
      </div>
    );
  }

  _handleShowMemberClick = (e) => {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(Actions.showMemberSelector(true));
  }

  _handleShowTagsClick = (e) => {
    e.preventDefault();

    const { dispatch } = this.props;

    dispatch(Actions.showTagsSelector(true));
  }

  _renderMemberSelector = () => {
    const { leaflet, treeMember, showMemberSelector, dispatch, channel } = this.props;
    const { member } = leaflet;

    if (!showMemberSelector) return false;

    return (
      <MemberSelector
        channel={channel}
        leafletId={leaflet.id}
        dispatch={dispatch}
        treeMember={treeMember}
        selectedMember={member}
        close={this._onMemberSelectorClose} />
    );
  }

  _onMemberSelectorClose =() => {
    const { dispatch } = this.props;

    dispatch(Actions.showMemberSelector(false));
  }

  _renderTagSelector = () => {
    const { leaflet, showTagSelector, dispatch, channel } = this.props;
    const { tag } = leaflet;

    if (!showTagSelector) return false;

    return (
      <TagSelector
        channel={channel}
        leafletId={leaflet.id}
        dispatch={dispatch}
        selectedTag={tag}
        close={this._onTagSelectorClose} />
    );
  }

  _onTagSelectorClose = () => {
    const { dispatch } = this.props;

    dispatch(Actions.showTagSelector(false));
  }

  render () {
    const { leaflet, treeMember, showMemberSelector } = this.props;
    const { member } = leaflet;

    return (
      <div className="md-overlay">
        <div className="md-modal">
          <PageClick onClick={this._closeModal}>
            <div className="md-content card-modal">
              <a className="close" href="#" onClick={this._closeModal}>
                <Icon name="close" />
              </a>
              <div className="info">
                {this._renderHeader()}
                {this._renderCommentForm()}
                {this._renderComment(leaflet)}
              </div>
              <div className="options">
                <h4>Добавить</h4>
                <a className="button" href="#" onClick={this._handleShowMemberClick}>
                  <Icon name="users"/> Участники
                </a>
                {this._renderMemberSelector()}
                <a className="button" href="#" onClick={this._handleShowTagClick}>
                  <Icon name="tags"/> Метки
                </a>
                {this._renderTagSelector()}
              </div>
            </div>
          </PageClick>
        </div>
      </div>
    );
  }
}

LeafletModal.propTypes = {
};
