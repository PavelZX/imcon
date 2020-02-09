import Constants  from '../constants'

const initialState = {
  connectedUser: [],
  channel: null,
  showForm: false,
  showUserForm: false,
  editingBranchId: null,
  addingNewLeafletInBranchId: null,
  error: null,
  fetching: true,
}

export default function reducer(state = initialState, action) {
  let branch

  switch (action.type) {
    case Constants.CURRENT_TREE_FETCHING:
      return { ...state, fetching: true }

    case Constants.TREE_SET_CURRENT_TREE:
      return { ...state, editingBranchId: null, fetching: false, ...action.TREE }

    case Constants.CURRENT_TREE_CONNECTED_USER:
      return { ...state, connectedUser: action.user }

    case Constants.CURRENT_TREE_CONNECTED_TO_CHANNEL:
      return { ...state, channel: action.channel }

    case Constants.CURRENT_TREE_SHOW_FORM:
      return { ...state, showForm: action.show }

    case Constants.CURRENT_TREE_SHOW_MEMBER_FORM:
      return { ...state, showUserForm: action.show, error: false }

    case Constants.CURRENT_TREE_RESET:
      return initialState

    case Constants.CURRENT_TREE_BRANCH_CREATED:
      branch = state.branch
      branch.push(action.branch)

      return { ...state, branch: branch, showForm: false }

    case Constants.CURRENT_TREE_LEAFLET_CREATED:
      branch = state.branch
      const { leaflet } = action

      const branchIndex = branch.findIndex((branch) => { return branch.id == leaflet.branch_id; })
      branch[branchIndex].leaflet.push(leaflet)

      return { ...state, branch: branch }

    case Constants.CURRENT_TREE_MEMBER_ADDED:
      const { member } = state
      member.push(action.user)

      return { ...state, member: member, showUserForm: false }

    case Constants.CURRENT_TREE_ADD_MEMBER_ERROR:
      return { ...state, error: action.error }

    case Constants.CURRENT_TREE_EDIT_BRANCH:
      return { ...state, editingBranchId: action.branchId }

    case Constants.CURRENT_TREE_SHOW_LEAFLET_FORM_FOR_BRANCH:
      return { ...state, addingNewLeafletInBranchId: action.branchId }

    default:
      return state
  }
}
