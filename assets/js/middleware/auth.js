import { API_CALL } from '../redux/constants/api_types'

export default store => next => action => {
  const apiCall = action[API_CALL]
  if (typeof apiCall === 'undefined') {
    return next(action)
  }

  if (apiCall.skipAuth) {
    next(action)
  } else {
    let header = 'Bearer ' + localStorage.phoenixAuthToken
    let newApiCall = {
      ...apiCall,
      headers: {
        ...apiCall.headers,
        Authorization: header
      }
    }
    action[API_CALL] = newApiCall
    next(action)
  }
}
