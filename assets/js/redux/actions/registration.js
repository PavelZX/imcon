import { push }   from 'react-router-redux'
import Constants          from '../constants'
import { httpPost }       from '../../utils'
import {setCurrentUser}   from './session'

const Actions = {};

Actions.signUp = (data) => {
  return dispatch => {
    httpPost('/api/v1/registration', { user: data })
    .then((data) => {
      localStorage.setItem('phoenixAuthToken', data.jwt)

      setCurrentUser(dispatch, data.user)

      dispatch(push('/'))
    })
    .catch((error) => {
      error.response.json()
      .then((errorJSON) => {
        dispatch({
          type: Constants.REGISTRATION_ERROR,
          error: errorJSON.error,
        })
      })
    })
  }
}

export default Actions
