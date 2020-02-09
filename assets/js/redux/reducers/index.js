import { combineReducers }  from 'redux'
import { routerReducer }    from 'react-router-redux'
import session              from './session'
import registration         from './registration'
import tree                 from './tree'
import currentTree          from './current_tree'
import currentLeaflet       from './current_leaflet'
import cap                  from './cap'
import messages             from './messages'
import talks                from './talks'
import local                from './local'
import error                from './error'
import directTalk           from './direct_talk'
import user                 from './user'

const rootReducer = combineReducers({
  routing: routerReducer,
  session: session,
  registration: registration,
  cap: cap,
  tree: tree,
  currentTree: currentTree,
  currentLeaflet: currentLeaflet,
  messages: messages,
  talks: talks,
  directTalk: directTalk,
  user: user,
  local: local,
  error: error
})

export default rootReducer
