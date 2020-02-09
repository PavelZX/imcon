import * as types from '../constants/action_types'
import { RT_EVENT } from '../constants/api_types'

export function postMessage(talkId, text) {
  return {
    type: types.POST_MESSAGE,
    payload: {
      talkId: talkId
    },
    [RT_EVENT]: {
      talkId: talkId,
      // TODO: change new_message to const
      event: 'new_message',
      payload: {
        text: text
      }
    }
  }
}

export function receivedMessage(payload) {
  return {
    type: types.RECEIVED_MESSAGE,
    payload
  }
}
