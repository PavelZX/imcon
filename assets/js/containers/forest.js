import React, { Component }    from 'react'
import { PropTypes }           from 'prop-types'
import { connect }             from 'react-redux'
import { Image, Menu, Container, Grid, Segment, Dropdown, Icon, Label } from 'semantic-ui-react'

import Sidebar                 from '../components/sidebar/sidebar'
import Overlay                 from '../components/overlay/index'

import {fetchTalkIfNeeded} from '../redux/actions/talks'
import {fetchDirectTalk}   from '../redux/actions/direct_talk'
import {fetchUser}         from '../redux/actions/user'
import EventSocket         from '../chat_socket/event_socket'

import TreeActions         from '../redux/actions/tree'
import Cap                 from '../components/cap'
import HomeView            from './home'

class Forest extends Component {
  componentDidMount () {
    const {dispatch, user} = this.props

    dispatch(fetchUser((response, store)=> {
      store.dispatch(TreeActions.fetchTree(response.entities.user))
      store.dispatch(fetchDirectTalk(response.entities.user))
      EventSocket.initEventTalk(dispatch, {user: response.entities.user})
    }))
    dispatch(fetchTalkIfNeeded())
  }
  render() {
    const {currentUser, dispatch, tree, socket, currentTree, talks, local, error, directTalk, user} = this.props

    return (
      <div id="main_container">
        <Cap />
        <Grid divided='vertically'>
          <Grid.Row>
            <Grid.Column>
              <HomeView />
            </Grid.Column>
            <Grid.Column>
              { this.props.children || 'Приветствую в нашем лесу!' }
            </Grid.Column>
          </Grid.Row>
      
          <Grid.Row>
            <Grid.Column>
              <Overlay {...{local, talks, dispatch, error, user} }></Overlay>
            </Grid.Column>
            <Grid.Column>
              <Sidebar dispatch={dispatch} talks={talks} directTalk={directTalk} user={user}/>  
            </Grid.Column>
            <Grid.Column>
              {  || 'Welcome to ExChat! A Slack-like app by Elixir, Phoenix & React(redux)' }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
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