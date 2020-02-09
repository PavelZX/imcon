import history from '../../utils/history'
import { camelizeKeys } from 'humps'
import _ from "lodash"

import * as types from '../constants/action_types'
import { API_CALL, POST, GET } from '../constants/api_types'
import { receivedMessage } from './messages'
import Schemas from '../../utils/schema'
import Actions from './session'

export function initTalk(talkData, dispatch, callback) {
  let talk = Actions.findTalk(talkData.id, callback)
  talk.off('new_message')
  talk.on('new_message', payload => {
    payload = camelizeKeys(payload)
    dispatch(receivedMessage(payload))
  })
}

let afterAddedTalk = function(talk, dispatch, callback) {
  initTalk(talk, dispatch, (data)=> {
    data = camelizeKeys(data)
    dispatch(updateTalk(talk.id, {unreadCount: data.unreadCount}))
    dispatch(addMessages(talk.id, data))
  })
}

export function createTalk(name) {
  return {
    type: types.CREATE_TALK,
    [API_CALL]: {
      path: '/talks',
      method: POST,
      data: {
        talk: {
          name: name
        }
      },
      schema: Schemas.talk,
      successCallback: function(response, store) {
        initTalk(response.entities.talks[response.result], store.dispatch, ()=> {
          history.push(`/talks/${name}`)
          // NOTE: now route change doesn't change props in componentWillReceiveProps of Talk
          // If it works, it's not necessary to call this here
          store.dispatch(changeTalk(name))
        })
      }
    }
  }
}

export function updateTalk(id, payload) {
  return {
    talkId: id,
    type: types.UPDATE_TALK,
    payload: payload
  }
}

export function fetchTalk(initDoneCallback = null) {
  if (!initDoneCallback) {
    initDoneCallback = (dispatch) => {
      console.log('INIT TALK DONE')
      dispatch(initTalkDone())
    }
  }
  let successCallback = function(response, store) {
    const {result, entities} = response
    _.forEach(result, (id, i) => {
      afterAddedTalk(entities.talks[id], store.dispatch, ()=> {
        if (result.length - 1 === i) {
          initDoneCallback(store.dispatch)
        }
      })
    })
  }
  return {
    type: types.FETCH_TALK,
    [API_CALL]: {
      path: '/talks',
      method: GET,
      schema: Schemas.talkArray,
      successCallback: successCallback
    }
  }
}

export function initTalkDone() {
  return {
    type: types.INIT_TALK_DONE
  }
}

export function fetchTalkIfNeeded() {
  return (dispatch, getState) => {
    if (!getState().talks.initTalkDone) {
      return dispatch(fetchTalk())
    }
  }
}

// Just after talk finished joining, messages will be sent back
export function addMessages(talkId, payload) {
  return {
    talkId: talkId,
    type: types.ADD_MESSAGE,
    payload: payload
  }
}

export function fetchMessages(talkId, ts) {
  return {
    talkId: talkId,
    type: types.FETCH_MESSAGE,
    [API_CALL]: {
      path: `/talks/${talkId}/messages`,
      method: GET,
      data: {ts: ts},
      schema: {messages: Schemas.messageArray}
    }
  }
}

export function changeTalk(talkName) {
  return {
    type: types.CHANGE_TALK,
    talkName
  }
}

export function changeNewMessage(talkId, text) {
  return {
    talkId,
    type: types.CHANGE_NEW_MESSAGE,
    text: text
  }
}

export function markMessageRead(talkId, message) {
  return {
    type: types.MARK_MESSAGE_READ,
    payload: {
      talkId
    },
    [API_CALL]: {
      path: `/talks/${talkId}/messages/read`,
      method: POST,
      data: {
        ts: message.ts
      }
    }
  }
}

export function joinTalk(talk) {
  return {
    type: types.JOIN_TALK,
    payload: {
      talkId: talk.id
    },
    [API_CALL]: {
      path: `/talk_user`,
      method: POST,
      data: {talkId: talk.id},
      successCallback: function(_response, store) {
        history.push(`/talks/${talk.name}`)
        store.dispatch(changeTalk(talk.name))
      }
    }
  }
}

export function addTalk(talk, dispatch) {
  if (talk.userId != Actions.currentUser('id')) {
    afterAddedTalk(talk, dispatch)
  }
  return {
    type: types.ADD_TALK,
    payload: {talk}
  }
}
