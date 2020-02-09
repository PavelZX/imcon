import Constants  from '../constants'

const initialState = {
  LEAFLET: null,
  edit: false,
  error: null,
  fetching: true,
  showMemberSelector: false,
  showTagSelector: false,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.CURRENT_LEAFLET_FETHING:
      return { ...state, fetching: true }

    case Constants.CURRENT_LEAFLET_RESET:
      return initialState;

    case Constants.CURRENT_LEAFLET_SET:
      const { actionLeaflet } = action
      const { leaflet } = state

      let edit = false;

      if (edit) {
        edit = !(actionLeaflet.id == leaflet.id)
      }

      return { ...state, leaflet: action.leaflet, edit: edit }

    case Constants.CURRENT_LEAFLET_EDIT:
      return { ...state, edit: action.edit }

    case Constants.CURRENT_LEAFLET_SHOW_MEMBER_SELECTOR:
      return { ...state, showMemberSelector: action.show }

    case Constants.CURRENT_LEAFLET_SHOW_TAG_SELECTOR:
      return { ...state, showTagSelector: action.show }

    default:
      return state
  }
}
