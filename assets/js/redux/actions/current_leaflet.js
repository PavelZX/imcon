import Constants  from '../constants'
import {httpGet} from '../../utils'

const Actions = {
  showLeaflet: (leaflet) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_LEAFLET_SET,
        leaflet: leaflet
      })
    }
  },

  editLeaflet: (edit) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_LEAFLET_EDIT,
        edit: edit,
      })
    }
  },

  createLeafletComment: (channel, comment) => {
    return dispatch => {
      channel.push('leaflet:add_comment', comment)
    }
  },

  reset: (channel, comment) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_LEAFLET_RESET,
      })
    }
  },

  showMemberSelector: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_LEAFLET_SHOW_MEMBER_SELECTOR,
        show: show,
      })
    }
  },

  showTagSelector: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_LEAFLET_SHOW_TAG_SELECTOR,
        show: show,
      })
    }
  },

  addMember: (channel, leafletId, userId) => {
    return dispatch => {
      channel.push('leaflet:add_member', { leaflet_id: leafletId, user_id: userId })
    }
  },

  removeMember: (channel, leafletId, userId) => {
    return dispatch => {
      channel.push('leaflet:remove_member', { leaflet_id: leafletId, user_id: userId })
    }
  },

  updateTag: (channel, leafletId, tag) => {
    return dispatch => {
      channel.push('leaflet:update', { leaflet: { id: leafletId, tag: tag } })
    }
  },
}

export default Actions
