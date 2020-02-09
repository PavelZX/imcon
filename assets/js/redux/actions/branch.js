import Constants from '../constants'

const Actions = {
  showForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.BRANCH_SHOW_FORM,
        show: show,
      })
    }
  },

  save: (channel, data) => {
    return dispatch => {
      const topic = data.id ? 'branch:update' : 'branch:create'

      channel.push(topic, { branch: data })
    }
  },

  createLeaflet: (channel, data) => {
    return dispatch => {
      channel.push('leaflet:create', { leaflet: data })
    }
  },
}

export default Actions
