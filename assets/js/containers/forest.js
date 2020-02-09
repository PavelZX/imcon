import React, { Component }    from 'react'
import { PropTypes }           from 'prop-types'
import { connect }             from 'react-redux'
import { Image, Menu, Container, Grid, Segment, Dropdown, Icon, Label } from 'semantic-ui-react'

import Sidebar                 from '../components/sidebar/sidebar'
import Overlay                 from '../components/overlay/index'

import {fetchTalkIfNeeded} from '../redux/actions/talks'
import {fetchDirectTalk}   from '../redux/actions/direct_talk'
import {fetchUser}             from '../redux/actions/user'
import EventSocket             from '../chat_socket/event_socket'

import TreeActions             from '../redux/actions/tree'
import Cap                     from '../components/cap'


class Forest extends Component {
  componentDidMount () {
    const { dispatch, user } = this.props

    dispatch(TreeActions.fetchTree())
    dispatch(fetchUser((response, store)=> {
      store.dispatch(fetchDirectTalk(response.entities.user))
      EventSocket.initEventTalk(dispatch, {user: response.entities.user})
    }))
    dispatch(fetchTalkIfNeeded())
  }
  render() {
    const {currentUser, dispatch, tree, socket, currentTree, talks, local, error, directTalk, user} = this.props

    return (
      <Container>
        <Cap  />
        <Segment.Group>
          <Segment>
            <div className='main-container'>
              { this.props.children || 'Приветствую в нашем лесу!' }
            </div>
          </Segment>
          <Segment><Sidebar dispatch={dispatch} talks={talks} directTalk={directTalk} user={user}/></Segment>
          <Segment><Overlay {...{local, talks, dispatch, error, user} }></Overlay></Segment>
        </Segment.Group>
        
      </Container>
    )
  }
}

Forest.propTypes = {
  talks: PropTypes.object,
  children: PropTypes.node,
  local: PropTypes.object
}

function mapStateToProps(state) {
  return {
    currentUser: state.session.currentUser,
    socket: state.session.socket,
    channel: state.session.channel,
    tree: state.tree,
    currentTree: state.currentTree,
    talks: state.talks,
    directTalk: state.directTalk,
    local: state.local,
    error: state.error,
    user: state.user
  }
}

export default connect(
  mapStateToProps
)(Forest)