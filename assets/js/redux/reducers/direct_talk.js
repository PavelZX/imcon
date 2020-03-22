import * as types from '../constants/action_types'

const initialState = {
  initDirectTalksDone: false
}

export default function directTalk(state = initialState, action) {
  switch (action.type) {
    case types.INIT_DIRECT_TALK_DONE:
      return {
        ...state,
        initDirectTalksDone: true
      }
      break
    default:
      return state
  }
}
