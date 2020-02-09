import * as types from '../constants/action_types'
import Constants              from '../constants'

const initialState = {}

export default function errors(state = initialState, action) {
  switch (action.type) {
  case types.FETCHING_FAILURE:
    return {
      ...state,
      [action.actualType]: action.error
    }
    break
  case types.FETCHING_SUCCESS:
    if (state[action.actualType]) {
      return {
        ...state,
        [action.actualType]: null
      }
    } else {
      return state
    }
    break
  case Constants.CURRENT_USER:
  case Constants.USER_SIGNED_OUT:
    return {
      ...state,
      [Constants.CURRENT_USER]: null,
      [Constants.USER_SIGNED_OUT]: null
    }
    break
  default:
    return state
  }
}
