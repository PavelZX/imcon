import * as types from '../constants/action_types'

const initialState = {
  initDirectTalkDone: false
}

export default function directTalk(state = initialState, action) {
  switch (action.type) {
    case types.INIT_DIRECT_TALK_DONE:
      return {
        ...state,
        initDirectTalkDone: true
      }
      break
    default:
      return state
  }
}
