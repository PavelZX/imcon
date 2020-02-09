import { push }               from 'react-router-redux'

import Constants              from '../constants'
import { httpGet, httpPost }  from '../../utils'
import CurrentTreeActions    from './current_tree'

const Actions = {
  showTree: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.CAP_SHOW_TREE,
        show: show,
      })
    }
  },

  visitTree: (socket, channel, treeId) => {
    return dispatch => {
      if (channel) {
        dispatch(CurrentTreeActions.leaveChannel(channel))
        dispatch(CurrentTreeActions.connectToChannel(socket, treeId))
      }

      dispatch(push(`/tree/${treeId}`))

      dispatch({
        type: Constants.LEAFLET_SHOW_TREE,
        show: false,
      })
    }
  },
}

export default Actions
