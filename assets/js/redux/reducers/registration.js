import Constants from '../constants'

const initialState = {
  error: null,
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.REGISTRATION_ERROR:
      return { ...state, error: action.error }

    default:
      return state
  }
}
