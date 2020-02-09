import React                  from 'react'
import { PropTypes }          from 'prop-types'
import { connect }        from 'react-redux'
import { Button, Divider, Container, Grid, Header, Icon, Image, Item, Label, Menu, Segment, Step, Table, } from 'semantic-ui-react'

import LeafletModal          from '../../components/leaflet/modal'
import Actions            from '../../redux/actions/current_leaflet'

class LeafletShowView extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props;

    dispatch(Actions.showLeaflet(this._getLeaflet(params.id[1])));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(Actions.reset());
  }

  _getLeaflet(id) {
    let leaflet = [];
    this.props.currentTree.branch.forEach((branch) => { leaflet = leaflet.concat(branch.leaflet); });

    return leaflet.find((c) => { return c.id === +id;  });
  }

  render() {
    const { channel, currentUser, dispatch, currentLeaflet, currentTree } = this.props;

    if (!currentLeaflet.Leaflet) return false;

    const { leaflet, edit, showMemberSelector, showTagSelector } = currentLeaflet;

    return (
      <LeafletModal
        treeId={currentTree.id}
        treeMember={currentTree.member}
        channel={channel}
        currentUser={currentUser}
        dispatch={dispatch}
        leaflet={leaflet}
        edit={edit}
        showMemberSelector={showMemberSelector}
        showTagSelector={showTagSelector} />
    );
  }
}

LeafletShowView.propTypes = {
};

const mapStateToProps = (state) => ({
  currentLeaflet: state.currentLeaflet,
  currentTree: state.currentTree,
  currentUser: state.session.currentUser,
  channel: state.currentTree.channel,
});

export default connect(mapStateToProps)(LeafletShowView);
