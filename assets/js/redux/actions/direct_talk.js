import history from '../../utils/history'
import { decamelizeKeys } from 'humps'

import * as types from '../constants/action_types'
import { API_CALL, POST, GET, PUT, DELETE } from '../constants/api_types'
import Schemas from '../../utils/schema'
import {fetchTalk, initTalk, changeTalk} from './talks'

export function fetchDirectTalk(user) {
  let result = fetchTalk((dispatch)=> {
    console.log('INIT DIRECT TALK DONE')
    dispatch(initDirectTalkDone())
  })
  return {
    ...result,
    type: types.FETCH_DIRECT_TALK,
    payload: {
      user
    },
    [API_CALL]: {
      ...result[API_CALL],
      path: '/direct_talk'
    }
  }
}

export function joinDirectTalk(userId, user) {
  return {
    type: types.JOIN_DIRECT_TALK,
    [API_CALL]: {
      path: '/direct_talk/join',
      method: POST,
      data: decamelizeKeys({
        userId: userId
      }),
      successCallback: function(talk, store) {
        let talkName = user[talk.userId].username
        initTalk(talk, store.dispatch, ()=> {
          history.push(`/talk/@${talkName}`)
          store.dispatch(changeTalk(talkName))
        })
      }
    },
    payload: {
      user
    }
  }
}

export function addDirectTalk(talk, user, dispatch) {
  let talkName = user[talk.userId].username
  initTalk(talk, dispatch)
  return {
    type: types.ADD_DIRECT_TALK,
    payload: {talk, user}
  }
}

export function openDirectTalk({talkId}) {
  return {
    type: types.OPEN_DIRECT_TALK,
    payload: {talkId}
  }
}

export function initDirectTalkDone() {
  return {
    type: types.INIT_DIRECT_TALK_DONE
  }
}
