import Constants              from '../constants'
import { push }               from 'react-router-redux'
import { httpGet, httpPost }  from '../../utils'
import CurrentTreeActions    from './current_tree'

const Actions = {
  fetchTree: () => {
    return dispatch => {
      dispatch({ type: Constants.TREE_FETCHING })

      httpGet('/api/v1/tree')
      .then((data) => {
        dispatch({
          type: Constants.TREE_RECEIVED,
          ownedTree: data.owned_tree,
          invitedTree: data.invited_tree,
        })
      })
    }
  },

  showForm: (show) => {
    return dispatch => {
      dispatch({
        type: Constants.TREE_SHOW_FORM,
        show: show,
      })
    }
  },

  create: (data) => {
    return dispatch => {
      httpPost('/api/v1/tree', { tree: data })
      .then((data) => {
        dispatch({
          type: Constants.TREE_NEW_CREATED,
          tree: data,
        })

        dispatch(push(`/tree/${data.id}`))
      })
      .catch((error) => {
        error.response.json()
        .then((json) => {
          dispatch({
            type: Constants.TREE_CREATE_ERROR,
            errors: json.errors,
          })
        })
      })
    }
  },

  reset: () => {
    return dispatch => {
      dispatch({
        type: Constants.TREE_RESET,
      })
    }
  },
}

export default Actions
