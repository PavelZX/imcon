import Constants  from '../constants'

const Actions = {
  showForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_TREE_SHOW_FORM,
        show: show,
      })
    }
  },

  connectToChannel: (socket, treeId) => {
    return dispatch => {
      const channel = socket.channel(`tree:${treeId}`)

      dispatch({ type: Constants.CURRENT_TREE_FETCHING })

      channel.join().receive('ok', (response) => {
        dispatch({
          type: Constants.TREE_SET_CURRENT,
          tree: response.tree,
        })
      })

      channel.on('user:joined', (msg) => {
        dispatch({
          type: Constants.CURRENT_TREE_CONNECTED_USER,
          user: msg.user,
        })
      })

      channel.on('user:left', (msg) => {
        dispatch({
          type: Constants.CURRENT_TREE_CONNECTED_USER,
          user: msg.user,
        })
      })

      channel.on('branch:created', (msg) => {
        dispatch({
          type: Constants.CURRENT_TREE_BRANCH_CREATED,
          branch: msg.branch,
        })
      })

      channel.on('leaflet:created', (msg) => {
        dispatch({
          type: Constants.CURRENT_TREE_LEAFLET_CREATED,
          leaflet: msg.leaflet,
        })
      })

      channel.on('member:added', (msg) => {
        dispatch({
          type: Constants.CURRENT_TREE_MEMBER_ADDED,
          user: msg.user,
        })
      })

      channel.on('leaflet:updated', (msg) => {
        dispatch({
          type: Constants.TREE_SET_CURRENT,
          tree: msg.tree,
        })

        dispatch({
          type: Constants.CURRENT_LEAFLET_SET,
          leaflet: msg.leaflet,
        })
      })

      channel.on('branch:updated', (msg) => {
        dispatch({
          type: Constants.TREE_SET_CURRENT,
          tree: msg.tree,
        })
      })

      channel.on('comment:created', (msg) => {
        dispatch({
          type: Constants.TREE_SET_CURRENT,
          tree: msg.tree,
        })

        dispatch({
          type: Constants.CURRENT_LEAFLET_SET,
          leaflet: msg.leaflet,
        })
      })

      dispatch({
        type: Constants.CURRENT_TREE_CONNECTED_TO_CHANNEL,
        channel: channel,
      })
    }
  },

  leaveChannel: (channel) => {
    return dispatch => {
      channel.leave()

      dispatch({
        type: Constants.CURRENT_TREE_RESET,
      })
    }
  },

  addNewMember: (channel, email) => {
    return dispatch => {
      channel.push('member:add', { email: email })
      .receive('error', (data) => {
        dispatch({
          type: Constants.CURRENT_TREE_ADD_MEMBER_ERROR,
          error: data.error,
        })
      })
    }
  },

  updateLeaflet: (channel, leaflet) => {
    return dispatch => {
      channel.push('leaflet:update', { leaflet: leaflet })
    }
  },

  updateBranch: (channel, branch) => {
    return dispatch => {
      channel.push('branch:update', { branch: branch })
    }
  },

  showMemberForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_TREE_SHOW_MEMBER_FORM,
        show: show,
      })
    }
  },

  editBranch: (branchId) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_TREE_EDIT_BRANCH,
        branchId: branchId,
      })
    }
  },

  showLeafletForm: (branchId) => {
    return dispatch => {
      dispatch({
        type: Constants.CURRENT_TREE_SHOW_LEAFLET_FORM_FOR_BRANCH,
        branchId: branchId,
      })
    }
  },
}

export default Actions
