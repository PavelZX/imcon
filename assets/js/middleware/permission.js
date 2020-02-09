import { API_CALL } from '../redux/constants/api_types'
import Actions from '../redux/actions/session'

export default store => next => action => {
  next(action)

  if (action.response && action.response.status === 401) {
    store.dispatch(Actions.signOut())
  }
}
