import Constants from '../constants'

const initialState = {
  ownedTREE: [],
  invitedTREE: [],
  showForm: false,
  formErrors: null,
  ownedFetched: false,
  fetching: true,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.TREE_FETCHING:
      return { ...state, fetching: true }

    case Constants.TREE_RECEIVED:
      return { ...state, ownedTree: action.ownedTree, invitedTree: action.invitedTree, fetching: false }

    case Constants.TREE_SHOW_FORM:
      return { ...state, showForm: action.show }

    case Constants.TREE_CREATE_ERROR:
      return { ...state, formError: action.error }

    case Constants.TREE_RESET:
      return { ...state, showForm: false, formError: null, ownedFetched: false, fetching: false, }

    case Constants.TREE_FULL_RESET:
      return initialState

    case Constants.TREE_ADDED:
      const { invitedTree } = state

      return { ...state, invitedTree: [action.tree].concat(invitedTree) }

    case Constants.TREE_NEW_CREATED:
      const { ownedTree } = state

      return { ...state, ownedTree: [action.tree].concat(ownedTree) }

    default:
      return state
  }
}
