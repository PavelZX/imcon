import Constants  from '../constants'

const initialState = {
  showTree: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.CAP_SHOW_TREE:
      return { ...state, showTree: action.show }

    default:
      return state
  }
}
