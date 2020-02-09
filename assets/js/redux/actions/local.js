import * as types from '../constants/action_types'

export function openNewTalkModal() {
  return {
    type: types.OPEN_NEW_TALK_MODAL
  }
}

export function closeNewTalkModal() {
  return {
    type: types.CLOSE_NEW_TALK_MODAL
  }
}

export function openJoinTalkModal() {
  return {
    type: types.OPEN_JOIN_TALK_MODAL
  }
}

export function closeJoinTalkModal() {
  return {
    type: types.CLOSE_JOIN_TALK_MODAL
  }
}

export function openJoinDirectTalkModal() {
  return {
    type: types.OPEN_JOIN_DIRECT_TALK_MODAL
  }
}

export function closeJoinDirectTalkModal() {
  return {
    type: types.CLOSE_JOIN_DIRECT_TALK_MODAL
  }
}
