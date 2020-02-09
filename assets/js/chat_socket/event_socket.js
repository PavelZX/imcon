import { Presence } from 'phoenix'
import { camelizeKeys } from 'humps'

import { syncPresences, addUser } from '../redux/actions/user'
import Actions from '../redux/actions/session'
import { addDirectTalk, openDirectTalk } from '../redux/actions/direct_talk'
import { addTalk } from '../redux/actions/talks'

const EventSocket = {
  initEventTalk(dispatch, options) {
    let talk = Actions.findTalk('general', null, 'event')
    EventSocket.initGlobalCallbacks(talk, dispatch)
    let userTalk = Actions.findTalk(`general:${Actions.currentUser('userId')}`, null, 'event')
    EventSocket.initUserCallbacks(userTalk, dispatch, options)
  },

  initGlobalCallbacks(talk, dispatch) {
    let presences = {}
    talk.on("presence_state", state => {
      Presence.syncState(presences, state)
      dispatch(syncPresences(presences))
    })
    talk.on("presence_diff", diff => {
      Presence.syncDiff(presences, diff)
      dispatch(syncPresences(presences))
    })
    talk.on("user_created", payload => {
      dispatch(addUser(payload))
    })
    talk.on("talk_created", payload => {
      dispatch(addTalk(payload, dispatch))
    })
  },

  initUserCallbacks(talk, dispatch, options) {
    talk.on("dm_created", payload => {
      dispatch(addDirectTalk(camelizeKeys(payload), options.user, dispatch))
    })
    talk.on("dm_open", payload => {
      dispatch(openDirectTalk(camelizeKeys(payload), options.user))
    })
  },

  handleEvent(event, data) {

  }
}

export default EventSocket
