import React                    from 'react'
import { PropTypes }            from 'prop-types'
import ReactGravatar            from 'react-gravatar'
//import {CSSTransition, TransitionGroup}       from 'react-transition-group'
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group'
import classnames               from 'classnames'
import PageClick                from 'react-page-click'
import { Transition, Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import Actions                  from '../../redux/actions/current_tree'

export default class TreeMember extends React.Component {
  _renderUser() {
    return this.props.member.map((member) => {
      const index = this.props.connectedUser.findIndex((cu) => {
        return cu === member.id;
      });

      const classes = classnames({ connected: index != -1 });

      return (
        <li className={classes} key={member.id}>
          <ReactGravatar className="react-gravatar" email={member.email} https="true"/>
        </li>
      );
    });
  }

  _renderAddNewUser() {
    if (!this.props.currentUserIsOwner) return false;

    return (
      <li>
        <Label as='a' onClick={::this._handleAddNewClick} href="#"><Icon name="plus"/></Label>
        {::this._renderForm()}
      </li>
    );
  }

  _renderForm() {
    if (!this.props.show) return false;

    return (
      <PageClick onClick={::this._handleCancelClick}>
        <ul className="drop-down active">
          <li>
            <form onSubmit={::this._handleSubmit}>
              <h4>Добавить участников</h4>
              {::this._renderError()}
              <input ref="email" type="email" required={true} placeholder="Почта участника"/>
              <Button type="submit">Новый участник</Button> или <a onClick={::this._handleCancelClick} href="#">отмена</a>
            </form>
          </li>
        </ul>
      </PageClick>
    );
  }

  _renderError() {
    const { error } = this.props;

    if (!error) return false;

    return (
      <div className="error">
        {error}
      </div>
    );
  }

  _handleAddNewClick(e) {
    e.preventDefault();

    this.props.dispatch(Actions.showMemberForm(true));
  }

  _handleCancelClick(e) {
    e.preventDefault();

    this.props.dispatch(Actions.showMemberForm(false));
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { email } = this.refs;
    const { dispatch, channel } = this.props;

    dispatch(Actions.addNewMember(channel, email.value));
  }

  render() {
    return (
      <ul className="Board-users">
        <ReactCSSTransitionGroup
          transitionName="avatar"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
            {::this._renderUser()}
            {::this._renderAddNewUser()}
        </ReactCSSTransitionGroup>
      </ul>
    );
  }
}

TreeMember.propTypes = {
};
