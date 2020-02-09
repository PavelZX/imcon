import React              from 'react'
import { PropTypes }      from 'prop-types'
import PageClick          from 'react-page-click'
import ReactGravatar      from 'react-gravatar'
import classnames         from 'classnames'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import Actions            from '../../redux/actions/current_leaflet'

export default class MemberSelector extends React.Component {
  _close(e) {
    e.preventDefault();

    this.props.close();
  }

  _removeMember(memberId) {
    const { dispatch, channel, leafletId } = this.props;

    dispatch(Actions.removeMember(channel, leafletId, memberId));
  }

  _addMember(memberId) {
    const { dispatch, channel, leafletId } = this.props;

    dispatch(Actions.addMember(channel, leafletId, memberId));
  }

  _renderMemberList() {
    const { boardMember, selectedMember } = this.props;

    const member = boardMember.map((member) => {
      const isMember = -1 != selectedMember.findIndex((selectedMember) => { return selectedMember.id == member.id; });

      const handleOnClick = (e) => {
        e.preventDefault();

        return isMember ? this._removeMember(member.id) : this._addMember(member.id);
      };

      const iconClasses = classnames({
        fa: true,
        'fa-check': isMember,
      });

      const icon = (<i className={iconClasses}/>);

      return (
        <li key={member.id}>
          <a onClick={handleOnClick} href="#">
            <ReactGravatar className="react-gravatar" email={member.email} https />
            {`${member.first_name} ${member.last_name}`} {icon}
          </a>
        </li>
      );
    });

    return (
      <ul>
        {member}
      </ul>
    );
  }

  render() {
    return (
      <PageClick onClick={::this._close}>
        <div className="members-selector">
          <header>Участники <a className="close" onClick={::this._close} href="#"><Icon name="close" /></a></header>
          {::this._renderMemberList()}
        </div>
      </PageClick>
    );
  }
}

MemberSelector.propTypes = {
};
