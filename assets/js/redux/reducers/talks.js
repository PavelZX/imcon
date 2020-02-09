import * as types from '../constants/action_types'
import _ from 'lodash'

const initialState = {
  // 0: talk0, 1: talk1, ...
  items: {},
  // [1, 2, 3, ...]
  // The ids of talks current user is in
  ids: [],
  allIds: [],
  directIds: [],
  // { 1: [1, 2, 3]}
  msgIdsById: {},
  // {1: true, 2: false, ...}
  hasMore: {},
  initTalkDone: false,
  // {abc: 1, ...}
  talkIdByName: {},
  currentTalkId: null,
  // {1: "New msg"}
  newMessage: {},
  // {1: [1, 2, 3]}
  unreadMsgsCounts: {}
}

function getNewUnreadCount(state, talkId) {
  const {currentTalkId, unreadMsgsCounts} = state
  var currentCount = unreadMsgsCounts[talkId]
  return (currentCount || 0) + 1
}

function getTalkIdByName(talks) {
  return _.transform(talks, (result, talk, id) => {
    result[talk.name] = talk.id
  })
}

// TODO: If usernames of user change, this will not work
function getDirectTalkIdByName(talks, user) {
  return _.transform(talks, (result, talk, id) => {
    result[user[talk.userId].username] = talk.id
  })
}

export default function talks(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TALK_BEGIN:
      return {
        ...state,
        isFetching: true
      }
      break
    case types.FETCH_TALK_SUCCESS:
      var talks = action.response.entities.talks
      var joinedIds = _.chain(talks).values().filter((ch)=> ch.joined).map('id').value()
      return {
        ...state,
        allIds: action.response.result,
        ids: joinedIds,
        items: {
          ...state.items,
          ...talks
        },
        isFetching: false,
        talkIdByName: {
          ...state.talkIdByName,
          ...getTalkIdByName(talks)
        }
      }
      break
    case types.FETCH_DIRECT_TALK_SUCCESS:
      var talks = action.response.entities.talks
      var joinedIds = _.chain(talks).values().filter((ch)=> ch.joined).map('id').value()
      return {
        ...state,
        allDirectIds: action.response.result,
        directIds: joinedIds,
        items: {
          ...state.items,
          ...talks
        },
        talkIdByName: {
          ...state.talkIdByName,
          ...getDirectTalkIdByName(action.response.entities.talks, action.payload.user)
        }
      }
      break
    case types.UPDATE_TALK:
      return {
        ...state,
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [action.talkId]: action.payload.unreadCount
        }
      }
    case types.INIT_TALK_DONE:
      return {
        ...state,
        initTalkDone: true
      }
      break
    case types.RECEIVED_MESSAGE:
      var payload = action.payload
      var ts = payload.ts
      var talkId = payload.talkId
      var msgIds = state.msgIdsById[talkId] || []
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [talkId]: [...msgIds, ts]
        },
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [talkId]: getNewUnreadCount(state, talkId)
        }
      }
      break
    case types.ADD_MESSAGE:
      var msgIds = action.payload.message.map(m => m.ts)
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.talkId]: [...msgIds]
        },
        hasMore: {
          ...state.hasMore,
          [action.talkId]: action.payload.hasMore
        }
      }
    case types.FETCH_MESSAGE_SUCCESS:
      var msgIds = action.response.result.message
      return {
        ...state,
        msgIdsById: {
          ...state.msgIdsById,
          [action.talkId]: [...msgIds]
        },
        hasMore: {
          ...state.hasMore,
          [action.talkId]: action.response.hasMore
        }
      }
      break
    case types.CREATE_TALK_SUCCESS:
      var talks = action.response.entities.talks
      return {
        ...state,
        items: {
          ...state.items,
          ...talks
        },
        allIds: [
          ...state.allIds,
          action.response.result
        ],
        ids: [
          ...state.ids,
          action.response.result
        ],
        talkIdByName: {
          ...state.talkIdByName,
          ...getTalkIdByName(talks)
        }
      }
      break
    case types.CHANGE_TALK:
      const {talkIdByName, unreadMsgsCounts} = state
      var currentTalkId = talkIdByName[action.talkName]
      return {
        ...state,
        currentTalkId: currentTalkId
      }
      break
    case types.CHANGE_NEW_MESSAGE:
      return {
        ...state,
        newMessage: {
          ...state.newMessage,
          [action.talkId]: action.text
        }
      }
      break
    case types.POST_MESSAGE_SUCCESS:
      return {
        ...state,
        newMessage: {
          ...state.newMessage,
          [action.payload.talkId]: ''
        }
      }
      break
    case types.MARK_MESSAGE_READ_SUCCESS:
      return {
        ...state,
        unreadMsgsCounts: {
          ...state.unreadMsgsCounts,
          [action.payload.talkId]: null
        }
      }
      break
    case types.JOIN_TALK_SUCCESS:
      return {
        ...state,
        ids: [
          ...state.ids,
          action.payload.talkId
        ]
      }
      break
    case types.JOIN_DIRECT_TALK_SUCCESS:
      var talk = action.response
      var talks = {[talk.id]: talk}
      return {
        ...state,
        allDirectIds: _.union(state.allDirectIds, [talk.id]),
        directIds: [
          ...state.directIds,
          talk.id
        ],
        items: {
          ...state.items,
          ...talks
        },
        talkIdByName: {
          ...state.talkIdByName,
          ...getDirectTalkIdByName(talks, action.payload.user)
        }
      }
      break
    case types.ADD_DIRECT_TALK:
      var talk = action.payload.talk
      var talks = {[talk.id]: talk}
      return {
        ...state,
        allDirectIds: _.union(state.allDirectIds, [talk.id]),
        items: {
          ...state.items,
          ...talks
        },
        talkIdByName: {
          ...state.talkIdByName,
          ...getDirectTalkIdByName(talks, action.payload.user)
        }
      }
    case types.OPEN_DIRECT_TALK:
      return {
        ...state,
        directIds: _.union(state.directIds, [action.payload.talkId])
      }
    case types.ADD_TALK:
      var talk = action.payload.talk
      var joinedIds = talk.joined ? [talk.id] : []
      var talks = {[talk.id]: talk}
      return {
        ...state,
        allIds: _.union(state.allIds, [talk.id]),
        ids: _.union(state.ids, joinedIds),
        items: {
          ...state.items,
          ...talks
        },
        talkIdByName: {
          ...state.talkIdByName,
          ...getTalkIdByName(talks)
        }
      }
      break
    default:
      return state
  }
}
