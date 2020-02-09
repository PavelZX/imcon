import * as types from '../constants/action_types'

const initialState = {
  openNewTalkModal: false,
  openJoinTalkModal: false
}

export default function session(state = initialState, action) {
  switch (action.type) {
  case types.OPEN_NEW_TALK_MODAL:
    return {
      ...state,
      openNewTalkModal: true
    }
    break
  case types.CLOSE_NEW_TALK_MODAL:
  case types.CREATE_TALK_SUCCESS:
    return {
      ...state,
      openNewTalkModal: false
    }
    break
  case types.OPEN_JOIN_TALK_MODAL:
    return {
      ...state,
      openJoinTalkModal: true
    }
    break
  case types.CLOSE_JOIN_TALK_MODAL:
  case types.JOIN_TALK_SUCCESS:
    return {
      ...state,
      openJoinTalkModal: false
    }
    break
  case types.OPEN_JOIN_DIRECT_TALK_MODAL:
    return {
      ...state,
      openJoinDirectTalkModal: true
    }
    break
  case types.CLOSE_JOIN_DIRECT_TALK_MODAL:
  case types.JOIN_DIRECT_TALK_SUCCESS:
    return {
      ...state,
      openJoinDirectTalkModal: false
    }
    break
  default:
    return state
  }
}
